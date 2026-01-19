import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  ListTodo, 
  Database, 
  Briefcase, 
  Calendar, 
  CheckCircle2, 
  Send, 
  TrendingUp, 
  Users,
  Search,
  Filter,
  Eye,
  Edit,
  FileText,
  Loader2
} from 'lucide-react';
import { ViewId, StatCardProps } from '../types';
import { api } from '../services/api';

// Components from HTML design
const QuickActionCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 flex items-center gap-[18px] cursor-pointer hover:border-[#3B82F6] hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-0.5 transition-all duration-200">
    <div className="w-[52px] h-[52px] rounded-xl bg-[#EFF6FF] flex items-center justify-center text-[#3B82F6] shrink-0">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <div className="font-semibold text-[#1E293B] text-[1rem] mb-1.5">{title}</div>
      <div className="text-[0.85rem] text-[#94A3B8] leading-snug">{desc}</div>
    </div>
    <div className="text-[#3B82F6] shrink-0">→</div>
  </div>
);

const StatCard = ({ label, value, icon, colorClass, footerText, progress }: StatCardProps) => {
    const styles = {
        blue: { bg: 'bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE]', border: 'border-[#BFDBFE]', text: 'text-[#2563EB]', iconBg: 'bg-white', iconColor: 'text-[#3B82F6]' },
        orange: { bg: 'bg-gradient-to-br from-[#FFFBEB] to-[#FEF3C7]', border: 'border-[#FDE68A]', text: 'text-[#F97316]', iconBg: 'bg-white', iconColor: 'text-[#F97316]' },
        green: { bg: 'bg-gradient-to-br from-[#F0FFF4] to-[#E6FFFA]', border: 'border-[#C6F6D5]', text: 'text-[#059669]', iconBg: 'bg-white', iconColor: 'text-[#059669]' },
        purple: { bg: 'bg-gradient-to-br from-[#F5F3FF] to-[#EDE9FE]', border: 'border-[#DDD6FE]', text: 'text-[#7C3AED]', iconBg: 'bg-white', iconColor: 'text-[#A78BFA]' },
        cyan: { bg: 'bg-gradient-to-br from-[#ECFEFF] to-[#CFFAFE]', border: 'border-[#A5F3FC]', text: 'text-[#0891B2]', iconBg: 'bg-white', iconColor: 'text-[#06B6D4]' },
    };
  
  const style = styles[colorClass];

  return (
    <div className={`${style.bg} border ${style.border} rounded-2xl p-6 relative`}>
      <div className="flex justify-between items-start mb-1">
        <div className={`w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center ${style.iconColor}`}>
          {icon}
        </div>
        <div className={`text-[2.25rem] font-bold leading-none ${style.text}`}>{value}</div>
      </div>
      <div className={`text-[0.85rem] font-medium text-right mb-4 ${style.text}`}>{label}</div>
      
      {progress !== undefined ? (
        <div className="h-2.5 bg-white/60 rounded-full overflow-hidden mt-2">
          <div className={`h-full rounded-full transition-all duration-500 bg-current opacity-80`} style={{ width: `${progress}%` }}></div>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 text-[0.85rem] text-slate-500/80">
           {footerText}
        </div>
      )}
    </div>
  );
};

const ElevesStatsGrid = ({ type, count }: { type: 'danger' | 'success', count: number }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-7">
             {type === 'danger' ? (
                 <>
                    <StatCard label="Élèves à placer" value={count} icon={<Users size={24}/>} colorClass="purple" footerText="Urgent" />
                    <StatCard label="En cours de placement" value="0" icon={<Calendar size={24}/>} colorClass="orange" footerText="En cours" />
                    <StatCard label="CV à actualiser" value="0" icon={<FileText size={24}/>} colorClass="blue" footerText="À mettre à jour" />
                    <StatCard label="Entretiens programmés" value="0" icon={<CheckCircle2 size={24}/>} colorClass="green" footerText="Cette semaine" />
                 </>
             ) : (
                <>
                    <StatCard label="Élèves en alternance" value={count} icon={<Users size={24}/>} colorClass="green" footerText="Total" />
                    <StatCard label="CERFA validés" value="0" icon={<FileText size={24}/>} colorClass="green" footerText="100%" />
                    <StatCard label="CERFA en cours" value="0" icon={<Calendar size={24}/>} colorClass="orange" footerText="En cours" />
                    <StatCard label="Prises en charge" value="0" icon={<Briefcase size={24}/>} colorClass="blue" footerText="Confirmées" />
                </>
             )}
        </div>
    );
};

interface DashboardViewProps {
  activeSubView: ViewId;
}

const DashboardView: React.FC<DashboardViewProps> = ({ activeSubView }) => {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const data = await api.getAllCandidates();
            setCandidates(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };
    fetchData();
  }, []);

  // Filter helpers
  const isPlaced = (c: any) => {
      const ent = c.entreprise_d_accueil;
      return ent && ent !== 'Non' && ent !== 'En recherche' && ent !== 'En cours' && ent !== 'null';
  };

  const studentsToPlace = candidates.filter(c => !isPlaced(c));
  const studentsPlaced = candidates.filter(c => isPlaced(c));

  // Compute companies count (unique names)
  const uniqueCompanies = new Set(studentsPlaced.map(c => c.entreprise_d_accueil)).size;

  if (loading) {
      return (
          <div className="flex h-full items-center justify-center">
              <Loader2 className="animate-spin text-blue-500" size={48} />
          </div>
      )
  }

  if (activeSubView === 'commercial-placer') {
      return (
          <div className="animate-fade-in">
              {/* Hero */}
              <div className="bg-[#A78BFA] rounded-3xl p-8 md:p-10 mb-7 relative overflow-hidden border border-white/10">
                  <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
                      <div className="flex items-center gap-5">
                          <div className="w-[72px] h-[72px] rounded-2xl flex items-center justify-center bg-white/15 backdrop-blur-md border border-white/20 text-white">
                              <Users size={36} />
                          </div>
                          <div>
                              <h1 className="text-[1.75rem] font-extrabold text-white mb-1.5 tracking-tight">Élèves à placer</h1>
                              <p className="text-[0.95rem] text-white/70">Étudiants en recherche d'alternance ou suite à une rupture de contrat</p>
                          </div>
                      </div>
                      <div className="flex gap-3">
                        <button className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-[0.95rem] font-semibold bg-white text-[#1e1e2e] hover:shadow-lg hover:-translate-y-0.5 transition-all">
                            Ajouter un élève
                        </button>
                        <button className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-[0.95rem] font-semibold bg-white/15 text-white border border-white/30 backdrop-blur-md hover:bg-white/25 transition-all">
                            Exporter
                        </button>
                      </div>
                  </div>
              </div>

              <ElevesStatsGrid type="danger" count={studentsToPlace.length} />

              {/* Table Container */}
              <div className="bg-white border border-[#E2E8F0] rounded-[20px] overflow-hidden shadow-sm">
                  <div className="p-6 border-b border-[#E2E8F0] flex flex-wrap gap-4 justify-between">
                      <div className="flex gap-3">
                          <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={20} />
                            <input type="text" placeholder="Rechercher..." className="pl-12 pr-5 py-3.5 border-2 border-[#e2e8f0] rounded-xl text-[0.95rem] w-[320px] focus:outline-none focus:border-[#3B82F6]" />
                          </div>
                          <button className="p-3.5 border-2 border-[#e2e8f0] rounded-xl text-[#64748b] hover:bg-[#f8fafc]"><Filter size={20}/></button>
                      </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead className="bg-[#EDE9FE]">
                            <tr>
                                <th className="p-4 text-left text-[0.75rem] font-bold uppercase text-[#7C3AED] border-b-2 border-[#DDD6FE]">Nom</th>
                                <th className="p-4 text-left text-[0.75rem] font-bold uppercase text-[#7C3AED] border-b-2 border-[#DDD6FE]">Formation</th>
                                <th className="p-4 text-left text-[0.75rem] font-bold uppercase text-[#7C3AED] border-b-2 border-[#DDD6FE]">Statut</th>
                                <th className="p-4 text-left text-[0.75rem] font-bold uppercase text-[#7C3AED] border-b-2 border-[#DDD6FE]">Ville</th>
                                <th className="p-4 text-center text-[0.75rem] font-bold uppercase text-[#7C3AED] border-b-2 border-[#DDD6FE]">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {studentsToPlace.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-slate-500">Aucun étudiant à placer</td>
                                </tr>
                            ) : studentsToPlace.map((c: any) => (
                                <tr key={c.id} className="hover:bg-[#f8fafc] transition-colors border-b border-[#f1f5f9]">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3.5">
                                            <div className="w-11 h-11 rounded-[14px] bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8] flex items-center justify-center text-white font-bold">
                                                {(c.prenom || '?').charAt(0)}{(c.nom_naissance || '?').charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-[#1e293b]">{c.prenom || 'Prénom inconnu'} {c.nom_naissance || 'Nom inconnu'}</div>
                                                <div className="text-xs text-[#64748b]">{c.email || 'Email non renseigné'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4"><span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#EFF6FF] text-[#1D4ED8]">{c.formation_souhaitee || 'Non renseigné'}</span></td>
                                    <td className="p-4"><span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#EDE9FE] text-[#5B21B6]">{c.situation || 'En recherche'}</span></td>
                                    <td className="p-4 text-[#334155] text-[0.9rem]">{c.ville || 'Non renseigné'}</td>
                                    <td className="p-4 text-center">
                                        <div className="flex justify-center gap-2">
                                            <button className="w-9 h-9 rounded-[10px] bg-[#f1f5f9] flex items-center justify-center text-[#64748b] hover:bg-[#3B82F6] hover:text-white transition-all"><Eye size={16}/></button>
                                            <button className="w-9 h-9 rounded-[10px] bg-[#f1f5f9] flex items-center justify-center text-[#64748b] hover:bg-[#3B82F6] hover:text-white transition-all"><Edit size={16}/></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                  </div>
              </div>
          </div>
      )
  }

  if (activeSubView === 'commercial-alternance') {
    return (
        <div className="animate-fade-in">
             {/* Hero */}
              <div className="bg-[#6366F1] rounded-3xl p-8 md:p-10 mb-7 relative overflow-hidden border border-white/10">
                  <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
                      <div className="flex items-center gap-5">
                          <div className="w-[72px] h-[72px] rounded-2xl flex items-center justify-center bg-white/15 backdrop-blur-md border border-white/20 text-white">
                              <CheckCircle2 size={36} />
                          </div>
                          <div>
                              <h1 className="text-[1.75rem] font-extrabold text-white mb-1.5 tracking-tight">Élèves en alternance</h1>
                              <p className="text-[0.95rem] text-white/70">Étudiants ayant trouvé une entreprise d'accueil</p>
                          </div>
                      </div>
                      <div className="flex gap-3">
                        <button className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-[0.95rem] font-semibold bg-white text-[#1e1e2e] hover:shadow-lg hover:-translate-y-0.5 transition-all">
                            Ajouter un élève
                        </button>
                        <button className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-[0.95rem] font-semibold bg-white/15 text-white border border-white/30 backdrop-blur-md hover:bg-white/25 transition-all">
                            Exporter
                        </button>
                      </div>
                  </div>
              </div>

              <ElevesStatsGrid type="success" count={studentsPlaced.length} />

              {/* Table Container */}
              <div className="bg-white border border-[#E2E8F0] rounded-[20px] overflow-hidden shadow-sm">
                  <div className="p-6 border-b border-[#E2E8F0] flex flex-wrap gap-4 justify-between">
                      <div className="flex gap-3">
                          <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={20} />
                            <input type="text" placeholder="Rechercher..." className="pl-12 pr-5 py-3.5 border-2 border-[#e2e8f0] rounded-xl text-[0.95rem] w-[320px] focus:outline-none focus:border-[#3B82F6]" />
                          </div>
                          <button className="p-3.5 border-2 border-[#e2e8f0] rounded-xl text-[#64748b] hover:bg-[#f8fafc]"><Filter size={20}/></button>
                      </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead className="bg-[#E6FFFA]">
                            <tr>
                                <th className="p-4 text-left text-[0.75rem] font-bold uppercase text-[#059669] border-b-2 border-[#A7F3D0]">Nom</th>
                                <th className="p-4 text-left text-[0.75rem] font-bold uppercase text-[#059669] border-b-2 border-[#A7F3D0]">Formation</th>
                                <th className="p-4 text-left text-[0.75rem] font-bold uppercase text-[#059669] border-b-2 border-[#A7F3D0]">Entreprise</th>
                                <th className="p-4 text-left text-[0.75rem] font-bold uppercase text-[#059669] border-b-2 border-[#A7F3D0]">CERFA</th>
                                <th className="p-4 text-center text-[0.75rem] font-bold uppercase text-[#059669] border-b-2 border-[#A7F3D0]">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {studentsPlaced.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-slate-500">Aucun étudiant en alternance</td>
                                </tr>
                            ) : studentsPlaced.map((c: any) => (
                                <tr key={c.id} className="hover:bg-[#f8fafc] transition-colors border-b border-[#f1f5f9]">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3.5">
                                            <div className="w-11 h-11 rounded-[14px] bg-gradient-to-br from-[#EC4899] to-[#BE185D] flex items-center justify-center text-white font-bold">
                                                {(c.prenom || '?').charAt(0)}{(c.nom_naissance || '?').charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-[#1e293b]">{c.prenom || 'Prénom inconnu'} {c.nom_naissance || 'Nom inconnu'}</div>
                                                <div className="text-xs text-[#64748b]">{c.email || 'Email non renseigné'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4"><span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#EFF6FF] text-[#1D4ED8]">{c.formation_souhaitee}</span></td>
                                    <td className="p-4 text-[#334155] font-semibold">{c.entreprise_d_accueil}</td>
                                    <td className="p-4"><span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-[#E6FFFA] text-[#6EE7B7]">✓ Validé</span></td>
                                    <td className="p-4 text-center">
                                        <div className="flex justify-center gap-2">
                                            <button className="w-9 h-9 rounded-[10px] bg-[#f1f5f9] flex items-center justify-center text-[#64748b] hover:bg-[#3B82F6] hover:text-white transition-all"><Eye size={16}/></button>
                                            <button className="w-9 h-9 rounded-[10px] bg-[#f1f5f9] flex items-center justify-center text-[#64748b] hover:bg-[#3B82F6] hover:text-white transition-all"><Edit size={16}/></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                  </div>
              </div>
        </div>
    )
  }

  // Default: Dashboard
  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1E293B] mb-4 tracking-tight">RUSH SCHOOL</h1>
          <div className="flex items-center gap-6 text-sm text-[#64748B]">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-[#94A3B8]" />
              <span>{candidates.length} inscrits</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-[#94A3B8]" />
              <span>Année 2025-2026</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3.5">
          <div className="text-right hidden md:block">
            <div className="text-xs text-[#94A3B8] mb-0.5">Créé par</div>
            <div className="font-semibold text-[#1E293B] text-sm">Arsène POPHILLAT</div>
            <div className="text-xs text-[#94A3B8] flex items-center justify-end gap-1">
               admin@rushschool.com
            </div>
          </div>
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#A78BFA] flex items-center justify-center text-white font-semibold shadow-lg shadow-blue-500/20">
            AP
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <div className="flex items-center gap-2.5 mb-5">
          <Zap className="text-[#F59E0B]" size={22} />
          <h2 className="text-lg font-bold text-[#1E293B]">Actions Rapides</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <QuickActionCard 
            icon={<Zap size={24} />} 
            title="Connecter une Intégration" 
            desc="Liez des intégrations externes à votre projet" 
          />
          <QuickActionCard 
            icon={<ListTodo size={24} />} 
            title="Créer une Tâche" 
            desc="Automatisez les importations et les workflows" 
          />
          <QuickActionCard 
            icon={<Database size={24} />} 
            title="Voir les Données" 
            desc="Parcourez et analysez vos données importées" 
          />
        </div>
      </div>

      {/* Stats */}
      <div className="mb-8">
        <div className="flex items-center gap-2.5 mb-5">
          <TrendingUp className="text-[#3B82F6]" size={22} />
          <h2 className="text-lg font-bold text-[#1E293B]">Statistiques Commerciales</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          <StatCard 
            label="Total Entreprises" 
            value={uniqueCompanies} 
            icon={<Briefcase size={24} />} 
            colorClass="blue"
            footerText="Actives"
          />
          <StatCard 
            label="Relances Programmées" 
            value="0" 
            icon={<Calendar size={24} />} 
            colorClass="orange"
            footerText="Contacts en attente"
          />
          <StatCard 
            label="Placements OK" 
            value={studentsPlaced.length} 
            icon={<CheckCircle2 size={24} />} 
            colorClass="green"
            footerText={`${studentsPlaced.length > 0 ? Math.round((studentsPlaced.length / candidates.length) * 100) : 0}% des étudiants`}
          />
          <StatCard 
            label="À Placer" 
            value={studentsToPlace.length} 
            icon={<Users size={24} />} 
            colorClass="purple"
            footerText="Étudiants en recherche"
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardView;