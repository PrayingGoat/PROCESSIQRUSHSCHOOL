import React, { useState, useEffect } from 'react';
import { ViewId } from '../types';
import {
    FileText,
    Users,
    Eye,
    Copy,
    Trash2,
    Search,
    Plus,
    CheckCircle2,
    AlertCircle,
    Clock,
    Briefcase,
    Save,
    Download,
    Building,
    Loader2,
    Mail,
    Phone
} from 'lucide-react';
import { api } from '../services/api';

const RHView: React.FC<{ activeSubView: ViewId }> = ({ activeSubView }) => {
    const [fichesData, setFichesData] = useState<any>(null);
    const [candidates, setCandidates] = useState<any[]>([]);
    const [rhStats, setRhStats] = useState<any>(null);
    const [companies, setCompanies] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [filterStatus, setFilterStatus] = useState<string>('all');

    useEffect(() => {
        if (activeSubView === 'rh-cerfa') {
            fetchFichesData();
        } else if (activeSubView === 'rh-dashboard') {
            fetchRHStats();
        } else if (activeSubView === 'rh-fiche') {
            fetchCompanies();
        }
    }, [activeSubView]);

    const fetchFichesData = async () => {
        setLoading(true);
        try {
            const data = await api.getEtudiantsFiches(false);
            setFichesData(data);
            setCandidates(data.etudiants || []);
        } catch (error) {
            console.error("Failed to fetch fiches data", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRHStats = async () => {
        setLoading(true);
        try {
            const data = await api.getRHStats();
            setRhStats(data);
        } catch (error) {
            console.error("Failed to fetch RH stats", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCompanies = async () => {
        setLoading(true);
        try {
            const data = await api.getAllCompanies();
            setCompanies(data);
        } catch (error) {
            console.error("Failed to fetch companies", error);
        } finally {
            setLoading(false);
        }
    };

    // Helper to format dates
    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            return date.toISOString().split('T')[0]; // Return YYYY-MM-DD for input[type="date"]
        } catch (e) {
            return '';
        }
    };

    // Specific CERFA View
    if (activeSubView === 'rh-cerfa') {
        return (
            <div className="animate-slide-in pb-20 font-sans">
                {/* Hero Section */}
                <div className="bg-gradient-to-br from-[#6B5B73] via-[#8B7B93] to-[#6B5B73] rounded-2xl p-7 mb-6 text-white relative overflow-hidden shadow-lg border border-white/10">
                    <div className="relative z-10 flex justify-between items-center flex-wrap gap-4">
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-inner border border-white/10">
                                <FileText size={28} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-extrabold mb-1 tracking-tight">Gestion des CERFA</h1>
                                <p className="opacity-90 text-sm font-medium">Suivi complet des contrats d'apprentissage • Version 2.0</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button className="flex items-center gap-2 px-5 py-2.5 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-all text-sm font-semibold backdrop-blur-sm">
                                <Clock size={16} /> Historique
                            </button>
                            <button className="flex items-center gap-2 px-5 py-2.5 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-all text-sm font-semibold backdrop-blur-sm">
                                <CheckCircle2 size={16} /> Exporter
                            </button>
                            <button className="flex items-center gap-2 px-5 py-2.5 bg-white text-[#6B5B73] rounded-xl hover:shadow-xl hover:-translate-y-0.5 transition-all font-bold text-sm shadow-lg shadow-black/5">
                                <Plus size={18} strokeWidth={3} /> Nouveau CERFA
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                    {/* Total CERFA - Purple */}
                    <div className="bg-white rounded-2xl p-5 border border-slate-200 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6B5B73] to-[#8B7B93] flex items-center justify-center text-white shadow-md shadow-purple-900/10">
                            <FileText size={20} />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-slate-800">{fichesData?.total || 0}</div>
                            <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">Total Étudiants</div>
                        </div>
                    </div>

                    {/* Avec Fiche - Green */}
                    <div className="bg-white rounded-2xl p-5 border border-slate-200 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
                            <CheckCircle2 size={20} />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-slate-800">{fichesData?.etudiants_avec_fiche || 0}</div>
                            <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">Avec Fiche</div>
                        </div>
                    </div>

                    {/* Avec CERFA - Blue */}
                    <div className="bg-white rounded-2xl p-5 border border-slate-200 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                            <FileText size={20} />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-slate-800">{fichesData?.etudiants_avec_cerfa || 0}</div>
                            <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">Avec CERFA</div>
                        </div>
                    </div>

                    {/* Dossier Complet - Teal */}
                    <div className="bg-white rounded-2xl p-5 border border-slate-200 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
                            <CheckCircle2 size={20} />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-slate-800">{fichesData?.etudiants_dossier_complet || 0}</div>
                            <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">Dossier Complet</div>
                        </div>
                    </div>

                    {/* Sans Documents - Red */}
                    <div className="bg-white rounded-2xl p-5 border border-slate-200 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-400 to-red-500 flex items-center justify-center text-white shadow-md shadow-red-500/20">
                            <AlertCircle size={20} />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-slate-800">{fichesData?.etudiants_sans_documents || 0}</div>
                            <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">Sans Documents</div>
                        </div>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200 mb-6 flex justify-between items-center flex-wrap gap-4 shadow-sm">
                    <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-2 px-3 py-2.5 bg-[#F3F4F6] border border-transparent rounded-xl w-64 focus-within:bg-white focus-within:border-blue-500/50 focus-within:shadow-sm focus-within:ring-2 focus-within:ring-blue-500/10 transition-all">
                            <Search size={16} className="text-slate-400" />
                            <input type="text" placeholder="Rechercher..." className="bg-transparent border-none outline-none text-sm w-full text-slate-700 placeholder:text-slate-400" />
                        </div>

                        <select className="px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 outline-none focus:border-blue-500 cursor-pointer hover:bg-slate-50">
                            <option>Toutes formations</option>
                            <option>BTS NDRC</option>
                            <option>BTS MCO</option>
                            <option>Bachelor RDC</option>
                            <option>TP NTC</option>
                        </select>

                        <select className="px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 outline-none focus:border-blue-500 cursor-pointer hover:bg-slate-50">
                            <option>Tous référents</option>
                            <option>Alex</option>
                            <option>Bilal</option>
                            <option>Maxime</option>
                            <option>Arsène</option>
                        </select>

                        <select className="px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 outline-none focus:border-blue-500 cursor-pointer hover:bg-slate-50">
                            <option>Tous statuts</option>
                            <option>Signé</option>
                            <option>En attente</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100">
                        <CheckCircle2 size={14} /> Sauvegardé
                    </div>
                </div>

                {/* Table Container */}
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto max-h-[70vh]">
                        <table className="w-full border-collapse">
                            <thead className="bg-gradient-to-r from-[#6B5B73] to-[#8B7B93] text-white sticky top-0 z-10">
                                <tr>
                                    {[
                                        "Formation", "Référent", "Chargé", "Nom Apprenti", "Date Naissance",
                                        "Coord. Apprenti", "Statut Contrat", "Statut Convention", "Date Signature",
                                        "Date Début", "Date Fin", "Entreprise & SIRET", "Maître Apprentissage",
                                        "Coord. Entreprise", "OPCO", "État PEC", "Montant PEC", "Date Transm.",
                                        "Priorité", "Commentaires", "Actions"
                                    ].map((header) => (
                                        <th key={header} className="px-3 py-3 text-left text-[11px] font-bold uppercase tracking-wider whitespace-nowrap">
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    <tr><td colSpan={21} className="p-8 text-center text-slate-500">Chargement des données...</td></tr>
                                ) : candidates.length === 0 ? (
                                    <tr><td colSpan={21} className="p-8 text-center text-slate-500">Aucun dossier trouvé</td></tr>
                                ) : (
                                    candidates.map((c: any, idx: number) => (
                                        <tr key={c.record_id || idx} className="hover:bg-[#FAFBFC] transition-colors group">
                                            {/* Formation */}
                                            <td className="p-2">
                                                <select className="w-full bg-[#F9FAFB] border border-transparent group-hover:border-slate-300 rounded text-[11px] py-1 px-1 outline-none focus:bg-white focus:border-blue-500 focus:shadow-sm transition-all" defaultValue={c.formation || "NDRC"}>
                                                    <option value="NDRC">BTS NDRC</option>
                                                    <option value="MCO">BTS MCO</option>
                                                    <option value="BACHELOR">BACHELOR RDC</option>
                                                    <option value="NTC">TP NTC</option>
                                                </select>
                                            </td>
                                            {/* Référent */}
                                            <td className="p-2">
                                                <select className="w-full bg-[#F9FAFB] border border-transparent group-hover:border-slate-300 rounded text-[11px] py-1 px-1 outline-none focus:bg-white focus:border-blue-500 transition-all">
                                                    <option>Alex</option>
                                                    <option>Bilal</option>
                                                    <option>Maxime</option>
                                                    <option>Arsène</option>
                                                </select>
                                            </td>
                                            {/* Chargé */}
                                            <td className="p-2">
                                                <select className="w-full bg-[#F9FAFB] border border-transparent group-hover:border-slate-300 rounded text-[11px] py-1 px-1 outline-none focus:bg-white focus:border-blue-500 transition-all">
                                                    <option>Chaima</option>
                                                    <option>Rania</option>
                                                </select>
                                            </td>
                                            {/* Nom Apprenti */}
                                            <td className="p-2">
                                                <input type="text" defaultValue={((c.prenom || '') + ' ' + (c.nom || '')).trim().toUpperCase() || "SANS NOM"} className="w-full bg-[#F9FAFB] border border-transparent group-hover:border-slate-300 rounded text-[11px] font-semibold py-1 px-2 outline-none focus:bg-white focus:border-blue-500 transition-all min-w-[120px]" />
                                            </td>
                                            {/* Date Naissance */}
                                            <td className="p-2">
                                                <input type="date" defaultValue={formatDate(c.date_naissance)} className="bg-[#F9FAFB] border border-transparent group-hover:border-slate-300 rounded text-[11px] py-1 px-1 outline-none focus:bg-white focus:border-blue-500 transition-all w-[95px]" />
                                            </td>
                                            {/* Coord Apprenti */}
                                            <td className="p-2">
                                                <div className="flex flex-col gap-1">
                                                    <input type="tel" defaultValue={c.telephone} placeholder="Tél" className="bg-[#F9FAFB] border border-transparent group-hover:border-slate-300 rounded text-[10px] py-0.5 px-1 outline-none focus:bg-white focus:border-blue-500 w-[90px]" />
                                                    <input type="email" defaultValue={c.email} placeholder="Email" className="bg-[#F9FAFB] border border-transparent group-hover:border-slate-300 rounded text-[10px] py-0.5 px-1 outline-none focus:bg-white focus:border-blue-500 w-[120px]" />
                                                </div>
                                            </td>
                                            {/* Statut Contrat */}
                                            <td className="p-2 text-center">
                                                <select className="bg-[#F9FAFB] border border-transparent group-hover:border-slate-300 rounded text-[10px] py-1 px-1 outline-none focus:bg-white focus:border-blue-500 w-full" defaultValue={c.has_cerfa ? "signe" : "attente"}>
                                                    <option value="attente">Attente fiche</option>
                                                    <option value="prep">Prép. entreprise</option>
                                                    <option value="signe">Signé</option>
                                                </select>
                                            </td>
                                            {/* Statut Convention */}
                                            <td className="p-2 text-center">
                                                <select className="bg-[#F9FAFB] border border-transparent group-hover:border-slate-300 rounded text-[10px] py-1 px-1 outline-none focus:bg-white focus:border-blue-500 w-full" defaultValue={c.has_fiche_renseignement ? "signe" : "attente"}>
                                                    <option value="attente">Attente</option>
                                                    <option value="prep">Prép. CFA</option>
                                                    <option value="signe">Signé</option>
                                                </select>
                                            </td>
                                            {/* Date Signature */}
                                            <td className="p-2">
                                                <input type="date" className="bg-[#F9FAFB] border border-transparent group-hover:border-slate-300 rounded text-[11px] py-1 px-1 outline-none focus:bg-white focus:border-blue-500 w-[95px]" />
                                            </td>
                                            {/* Date Début */}
                                            <td className="p-2">
                                                <input type="date" className="bg-[#F9FAFB] border border-transparent group-hover:border-slate-300 rounded text-[11px] py-1 px-1 outline-none focus:bg-white focus:border-blue-500 w-[95px]" />
                                            </td>
                                            {/* Date Fin */}
                                            <td className="p-2">
                                                <input type="date" className="bg-[#F9FAFB] border border-transparent group-hover:border-slate-300 rounded text-[11px] py-1 px-1 outline-none focus:bg-white focus:border-blue-500 w-[95px]" />
                                            </td>
                                            {/* Entreprise & SIRET */}
                                            <td className="p-2">
                                                <div className="flex flex-col gap-1">
                                                    <input type="text" defaultValue={c.entreprise_raison_sociale || ''} placeholder="Entreprise" className="bg-[#F9FAFB] border border-transparent group-hover:border-slate-300 rounded text-[11px] font-semibold py-0.5 px-1 outline-none focus:bg-white focus:border-blue-500 w-[120px]" />
                                                    <input type="text" placeholder="SIRET" className="bg-[#F9FAFB] border border-transparent group-hover:border-slate-300 rounded text-[10px] font-mono py-0.5 px-1 outline-none focus:bg-white focus:border-blue-500 w-[110px]" />
                                                </div>
                                            </td>
                                            {/* Maître Apprentissage */}
                                            <td className="p-2">
                                                <input type="text" className="bg-[#F9FAFB] border border-transparent group-hover:border-slate-300 rounded text-[11px] py-1 px-1 outline-none focus:bg-white focus:border-blue-500 w-[100px]" />
                                            </td>
                                            {/* Coord Entreprise */}
                                            <td className="p-2">
                                                <div className="flex flex-col gap-1">
                                                    <input type="tel" placeholder="Tél" className="bg-[#F9FAFB] border border-transparent group-hover:border-slate-300 rounded text-[10px] py-0.5 px-1 outline-none focus:bg-white focus:border-blue-500 w-[90px]" />
                                                    <input type="email" placeholder="Email" className="bg-[#F9FAFB] border border-transparent group-hover:border-slate-300 rounded text-[10px] py-0.5 px-1 outline-none focus:bg-white focus:border-blue-500 w-[120px]" />
                                                </div>
                                            </td>
                                            {/* OPCO */}
                                            <td className="p-2">
                                                <select className="bg-[#F9FAFB] border border-transparent group-hover:border-slate-300 rounded text-[11px] py-1 px-1 outline-none focus:bg-white focus:border-blue-500 w-full">
                                                    <option>ATLAS</option>
                                                    <option>AKTO</option>
                                                    <option>OPCOMMERCE</option>
                                                    <option>OPCO 2i</option>
                                                    <option>AFDAS</option>
                                                </select>
                                            </td>
                                            {/* État PEC */}
                                            <td className="p-2">
                                                <select className="bg-[#F9FAFB] border border-transparent group-hover:border-slate-300 rounded text-[10px] py-1 px-1 outline-none focus:bg-white focus:border-blue-500 w-full">
                                                    <option>En analyse</option>
                                                    <option>Accordé</option>
                                                    <option>Refusé</option>
                                                </select>
                                            </td>
                                            {/* Montant */}
                                            <td className="p-2">
                                                <input type="number" placeholder="€" className="bg-[#F9FAFB] border border-transparent group-hover:border-slate-300 rounded text-[11px] text-right py-1 px-1 outline-none focus:bg-white focus:border-blue-500 w-[60px]" />
                                            </td>
                                            {/* Date Transmission */}
                                            <td className="p-2">
                                                <input type="date" className="bg-[#F9FAFB] border border-transparent group-hover:border-slate-300 rounded text-[11px] py-1 px-1 outline-none focus:bg-white focus:border-blue-500 w-[95px]" />
                                            </td>
                                            {/* Priorité */}
                                            <td className="p-2 text-center">
                                                <select className="bg-[#F9FAFB] border border-transparent group-hover:border-slate-300 rounded text-[10px] font-bold py-1 px-1 outline-none focus:bg-white focus:border-blue-500 w-full">
                                                    <option value="haute">🔴 Haute</option>
                                                    <option value="moyenne">🟡 Moyenne</option>
                                                    <option value="basse">🟢 Basse</option>
                                                </select>
                                            </td>
                                            {/* Commentaires */}
                                            <td className="p-2">
                                                <input type="text" placeholder="Notes..." className="bg-[#F9FAFB] border border-transparent group-hover:border-slate-300 rounded text-[11px] py-1 px-1 outline-none focus:bg-white focus:border-blue-500 w-[100px]" />
                                            </td>
                                            {/* Actions */}
                                            <td className="p-2 text-center">
                                                <div className="flex justify-center gap-1">
                                                    <button className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:border-blue-500 hover:text-blue-500 text-slate-400 flex items-center justify-center transition-all"><Eye size={14} /></button>
                                                    <button className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:border-blue-500 hover:text-blue-500 text-slate-400 flex items-center justify-center transition-all"><Copy size={14} /></button>
                                                    <button className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:border-red-500 hover:text-red-500 text-slate-400 flex items-center justify-center transition-all"><Trash2 size={14} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination */}
                    <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center rounded-b-2xl">
                        <div className="text-xs text-slate-500 font-medium">
                            Affichage de <strong>{candidates.length > 0 ? 1 : 0}-{candidates.length}</strong> sur <strong>{candidates.length}</strong> résultats
                        </div>
                        <div className="flex gap-2 items-center">
                            <select className="px-2 py-1 border border-slate-300 rounded-lg text-xs bg-white text-slate-600 outline-none">
                                <option>10 par page</option>
                                <option>25 par page</option>
                                <option>50 par page</option>
                            </select>
                            <div className="flex gap-1">
                                <button className="w-8 h-8 flex items-center justify-center border border-slate-300 bg-white rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50">←</button>
                                <button className="w-8 h-8 flex items-center justify-center border border-blue-600 bg-blue-600 rounded-lg text-xs font-bold text-white shadow-sm">1</button>
                                <button className="w-8 h-8 flex items-center justify-center border border-slate-300 bg-white rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50">2</button>
                                <button className="w-8 h-8 flex items-center justify-center border border-slate-300 bg-white rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50">→</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Floating Save Indicator */}
                <div className="fixed bottom-6 right-6 bg-white border border-emerald-100 shadow-xl rounded-xl px-4 py-3 flex items-center gap-3 animate-slide-up z-50">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                        <Save size={16} />
                    </div>
                    <div>
                        <div className="text-xs font-bold text-slate-800">Modifications enregistrées</div>
                        <div className="text-[10px] text-slate-500">Dernière sauvegarde: À l'instant</div>
                    </div>
                </div>
            </div>
        );
    }

    // RH Fiches Entreprise View
    if (activeSubView === 'rh-fiche') {
        return (
            <div className="animate-slide-in pb-20 font-sans">
                {/* Hero Section */}
                <div className="bg-gradient-to-br from-[#0D9488] via-[#14B8A6] to-[#0D9488] rounded-3xl p-8 mb-8 text-white relative overflow-hidden shadow-xl border border-white/10">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                    <div className="relative z-10 flex justify-between items-center flex-wrap gap-6">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-inner border border-white/10">
                                <Building size={32} />
                            </div>
                            <div>
                                <h1 className="text-3xl font-black mb-1 tracking-tight">Gestion des Entreprises</h1>
                                <p className="opacity-90 text-sm font-medium">Suivi des partenaires et des fiches de renseignement entreprise</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button className="flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-all text-sm font-bold backdrop-blur-sm">
                                <Plus size={18} /> Nouvelle Entreprise
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-all">
                        <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shadow-inner">
                            <Building size={28} />
                        </div>
                        <div>
                            <div className="text-3xl font-black text-slate-800">{companies.length}</div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Entreprises</div>
                        </div>
                    </div>
                    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-all">
                        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">
                            <Users size={28} />
                        </div>
                        <div>
                            <div className="text-3xl font-black text-slate-800">{companies.filter(c => c.fields?.recordIdetudiant).length}</div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Avec Alternants</div>
                        </div>
                    </div>
                    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-all">
                        <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-inner">
                            <Clock size={28} />
                        </div>
                        <div>
                            <div className="text-3xl font-black text-slate-800">{companies.filter(c => !c.fields?.['N de bon de commande']).length}</div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">BC en attente</div>
                        </div>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200 mb-6 flex justify-between items-center flex-wrap gap-4 shadow-sm">
                    <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-2 px-4 py-2.5 bg-[#F3F4F6] border border-transparent rounded-xl w-80 focus-within:bg-white focus-within:border-teal-500/50 focus-within:shadow-sm focus-within:ring-2 focus-within:ring-teal-500/10 transition-all">
                            <Search size={18} className="text-slate-400" />
                            <input type="text" placeholder="Rechercher par nom ou SIRET..." className="bg-transparent border-none outline-none text-sm w-full text-slate-700 placeholder:text-slate-400 font-medium" />
                        </div>
                    </div>
                </div>

                {/* Table Container */}
                <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto max-h-[70vh]">
                        <table className="w-full border-collapse">
                            <thead className="bg-gradient-to-r from-[#0D9488] to-[#14B8A6] text-white sticky top-0 z-10">
                                <tr>
                                    {[
                                        "Entreprise", "Localisation", "Contact", "Maître d'Apprentissage", "Contrat", "OPCO", "Actions"
                                    ].map((header) => (
                                        <th key={header} className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-widest whitespace-nowrap">
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    <tr><td colSpan={7} className="p-12 text-center text-slate-500"><Loader2 className="animate-spin mx-auto mb-4 text-teal-500" size={32} />Chargement des entreprises...</td></tr>
                                ) : companies.length === 0 ? (
                                    <tr><td colSpan={7} className="p-12 text-center text-slate-500">Aucune entreprise trouvée</td></tr>
                                ) : (
                                    companies.map((c: any, idx: number) => {
                                        const f = c.fields || {};
                                        return (
                                            <tr key={c.id || idx} className="hover:bg-teal-50/30 transition-colors group">
                                                {/* Entreprise */}
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-slate-800 text-sm">{f['Raison sociale entreprise'] || 'N/A'}</span>
                                                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-tighter">SIRET: {f['SIRET de lentreprise'] || 'N/A'}</span>
                                                    </div>
                                                </td>
                                                {/* Localisation */}
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-semibold text-slate-600">{f['Ville entreprise'] || 'N/A'}</span>
                                                        <span className="text-[10px] text-slate-400">{f['Code postal entreprise'] || ''}</span>
                                                    </div>
                                                </td>
                                                {/* Contact */}
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center gap-1.5 text-[11px] text-slate-600 font-medium">
                                                            <Mail size={12} className="text-slate-300" /> {f['E-mail entreprise'] || 'N/A'}
                                                        </div>
                                                        <div className="flex items-center gap-1.5 text-[11px] text-slate-600 font-medium">
                                                            <Phone size={12} className="text-slate-300" /> {f['Numéro de téléphone entreprise'] || 'N/A'}
                                                        </div>
                                                    </div>
                                                </td>
                                                {/* Maître d'Apprentissage */}
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-bold text-slate-700">{f['Prenom du maitre dapprentissage']} {f['Nom du maitre dapprentissage']}</span>
                                                        <span className="text-[10px] text-slate-400 italic">{f['Fonction maitre dapprentissage'] || 'Tuteur'}</span>
                                                    </div>
                                                </td>
                                                {/* Contrat */}
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-bold text-teal-600">{f['Poste occupé'] || 'N/A'}</span>
                                                        <span className="text-[10px] text-slate-400">{f['Type de contrat']} • {f['Nombre de mois du contrat']} mois</span>
                                                    </div>
                                                </td>
                                                {/* OPCO */}
                                                <td className="px-6 py-4">
                                                    <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-black uppercase tracking-wider border border-slate-200">
                                                        {f['Nom de lOPCO'] || 'N/A'}
                                                    </span>
                                                </td>
                                                {/* Actions */}
                                                <td className="px-6 py-4">
                                                    <div className="flex gap-2">
                                                        <button className="w-8 h-8 rounded-xl border border-slate-200 bg-white hover:border-teal-500 hover:text-teal-500 text-slate-400 flex items-center justify-center transition-all shadow-sm"><Eye size={16} /></button>
                                                        <button className="w-8 h-8 rounded-xl border border-slate-200 bg-white hover:border-teal-500 hover:text-teal-500 text-slate-400 flex items-center justify-center transition-all shadow-sm"><FileText size={16} /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }

    // Default RH View (Dashboard or Fallback)
    if (activeSubView === 'rh-dashboard') {
        return (
            <div className="animate-slide-in pb-20 font-sans">
                {/* Hero Section */}
                <div className="bg-gradient-to-br from-[#4F46E5] via-[#6366F1] to-[#4F46E5] rounded-3xl p-8 mb-8 text-white relative overflow-hidden shadow-xl border border-white/10">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                    <div className="relative z-10 flex justify-between items-center flex-wrap gap-6">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-inner border border-white/10">
                                <Users size={32} />
                            </div>
                            <div>
                                <h1 className="text-3xl font-black mb-1 tracking-tight">Tableau de Bord RH</h1>
                                <p className="opacity-90 text-sm font-medium">Vue d'ensemble du recrutement et de l'alternance</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button className="flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-all text-sm font-bold backdrop-blur-sm">
                                <Download size={18} /> Rapport Complet
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
                    {[
                        { label: 'Total Étudiants', value: rhStats?.total_etudiants || 0, icon: Users, color: 'indigo' },
                        { label: 'Fiches Entreprise', value: rhStats?.total_fiches_entreprise || 0, icon: Briefcase, color: 'emerald' },
                        { label: 'CERFA Signés', value: rhStats?.etudiants_avec_cerfa || 0, icon: FileText, color: 'blue' },
                        { label: 'Sans Documents', value: rhStats?.etudiants_sans_documents || 0, icon: AlertCircle, color: 'rose' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                            <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                <stat.icon size={24} />
                            </div>
                            <div className="text-3xl font-black text-slate-800 mb-1">{stat.value}</div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Rates & Progress */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                        <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3">
                            <CheckCircle2 className="text-emerald-500" /> Taux de Complétion
                        </h3>
                        <div className="space-y-8">
                            {[
                                { label: 'Taux CERFA', value: rhStats?.taux_cerfa || 0, color: 'blue' },
                                { label: 'Taux Dossier Complet', value: rhStats?.taux_dossier_complet || 0, color: 'emerald' },
                                { label: 'Taux Fiche Renseignement', value: rhStats?.taux_fiche_renseignement || 0, color: 'indigo' },
                            ].map((rate, i) => (
                                <div key={i}>
                                    <div className="flex justify-between items-end mb-3">
                                        <span className="text-sm font-bold text-slate-600">{rate.label}</span>
                                        <span className={`text-lg font-black text-${rate.color}-600`}>{rate.value}%</span>
                                    </div>
                                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full bg-${rate.color}-500 rounded-full transition-all duration-1000`}
                                            style={{ width: `${rate.value}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex flex-col justify-center items-center text-center">
                        <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mb-6">
                            <AlertCircle size={40} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-800 mb-2">Attention Requise</h3>
                        <p className="text-slate-500 mb-6 max-w-xs">
                            <strong>{rhStats?.etudiants_sans_documents || 0} étudiants</strong> n'ont pas encore transmis leurs documents obligatoires.
                        </p>
                        <button className="px-8 py-4 bg-rose-500 text-white rounded-2xl font-bold hover:bg-rose-600 shadow-lg shadow-rose-500/20 transition-all">
                            Relancer les étudiants
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Fallback/Default
    return (
        <div className="animate-slide-in">
            <h1 className="text-2xl font-bold mb-4 text-slate-800">Ressources Humaines</h1>
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