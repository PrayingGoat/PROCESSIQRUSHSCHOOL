
import React, { useState, useEffect } from 'react';
import { User, Save, AlertCircle, ChevronDown, Loader2 } from 'lucide-react';
import { api } from '../services/api';

interface QuestionnaireFormProps {
  onNext?: (data: any) => void;
}

// --- COMPONENTS ---

const SectionHeader = ({ number, title }: { number: number, title: string }) => (
  <div className="flex items-center gap-4 mb-6">
    <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-xl flex items-center justify-center font-bold text-sm shadow-lg shadow-blue-500/25 transition-transform duration-300 hover:scale-110">
      {number}
    </div>
    <h3 className="text-xl font-bold text-slate-800 tracking-tight">{title}</h3>
  </div>
);

const FormSection = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`mb-8 p-8 bg-slate-50/50 border border-slate-200 rounded-2xl transition-all duration-300 hover:bg-white hover:shadow-md ${className}`}>
    {children}
  </div>
);

const InputField = ({ label, name, value, required, type = "text", placeholder, width = "full", hint, error, onChange }: any) => {
  const widthClass = {
    "full": "col-span-12",
    "half": "col-span-12 md:col-span-6",
    "third": "col-span-12 md:col-span-4",
    "two-thirds": "col-span-12 md:col-span-8",
  }[width as string] || "col-span-12";

  return (
    <div className={widthClass}>
      <label className="block text-sm font-bold text-slate-700 mb-2 transition-colors focus-within:text-blue-600">
        {label} {required && <span className="text-purple-500">*</span>}
      </label>
      <div className="relative">
        <input 
          type={type} 
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          className={`w-full px-4 py-3.5 bg-white border-2 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 transition-all shadow-sm ${
            error 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10' 
              : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/10 hover:border-slate-300'
          }`}
        />
      </div>
      {error && <p className="mt-1.5 text-xs text-red-500 font-medium flex items-center gap-1"><AlertCircle size={12}/> {error}</p>}
      {!error && hint && <p className="mt-1.5 text-xs text-slate-400 flex items-center gap-1"><AlertCircle size={12}/> {hint}</p>}
    </div>
  );
};

const SelectField = ({ label, name, value, required, options, width = "full", error, onChange }: any) => {
  const widthClass = {
    "full": "col-span-12",
    "half": "col-span-12 md:col-span-6",
    "third": "col-span-12 md:col-span-4",
  }[width as string] || "col-span-12";

  return (
    <div className={widthClass}>
      <label className="block text-sm font-bold text-slate-700 mb-2">
        {label} {required && <span className="text-purple-500">*</span>}
      </label>
      <div className="relative">
        <select 
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full px-4 py-3.5 bg-white border-2 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-4 transition-all appearance-none cursor-pointer ${
            error 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10' 
              : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/10 hover:border-slate-300'
          }`}
        >
          <option value="">Sélectionnez</option>
          {options.map((opt: any) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
      </div>
      {error && <p className="mt-1.5 text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
};

const RadioGroup = ({ label, name, options, value, error, onChange, layout = "horizontal" }: any) => (
  <div className="col-span-12">
    <label className="block text-sm font-bold text-slate-700 mb-3">{label}</label>
    <div className={`flex gap-3 ${layout === 'grid' ? 'grid grid-cols-2 md:grid-cols-3' : 'flex-wrap'}`}>
      {options.map((opt: any, idx: number) => (
        <label key={opt.value} className={`relative cursor-pointer group ${layout === 'grid' ? '' : 'flex-1 min-w-[140px]'}`}>
          <input 
            type="radio" 
            name={name} 
            value={opt.value}
            checked={value === opt.value}
            onChange={onChange}
            className="peer sr-only" 
          />
          <div className={`flex items-center gap-3 px-5 py-4 bg-white border-2 rounded-xl transition-all shadow-sm ${
            error && !value ? 'border-red-200' : 'border-slate-200 hover:border-slate-300'
          } peer-checked:border-blue-500 peer-checked:bg-blue-50/30 peer-checked:shadow-blue-500/10 peer-checked:-translate-y-0.5`}>
            <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all shadow-sm ${
              value === opt.value 
                ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-blue-500/30 scale-105' 
                : 'bg-slate-100 text-slate-500'
            }`}>
              {String.fromCharCode(65 + idx)}
            </span>
            <span className={`font-semibold text-sm ${value === opt.value ? 'text-blue-700' : 'text-slate-700'}`}>
              {opt.label}
            </span>
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
    // 1. Infos perso
    prenom: '',
    nom: '',
    nomUsage: '',
    sexe: '',
    dateNaissance: '',
    nir: '',
    nationalite: '',
    villeNaissance: '',
    deptNaissance: '',
    
    // 2. Représentants (si mineur - UI only)
    repNom: '',
    repPrenom: '',
    repEmail: '',
    repTelephone: '',
    repLien: '',

    // 3. Coordonnées
    adresse: '',
    codePostal: '',
    ville: '',
    email: '',
    telephone: '',

    // 4. Situation & Déclarations
    situation: '',
    regimeSocial: '',
    sportifHautNiveau: 'non',
    projetEntreprise: 'non',
    rqth: 'non',

    // 5. Parcours
    diplome: '', // Dernier diplôme préparé
    classe: '', // Dernière classe
    niveau: '', // Diplôme obtenu (Bac, etc.)
    intituleDiplome: '',

    // 6. Formation & Infos
    formation: '',
    dateVisite: '',
    dateReglement: '',
    entrepriseAccueil: 'non',
    nomEntreprise: '',
    source: '',
    motivations: '',
    
    attestation: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isMinor, setIsMinor] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check minor status
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormData(prev => ({ ...prev, [name]: val }));
    
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
    
    // Required fields check
    const required = [
        'prenom', 'nom', 'sexe', 'dateNaissance', 'nationalite', 'villeNaissance', 'deptNaissance',
        'adresse', 'codePostal', 'ville', 'email', 'telephone',
        'situation', 'diplome', 'classe', 'niveau', 'formation', 'dateVisite'
    ];

    required.forEach(field => {
        // @ts-ignore
        if (!formData[field]) newErrors[field] = "Ce champ est requis";
    });

    if (formData.email && !emailRegex.test(formData.email)) newErrors.email = "Email invalide";
    if (formData.codePostal && !/^\d{5}$/.test(formData.codePostal)) newErrors.codePostal = "Code postal invalide";
    if (formData.telephone && formData.telephone.replace(/\D/g, '').length < 9) newErrors.telephone = "Téléphone invalide";

    if (formData.entrepriseAccueil === 'oui' && !formData.nomEntreprise.trim()) {
        newErrors.nomEntreprise = "Le nom de l'entreprise est requis";
    }

    if (isMinor) {
        if (!formData.repNom) newErrors.repNom = "Requis pour les mineurs";
        if (!formData.repPrenom) newErrors.repPrenom = "Requis pour les mineurs";
        if (!formData.repEmail) newErrors.repEmail = "Requis pour les mineurs";
        if (!formData.repTelephone) newErrors.repTelephone = "Requis pour les mineurs";
    }

    if (!formData.attestation) newErrors.attestation = "Vous devez attester l'exactitude des informations";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
        setIsSubmitting(true);
        try {
          await api.submitStudent(formData);
          if (onNext) onNext(formData);
        } catch (error: any) {
          console.error("Submission error", error);
          alert(`Erreur: ${error.message}`);
        } finally {
          setIsSubmitting(false);
        }
    } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // --- PROGRESS BAR ---
  const sections = 6;
  const filledCount = Object.values(formData).filter(v => v !== '' && v !== false && v !== 'non').length;
  const progress = Math.min(100, Math.round((filledCount / 25) * 100));

  return (
    <div className="bg-white rounded-3xl p-8 md:p-12 max-w-5xl mx-auto shadow-2xl border border-slate-100 relative overflow-hidden">
      
      {/* Header with Progress */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
                    <User size={32} />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Fiche d'inscription étudiant</h2>
                    <p className="text-slate-500">Dossier d'admission 2025-2026</p>
                </div>
            </div>
            <div className="hidden md:block text-right">
                <div className="text-sm font-bold text-blue-600 mb-1">{progress}% complété</div>
                <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                </div>
            </div>
        </div>
      </div>

      <div className="space-y-2">
        
        {/* SECTION 1: INFOS PERSO */}
        <FormSection>
            <SectionHeader number={1} title="Informations personnelles" />
            <div className="grid grid-cols-12 gap-5">
                <InputField label="Prénom" name="prenom" value={formData.prenom} onChange={handleChange} error={errors.prenom} required width="half" placeholder="Votre prénom" />
                <InputField label="Nom de naissance" name="nom" value={formData.nom} onChange={handleChange} error={errors.nom} required width="half" placeholder="Votre nom" />
                <InputField label="Nom d'usage" name="nomUsage" value={formData.nomUsage} onChange={handleChange} width="full" placeholder="Si différent" />
                
                <RadioGroup label="Sexe" name="sexe" value={formData.sexe} onChange={handleChange} error={errors.sexe} 
                    options={[{ label: 'Féminin', value: 'feminin' }, { label: 'Masculin', value: 'masculin' }]} 
                />
                
                <InputField label="Date de naissance" name="dateNaissance" value={formData.dateNaissance} onChange={handleChange} error={errors.dateNaissance} required width="half" type="date" />
                <InputField label="NIR (Sécurité Sociale)" name="nir" value={formData.nir} onChange={handleChange} width="half" placeholder="1 85 12 75..." hint="15 chiffres" />
                
                <SelectField label="Nationalité" name="nationalite" value={formData.nationalite} onChange={handleChange} error={errors.nationalite} required width="half"
                    options={[
                        { label: 'Française', value: 'francaise' },
                        { label: 'Union Européenne', value: 'ue' },
                        { label: 'Hors UE', value: 'hors_ue' }
                    ]}
                />
                <InputField label="Commune de naissance" name="villeNaissance" value={formData.villeNaissance} onChange={handleChange} error={errors.villeNaissance} required width="half" />
                <InputField label="Département de naissance" name="deptNaissance" value={formData.deptNaissance} onChange={handleChange} error={errors.deptNaissance} required width="full" placeholder="Ex: 75" />
            </div>
        </FormSection>

        {/* SECTION 2: MINEUR (Conditionnel) */}
        {isMinor && (
            <div className="mb-8 p-8 bg-amber-50 border border-amber-200 rounded-2xl animate-fade-in">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-9 h-9 bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-xl flex items-center justify-center font-bold text-sm shadow-lg shadow-amber-500/25">2</div>
                        <h3 className="text-xl font-bold text-slate-800">Représentant légal</h3>
                    </div>
                    <span className="px-3 py-1 bg-amber-200 text-amber-800 rounded-full text-xs font-bold uppercase tracking-wider">Mineur</span>
                </div>
                
                <div className="bg-white p-6 rounded-xl border border-amber-100 shadow-sm">
                    <h4 className="font-bold text-slate-700 mb-4 border-b border-slate-100 pb-2">Responsable légal principal</h4>
                    <div className="grid grid-cols-12 gap-5">
                        <InputField label="Nom" name="repNom" value={formData.repNom} onChange={handleChange} error={errors.repNom} required width="half" />
                        <InputField label="Prénom" name="repPrenom" value={formData.repPrenom} onChange={handleChange} error={errors.repPrenom} required width="half" />
                        <InputField label="Email" name="repEmail" value={formData.repEmail} onChange={handleChange} error={errors.repEmail} required width="half" type="email" />
                        <InputField label="Téléphone" name="repTelephone" value={formData.repTelephone} onChange={handleChange} error={errors.repTelephone} required width="half" type="tel" />
                        <SelectField label="Lien de parenté" name="repLien" value={formData.repLien} onChange={handleChange} width="full"
                            options={[
                                { label: 'Père', value: 'pere' }, { label: 'Mère', value: 'mere' }, { label: 'Tuteur', value: 'tuteur' }
                            ]}
                        />
                    </div>
                </div>
            </div>
        )}

        {/* SECTION 3: COORDONNÉES */}
        <FormSection>
            <SectionHeader number={isMinor ? 3 : 2} title="Coordonnées" />
            <div className="grid grid-cols-12 gap-5">
                <InputField label="Adresse" name="adresse" value={formData.adresse} onChange={handleChange} error={errors.adresse} required width="full" placeholder="N° et Rue" />
                <InputField label="Code Postal" name="codePostal" value={formData.codePostal} onChange={handleChange} error={errors.codePostal} required width="third" />
                <InputField label="Ville" name="ville" value={formData.ville} onChange={handleChange} error={errors.ville} required width="two-thirds" />
                <InputField label="Email personnel" name="email" value={formData.email} onChange={handleChange} error={errors.email} required width="half" type="email" />
                <InputField label="Téléphone mobile" name="telephone" value={formData.telephone} onChange={handleChange} error={errors.telephone} required width="half" type="tel" />
            </div>
        </FormSection>

        {/* SECTION 4: SITUATION */}
        <FormSection>
            <SectionHeader number={isMinor ? 4 : 3} title="Situation & Déclarations" />
            <div className="grid grid-cols-12 gap-5">
                <SelectField label="Situation actuelle" name="situation" value={formData.situation} onChange={handleChange} error={errors.situation} required width="full"
                    options={[
                        { label: 'Scolaire', value: 'scolaire' },
                        { label: 'Etudiant', value: 'etudiant' },
                        { label: 'Apprenti', value: 'apprenti' },
                        { label: 'Demandeur d\'emploi', value: 'demandeur_emploi' },
                        { label: 'Salarié', value: 'salarie' }
                    ]}
                />
                <SelectField label="Régime social" name="regimeSocial" value={formData.regimeSocial} onChange={handleChange} width="full"
                    options={[
                        { label: 'Sécurité Sociale (URSSAF)', value: 'urssaf' },
                        { label: 'MSA', value: 'msa' }
                    ]}
                />
                
                <div className="col-span-12 space-y-4 mt-2">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <RadioGroup label="Inscrit sur la liste des sportifs de haut niveau ?" name="sportifHautNiveau" value={formData.sportifHautNiveau} onChange={handleChange} 
                            options={[{ label: 'Oui', value: 'oui' }, { label: 'Non', value: 'non' }]} 
                        />
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <RadioGroup label="Projet de création ou reprise d'entreprise ?" name="projetEntreprise" value={formData.projetEntreprise} onChange={handleChange} 
                            options={[{ label: 'Oui', value: 'oui' }, { label: 'Non', value: 'non' }]} 
                        />
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <RadioGroup label="Reconnaissance travailleur handicapé (RQTH) ?" name="rqth" value={formData.rqth} onChange={handleChange} 
                            options={[{ label: 'Oui', value: 'oui' }, { label: 'Non', value: 'non' }]} 
                        />
                    </div>
                </div>
            </div>
        </FormSection>

        {/* SECTION 5: PARCOURS SCOLAIRE */}
        <FormSection>
            <SectionHeader number={isMinor ? 5 : 4} title="Parcours scolaire" />
            <div className="grid grid-cols-12 gap-5">
                <SelectField label="Dernier diplôme préparé" name="diplome" value={formData.diplome} onChange={handleChange} error={errors.diplome} required width="full"
                    options={[
                        { label: 'BAC Général', value: 'bac_general' },
                        { label: 'BAC Techno', value: 'bac_techno' },
                        { label: 'BAC Pro', value: 'bac_pro' },
                        { label: 'BTS / DUT', value: 'bts' },
                        { label: 'Licence', value: 'licence' },
                        { label: 'Master', value: 'master' },
                        { label: 'Autre', value: 'autre' }
                    ]}
                />
                <InputField label="Dernière classe suivie" name="classe" value={formData.classe} onChange={handleChange} required width="half" placeholder="Ex: Terminale" />
                <InputField label="Intitulé exact du diplôme" name="intituleDiplome" value={formData.intituleDiplome} onChange={handleChange} width="half" placeholder="Ex: Spécialité Maths" />
                
                <RadioGroup label="Diplôme le plus élevé obtenu" name="niveau" value={formData.niveau} onChange={handleChange} error={errors.niveau} layout="grid"
                    options={[
                        { label: 'Aucun', value: 'aucun' },
                        { label: 'CAP/BEP', value: 'cap_bep' },
                        { label: 'BAC', value: 'bac' },
                        { label: 'BAC +2', value: 'bac2' },
                        { label: 'BAC +3/4', value: 'bac3_4' },
                        { label: 'BAC +5', value: 'bac5' }
                    ]}
                />
            </div>
        </FormSection>

        {/* SECTION 6: FORMATION & INFOS */}
        <FormSection>
            <SectionHeader number={isMinor ? 6 : 5} title="Formation souhaitée" />
            <div className="grid grid-cols-12 gap-5">
                <SelectField label="Formation visée" name="formation" value={formData.formation} onChange={handleChange} error={errors.formation} required width="full"
                    options={[
                        { label: 'BTS MCO - Management Commercial', value: 'bts_mco' },
                        { label: 'BTS NDRC - Négociation Client', value: 'bts_ndrc' },
                        { label: 'BACHELOR RDC', value: 'bachelor' },
                        { label: 'TP NTC - Négociateur', value: 'tp_ntc' }
                    ]}
                />
                <InputField label="Date de visite / JPO" name="dateVisite" value={formData.dateVisite} onChange={handleChange} required width="half" type="date" />
                <InputField label="Date règlement" name="dateReglement" value={formData.dateReglement} onChange={handleChange} width="half" type="date" />
                
                <div className="col-span-12 p-5 bg-blue-50 rounded-xl border border-blue-100 mt-2">
                    <RadioGroup label="Avez-vous déjà une entreprise d'accueil ?" name="entrepriseAccueil" value={formData.entrepriseAccueil} onChange={handleChange} 
                        options={[
                            { label: 'Oui', value: 'oui' }, 
                            { label: 'En recherche', value: 'en_cours' },
                            { label: 'Non', value: 'non' }
                        ]} 
                    />
                    {formData.entrepriseAccueil === 'oui' && (
                        <div className="mt-4 animate-fade-in">
                            <InputField label="Nom de l'entreprise" name="nomEntreprise" value={formData.nomEntreprise} onChange={handleChange} width="full" error={errors.nomEntreprise} />
                        </div>
                    )}
                </div>

                <div className="col-span-12 mt-4">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Motivations</label>
                    <textarea 
                        name="motivations" 
                        value={formData.motivations}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all resize-none"
                        placeholder="Décrivez brièvement votre projet..."
                    ></textarea>
                </div>
            </div>
        </FormSection>

        {/* Validation */}
        <div className="mt-12 pt-8 border-t-2 border-slate-100 flex flex-col items-center gap-6">
            <label className={`flex items-center gap-3 cursor-pointer p-5 rounded-xl border-2 transition-all w-full md:w-auto ${
                errors.attestation ? 'border-red-200 bg-red-50' : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
            }`}>
                <input 
                    type="checkbox" 
                    name="attestation"
                    checked={formData.attestation}
                    onChange={handleChange}
                    className="w-5 h-5 accent-blue-600 rounded cursor-pointer" 
                />
                <span className="font-semibold text-slate-700">
                    J'atteste sur l'honneur l'exactitude des informations fournies
                </span>
            </label>
            {errors.attestation && <p className="text-red-500 text-sm font-bold">{errors.attestation}</p>}

            <button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="group flex items-center justify-center gap-3 px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-slate-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed w-full md:w-auto"
            >
              {isSubmitting ? <Loader2 size={24} className="animate-spin" /> : <Save size={24} />}
              {isSubmitting ? 'Enregistrement...' : 'Enregistrer et continuer'}
            </button>
            
            {Object.keys(errors).length > 0 && (
                <div className="flex items-center gap-2 text-red-500 font-bold bg-red-50 px-4 py-2 rounded-lg animate-bounce">
                    <AlertCircle size={20} />
                    Veuillez corriger les erreurs ci-dessus
                </div>
            )}
        </div>

      </div>
    </div>
  );
};

export default QuestionnaireForm;
