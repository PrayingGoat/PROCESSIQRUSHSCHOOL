import React, { useState, useRef, useEffect } from 'react';
import { 
  CheckCircle2, 
  FileText, 
  PenTool, 
  Briefcase, 
  GraduationCap, 
  Upload,
  Info,
  ChevronDown,
  ArrowRight,
  Building,
  UserCheck,
  AlertCircle,
  FileCheck,
  Printer,
  X,
  Loader2,
  Download,
  RotateCcw,
  Save
} from 'lucide-react';
import { AdmissionTab } from '../types';
import QuestionnaireForm from './QuestionnaireForm';
import { api } from '../services/api';

// --- CONFIGURATION ---

const FORMATION_FORMS: Record<string, string> = {
  mco: "https://docs.google.com/forms/d/e/1FAIpQLSdoGS2NZKs3sGRZ-dZ-3a8x9JZ32FQcpBQupMmD4CUQpEhnuw/viewform?embedded=true", 
  ndrc: "https://docs.google.com/forms/d/e/1FAIpQLSeDDzl2VDR__aY776N_7auk4uAZc04uC6mQNUsRNOr9D3eCmw/viewform?embedded=true",
  bachelor: "https://docs.google.com/forms/d/e/1FAIpQLSdzOg66p81XV9Ghb4dS6xP2r-BCw4qiGECU4F01Vs7VlrJNCQ/viewform?embedded=true",
  ntc: "https://docs.google.com/forms/d/e/1FAIpQLSfW-Gi40ZBpU9zymrYBZ05P8s2TSSL88OYwkp5lzPSNDXTnhA/viewform?embedded=true",
};

const REQUIRED_DOCUMENTS = [
  { id: 'cv', title: "CV", desc: "Curriculum Vitae à jour" },
  { id: 'cni', title: "Carte d'Identité", desc: "Recto-verso de la CNI" },
  { id: 'lettre', title: "Lettre de motivation", desc: "Exposez vos motivations" },
  { id: 'vitale', title: "Carte Vitale", desc: "Attestation de droits" },
  { id: 'diplome', title: "Dernier Diplôme", desc: "Copie du dernier diplôme" },
];

// Documents administratifs à générer
const ADMIN_DOCS = [
  { 
    id: 'atre', 
    title: "Fiche ATRE", 
    subtitle: "Autorisation de Travail et Renseignements", 
    desc: "Information entreprise et tuteur",
    type: 'form',
    color: 'orange',
    btnText: 'Compléter'
  },
  { 
    id: 'renseignements', 
    title: "Fiche de renseignements", 
    subtitle: "Informations personnelles", 
    desc: "Coordonnées et état civil",
    type: 'form',
    color: 'blue',
    btnText: 'Compléter'
  },
  { 
    id: 'reglement', 
    title: "Règlement intérieur", 
    subtitle: "Engagement étudiant", 
    desc: "Document à lire et signer",
    type: 'sign',
    color: 'green',
    btnText: 'Signer'
  },
  { 
    id: 'connaissance', 
    title: "Prise de connaissance", 
    subtitle: "Attestation documents", 
    desc: "Charte informatique, Livret d'accueil...",
    type: 'sign',
    color: 'purple',
    btnText: 'Signer'
  },
  { 
    id: 'livret', 
    title: "Livret d'apprentissage", 
    subtitle: "Suivi pédagogique", 
    desc: "Document de liaison CFA/Entreprise",
    type: 'generate',
    color: 'cyan',
    btnText: 'Générer'
  },
];

const DEFAULT_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLScs38d38d38d38d38d38d38d38d38d38d38d38d38d38d3/viewform?embedded=true"; 

// --- COMPONENTS ---

const StepItem = ({ step, label, isActive, isCompleted }: { step: number, label: string, isActive: boolean, isCompleted: boolean }) => (
  <div className="flex flex-col items-center gap-2 relative z-10">
    <div className={`w-11 h-11 rounded-full border-2 flex items-center justify-center font-bold text-base transition-all duration-300 ${
      isCompleted 
        ? 'bg-emerald-500 border-emerald-500 text-white' 
        : isActive 
          ? 'bg-blue-600 border-blue-600 text-white scale-110 shadow-lg shadow-blue-500/30' 
          : 'bg-slate-50 border-slate-200 text-slate-400'
    }`}>
      {isCompleted ? <CheckCircle2 size={20} /> : step}
    </div>
    <div className={`text-xs font-semibold uppercase tracking-wide transition-colors duration-300 ${isActive ? 'text-blue-600' : isCompleted ? 'text-emerald-600' : 'text-slate-400'}`}>
      {label}
    </div>
  </div>
);

const StepLine = ({ isCompleted }: { isCompleted: boolean }) => (
  <div className={`h-[3px] w-12 md:w-20 rounded-full mx-2 mb-6 transition-colors duration-500 ${isCompleted ? 'bg-emerald-500' : 'bg-slate-200'}`}></div>
);

const FormationCard = ({ icon, title, desc, duration, color, selected, onClick }: any) => {
  const styles = {
    blue: { icon: 'bg-gradient-to-br from-blue-500 to-blue-600', border: 'hover:border-blue-300' },
    green: { icon: 'bg-gradient-to-br from-emerald-500 to-emerald-600', border: 'hover:border-emerald-300' },
    purple: { icon: 'bg-gradient-to-br from-violet-500 to-violet-600', border: 'hover:border-violet-300' },
    orange: { icon: 'bg-gradient-to-br from-orange-500 to-orange-600', border: 'hover:border-orange-300' },
  }[color as string] || { icon: 'bg-slate-500', border: 'border-slate-200' };

  return (
    <div 
      onClick={onClick}
      className={`bg-white border-2 rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${
        selected ? 'border-blue-500 bg-blue-50 shadow-blue-500/10' : `border-slate-100 ${styles.border}`
      }`}
    >
      <div className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white ${styles.icon} shadow-lg shadow-black/5`}>
        {icon}
      </div>
      <h4 className="font-bold text-slate-800 text-lg mb-1">{title}</h4>
      <p className="text-xs text-slate-500 leading-relaxed mb-4 h-9">{desc}</p>
      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${selected ? 'bg-blue-200 text-blue-800' : 'bg-slate-100 text-slate-500'}`}>
        {duration}
      </span>
    </div>
  );
};

interface FileUploadCardProps {
  id: string;
  title: string;
  desc: string;
  fileName?: string;
  uploading?: boolean;
  onUpload: (file: File) => void;
}

const FileUploadCard: React.FC<FileUploadCardProps> = ({ id, title, desc, fileName, uploading, onUpload }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const uploaded = !!fileName;

  const handleClick = () => {
    if (!uploading) inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
    }
  };

  return (
    <div 
      onClick={handleClick}
      className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all cursor-pointer group relative overflow-hidden ${
        uploaded 
          ? 'border-emerald-300 bg-emerald-50/50' 
          : 'border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50'
      }`}
    >
      <input 
        type="file" 
        ref={inputRef} 
        onChange={handleChange} 
        className="hidden" 
        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
      />
      
      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors ${
        uploaded 
          ? 'bg-emerald-100 text-emerald-600' 
          : 'bg-slate-100 text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-500'
      }`}>
        {uploading ? (
          <Loader2 size={24} className="animate-spin text-blue-500" />
        ) : uploaded ? (
          <CheckCircle2 size={24} />
        ) : (
          <Upload size={24} />
        )}
      </div>
      
      <h4 className={`font-bold mb-1 ${uploaded ? 'text-emerald-800' : 'text-slate-700'}`}>{title}</h4>
      
      {uploaded ? (
        <p className="text-xs text-emerald-600 font-medium mb-4 flex items-center gap-1 max-w-full truncate px-2">
          <FileCheck size={12} />
          {fileName}
        </p>
      ) : (
        <p className="text-xs text-slate-400 mb-4">{desc}</p>
      )}

      <button className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
        uploaded 
          ? 'bg-white text-emerald-600 border border-emerald-200 hover:bg-emerald-50' 
          : 'bg-slate-900 text-white hover:bg-slate-800'
      }`}>
        {uploading ? 'Envoi...' : uploaded ? 'Remplacer' : 'Téléverser'}
      </button>
    </div>
  );
};

// --- ENTRETIEN SPECIFIC COMPONENTS ---

const EvalCriteriaRowHTML = ({ title, desc, name, value, onChange }: { title: string, desc: string, name: string, value: number, onChange: (val: number) => void }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] border-b border-slate-200 last:border-0 last:rounded-b-xl group hover:bg-slate-50/50 transition-colors">
      <div className="p-6 md:border-r border-slate-200">
        <h4 className="font-bold text-slate-800 text-base mb-2">{title}</h4>
        <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
      </div>
      <div className="flex items-center justify-center p-4 bg-slate-50/30">
        <div className="flex border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
          {[1, 2, 3, 4, 5].map((val) => (
            <label key={val} className="cursor-pointer relative border-r border-slate-100 last:border-0">
              <input 
                type="radio" 
                name={name} 
                value={val} 
                checked={value === val}
                onChange={() => onChange(val)}
                className="peer sr-only" 
              />
              <div className="w-12 h-full min-h-[48px] flex items-center justify-center font-bold text-slate-400 transition-all hover:bg-blue-50 peer-checked:bg-indigo-600 peer-checked:text-white">
                {val}
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

interface FormInputProps {
  label: string;
  name: string;
  value: string;
  placeholder?: string;
  required?: boolean;
  hint?: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormInput = ({ label, name, value, placeholder, required = true, hint, error, onChange }: FormInputProps) => (
  <div>
    <label className="block text-sm font-semibold text-slate-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input 
      type="text" 
      name={name}
      value={value}
      onChange={onChange}
      className={`w-full px-4 py-3 bg-white border rounded-xl transition-all focus:ring-4 focus:outline-none ${
        error 
          ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10' 
          : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/10'
      }`} 
      placeholder={placeholder} 
    />
    {error && (
      <p className="mt-1.5 text-xs text-red-500 font-medium flex items-center gap-1">
        <AlertCircle size={12}/> {error}
      </p>
    )}
    {!error && hint && (
      <p className="mt-1.5 text-xs text-slate-400">{hint}</p>
    )}
  </div>
);

// Formulaire Entreprise intégré
const EntrepriseForm = ({ onNext }: { onNext: () => void }) => {
  const [formData, setFormData] = useState({
    raisonSociale: '',
    siret: '',
    codeNaf: '',
    adresse: '',
    maitreNom: '',
    maitrePrenom: '',
    maitreFonction: '',
    maitreEmail: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const siretRegex = /^\d{14}$/; 
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Entreprise
    if (!formData.raisonSociale.trim()) newErrors.raisonSociale = "La raison sociale est requise";
    if (!formData.siret.trim()) newErrors.siret = "Le SIRET est requis";
    else if (!siretRegex.test(formData.siret.replace(/\s/g, ''))) newErrors.siret = "Le SIRET doit contenir 14 chiffres";
    
    if (!formData.codeNaf.trim()) newErrors.codeNaf = "Le code APE/NAF est requis";
    if (!formData.adresse.trim()) newErrors.adresse = "L'adresse du siège est requise";

    // Maître d'apprentissage
    if (!formData.maitreNom.trim()) newErrors.maitreNom = "Le nom est requis";
    if (!formData.maitrePrenom.trim()) newErrors.maitrePrenom = "Le prénom est requis";
    if (!formData.maitreFonction.trim()) newErrors.maitreFonction = "La fonction est requise";
    if (!formData.maitreEmail.trim()) newErrors.maitreEmail = "L'email est requis";
    else if (!emailRegex.test(formData.maitreEmail)) newErrors.maitreEmail = "Format d'email invalide";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validate()) {
      setIsSubmitting(true);
      try {
        await api.submitCompany(formData);
        onNext();
      } catch (error: any) {
        console.error("Erreur soumission entreprise", error);
        alert(`Erreur lors de l'enregistrement: ${error.message}`);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-gradient-to-br from-emerald-50 to-white rounded-3xl p-6 md:p-10 shadow-xl border border-emerald-100 relative overflow-hidden animate-slide-in">
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"></div>
      
      <div className="flex items-center gap-6 mb-10 pb-8 border-b border-emerald-100">
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-emerald-500/20">
          <Building size={32} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-1">Fiche de Renseignement Entreprise</h2>
          <p className="text-slate-500">Informations pour le contrat d'apprentissage</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* 1. Entreprise */}
        <div className={`bg-white/80 p-6 rounded-2xl border shadow-sm transition-colors ${
           Object.keys(errors).some(k => ['raisonSociale','siret','codeNaf','adresse'].includes(k)) 
           ? 'border-red-200' 
           : 'border-emerald-100'
        }`}>
          <div className="flex items-center gap-3 mb-5">
            <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">1</span>
            <h3 className="font-bold text-slate-800">Identification de l'entreprise</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="col-span-2">
              <FormInput label="Raison sociale" name="raisonSociale" value={formData.raisonSociale} onChange={handleChange} error={errors.raisonSociale} placeholder="Nom de l'entreprise" />
            </div>
            <FormInput label="SIRET" name="siret" value={formData.siret} onChange={handleChange} error={errors.siret} placeholder="14 chiffres" hint="Sans espaces" />
            <FormInput label="Code APE/NAF" name="codeNaf" value={formData.codeNaf} onChange={handleChange} error={errors.codeNaf} placeholder="Ex: 4711D" />
            <div className="col-span-2">
              <FormInput label="Adresse du siège" name="adresse" value={formData.adresse} onChange={handleChange} error={errors.adresse} placeholder="Adresse complète (Rue, CP, Ville)" />
            </div>
          </div>
        </div>

        {/* 2. Maître d'apprentissage */}
        <div className={`bg-white/80 p-6 rounded-2xl border shadow-sm transition-colors ${
           Object.keys(errors).some(k => ['maitreNom','maitrePrenom','maitreFonction','maitreEmail'].includes(k)) 
           ? 'border-red-200' 
           : 'border-emerald-100'
        }`}>
          <div className="flex items-center gap-3 mb-5">
            <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">2</span>
            <h3 className="font-bold text-slate-800">Maître d'apprentissage</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormInput label="Nom" name="maitreNom" value={formData.maitreNom} onChange={handleChange} error={errors.maitreNom} placeholder="Nom" />
            <FormInput label="Prénom" name="maitrePrenom" value={formData.maitrePrenom} onChange={handleChange} error={errors.maitrePrenom} placeholder="Prénom" />
            <FormInput label="Fonction" name="maitreFonction" value={formData.maitreFonction} onChange={handleChange} error={errors.maitreFonction} placeholder="Fonction dans l'entreprise" />
            <FormInput label="Email" name="maitreEmail" value={formData.maitreEmail} onChange={handleChange} error={errors.maitreEmail} placeholder="email@entreprise.com" />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-emerald-100">
          <button className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors">
            Enregistrer brouillon
          </button>
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold hover:shadow-lg hover:shadow-emerald-500/25 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : null}
            {isSubmitting ? 'Validation...' : 'Valider et continuer'}
            {Object.keys(errors).length > 0 && !isSubmitting && <AlertCircle size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- MAIN VIEW ---

const AdmissionView = () => {
  const [activeTab, setActiveTab] = useState<AdmissionTab>(AdmissionTab.TESTS);
  const [selectedFormation, setSelectedFormation] = useState<string | null>(null);
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  
  // State for Student Data (Step 2)
  const [studentData, setStudentData] = useState<any>(null);

  // State for Documents (Step 3)
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File>>({});
  const [uploadingState, setUploadingState] = useState<Record<string, boolean>>({});

  // State for Entreprise (Step 4)
  const [entrepriseCompleted, setEntrepriseCompleted] = useState(false);

  // State for Admin (Step 5)
  const [adminCompleted, setAdminCompleted] = useState(false);
  const [activeDocModal, setActiveDocModal] = useState<string | null>(null);
  const [docsStatus, setDocsStatus] = useState<Record<string, 'pending' | 'completed'>>({
    atre: 'pending',
    renseignements: 'pending',
    reglement: 'pending',
    connaissance: 'pending',
    livret: 'pending'
  });

  // State for Evaluation
  const [scores, setScores] = useState<Record<string, number>>({
    critere1: 0,
    critere2: 0,
    critere3: 0,
    critere4: 0
  });
  
  const [interviewInfo, setInterviewInfo] = useState({
    candidat: '',
    heure: '',
    charge: '',
    date: new Date().toISOString().split('T')[0],
    formation: '',
    commentaires: ''
  });

  // Flow handlers
  const handleStartTest = () => setTestStarted(true);
  const handleFinishTest = () => {
    setTestStarted(false);
    setTestCompleted(true);
  };
  const handleContinueToStudent = () => setActiveTab(AdmissionTab.QUESTIONNAIRE);

  // Document Handler
  const handleFileUpload = async (docId: string, file: File) => {
    // Check if we have an ID (record_id or id)
    const recordId = studentData?.record_id || studentData?.id || studentData?.data?.id || studentData?.data?.record_id;

    if (!recordId) { 
        console.warn("Pas d'ID étudiant trouvé, mode simulation upload");
        setUploadedFiles(prev => ({ ...prev, [docId]: file }));
        return;
    }

    try {
        setUploadingState(prev => ({ ...prev, [docId]: true }));
        await api.uploadDocument(recordId, docId, file);
        setUploadedFiles(prev => ({ ...prev, [docId]: file }));
    } catch (error: any) {
        alert("Erreur lors de l'envoi du document: " + error.message);
    } finally {
        setUploadingState(prev => ({ ...prev, [docId]: false }));
    }
  };

  // Doc Modal Handlers
  const openDocModal = (docId: string) => setActiveDocModal(docId);
  const closeDocModal = () => setActiveDocModal(null);
  
  const handleDocSubmit = (docId: string) => {
    setDocsStatus(prev => ({ ...prev, [docId]: 'completed' }));
    closeDocModal();
  };

  // Score logic
  const totalScore = (Object.values(scores) as number[]).reduce((sum, score) => sum + score, 0);
  
  const getAppreciation = (score: number) => {
    if (score === 0) return { text: "-", color: "text-slate-400" };
    if (score >= 17) return { text: "EXCELLENT", color: "text-emerald-600" };
    if (score >= 14) return { text: "TRÈS SATISFAISANT", color: "text-blue-600" };
    if (score >= 10) return { text: "SATISFAISANT", color: "text-cyan-600" };
    if (score >= 6) return { text: "PASSABLE", color: "text-orange-600" };
    return { text: "INSUFFISANT", color: "text-red-600" };
  };

  const appreciation = getAppreciation(totalScore);

  // Progress Calculation for Documents
  const totalDocs = REQUIRED_DOCUMENTS.length;
  const uploadedCount = Object.keys(uploadedFiles).length;
  const uploadProgress = Math.round((uploadedCount / totalDocs) * 100);
  const allDocumentsUploaded = uploadedCount === totalDocs;

  // Render content for specific modal
  const renderDocModalContent = (docId: string) => {
    return <div className="p-4 text-center text-slate-500">Formulaire en cours de développement</div>;
  };
  
  // Sync candidate info to interview form if available
  useEffect(() => {
    if (studentData) {
        // Handle potentially nested data from API response wrapper
        const candidate = studentData.data || studentData;
        
        const formationMapping: Record<string, string> = {
            'bts_mco': 'BTS MCO',
            'bts_ndrc': 'BTS NDRC',
            'bachelor': 'BACHELOR RDC',
            'tp_ntc': 'TP NTC'
        };

        const rawFormation = candidate.formation_souhaitee || candidate.formation || '';
        const mappedFormation = formationMapping[rawFormation] || (rawFormation.toUpperCase ? rawFormation.toUpperCase().replace('_', ' ') : rawFormation);
        
        const nom = candidate.nom_naissance || candidate.nom || "";
        const prenom = candidate.prenom || "";
        const nomUpper = nom.toUpperCase ? nom.toUpperCase() : nom;

        setInterviewInfo(prev => ({
            ...prev,
            candidat: `${nomUpper} ${prenom}`, // Norme: NOM Prénom
            formation: mappedFormation
        }));
    }
  }, [studentData]);

  return (
    <div className="animate-fade-in max-w-6xl mx-auto pb-20">
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-10 mb-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-500/20">
         <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
         <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-full text-sm font-medium mb-4 backdrop-blur-sm border border-white/10">
                <Briefcase size={14} /> Processus d'admission
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold mb-3 tracking-tight">Admission Rush School</h1>
              <p className="text-indigo-100 text-lg leading-relaxed opacity-90">Complétez votre dossier d'admission : tests, documents et formalités administratives.</p>
            </div>
            {/* 3D Icon placeholder */}
            <div className="hidden md:flex w-24 h-24 bg-white/10 rounded-2xl items-center justify-center backdrop-blur-md border border-white/20 shadow-inner animate-pulse-slow">
               <GraduationCap size={48} className="text-indigo-100" />
            </div>
         </div>
      </div>

      {/* Stepper */}
      <div className="bg-white border border-slate-200 rounded-2xl p-8 mb-8 flex items-center justify-center overflow-x-auto shadow-sm">
        <div className="flex items-center min-w-max">
          <StepItem step={1} label="Tests" isActive={activeTab === AdmissionTab.TESTS} isCompleted={testCompleted} />
          <StepLine isCompleted={testCompleted} />
          
          <StepItem step={2} label="Étudiant" isActive={activeTab === AdmissionTab.QUESTIONNAIRE} isCompleted={!!studentData} />
          <StepLine isCompleted={!!studentData} />
          
          <StepItem step={3} label="Documents" isActive={activeTab === AdmissionTab.DOCUMENTS} isCompleted={allDocumentsUploaded} />
          <StepLine isCompleted={allDocumentsUploaded} />
          
          <StepItem step={4} label="Entreprise" isActive={activeTab === AdmissionTab.ENTREPRISE} isCompleted={entrepriseCompleted} />
          <StepLine isCompleted={entrepriseCompleted} />
          
          <StepItem step={5} label="Admin" isActive={activeTab === AdmissionTab.ADMINISTRATIF} isCompleted={adminCompleted} />
          <StepLine isCompleted={adminCompleted} />
          
          <StepItem step={6} label="Entretien" isActive={activeTab === AdmissionTab.ENTRETIEN} isCompleted={false} />
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="flex overflow-x-auto gap-2 mb-8 bg-white p-2 rounded-2xl border border-slate-200 no-scrollbar shadow-sm">
        {[
          { id: AdmissionTab.TESTS, label: 'Tests', icon: <PenTool size={18}/> },
          { id: AdmissionTab.QUESTIONNAIRE, label: 'Fiche Étudiant', icon: <Info size={18}/> },
          { id: AdmissionTab.DOCUMENTS, label: 'Documents', icon: <Upload size={18}/> },
          { id: AdmissionTab.ENTREPRISE, label: 'Fiche Entreprise', icon: <Building size={18}/> },
          { id: AdmissionTab.ADMINISTRATIF, label: 'Administratif', icon: <Briefcase size={18}/> },
          { id: AdmissionTab.ENTRETIEN, label: 'Entretien', icon: <UserCheck size={18}/> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === tab.id 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* --- TAB CONTENT: TESTS --- */}
      {activeTab === AdmissionTab.TESTS && (
        <div key="tests" className="space-y-6 animate-slide-in">
           {/* Step 1: Selection */}
           {!selectedFormation && (
             <div className="bg-white border border-slate-200 rounded-3xl p-10 shadow-sm">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                    <GraduationCap size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">Sélectionnez votre formation</h3>
                </div>
                <p className="text-slate-500 mb-10 ml-14">Choisissez la formation pour laquelle vous postulez afin d'accéder au test correspondant.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                   <FormationCard 
                      icon={<Briefcase size={32}/>} 
                      title="BTS MCO" 
                      desc="Management Commercial Opérationnel"
                      duration="~20 min"
                      color="blue"
                      selected={selectedFormation === 'mco'}
                      onClick={() => setSelectedFormation('mco')}
                   />
                   <FormationCard 
                      icon={<Info size={32}/>} 
                      title="BTS NDRC" 
                      desc="Négociation et Digitalisation"
                      duration="~20 min"
                      color="green"
                      selected={selectedFormation === 'ndrc'}
                      onClick={() => setSelectedFormation('ndrc')}
                   />
                   <FormationCard 
                      icon={<GraduationCap size={32}/>} 
                      title="BACHELOR" 
                      desc="Responsable Développement Commercial"
                      duration="~25 min"
                      color="purple"
                      selected={selectedFormation === 'bachelor'}
                      onClick={() => setSelectedFormation('bachelor')}
                   />
                   <FormationCard 
                      icon={<PenTool size={32}/>} 
                      title="TP NTC" 
                      desc="Négociateur Technico-Commercial"
                      duration="~20 min"
                      color="orange"
                      selected={selectedFormation === 'ntc'}
                      onClick={() => setSelectedFormation('ntc')}
                   />
                </div>
             </div>
           )}

           {/* Step 2: Confirmation & Instructions */}
           {selectedFormation && !testStarted && !testCompleted && (
              <div className="animate-slide-in">
                {/* Banner */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white flex justify-between items-center mb-6 shadow-lg shadow-blue-500/20">
                   <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                         <GraduationCap size={28} />
                      </div>
                      <div>
                         <span className="text-blue-100 text-sm font-medium">Formation sélectionnée</span>
                         <h3 className="text-xl font-bold">{selectedFormation.toUpperCase()}</h3>
                      </div>
                   </div>
                   <button 
                      onClick={() => setSelectedFormation(null)}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors"
                   >
                      Changer
                   </button>
                </div>

                {/* Instructions */}
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 mb-6">
                   <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-amber-500 shadow-sm shrink-0">
                         <Info size={20} />
                      </div>
                      <div>
                         <h4 className="font-bold text-slate-800 text-lg mb-4">Instructions avant de commencer</h4>
                         <ul className="space-y-3 text-slate-600">
                            <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div> Assurez-vous d'avoir une connexion internet stable</li>
                            <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div> Prévoyez environ 20-25 minutes sans interruption</li>
                            <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div> Une fois commencé, le test doit être terminé en une fois</li>
                         </ul>
                      </div>
                   </div>
                </div>

                <div className="text-center bg-white border border-slate-200 rounded-2xl p-12">
                   <button 
                      onClick={handleStartTest}
                      className="px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-lg shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-1 transition-all"
                   >
                      Commencer le test
                   </button>
                   <p className="mt-4 text-slate-400 text-sm">Le formulaire s'ouvrira directement dans la plateforme</p>
                </div>
              </div>
           )}

           {/* Step 3: Google Form Integration */}
           {testStarted && !testCompleted && (
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col relative animate-slide-in shadow-lg">
                 {/* Toolbar */}
                 <div className="bg-slate-50 border-b border-slate-200 p-4 flex justify-between items-center sticky top-0 z-20">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                            <PenTool size={16} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 text-sm">Test d'admission : {selectedFormation?.toUpperCase()}</h3>
                            <p className="text-xs text-slate-500">Remplissez le formulaire ci-dessous</p>
                        </div>
                    </div>
                    <button 
                       onClick={handleFinishTest}
                       className="px-5 py-2 bg-emerald-500 text-white rounded-lg font-bold text-sm hover:bg-emerald-600 transition-colors flex items-center gap-2 shadow-sm"
                    >
                       <CheckCircle2 size={16} />
                       J'ai envoyé mes réponses
                    </button>
                 </div>

                 {/* Form Iframe */}
                 <div className="w-full h-[800px] bg-slate-100 relative">
                     <iframe 
                       src={selectedFormation ? (FORMATION_FORMS[selectedFormation] || DEFAULT_FORM_URL) : DEFAULT_FORM_URL}
                       className="absolute inset-0 w-full h-full border-0"
                       title="Formulaire de test"
                     >
                       Chargement du formulaire...
                     </iframe>
                 </div>
              </div>
           )}

           {/* Step 4: Success */}
           {testCompleted && (
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-3xl p-16 text-center animate-slide-in">
                 <div className="w-24 h-24 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/20">
                    <CheckCircle2 size={48} />
                 </div>
                 <h3 className="text-3xl font-bold text-emerald-900 mb-4">Test complété avec succès !</h3>
                 <p className="text-emerald-700/80 text-lg mb-10 max-w-lg mx-auto">Votre test a été enregistré. Vous pouvez maintenant passer à l'étape suivante de votre admission.</p>
                 <button 
                    onClick={handleContinueToStudent}
                    className="px-8 py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors inline-flex items-center gap-2 shadow-lg shadow-emerald-600/20"
                 >
                    Continuer vers la Fiche Étudiant
                    <ArrowRight size={20} />
                 </button>
              </div>
           )}
        </div>
      )}

      {/* --- TAB CONTENT: QUESTIONNAIRE (Fiche Etudiant) --- */}
      {activeTab === AdmissionTab.QUESTIONNAIRE && (
         <div key="questionnaire" className="animate-slide-in">
            <QuestionnaireForm 
              onNext={(data) => {
                setStudentData(data);
                setActiveTab(AdmissionTab.DOCUMENTS);
              }} 
            />
         </div>
      )}

      {/* --- TAB CONTENT: DOCUMENTS --- */}
      {activeTab === AdmissionTab.DOCUMENTS && (
         <div key="documents" className="animate-slide-in space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6 flex items-center gap-5">
               <div className="w-14 h-14 bg-white text-blue-600 rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                  <Upload size={28} />
               </div>
               <div>
                  <h3 className="text-lg font-bold text-slate-800">Documents à téléverser</h3>
                  <p className="text-slate-500 text-sm">Complétez votre dossier avec les pièces justificatives.</p>
                  {!studentData?.id && !studentData?.record_id && !studentData?.data?.id && (
                     <p className="text-amber-600 text-xs font-bold mt-1">⚠️ Veuillez d'abord remplir la fiche étudiant</p>
                  )}
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
               {REQUIRED_DOCUMENTS.map((doc) => (
                 <FileUploadCard 
                    key={doc.id}
                    id={doc.id}
                    title={doc.title} 
                    desc={doc.desc} 
                    fileName={uploadedFiles[doc.id]?.name}
                    uploading={uploadingState[doc.id]}
                    onUpload={(file) => handleFileUpload(doc.id, file)}
                 />
               ))}
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
               <div className="w-full md:w-1/2">
                  <div className="flex justify-between text-sm font-semibold mb-2">
                     <span className="text-slate-800">{uploadedCount} / {totalDocs} documents</span>
                     <span className={`${uploadedCount === totalDocs ? 'text-emerald-500' : 'text-blue-500'}`}>{uploadProgress}%</span>
                  </div>
                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                     <div 
                       className={`h-full rounded-full transition-all duration-500 ease-out ${uploadedCount === totalDocs ? 'bg-emerald-500' : 'bg-blue-500'}`} 
                       style={{ width: `${uploadProgress}%` }}
                     ></div>
                  </div>
               </div>
               <button 
                  onClick={() => setActiveTab(AdmissionTab.ENTREPRISE)}
                  className={`w-full md:w-auto px-8 py-3 font-bold rounded-xl transition-all shadow-lg ${
                    uploadedCount > 0 
                      ? 'bg-slate-900 text-white hover:bg-slate-800 hover:-translate-y-0.5 shadow-slate-900/10'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
               >
                  Continuer vers la Fiche Entreprise
               </button>
            </div>
         </div>
      )}

      {/* --- TAB CONTENT: ENTREPRISE --- */}
      {activeTab === AdmissionTab.ENTREPRISE && (
         <div key="entreprise" className="animate-slide-in">
            <EntrepriseForm onNext={() => {
              setEntrepriseCompleted(true);
              setActiveTab(AdmissionTab.ADMINISTRATIF);
            }} />
         </div>
      )}
      
      {activeTab === AdmissionTab.ADMINISTRATIF && (
         <div key="admin" className="animate-slide-in space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center gap-5">
               <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-violet-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-violet-500/20">
                  <Printer size={28} />
               </div>
               <div>
                  <h3 className="text-lg font-bold text-slate-800">Dossier administratif</h3>
                  <p className="text-slate-500 text-sm">Ces documents seront complétés avec le chargé d'admission.</p>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {ADMIN_DOCS.map((doc) => {
                 const status = docsStatus[doc.id];
                 const isCompleted = status === 'completed';
                 
                 const colorStyles = {
                   orange: 'from-orange-400 to-orange-600 shadow-orange-500/20 border-orange-200',
                   blue: 'from-blue-500 to-blue-700 shadow-blue-500/20 border-blue-200',
                   green: 'from-emerald-500 to-emerald-700 shadow-emerald-500/20 border-emerald-200',
                   purple: 'from-purple-500 to-purple-700 shadow-purple-500/20 border-purple-200',
                   cyan: 'from-cyan-500 to-cyan-700 shadow-cyan-500/20 border-cyan-200',
                 }[doc.color];

                 return (
                   <div key={doc.id} className={`bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group ${isCompleted ? 'ring-2 ring-emerald-500 border-emerald-500' : ''}`}>
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colorStyles} flex items-center justify-center text-white mb-4 shadow-lg`}>
                        {isCompleted ? <CheckCircle2 size={24} /> : <FileText size={24} />}
                      </div>
                      
                      <h4 className="font-bold text-slate-800 text-lg mb-1">{doc.title}</h4>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">{doc.subtitle}</p>
                      <p className="text-sm text-slate-400 mb-6 leading-relaxed">{doc.desc}</p>

                      <div className="flex items-center justify-between mt-auto">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          isCompleted 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {isCompleted ? 'Complété' : 'À faire'}
                        </span>
                        
                        <button 
                          onClick={() => !isCompleted && openDocModal(doc.id)}
                          disabled={isCompleted}
                          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${
                            isCompleted 
                              ? 'bg-slate-100 text-slate-400 cursor-default' 
                              : 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-900/10'
                          }`}
                        >
                          {isCompleted ? 'Fait' : doc.btnText}
                          {!isCompleted && <ArrowRight size={14} />}
                        </button>
                      </div>
                   </div>
                 );
               })}
            </div>

            <div className="flex justify-center mt-8">
               <button 
                  onClick={() => {
                    if (Object.values(docsStatus).every(s => s === 'completed')) {
                        setAdminCompleted(true);
                        setActiveTab(AdmissionTab.ENTRETIEN);
                    } else {
                        alert("Veuillez compléter tous les documents avant de continuer.");
                    }
                  }}
                  className={`px-8 py-4 rounded-xl font-bold text-white shadow-xl flex items-center gap-3 transition-all ${
                    Object.values(docsStatus).every(s => s === 'completed')
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:shadow-emerald-500/30 hover:-translate-y-1'
                      : 'bg-slate-300 cursor-not-allowed'
                  }`}
               >
                  <CheckCircle2 size={20} />
                  Soumettre le dossier complet
               </button>
            </div>
            
            {activeDocModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={closeDocModal}></div>
                <div className="bg-white rounded-2xl w-full max-w-lg relative z-10 overflow-hidden shadow-2xl animate-slide-in">
                  <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800 text-lg">
                      {ADMIN_DOCS.find(d => d.id === activeDocModal)?.title}
                    </h3>
                    <button onClick={closeDocModal} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
                      <X size={20} />
                    </button>
                  </div>
                  <div className="p-6 max-h-[70vh] overflow-y-auto">
                    {renderDocModalContent(activeDocModal)}
                  </div>
                  <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3 bg-slate-50">
                    <button onClick={closeDocModal} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition-colors">
                      Annuler
                    </button>
                    <button 
                      onClick={() => handleDocSubmit(activeDocModal)}
                      className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                    >
                      Valider
                    </button>
                  </div>
                </div>
              </div>
            )}
         </div>
      )}
      
      {activeTab === AdmissionTab.ENTRETIEN && (
          <div key="entretien" className="animate-slide-in">
           <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-8 border-b-2 border-slate-50 gap-6">
                 <div>
                    <h2 className="text-2xl font-bold text-slate-800">CR d'entretien / Grille d'évaluation</h2>
                    <p className="text-slate-500 text-sm mt-1">À remplir par le chargé d'admission (Étape Finale)</p>
                 </div>
                 <div className="flex flex-col items-center">
                    <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-600">RUSH</span>
                    <span className="text-[0.65rem] font-bold text-slate-400 tracking-[0.2em] uppercase">SCHOOL</span>
                 </div>
              </div>
              
              <div className="p-8">
                 {/* Informations candidat */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                     <div className="space-y-2">
                       <label className="block text-sm font-semibold text-slate-600">Nom et Prénom du candidat :</label>
                       <input 
                         type="text" 
                         className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" 
                         placeholder="Entrez le nom complet" 
                         value={interviewInfo.candidat}
                         onChange={(e) => setInterviewInfo({...interviewInfo, candidat: e.target.value})}
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="block text-sm font-semibold text-slate-600">Heure d'entretien :</label>
                       <input 
                         type="time" 
                         className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" 
                         value={interviewInfo.heure}
                         onChange={(e) => setInterviewInfo({...interviewInfo, heure: e.target.value})}
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="block text-sm font-semibold text-slate-600">Nom et Prénom chargé(e) d'admission :</label>
                       <input 
                         type="text" 
                         className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" 
                         placeholder="Votre nom" 
                         value={interviewInfo.charge}
                         onChange={(e) => setInterviewInfo({...interviewInfo, charge: e.target.value})}
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="block text-sm font-semibold text-slate-600">Date d'entretien :</label>
                       <input 
                         type="date" 
                         className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" 
                         value={interviewInfo.date}
                         onChange={(e) => setInterviewInfo({...interviewInfo, date: e.target.value})}
                       />
                    </div>
                 </div>

                 {/* Formation Selection */}
                 <div className="bg-slate-50 p-6 rounded-xl mb-8 border border-slate-100">
                    <label className="block text-sm font-bold text-slate-700 mb-4">Formation :</label>
                    <div className="flex flex-wrap gap-3">
                        {['TP NTC', 'BTS CI', 'BTS COM', 'BTS MCO', 'BTS NDRC', 'BACHELOR RDC'].map((fmt) => (
                            <label key={fmt} className="cursor-pointer group relative">
                                <input 
                                    type="radio" 
                                    name="formation-eval" 
                                    value={fmt}
                                    checked={interviewInfo.formation === fmt}
                                    onChange={(e) => setInterviewInfo({...interviewInfo, formation: e.target.value})}
                                    className="peer sr-only" 
                                />
                                <div className="px-4 py-2 bg-white border-2 border-slate-200 rounded-lg text-sm font-semibold text-slate-500 transition-all peer-checked:border-indigo-500 peer-checked:text-indigo-600 hover:border-slate-300 flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-full border-2 border-slate-300 peer-checked:border-indigo-500 peer-checked:bg-indigo-500 relative flex items-center justify-center">
                                        <div className="w-1.5 h-1.5 bg-white rounded-full opacity-0 peer-checked:opacity-100"></div>
                                    </div>
                                    {fmt}
                                </div>
                            </label>
                        ))}
                    </div>
                 </div>

                 {/* Criteria Grid */}
                 <div className="mb-8 border border-slate-200 rounded-xl overflow-hidden">
                    <div className="hidden md:grid grid-cols-[1fr_repeat(5,80px)] bg-indigo-500 text-white font-bold text-sm">
                        <div className="p-4">Critères</div>
                        <div className="p-2 text-center border-l border-white/20 flex flex-col justify-center bg-indigo-600/30"><span className="text-xs font-normal opacity-80">Insuffisant</span>1 pt</div>
                        <div className="p-2 text-center border-l border-white/20 flex flex-col justify-center"><span className="text-xs font-normal opacity-80">Passable</span>2 pts</div>
                        <div className="p-2 text-center border-l border-white/20 flex flex-col justify-center bg-indigo-600/30"><span className="text-xs font-normal opacity-80">Satisfaisant</span>3 pts</div>
                        <div className="p-2 text-center border-l border-white/20 flex flex-col justify-center"><span className="text-xs font-normal opacity-80">T.Satisfaisant</span>4 pts</div>
                        <div className="p-2 text-center border-l border-white/20 flex flex-col justify-center bg-indigo-600/30"><span className="text-xs font-normal opacity-80">Excellent</span>5 pts</div>
                    </div>

                    <EvalCriteriaRowHTML 
                      title="Savoir-être et présentation :" 
                      desc="Capacité à bien se connaître : ses points forts, ses points de progression et la manière de s'améliorer, exposer une ou plusieurs réussites personnelles de son choix lors d'une activité (difficultés surmontées…), montrer comment il travaille sur sa culture générale, sa curiosité, son ouverture aux autres."
                      name="critere1"
                      value={scores.critere1}
                      onChange={(val) => setScores(prev => ({...prev, critere1: val}))}
                    />
                    <EvalCriteriaRowHTML 
                      title="Cohérence du projet académique et professionnel :" 
                      desc="Capacité à expliquer la logique de construction de son projet d'orientation en fonction de ses appétences/compétences, capacité à exposer son projet professionnel, motivation à rejoindre le programme à travers des éléments concrets."
                      name="critere2"
                      value={scores.critere2}
                      onChange={(val) => setScores(prev => ({...prev, critere2: val}))}
                    />
                    <EvalCriteriaRowHTML 
                      title="Engagements et expérience péri ou extra-scolaires :" 
                      desc="Capacité à mettre en avant ses activités/engagements extra scolaires, richesse, profondeur et variété des expériences, capacité à valoriser les compétences développées au cours de ses activités et bénéfices pour son projet professionnel, envie de participer à la vie associative de l'école et de quelle manière."
                      name="critere3"
                      value={scores.critere3}
                      onChange={(val) => setScores(prev => ({...prev, critere3: val}))}
                    />
                    <EvalCriteriaRowHTML 
                      title="Expression en Anglais :" 
                      desc="Savoir répondre spontanément à quelques questions en anglais."
                      name="critere4"
                      value={scores.critere4}
                      onChange={(val) => setScores(prev => ({...prev, critere4: val}))}
                    />
                 </div>

                 {/* Comments & Global Score */}
                 <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 mb-8">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-3">Commentaires :</label>
                        <textarea 
                          className="w-full h-40 p-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none resize-none text-sm leading-relaxed shadow-sm"
                          placeholder="Vos observations sur le candidat, points forts, points faibles..."
                          value={interviewInfo.commentaires}
                          onChange={(e) => setInterviewInfo({...interviewInfo, commentaires: e.target.value})}
                        ></textarea>
                    </div>
                    <div className="bg-gradient-to-br from-slate-50 to-indigo-50 border border-indigo-100 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-sm">
                        <label className="text-sm font-bold text-indigo-900 uppercase tracking-wider mb-2">Note globale</label>
                        <div className="flex items-baseline gap-1 mb-2">
                            <span className="text-5xl font-extrabold text-indigo-600">{totalScore}</span>
                            <span className="text-xl font-bold text-slate-400">/ 20</span>
                        </div>
                        <div className={`text-sm font-bold px-3 py-1 rounded-full bg-white border shadow-sm ${appreciation.color.replace('text-', 'text-').replace('bg-', 'border-')}`}>
                            {appreciation.text}
                        </div>
                    </div>
                 </div>

                 {/* Actions */}
                 <div className="flex flex-wrap justify-end gap-3 pt-6 border-t border-slate-100">
                    <button 
                        onClick={() => {
                            setScores({ critere1: 0, critere2: 0, critere3: 0, critere4: 0 });
                            setInterviewInfo(prev => ({ ...prev, commentaires: '' }));
                        }}
                        className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 font-semibold hover:bg-slate-50 transition-colors flex items-center gap-2"
                    >
                        <RotateCcw size={18} />
                        Réinitialiser
                    </button>
                    <button className="px-5 py-2.5 rounded-xl bg-emerald-500 text-white font-bold hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2">
                        <Save size={18} />
                        Enregistrer
                    </button>
                    <button className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2">
                        <Download size={18} />
                        Exporter PDF
                    </button>
                 </div>
              </div>
           </div>
          </div>
      )}
    </div>
  );
};

export default AdmissionView;