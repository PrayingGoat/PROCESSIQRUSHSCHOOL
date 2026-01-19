import React, { useState, useEffect } from 'react';
import { ViewId } from '../types';
import { 
  FileText, 
  Euro, 
  UserMinus, 
  Users, 
  Search, 
  Plus, 
  Eye, 
  Download, 
  Edit,
  Loader2,
  Building,
  History
} from 'lucide-react';
import { api } from '../services/api';

const RHStatCard = ({ value, label, icon, colorClass }: { value: string | number, label: string, icon: React.ReactNode, colorClass: 'blue' | 'green' | 'orange' | 'purple' }) => {
  const styles = {
    blue: { bg: 'bg-white', iconBg: 'bg-[#EFF6FF]', iconColor: 'text-[#3B82F6]', border: 'border-[#E2E8F0]' },
    green: { bg: 'bg-white', iconBg: 'bg-[#E6FFFA]', iconColor: 'text-[#10B981]', border: 'border-[#E2E8F0]' },
    orange: { bg: 'bg-white', iconBg: 'bg-[#FFFBEB]', iconColor: 'text-[#F59E0B]', border: 'border-[#E2E8F0]' },
    purple: { bg: 'bg-white', iconBg: 'bg-[#F3E8FF]', iconColor: 'text-[#A78BFA]', border: 'border-[#E2E8F0]' },
  };
  const style = styles[colorClass];

  return (
    <div className={`${style.bg} border ${style.border} rounded-xl p-5 flex items-center gap-4 hover:-translate-y-0.5 hover:shadow-md transition-all`}>
      <div className={`w-12 h-12 rounded-xl ${style.iconBg} ${style.iconColor} flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <div>
        <div className="text-2xl font-bold text-slate-800">{value}</div>
        <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">{label}</div>
      </div>
    </div>
  );
};

const CerfaTable = ({ data }: { data: any[] }) => {
  // Helper to normalize data inside the table loop
  const getC = (c: any) => {
    // Correctly handle the nested 'fields' structure
    const d = c.fields || c.data || c || {};
    return {
        id: c.id || d.id || d.record_id,
        // Match exact keys from API response
        prenom: d['Prénom'] || d.prenom || d.firstname || "",
        nom: d['NOM de naissance'] || d.nom_naissance || d.nom || d.lastname || "",
        formation: d['Formation'] || d.formation_souhaitee || d.formation || "",
        entreprise: d['Entreprise daccueil'] || d.entreprise_d_accueil || d.entreprise || ""
    };
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Formation</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Référent</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Étudiant</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Entreprise</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Statut</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
                <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">Aucun dossier trouvé</td>
                </tr>
            ) : data.map((raw, idx) => {
              const row = getC(raw);
              return (
              <tr key={row.id || idx} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="p-4">
                  <span className="inline-block px-2.5 py-1 rounded-md bg-blue-50 text-blue-600 text-xs font-bold">
                    {row.formation || 'Non renseigné'}
                  </span>
                </td>
                <td className="p-4 text-sm text-slate-600">RH</td>
                <td className="p-4">
                    <div className="font-semibold text-slate-800">{row.prenom} {row.nom}</div>
                </td>
                <td className="p-4 text-sm text-slate-600">{row.entreprise || 'Aucune'}</td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${row.entreprise && row.entreprise !== 'Non' && row.entreprise !== 'En recherche' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {row.entreprise && row.entreprise !== 'Non' && row.entreprise !== 'En recherche' ? 'En cours' : 'À placer'}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <div className="flex justify-center gap-2">
                    <button className="p-1.5 border border-slate-200 rounded hover:border-blue-500 hover:text-blue-500 transition-colors"><Eye size={16} /></button>
                    <button className="p-1.5 border border-slate-200 rounded hover:border-blue-500 hover:text-blue-500 transition-colors"><Edit size={16} /></button>
                  </div>
                </td>
              </tr>
            )})}
          </tbody>
        </table>
      </div>
    </div>
  );
};

interface RHViewProps {
    activeSubView: ViewId;
}

const RHView: React.FC<RHViewProps> = ({ activeSubView }) => {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const data = await api.getAllCandidates();
            setCandidates(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    fetchData();
  }, []);

  if (loading) {
      return (
          <div className="flex h-full items-center justify-center">
              <Loader2 className="animate-spin text-blue-500" size={48} />
          </div>
      )
  }
  
  // Render specific section based on activeSubView
  const renderSection = () => {
      switch(activeSubView) {
          case 'rh-cerfa':
              return (
                  <div>
                     <div className="bg-gradient-to-br from-[#6B5B73] to-[#8B7B93] rounded-2xl p-7 mb-6 relative overflow-hidden text-white">
                        <div className="flex justify-between items-center relative z-10">
                             <div className="flex items-center gap-5">
                                 <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                                     <FileText size={28} />
                                 </div>
                                 <div>
                                     <h1 className="text-2xl font-bold">Gestion des CERFA</h1>
                                     <p className="text-white/80">Suivi complet des contrats d'apprentissage</p>
                                 </div>
                             </div>
                             <div className="flex gap-3">
                                 <button className="flex items-center gap-2 px-4 py-2 bg-white/15 border border-white/30 rounded-lg hover:bg-white/25 transition-all text-sm font-medium">
                                     <History size={16} /> Historique
                                 </button>
                                 <button className="flex items-center gap-2 px-4 py-2 bg-white text-[#6B5B73] rounded-lg hover:bg-slate-100 transition-all text-sm font-bold">
                                     <Plus size={16} /> Nouveau CERFA
                                 </button>
                             </div>
                        </div>
                     </div>

                     {/* Stats Grid */}
                     <div className="grid grid-cols-5 gap-4 mb-6">
                        <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6B5B73] to-[#8B7B93] flex items-center justify-center text-white"><FileText size={20}/></div>
                            <div><div className="text-2xl font-bold text-slate-800">{candidates.length}</div><div className="text-xs text-slate-500">Total CERFA</div></div>
                        </div>
                        <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#10B981] to-[#34D399] flex items-center justify-center text-white"><Euro size={20}/></div>
                            <div><div className="text-2xl font-bold text-slate-800">0</div><div className="text-xs text-slate-500">PEC Accordées</div></div>
                        </div>
                        <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#F59E0B] to-[#FBBF24] flex items-center justify-center text-white"><Loader2 size={20}/></div>
                            <div><div className="text-2xl font-bold text-slate-800">{candidates.length}</div><div className="text-xs text-slate-500">En cours</div></div>
                        </div>
                        <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#3B82F6] to-[#60A5FA] flex items-center justify-center text-white"><Building size={20}/></div>
                            <div><div className="text-2xl font-bold text-slate-800">0</div><div className="text-xs text-slate-500">Entreprises</div></div>
                        </div>
                        <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#EF4444] to-[#F87171] flex items-center justify-center text-white"><Edit size={20}/></div>
                            <div><div className="text-2xl font-bold text-slate-800">0</div><div className="text-xs text-slate-500">Modifs</div></div>
                        </div>
                     </div>

                     <div className="mb-4 flex flex-wrap gap-4 bg-white p-4 rounded-2xl border border-slate-200">
                         <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 min-w-[250px]">
                             <Search size={16} className="text-slate-400" />
                             <input type="text" placeholder="Rechercher..." className="bg-transparent outline-none text-sm w-full" />
                         </div>
                         <select className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                           <option>Toutes formations</option>
                           <option>BTS MCO</option>
                           <option>BTS NDRC</option>
                         </select>
                         <select className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                           <option>Tous statuts</option>
                           <option>Signé</option>
                           <option>En cours</option>
                         </select>
                     </div>

                     <CerfaTable data={candidates} />
                  </div>
              );
          case 'rh-fiche':
              return (
                  <div className="flex flex-col items-center justify-center h-[60vh] bg-white border border-slate-200 rounded-2xl p-10 text-center">
                      <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
                          <Building size={40} className="text-emerald-500" />
                      </div>
                      <h2 className="text-xl font-bold text-slate-800 mb-2">Fiches Entreprises</h2>
                      <p className="text-slate-500 max-w-md">Gestion des informations entreprises et maîtres d'apprentissage. Fonctionnalité complète en cours d'intégration.</p>
                      <button className="mt-6 px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all">
                          Nouvelle Fiche
                      </button>
                  </div>
              );
          case 'rh-pec':
              return (
                  <div className="flex flex-col items-center justify-center h-[60vh] bg-white border border-slate-200 rounded-2xl p-10 text-center">
                      <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                          <Euro size={40} className="text-blue-500" />
                      </div>
                      <h2 className="text-xl font-bold text-slate-800 mb-2">Prises en Charge (PEC)</h2>
                      <p className="text-slate-500 max-w-md">Suivi des financements OPCO. Fonctionnalité complète en cours d'intégration.</p>
                  </div>
              );
          case 'rh-ruptures':
              return (
                  <div className="flex flex-col items-center justify-center h-[60vh] bg-white border border-slate-200 rounded-2xl p-10 text-center">
                      <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-6">
                          <UserMinus size={40} className="text-orange-500" />
                      </div>
                      <h2 className="text-xl font-bold text-slate-800 mb-2">Gestion des Ruptures</h2>
                      <p className="text-slate-500 max-w-md">Traitement des ruptures de contrat et démissions. Fonctionnalité complète en cours d'intégration.</p>
                  </div>
              );
          default:
              // Fallback to Dashboard summary if logic fails
              return (
                  <div>
                    {/* Header Info */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                        <h1 className="text-2xl font-bold text-slate-800 mb-1">Ressources Humaines</h1>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Users size={16} />
                            <span>Gestion administrative des alternants</span>
                        </div>
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                        <Download size={16} />
                        Exporter
                        </button>
                    </div>

                    {/* Stats Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <RHStatCard value={candidates.length} label="Dossiers en cours" icon={<FileText size={24} />} colorClass="blue" />
                        <RHStatCard value="0" label="Prises en charge" icon={<Euro size={24} />} colorClass="green" />
                        <RHStatCard value="0" label="Ruptures ce mois" icon={<UserMinus size={24} />} colorClass="orange" />
                        <RHStatCard value={candidates.length} label="Étudiants actifs" icon={<Users size={24} />} colorClass="purple" />
                    </div>
                  </div>
              );
      }
  }

  return (
    <div className="animate-fade-in">
        {renderSection()}
    </div>
  );
};

export default RHView;