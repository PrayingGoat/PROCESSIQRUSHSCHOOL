import React, { useState, useEffect } from 'react';
import {
    GraduationCap,
    CheckCircle2,
    Upload,
    Building,
    Printer,
    UserCheck,
    ChevronLeft,
    AlertCircle,
    Loader2,
    FileText,
    ArrowRight,
    Briefcase,
    Download,
    Users,
    FileCheck,
    Search,
    RotateCcw,
    Save,
    Info,
    PenTool
} from 'lucide-react';
import Button from './ui/Button';
import Card from './ui/Card';
import Input from './ui/Input';
import { AdmissionTab, CompanyFormData } from '../types';
import QuestionnaireForm from './QuestionnaireForm';
import EntrepriseForm from './EntrepriseForm';
import { api } from '../services/api';

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
    { id: 'atre', title: "Fiche ATRE", subtitle: "Autorisation de Travail et Renseignements", desc: "Information entreprise et tuteur", color: 'orange', btnText: 'Compléter' },
    { id: 'renseignements', title: "Fiche de renseignements", subtitle: "Informations personnelles", desc: "Coordonnées et état civil", color: 'blue', btnText: 'Compléter' },
    { id: 'cerfa', title: "Fiche CERFA", subtitle: "Contrat d'apprentissage", desc: "Génération du contrat officiel FA13", color: 'emerald', btnText: 'Générer' },
    { id: 'reglement', title: "Règlement intérieur", subtitle: "Engagement étudiant", desc: "Document à lire et signer", color: 'green', btnText: 'Signer' },
    { id: 'connaissance', title: "Prise de connaissance", subtitle: "Attestation documents", desc: "Charte informatique, Livret d'accueil...", color: 'purple', btnText: 'Signer' },
    { id: 'livret', title: "Livret d'apprentissage", subtitle: "Suivi pédagogique", desc: "Document de liaison CFA/Entreprise", color: 'cyan', btnText: 'Générer' },
];

const FORMATION_CARDS = [
    { id: 'mco', title: 'BTS MCO', subtitle: 'Management Commercial Opérationnel', color: 'blue' },
    { id: 'ndrc', title: 'BTS NDRC', subtitle: 'Négociation et Digitalisation de la Relation Client', color: 'green' },
    { id: 'bachelor', title: 'BACHELOR RDC', subtitle: 'Responsable Développement Commercial', color: 'purple' },
    { id: 'tpntc', title: 'TP NTC', subtitle: 'Titre Pro Négociateur Technico-Commercial', color: 'orange' }
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
                ? 'bg-blue-600 border-blue-600 text-white scale-110 shadow-lg shadow-blue-500/30'
                : 'bg-[#F8FAFC] border-slate-200 text-slate-400'
            }`}>
            {isCompleted ? <CheckCircle2 size={20} /> : step}
        </div>
        <div className={`text-xs font-semibold uppercase tracking-wide transition-colors duration-300 ${isActive ? 'text-blue-600' : isCompleted ? 'text-emerald-600' : 'text-slate-400'}`}>
            {label}
        </div>
    </div>
);

const StepLine = ({ isCompleted }: { isCompleted: boolean }) => (
    <div className={`w-12 h-0.5 mx-1 transition-colors duration-300 ${isCompleted ? 'bg-emerald-500' : 'bg-slate-200'}`}></div>
);

const EvaluationGrid = ({ studentData }: { studentData: any }) => {
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

    const saveEvaluation = () => {
        alert("Évaluation enregistrée avec succès !");
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
                    <Button variant="success" className="flex-1" onClick={saveEvaluation} leftIcon={<Save size={18} />}>
                        Enregistrer
                    </Button>
                    <Button variant="primary" className="flex-1 !bg-slate-900" onClick={exportEvaluationPDF} leftIcon={<Printer size={18} />}>
                        Exporter PDF
                    </Button>
                </div>
            </div>
        </div>
    );
};


const AdmissionView = () => {
    const [mainTab, setMainTab] = useState<'dashboard' | 'ntc'>('dashboard');
    const [activeTab, setActiveTab] = useState<AdmissionTab>(AdmissionTab.TESTS);
    const [selectedFormation, setSelectedFormation] = useState<string | null>(null);

    const [testCompleted, setTestCompleted] = useState(false);
    const [studentData, setStudentData] = useState<any>(null);

    const [uploadedFiles, setUploadedFiles] = useState<Record<string, boolean>>({});
    const [uploadingFiles, setUploadingFiles] = useState<Record<string, boolean>>({});

    const [entrepriseCompleted, setEntrepriseCompleted] = useState(false);
    const [adminCompleted, setAdminCompleted] = useState(false);

    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleFinishTest = () => {
        setTestCompleted(true);
        setActiveTab(AdmissionTab.QUESTIONNAIRE);
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>, docId: string) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const recordId = studentData?.record_id || localStorage.getItem('candidateRecordId');

        if (!recordId) {
            alert("Erreur : Aucun dossier étudiant trouvé. Veuillez remplir la fiche étudiant avant de déposer des documents.");
            return;
        }

        setUploadingFiles(prev => ({ ...prev, [docId]: true }));

        try {
            await api.uploadDocument(recordId, docId, file);
            setUploadedFiles(prev => ({ ...prev, [docId]: true }));
        } catch (error) {
            console.error("Upload failed", error);
            alert("Erreur lors du téléversement du document. Veuillez réessayer.");
        } finally {
            setUploadingFiles(prev => ({ ...prev, [docId]: false }));
        }
    };

    const handleDocAction = async (doc: any) => {
        if (doc.id === 'renseignements') {
            if (!studentData && !localStorage.getItem('candidateRecordId')) {
                alert("Veuillez d'abord compléter la Fiche Étudiant.");
                return;
            }

            const recordId = studentData?.record_id || studentData?.id || localStorage.getItem('candidateRecordId');
            if (!recordId) {
                alert("Identifiant étudiant introuvable. Veuillez recharger ou compléter le dossier.");
                return;
            }

            try {
                const btn = document.getElementById(`btn-${doc.id}`);
                const originalText = btn ? btn.innerText : "";
                if (btn) btn.innerText = "Génération...";

                await api.generateFicheRenseignement(recordId);
                setShowSuccessModal(true);

                if (btn) btn.innerText = originalText;
            } catch (e) {
                console.error(e);
                alert("Erreur lors de la génération de la fiche.");
                const btn = document.getElementById(`btn-${doc.id}`);
                if (btn) btn.innerText = "Compléter";
            }
        } else if (doc.id === 'cerfa') {
            if (!studentData && !localStorage.getItem('candidateRecordId')) {
                alert("Veuillez d'abord compléter la Fiche Étudiant.");
                return;
            }

            const recordId = studentData?.record_id || studentData?.id || localStorage.getItem('candidateRecordId');
            if (!recordId) {
                alert("Identifiant étudiant introuvable. Veuillez recharger ou compléter le dossier.");
                return;
            }

            try {
                const btn = document.getElementById(`btn-${doc.id}`);
                const originalText = btn ? btn.innerText : "";
                if (btn) btn.innerText = "Génération...";

                await api.generateCerfa(recordId);
                setShowSuccessModal(true);

                if (btn) btn.innerText = originalText;
            } catch (e) {
                console.error(e);
                alert("Erreur lors de la génération du CERFA.");
                const btn = document.getElementById(`btn-${doc.id}`);
                if (btn) btn.innerText = "Générer";
            }
        } else {
            console.log("Action pour le document:", doc.title);
        }
    };

    const uploadedCount = Object.keys(uploadedFiles).length;
    const progressPercent = (uploadedCount / REQUIRED_DOCUMENTS.length) * 100;

    if (mainTab === 'ntc') {
        return (
            <div className="animate-fade-in space-y-8">
                <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 w-fit">
                    <button onClick={() => setMainTab('dashboard')} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:text-slate-700 transition-all">
                        Tableau de bord
                    </button>
                    <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-white text-primary shadow-sm border border-slate-200 transition-all">
                        Classe NTC
                        <span className="bg-primary-50 text-primary px-2 py-0.5 rounded-lg text-[10px] font-black">35</span>
                    </button>
                </div>

                <div className="relative overflow-hidden bg-slate-900 rounded-4xl p-12 text-white shadow-2xl">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/20 to-transparent"></div>
                    
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                        <div>
                            <div className="flex items-center gap-4 mb-4">
                                <h2 className="text-4xl font-black tracking-tight">Classe NTC — Vue d'ensemble</h2>
                                <span className="bg-secondary text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-secondary/20 flex items-center gap-2">
                                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                                    En direct
                                </span>
                            </div>
                            <p className="text-slate-400 font-medium text-lg">Suivi en temps réel des dossiers d'admission et statut des alternances pour la promotion actuelle.</p>
                        </div>
                        <Button variant="outline" size="lg" leftIcon={<Download size={20} />}>
                            Exporter la liste
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[ 
                        { label: 'Étudiants inscrits', value: 35, icon: Users, color: 'primary' },
                        { label: 'Alternance validée', value: 16, icon: CheckCircle2, color: 'secondary' },
                        { label: 'Dossiers complets', value: 28, icon: FileCheck, color: 'primary' },
                    ].map((stat, i) => (
                        <Card key={i} variant="premium" className="group">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all group-hover:scale-110
                                    ${stat.color === 'secondary' ? 'bg-secondary text-white shadow-secondary/20' : 'bg-primary text-white shadow-primary/20'}
                                `}> <stat.icon size={28} /> </div>
                            </div>
                            <div className="text-5xl font-black text-slate-800 mb-1 tracking-tighter">{stat.value}</div>
                            <div className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">{stat.label}</div>
                        </Card>
                    ))}
                </div>

                <Card variant="premium" noPadding className="overflow-hidden">
                    <div className="p-6 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center px-8">
                        <div className="relative w-96 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={18} />
                            <input type="text" placeholder="Rechercher un talent..." className="w-full pl-12 pr-4 py-3 bg-white border-2 border-transparent rounded-2xl focus:border-primary outline-none transition-all font-bold text-slate-700 shadow-sm" />
                        </div>
                    </div>
                    <table className="premium-table">
                        <thead>
                            <tr>
                                <th>Nom de l'étudiant</th>
                                <th>Dossier Étudiant</th>
                                <th>Dossier Entreprise</th>
                                <th className="text-center">Statut Alternance</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="group">
                                <td>
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-black text-sm group-hover:bg-primary group-hover:text-white transition-all">MK</div>
                                        <div>
                                            <div className="font-black text-slate-800">KELLAL KINY</div>
                                            <div className="text-[11px] font-bold text-slate-400">Miriam</div>
                                        </div>
                                    </div>
                                </td>
                                <td><span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-secondary-50 text-secondary text-[10px] font-black uppercase tracking-wider">✓ Complété</span></td>
                                <td><span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-secondary-50 text-secondary text-[10px] font-black uppercase tracking-wider">✓ Complété</span></td>
                                <td className="text-center"><span className="inline-flex items-center px-4 py-1 rounded-full bg-secondary-50 text-secondary text-[10px] font-black uppercase tracking-widest border border-secondary-100 shadow-sm">Validée</span></td>
                            </tr>
                        </tbody>
                    </table>
                </Card>
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
                        <h1 className="text-3xl md:text-4xl font-extrabold mb-3 tracking-tight">Admission Rush School</h1>
                        <p className="text-indigo-100 text-lg leading-relaxed opacity-90">Complétez votre dossier d'admission : tests, documents et formalités administratives.</p>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-8 mb-8 flex items-center justify-center overflow-x-auto shadow-sm">
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
                <button onClick={() => setMainTab('ntc')} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${mainTab === 'ntc' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}>
                    Classe NTC
                    <span className="bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded-full text-[10px]">35</span>
                </button>
            </div>

            <div className="flex overflow-x-auto gap-2 mb-8 bg-[#F1F5F9] p-2 rounded-2xl border border-slate-200 no-scrollbar">
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
                        <div className="bg-white border border-slate-200 rounded-3xl p-10 shadow-sm">
                            <h3 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-3">
                                <GraduationCap className="text-blue-500" /> Sélectionnez votre formation
                            </h3>
                            <p className="text-slate-500 mb-8 ml-9">Choisissez la formation pour accéder au test.</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {FORMATION_CARDS.map(f => (
                                    <div key={f.id} onClick={() => setSelectedFormation(f.id)} className="bg-[#F8FAFC] border-2 border-slate-200 rounded-2xl p-6 text-center cursor-pointer hover:border-blue-500 hover:-translate-y-1 hover:shadow-lg transition-all group">
                                        <div className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white bg-gradient-to-br from-${f.color}-500 to-${f.color}-600 shadow-lg`}>
                                            <Briefcase size={28} />
                                        </div>
                                        <h4 className="font-bold text-slate-800 text-lg mb-1">{f.title}</h4>
                                        <p className="text-xs text-slate-500 mb-4 h-10">{f.subtitle}</p>
                                        <span className="inline-block px-3 py-1 bg-white rounded-full text-xs font-semibold text-slate-500 group-hover:text-blue-600 group-hover:bg-blue-50 transition-colors">~20 min</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col relative animate-slide-in shadow-lg">
                            <div className="bg-slate-50 border-b border-slate-200 p-4 flex justify-between items-center sticky top-0 z-20">
                                <button
                                    onClick={() => setSelectedFormation(null)}
                                    className="text-slate-500 hover:text-slate-800 flex items-center gap-2 font-semibold text-sm transition-colors"
                                >
                                    <ChevronLeft size={18} /> Changer de formation
                                </button>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-bold text-slate-700 hidden md:block">Test: {FORMATION_CARDS.find(f => f.id === selectedFormation)?.title}</span>
                                    <Button variant="success" size="sm" onClick={handleFinishTest} leftIcon={<CheckCircle2 size={16} />}>
                                        J'ai envoyé mes réponses
                                    </Button>
                                </div>
                            </div>
                            <div className="w-full h-[800px] bg-slate-100 relative">
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
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6 mb-6 flex items-center gap-5 relative overflow-hidden">
                        <div className="w-14 h-14 bg-white text-blue-600 rounded-2xl flex items-center justify-center shrink-0 shadow-sm relative z-10">
                            <Upload size={28} />
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-lg font-bold text-slate-800">Documents à téléverser</h3>
                            <p className="text-slate-500 text-sm">Complétez votre dossier avec les pièces justificatives.</p>
                        </div>
                        {!studentData && (
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2 text-amber-600 bg-amber-50 px-4 py-2 rounded-xl border border-amber-200">
                                <AlertCircle size={18} />
                                <span className="text-sm font-bold">Dossier étudiant requis</span>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {REQUIRED_DOCUMENTS.map((doc) => {
                            const isUploaded = uploadedFiles[doc.id];
                            const isUploading = uploadingFiles[doc.id];

                            return (
                                <div key={doc.id} className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all cursor-pointer group relative overflow-hidden ${isUploaded
                                    ? 'border-emerald-400 bg-emerald-50'
                                    : 'border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50'
                                    }`}>
                                    <input
                                        type="file"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                                        disabled={isUploading || !studentData}
                                        onChange={(e) => handleFileChange(e, doc.id)}
                                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                    />

                                    {isUploading ? (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-20">
                                            <Loader2 size={32} className="animate-spin text-blue-600 mb-2" />
                                            <span className="text-xs font-bold text-blue-600">Envoi en cours...</span>
                                        </div>
                                    ) : null}

                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors ${isUploaded
                                        ? 'bg-emerald-100 text-emerald-600'
                                        : 'bg-slate-100 text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-500'
                                        }`}>
                                        {isUploaded ? <CheckCircle2 size={24} /> : <Upload size={24} />}
                                    </div>
                                    <h4 className={`font-bold mb-1 ${isUploaded ? 'text-emerald-800' : 'text-slate-700'}`}>{doc.title}</h4>
                                    <p className={`text-xs mb-4 ${isUploaded ? 'text-emerald-600' : 'text-slate-400'}`}>{doc.desc}</p>

                                    <button className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors pointer-events-none ${isUploaded
                                        ? 'bg-emerald-200 text-emerald-800'
                                        : 'bg-slate-900 text-white group-hover:bg-slate-800'}`}>
                                        {isUploaded ? 'Document reçu' : 'Téléverser'}
                                    </button>
                                </div>
                            )
                        })}
                    </div>

                    <div className="mt-8 bg-white border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
                        <div className="w-full md:w-1/2">
                            <div className="flex justify-between text-sm font-semibold mb-2">
                                <span className="text-slate-800">{uploadedCount} / {REQUIRED_DOCUMENTS.length} documents</span>
                                <span className="text-blue-500">{Math.round(progressPercent)}%</span>
                            </div>
                            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-500 ease-out bg-gradient-to-r from-blue-500 to-indigo-500"
                                    style={{ width: `${progressPercent}%` }}
                                ></div>
                            </div>
                        </div>
                        <Button
                            disabled={!studentData}
                            onClick={() => setActiveTab(AdmissionTab.ENTREPRISE)}
                            className="w-full md:w-auto"
                        >
                            Continuer vers la Fiche Entreprise
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
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6 flex items-center gap-5">
                        <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-violet-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-violet-500/20">
                            <Printer size={28} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">Dossier administratif</h3>
                            <p className="text-slate-500 text-sm">Ces documents seront complétés avec le chargé d'admission.</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {ADMIN_DOCS.map(doc => (
                            <div key={doc.id} className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all group">
                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br from-${doc.color}-400 to-${doc.color}-600 flex items-center justify-center text-white mb-4 shadow-lg`}>
                                    <FileText size={24} />
                                </div>
                                <h4 className="font-bold text-slate-800 text-lg mb-1">{doc.title}</h4>
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">{doc.subtitle}</p>
                                <p className="text-sm text-slate-400 mb-6">{doc.desc}</p>
                                <button
                                    id={`btn-${doc.id}`}
                                    onClick={() => handleDocAction(doc)}
                                    className="w-full py-2.5 rounded-lg border-2 border-slate-100 font-bold text-slate-600 hover:border-slate-300 hover:text-slate-800 transition-all flex items-center justify-center gap-2"
                                >
                                    {doc.btnText} <ArrowRight size={14} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end mt-8">
                        <Button onClick={() => setActiveTab(AdmissionTab.ENTRETIEN)} rightIcon={<ArrowRight size={20} />}>
                            Continuer vers Entretien
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
