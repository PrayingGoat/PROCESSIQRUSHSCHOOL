import React from 'react';
import { X, UserCircle, Loader2, User, Mail, Phone, MapPin, GraduationCap, Clock, Calendar, RefreshCw, FileText, CheckCircle, AlertCircle, Download, Trash2, Save, Plus } from 'lucide-react';

import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';

interface CandidateDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    candidate: any;
    loading: boolean;
    isEditing: boolean;
    setIsEditing: (val: boolean) => void;
    editForm: any;
    setEditForm: (val: any) => void;
    handleSaveEdit: () => Promise<void>;
    handleDelete: () => Promise<void>;
    isSaving: boolean;
    isDeleting: boolean;
}

const CandidateDetailsModal: React.FC<CandidateDetailsModalProps> = ({
    isOpen,
    onClose,
    candidate,
    loading,
    isEditing,
    setIsEditing,
    editForm,
    setEditForm,
    handleSaveEdit,
    handleDelete,
    isSaving,
    isDeleting
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-[2.5rem] w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl border border-white/20 flex flex-col animate-in zoom-in-95 duration-300">
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
                    <button onClick={onClose} className="relative z-10 w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 hover:bg-rose-50 hover:text-rose-500 hover:rotate-90 transition-all duration-300 flex items-center justify-center group">
                        <X size={28} strokeWidth={3} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Loader2 className="animate-spin text-rose-500" size={48} />
                            <p className="text-slate-400 font-bold animate-pulse">Chargement des données...</p>
                        </div>
                    ) : isEditing && editForm ? (
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100">
                                <Input label="Prénom" value={editForm.prenom} onChange={(e) => setEditForm({ ...editForm, prenom: e.target.value })} />
                                <Input label="Nom" value={editForm.nom_naissance} onChange={(e) => setEditForm({ ...editForm, nom_naissance: e.target.value })} />
                                <Input label="Email" type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
                                <Input label="Téléphone" value={editForm.telephone} onChange={(e) => setEditForm({ ...editForm, telephone: e.target.value })} />
                                <Input label="Ville" value={editForm.ville} onChange={(e) => setEditForm({ ...editForm, ville: e.target.value })} />
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
                                    <Input label="Entreprise d'accueil" value={editForm.entreprise_d_accueil} onChange={(e) => setEditForm({ ...editForm, entreprise_d_accueil: e.target.value })} placeholder="Non ou Nom de l'entreprise" />
                                </div>
                            </div>
                        </div>
                    ) : candidate ? (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-10">
                                <section className="animate-in fade-in slide-in-from-left-4 duration-500">
                                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center shadow-sm"> <User size={16} strokeWidth={3} /> </div> Informations Personnelles
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-50/50 p-10 rounded-[2.5rem] border border-slate-100 shadow-inner">
                                        {[
                                            { label: 'Prénom', value: candidate.informations_personnelles?.prenom || 'N/A', icon: User },
                                            { label: 'Nom', value: candidate.informations_personnelles?.nom_naissance || 'N/A', icon: User },
                                            { label: 'Email', value: candidate.informations_personnelles?.email || 'N/A', icon: Mail },
                                            { label: 'Téléphone', value: candidate.informations_personnelles?.telephone || 'N/A', icon: Phone },
                                            { label: 'Ville', value: candidate.informations_personnelles?.ville || 'N/A', icon: MapPin },
                                            { label: 'Formation', value: candidate.informations_personnelles?.formation_souhaitee || 'N/A', icon: GraduationCap },
                                        ].map((item, i) => (
                                            <div key={i} className="flex flex-col gap-2 group/item">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</span>
                                                <div className="flex items-center gap-3 text-slate-700 font-black text-base group-hover/item:translate-x-1 transition-transform duration-300">
                                                    <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-300 group-hover/item:text-rose-500 transition-colors"> {item.icon && <item.icon size={16} />} </div> {item.value}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                                <section className="animate-in fade-in slide-in-from-left-4 duration-500 delay-100">
                                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center shadow-sm"> <Clock size={16} strokeWidth={3} /> </div> Historique du dossier
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-5">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center"> <Calendar size={24} /> </div>
                                            <div>
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Créé le</span>
                                                <span className="text-base font-black text-slate-800">{new Date(candidate.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                            </div>
                                        </div>
                                        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-5">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center"> <RefreshCw size={24} /> </div>
                                            <div>
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Dernière mise à jour</span>
                                                <span className="text-base font-black text-slate-800">{candidate.updated_at ? new Date(candidate.updated_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Jamais'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>
                            <div className="space-y-10">
                                <section className="animate-in fade-in slide-in-from-right-4 duration-500 delay-200">
                                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center shadow-sm"> <FileText size={16} strokeWidth={3} /> </div> Documents du dossier
                                    </h3>
                                    <div className="space-y-4">
                                        {candidate.documents && Object.entries(candidate.documents).filter(([key]) => key !== 'record_id').map(([key, doc]: [string, any]) => (
                                            <div key={key} className="flex items-center justify-between p-5 bg-white border border-slate-100 rounded-[1.5rem] hover:border-rose-200 hover:shadow-lg transition-all duration-300 group">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner ${doc.uploaded ? 'bg-emerald-50 text-emerald-500' : 'bg-slate-50 text-slate-300'}`}> {doc.uploaded ? <CheckCircle size={24} strokeWidth={3} /> : <AlertCircle size={24} strokeWidth={3} />} </div>
                                                    <div>
                                                        <div className="text-sm font-black text-slate-700 uppercase tracking-tight"> {doc.document_type || key.replace(/_/g, ' ')} </div>
                                                        <div className={`text-[10px] font-bold uppercase tracking-widest ${doc.uploaded ? 'text-emerald-500' : 'text-slate-400'}`}> {doc.uploaded ? 'Document validé' : 'Document manquant'} </div>
                                                    </div>
                                                </div>
                                                {doc.uploaded && (<button className="p-3 rounded-xl bg-slate-50 text-slate-400 hover:bg-rose-500 hover:text-white transition-all duration-300 opacity-0 group-hover:opacity-100"> <Download size={18} strokeWidth={3} /> </button>)}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="p-8 bg-rose-50/50 rounded-[2.5rem] border border-rose-100/50 mt-10 relative overflow-hidden group/alert">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover/alert:bg-rose-500/10 transition-colors"></div>
                                        <div className="flex items-center gap-4 mb-4 relative z-10">
                                            <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/20"> <Plus size={20} strokeWidth={3} /> </div>
                                            <span className="text-sm font-black text-rose-600 uppercase tracking-wider">Action requise</span>
                                        </div>
                                        <p className="text-sm text-rose-500/80 font-bold leading-relaxed relative z-10"> Relancez l'étudiant pour les documents manquants afin de finaliser son dossier de placement. </p>
                                    </div>
                                </section>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-20"> <p className="text-slate-400 font-bold">Aucune donnée disponible</p> </div>
                    )}
                </div>

                <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <div className="flex gap-3">
                        {isEditing && (
                            <Button variant="outline" onClick={handleDelete} isLoading={isDeleting} className="!border-rose-200 !text-rose-500 hover:!bg-rose-50" leftIcon={<Trash2 size={18} />}>
                                Supprimer l'étudiant
                            </Button>
                        )}
                    </div>
                    <div className="flex gap-3">
                        <Button variant="secondary" onClick={onClose}> Annuler </Button>
                        {isEditing ? (
                            <Button variant="danger" onClick={handleSaveEdit} isLoading={isSaving} leftIcon={<Save size={18} />}> Enregistrer </Button>
                        ) : (
                            <Button variant="danger" leftIcon={<Mail size={18} />}> Relancer l'étudiant </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CandidateDetailsModal;
