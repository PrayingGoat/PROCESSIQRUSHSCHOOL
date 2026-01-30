import React from 'react';
import { Search, List, LayoutGrid, Eye, CheckCircle2 } from 'lucide-react';
import Button from '../ui/Button';
import Pagination from '../ui/Pagination';

interface CommercialToPlaceProps {
    candidates: any[];
    searchQuery: string;
    setSearchQuery: (val: string) => void;
    filterFormation: string;
    setFilterFormation: (val: string) => void;
    viewMode: 'table' | 'cards';
    setViewMode: (val: 'table' | 'cards') => void;
    currentPage: number;
    setCurrentPage: (val: number) => void;
    itemsPerPage: number;
    handleViewDetails: (id: string) => void;
    getC: (raw: any) => any;
    isPlaced: (raw: any) => boolean;
}

const CommercialToPlace: React.FC<CommercialToPlaceProps> = ({
    candidates,
    searchQuery,
    setSearchQuery,
    filterFormation,
    setFilterFormation,
    viewMode,
    setViewMode,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    handleViewDetails,
    getC,
    isPlaced
}) => {
    const filteredStudents = (candidates || []).filter(c => !isPlaced(c)).filter(raw => {
        if (!raw) return false;
        const c = getC(raw);
        if (!c) return false;

        const searchLower = (searchQuery || '').toLowerCase();
        const fullName = String(c.nom || '') + ' ' + String(c.prenom || '');
        const matchesSearch = fullName.toLowerCase().includes(searchLower) ||
            String(c.email || '').toLowerCase().includes(searchLower) ||
            String(c.telephone || '').includes(searchQuery);
        const matchesFormation = !filterFormation || String(c.formation || '').toLowerCase().includes(filterFormation.toLowerCase());
        return matchesSearch && matchesFormation;
    });

    const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
    const paginatedStudents = filteredStudents.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
            <div className="bg-gradient-to-br from-rose-500 via-rose-600 to-orange-600 rounded-[2.5rem] p-10 mb-10 text-white shadow-2xl shadow-rose-500/30 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-3xl group-hover:bg-white/20 transition-all duration-1000"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-400/20 rounded-full -ml-32 -mb-32 blur-3xl"></div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-8">
                        <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-xl border border-white/40 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500">
                            <Search size={40} className="text-white drop-shadow-md" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black tracking-tighter mb-2 drop-shadow-sm">Étudiants à placer</h1>
                            <p className="text-rose-50 font-semibold text-lg opacity-90 max-w-xl leading-relaxed">
                                {filteredStudents.length} candidats recherchent actuellement une alternance.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-6 mb-10 border border-white/20 shadow-xl flex flex-wrap justify-between items-center gap-6">
                <div className="flex flex-wrap items-center gap-6 flex-1 min-w-[300px]">
                    <div className="relative flex-1 min-w-[240px] max-w-md group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-rose-500 transition-colors duration-300" size={22} />
                        <input
                            type="text"
                            placeholder="Rechercher un candidat..."
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
                    <button onClick={() => setViewMode('table')} className={`flex items-center gap-2 px-4 py-2.5 rounded-[1.2rem] font-black text-xs md:text-sm transition-all duration-300 ${viewMode === 'table' ? 'bg-white text-rose-600 shadow-lg shadow-rose-500/10' : 'text-slate-500 hover:text-slate-700'}`}>
                        <List size={18} strokeWidth={3} /> Liste
                    </button>
                    <button onClick={() => setViewMode('cards')} className={`flex items-center gap-2 px-4 py-2.5 rounded-[1.2rem] font-black text-xs md:text-sm transition-all duration-300 ${viewMode === 'cards' ? 'bg-white text-rose-600 shadow-lg shadow-rose-500/10' : 'text-slate-500 hover:text-slate-700'}`}>
                        <LayoutGrid size={18} strokeWidth={3} /> Cartes
                    </button>
                </div>
            </div>

            {viewMode === 'table' ? (
                <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-white/20 shadow-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100">
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Formation</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Étudiant</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Ville</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedStudents.map((raw) => {
                                    const c = getC(raw);
                                    return (
                                        <tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-8 py-6">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${c.formation.includes('MCO') ? 'bg-blue-50 text-blue-600' :
                                                    c.formation.includes('NDRC') ? 'bg-emerald-50 text-emerald-600' :
                                                        c.formation.includes('RDC') ? 'bg-purple-50 text-purple-600' : 'bg-orange-50 text-orange-600'
                                                    }`}>
                                                    {c.formation}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-500 text-xs"> {c.nom[0]}{c.prenom[0]} </div>
                                                    <div>
                                                        <div className="text-sm font-black text-slate-800">{c.nom} {c.prenom}</div>
                                                        <div className="text-[10px] font-bold text-slate-400">{c.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-sm font-bold text-slate-600">{c.ville}</td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => handleViewDetails(c.id)} className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-400 hover:text-rose-500 hover:border-rose-200 transition-all"> <Eye size={18} /> </button>
                                                    <button className="p-2 bg-rose-500 rounded-xl shadow-md text-white hover:bg-rose-600 transition-all"> <CheckCircle2 size={18} /> </button>
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
                    {paginatedStudents.map((raw) => {
                        const c = getC(raw);
                        return (
                            <div key={c.id} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-rose-500/10 transition-colors"></div>
                                <div className="flex justify-between items-start mb-6 relative z-10">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-rose-500/20">
                                        {c.nom[0]}{c.prenom[0]}
                                    </div>
                                    <span className="px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-[10px] font-black uppercase tracking-wider">Hors poste</span>
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
                                    <Button variant="secondary" className="flex-1" onClick={() => handleViewDetails(c.id)} leftIcon={<Eye size={18} />}> Détails </Button>
                                    <Button variant="danger" className="flex-1" leftIcon={<CheckCircle2 size={18} />}> Placer </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </div>
    );
};

export default CommercialToPlace;
