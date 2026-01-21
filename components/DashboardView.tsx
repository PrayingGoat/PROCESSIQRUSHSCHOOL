import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Calendar,
  CheckCircle2,
  FileText,
  Loader2,
  Eye,
  Edit
} from 'lucide-react';
import { ViewId } from '../types';
import { api } from '../services/api';

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

  // Helper to extract clean candidate data
  const getC = (c: any) => {
    const d = c.fields || c.data || c || {};
    return {
        id: c.id || d.id || d.record_id,
        prenom: d['Prénom'] || d.prenom || d.firstname || "",
        nom: d['NOM de naissance'] || d.nom_naissance || d.nom || d.lastname || "",
        email: d['E-mail'] || d.email || "",
        formation: d['Formation'] || d.formation_souhaitee || d.formation || "Non renseigné",
        ville: d['Commune de naissance'] || d.ville || d.commune_naissance || "Non renseigné",
        entreprise: d['Entreprise daccueil'] || d.entreprise_d_accueil || d.entreprise || "En recherche",
        telephone: d['Téléphone'] || d.telephone || "",
    };
  };

  const isPlaced = (c: any) => {
      const ent = getC(c).entreprise;
      return ent && ent !== 'Non' && ent !== 'En recherche' && ent !== 'En cours' && ent !== 'null';
  };

  const studentsToPlace = candidates.filter(c => !isPlaced(c));
  const studentsPlaced = candidates.filter(c => isPlaced(c));

  if (loading) {
      return (
          <div className="flex h-full items-center justify-center">
              <Loader2 className="animate-spin text-blue-500" size={48} />
          </div>
      )
  }

  // --- SUB-VIEW: PLACER ---
  if (activeSubView === 'commercial-placer') {
      return (
          <div className="animate-slide-in">
              <div className="bg-[#A78BFA] rounded-3xl p-8 mb-7 relative overflow-hidden border border-white/10 text-white">
                  <div className="relative z-10 flex justify-between items-center">
                      <div className="flex items-center gap-5">
                          <div className="w-[72px] h-[72px] rounded-[20px] bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center">
                              <Users size={36} />
                          </div>
                          <div>
                              <h1 className="text-[1.75rem] font-extrabold mb-1.5 tracking-tight">Élèves à placer</h1>
                              <p className="text-white/70 text-[0.95rem]">Étudiants en recherche d'alternance ou suite à une rupture de contrat</p>
                          </div>
                      </div>
                      <div className="flex gap-3">
                          <button className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-white text-[#1e1e2e] rounded-2xl font-semibold text-[0.95rem] hover:-translate-y-0.5 hover:shadow-xl transition-all">Ajouter un élève</button>
                          <button className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-white/15 text-white border border-white/30 rounded-2xl font-semibold text-[0.95rem] backdrop-blur-md hover:bg-white/25 transition-all">Exporter</button>
                      </div>
                  </div>
              </div>

              <div className="grid grid-cols-4 gap-5 mb-7">
                  <div className="bg-white rounded-[20px] p-6 border border-slate-200 relative overflow-hidden hover:-translate-y-1 transition-all shadow-sm">
                      <div className="absolute top-0 left-0 w-1 h-full bg-[#A78BFA]"></div>
                      <div className="flex justify-between items-center mb-4">
                          <div className="w-12 h-12 rounded-xl bg-[#EDE9FE] text-[#A78BFA] flex items-center justify-center"><Users size={24}/></div>
                          <span className="bg-[#EDE9FE] text-[#8B5CF6] px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1">Urgent</span>
                      </div>
                      <div className="text-[2.5rem] font-extrabold text-slate-800 leading-none mb-1">{studentsToPlace.length}</div>
                      <div className="text-sm font-medium text-slate-500">Élèves à placer</div>
                  </div>
                  {/* Additional dummy stats */}
                  <div className="bg-white rounded-[20px] p-6 border border-slate-200 relative overflow-hidden hover:-translate-y-1 transition-all shadow-sm">
                      <div className="absolute top-0 left-0 w-1 h-full bg-orange-400"></div>
                      <div className="flex justify-between items-center mb-4">
                          <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center"><Calendar size={24}/></div>
                          <span className="bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full text-xs font-bold">En cours</span>
                      </div>
                      <div className="text-[2.5rem] font-extrabold text-slate-800 leading-none mb-1">0</div>
                      <div className="text-sm font-medium text-slate-500">Entretiens prévus</div>
                  </div>
              </div>

              <div className="bg-white rounded-[20px] border border-slate-200 overflow-hidden shadow-sm">
                  <table className="w-full">
                      <thead className="bg-[#EDE9FE]">
                          <tr>
                              <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#7C3AED]">Formation</th>
                              <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#7C3AED]">Nom</th>
                              <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#7C3AED]">Prénom</th>
                              <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#7C3AED]">Ville</th>
                              <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#7C3AED]">Téléphone</th>
                              <th className="px-4 py-4 text-center text-xs font-bold uppercase tracking-wider text-[#7C3AED]">Actions</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                          {studentsToPlace.map((raw) => {
                              const c = getC(raw);
                              return (
                                  <tr key={c.id} className="hover:bg-[#f8fafc]">
                                      <td className="px-4 py-4"><span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-50 text-blue-600 text-xs font-bold">{c.formation}</span></td>
                                      <td className="px-4 py-4 font-bold text-slate-800">{c.nom}</td>
                                      <td className="px-4 py-4 text-slate-600">{c.prenom}</td>
                                      <td className="px-4 py-4 text-slate-600">{c.ville}</td>
                                      <td className="px-4 py-4 text-slate-600">{c.telephone}</td>
                                      <td className="px-4 py-4 text-center">
                                          <div className="flex justify-center gap-2">
                                              <button className="p-2 rounded-lg bg-slate-100 text-slate-500 hover:bg-blue-500 hover:text-white transition-colors"><Eye size={16}/></button>
                                              <button className="p-2 rounded-lg bg-slate-100 text-slate-500 hover:bg-blue-500 hover:text-white transition-colors"><Edit size={16}/></button>
                                          </div>
                                      </td>
                                  </tr>
                              );
                          })}
                      </tbody>
                  </table>
              </div>
          </div>
      );
  }

  // Default: Dashboard / Alternance
  return (
    <div className="animate-slide-in">
        <div className="bg-[#818CF8] rounded-3xl p-8 mb-6 text-white shadow-lg shadow-indigo-200">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold mb-2">Vue d'ensemble Commercial</h2>
                    <p className="opacity-90">Suivi du placement en alternance</p>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
            <div className="bg-[#F5F3FF] rounded-2xl p-6 border-2 border-[#DDD6FE]">
                <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#A78BFA] flex items-center justify-center text-white"><Users size={24}/></div>
                    <span className="text-[#A78BFA] font-bold text-sm">À placer</span>
                </div>
                <div className="text-4xl font-bold text-[#8B5CF6] mb-1">{studentsToPlace.length}</div>
                <div className="text-[#A78BFA] text-sm flex items-center gap-1"><Users size={12}/> Étudiants</div>
            </div>
            
            <div className="bg-[#F0FFF4] rounded-2xl p-6 border-2 border-[#C6F6D5]">
                <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#86EFAC] flex items-center justify-center text-white"><CheckCircle2 size={24}/></div>
                    <span className="text-[#86EFAC] font-bold text-sm">En alternance</span>
                </div>
                <div className="text-4xl font-bold text-[#6EE7B7] mb-1">{studentsPlaced.length}</div>
                <div className="text-[#86EFAC] text-sm flex items-center gap-1"><CheckCircle2 size={12}/> Placés</div>
            </div>
        </div>
    </div>
  );
};

export default DashboardView;