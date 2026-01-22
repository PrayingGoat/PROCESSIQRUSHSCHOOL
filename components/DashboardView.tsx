import React, { useState, useEffect } from 'react';
import {
    Users,
    Search,
    Calendar,
    CheckCircle2,
    FileText,
    Loader2,
    Eye,
    Edit,
    LayoutGrid,
    List,
    Download,
    Plus,
    Filter,
    ArrowUpRight,
    ArrowDownRight,
    MoreHorizontal,
    Mail,
    Phone,
    MapPin,
    User,
    GraduationCap,
    Clock,
    ExternalLink,
    ChevronLeft,
    ArrowRight
} from 'lucide-react';
import { ViewId } from '../types';
import { api } from '../services/api';

interface DashboardViewProps {
    activeSubView: ViewId;
}

const DashboardView: React.FC<DashboardViewProps> = ({ activeSubView }) => {
    const [candidates, setCandidates] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterFormation, setFilterFormation] = useState('');
    const [filterRupture, setFilterRupture] = useState('');
    const [filterCV, setFilterCV] = useState('');

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
        const filteredStudents = studentsToPlace.filter(raw => {
            const c = getC(raw);
            const matchesSearch = (c.nom + ' ' + c.prenom).toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.telephone.includes(searchQuery);
            const matchesFormation = !filterFormation || c.formation.toLowerCase().includes(filterFormation.toLowerCase());
            // Note: Rupture and CV filters would need actual data fields which might not be in getC yet
            return matchesSearch && matchesFormation;
        });

        return (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Hero Section */}
                <div className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-[2rem] p-8 mb-8 text-white shadow-xl shadow-rose-500/20 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-white/20 transition-all duration-700"></div>
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-inner">
                                <Users size={32} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-black tracking-tight mb-1">Élèves à placer</h1>
                                <p className="text-rose-100 font-medium">Étudiants en recherche d'alternance ou suite à une rupture de contrat</p>
                            </div>
                        </div>
                        <div className="flex gap-3 w-full md:w-auto">
                            <button className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-rose-600 rounded-2xl font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all">
                                <Plus size={20} />
                                Ajouter un élève
                            </button>
                            <button className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-rose-400/30 text-white border border-rose-400/50 rounded-2xl font-bold backdrop-blur-md hover:bg-rose-400/40 transition-all">
                                <Download size={20} />
                                Exporter
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[
                        { label: 'Élèves à placer', value: studentsToPlace.length, icon: Users, color: 'rose', trend: 'Urgent', trendIcon: ArrowDownRight },
                        { label: 'En cours de placement', value: 1, icon: Clock, color: 'amber', trend: 'En cours', trendIcon: Clock },
                        { label: 'CV à actualiser', value: 2, icon: FileText, color: 'blue', trend: 'À mettre à jour', trendIcon: ArrowDownRight },
                        { label: 'Entretiens programmés', value: 5, icon: CheckCircle2, color: 'emerald', trend: '+2 ce mois', trendIcon: ArrowUpRight },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-50 text-${stat.color}-500 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                    <stat.icon size={24} />
                                </div>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${stat.color === 'rose' ? 'bg-rose-50 text-rose-600' :
                                    stat.color === 'amber' ? 'bg-amber-50 text-amber-600' :
                                        stat.color === 'blue' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
                                    }`}>
                                    {stat.trendIcon && <stat.trendIcon size={12} />}
                                    {stat.trend}
                                </span>
                            </div>
                            <div className="text-4xl font-black text-slate-800 mb-1">{stat.value}</div>
                            <div className="text-sm font-bold text-slate-400 uppercase tracking-wide">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Toolbar */}
                <div className="bg-white rounded-[2rem] p-4 mb-8 border border-slate-100 shadow-sm flex flex-col lg:flex-row justify-between items-center gap-4">
                    <div className="flex flex-col md:flex-row items-center gap-4 w-full lg:w-auto">
                        <div className="relative w-full md:w-80 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-rose-500 transition-colors" size={20} />
                            <input
                                type="text"
                                placeholder="Rechercher un élève..."
                                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-rose-500 outline-none transition-all font-medium"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                            <select
                                className="px-4 py-3.5 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-rose-500 outline-none transition-all font-bold text-sm text-slate-600 cursor-pointer"
                                value={filterFormation}
                                onChange={(e) => setFilterFormation(e.target.value)}
                            >
                                <option value="">Toutes formations</option>
                                <option value="mco">BTS MCO</option>
                                <option value="ndrc">BTS NDRC</option>
                                <option value="bachelor">Bachelor RDC</option>
                                <option value="ntc">TP NTC</option>
                            </select>
                            <select className="px-4 py-3.5 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-rose-500 outline-none transition-all font-bold text-sm text-slate-600 cursor-pointer">
                                <option value="">Type de rupture</option>
                                <option value="amiable">Rupture amiable</option>
                                <option value="demission">Démission</option>
                                <option value="periode-essai">Fin période d'essai</option>
                            </select>
                            <select className="px-4 py-3.5 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-rose-500 outline-none transition-all font-bold text-sm text-slate-600 cursor-pointer">
                                <option value="">CV à jour</option>
                                <option value="oui">Oui</option>
                                <option value="non">Non</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl">
                        <button
                            onClick={() => setViewMode('table')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${viewMode === 'table' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <List size={18} />
                            Liste
                        </button>
                        <button
                            onClick={() => setViewMode('cards')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${viewMode === 'cards' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <LayoutGrid size={18} />
                            Cartes
                        </button>
                    </div>
                </div>

                {/* Content View */}
                {viewMode === 'table' ? (
                    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50 border-b border-slate-100">
                                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Formation</th>
                                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Étudiant</th>
                                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Ville</th>
                                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Contact</th>
                                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">CV</th>
                                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {filteredStudents.map((raw) => {
                                        const c = getC(raw);
                                        return (
                                            <tr key={c.id} className="hover:bg-slate-50/80 transition-colors group">
                                                <td className="px-6 py-5">
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${c.formation.includes('MCO') ? 'bg-blue-50 text-blue-600' :
                                                        c.formation.includes('NDRC') ? 'bg-emerald-50 text-emerald-600' :
                                                            c.formation.includes('RDC') ? 'bg-purple-50 text-purple-600' : 'bg-orange-50 text-orange-600'
                                                        }`}>
                                                        {c.formation}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm">
                                                            {c.nom[0]}{c.prenom[0]}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-slate-800">{c.nom} {c.prenom}</div>
                                                            <div className="text-xs text-slate-400 font-medium">{c.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-2 text-slate-600 font-medium text-sm">
                                                        <MapPin size={14} className="text-slate-300" />
                                                        {c.ville}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-2 text-slate-600 font-medium text-sm">
                                                        <Phone size={14} className="text-slate-300" />
                                                        {c.telephone}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <a href="#" className="inline-flex items-center gap-2 text-rose-500 hover:text-rose-600 font-bold text-xs transition-colors">
                                                        <FileText size={14} />
                                                        Voir CV
                                                    </a>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-200 hover:shadow-sm transition-all"><Eye size={18} /></button>
                                                        <button className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-200 hover:shadow-sm transition-all"><Edit size={18} /></button>
                                                        <button className="p-2.5 rounded-xl bg-rose-500 text-white shadow-lg shadow-rose-500/20 hover:bg-rose-600 transition-all"><CheckCircle2 size={18} /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <div className="px-8 py-5 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center">
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                Affichage de <span className="text-slate-800">{filteredStudents.length}</span> élèves
                            </div>
                            <div className="flex gap-2">
                                <button className="p-2 rounded-xl bg-white border border-slate-200 text-slate-400 disabled:opacity-50" disabled><ChevronLeft size={20} /></button>
                                <button className="px-4 py-2 rounded-xl bg-rose-500 text-white font-bold text-sm">1</button>
                                <button className="p-2 rounded-xl bg-white border border-slate-200 text-slate-400 disabled:opacity-50" disabled><ArrowRight size={20} /></button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredStudents.map((raw) => {
                            const c = getC(raw);
                            return (
                                <div key={c.id} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-rose-500/10 transition-colors"></div>

                                    <div className="flex justify-between items-start mb-6 relative z-10">
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-rose-500/20">
                                            {c.nom[0]}{c.prenom[0]}
                                        </div>
                                        <span className="px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-[10px] font-black uppercase tracking-wider">Rupture amiable</span>
                                    </div>

                                    <div className="mb-6 relative z-10">
                                        <h3 className="text-xl font-black text-slate-800 mb-1">{c.nom} {c.prenom}</h3>
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${c.formation.includes('MCO') ? 'bg-blue-50 text-blue-600' :
                                            c.formation.includes('NDRC') ? 'bg-emerald-50 text-emerald-600' :
                                                c.formation.includes('RDC') ? 'bg-purple-50 text-purple-600' : 'bg-orange-50 text-orange-600'
                                            }`}>
                                            {c.formation}
                                        </span>
                                    </div>

                                    <div className="space-y-4 mb-8 relative z-10">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider">Localisation</span>
                                            <span className="text-slate-700 font-bold">{c.ville}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider">Contact</span>
                                            <span className="text-slate-700 font-bold">{c.telephone}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider">CV à jour</span>
                                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-md text-[10px] font-black uppercase">Oui</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 relative z-10">
                                        <button className="flex-1 py-3.5 bg-slate-100 text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-all flex items-center justify-center gap-2">
                                            <Eye size={18} />
                                            Détails
                                        </button>
                                        <button className="flex-1 py-3.5 bg-rose-500 text-white rounded-2xl font-bold text-sm hover:bg-rose-600 shadow-lg shadow-rose-500/20 transition-all flex items-center justify-center gap-2">
                                            <CheckCircle2 size={18} />
                                            Placer
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
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
                        <div className="w-12 h-12 rounded-xl bg-[#A78BFA] flex items-center justify-center text-white"><Users size={24} /></div>
                        <span className="text-[#A78BFA] font-bold text-sm">À placer</span>
                    </div>
                    <div className="text-4xl font-bold text-[#8B5CF6] mb-1">{studentsToPlace.length}</div>
                    <div className="text-[#A78BFA] text-sm flex items-center gap-1"><Users size={12} /> Étudiants</div>
                </div>

                <div className="bg-[#F0FFF4] rounded-2xl p-6 border-2 border-[#C6F6D5]">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-xl bg-[#86EFAC] flex items-center justify-center text-white"><CheckCircle2 size={24} /></div>
                        <span className="text-[#86EFAC] font-bold text-sm">En alternance</span>
                    </div>
                    <div className="text-4xl font-bold text-[#6EE7B7] mb-1">{studentsPlaced.length}</div>
                    <div className="text-[#86EFAC] text-sm flex items-center gap-1"><CheckCircle2 size={12} /> Placés</div>
                </div>
            </div>
        </div>
    );
};

export default DashboardView;