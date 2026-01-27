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
    ArrowRight,
    X,
    FileCheck,
    FileX,
    UserCircle,
    Save,
    Building,
    RefreshCw,
    AlertCircle,
    CheckCircle,
    Trash2,
    ArrowLeft
} from 'lucide-react';
import { ViewId } from '../types';
import { api } from '../services/api';
import Button from './ui/Button';
import Input from './ui/Input';
import Select from './ui/Select';
import Card from './ui/Card';

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
    const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);

    const handleViewDetails = async (id: string) => {
        setDetailsLoading(true);
        setIsModalOpen(true);
        setIsEditing(false);
        try {
            const data = await api.getCandidateById(id);
            setSelectedCandidate(data);
        } catch (error) {
            console.error("Failed to fetch candidate details", error);
        } finally {
            setDetailsLoading(false);
        }
    };

    const handleEdit = async (id: string) => {
        // Find candidate in local state first for instant pre-fill
        const localRaw = candidates.find(cand => {
            const c = getC(cand);
            return c.id === id;
        });

        if (localRaw) {
            const c = getC(localRaw);
            setSelectedCandidate(localRaw);
            setEditForm({
                prenom: c.prenom || "",
                nom_naissance: c.nom || "",
                email: c.email || "",
                telephone: c.telephone || "",
                formation_souhaitee: c.formation || "",
                ville: c.ville || "",
                entreprise_d_accueil: c.entreprise || "Non",
            });
        }

        setDetailsLoading(true);
        setIsModalOpen(true);
        setIsEditing(true);

        try {
            const data = await api.getCandidateById(id);
            setSelectedCandidate(data);
            const c = getC(data);
            setEditForm({
                prenom: c.prenom || "",
                nom_naissance: c.nom || "",
                email: c.email || "",
                telephone: c.telephone || "",
                formation_souhaitee: c.formation || "",
                ville: c.ville || "",
                entreprise_d_accueil: c.entreprise || "Non",
            });
        } catch (error) {
            console.error("Failed to fetch candidate for edit", error);
        } finally {
            setDetailsLoading(false);
        }
    };

    const handleSaveEdit = async () => {
        if (!selectedCandidate || !editForm) return;
        setIsSaving(true);
        try {
            // Clean the form: convert empty strings to null
            const cleanedForm = Object.keys(editForm).reduce((acc: any, key) => {
                acc[key] = editForm[key] === "" ? null : editForm[key];
                return acc;
            }, {});

            // Merge the changes into the candidate object
            const updatedCandidate = {
                ...selectedCandidate,
                ...cleanedForm,
                informations_personnelles: {
                    ...(selectedCandidate.informations_personnelles || {}),
                    ...cleanedForm
                }
            };

            await api.updateCandidate(selectedCandidate.id, updatedCandidate);

            // Refresh list
            const data = await api.getAllCandidates();
            setCandidates(data);
            setIsModalOpen(false);
        } catch (error) {
            console.error("Failed to save candidate", error);
            alert("Erreur lors de la sauvegarde");
        } finally {
            setIsSaving(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [candidatesData, fichesData] = await Promise.all([
                    api.getAllCandidates(),
                    api.getEtudiantsFiches(false)
                ]);

                // Merge data based on record_id/id
                const mergedData = candidatesData.map((c: any) => {
                    const candidateId = c.id || (c.fields && (c.fields.id || c.fields.record_id)) || c.record_id;
                    const fiche = fichesData.etudiants?.find((f: any) => f.record_id === candidateId);
                    return {
                        ...c,
                        has_cerfa: fiche?.has_cerfa || false,
                        has_fiche_renseignement: fiche?.has_fiche_renseignement || false,
                        has_cv: fiche?.has_cv || false
                    };
                });

                setCandidates(mergedData);
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
        const info = c.informations_personnelles || {};

        // Handle alternance as boolean or string
        let alt = d.alternance || info.alternance;
        if (alt === true) alt = "Oui";
        else if (alt === false) alt = "Non";
        else alt = alt || "Non";

        return {
            id: c.id || d.id || d.record_id,
            prenom: info.prenom || d['Prénom'] || d.prenom || d.firstname || "",
            nom: info.nom_naissance || d['NOM de naissance'] || d.nom_naissance || d.nom || d.lastname || "",
            email: info.email || d['E-mail'] || d.email || "",
            formation: info.formation_souhaitee || d['Formation'] || d.formation_souhaitee || d.formation || "Non renseigné",
            ville: info.ville || d['Commune de naissance'] || d.ville || d.commune_naissance || "Non renseigné",
            entreprise: info.entreprise_d_accueil || d['Entreprise daccueil'] || d.entreprise_d_accueil || d.entreprise || "En recherche",
            telephone: info.telephone || d['Téléphone'] || d.telephone || "",
            alternance: alt,
            has_cerfa: c.has_cerfa,
            has_fiche_renseignement: c.has_fiche_renseignement,
            has_cv: c.has_cv
        };
    };

    const isPlaced = (c: any) => {
        const data = getC(c);
        if (data.alternance === 'Oui') return true;
        const ent = data.entreprise;
        return ent && ent !== 'Non' && ent !== 'En recherche' && ent !== 'En cours' && ent !== 'null';
    };

    const studentsToPlace = candidates.filter(c => !isPlaced(c));
    const studentsPlaced = candidates.filter(c => isPlaced(c));

    // Real stats for "À placer"
    const statsToPlace = {
        total: studentsToPlace.length,
        enCours: studentsToPlace.filter(s => getC(s).entreprise === 'En recherche').length,
        cvAActualiser: studentsToPlace.filter(s => !getC(s).has_cv).length
    };

    // Real stats for "En alternance"
    const statsPlaced = {
        total: studentsPlaced.length,
        contratsSignes: studentsPlaced.filter(s => getC(s).has_cerfa).length,
        missionsValidees: studentsPlaced.filter(s => getC(s).has_fiche_renseignement).length,
        entreprisesPartenaires: new Set(studentsPlaced.map(s => getC(s).entreprise)).size
    };

    const renderMainContent = () => {
        if (loading) {
            return (
                <div className="flex h-full items-center justify-center py-20">
                    <Loader2 className="animate-spin text-blue-500" size={48} />
                </div>
            );
        }

        // --- SUB-VIEW: PLACER ---
        if (activeSubView === 'commercial-placer') {
            const filteredStudents = studentsToPlace.filter(raw => {
                const c = getC(raw);
                const matchesSearch = (c.nom + ' ' + c.prenom).toLowerCase().includes(searchQuery.toLowerCase()) ||
                    c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    c.telephone.includes(searchQuery);
                const matchesFormation = !filterFormation || c.formation.toLowerCase().includes(filterFormation.toLowerCase());
                return matchesSearch && matchesFormation;
            });

            return (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {/* Hero Section */}
                    <div className="bg-gradient-to-br from-rose-500 via-rose-600 to-orange-600 rounded-[2.5rem] p-10 mb-10 text-white shadow-2xl shadow-rose-500/30 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-3xl group-hover:bg-white/20 transition-all duration-1000"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-400/20 rounded-full -ml-32 -mb-32 blur-3xl"></div>

                        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-8">
                            <div className="flex items-center gap-8">
                                <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-xl border border-white/40 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500">
                                    <Users size={40} className="text-white drop-shadow-md" />
                                </div>
                                <div>
                                    <h1 className="text-4xl font-black tracking-tighter mb-2 drop-shadow-sm">Élèves à placer</h1>
                                    <p className="text-rose-50 font-semibold text-lg opacity-90 max-w-xl leading-relaxed">
                                        Accélérez le placement de nos talents. Suivez et accompagnez les étudiants en recherche active.
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-3 w-full lg:w-auto justify-center lg:justify-end">
                                <Button variant="secondary" className="bg-white text-rose-600 hover:bg-slate-50" leftIcon={<Plus size={20} strokeWidth={3} />}>
                                    Ajouter un élève
                                </Button>
                                <Button variant="outline" className="border-rose-300/30 text-white hover:bg-rose-400/20" leftIcon={<Download size={20} />}>
                                    Exporter
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                        {[
                            { label: 'Élèves à placer', value: statsToPlace.total, icon: Users, color: 'rose', trend: 'Urgent', trendIcon: ArrowDownRight },
                            { label: 'En cours de placement', value: statsToPlace.enCours, icon: Clock, color: 'amber', trend: 'En cours', trendIcon: Clock },
                            { label: 'CV à actualiser', value: statsToPlace.cvAActualiser, icon: FileText, color: 'blue', trend: 'À mettre à jour', trendIcon: ArrowDownRight },
                            { label: 'Entretiens programmés', value: 0, icon: CheckCircle2, color: 'emerald', trend: 'À suivre', trendIcon: ArrowUpRight },
                        ].map((stat, i) => (
                            <div key={i} className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group relative overflow-hidden">
                                <div className={`absolute -right-4 -top-4 w-24 h-24 bg-${stat.color}-500/5 rounded-full blur-2xl group-hover:bg-${stat.color}-500/10 transition-colors duration-500`}></div>
                                <div className="flex justify-between items-start mb-6 relative z-10">
                                    <div className={`w-14 h-14 rounded-2xl bg-${stat.color}-50 text-${stat.color}-500 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-inner`}>
                                        <stat.icon size={28} />
                                    </div>
                                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-sm ${stat.color === 'rose' ? 'bg-rose-50 text-rose-600' :
                                        stat.color === 'amber' ? 'bg-amber-50 text-amber-600' :
                                            stat.color === 'blue' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
                                        }`}>
                                        {stat.trendIcon && <stat.trendIcon size={14} strokeWidth={3} />}
                                        {stat.trend}
                                    </span>
                                </div>
                                <div className="text-5xl font-black text-slate-800 mb-2 tracking-tighter relative z-10">{stat.value}</div>
                                <div className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] relative z-10">{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Toolbar */}
                    <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-6 mb-10 border border-white/20 shadow-xl flex flex-wrap justify-between items-center gap-6">
                        <div className="flex flex-wrap items-center gap-6 flex-1 min-w-[300px]">
                            <div className="relative flex-1 min-w-[240px] max-w-md group">
                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-rose-500 transition-colors duration-300" size={22} />
                                <input
                                    type="text"
                                    placeholder="Rechercher un élève..."
                                    className="w-full pl-14 pr-6 py-4 bg-slate-50/50 border-2 border-transparent rounded-[1.5rem] focus:bg-white focus:border-rose-500 focus:shadow-lg focus:shadow-rose-500/10 outline-none transition-all duration-300 font-bold text-slate-700 placeholder:text-slate-400"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-wrap items-center gap-4">
                                <select
                                    className="px-6 py-4 bg-slate-50/50 border-2 border-transparent rounded-[1.5rem] focus:bg-white focus:border-rose-500 outline-none transition-all duration-300 font-black text-sm text-slate-600 cursor-pointer hover:bg-slate-100"
                                    value={filterFormation}
                                    onChange={(e) => setFilterFormation(e.target.value)}
                                >
                                    <option value="">Toutes formations</option>
                                    <option value="mco">BTS MCO</option>
                                    <option value="ndrc">BTS NDRC</option>
                                    <option value="bachelor">Bachelor RDC</option>
                                    <option value="ntc">TP NTC</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 p-1.5 bg-slate-100/50 rounded-[1.5rem] border border-slate-200/50 shrink-0">
                            <button
                                onClick={() => setViewMode('table')}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-[1.2rem] font-black text-xs md:text-sm transition-all duration-300 ${viewMode === 'table' ? 'bg-white text-rose-600 shadow-lg shadow-rose-500/10' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                <List size={18} strokeWidth={3} />
                                Liste
                            </button>
                            <button
                                onClick={() => setViewMode('cards')}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-[1.2rem] font-black text-xs md:text-sm transition-all duration-300 ${viewMode === 'cards' ? 'bg-white text-rose-600 shadow-lg shadow-rose-500/10' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                <LayoutGrid size={18} strokeWidth={3} />
                                Cartes
                            </button>
                        </div>
                    </div>

                    {/* Content View */}
                    {viewMode === 'table' ? (
                        <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-white/20 shadow-2xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50/50 border-b border-slate-100">
                                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Formation</th>
                                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Étudiant</th>
                                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Ville</th>
                                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Contact</th>
                                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">CV</th>
                                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {filteredStudents.map((raw) => {
                                            const c = getC(raw);
                                            return (
                                                <tr key={c.id} className="hover:bg-slate-50/50 transition-colors group">
                                                    <td className="px-8 py-6">
                                                        <span className={`inline-flex items-center px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border ${c.formation.includes('MCO') ? 'bg-blue-50 text-blue-600 border-blue-100/50' :
                                                            c.formation.includes('NDRC') ? 'bg-emerald-50 text-emerald-600 border-emerald-100/50' :
                                                                c.formation.includes('RDC') ? 'bg-purple-50 text-purple-600 border-purple-100/50' : 'bg-orange-50 text-orange-600 border-orange-100/50'
                                                            }`}>
                                                            {c.formation}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-500 font-black text-lg shadow-inner group-hover:scale-110 transition-transform duration-300">
                                                                {c.nom[0]}{c.prenom[0]}
                                                            </div>
                                                            <div>
                                                                <div className="font-black text-slate-800 text-base">{c.nom} {c.prenom}</div>
                                                                <div className="text-xs font-bold text-slate-400">{c.email}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-2 text-slate-600 font-bold">
                                                            <MapPin size={16} className="text-slate-300" />
                                                            {c.ville}
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-2 text-slate-600 font-bold">
                                                            <Phone size={16} className="text-slate-300" />
                                                            {c.telephone}
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <a href="#" className="inline-flex items-center gap-2 text-rose-500 hover:text-rose-600 font-black text-[10px] uppercase tracking-wider transition-colors">
                                                            <FileText size={16} />
                                                            Voir CV
                                                        </a>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                                                            <button
                                                                onClick={() => handleViewDetails(c.id)}
                                                                className="p-3 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-200 hover:shadow-lg hover:shadow-rose-500/10 transition-all duration-300"
                                                            >
                                                                <Eye size={20} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleEdit(c.id)}
                                                                className="p-3 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-200 hover:shadow-lg hover:shadow-rose-500/10 transition-all duration-300"
                                                            >
                                                                <Edit size={20} />
                                                            </button>
                                                            <button className="p-3 rounded-xl bg-rose-500 text-white shadow-lg shadow-rose-500/20 hover:bg-rose-600 hover:-translate-y-0.5 active:scale-95 transition-all duration-300">
                                                                <CheckCircle2 size={20} strokeWidth={3} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
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
                                        </div>

                                        <div className="flex gap-3 relative z-10">
                                            <Button variant="secondary" className="flex-1" onClick={() => handleViewDetails(c.id)} leftIcon={<Eye size={18} />}>
                                                Détails
                                            </Button>
                                            <Button variant="danger" className="flex-1" leftIcon={<CheckCircle2 size={18} />}>
                                                Placer
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )
                    }
                </div >
            );
        }

        // --- SUB-VIEW: ALTERNANCE ---
        if (activeSubView === 'commercial-alternance') {
            const filteredStudents = studentsPlaced.filter(raw => {
                const c = getC(raw);
                const matchesSearch = (c.nom + ' ' + c.prenom).toLowerCase().includes(searchQuery.toLowerCase()) ||
                    c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    c.telephone.includes(searchQuery);
                const matchesFormation = !filterFormation || c.formation.toLowerCase().includes(filterFormation.toLowerCase());
                return matchesSearch && matchesFormation;
            });

            return (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {/* Hero Section */}
                    <div className="bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 rounded-[2.5rem] p-10 mb-10 text-white shadow-2xl shadow-indigo-500/30 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-3xl group-hover:bg-white/20 transition-all duration-1000"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400/20 rounded-full -ml-32 -mb-32 blur-3xl"></div>

                        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-8">
                            <div className="flex items-center gap-8">
                                <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-xl border border-white/40 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500">
                                    <CheckCircle2 size={40} className="text-white drop-shadow-md" />
                                </div>
                                <div>
                                    <h1 className="text-4xl font-black tracking-tighter mb-2 drop-shadow-sm">Élèves en alternance</h1>
                                    <p className="text-indigo-50 font-semibold text-lg opacity-90 max-w-xl leading-relaxed">
                                        Félicitations à nos alternants. Suivez leur progression et gérez les documents de placement.
                                    </p>
                                </div>
                            </div>
                            <Button variant="secondary" className="bg-white text-indigo-600 hover:bg-slate-50" leftIcon={<Download size={24} />}>
                                Exporter la liste
                            </Button>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                        {[
                            { label: 'Total Alternants', value: statsPlaced.total, icon: Users, color: 'indigo', trend: 'Actif', trendIcon: CheckCircle2 },
                            { label: 'Contrats signés', value: statsPlaced.contratsSignes, icon: FileCheck, color: 'emerald', trend: `${statsPlaced.total > 0 ? Math.round((statsPlaced.contratsSignes / statsPlaced.total) * 100) : 0}%`, trendIcon: ArrowUpRight },
                            { label: 'Entreprises partenaires', value: statsPlaced.entreprisesPartenaires, icon: Building, color: 'blue', trend: 'Diversifié', trendIcon: MapPin },
                            { label: 'Missions validées', value: statsPlaced.missionsValidees, icon: GraduationCap, color: 'purple', trend: `${statsPlaced.total > 0 ? Math.round((statsPlaced.missionsValidees / statsPlaced.total) * 100) : 0}%`, trendIcon: CheckCircle2 },
                        ].map((stat, i) => (
                            <div key={i} className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group relative overflow-hidden">
                                <div className={`absolute -right-4 -top-4 w-24 h-24 bg-${stat.color}-500/5 rounded-full blur-2xl group-hover:bg-${stat.color}-500/10 transition-colors duration-500`}></div>
                                <div className="flex justify-between items-start mb-6 relative z-10">
                                    <div className={`w-14 h-14 rounded-2xl bg-${stat.color}-50 text-${stat.color}-500 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-inner`}>
                                        <stat.icon size={28} />
                                    </div>
                                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-sm ${stat.color === 'indigo' ? 'bg-indigo-50 text-indigo-600' :
                                        stat.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
                                            stat.color === 'blue' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                                        }`}>
                                        {stat.trendIcon && <stat.trendIcon size={14} strokeWidth={3} />}
                                        {stat.trend}
                                    </span>
                                </div>
                                <div className="text-5xl font-black text-slate-800 mb-2 tracking-tighter relative z-10">{stat.value}</div>
                                <div className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] relative z-10">{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Toolbar */}
                    <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-6 mb-10 border border-white/20 shadow-xl flex flex-wrap justify-between items-center gap-6">
                        <div className="flex flex-wrap items-center gap-6 flex-1 min-w-[300px]">
                            <div className="relative flex-1 min-w-[240px] max-w-md group">
                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors duration-300" size={22} />
                                <input
                                    type="text"
                                    placeholder="Rechercher un alternant..."
                                    className="w-full pl-14 pr-6 py-4 bg-slate-50/50 border-2 border-transparent rounded-[1.5rem] focus:bg-white focus:border-indigo-500 focus:shadow-lg focus:shadow-indigo-500/10 outline-none transition-all duration-300 font-bold text-slate-700 placeholder:text-slate-400"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-wrap items-center gap-4">
                                <select
                                    className="px-6 py-4 bg-slate-50/50 border-2 border-transparent rounded-[1.5rem] focus:bg-white focus:border-indigo-500 outline-none transition-all duration-300 font-black text-sm text-slate-600 cursor-pointer hover:bg-slate-100"
                                    value={filterFormation}
                                    onChange={(e) => setFilterFormation(e.target.value)}
                                >
                                    <option value="">Toutes formations</option>
                                    <option value="mco">BTS MCO</option>
                                    <option value="ndrc">BTS NDRC</option>
                                    <option value="bachelor">Bachelor RDC</option>
                                    <option value="ntc">TP NTC</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 p-1.5 bg-slate-100/50 rounded-[1.5rem] border border-slate-200/50 shrink-0">
                            <button
                                onClick={() => setViewMode('table')}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-[1.2rem] font-black text-xs md:text-sm transition-all duration-300 ${viewMode === 'table' ? 'bg-white text-indigo-600 shadow-lg shadow-indigo-500/10' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                <List size={18} strokeWidth={3} />
                                Liste
                            </button>
                            <button
                                onClick={() => setViewMode('cards')}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-[1.2rem] font-black text-xs md:text-sm transition-all duration-300 ${viewMode === 'cards' ? 'bg-white text-indigo-600 shadow-lg shadow-indigo-500/10' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                <LayoutGrid size={18} strokeWidth={3} />
                                Cartes
                            </button>
                        </div>
                    </div>

                    {/* Content View */}
                    {viewMode === 'table' ? (
                        <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-white/20 shadow-2xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50/50 border-b border-slate-100">
                                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Formation</th>
                                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Étudiant</th>
                                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Entreprise</th>
                                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Ville</th>
                                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Contact</th>
                                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {filteredStudents.map((raw) => {
                                            const c = getC(raw);
                                            return (
                                                <tr key={c.id} className="hover:bg-slate-50/50 transition-colors group">
                                                    <td className="px-8 py-6">
                                                        <span className={`inline-flex items-center px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border ${c.formation.includes('MCO') ? 'bg-blue-50 text-blue-600 border-blue-100/50' :
                                                            c.formation.includes('NDRC') ? 'bg-emerald-50 text-emerald-600 border-emerald-100/50' :
                                                                c.formation.includes('RDC') ? 'bg-purple-50 text-purple-600 border-purple-100/50' : 'bg-orange-50 text-orange-600 border-orange-100/50'
                                                            }`}>
                                                            {c.formation}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-500 font-black text-lg shadow-inner group-hover:scale-110 transition-transform duration-300">
                                                                {c.nom[0]}{c.prenom[0]}
                                                            </div>
                                                            <div>
                                                                <div className="font-black text-slate-800 text-base">{c.nom} {c.prenom}</div>
                                                                <div className="text-xs font-bold text-slate-400">{c.email}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center shadow-inner">
                                                                <Building size={18} />
                                                            </div>
                                                            <div className="font-black text-slate-700 text-sm">{c.entreprise}</div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-2 text-slate-600 font-bold">
                                                            <MapPin size={16} className="text-slate-300" />
                                                            {c.ville}
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-2 text-slate-600 font-bold">
                                                            <Phone size={16} className="text-slate-300" />
                                                            {c.telephone}
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                                                            <button
                                                                onClick={() => handleViewDetails(c.id)}
                                                                className="p-3 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300"
                                                            >
                                                                <Eye size={20} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleEdit(c.id)}
                                                                className="p-3 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300"
                                                            >
                                                                <Edit size={20} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredStudents.map((raw) => {
                                const c = getC(raw);
                                return (
                                    <div key={c.id} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-indigo-500/10 transition-colors"></div>

                                        <div className="flex justify-between items-start mb-6 relative z-10">
                                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-indigo-500/20">
                                                {c.nom[0]}{c.prenom[0]}
                                            </div>
                                            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-wider">Contrat Actif</span>
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
                                                <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider">Entreprise</span>
                                                <span className="text-slate-700 font-bold">{c.entreprise}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider">Localisation</span>
                                                <span className="text-slate-700 font-bold">{c.ville}</span>
                                            </div>
                                        </div>

                                        <div className="flex gap-3 relative z-10">
                                            <Button variant="secondary" className="flex-1" onClick={() => handleViewDetails(c.id)} leftIcon={<Eye size={18} />}>
                                                Détails
                                            </Button>
                                            <Button variant="primary" className="flex-1" onClick={() => handleEdit(c.id)} leftIcon={<Edit size={18} />}>
                                                Modifier
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )
                    }
                </div>
            );
        }

        // Default: Dashboard / Alternance
        return (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Hero Section */}
                <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 rounded-[2.5rem] p-10 mb-10 text-white shadow-2xl shadow-indigo-500/20 group">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-white/15 transition-colors duration-700"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400/20 rounded-full -ml-32 -mb-32 blur-3xl"></div>

                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="text-center md:text-left">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-black uppercase tracking-widest mb-6">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                Système Live • Commercial
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter leading-tight">
                                Vue d'ensemble <br />
                                <span className="text-indigo-200">Commerciale</span>
                            </h2>
                            <p className="text-indigo-100 text-lg font-medium max-w-md leading-relaxed opacity-90">
                                Suivi en temps réel de vos {candidates.length} étudiants et de l'état d'avancement des placements en alternance.
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl text-center min-w-[140px] hover:bg-white/15 transition-colors">
                                <div className="text-3xl font-black mb-1">{studentsToPlace.length}</div>
                                <div className="text-[10px] font-black uppercase tracking-wider text-indigo-200">À Placer</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl text-center min-w-[140px] hover:bg-white/15 transition-colors">
                                <div className="text-3xl font-black mb-1">{studentsPlaced.length}</div>
                                <div className="text-[10px] font-black uppercase tracking-wider text-indigo-200">Placés</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-indigo-500/10 transition-colors"></div>
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                                <Users size={28} />
                            </div>
                            <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-wider">Total Étudiants</span>
                        </div>
                        <div className="text-5xl font-black text-slate-800 mb-2 tracking-tighter">{candidates.length}</div>
                        <div className="text-slate-400 text-sm font-bold flex items-center gap-2">
                            <ArrowUpRight size={16} className="text-emerald-500" />
                            <span className="text-emerald-500">+12%</span> depuis le mois dernier
                        </div>
                    </div>

                    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-rose-500/10 transition-colors"></div>
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center text-white shadow-lg shadow-rose-500/20 group-hover:scale-110 transition-transform">
                                <Users size={28} />
                            </div>
                            <span className="px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-[10px] font-black uppercase tracking-wider">En recherche</span>
                        </div>
                        <div className="text-5xl font-black text-slate-800 mb-2 tracking-tighter">{studentsToPlace.length}</div>
                        <div className="text-slate-400 text-sm font-bold flex items-center gap-2">
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                <div className="bg-rose-500 h-full rounded-full" style={{ width: `${(studentsToPlace.length / candidates.length) * 100}%` }}></div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-emerald-500/10 transition-colors"></div>
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                                <CheckCircle2 size={28} />
                            </div>
                            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-wider">Placés</span>
                        </div>
                        <div className="text-5xl font-black text-slate-800 mb-2 tracking-tighter">{studentsPlaced.length}</div>
                        <div className="text-slate-400 text-sm font-bold flex items-center gap-2">
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${(studentsPlaced.length / candidates.length) * 100}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions & Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Card title="Actions Rapides" icon={<Plus size={16} strokeWidth={3} />}>
                        <div className="grid grid-cols-2 gap-4">
                            <button className="flex flex-col items-center justify-center p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all group">
                                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <Users size={24} />
                                </div>
                                <span className="text-sm font-black text-slate-700">Nouvel Étudiant</span>
                            </button>
                            <button className="flex flex-col items-center justify-center p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all group">
                                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <Download size={24} />
                                </div>
                                <span className="text-sm font-black text-slate-700">Exporter Data</span>
                            </button>
                            <button className="flex flex-col items-center justify-center p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md hover:border-rose-200 transition-all group">
                                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <FileText size={24} />
                                </div>
                                <span className="text-sm font-black text-slate-700">Rapport Hebdo</span>
                            </button>
                            <button className="flex flex-col items-center justify-center p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md hover:border-violet-200 transition-all group">
                                <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <Calendar size={24} />
                                </div>
                                <span className="text-sm font-black text-slate-700">Planning</span>
                            </button>
                        </div>
                    </Card>

                    <Card title="Activité Récente" icon={<Clock size={16} strokeWidth={3} />}>
                        <div className="space-y-6">
                            {candidates.slice(0, 4).map((raw, i) => {
                                const c = getC(raw);
                                return (
                                    <div key={i} className="flex items-center justify-between group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 font-black text-sm group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors">
                                                {c.nom[0]}{c.prenom[0]}
                                            </div>
                                            <div>
                                                <div className="text-sm font-black text-slate-800">{c.nom} {c.prenom}</div>
                                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{c.formation}</div>
                                            </div>
                                        </div>
                                        <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                                            {i === 0 ? "À l'instant" : i === 1 ? "Il y a 2h" : "Hier"}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <Button variant="ghost" className="w-full mt-10 text-xs uppercase tracking-widest">
                            Voir tout l'historique
                        </Button>
                    </Card>
                </div>
            </div>
        );
    };

    // Main Component Return
    return (
        <div className="relative">
            {renderMainContent()}

            {/* Student Details Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl border border-white/20 flex flex-col animate-in zoom-in-95 duration-300">
                        {/* Modal Header */}
                        <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-slate-50 via-white to-slate-50 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                            <div className="relative z-10 flex items-center gap-6">
                                <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-rose-500 to-rose-600 text-white flex items-center justify-center shadow-2xl shadow-rose-500/30 group-hover:scale-110 transition-transform duration-500">
                                    <UserCircle size={40} />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black text-slate-800 tracking-tighter mb-1">
                                        {isEditing ? "Modifier le profil" : "Détails de l'étudiant"}
                                    </h2>
                                    <div className="flex items-center gap-3">
                                        <span className="px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-[10px] font-black uppercase tracking-wider border border-rose-100/50">
                                            {isEditing ? "Édition en cours" : "Consultation"}
                                        </span>
                                        <p className="text-slate-400 font-bold text-sm">
                                            {isEditing ? "Mise à jour des informations de profil" : "Informations complètes et suivi des documents"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="relative z-10 w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 hover:bg-rose-50 hover:text-rose-500 hover:rotate-90 transition-all duration-300 flex items-center justify-center group"
                            >
                                <X size={28} strokeWidth={3} />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="flex-1 overflow-y-auto p-8">
                            {detailsLoading ? (
                                <div className="flex flex-col items-center justify-center py-20 gap-4">
                                    <Loader2 className="animate-spin text-rose-500" size={48} />
                                    <p className="text-slate-400 font-bold animate-pulse">Chargement des données...</p>
                                </div>
                            ) : isEditing && editForm ? (
                                <div className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100">
                                        <Input 
                                            label="Prénom" 
                                            value={editForm.prenom} 
                                            onChange={(e) => setEditForm({ ...editForm, prenom: e.target.value })} 
                                        />
                                        <Input 
                                            label="Nom" 
                                            value={editForm.nom_naissance} 
                                            onChange={(e) => setEditForm({ ...editForm, nom_naissance: e.target.value })} 
                                        />
                                        <Input 
                                            label="Email" 
                                            type="email" 
                                            value={editForm.email} 
                                            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} 
                                        />
                                        <Input 
                                            label="Téléphone" 
                                            value={editForm.telephone} 
                                            onChange={(e) => setEditForm({ ...editForm, telephone: e.target.value })} 
                                        />
                                        <Input 
                                            label="Ville" 
                                            value={editForm.ville} 
                                            onChange={(e) => setEditForm({ ...editForm, ville: e.target.value })} 
                                        />
                                        <Select 
                                            label="Formation" 
                                            value={editForm.formation_souhaitee} 
                                            onChange={(e) => setEditForm({ ...editForm, formation_souhaitee: e.target.value })}
                                            options={[
                                                { value: "BTS MCO", label: "BTS MCO" },
                                                { value: "BTS NDRC", label: "BTS NDRC" },
                                                { value: "BACHELOR RDC", label: "BACHELOR RDC" },
                                                { value: "TP NTC", label: "TP NTC" }
                                            ]}
                                        />
                                        <div className="md:col-span-2">
                                            <Input 
                                                label="Entreprise d'accueil" 
                                                value={editForm.entreprise_d_accueil} 
                                                onChange={(e) => setEditForm({ ...editForm, entreprise_d_accueil: e.target.value })} 
                                                placeholder="Non ou Nom de l'entreprise"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) : selectedCandidate ? (
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    {/* Left Column: Personal Info */}
                                    <div className="lg:col-span-2 space-y-10">
                                        <section className="animate-in fade-in slide-in-from-left-4 duration-500">
                                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center shadow-sm">
                                                    <User size={16} strokeWidth={3} />
                                                </div>
                                                Informations Personnelles
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-50/50 p-10 rounded-[2.5rem] border border-slate-100 shadow-inner">
                                                {[
                                                    { label: 'Prénom', value: selectedCandidate.informations_personnelles?.prenom || 'N/A', icon: User },
                                                    { label: 'Nom', value: selectedCandidate.informations_personnelles?.nom_naissance || 'N/A', icon: User },
                                                    { label: 'Email', value: selectedCandidate.informations_personnelles?.email || 'N/A', icon: Mail },
                                                    { label: 'Téléphone', value: selectedCandidate.informations_personnelles?.telephone || 'N/A', icon: Phone },
                                                    { label: 'Ville', value: selectedCandidate.informations_personnelles?.ville || 'N/A', icon: MapPin },
                                                    { label: 'Formation', value: selectedCandidate.informations_personnelles?.formation_souhaitee || 'N/A', icon: GraduationCap },
                                                ].map((item, i) => (
                                                    <div key={i} className="flex flex-col gap-2 group/item">
                                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</span>
                                                        <div className="flex items-center gap-3 text-slate-700 font-black text-base group-hover/item:translate-x-1 transition-transform duration-300">
                                                            <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-300 group-hover/item:text-rose-500 transition-colors">
                                                                {item.icon && <item.icon size={16} />}
                                                            </div>
                                                            {item.value}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </section>

                                        <section className="animate-in fade-in slide-in-from-left-4 duration-500 delay-100">
                                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center shadow-sm">
                                                    <Clock size={16} strokeWidth={3} />
                                                </div>
                                                Historique du dossier
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-5">
                                                    <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center">
                                                        <Calendar size={24} />
                                                    </div>
                                                    <div>
                                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Créé le</span>
                                                        <span className="text-base font-black text-slate-800">{new Date(selectedCandidate.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                                    </div>
                                                </div>
                                                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-5">
                                                    <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center">
                                                        <RefreshCw size={24} />
                                                    </div>
                                                    <div>
                                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Dernière mise à jour</span>
                                                        <span className="text-base font-black text-slate-800">{selectedCandidate.updated_at ? new Date(selectedCandidate.updated_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Jamais'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </section>
                                    </div>

                                    {/* Right Column: Documents */}
                                    <div className="space-y-10">
                                        <section className="animate-in fade-in slide-in-from-right-4 duration-500 delay-200">
                                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center shadow-sm">
                                                    <FileText size={16} strokeWidth={3} />
                                                </div>
                                                Documents du dossier
                                            </h3>
                                            <div className="space-y-4">
                                                {selectedCandidate.documents && Object.entries(selectedCandidate.documents).filter(([key]) => key !== 'record_id').map(([key, doc]: [string, any]) => (
                                                    <div key={key} className="flex items-center justify-between p-5 bg-white border border-slate-100 rounded-[1.5rem] hover:border-rose-200 hover:shadow-lg hover:shadow-rose-500/5 transition-all duration-300 group">
                                                        <div className="flex items-center gap-4">
                                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner ${doc.uploaded ? 'bg-emerald-50 text-emerald-500' : 'bg-slate-50 text-slate-300'}`}>
                                                                {doc.uploaded ? <CheckCircle size={24} strokeWidth={3} /> : <AlertCircle size={24} strokeWidth={3} />}
                                                            </div>
                                                            <div>
                                                                <div className="text-sm font-black text-slate-700 uppercase tracking-tight">
                                                                    {doc.document_type || key.replace(/_/g, ' ')}
                                                                </div>
                                                                <div className={`text-[10px] font-bold uppercase tracking-widest ${doc.uploaded ? 'text-emerald-500' : 'text-slate-400'}`}>
                                                                    {doc.uploaded ? 'Document validé' : 'Document manquant'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {doc.uploaded && (
                                                            <button className="p-3 rounded-xl bg-slate-50 text-slate-400 hover:bg-rose-500 hover:text-white hover:shadow-lg hover:shadow-rose-500/20 transition-all duration-300 opacity-0 group-hover:opacity-100">
                                                                <Download size={18} strokeWidth={3} />
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="p-8 bg-rose-50/50 rounded-[2.5rem] border border-rose-100/50 mt-10 relative overflow-hidden group/alert">
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover/alert:bg-rose-500/10 transition-colors"></div>
                                                <div className="flex items-center gap-4 mb-4 relative z-10">
                                                    <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/20">
                                                        <Plus size={20} strokeWidth={3} />
                                                    </div>
                                                    <span className="text-sm font-black text-rose-600 uppercase tracking-wider">Action requise</span>
                                                </div>
                                                <p className="text-sm text-rose-500/80 font-bold leading-relaxed relative z-10">
                                                    Relancez l'étudiant pour les documents manquants afin de finaliser son dossier de placement.
                                                </p>
                                            </div>
                                        </section>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-20">
                                    <p className="text-slate-400 font-bold">Aucune donnée disponible</p>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
                            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                                Annuler
                            </Button>
                            {isEditing ? (
                                <Button 
                                    variant="danger" 
                                    onClick={handleSaveEdit} 
                                    isLoading={isSaving} 
                                    leftIcon={<Save size={18} />}
                                >
                                    Enregistrer
                                </Button>
                            ) : (
                                <Button variant="danger" leftIcon={<Mail size={18} />}>
                                    Relancer l'étudiant
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            )
            }
        </div >
    );
};

export default DashboardView;