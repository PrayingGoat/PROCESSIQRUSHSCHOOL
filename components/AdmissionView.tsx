import React, { useState } from 'react';
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
  ShieldCheck,
  Building,
  UserCheck,
  ExternalLink,
  AlertCircle
} from 'lucide-react';
import { AdmissionTab } from '../types';
import QuestionnaireForm from './QuestionnaireForm';

// --- CONFIGURATION ---

// Liens Google Forms mis à jour pour chaque formation
const FORMATION_FORMS: Record<string, string> = {
  mco: "https://docs.google.com/forms/d/e/1FAIpQLSdoGS2NZKs3sGRZ-dZ-3a8x9JZ32FQcpBQupMmD4CUQpEhnuw/viewform?embedded=true", 
  ndrc: "https://docs.google.com/forms/d/e/1FAIpQLSeDDzl2VDR__aY776N_7auk4uAZc04uC6mQNUsRNOr9D3eCmw/viewform?embedded=true",
  bachelor: "https://docs.google.com/forms/d/e/1FAIpQLSdzOg66p81XV9Ghb4dS6xP2r-BCw4qiGECU4F01Vs7VlrJNCQ/viewform?embedded=true",
  ntc: "https://docs.google.com/forms/d/e/1FAIpQLSfW-Gi40ZBpU9zymrYBZ05P8s2TSSL88OYwkp5lzPSNDXTnhA/viewform?embedded=true",
};

// URL par défaut si la clé n'existe pas
const DEFAULT_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLScs38d38d38d38d38d38d38d38d38d38d38d38d38d38d3/viewform?embedded=true"; 

// --- COMPONENTS ---

const StepItem = ({ step, label, isActive, isCompleted }: { step: number, label: string, isActive: boolean, isCompleted: boolean }) => (
  <div className="flex flex-col items-center gap-2 relative z-10">
    <div className={`w-11 h-11 rounded-full border-2 flex items-center justify-center font-bold text-base transition-all duration-300 ${
      isCompleted 
        ? 'bg-emerald-500 border-emerald-500 text-white' 
        : isActive 
          ? 'bg-blue-600 border-blue-600 text-white' 
          : 'bg-slate-50 border-slate-200 text-slate-400'
    }`}>
      {isCompleted ? <CheckCircle2 size={20} /> : step}
    </div>
    <div className={`text-xs font-semibold uppercase tracking-wide ${isActive ? 'text-blue-600' : isCompleted ? 'text-emerald-600' : 'text-slate-400'}`}>
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

const EvalCriteriaRow = ({ title, desc, name, value, onChange }: { title: string, desc: string, name: string, value: number, onChange: (val: number) => void }) => (
  <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] border-b border-slate-200 last:border-0 last:rounded-b-xl">
    <div className="p-5 lg:border-r border-slate-200">
      <h4 className="font-bold text-slate-800 text-sm mb-2">{title}</h4>
      <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
    </div>
    <div className="flex items-center justify-center p-4 gap-0 bg-slate-50/50">
      {[1, 2, 3, 4, 5].map((val) => (
        <label key={val} className="cursor-pointer group relative">
          <input 
            type="radio" 
            name={name} 
            value={val} 
            checked={value === val}
            onChange={() => onChange(val)}
            className="peer sr-only" 
          />
          <div className="w-10 h-10 flex items-center justify-center border-y border-l last:border-r border-slate-200 bg-white font-bold text-slate-400 transition-all peer-checked:bg-blue-600 peer-checked:text-white peer-checked:border-blue-600 hover:bg-blue-50">
            {val}
          </div>
        </label>
      ))}
    </div>
  </div>
);

const FileUploadCard = ({ title, desc, uploaded }: { title: string, desc: string, uploaded: boolean }) => (
  <div className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all cursor-pointer group ${
    uploaded 
      ? 'border-emerald-200 bg-emerald-50' 
      : 'border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50'
  }`}>
    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors ${
      uploaded 
        ? 'bg-emerald-100 text-emerald-600' 
        : 'bg-slate-100 text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-500'
    }`}>
      {uploaded ? <CheckCircle2 size={24} /> : <Upload size={24} />}
    </div>
    <h4 className={`font-bold mb-1 ${uploaded ? 'text-emerald-800' : 'text-slate-700'}`}>{title}</h4>
    <p className={`text-xs mb-4 ${uploaded ? 'text-emerald-600' : 'text-slate-400'}`}>{desc}</p>
    <button className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
      uploaded 
        ? 'bg-white text-emerald-600 border border-emerald-200 hover:bg-emerald-50' 
        : 'bg-slate-900 text-white hover:bg-slate-800'
    }`}>
      {uploaded ? 'Modifier' : 'Téléverser'}
    </button>
  </div>
);

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
    const siretRegex = /^\d{14}$/; // 14 chiffres exactement (sans espaces pour simplifier la validation ici)
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

  const handleSubmit = () => {
    if (validate()) {
      onNext();
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Helper interne pour les inputs
  const FormInput = ({ label, name, value, placeholder, required = true, hint }: any) => (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input 
        type="text" 
        name={name}
        value={value}
        onChange={handleChange}
        className={`w-full px-4 py-3 bg-white border rounded-xl transition-all focus:ring-4 focus:outline-none ${
          errors[name] 
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10' 
            : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/10'
        }`} 
        placeholder={placeholder} 
      />
      {errors[name] && (
        <p className="mt-1.5 text-xs text-red-500 font-medium flex items-center gap-1">
          <AlertCircle size={12}/> {errors[name]}
        </p>
      )}
      {!errors[name] && hint && (
        <p className="mt-1.5 text-xs text-slate-400">{hint}</p>
      )}
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-emerald-50 to-white rounded-3xl p-6 md:p-10 shadow-xl border border-emerald-100 relative overflow-hidden animate-fade-in">
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
              <FormInput label="Raison sociale" name="raisonSociale" value={formData.raisonSociale} placeholder="Nom de l'entreprise" />
            </div>
            <FormInput label="SIRET" name="siret" value={formData.siret} placeholder="14 chiffres" hint="Sans espaces" />
            <FormInput label="Code APE/NAF" name="codeNaf" value={formData.codeNaf} placeholder="Ex: 4711D" />
            <div className="col-span-2">
              <FormInput label="Adresse du siège" name="adresse" value={formData.adresse} placeholder="Adresse complète (Rue, CP, Ville)" />
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
            <FormInput label="Nom" name="maitreNom" value={formData.maitreNom} placeholder="Nom" />
            <FormInput label="Prénom" name="maitrePrenom" value={formData.maitrePrenom} placeholder="Prénom" />
            <FormInput label="Fonction" name="maitreFonction" value={formData.maitreFonction} placeholder="Fonction dans l'entreprise" />
            <FormInput label="Email" name="maitreEmail" value={formData.maitreEmail} placeholder="email@entreprise.com" />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-emerald-100">
          <button className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors">
            Enregistrer brouillon
          </button>
          <button 
            onClick={handleSubmit}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold hover:shadow-lg hover:shadow-emerald-500/25 transition-all flex items-center gap-2"
          >
            Valider et continuer
            {Object.keys(errors).length > 0 && <AlertCircle size={18} />}
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
  const [scores, setScores] = useState<Record<string, number>>({
    critere1: 0,
    critere2: 0,
    critere3: 0,
    critere4: 0
  });

  // Flow handlers
  const handleStartTest = () => setTestStarted(true);
  const handleFinishTest = () => {
    setTestStarted(false);
    setTestCompleted(true);
  };
  const handleContinueToStudent = () => setActiveTab(AdmissionTab.QUESTIONNAIRE);

  // Score logic
  const totalScore = (Object.values(scores) as number[]).reduce((sum, score) => sum + score, 0);
  
  const getAppreciation = (score: number) => {
    if (score === 0) return { text: "-", color: "bg-slate-100 text-slate-400" };
    if (score >= 17) return { text: "EXCELLENT", color: "bg-emerald-100 text-emerald-700" };
    if (score >= 14) return { text: "TRÈS SATISFAISANT", color: "bg-blue-100 text-blue-700" };
    if (score >= 10) return { text: "SATISFAISANT", color: "bg-indigo-100 text-indigo-700" };
    if (score >= 6) return { text: "PASSABLE", color: "bg-orange-100 text-orange-700" };
    return { text: "INSUFFISANT", color: "bg-red-100 text-red-700" };
  };

  const appreciation = getAppreciation(totalScore);

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
            <div className="hidden md:flex w-24 h-24 bg-white/10 rounded-2xl items-center justify-center backdrop-blur-md border border-white/20 shadow-inner">
               <GraduationCap size={48} className="text-indigo-100" />
            </div>
         </div>
      </div>

      {/* Stepper */}
      <div className="bg-white border border-slate-200 rounded-2xl p-8 mb-8 flex items-center justify-center overflow-x-auto shadow-sm">
        <div className="flex items-center min-w-max">
          <StepItem step={1} label="Tests" isActive={activeTab === AdmissionTab.TESTS} isCompleted={activeTab !== AdmissionTab.TESTS} />
          <StepLine isCompleted={activeTab !== AdmissionTab.TESTS} />
          
          <StepItem step={2} label="Étudiant" isActive={activeTab === AdmissionTab.QUESTIONNAIRE} isCompleted={activeTab !== AdmissionTab.TESTS && activeTab !== AdmissionTab.QUESTIONNAIRE} />
          <StepLine isCompleted={activeTab === AdmissionTab.DOCUMENTS || activeTab === AdmissionTab.ENTREPRISE || activeTab === AdmissionTab.ADMINISTRATIF || activeTab === AdmissionTab.ENTRETIEN} />
          
          <StepItem step={3} label="Documents" isActive={activeTab === AdmissionTab.DOCUMENTS} isCompleted={activeTab === AdmissionTab.ENTREPRISE || activeTab === AdmissionTab.ADMINISTRATIF || activeTab === AdmissionTab.ENTRETIEN} />
          <StepLine isCompleted={activeTab === AdmissionTab.ENTREPRISE || activeTab === AdmissionTab.ADMINISTRATIF || activeTab === AdmissionTab.ENTRETIEN} />
          
          <StepItem step={4} label="Entreprise" isActive={activeTab === AdmissionTab.ENTREPRISE} isCompleted={activeTab === AdmissionTab.ADMINISTRATIF || activeTab === AdmissionTab.ENTRETIEN} />
          <StepLine isCompleted={activeTab === AdmissionTab.ADMINISTRATIF || activeTab === AdmissionTab.ENTRETIEN} />
          
          <StepItem step={5} label="Admin" isActive={activeTab === AdmissionTab.ADMINISTRATIF} isCompleted={activeTab === AdmissionTab.ENTRETIEN} />
          <StepLine isCompleted={activeTab === AdmissionTab.ENTRETIEN} />
          
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
        <div className="space-y-6 animate-fade-in">
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
              <div className="animate-fade-in">
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
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col relative animate-fade-in shadow-lg">
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
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-3xl p-16 text-center animate-fade-in">
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
         <div className="animate-fade-in">
            <QuestionnaireForm onNext={() => setActiveTab(AdmissionTab.DOCUMENTS)} />
         </div>
      )}

      {/* --- TAB CONTENT: DOCUMENTS --- */}
      {activeTab === AdmissionTab.DOCUMENTS && (
         <div className="animate-fade-in space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6 flex items-center gap-5">
               <div className="w-14 h-14 bg-white text-blue-600 rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                  <Upload size={28} />
               </div>
               <div>
                  <h3 className="text-lg font-bold text-slate-800">Documents à téléverser</h3>
                  <p className="text-slate-500 text-sm">Complétez votre dossier avec les pièces justificatives.</p>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
               <FileUploadCard title="CV" desc="Curriculum Vitae à jour" uploaded={false} />
               <FileUploadCard title="Carte d'Identité" desc="Recto-verso de la CNI" uploaded={true} />
               <FileUploadCard title="Lettre de motivation" desc="Exposez vos motivations" uploaded={false} />
               <FileUploadCard title="Carte Vitale" desc="Attestation de droits" uploaded={false} />
               <FileUploadCard title="Dernier Diplôme" desc="Copie du dernier diplôme" uploaded={false} />
            </div>

            {/* NIR Tutorial */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
               <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-5 flex items-center gap-4 cursor-pointer hover:bg-amber-100/50 transition-colors">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-amber-500 shadow-sm border border-amber-100">
                     <ShieldCheck size={20} />
                  </div>
                  <div className="flex-1">
                     <h4 className="font-semibold text-slate-800">Besoin d'aide pour le NIR ?</h4>
                     <p className="text-xs text-slate-500">Comment récupérer son numéro de sécurité sociale</p>
                  </div>
                  <ChevronDown className="text-slate-400" />
               </div>
            </div>

            {/* Summary */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
               <div className="w-full md:w-1/2">
                  <div className="flex justify-between text-sm font-semibold mb-2">
                     <span className="text-slate-800">1 / 5 documents</span>
                     <span className="text-emerald-500">20%</span>
                  </div>
                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                     <div className="h-full bg-emerald-500 rounded-full w-[20%] transition-all duration-500"></div>
                  </div>
               </div>
               <button 
                  onClick={() => setActiveTab(AdmissionTab.ENTREPRISE)}
                  className="w-full md:w-auto px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 hover:-translate-y-0.5 transition-all shadow-lg shadow-slate-900/10"
               >
                  Continuer vers la Fiche Entreprise
               </button>
            </div>
         </div>
      )}

      {/* --- TAB CONTENT: ENTREPRISE --- */}
      {activeTab === AdmissionTab.ENTREPRISE && (
         <div className="animate-fade-in">
            <EntrepriseForm onNext={() => setActiveTab(AdmissionTab.ADMINISTRATIF)} />
         </div>
      )}

      {/* --- TAB CONTENT: ADMINISTRATIF --- */}
      {activeTab === AdmissionTab.ADMINISTRATIF && (
         <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center animate-fade-in">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
               <Briefcase size={40} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Dossier Administratif</h3>
            <p className="text-slate-500 max-w-md mx-auto mb-8">Cette section permettra de générer les documents contractuels (CERFA, Convention, etc.) une fois toutes les étapes précédentes validées.</p>
            <div className="flex justify-center gap-4">
               <button className="px-6 py-3 bg-slate-100 text-slate-400 font-semibold rounded-xl cursor-not-allowed">Générer le dossier</button>
               <button 
                  onClick={() => setActiveTab(AdmissionTab.ENTRETIEN)}
                  className="px-6 py-3 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800"
               >
                  Passer à l'entretien
               </button>
            </div>
         </div>
      )}

      {/* --- TAB CONTENT: ENTRETIEN (Evaluation) --- */}
      {activeTab === AdmissionTab.ENTRETIEN && (
        <div className="animate-fade-in">
           <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
              <div className="bg-slate-50 border-b border-slate-200 p-8 flex justify-between items-center">
                 <div>
                    <h2 className="text-2xl font-bold text-slate-800">Grille d'évaluation / Entretien</h2>
                    <p className="text-slate-500 text-sm mt-1">À remplir par le chargé d'admission (Étape Finale)</p>
                 </div>
                 <div className="text-right">
                    <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">RUSH</div>
                    <div className="text-xs font-bold text-slate-400 tracking-[0.3em]">SCHOOL</div>
                 </div>
              </div>

              <div className="p-8">
                 {/* Info Grid */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <div>
                       <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Candidat</label>
                       <input type="text" className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 font-medium text-slate-800" placeholder="Nom Prénom" />
                    </div>
                    <div>
                       <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Chargé d'admission</label>
                       <input type="text" className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 font-medium text-slate-800" defaultValue="Arsène POPHILLAT" />
                    </div>
                    <div>
                       <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Date</label>
                       <input type="date" className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 font-medium text-slate-800" />
                    </div>
                    <div>
                       <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Formation visée</label>
                       <select className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 font-medium text-slate-800">
                          <option>BTS MCO</option>
                          <option>BTS NDRC</option>
                          <option>Bachelor RDC</option>
                       </select>
                    </div>
                 </div>

                 {/* Grid Header */}
                 <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] mb-0 bg-indigo-600 text-white rounded-t-xl overflow-hidden">
                    <div className="p-4 font-bold">Critères d'évaluation</div>
                    <div className="hidden lg:grid grid-cols-5 w-[300px] text-center text-xs font-semibold">
                       <div className="p-4 border-l border-indigo-500/50">Insuffisant<br/>(1)</div>
                       <div className="p-4 border-l border-indigo-500/50">Passable<br/>(2)</div>
                       <div className="p-4 border-l border-indigo-500/50">Satisfaisant<br/>(3)</div>
                       <div className="p-4 border-l border-indigo-500/50">Très Bien<br/>(4)</div>
                       <div className="p-4 border-l border-indigo-500/50">Excellent<br/>(5)</div>
                    </div>
                 </div>

                 {/* Criteria Rows */}
                 <div className="border border-slate-200 border-t-0 rounded-b-xl mb-8">
                    <EvalCriteriaRow 
                       title="Savoir-être et présentation" 
                       desc="Capacité à bien se connaître, points forts/faibles, présentation générale."
                       name="critere1"
                       value={scores.critere1}
                       onChange={(val) => setScores({...scores, critere1: val})}
                    />
                    <EvalCriteriaRow 
                       title="Cohérence du projet" 
                       desc="Logique de construction du projet, motivation, adéquation avec la formation."
                       name="critere2"
                       value={scores.critere2}
                       onChange={(val) => setScores({...scores, critere2: val})}
                    />
                    <EvalCriteriaRow 
                       title="Engagements & Expériences" 
                       desc="Activités extra-scolaires, curiosité, ouverture, maturité."
                       name="critere3"
                       value={scores.critere3}
                       onChange={(val) => setScores({...scores, critere3: val})}
                    />
                    <EvalCriteriaRow 
                       title="Expression" 
                       desc="Qualité d'expression orale, vocabulaire, dynamisme."
                       name="critere4"
                       value={scores.critere4}
                       onChange={(val) => setScores({...scores, critere4: val})}
                    />
                 </div>

                 {/* Bottom Section */}
                 <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-8">
                    <div>
                       <label className="block font-bold text-slate-800 mb-2">Commentaires / Observations</label>
                       <textarea className="w-full h-32 p-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none" placeholder="Notez ici les points marquants de l'entretien..."></textarea>
                    </div>
                    <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 text-center flex flex-col justify-center">
                       <div className="text-sm font-bold text-indigo-400 uppercase mb-2">Note Globale</div>
                       <div className="text-5xl font-black text-indigo-600 mb-2">{totalScore}<span className="text-2xl text-indigo-300">/20</span></div>
                       <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mx-auto transition-colors ${appreciation.color}`}>{appreciation.text}</div>
                    </div>
                 </div>

                 <div className="flex justify-end gap-3 mt-8 pt-8 border-t border-slate-100">
                    <button 
                      onClick={() => setScores({ critere1: 0, critere2: 0, critere3: 0, critere4: 0 })}
                      className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50"
                    >
                      Réinitialiser
                    </button>
                    <button className="px-8 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:shadow-lg hover:shadow-indigo-500/25 transition-all">Enregistrer l'évaluation</button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdmissionView;