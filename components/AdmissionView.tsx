import React, { useState, useEffect } from 'react';
import {
    Briefcase,
    CheckCircle2,
    FileText,
    Printer,
    Upload,
    Calendar,
    Search,
    Download,
    ExternalLink,
    Loader2,
    ArrowRight,
    Users,
    FileCheck,
    Star,
    Save,
    X,
    GraduationCap,
    Building,
    UserCheck,
    ChevronLeft,
    AlertCircle,
    RotateCcw,
    PenTool,
    Info
} from 'lucide-react';
import Button from './ui/Button';
import Card from './ui/Card';
import Input from './ui/Input';
import { AdmissionTab } from '../types';
import QuestionnaireForm from './QuestionnaireForm';
import EntrepriseForm from './EntrepriseForm';
import { api } from '../services/api';
import { useAppStore } from '../store/useAppStore';


// --- CONSTANTS ---

const FORMATION_FORMS: Record<string, string> = {
    mco: "https://docs.google.com/forms/d/e/1FAIpQLSc_Y9Y9_Y_Y_Y_Y_Y_Y_Y_Y_Y_Y_Y_Y_Y_Y_Y_Y_Y_Y_Y_Y/viewform?embedded=true",
    ndrc: "https://docs.google.com/forms/d/e/1FAIpQLSeDDzl2VDR__aY776N_7auk4uAZc04uC6mQNUsRNOr9D3eCmw/viewform?embedded=true",
    bachelor: "https://docs.google.com/forms/d/e/1FAIpQLSdzOg66p81XV9Ghb4dS6xP2r-BCw4qiGECU4F01Vs7VlrJNCQ/viewform?embedded=true",
    tpntc: "https://docs.google.com/forms/d/e/1FAIpQLSfW-Gi40ZBpU9zymrYBZ05P8s2TSSL88OYwkp5lzPSNDXTnhA/viewform?embedded=true",
};

const REQUIRED_DOCUMENTS = [
    { id: 'cv', title: "CV", desc: "Curriculum Vitae à jour" },
    { id: 'cni', title: "Carte d'Identité", desc: "Recto-verso de la CNI" },
    { id: 'lettre', title: "Lettre de motivation", desc: "Exposez vos motivations" },
    { id: 'vitale', title: "Carte Vitale", desc: "Attestation de droits" },
    { id: 'diplome', title: "Dernier Diplôme", desc: "Copie du dernier diplôme" },
];

const ADMIN_DOCS = [
    { id: 'atre', title: "Fiche ATRE", subtitle: "Autorisation de Travail et Renseignements", desc: "Information entreprise et tuteur", color: 'orange', btnText: 'Compléter', gradient: 'from-orange-400 to-orange-600', shadow: 'shadow-orange-500/20' },
    { id: 'renseignements', title: "Fiche de renseignements", subtitle: "Informations personnelles", desc: "Coordonnées et état civil", color: 'blue', btnText: 'Compléter', gradient: 'from-blue-400 to-blue-600', shadow: 'shadow-blue-500/20' },
    { id: 'cerfa', title: "Fiche CERFA", subtitle: "Contrat d'apprentissage", desc: "Génération du contrat officiel FA13", color: 'emerald', btnText: 'Générer', gradient: 'from-emerald-400 to-emerald-600', shadow: 'shadow-emerald-500/20' },
    { id: 'reglement', title: "Règlement intérieur", subtitle: "Engagement étudiant", desc: "Document à lire et signer", color: 'green', btnText: 'Signer', gradient: 'from-green-400 to-green-600', shadow: 'shadow-green-500/20' },
    { id: 'connaissance', title: "Prise de connaissance", subtitle: "Attestation documents", desc: "Charte informatique, Livret d'accueil...", color: 'purple', btnText: 'Signer', gradient: 'from-purple-400 to-purple-600', shadow: 'shadow-purple-500/20' },
    { id: 'livret', title: "Livret d'apprentissage", subtitle: "Suivi pédagogique", desc: "Document de liaison CFA/Entreprise", color: 'cyan', btnText: 'Générer', gradient: 'from-cyan-400 to-cyan-600', shadow: 'shadow-cyan-500/20' },
];

const FORMATION_CARDS = [
    { id: 'mco', title: 'BTS MCO', subtitle: 'Management Commercial Opérationnel', color: 'blue', gradient: 'from-blue-500 to-blue-600' },
    { id: 'ndrc', title: 'BTS NDRC', subtitle: 'Négociation et Digitalisation de la Relation Client', color: 'green', gradient: 'from-emerald-500 to-emerald-600' },
    { id: 'bachelor', title: 'BACHELOR RDC', subtitle: 'Responsable Développement Commercial', color: 'purple', gradient: 'from-purple-500 to-purple-600' },
    { id: 'tpntc', title: 'TP NTC', subtitle: 'Titre Pro Négociateur Technico-Commercial', color: 'orange', gradient: 'from-orange-500 to-orange-600' }
];

// --- COMPONENTS ---

const SuccessModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl transform transition-all scale-100 animate-slide-up text-center border border-white/20">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/20">
                    <CheckCircle2 size={40} strokeWidth={2.5} />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Félicitations !</h3>
                <p className="text-slate-500 mb-8 leading-relaxed">
                    Le document a été généré et envoyé avec succès.
                </p>
                <Button variant="success" size="lg" className="w-full" onClick={onClose}>
                    Continuer
                </Button>
            </div>
        </div>
    );
};

const StepItem = ({ step, label, isActive, isCompleted }: { step: number, label: string, isActive: boolean, isCompleted: boolean }) => (
    <div className="flex flex-col items-center gap-2 relative z-10 group">
        <div className={`w-11 h-11 rounded-full border-2 flex items-center justify-center font-bold text-base transition-all duration-300 ${isCompleted
            ? 'bg-emerald-500 border-emerald-500 text-white'
            : isActive
                ? 'bg-brand border-brand text-white scale-110 shadow-lg shadow-brand/30'
                : 'bg-slate-100 border-slate-200 text-slate-400'
            }`}>
            {isCompleted ? <CheckCircle2 size={20} /> : step}
        </div>
        <div className={`text-xs font-semibold uppercase tracking-wide transition-colors duration-300 ${isActive ? 'text-brand' : isCompleted ? 'text-emerald-600' : 'text-slate-400'}`}>
            {label}
        </div>
    </div>
);

const StepLine = ({ isCompleted }: { isCompleted: boolean }) => (
    <div className={`w-12 h-0.5 mx-1 transition-colors duration-300 ${isCompleted ? 'bg-emerald-500' : 'bg-slate-200'}`}></div>
);

const EvaluationGrid = ({ studentData }: { studentData: any }) => {
    const { showToast } = useAppStore();
    const [evalData, setEvalData] = useState({

        candidatNom: '',
        heureEntretien: '',
        chargeAdmission: '',
        dateEntretien: '',
        formation: '',
        critere1: 0,
        critere2: 0,
        critere3: 0,
        critere4: 0,
        commentaires: ''
    });

    useEffect(() => {
        if (studentData) {
            const data = studentData.data || studentData;
            setEvalData(prev => ({
                ...prev,
                candidatNom: `${data.prenom || ''} ${data.nom_naissance || ''}`.trim(),
                formation: data.formation_souhaitee || '',
                dateEntretien: new Date().toISOString().split('T')[0]
            }));
        }
    }, [studentData]);

    const totalScore = (Number(evalData.critere1) || 0) +
        (Number(evalData.critere2) || 0) +
        (Number(evalData.critere3) || 0) +
        (Number(evalData.critere4) || 0);

    const getAppreciation = (score: number) => {
        if (score === 0) return '-';
        if (score <= 8) return 'Insuffisant';
        if (score <= 12) return 'Passable';
        if (score <= 16) return 'Satisfaisant';
        return 'Excellent';
    };

    const resetEvaluation = () => {
        if (window.confirm("Voulez-vous vraiment réinitialiser la grille ?")) {
            setEvalData({
                candidatNom: '',
                heureEntretien: '',
                chargeAdmission: '',
                dateEntretien: '',
                formation: '',
                critere1: 0,
                critere2: 0,
                critere3: 0,
                critere4: 0,
                commentaires: ''
            });
        }
    };

    const { execute: saveEvalApi, loading: isSaving } = useApi(api.saveEvaluation, {
        successMessage: "Évaluation enregistrée avec succès !",
        errorMessage: "Erreur lors de l'enregistrement de l'évaluation."
    });

    const saveEvaluation = async () => {
        if (!studentData) {
            showToast("Aucun étudiant sélectionné", "error");
            return;
        }

        const data = studentData.data || studentData;
        const payload = {
            studentId: studentData.id,
            studentName: evalData.candidatNom,
            formation: evalData.formation,
            dateEntretien: evalData.dateEntretien,
            heureEntretien: evalData.heureEntretien,
            chargeAdmission: evalData.chargeAdmission,
            critere1: Number(evalData.critere1),
            critere2: Number(evalData.critere2),
            critere3: Number(evalData.critere3),
            critere4: Number(evalData.critere4),
            commentaires: evalData.commentaires
        };

        await saveEvalApi(payload);
    };


    const exportEvaluationPDF = () => {
        window.print();
    };

    const handleScoreChange = (critere: string, value: number) => {
        setEvalData(prev => ({ ...prev, [critere]: value }));
    };

    return (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="px-8 py-6 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold">CR d'entretien / Grille d'évaluation</h2>
                    <p className="text-slate-400 text-sm">Évaluation des compétences et du savoir-être</p>
                </div>
                <div className="flex flex-col items-end">
                    <img src="/images/logo-process-iq.png" alt="Process IQ" className="h-8 brightness-0 invert" />
                </div>
            </div>

            <div className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <Input label="Nom et Prénom du candidat" placeholder="Entrez le nom complet" value={evalData.candidatNom} onChange={(e) => setEvalData({ ...evalData, candidatNom: e.target.value })} />
                        <Input label="Heure d'entretien" type="time" value={evalData.heureEntretien} onChange={(e) => setEvalData({ ...evalData, heureEntretien: e.target.value })} />
                    </div>
                    <div className="space-y-4">
                        <Input label="Nom et Prénom chargé(e) d'admission" placeholder="Votre nom" value={evalData.chargeAdmission} onChange={(e) => setEvalData({ ...evalData, chargeAdmission: e.target.value })} />
                        <Input label="Date d'entretien" type="date" value={evalData.dateEntretien} onChange={(e) => setEvalData({ ...evalData, dateEntretien: e.target.value })} />
                    </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-4 ml-1">Formation visée</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                        {['TP NTC', 'BTS CI', 'BTS COM', 'BTS MCO', 'BTS NDRC', 'BACHELOR RDC'].map((f) => (
                            <label key={f} className={`relative cursor-pointer group`}>
                                <input
                                    type="radio"
                                    name="formation-eval"
                                    className="peer sr-only"
                                    value={f}
                                    checked={evalData.formation === f}
                                    onChange={(e) => setEvalData({ ...evalData, formation: e.target.value })}
                                />
                                <div className={`px-4 py-3 rounded-xl border-2 text-center text-xs font-bold transition-all ${evalData.formation === f ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-200'}`}>
                                    {f}
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 bg-slate-100 rounded-lg text-[10px] font-black text-slate-500 uppercase tracking-wider">
                        <div className="col-span-7">Critères d'évaluation</div>
                        <div className="col-span-5 grid grid-cols-5 text-center">
                            <div>Insuff. (1)</div>
                            <div>Pass. (2)</div>
                            <div>Satisf. (3)</div>
                            <div>T.Satisf (4)</div>
                            <div>Exc. (5)</div>
                        </div>
                    </div>

                    {[
                        { id: 'critere1', title: 'Savoir-être et présentation', desc: 'Capacité à bien se connaître : ses points forts, ses points de progression, culture générale, curiosité, ouverture aux autres.' },
                        { id: 'critere2', title: 'Cohérence du projet académique et professionnel', desc: 'Logique de construction du projet d\'orientation, projet professionnel, motivation pour le programme.' },
                        { id: 'critere3', title: 'Engagements et expérience péri ou extra-scolaires', desc: 'Activités extra-scolaires, richesse des expériences, valorisation des compétences développées.' },
                        { id: 'critere4', title: 'Expression en Anglais', desc: 'Savoir répondre spontanément à quelques questions en anglais.' }
                    ].map((c) => (
                        <div key={c.id} className="grid grid-cols-1 md:grid-cols-12 gap-6 p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors">
                            <div className="md:col-span-7">
                                <h4 className="font-bold text-slate-800 text-sm mb-1">{c.title}</h4>
                                <p className="text-xs text-slate-500 leading-relaxed">{c.desc}</p>
                            </div>
                            <div className="md:col-span-5 flex items-center justify-between md:grid md:grid-cols-5 gap-2">
                                {[1, 2, 3, 4, 5].map((score) => (
                                    <label key={score} className="cursor-pointer">
                                        <input
                                            type="radio"
                                            name={c.id}
                                            className="peer sr-only"
                                            value={score}
                                            checked={evalData[c.id as keyof typeof evalData] === score}
                                            onChange={() => handleScoreChange(c.id, score)}
                                        />
                                        <div className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center font-bold text-sm transition-all ${evalData[c.id as keyof typeof evalData] === score ? 'bg-emerald-500 border-emerald-500 text-white shadow-md' : 'bg-white border-slate-200 text-slate-400 hover:border-emerald-200'}`}>
                                            {score}
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-slate-100">
                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-3 ml-1">Commentaires et observations</label>
                        <textarea
                            className="w-full h-32 px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-emerald-500 outline-none font-medium transition-all resize-none"
                            value={evalData.commentaires}
                            onChange={(e) => setEvalData({ ...evalData, commentaires: e.target.value })}
                            placeholder="Vos observations sur le candidat..."
                        ></textarea>
                    </div>
                    <div className="bg-slate-900 rounded-3xl p-8 text-white flex flex-col items-center justify-center text-center shadow-2xl shadow-slate-900/20 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-emerald-500/20 transition-colors"></div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Note globale</span>
                        <div className="flex items-baseline gap-1 mb-2">
                            <span className="text-6xl font-black text-emerald-400">{totalScore}</span>
                            <span className="text-xl font-bold text-slate-500">/ 20</span>
                        </div>
                        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${totalScore >= 12 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                            {getAppreciation(totalScore)}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 pt-8 border-t border-slate-100">
                    <Button variant="secondary" className="flex-1" onClick={resetEvaluation} leftIcon={<RotateCcw size={18} />}>
                        Réinitialiser
                    </Button>
                    <Button variant="success" className="flex-1" onClick={saveEvaluation} leftIcon={<Save size={18} />} disabled={isSaving}>
                        {isSaving ? 'Enregistrement...' : 'Enregistrer'}
                    </Button>
                    <Button variant="primary" className="flex-1 !bg-slate-900" onClick={exportEvaluationPDF} leftIcon={<Printer size={18} />}>
                        Exporter PDF
                    </Button>
                </div>
            </div>
        </div>
    );
};

// --- INTERVIEWS TRACKING COMPONENT ---

import { useApi } from '../hooks/useApi';
import { useCandidates, getC } from '../hooks/useCandidates';

const InterviewsTrackingView = ({ onLaunchInterview }: { onLaunchInterview: (candidate: any) => void }) => {
    const { candidates, loading: isLoading } = useCandidates();
    const [searchQuery, setSearchQuery] = useState('');
    const [evaluations, setEvaluations] = useState<any[]>([]);
    const [evaluationsLoading, setEvaluationsLoading] = useState(true);

    // Fetch all evaluations from MongoDB on mount
    useEffect(() => {
        const fetchEvaluations = async () => {
            try {
                const evals = await api.getAllEvaluations();
                setEvaluations(evals || []);
            } catch (error) {
                console.error('Error fetching evaluations:', error);
                setEvaluations([]);
            } finally {
                setEvaluationsLoading(false);
            }
        };
        fetchEvaluations();
    }, []);

    const filtered = (candidates || []).map((raw) => {
        const c = getC(raw);
        const studentId = raw.id;

        // Find matching evaluation from MongoDB
        const evaluation = evaluations.find(e => e.studentId === studentId);

        return {
            raw,
            c,
            interviewStatus: evaluation ? 'Completed' : 'Pending',
            score: evaluation ? evaluation.totalScore : null,
            interviewDate: evaluation ? new Date(evaluation.dateEntretien).toLocaleDateString('fr-FR') : 'A définir'
        };
    }).filter(item => {
        const searchLower = (searchQuery || '').toLowerCase();
        const fullName = `${item.c.nom} ${item.c.prenom}`.toLowerCase();
        const formation = (item.c.formation).toLowerCase();
        const email = (item.c.email).toLowerCase();

        return fullName.includes(searchLower) ||
            formation.includes(searchLower) ||
            email.includes(searchLower);
    });

    const stats = {
        total: candidates.length,
        completed: filtered.filter(item => item.interviewStatus === 'Completed').length,
        pending: filtered.filter(item => item.interviewStatus === 'Pending').length
    };

    return (
        <div className="animate-fade-in space-y-8 pb-10">
            {/* Header / Hero */}
            <div className="bg-white border border-slate-200 rounded-[32px] p-10 shadow-premium overflow-hidden relative">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50 border-l border-slate-100 hidden md:block"></div>

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-blue-100">Management</span>
                            <div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
                            <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Temps réel</span>
                        </div>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-4">Suivi des Entretiens</h2>
                        <p className="text-slate-500 text-lg leading-relaxed max-w-xl font-medium">
                            Gérez le flux d'admission des candidats, consultez les scores des évaluations et lancez les entretiens en attente.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 w-full md:w-auto shrink-0">
                        <div className="bg-slate-900 p-6 rounded-2xl text-white shadow-xl shadow-slate-900/20 text-center">
                            <div className="text-3xl font-black mb-1">{stats.completed}</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Validés</div>
                        </div>
                        <div className="bg-white border-2 border-slate-100 p-6 rounded-2xl text-center">
                            <div className="text-3xl font-black text-slate-800 mb-1">{stats.pending}</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">En attente</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-[450px] group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Rechercher un candidat ou une formation..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-14 pr-6 py-4 bg-white border-2 border-slate-100 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-bold text-slate-700 shadow-sm placeholder:text-slate-300"
                    />                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <Button variant="outline" className="flex-1 md:flex-none h-[56px] px-6" leftIcon={<Download size={18} />}>Exporter</Button>
                    <Button variant="primary" className="flex-1 md:flex-none h-[56px] px-8" leftIcon={<Calendar size={18} />}>Planifier</Button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-premium">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-8 py-5 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Candidat</th>
                                <th className="px-8 py-5 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Formation</th>
                                <th className="px-8 py-5 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Date Session</th>
                                <th className="px-8 py-5 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Statut</th>
                                <th className="px-8 py-5 text-center text-[11px] font-black text-slate-400 uppercase tracking-widest">Évaluation</th>
                                <th className="px-8 py-5 text-right text-[11px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading || evaluationsLoading ? (
                                <tr><td colSpan={6} className="px-8 py-20 text-center text-slate-400 font-bold animate-pulse">Chargement des données...</td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan={6} className="px-8 py-20 text-center text-slate-400 font-bold">Aucun candidat ne correspond à votre recherche.</td></tr>
                            ) : filtered.map((item) => (
                                <tr key={item.c.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 font-black text-sm group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                                                {item.c.prenom?.[0]}{item.c.nom?.[0]}
                                            </div>
                                            <div className="font-black text-slate-800 text-base">{item.c.nom} {item.c.prenom}</div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-brand/10 text-brand border border-brand/20">
                                            <Briefcase size={14} />
                                            <span className="text-[11px] font-bold uppercase tracking-tight">{item.c.formation || 'Non spécifiée'}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-slate-700">{item.interviewDate}</span>
                                            <span className="text-[10px] text-slate-400 font-medium">Session admission</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        {item.interviewStatus === 'Completed' ? (
                                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100/50">
                                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                                                <span className="text-[10px] font-black uppercase tracking-wider">Terminé</span>
                                            </div>
                                        ) : (
                                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-100/50">
                                                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></div>
                                                <span className="text-[10px] font-black uppercase tracking-wider">En attente</span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col items-center">
                                            {item.interviewStatus === 'Completed' ? (
                                                <>
                                                    <div className="flex items-baseline gap-0.5">
                                                        <span className="text-xl font-black text-slate-900">{item.score}</span>
                                                        <span className="text-[10px] font-bold text-slate-400">/20</span>
                                                    </div>
                                                    <div className="flex gap-0.5 mt-1">
                                                        {[1, 2, 3, 4, 5].map((s) => (
                                                            <Star key={s} size={8} className={s <= Math.round(item.score / 4) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'} />
                                                        ))}
                                                    </div>
                                                </>
                                            ) : (
                                                <span className="text-slate-300 font-bold">—</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        {item.interviewStatus === 'Completed' ? (
                                            <button className="p-2.5 rounded-xl text-slate-400 hover:text-brand hover:bg-brand/10 transition-all border border-transparent hover:border-brand/20">
                                                <ExternalLink size={20} />
                                            </button>
                                        ) : (
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                className="rounded-xl shadow-none"
                                                onClick={() => onLaunchInterview(item.raw)}
                                            >
                                                Lancer
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// --- MAIN ADMISSION VIEW ---

const AdmissionView = () => {
    const { showToast } = useAppStore();
    const [mainTab, setMainTab] = useState<'dashboard' | 'interviews'>('dashboard');

    const [activeTab, setActiveTab] = useState<AdmissionTab>(AdmissionTab.TESTS);
    const [selectedFormation, setSelectedFormation] = useState<string | null>(null);

    const [testCompleted, setTestCompleted] = useState(false);
    const [studentData, setStudentData] = useState<any>(null);

    const [uploadedFiles, setUploadedFiles] = useState<Record<string, boolean>>({});
    const [uploadingFiles, setUploadingFiles] = useState<Record<string, boolean>>({});

    const [entrepriseCompleted, setEntrepriseCompleted] = useState(false);
    const [adminCompleted, setAdminCompleted] = useState(false);

    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // API Hooks
    const { execute: uploadApi, loading: isUploading } = useApi(api.uploadDocument, {
        errorMessage: "Erreur lors du téléversement du document. Veuillez réessayer."
    });

    const { execute: generateFicheApi, loading: isGeneratingFiche } = useApi(api.generateFicheRenseignement, {
        onSuccess: () => setShowSuccessModal(true),
        errorMessage: "Erreur lors de la génération de la fiche."
    });

    const { execute: generateCerfaApi, loading: isGeneratingCerfa } = useApi(api.generateCerfa, {
        onSuccess: () => setShowSuccessModal(true),
        errorMessage: "Erreur lors de la génération du CERFA."
    });

    const handleFinishTest = () => {
        setTestCompleted(true);
        setActiveTab(AdmissionTab.QUESTIONNAIRE);
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>, docId: string) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const recordId = studentData?.record_id || localStorage.getItem('candidateRecordId');

        if (!recordId) {
            showToast("Erreur : Aucun dossier étudiant trouvé. Veuillez remplir la fiche étudiant avant de déposer des documents.", "error");
            return;
        }

        setUploadingFiles(prev => ({ ...prev, [docId]: true }));
        try {
            await uploadApi(recordId, docId, file);
            setUploadedFiles(prev => ({ ...prev, [docId]: true }));
        } catch (error) {
            // Error is handled by useApi toast
        } finally {
            setUploadingFiles(prev => ({ ...prev, [docId]: false }));
        }
    };

    const handleDocAction = async (doc: any) => {
        const recordId = studentData?.record_id || studentData?.id || localStorage.getItem('candidateRecordId');

        if (!recordId && (doc.id === 'renseignements' || doc.id === 'cerfa')) {
            showToast("Veuillez d'abord compléter la Fiche Étudiant.", "info");
            return;
        }

        if (doc.id === 'renseignements') {
            await generateFicheApi(recordId);
        } else if (doc.id === 'cerfa') {
            await generateCerfaApi(recordId);
        } else {
            console.log("Action pour le document:", doc.title);
        }
    };

    const uploadedCount = Object.keys(uploadedFiles).length;
    const progressPercent = (uploadedCount / REQUIRED_DOCUMENTS.length) * 100;

    // --- RENDER LOGIC ---

    if (mainTab === 'interviews') {
        return (
            <div className="space-y-8 animate-fade-in">
                <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 w-fit">
                    <button onClick={() => setMainTab('dashboard')} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:text-slate-700 transition-all">
                        Tableau de bord
                    </button>
                    <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-white text-brand shadow-sm border border-slate-200 transition-all">
                        Suivi Entretiens
                    </button>
                </div>
                <InterviewsTrackingView
                    onLaunchInterview={(c) => {
                        setStudentData(c);
                        setMainTab('dashboard');
                        setActiveTab(AdmissionTab.ENTRETIEN);
                    }}
                />
            </div>
        );
    }

    return (
        <div className="animate-fade-in max-w-6xl mx-auto pb-20 relative">
            <SuccessModal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)} />

            <div className="admission-hero">
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 w-full max-w-[60%]">
                    <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                            <img src="/images/logo-process-iq.png" alt="Process IQ" className="h-10 w-fit brightness-0 invert" />
                            <div className="hidden md:block w-px h-8 bg-white/20"></div>
                            <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm border border-white/10">
                                <Briefcase size={14} /> Processus d'admission
                            </div>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-extrabold mb-3 tracking-tight text-white">Admission Rush School</h1>
                        <p className="text-indigo-100 text-lg leading-relaxed opacity-90 font-medium">Complétez votre dossier d'admission : tests, documents et formalités administratives.</p>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-[32px] p-8 mb-8 flex items-center justify-center overflow-x-auto shadow-premium">
                <div className="flex items-center min-w-max">
                    <StepItem step={1} label="Tests" isActive={activeTab === AdmissionTab.TESTS} isCompleted={testCompleted} />
                    <StepLine isCompleted={testCompleted} />
                    <StepItem step={2} label="Étudiant" isActive={activeTab === AdmissionTab.QUESTIONNAIRE} isCompleted={!!studentData} />
                    <StepLine isCompleted={!!studentData} />
                    <StepItem step={3} label="Documents" isActive={activeTab === AdmissionTab.DOCUMENTS} isCompleted={uploadedCount >= REQUIRED_DOCUMENTS.length} />
                    <StepLine isCompleted={uploadedCount >= REQUIRED_DOCUMENTS.length} />
                    <StepItem step={4} label="Entreprise" isActive={activeTab === AdmissionTab.ENTREPRISE} isCompleted={entrepriseCompleted} />
                    <StepLine isCompleted={entrepriseCompleted} />
                    <StepItem step={5} label="Admin" isActive={activeTab === AdmissionTab.ADMINISTRATIF} isCompleted={adminCompleted} />
                    <StepLine isCompleted={adminCompleted} />
                    <StepItem step={6} label="Entretien" isActive={activeTab === AdmissionTab.ENTRETIEN} isCompleted={false} />
                </div>
            </div>

            <div className="flex gap-2 mb-8 bg-slate-50 p-1.5 rounded-2xl border border-slate-200 w-fit shadow-inner">
                <button onClick={() => setMainTab('dashboard')} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${mainTab === 'dashboard' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500'}`}>
                    Tableau de bord
                </button>
                <button onClick={() => setMainTab('interviews')} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${mainTab === 'interviews' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}>
                    Suivi Entretiens
                </button>
            </div>

            <div className="flex overflow-x-auto gap-2 mb-8 bg-slate-100 p-2 rounded-2xl border border-slate-200 no-scrollbar shadow-inner">
                {[
                    { id: AdmissionTab.TESTS, label: 'Tests', icon: PenTool },
                    { id: AdmissionTab.QUESTIONNAIRE, label: 'Fiche Étudiant', icon: Info },
                    { id: AdmissionTab.DOCUMENTS, label: 'Documents', icon: Upload },
                    { id: AdmissionTab.ENTREPRISE, label: 'Fiche Entreprise', icon: Building },
                    { id: AdmissionTab.ADMINISTRATIF, label: 'Administratif', icon: Printer },
                    { id: AdmissionTab.ENTRETIEN, label: 'Entretien', icon: UserCheck }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as AdmissionTab)}
                        className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-white text-black shadow-sm' : 'text-slate-500 hover:bg-white/50'}`}
                    >
                        <tab.icon size={16} /> {tab.label}
                    </button>
                ))}
            </div>

            {activeTab === AdmissionTab.TESTS && (
                <div className="space-y-6 animate-slide-in">
                    {!selectedFormation ? (
                        <div className="bg-white border border-slate-200 rounded-[32px] p-10 shadow-premium">
                            <h3 className="text-xl font-black text-slate-800 mb-2 flex items-center gap-3">
                                <GraduationCap className="text-blue-500" /> Sélectionnez votre formation
                            </h3>
                            <p className="text-slate-500 mb-8 ml-9 font-medium">Choisissez la formation pour accéder au test.</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {FORMATION_CARDS.map(f => (
                                    <div key={f.id} onClick={() => setSelectedFormation(f.id)} className="bg-slate-50/50 border-2 border-slate-100 rounded-3xl p-8 text-center cursor-pointer hover:border-brand hover:-translate-y-1 hover:shadow-xl transition-all group">
                                        <div className={`w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center text-white bg-gradient-to-br ${f.gradient} shadow-lg`}>
                                            <Briefcase size={28} />
                                        </div>
                                        <h4 className="font-black text-slate-800 text-lg mb-2">{f.title}</h4>
                                        <p className="text-xs text-slate-400 font-bold mb-6 h-10 leading-relaxed uppercase tracking-wider">{f.subtitle}</p>
                                        <span className="inline-block px-4 py-1.5 bg-white rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-brand group-hover:bg-brand/5 transition-colors border border-slate-100">~20 min</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden flex flex-col relative animate-slide-in shadow-xl">
                            <div className="bg-slate-50 border-b border-slate-200 p-5 flex justify-between items-center sticky top-0 z-20">
                                <button
                                    onClick={() => setSelectedFormation(null)}
                                    className="text-slate-500 hover:text-slate-800 flex items-center gap-2 font-bold text-sm transition-colors"
                                >
                                    <ChevronLeft size={18} strokeWidth={3} /> Changer de formation
                                </button>
                                <div className="flex items-center gap-4">
                                    <span className="text-sm font-black text-slate-700 hidden md:block">Test: {FORMATION_CARDS.find(f => f.id === selectedFormation)?.title}</span>
                                    <Button variant="success" size="sm" onClick={handleFinishTest} leftIcon={<CheckCircle2 size={16} />}>
                                        J'ai envoyé mes réponses
                                    </Button>
                                </div>
                            </div>
                            <div className="w-full h-[850px] bg-slate-100 relative">
                                <iframe
                                    src={selectedFormation ? FORMATION_FORMS[selectedFormation] : ""}
                                    className="absolute inset-0 w-full h-full border-0"
                                    title="Formulaire de test"
                                ></iframe>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {activeTab === AdmissionTab.QUESTIONNAIRE && (
                <div className="animate-slide-in">
                    <QuestionnaireForm onNext={(data) => {
                        setStudentData(data);
                        setActiveTab(AdmissionTab.DOCUMENTS);
                    }} />
                </div>
            )}

            {activeTab === AdmissionTab.DOCUMENTS && (
                <div className="animate-slide-in">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-3xl p-8 mb-8 flex items-center gap-6 relative overflow-hidden">
                        <div className="w-16 h-16 bg-white text-blue-600 rounded-2xl flex items-center justify-center shrink-0 shadow-xl shadow-blue-500/10 relative z-10">
                            <Upload size={32} />
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-xl font-black text-slate-800 tracking-tight">Documents à téléverser</h3>
                            <p className="text-slate-500 font-medium">Complétez votre dossier avec les pièces justificatives officielles.</p>
                        </div>
                        {!studentData && (
                            <div className="absolute right-8 top-1/2 -translate-y-1/2 flex items-center gap-3 text-amber-600 bg-white px-5 py-2.5 rounded-2xl border-2 border-amber-100 shadow-sm">
                                <AlertCircle size={20} />
                                <span className="text-xs font-black uppercase tracking-widest">Dossier requis</span>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {REQUIRED_DOCUMENTS.map((doc) => {
                            const isUploaded = uploadedFiles[doc.id];
                            const isUploading = uploadingFiles[doc.id];

                            return (
                                <div key={doc.id} className={`border-2 rounded-3xl p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer group relative overflow-hidden ${isUploaded
                                    ? 'border-emerald-400 bg-emerald-50'
                                    : 'border-slate-100 bg-white hover:border-brand hover:bg-slate-50 hover:shadow-xl'}
                                    `}>
                                    <input
                                        type="file"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                                        disabled={isUploading || !studentData}
                                        onChange={(e) => handleFileChange(e, doc.id)}
                                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                    />

                                    {isUploading ? (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm z-20">
                                            <Loader2 size={40} className="animate-spin text-brand mb-3" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-brand">Envoi en cours</span>
                                        </div>
                                    ) : null}

                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all ${isUploaded
                                        ? 'bg-emerald-100 text-emerald-600 scale-110 shadow-lg shadow-emerald-500/10'
                                        : 'bg-slate-50 text-slate-300 group-hover:bg-brand/10 group-hover:text-brand group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-brand/10'}
                                        `}>
                                        {isUploaded ? <CheckCircle2 size={32} strokeWidth={2.5} /> : <Upload size={32} />}
                                    </div>
                                    <h4 className={`font-black text-lg mb-2 tracking-tight ${isUploaded ? 'text-emerald-800' : 'text-slate-800'}`}>{doc.title}</h4>
                                    <p className={`text-xs font-medium mb-8 leading-relaxed px-4 ${isUploaded ? 'text-emerald-600' : 'text-slate-400'}`}>{doc.desc}</p>

                                    <button className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all pointer-events-none ${isUploaded
                                        ? 'bg-emerald-200 text-emerald-800 shadow-sm'
                                        : 'bg-slate-900 text-white shadow-lg shadow-slate-900/20 group-hover:bg-brand group-hover:shadow-brand/20'}`}>
                                        {isUploaded ? 'Document reçu' : 'Téléverser'}
                                    </button>
                                </div>
                            )
                        })}
                    </div>

                    <div className="mt-10 bg-white border border-slate-200 rounded-[32px] p-10 flex flex-col md:flex-row items-center justify-between gap-10 shadow-premium">
                        <div className="w-full md:w-1/2">
                            <div className="flex justify-between text-[11px] font-black uppercase tracking-widest mb-4">
                                <span className="text-slate-400">{uploadedCount} / {REQUIRED_DOCUMENTS.length} documents déposés</span>
                                <span className="text-brand">{Math.round(progressPercent)}%</span>
                            </div>
                            <div className="h-3 bg-slate-50 rounded-full overflow-hidden border border-slate-100 p-0.5">
                                <div
                                    className="h-full rounded-full transition-all duration-700 ease-out bg-gradient-to-r from-brand to-primary"
                                    style={{ width: `${progressPercent}%` }}
                                ></div>
                            </div>
                        </div>
                        <Button
                            size="lg"
                            disabled={!studentData}
                            onClick={() => setActiveTab(AdmissionTab.ENTREPRISE)}
                            className="w-full md:w-auto px-12"
                            rightIcon={<ArrowRight size={20} />}
                        >
                            Continuer
                        </Button>
                    </div>
                </div>
            )}

            {activeTab === AdmissionTab.ENTREPRISE && (
                <div className="animate-slide-in">
                    <EntrepriseForm
                        onNext={() => {
                            setEntrepriseCompleted(true);
                            setActiveTab(AdmissionTab.ADMINISTRATIF);
                        }}
                        studentRecordId={studentData?.record_id || localStorage.getItem('candidateRecordId')}
                    />
                </div>
            )}

            {activeTab === AdmissionTab.ADMINISTRATIF && (
                <div className="animate-slide-in">
                    <div className="bg-white border border-slate-200 rounded-3xl p-8 mb-8 flex items-center gap-6 shadow-sm">
                        <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-indigo-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-xl shadow-violet-500/20">
                            <Printer size={32} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-800 tracking-tight">Dossier administratif</h3>
                            <p className="text-slate-500 font-medium">Documents officiels à compléter avec votre chargé d'admission.</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {ADMIN_DOCS.map(doc => (
                            <div key={doc.id} className="bg-white border border-slate-200 rounded-3xl p-8 hover:shadow-2xl hover:-translate-y-1 transition-all group">
                                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${doc.gradient} flex items-center justify-center text-white mb-6 shadow-lg ${doc.shadow} group-hover:scale-110 transition-transform`}>
                                    <FileText size={32} />
                                </div>
                                <h4 className="font-black text-slate-800 text-lg mb-1 tracking-tight">{doc.title}</h4>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{doc.subtitle}</p>
                                <p className="text-sm text-slate-500 font-medium mb-8 leading-relaxed h-12 overflow-hidden">{doc.desc}</p>
                                {(() => {
                                    const isGenerating = (doc.id === 'renseignements' && isGeneratingFiche) || (doc.id === 'cerfa' && isGeneratingCerfa);
                                    return (
                                        <button
                                            disabled={isGenerating}
                                            onClick={() => handleDocAction(doc)}
                                            className={`w-full py-3.5 rounded-xl border-2 border-slate-100 font-black text-[11px] uppercase tracking-widest text-slate-600 hover:border-brand hover:text-brand transition-all flex items-center justify-center gap-2 ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            {isGenerating ? 'Génération...' : doc.btnText} <ArrowRight size={14} className={isGenerating ? 'animate-spin' : ''} />
                                        </button>
                                    );
                                })()}
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end mt-10">
                        <Button size="lg" className="px-12" onClick={() => setActiveTab(AdmissionTab.ENTRETIEN)} rightIcon={<ArrowRight size={20} />}>
                            Accéder à l'entretien
                        </Button>
                    </div>
                </div>
            )}

            {activeTab === AdmissionTab.ENTRETIEN && (
                <div className="animate-slide-in">
                    <EvaluationGrid studentData={studentData} />
                </div>
            )}

        </div>
    );
};

export default AdmissionView;
