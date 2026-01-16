import React, { useState, useEffect } from 'react';
import { User, Save, AlertCircle, ChevronDown } from 'lucide-react';

interface QuestionnaireFormProps {
  onNext?: () => void;
}

const countryCodes = [
  { code: 'FR', dial: '+33', flag: '🇫🇷' },
  { code: 'BE', dial: '+32', flag: '🇧🇪' },
  { code: 'CH', dial: '+41', flag: '🇨🇭' },
  { code: 'LU', dial: '+352', flag: '🇱🇺' },
  { code: 'GB', dial: '+44', flag: '🇬🇧' },
  { code: 'ES', dial: '+34', flag: '🇪🇸' },
  { code: 'IT', dial: '+39', flag: '🇮🇹' },
  { code: 'DE', dial: '+49', flag: '🇩🇪' },
  { code: 'MA', dial: '+212', flag: '🇲🇦' },
  { code: 'TN', dial: '+216', flag: '🇹🇳' },
  { code: 'DZ', dial: '+213', flag: '🇩🇿' },
  { code: 'SN', dial: '+221', flag: '🇸🇳' },
  { code: 'CI', dial: '+225', flag: '🇨🇮' },
  { code: 'CM', dial: '+237', flag: '🇨🇲' },
  { code: 'GP', dial: '+590', flag: '🇬🇵' },
  { code: 'RE', dial: '+262', flag: '🇷🇪' },
];

// --- COMPONENTS INTERNES AVEC GESTION D'ERREURS ---

const FormSection = ({ number, title, children, badge }: { number: number, title: string, children?: React.ReactNode, badge?: React.ReactNode }) => (
  <div className="mb-8 p-7 bg-white/60 border border-slate-200/60 rounded-2xl shadow-sm hover:bg-white/90 hover:shadow-md transition-all duration-300 group">
    <div className="flex items-center gap-3 mb-6">
      <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-xl flex items-center justify-center font-bold text-sm shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform duration-300">
        {number}
      </div>
      <h3 className="text-lg font-bold text-slate-800">{title}</h3>
      {badge}
    </div>
    <div className="space-y-5">
      {children}
    </div>
  </div>
);

interface InputFieldProps {
  label: string;
  name: string;
  value?: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
  width?: "full" | "half" | "third" | "two-thirds";
  hint?: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const InputField = ({ label, name, value, required, type = "text", placeholder, width = "full", hint, error, onChange }: InputFieldProps) => {
  const widthClass = {
    "full": "col-span-12",
    "half": "col-span-12 md:col-span-6",
    "third": "col-span-12 md:col-span-4",
    "two-thirds": "col-span-12 md:col-span-8",
  }[width];

  const [dialCode, setDialCode] = useState('+33');

  return (
    <div className={widthClass}>
      <label className="block text-sm font-semibold text-slate-700 mb-2 group-focus-within:text-blue-600 transition-colors">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <input 
          type={type} 
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          className={`w-full py-3.5 bg-white border-2 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 transition-all shadow-sm ${
            error 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10' 
              : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/10'
          } ${type === 'tel' ? 'pl-28 pr-4' : 'px-4'}`}
        />
        {type === 'tel' && (
           <div className="absolute left-0 top-0 bottom-0 w-28 bg-slate-50 border-r border-slate-200 rounded-l-xl flex items-center justify-center transition-colors hover:bg-slate-100">
             <div className="relative w-full h-full">
               <select
                 value={dialCode}
                 onChange={(e) => setDialCode(e.target.value)}
                 className="w-full h-full bg-transparent border-none text-slate-700 text-sm font-medium focus:ring-0 cursor-pointer appearance-none pl-3 pr-8 outline-none text-center"
               >
                 {countryCodes.map((c) => (
                   <option key={c.code} value={c.dial}>
                      {c.flag} {c.dial}
                   </option>
                 ))}
               </select>
               <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
             </div>
           </div>
        )}
      </div>
      {error && <p className="mt-1.5 text-xs text-red-500 font-medium flex items-center gap-1"><AlertCircle size={12}/> {error}</p>}
      {!error && hint && <p className="mt-1.5 text-xs text-slate-400 flex items-center gap-1"><AlertCircle size={12}/> {hint}</p>}
    </div>
  );
};

const RadioGroup = ({ label, name, options, value, error, onChange, layout = "horizontal" }: { label: string, name: string, options: string[], value?: string, error?: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, layout?: "horizontal" | "vertical" | "grid" }) => (
  <div className="col-span-12">
    <label className="block text-sm font-semibold text-slate-700 mb-2">{label} {error && <span className="text-red-500">*</span>}</label>
    <div className={`flex gap-3 ${layout === 'vertical' ? 'flex-col' : layout === 'grid' ? 'grid grid-cols-2 md:grid-cols-3' : 'flex-wrap'}`}>
      {options.map((opt, idx) => (
        <label key={idx} className="relative cursor-pointer group flex-1 min-w-[120px]">
          <input 
            type="radio" 
            name={name} 
            value={opt}
            checked={value === opt}
            onChange={onChange}
            className="peer sr-only" 
          />
          <div className={`flex items-center gap-3 px-4 py-3.5 bg-white border-2 rounded-xl transition-all shadow-sm ${
            error && !value ? 'border-red-200 hover:border-red-300' : 'border-slate-200 hover:bg-slate-50'
          } peer-checked:border-blue-500 peer-checked:bg-blue-50/50 peer-checked:shadow-blue-500/10`}>
            <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
              value === opt ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
            }`}>
              {String.fromCharCode(65 + idx)}
            </span>
            <span className={`font-medium ${value === opt ? 'text-blue-700' : 'text-slate-700'}`}>{opt}</span>
          </div>
        </label>
      ))}
    </div>
    {error && <p className="mt-1.5 text-xs text-red-500 font-medium">{error}</p>}
  </div>
);

// --- MAIN FORM ---

const QuestionnaireForm: React.FC<QuestionnaireFormProps> = ({ onNext }) => {
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    nomUsage: '',
    sexe: '',
    dateNaissance: '',
    nir: '',
    nationalite: '',
    villeNaissance: '',
    deptNaissance: '',
    adresse: '',
    codePostal: '',
    ville: '',
    email: '',
    telephone: '',
    diplome: '',
    classe: '',
    niveau: '',
    formation: '',
    dateVisite: '',
    entrepriseAccueil: '',
    // Legal Rep (Minor)
    repNom: '',
    repPrenom: '',
    repEmail: '',
    repTelephone: '',
    attestation: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isMinor, setIsMinor] = useState(false);

  // Calculate age when date changes
  useEffect(() => {
    if (formData.dateNaissance) {
        const birthDate = new Date(formData.dateNaissance);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        setIsMinor(age < 18);
    }
  }, [formData.dateNaissance]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormData(prev => ({ ...prev, [name]: val }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/; // French format roughly

    // 1. Personal Info
    if (!formData.prenom.trim()) newErrors.prenom = "Le prénom est requis";
    if (!formData.nom.trim()) newErrors.nom = "Le nom est requis";
    if (!formData.sexe) newErrors.sexe = "Veuillez sélectionner votre sexe";
    if (!formData.dateNaissance) newErrors.dateNaissance = "La date de naissance est requise";
    if (!formData.nationalite.trim()) newErrors.nationalite = "La nationalité est requise";
    if (!formData.villeNaissance.trim()) newErrors.villeNaissance = "La ville de naissance est requise";
    if (!formData.deptNaissance.trim()) newErrors.deptNaissance = "Le département est requis";

    // NIR validation (simple length check)
    if (formData.nir && formData.nir.replace(/\s/g, '').length !== 15) {
        newErrors.nir = "Le NIR doit contenir 15 chiffres";
    }

    // 2. Contact Info
    if (!formData.adresse.trim()) newErrors.adresse = "L'adresse est requise";
    if (!formData.codePostal.trim()) newErrors.codePostal = "Le code postal est requis";
    else if (!/^\d{5}$/.test(formData.codePostal.trim())) newErrors.codePostal = "Code postal invalide (5 chiffres)";
    
    if (!formData.ville.trim()) newErrors.ville = "La ville est requise";
    
    if (!formData.email.trim()) newErrors.email = "L'email est requis";
    else if (!emailRegex.test(formData.email)) newErrors.email = "Format d'email invalide";

    if (!formData.telephone.trim()) newErrors.telephone = "Le téléphone est requis";
    // Basic phone length check if regex is too strict for international
    else if (formData.telephone.replace(/\s/g, '').length < 10) newErrors.telephone = "Numéro de téléphone invalide";

    // 3. Minor Specifics
    if (isMinor) {
        if (!formData.repNom.trim()) newErrors.repNom = "Le nom du représentant est requis";
        if (!formData.repPrenom.trim()) newErrors.repPrenom = "Le prénom du représentant est requis";
        if (!formData.repEmail.trim()) newErrors.repEmail = "L'email est requis";
        else if (!emailRegex.test(formData.repEmail)) newErrors.repEmail = "Format d'email invalide";
        if (!formData.repTelephone.trim()) newErrors.repTelephone = "Le téléphone est requis";
    }

    // 4. Academic
    if (!formData.niveau) newErrors.niveau = "Veuillez indiquer votre niveau actuel";

    // 5. Wish
    if (!formData.formation) newErrors.formation = "Veuillez sélectionner une formation";

    // 6. Attestation
    if (!formData.attestation) newErrors.attestation = "Vous devez attester l'exactitude des informations";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
        // Here we would typically save the data
        if (onNext) onNext();
    } else {
        // Scroll to top or first error could be added here
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-gradient-to-br from-white to-slate-50 rounded-3xl p-6 md:p-10 max-w-4xl mx-auto shadow-xl border border-slate-200 relative overflow-hidden">
      {/* Top Decorator */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center gap-6 mb-10 pb-8 border-b-2 border-slate-100">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20 animate-pulse-slow">
          <User size={32} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-1">Fiche d'inscription étudiant</h2>
          <p className="text-slate-500">Complétez toutes les informations pour finaliser votre dossier</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5">
        
        {/* Section 1 */}
        <div className="col-span-12">
          <FormSection number={1} title="Informations personnelles">
            <div className="grid grid-cols-12 gap-5">
              <InputField label="Prénom" name="prenom" value={formData.prenom} onChange={handleChange} error={errors.prenom} required width="half" placeholder="Votre prénom" />
              <InputField label="Nom de naissance" name="nom" value={formData.nom} onChange={handleChange} error={errors.nom} required width="half" placeholder="Votre nom de naissance" />
              <InputField label="Nom d'usage" name="nomUsage" value={formData.nomUsage} onChange={handleChange} width="full" placeholder="Si différent du nom de naissance" />
              
              <RadioGroup label="Sexe" name="sexe" value={formData.sexe} onChange={handleChange} error={errors.sexe} options={["Féminin", "Masculin"]} />
              
              <InputField label="Date de naissance" name="dateNaissance" value={formData.dateNaissance} onChange={handleChange} error={errors.dateNaissance} required width="half" type="date" />
              <InputField label="NIR (Numéro de Sécurité Sociale)" name="nir" value={formData.nir} onChange={handleChange} error={errors.nir} width="half" placeholder="1 85 12 75 108 123 45" hint="15 chiffres - Voir carte Vitale" />
              
              <div className="col-span-12 grid grid-cols-12 gap-5">
                <InputField label="Nationalité" name="nationalite" value={formData.nationalite} onChange={handleChange} error={errors.nationalite} required width="half" placeholder="Ex: Française" />
                <InputField label="Commune de naissance" name="villeNaissance" value={formData.villeNaissance} onChange={handleChange} error={errors.villeNaissance} required width="half" placeholder="Ville de naissance" />
              </div>
              <InputField label="Département de naissance" name="deptNaissance" value={formData.deptNaissance} onChange={handleChange} error={errors.deptNaissance} required width="full" placeholder="Ex: 75 - Paris" />
            </div>
          </FormSection>
        </div>

        {/* Section Mineur (Conditionnel) */}
        {isMinor && (
          <div className="col-span-12 animate-fade-in-down">
            <div className={`mb-8 p-7 bg-gradient-to-br from-amber-50 to-white border rounded-2xl shadow-sm transition-colors ${Object.keys(errors).some(k => k.startsWith('rep')) ? 'border-red-200' : 'border-amber-200'}`}>
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-9 h-9 bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-xl flex items-center justify-center font-bold text-sm shadow-lg shadow-amber-500/25">
                        2
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-3">
                            Représentants légaux
                            <span className="px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-full shadow-sm">Étudiant(e) mineur(e)</span>
                        </h3>
                    </div>
                </div>
                
                <div className="p-4 bg-amber-100/50 border border-amber-200 rounded-xl mb-6 text-amber-800 text-sm flex gap-3 items-start">
                    <AlertCircle size={18} className="mt-0.5 shrink-0"/>
                    <p>L'étudiant(e) étant mineur(e), les informations du représentant légal sont obligatoires.</p>
                </div>

                <div className="space-y-6">
                    <div className="bg-white/80 p-5 rounded-xl border border-amber-200/60">
                        <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <span className="w-6 h-6 bg-amber-500 text-white rounded-lg flex items-center justify-center text-xs">1</span>
                            Représentant légal principal
                        </h4>
                        <div className="grid grid-cols-12 gap-5">
                            <InputField label="Nom" name="repNom" value={formData.repNom} onChange={handleChange} error={errors.repNom} required width="half" placeholder="Nom du représentant" />
                            <InputField label="Prénom" name="repPrenom" value={formData.repPrenom} onChange={handleChange} error={errors.repPrenom} required width="half" placeholder="Prénom du représentant" />
                            <InputField label="E-mail" name="repEmail" value={formData.repEmail} onChange={handleChange} error={errors.repEmail} required width="half" type="email" placeholder="email@exemple.com" />
                            <InputField label="Téléphone" name="repTelephone" value={formData.repTelephone} onChange={handleChange} error={errors.repTelephone} required width="half" type="tel" placeholder="06 12 34 56 78" />
                        </div>
                    </div>
                </div>
            </div>
          </div>
        )}

        {/* Section 2 */}
        <div className="col-span-12">
          <FormSection number={isMinor ? 3 : 2} title="Coordonnées">
            <div className="grid grid-cols-12 gap-5">
              <InputField label="Adresse de résidence" name="adresse" value={formData.adresse} onChange={handleChange} error={errors.adresse} required width="full" placeholder="Numéro et nom de rue" />
              <InputField label="Code postal" name="codePostal" value={formData.codePostal} onChange={handleChange} error={errors.codePostal} required width="third" placeholder="Ex: 75001" />
              <InputField label="Ville" name="ville" value={formData.ville} onChange={handleChange} error={errors.ville} required width="two-thirds" placeholder="Ville de résidence" />
              <InputField label="E-mail" name="email" value={formData.email} onChange={handleChange} error={errors.email} required width="half" type="email" placeholder="votre@email.com" />
              <InputField label="Téléphone" name="telephone" value={formData.telephone} onChange={handleChange} error={errors.telephone} required width="half" type="tel" placeholder="06 12 34 56 78" />
            </div>
          </FormSection>
        </div>

        {/* Section 4 */}
        <div className="col-span-12">
          <FormSection number={isMinor ? 4 : 3} title="Parcours scolaire">
            <div className="grid grid-cols-12 gap-5">
              <InputField label="Dernier diplôme ou titre préparé" name="diplome" value={formData.diplome} onChange={handleChange} width="half" placeholder="Ex: Baccalauréat général" />
              <InputField label="Dernière classe suivie" name="classe" value={formData.classe} onChange={handleChange} width="half" placeholder="Ex: Terminale" />
              <RadioGroup label="Diplôme ou titre le plus élevé obtenu" name="niveau" value={formData.niveau} onChange={handleChange} error={errors.niveau} options={["Aucun", "CAP/BEP", "BAC", "BAC +2", "BAC +3/4", "BAC +5"]} layout="grid" />
            </div>
          </FormSection>
        </div>

        {/* Section 5 - Formation */}
        <div className="col-span-12">
            <FormSection number={isMinor ? 5 : 4} title="Formation souhaitée">
                <div className="grid grid-cols-12 gap-5">
                    <div className="col-span-12">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Formation visée <span className="text-red-500">*</span></label>
                        <select 
                            name="formation"
                            value={formData.formation}
                            onChange={handleChange}
                            className={`w-full px-4 py-3.5 bg-white border-2 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-4 transition-all cursor-pointer ${
                                errors.formation 
                                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10' 
                                    : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/10'
                            }`}
                        >
                            <option value="">Sélectionnez une formation</option>
                            <option value="bts_mco">BTS MCO - Management Commercial Opérationnel</option>
                            <option value="bts_ndrc">BTS NDRC - Négociation et Digitalisation de la Relation Client</option>
                            <option value="bachelor">BACHELOR RDC - Responsable Développement Commercial</option>
                            <option value="tp_ntc">TP NTC - Négociateur Technico-Commercial</option>
                        </select>
                        {errors.formation && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.formation}</p>}
                    </div>
                    <InputField label="Date de visite / JPO" name="dateVisite" value={formData.dateVisite} onChange={handleChange} width="half" type="date" />
                    <RadioGroup label="Avez-vous déjà une entreprise d'accueil ?" name="entrepriseAccueil" value={formData.entrepriseAccueil} onChange={handleChange} options={["Oui", "En recherche", "Non"]} />
                </div>
            </FormSection>
        </div>

         {/* Submit */}
         <div className="col-span-12 mt-8 pt-8 border-t-2 border-slate-100 flex flex-col items-center gap-6 relative">
            <div className="absolute -top-3 bg-white px-4 text-xs font-semibold text-slate-400 uppercase tracking-widest">Validation</div>
            
            <label className={`flex items-center gap-3 cursor-pointer p-4 rounded-xl transition-colors border ${errors.attestation ? 'bg-red-50 border-red-200' : 'hover:bg-slate-50 border-transparent hover:border-slate-200'}`}>
              <input 
                type="checkbox" 
                name="attestation"
                checked={formData.attestation}
                onChange={handleChange}
                className="w-5 h-5 accent-blue-600 rounded cursor-pointer" 
              />
              <span className={`font-medium ${errors.attestation ? 'text-red-600' : 'text-slate-700'}`}>
                J'atteste sur l'honneur l'exactitude des informations fournies <span className="text-red-500">*</span>
              </span>
            </label>
            {errors.attestation && <p className="text-xs text-red-500 font-medium -mt-4">{errors.attestation}</p>}

            <button 
              onClick={handleSubmit}
              className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-1 transition-all duration-300"
            >
              <Save size={20} className="group-hover:scale-110 transition-transform" />
              Enregistrer et continuer
            </button>

            {Object.keys(errors).length > 0 && (
                <div className="flex items-center gap-2 text-red-500 text-sm font-medium animate-bounce">
                    <AlertCircle size={16} />
                    Veuillez corriger les erreurs avant de continuer
                </div>
            )}
         </div>

      </div>
    </div>
  );
};

export default QuestionnaireForm;