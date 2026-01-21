import React, { useState, useEffect } from 'react';
import { ViewId } from '../types';
import { 
  FileText, 
  Euro, 
  UserMinus, 
  Users, 
  Eye, 
  Edit,
  Loader2
} from 'lucide-react';
import { api } from '../services/api';

const RHView: React.FC<{ activeSubView: ViewId }> = ({ activeSubView }) => {
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

  const getC = (c: any) => {
    const d = c.fields || c.data || c || {};
    return {
        id: c.id || d.id || d.record_id,
        prenom: d['Prénom'] || d.prenom || "",
        nom: d['NOM de naissance'] || d.nom || "",
        formation: d['Formation'] || d.formation || "",
        entreprise: d['Entreprise daccueil'] || d.entreprise || "En attente",
    };
  };

  if (loading) {
      return (
          <div className="flex h-full items-center justify-center">
              <Loader2 className="animate-spin text-blue-500" size={48} />
          </div>
      )
  }

  // Common Header
  const renderHeader = () => (
    <>
        <div className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-2xl font-extrabold text-slate-900 mb-1">Ressources Humaines</h1>
                <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                    <Users size={16} />
                    <span>Gestion administrative des alternants</span>
                </div>
            </div>
            <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">Exporter</button>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center gap-4 hover:-translate-y-1 transition-all shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center"><FileText size={24}/></div>
                <div>
                    <div className="text-2xl font-bold text-slate-800">{candidates.length}</div>
                    <div className="text-xs text-slate-500 font-medium">CERFA en cours</div>
                </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center gap-4 hover:-translate-y-1 transition-all shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-green-50 text-green-500 flex items-center justify-center"><Euro size={24}/></div>
                <div>
                    <div className="text-2xl font-bold text-slate-800">0</div>
                    <div className="text-xs text-slate-500 font-medium">Prises en charge</div>
                </div>
            </div>
            {/* More stats cards... */}
        </div>
    </>
  );

  if (activeSubView === 'rh-cerfa') {
      return (
          <div className="animate-slide-in">
              {renderHeader()}
              
              <div className="bg-gradient-to-br from-[#6B5B73] to-[#8B7B93] rounded-[20px] p-8 mb-6 relative overflow-hidden text-white">
                  <div className="relative z-10 flex justify-between items-center">
                      <div className="flex items-center gap-5">
                          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                              <FileText size={28} />
                          </div>
                          <div>
                              <h1 className="text-2xl font-bold mb-1">Gestion des CERFA</h1>
                              <p className="text-white/80 text-sm">Suivi complet des contrats d'apprentissage</p>
                          </div>
                      </div>
                      <div className="flex gap-3">
                          <button className="px-5 py-2.5 bg-white/15 border border-white/30 rounded-xl font-medium text-sm hover:bg-white/25 transition-colors">Historique</button>
                          <button className="px-5 py-2.5 bg-white text-[#6B5B73] rounded-xl font-bold text-sm hover:shadow-lg transition-all transform hover:-translate-y-0.5">Nouveau CERFA</button>
                      </div>
                  </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                  <table className="w-full">
                      <thead>
                          <tr className="bg-gradient-to-r from-[#6B5B73] to-[#8B7B93] text-white">
                              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Formation</th>
                              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Nom Apprenti</th>
                              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Entreprise</th>
                              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Statut</th>
                              <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider">Actions</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                          {candidates.map((raw) => {
                              const row = getC(raw);
                              return (
                                  <tr key={row.id} className="hover:bg-slate-50">
                                      <td className="px-4 py-3 text-sm text-slate-600">{row.formation}</td>
                                      <td className="px-4 py-3 font-bold text-slate-800">{row.prenom} {row.nom}</td>
                                      <td className="px-4 py-3 text-sm text-slate-600">{row.entreprise}</td>
                                      <td className="px-4 py-3"><span className="px-2 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold">En cours</span></td>
                                      <td className="px-4 py-3 text-center">
                                          <div className="flex justify-center gap-2">
                                              <button className="p-1.5 rounded-lg border border-slate-200 hover:bg-blue-50 hover:border-blue-200 text-slate-400 hover:text-blue-500 transition-colors"><Eye size={14} /></button>
                                              <button className="p-1.5 rounded-lg border border-slate-200 hover:bg-blue-50 hover:border-blue-200 text-slate-400 hover:text-blue-500 transition-colors"><Edit size={14} /></button>
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

  // Fallback / Dashboard
  return (
      <div className="animate-slide-in">
          {renderHeader()}
          <div className="p-12 text-center bg-white rounded-2xl border-2 border-dashed border-slate-200">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                  <Users size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Sélectionnez une section</h3>
              <p className="text-slate-500">Utilisez le menu de gauche pour naviguer dans le module RH</p>
          </div>
      </div>
  );
};

export default RHView;