import React, { useState } from 'react';
import { User, Save, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { api } from '../services/api';

interface QuestionnaireFormProps {
  onNext: (data: any) => void;
  onBack?: () => void;
}

const FormSection = ({ number, title, children }: { number: number, title: string, children?: React.ReactNode }) => (
  <div className="mb-8">
    <div className="flex items-center gap-3 mb-5 border-b border-slate-200 pb-3">
      <div className="w-8 h-8 bg-emerald-800 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-sm">
        {number}
      </div>
      <h3 className="text-lg font-bold text-slate-800">{title}</h3>
    </div>
    <div className="space-y-5">
      {children}
    </div>
  </div>
);

interface InputFieldProps {
  label: string;
  name: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
  width?: "full" | "half" | "third" | "two-thirds";
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

const InputField = ({ label, name, required, type = "text", placeholder, width = "full", value, onChange, error }: InputFieldProps) => {
  const widthClass = {
    "full": "col-span-12",
    "half": "col-span-12 md:col-span-6",
    "third": "col-span-12 md:col-span-4",
    "two-thirds": "col-span-12 md:col-span-8",
  }[width];

  return (
    <div className={widthClass}>
      <label className="block text-sm font-semibold text-slate-800 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input 
        type={type} 
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-4 py-3 bg-white/70 border-2 rounded-xl text-base text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all shadow-sm ${
          error ? 'border-red-300 focus:ring-red-400' : 'border-transparent'
        }`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

interface SelectFieldProps {
  label: string;
  name: string;
  required?: boolean;
  width?: "full" | "half" | "third" | "two-thirds";
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
  children: React.ReactNode;
}

const SelectField = ({ label, name, required, width = "full", value, onChange, error, children }: SelectFieldProps) => {
  const widthClass = {
    "full": "col-span-12",
    "half": "col-span-12 md:col-span-6",
    "third": "col-span-12 md:col-span-4",
    "two-thirds": "col-span-12 md:col-span-8",
  }[width];

  return (
    <div className={widthClass}>
      <label className="block text-sm font-semibold text-slate-800 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-3 bg-white/70 border-2 rounded-xl text-base text-slate-800 focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all shadow-sm ${
          error ? 'border-red-300 focus:ring-red-400' : 'border-transparent'
        }`}
      >
        {children}
      </select>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

interface TextAreaFieldProps {
  label: string;
  name: string;
  required?: boolean;
  placeholder?: string;
  rows?: number;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string;
}

const TextAreaField = ({ label, name, required, placeholder, rows = 4, value, onChange, error }: TextAreaFieldProps) => {
  return (
    <div className="col-span-12">
      <label className="block text-sm font-semibold text-slate-800 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className={`w-full px-4 py-3 bg-white/70 border-2 rounded-xl text-base text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all shadow-sm resize-none ${
          error ? 'border-red-300 focus:ring-red-400' : 'border-transparent'
        }`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

interface RadioGroupProps {
  label: string;
  name: string;
  options: string[];
  layout?: "horizontal" | "vertical" | "grid";
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const RadioGroup = ({ label, name, options, layout = "horizontal", value, onChange, error }: RadioGroupProps) => (
  <div className="col-span-12">
    <label className="block text-sm font-semibold text-slate-800 mb-2">{label}</label>
    <div className={`flex gap-3 ${layout === 'vertical' ? 'flex-col' : layout === 'grid' ? 'grid grid-cols-2 md:grid-cols-3' : 'flex-wrap'}`}>
      {options.map((opt, idx) => (
        <label key={idx} className="relative cursor-pointer group flex-1 min-w-[120px]">
          <input 
            type="radio" 
            name={name} 
            value={opt}
            checked={value === opt}
            onChange={() => onChange(opt)}
            className="peer sr-only" 
          />
          <div className={`flex items-center gap-3 px-4 py-3 bg-slate-200/50 rounded-xl border-2 transition-all ${
            value === opt 
              ? 'bg-white/90 border-blue-500' 
              : 'border-transparent hover:bg-white/60'
          }`}>
            <span className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold transition-colors ${
              value === opt ? 'bg-blue-500 text-white' : 'bg-slate-600 text-white'
            }`}>
              {String.fromCharCode(65 + idx)}
            </span>
            <span className="font-medium text-slate-700">{opt}</span>
          </div>
        </label>
      ))}
    </div>
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

const QuestionnaireForm = ({ onNext, onBack }: QuestionnaireFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [attestation, setAttestation] = useState(false);
  
  // Form data state - TOUS LES CHAMPS DU FORMULAIRE HTML
  const [formData, setFormData] = useState({
    // Section 1: Informations personnelles
    prenom: '',
    nom_naissance: '',
    nom_usage: '',
    sexe: '',
    date_naissance: '',
    nationalite: '',
    commune_naissance: '',
    departement: '',
    
    // Section 2: Coordonnées
    adresse_residence: '',
    code_postal: '',
    ville: '',
    email: '',
    telephone: '',
    nir: '',
    
    // Section 3: Situation & Déclarations
    situation_avant: '',
    regime_social: '',
    sportif_haut_niveau: 'non',
    projet_entreprise: 'non',
    rqth: 'non',
    
    // Section 4: Parcours scolaire
    dernier_diplome_prepare: '',
    derniere_classe: '',
    intitule_diplome: '',
    bac: '',
    
    // Section 5: Formation souhaitée
    formation: '',
    date_visite: '',
    date_reglement: '',
    entreprise_accueil: '',
    nom_entreprise: '',
    
    // Section 6: Informations complémentaires
    source: '',
    motivations: ''
  });

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleRadioChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required fields validation - Section 1
    if (!formData.prenom.trim()) newErrors.prenom = 'Le prénom est requis';
    if (!formData.nom_naissance.trim()) newErrors.nom_naissance = 'Le nom de naissance est requis';
    if (!formData.sexe) newErrors.sexe = 'Le sexe est requis';
    if (!formData.date_naissance) newErrors.date_naissance = 'La date de naissance est requise';
    if (!formData.nationalite) newErrors.nationalite = 'La nationalité est requise';
    if (!formData.commune_naissance.trim()) newErrors.commune_naissance = 'La commune de naissance est requise';
    if (!formData.departement.trim()) newErrors.departement = 'Le département est requis';
    
    // Required fields validation - Section 2
    if (!formData.adresse_residence.trim()) newErrors.adresse_residence = "L'adresse de résidence est requise";
    if (!formData.code_postal.trim()) newErrors.code_postal = 'Le code postal est requis';
    if (!formData.ville.trim()) newErrors.ville = 'La ville est requise';
    if (!formData.email.trim()) newErrors.email = "L'email est requis";
    if (!formData.telephone.trim()) newErrors.telephone = 'Le téléphone est requis';
    
    // Required fields validation - Section 3
    if (!formData.situation_avant) newErrors.situation_avant = 'La situation avant le contrat est requise';
    
    // Required fields validation - Section 4
    if (!formData.dernier_diplome_prepare) newErrors.dernier_diplome_prepare = 'Le dernier diplôme préparé est requis';
    if (!formData.derniere_classe) newErrors.derniere_classe = 'La dernière classe suivie est requise';
    if (!formData.bac) newErrors.bac = 'Le niveau de diplôme est requis';
    
    // Required fields validation - Section 5
    if (!formData.formation) newErrors.formation = 'La formation est requise';

    // Email format validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }

    // Phone format validation (French format)
    if (formData.telephone && !/^(\+33|0)[1-9](\d{2}){4}$/.test(formData.telephone.replace(/\s/g, ''))) {
      newErrors.telephone = 'Format de téléphone invalide (ex: 0612345678)';
    }

    // Code postal validation
    if (formData.code_postal && !/^\d{5}$/.test(formData.code_postal)) {
      newErrors.code_postal = 'Le code postal doit contenir 5 chiffres';
    }

    // Age validation (minimum 16 years)
    if (formData.date_naissance) {
      const birthDate = new Date(formData.date_naissance);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age < 16) {
        newErrors.date_naissance = 'Vous devez avoir au moins 16 ans';
      }
    }

    // Attestation validation
    if (!attestation) {
      newErrors.attestation = "Vous devez attester l'exactitude des informations";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare data for API
      const apiData = {
        prenom: formData.prenom,
        nom_naissance: formData.nom_naissance,
        nom_usage: formData.nom_usage || undefined,
        sexe: formData.sexe,
        date_naissance: formData.date_naissance,
        nationalite: formData.nationalite,
        commune_naissance: formData.commune_naissance,
        departement: formData.departement,
        adresse_residence: formData.adresse_residence,
        code_postal: formData.code_postal,
        ville: formData.ville,
        email: formData.email,
        telephone: formData.telephone.replace(/\s/g, ''),
        nir: formData.nir || undefined,
        
        // Section 3: Situation & Déclarations
        situation: formData.situation_avant || undefined,
        regime_social: formData.regime_social || undefined,
        declare_inscription_sportif_haut_niveau: formData.sportif_haut_niveau === 'oui',
        declare_avoir_projet_creation_reprise_entreprise: formData.projet_entreprise === 'oui',
        declare_travailleur_handicape: formData.rqth === 'oui',
        
        // Section 4: Parcours scolaire
        dernier_diplome_prepare: formData.dernier_diplome_prepare || undefined,
        derniere_classe: formData.derniere_classe || undefined,
        bac: formData.bac,
        
        // Section 5: Formation souhaitée
        formation_souhaitee: formData.formation || undefined,
        date_de_visite: formData.date_visite || undefined,
        date_de_reglement: formData.date_reglement || undefined,
        entreprise_d_accueil: formData.entreprise_accueil === 'Oui' ? (formData.nom_entreprise || "Oui") : (formData.entreprise_accueil === 'En recherche' ? "En recherche" : "Non"),
        
        // Section 6: Informations complémentaires
        connaissance_rush_how: formData.source || undefined,
        motivation_projet_professionnel: formData.motivations || undefined,
        
        // New field from previous update
        intitule_diplome: formData.intitule_diplome || undefined
      };

      const response = await api.submitStudent(apiData);
      
      if (response && response.success) {
        // Store record_id in localStorage for later use
        if (response.record_id) {
            localStorage.setItem('candidateRecordId', response.record_id);
            localStorage.setItem('candidateName', `${formData.prenom} ${formData.nom_naissance}`);
        }
        
        // Notify parent component
        onNext(response);
      }
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      setSubmitError(error instanceof Error ? error.message : 'Une erreur est survenue lors de l\'enregistrement');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#B8D4CE] rounded-3xl p-6 md:p-10 max-w-4xl mx-auto shadow-xl shadow-[#B8D4CE]/20">
      <div className="flex items-center gap-4 mb-8 pb-6 border-b-2 border-black/5">
        <div className="w-14 h-14 bg-black/5 rounded-2xl flex items-center justify-center text-emerald-900">
          <User size={32} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-1">Fiche d'inscription étudiant</h2>
          <p className="text-slate-600">Complétez toutes les informations pour finaliser votre dossier</p>
        </div>
      </div>

      {submitError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
          <AlertCircle className="text-red-500 shrink-0" size={20} />
          <p className="text-red-700 text-sm">{submitError}</p>
        </div>
      )}

      <div className="grid grid-cols-12 gap-5">
        
        {/* Section 1 - Informations personnelles */}
        <div className="col-span-12">
          <FormSection number={1} title="Informations personnelles">
            <div className="grid grid-cols-12 gap-5">
              <InputField 
                label="Prénom" 
                name="prenom"
                required 
                width="half" 
                placeholder="Votre prénom"
                value={formData.prenom}
                onChange={handleInputChange}
                error={errors.prenom}
              />
              <InputField 
                label="Nom de naissance" 
                name="nom_naissance"
                required 
                width="half" 
                placeholder="Votre nom de naissance"
                value={formData.nom_naissance}
                onChange={handleInputChange}
                error={errors.nom_naissance}
              />
              <InputField 
                label="Nom d'usage" 
                name="nom_usage"
                width="full" 
                placeholder="Si différent du nom de naissance"
                value={formData.nom_usage}
                onChange={handleInputChange}
              />
              <RadioGroup 
                label="Sexe *" 
                name="sexe"
                options={["Féminin", "Masculin"]}
                value={formData.sexe}
                onChange={(value) => handleRadioChange('sexe', value)}
                error={errors.sexe}
              />
              <InputField 
                label="Date de naissance" 
                name="date_naissance"
                required 
                width="half" 
                type="date"
                value={formData.date_naissance}
                onChange={handleInputChange}
                error={errors.date_naissance}
              />
              <SelectField
                label="Nationalité"
                name="nationalite"
                required
                width="half"
                value={formData.nationalite}
                onChange={handleSelectChange}
                error={errors.nationalite}
              >
                <option value="">Sélectionnez</option>
                <option value="francaise">Française</option>
                <option value="ue">Union Européenne</option>
                <option value="hors_ue">Etranger hors Union Européenne</option>
              </SelectField>
              <InputField 
                label="Commune de naissance" 
                name="commune_naissance"
                required 
                width="half" 
                placeholder="Ville de naissance"
                value={formData.commune_naissance}
                onChange={handleInputChange}
                error={errors.commune_naissance}
              />
              <InputField 
                label="Département de naissance" 
                name="departement"
                required 
                width="half" 
                placeholder="Ex: 75 - Paris"
                value={formData.departement}
                onChange={handleInputChange}
                error={errors.departement}
              />
            </div>
          </FormSection>
        </div>

        {/* Section 2 - Coordonnées */}
        <div className="col-span-12">
          <FormSection number={2} title="Coordonnées">
            <div className="grid grid-cols-12 gap-5">
              <InputField 
                label="Adresse de résidence" 
                name="adresse_residence"
                required 
                width="full" 
                placeholder="Numéro et nom de rue"
                value={formData.adresse_residence}
                onChange={handleInputChange}
                error={errors.adresse_residence}
              />
              <InputField 
                label="Code postal" 
                name="code_postal"
                required 
                width="third" 
                placeholder="Ex: 75001"
                value={formData.code_postal}
                onChange={handleInputChange}
                error={errors.code_postal}
              />
              <InputField 
                label="Ville" 
                name="ville"
                required 
                width="two-thirds" 
                placeholder="Ville de résidence"
                value={formData.ville}
                onChange={handleInputChange}
                error={errors.ville}
              />
              <InputField 
                label="E-mail" 
                name="email"
                required 
                width="half" 
                type="email" 
                placeholder="votre@email.com"
                value={formData.email}
                onChange={handleInputChange}
                error={errors.email}
              />
              <InputField 
                label="Téléphone" 
                name="telephone"
                required 
                width="half" 
                type="tel" 
                placeholder="06 12 34 56 78"
                value={formData.telephone}
                onChange={handleInputChange}
                error={errors.telephone}
              />
              <InputField 
                label="NIR (Numéro de Sécurité Sociale)" 
                name="nir"
                width="full" 
                placeholder="1 85 12 75 108 123 45"
                value={formData.nir}
                onChange={handleInputChange}
              />
            </div>
          </FormSection>
        </div>

        {/* Section 3 - Situation & Déclarations */}
        <div className="col-span-12">
          <FormSection number={3} title="Situation & Déclarations">
            <div className="grid grid-cols-12 gap-5">
              <SelectField
                label="Situation avant le contrat"
                name="situation_avant"
                required
                width="full"
                value={formData.situation_avant}
                onChange={handleSelectChange}
                error={errors.situation_avant}
              >
                <option value="">Sélectionnez votre situation</option>
                <option value="Etudiant : (Etude supérieur)">Etudiant : (Etude supérieur)</option>
                <option value="Scolaire : (Bac / brevet...)">Scolaire : (Bac / brevet...)</option>
                <option value="contrat_pro">Contrat pro</option>
                <option value="Salarié : (CDD/CDI)e">Salarié : (CDD/CDI)</option>
                <option value="Contrat d'apprentissage">Contrat d'apprentissage</option>
              </SelectField>

              <SelectField
                label="Régime social"
                name="regime_social"
                width="full"
                value={formData.regime_social}
                onChange={handleSelectChange}
              >
                <option value="">Sélectionnez</option>
                <option value="urssaf">URSSAF</option>
                <option value="msa">MSA (Mutualité Sociale Agricole)</option>
              </SelectField>

              <div className="col-span-12 space-y-4">
                <div className="bg-white/40 p-4 rounded-xl">
                  <label className="block text-sm font-semibold text-slate-800 mb-3">
                    Déclare être inscrit(e) sur la liste des sportifs de haut niveau
                  </label>
                  <div className="flex gap-3">
                    <label className="relative cursor-pointer group flex-1">
                      <input 
                        type="radio" 
                        name="sportif_haut_niveau" 
                        value="oui"
                        checked={formData.sportif_haut_niveau === 'oui'}
                        onChange={() => handleRadioChange('sportif_haut_niveau', 'oui')}
                        className="peer sr-only" 
                      />
                      <div className={`flex items-center gap-3 px-4 py-3 bg-slate-200/50 rounded-xl border-2 transition-all ${
                        formData.sportif_haut_niveau === 'oui' 
                          ? 'bg-white/90 border-blue-500' 
                          : 'border-transparent hover:bg-white/60'
                      }`}>
                        <span className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold ${
                          formData.sportif_haut_niveau === 'oui' ? 'bg-blue-500 text-white' : 'bg-slate-600 text-white'
                        }`}>A</span>
                        <span className="font-medium text-slate-700">Oui</span>
                      </div>
                    </label>
                    <label className="relative cursor-pointer group flex-1">
                      <input 
                        type="radio" 
                        name="sportif_haut_niveau" 
                        value="non"
                        checked={formData.sportif_haut_niveau === 'non'}
                        onChange={() => handleRadioChange('sportif_haut_niveau', 'non')}
                        className="peer sr-only" 
                      />
                      <div className={`flex items-center gap-3 px-4 py-3 bg-slate-200/50 rounded-xl border-2 transition-all ${
                        formData.sportif_haut_niveau === 'non' 
                          ? 'bg-white/90 border-blue-500' 
                          : 'border-transparent hover:bg-white/60'
                      }`}>
                        <span className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold ${
                          formData.sportif_haut_niveau === 'non' ? 'bg-blue-500 text-white' : 'bg-slate-600 text-white'
                        }`}>B</span>
                        <span className="font-medium text-slate-700">Non</span>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="bg-white/40 p-4 rounded-xl">
                  <label className="block text-sm font-semibold text-slate-800 mb-3">
                    Déclare avoir un projet de création ou de reprise d'entreprise
                  </label>
                  <div className="flex gap-3">
                    <label className="relative cursor-pointer group flex-1">
                      <input 
                        type="radio" 
                        name="projet_entreprise" 
                        value="oui"
                        checked={formData.projet_entreprise === 'oui'}
                        onChange={() => handleRadioChange('projet_entreprise', 'oui')}
                        className="peer sr-only" 
                      />
                      <div className={`flex items-center gap-3 px-4 py-3 bg-slate-200/50 rounded-xl border-2 transition-all ${
                        formData.projet_entreprise === 'oui' 
                          ? 'bg-white/90 border-blue-500' 
                          : 'border-transparent hover:bg-white/60'
                      }`}>
                        <span className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold ${
                          formData.projet_entreprise === 'oui' ? 'bg-blue-500 text-white' : 'bg-slate-600 text-white'
                        }`}>A</span>
                        <span className="font-medium text-slate-700">Oui</span>
                      </div>
                    </label>
                    <label className="relative cursor-pointer group flex-1">
                      <input 
                        type="radio" 
                        name="projet_entreprise" 
                        value="non"
                        checked={formData.projet_entreprise === 'non'}
                        onChange={() => handleRadioChange('projet_entreprise', 'non')}
                        className="peer sr-only" 
                      />
                      <div className={`flex items-center gap-3 px-4 py-3 bg-slate-200/50 rounded-xl border-2 transition-all ${
                        formData.projet_entreprise === 'non' 
                          ? 'bg-white/90 border-blue-500' 
                          : 'border-transparent hover:bg-white/60'
                      }`}>
                        <span className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold ${
                          formData.projet_entreprise === 'non' ? 'bg-blue-500 text-white' : 'bg-slate-600 text-white'
                        }`}>B</span>
                        <span className="font-medium text-slate-700">Non</span>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="bg-white/40 p-4 rounded-xl">
                  <label className="block text-sm font-semibold text-slate-800 mb-3">
                    Déclare bénéficier de la reconnaissance travailleur handicapé (RQTH)
                  </label>
                  <div className="flex gap-3">
                    <label className="relative cursor-pointer group flex-1">
                      <input 
                        type="radio" 
                        name="rqth" 
                        value="oui"
                        checked={formData.rqth === 'oui'}
                        onChange={() => handleRadioChange('rqth', 'oui')}
                        className="peer sr-only" 
                      />
                      <div className={`flex items-center gap-3 px-4 py-3 bg-slate-200/50 rounded-xl border-2 transition-all ${
                        formData.rqth === 'oui' 
                          ? 'bg-white/90 border-blue-500' 
                          : 'border-transparent hover:bg-white/60'
                      }`}>
                        <span className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold ${
                          formData.rqth === 'oui' ? 'bg-blue-500 text-white' : 'bg-slate-600 text-white'
                        }`}>A</span>
                        <span className="font-medium text-slate-700">Oui</span>
                      </div>
                    </label>
                    <label className="relative cursor-pointer group flex-1">
                      <input 
                        type="radio" 
                        name="rqth" 
                        value="non"
                        checked={formData.rqth === 'non'}
                        onChange={() => handleRadioChange('rqth', 'non')}
                        className="peer sr-only" 
                      />
                      <div className={`flex items-center gap-3 px-4 py-3 bg-slate-200/50 rounded-xl border-2 transition-all ${
                        formData.rqth === 'non' 
                          ? 'bg-white/90 border-blue-500' 
                          : 'border-transparent hover:bg-white/60'
                      }`}>
                        <span className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold ${
                          formData.rqth === 'non' ? 'bg-blue-500 text-white' : 'bg-slate-600 text-white'
                        }`}>B</span>
                        <span className="font-medium text-slate-700">Non</span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </FormSection>
        </div>

        {/* Section 4 - Parcours scolaire */}
        <div className="col-span-12">
          <FormSection number={4} title="Parcours scolaire">
            <div className="grid grid-cols-12 gap-5">
              <SelectField
                label="Dernier diplôme ou titre préparé"
                name="dernier_diplome_prepare"
                required
                width="full"
                value={formData.dernier_diplome_prepare}
                onChange={handleSelectChange}
                error={errors.dernier_diplome_prepare}
              >
                <option value="">Sélectionnez</option>
                <option value="bac_techno">Baccalauréat Technologique</option>
                <option value="bac_general">Baccalauréat général</option>
                <option value="bac_pro">Baccalauréat pro</option>
                <option value="brevet">Brevet</option>
                <option value="cap">CAP</option>
                <option value="bts">BTS</option>
                <option value="aucun">Aucun diplôme</option>
              </SelectField>

              <SelectField
                label="Dernière année ou classe suivie"
                name="derniere_classe"
                required
                width="full"
                value={formData.derniere_classe}
                onChange={handleSelectChange}
                error={errors.derniere_classe}
              >
                <option value="">Sélectionnez</option>
                <option value="derniere_annee_obtenu">Dernière année du cycle de formation - diplôme obtenu</option>
                <option value="1ere_annee_validee">1ère année du cycle validée (année non diplômante)</option>
                <option value="1ere_annee_non_validee">1ère année du cycle non validée (échec/interruption)</option>
                <option value="2e_annee_validee">2è année du cycle validée (année non diplômante)</option>
                <option value="2e_annee_non_validee">2è année du cycle non validée (échec/interruption)</option>
                <option value="3e_annee_validee">3è année du cycle validée (année non diplômante)</option>
                <option value="3e_annee_non_validee">3è année du cycle non validée (échec/interruption)</option>
                <option value="1er_cycle_secondaire">1er cycle de l'enseignement secondaire achevé (collège)</option>
                <option value="interrompu_3e">Études interrompues en classe de 3è</option>
                <option value="interrompu_4e">Études interrompues en classe de 4è</option>
              </SelectField>

              <SelectField 
                label="Intitulé précis du dernier diplôme ou titre préparé" 
                name="intitule_diplome"
                width="full" 
                value={formData.intitule_diplome}
                onChange={handleSelectChange}
              >
                <option value="">Sélectionnez</option>
                <option value="Baccalauréat Technologique">Baccalauréat Technologique</option>
                <option value="Baccalauréat général">Baccalauréat général</option>
                <option value="Baccalauréat pro">Baccalauréat pro</option>
                <option value="Brevet">Brevet</option>
                <option value="CAP">CAP</option>
                <option value="BTS">BTS</option>
                <option value="Aucun diplôme">Aucun diplôme</option>
              </SelectField>

              <RadioGroup 
                label="Diplôme ou titre le plus élevé obtenu *" 
                name="bac"
                options={["BAC", "BAC+1", "BAC+2", "BAC+3", "BAC+4", "BAC+5"]} 
                layout="grid"
                value={formData.bac}
                onChange={(value) => handleRadioChange('bac', value)}
                error={errors.bac}
              />
            </div>
          </FormSection>
        </div>

        {/* Section 5 - Formation souhaitée */}
        <div className="col-span-12">
          <FormSection number={5} title="Formation souhaitée">
            <div className="grid grid-cols-12 gap-5">
              <SelectField
                label="Formation"
                name="formation"
                required
                width="full"
                value={formData.formation}
                onChange={handleSelectChange}
                error={errors.formation}
              >
                <option value="">Sélectionnez une formation</option>
                <option value="bts_mco">BTS MCO - Management Commercial Opérationnel</option>
                <option value="bts_ndrc">BTS NDRC - Négociation et Digitalisation de la Relation Client</option>
                <option value="bachelor_rdc">BACHELOR RDC - Responsable Développement Commercial</option>
                <option value="tp_ntc">TP NTC - Négociateur Technico-Commercial</option>
              </SelectField>

              <InputField 
                label="Date de visite / JPO" 
                name="date_visite"
                width="half" 
                type="date"
                value={formData.date_visite}
                onChange={handleInputChange}
              />

              <InputField 
                label="Date d'envoi du règlement" 
                name="date_reglement"
                width="half" 
                type="date"
                value={formData.date_reglement}
                onChange={handleInputChange}
              />

              <RadioGroup 
                label="Avez-vous déjà une entreprise d'accueil ?" 
                name="entreprise_accueil"
                options={["Oui", "En recherche", "Non"]} 
                layout="horizontal"
                value={formData.entreprise_accueil}
                onChange={(value) => handleRadioChange('entreprise_accueil', value)}
              />

              {formData.entreprise_accueil === "Oui" && (
                <InputField 
                  label="Nom de l'entreprise" 
                  name="nom_entreprise"
                  width="full" 
                  placeholder="Nom de l'entreprise d'accueil"
                  value={formData.nom_entreprise}
                  onChange={handleInputChange}
                />
              )}
            </div>
          </FormSection>
        </div>

        {/* Section 6 - Informations complémentaires */}
        <div className="col-span-12">
          <FormSection number={6} title="Informations complémentaires">
            <div className="grid grid-cols-12 gap-5">
              <SelectField
                label="Comment avez-vous connu Rush School ?"
                name="source"
                width="full"
                value={formData.source}
                onChange={handleSelectChange}
              >
                <option value="">Sélectionnez</option>
                <option value="reseaux_sociaux">Réseaux sociaux</option>
                <option value="google">Recherche Google</option>
                <option value="parcoursup">Parcoursup</option>
                <option value="salon">Salon / Forum</option>
                <option value="bouche_oreille">Bouche à oreille</option>
                <option value="autre">Autre</option>
              </SelectField>

              <TextAreaField
                label="Motivations et projet professionnel"
                name="motivations"
                placeholder="Décrivez brièvement vos motivations et votre projet professionnel..."
                rows={4}
                value={formData.motivations}
                onChange={handleInputChange}
              />
            </div>
          </FormSection>
        </div>

        {/* Submit */}
        <div className="col-span-12 mt-8 pt-8 border-t-2 border-black/5 flex flex-col items-center gap-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              checked={attestation}
              onChange={(e) => {
                setAttestation(e.target.checked);
                if (errors.attestation) {
                  setErrors(prev => ({ ...prev, attestation: '' }));
                }
              }}
              className="w-5 h-5 accent-blue-500 rounded" 
            />
            <span className="font-medium text-slate-800">
              J'atteste sur l'honneur l'exactitude des informations fournies <span className="text-red-500">*</span>
            </span>
          </label>
          {errors.attestation && (
            <p className="text-red-500 text-sm -mt-4">{errors.attestation}</p>
          )}

          <button 
            type="submit"
            disabled={isSubmitting}
            className={`flex items-center gap-2.5 px-10 py-4 rounded-2xl font-bold text-lg transition-all shadow-lg ${
              isSubmitting 
                ? 'bg-slate-400 cursor-not-allowed' 
                : 'bg-slate-900 text-white hover:bg-slate-800 hover:-translate-y-1 shadow-slate-900/20'
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Enregistrement en cours...
              </>
            ) : (
              <>
                <Save size={20} />
                Enregistrer et continuer
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default QuestionnaireForm;