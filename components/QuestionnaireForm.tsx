import React, { useState } from 'react';
import { User, Save, AlertCircle, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import { api } from '../services/api';

interface QuestionnaireFormProps {
  onNext: (data: any) => void;
  onBack?: () => void;
}

const FormSection = ({ number, title, children }: { number: number, title: string, children?: React.ReactNode }) => (
  <div className="bg-white/80 p-6 md:p-8 rounded-2xl border border-blue-100 shadow-sm mb-6 transition-all hover:shadow-md">
    <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
      <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center font-bold text-sm shadow-sm ring-1 ring-blue-500/10">
        {number}
      </div>
      <h3 className="text-lg font-bold text-slate-800">{title}</h3>
    </div>
    <div className="grid grid-cols-12 gap-6">
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
      <label className="block text-sm font-semibold text-slate-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input 
        type={type} 
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-4 py-3 bg-white border rounded-xl text-base text-slate-800 placeholder:text-slate-400 transition-all focus:ring-4 focus:outline-none ${
          error 
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10' 
            : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/10'
        }`}
      />
      {error && (
        <p className="mt-1.5 text-xs text-red-500 font-medium flex items-center gap-1">
          <AlertCircle size={12}/> {error}
        </p>
      )}
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
  children?: React.ReactNode;
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
      <label className="block text-sm font-semibold text-slate-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-3 bg-white border rounded-xl text-base text-slate-800 transition-all focus:ring-4 focus:outline-none cursor-pointer ${
          error 
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10' 
            : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/10'
        }`}
      >
        {children}
      </select>
      {error && (
        <p className="mt-1.5 text-xs text-red-500 font-medium flex items-center gap-1">
          <AlertCircle size={12}/> {error}
        </p>
      )}
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
      <label className="block text-sm font-semibold text-slate-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className={`w-full px-4 py-3 bg-white border rounded-xl text-base text-slate-800 placeholder:text-slate-400 transition-all focus:ring-4 focus:outline-none resize-none ${
          error 
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10' 
            : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/10'
        }`}
      />
      {error && (
        <p className="mt-1.5 text-xs text-red-500 font-medium flex items-center gap-1">
          <AlertCircle size={12}/> {error}
        </p>
      )}
    </div>
  );
};

interface RadioGroupProps {
  label: string;
  name: string;
  options: { value: string, label: string }[];
  layout?: "horizontal" | "vertical" | "grid";
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const RadioGroup = ({ label, name, options, layout = "horizontal", value, onChange, error }: RadioGroupProps) => (
  <div className="col-span-12">
    <label className="block text-sm font-semibold text-slate-700 mb-3">{label}</label>
    <div className={`flex flex-wrap gap-3 ${layout === 'grid' ? 'grid grid-cols-2 md:grid-cols-3' : ''}`}>
      {options.map((opt) => (
        <label 
          key={opt.value} 
          className={`cursor-pointer group relative flex items-center gap-3 px-4 py-3 border rounded-xl transition-all hover:bg-slate-50 ${
            value === opt.value 
              ? 'bg-blue-50 border-blue-500 shadow-sm ring-1 ring-blue-500/20' 
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <input 
            type="radio" 
            name={name} 
            value={opt.value} 
            checked={value === opt.value}
            onChange={(e) => onChange(e.target.value)}
            className="peer sr-only" 
          />
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
            value === opt.value ? 'border-blue-500' : 'border-slate-300'
          }`}>
            {value === opt.value && <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>}
          </div>
          <span className={`text-sm font-medium ${value === opt.value ? 'text-blue-700' : 'text-slate-600'}`}>
            {opt.label}
          </span>
        </label>
      ))}
    </div>
    {error && (
        <p className="mt-1.5 text-xs text-red-500 font-medium flex items-center gap-1">
          <AlertCircle size={12}/> {error}
        </p>
    )}
  </div>
);

const QuestionnaireForm: React.FC<QuestionnaireFormProps> = ({ onNext }) => {
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    nomUsage: '',
    sexe: '',
    dateNaissance: '',
    nationalite: '',
    villeNaissance: '',
    deptNaissance: '',
    adresse: '',
    codePostal: '',
    ville: '',
    email: '',
    telephone: '',
    nir: '',
    situation: '',
    regimeSocial: '',
    sportifHautNiveau: 'non',
    projetEntreprise: 'non',
    rqth: 'non',
    diplome: '',
    classe: '',
    intitule_diplome: '',
    niveau: '',
    formation: '',
    dateVisite: '',
    dateReglement: '',
    entrepriseAccueil: '',
    nomEntreprise: '',
    source: '',
    motivations: '',
    agreement: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleRadioChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
  }

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.prenom) newErrors.prenom = 'Requis';
    if (!formData.nom) newErrors.nom = 'Requis';
    if (!formData.sexe) newErrors.sexe = 'Requis';
    if (!formData.dateNaissance) newErrors.dateNaissance = 'Requis';
    if (!formData.nationalite) newErrors.nationalite = 'Requis';
    if (!formData.villeNaissance) newErrors.villeNaissance = 'Requis';
    if (!formData.adresse) newErrors.adresse = 'Requis';
    if (!formData.codePostal) newErrors.codePostal = 'Requis';
    if (!formData.ville) newErrors.ville = 'Requis';
    if (!formData.email) newErrors.email = 'Requis';
    if (!formData.telephone) newErrors.telephone = 'Requis';
    if (!formData.situation) newErrors.situation = 'Requis';
    if (!formData.diplome) newErrors.diplome = 'Requis';
    if (!formData.formation) newErrors.formation = 'Requis';
    if (!formData.agreement) newErrors.agreement = 'Vous devez attester l\'exactitude des informations';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validate()) {
      setIsSubmitting(true);
      try {
        const response = await api.submitStudent(formData);
        
        // Store candidate info for next steps
        if (response && response.record_id) {
            localStorage.setItem('candidateRecordId', response.record_id);
        }
        localStorage.setItem('candidateFirstName', formData.prenom);
        localStorage.setItem('candidateLastName', formData.nom);
        localStorage.setItem('candidateFormation', formData.formation);

        onNext(response);
      } catch (error: any) {
        console.error("Submission error:", error);
        alert("Erreur lors de l'enregistrement: " + error.message);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      alert("Veuillez remplir les champs obligatoires marqués en rouge.");
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-white rounded-3xl p-6 md:p-10 shadow-xl border border-blue-100 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
      
      <div className="flex items-center gap-6 mb-10 pb-8 border-b border-blue-100">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
          <User size={32} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-1">Fiche d'inscription étudiant</h2>
          <p className="text-slate-500">Complétez toutes les informations pour finaliser votre dossier d'admission</p>
        </div>
      </div>

      <div className="space-y-8">
        
        {/* 1. Informations Personnelles */}
        <FormSection number={1} title="Informations personnelles">
          <InputField width="half" label="Prénom" name="prenom" value={formData.prenom} onChange={handleChange} required error={errors.prenom} placeholder="Votre prénom" />
          <InputField width="half" label="Nom de naissance" name="nom" value={formData.nom} onChange={handleChange} required error={errors.nom} placeholder="Nom de famille" />
          <InputField width="half" label="Nom d'usage" name="nomUsage" value={formData.nomUsage} onChange={handleChange} placeholder="Si différent" />
          
          <div className="col-span-12 md:col-span-6">
             <RadioGroup 
                label="Sexe" 
                name="sexe" 
                value={formData.sexe} 
                onChange={(val) => handleRadioChange('sexe', val)} 
                options={[
                    { value: 'feminin', label: 'Féminin' },
                    { value: 'masculin', label: 'Masculin' }
                ]}
                error={errors.sexe}
             />
          </div>

          <InputField width="half" label="Date de naissance" type="date" name="dateNaissance" value={formData.dateNaissance} onChange={handleChange} required error={errors.dateNaissance} />
          <InputField width="half" label="NIR (Sécurité Sociale)" name="nir" value={formData.nir} onChange={handleChange} placeholder="1 85 12 75 108 123 45" />
          
          <SelectField width="half" label="Nationalité" name="nationalite" value={formData.nationalite} onChange={handleChange} required error={errors.nationalite}>
            <option value="">Sélectionnez</option>
            <option value="francaise">Française</option>
            <option value="ue">Union Européenne</option>
            <option value="hors_ue">Hors UE</option>
          </SelectField>

          <InputField width="half" label="Commune de naissance" name="villeNaissance" value={formData.villeNaissance} onChange={handleChange} required error={errors.villeNaissance} />
          <InputField width="full" label="Département de naissance" name="deptNaissance" value={formData.deptNaissance} onChange={handleChange} placeholder="Ex: 75 - Paris" />
        </FormSection>

        {/* 2. Coordonnées */}
        <FormSection number={2} title="Coordonnées">
          <InputField width="full" label="Adresse de résidence" name="adresse" value={formData.adresse} onChange={handleChange} required error={errors.adresse} placeholder="N° et nom de rue" />
          <InputField width="third" label="Code Postal" name="codePostal" value={formData.codePostal} onChange={handleChange} required error={errors.codePostal} />
          <InputField width="two-thirds" label="Ville" name="ville" value={formData.ville} onChange={handleChange} required error={errors.ville} />
          <InputField width="half" label="Email" type="email" name="email" value={formData.email} onChange={handleChange} required error={errors.email} placeholder="email@exemple.com" />
          <InputField width="half" label="Téléphone" type="tel" name="telephone" value={formData.telephone} onChange={handleChange} required error={errors.telephone} placeholder="06 12 34 56 78" />
        </FormSection>

        {/* 3. Situation */}
        <FormSection number={3} title="Situation & Déclarations">
          <SelectField width="full" label="Situation avant le contrat" name="situation" value={formData.situation} onChange={handleChange} required error={errors.situation}>
            <option value="">Sélectionnez</option>
            <option value="scolaire">Scolaire</option>
            <option value="etudiant">Étudiant</option>
            <option value="apprentissage">Apprentissage</option>
            <option value="contrat_pro">Contrat Pro</option>
            <option value="salarie">Salarié</option>
            <option value="demandeur_emploi">Demandeur d'emploi</option>
            <option value="inactif">Inactif</option>
          </SelectField>

          <SelectField width="full" label="Régime Social" name="regimeSocial" value={formData.regimeSocial} onChange={handleChange}>
            <option value="">Sélectionnez</option>
            <option value="urssaf">URSSAF</option>
            <option value="msa">MSA</option>
          </SelectField>

          <div className="col-span-12 space-y-4">
             <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-sm font-medium text-slate-700">Inscrit(e) sur la liste des sportifs de haut niveau ?</span>
                <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="sportifHautNiveau" value="oui" checked={formData.sportifHautNiveau === 'oui'} onChange={handleChange} /> Oui</label>
                    <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="sportifHautNiveau" value="non" checked={formData.sportifHautNiveau === 'non'} onChange={handleChange} /> Non</label>
                </div>
             </div>
             <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-sm font-medium text-slate-700">Projet de création ou reprise d'entreprise ?</span>
                <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="projetEntreprise" value="oui" checked={formData.projetEntreprise === 'oui'} onChange={handleChange} /> Oui</label>
                    <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="projetEntreprise" value="non" checked={formData.projetEntreprise === 'non'} onChange={handleChange} /> Non</label>
                </div>
             </div>
             <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-sm font-medium text-slate-700">Reconnaissance travailleur handicapé (RQTH) ?</span>
                <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="rqth" value="oui" checked={formData.rqth === 'oui'} onChange={handleChange} /> Oui</label>
                    <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="rqth" value="non" checked={formData.rqth === 'non'} onChange={handleChange} /> Non</label>
                </div>
             </div>
          </div>
        </FormSection>

        {/* 4. Parcours Scolaire */}
        <FormSection number={4} title="Parcours scolaire">
           <SelectField width="full" label="Dernier diplôme préparé" name="diplome" value={formData.diplome} onChange={handleChange} required error={errors.diplome}>
             <option value="">Sélectionnez</option>
             <option value="bac">Baccalauréat</option>
             <option value="bac_pro">Bac Pro</option>
             <option value="bac_techno">Bac Techno</option>
             <option value="bts">BTS / DUT</option>
             <option value="licence">Licence / Bachelor</option>
             <option value="master">Master</option>
             <option value="cap">CAP / BEP</option>
             <option value="aucun">Aucun</option>
           </SelectField>

           <InputField width="full" label="Intitulé du diplôme" name="intitule_diplome" value={formData.intitule_diplome} onChange={handleChange} placeholder="Ex: Bac général spécialité Maths" />
           
           <SelectField width="half" label="Dernière classe suivie" name="classe" value={formData.classe} onChange={handleChange}>
             <option value="">Sélectionnez</option>
             <option value="terminale">Terminale</option>
             <option value="1ere_annee">1ère année sup.</option>
             <option value="2eme_annee">2ème année sup.</option>
             <option value="3eme_annee">3ème année sup.</option>
             <option value="autre">Autre</option>
           </SelectField>

           <div className="col-span-12 md:col-span-6">
             <RadioGroup 
                label="Diplôme le plus élevé obtenu" 
                name="niveau" 
                value={formData.niveau} 
                onChange={(val) => handleRadioChange('niveau', val)} 
                options={[
                    { value: 'bac', label: 'BAC' },
                    { value: 'bac2', label: 'BAC+2' },
                    { value: 'bac3_4', label: 'BAC+3/4' },
                    { value: 'bac5', label: 'BAC+5' }
                ]}
                layout="grid"
             />
           </div>
        </FormSection>

        {/* 5. Formation Souhaitée */}
        <FormSection number={5} title="Formation souhaitée">
           <SelectField width="full" label="Formation" name="formation" value={formData.formation} onChange={handleChange} required error={errors.formation}>
             <option value="">Sélectionnez</option>
             <option value="bts_mco">BTS MCO</option>
             <option value="bts_ndrc">BTS NDRC</option>
             <option value="bachelor_rdc">BACHELOR RDC</option>
             <option value="tp_ntc">TP NTC</option>
           </SelectField>

           <InputField width="half" label="Date de visite / JPO" type="date" name="dateVisite" value={formData.dateVisite} onChange={handleChange} />
           <InputField width="half" label="Date envoi règlement" type="date" name="dateReglement" value={formData.dateReglement} onChange={handleChange} />

           <div className="col-span-12">
             <RadioGroup 
                label="Avez-vous une entreprise d'accueil ?" 
                name="entrepriseAccueil" 
                value={formData.entrepriseAccueil} 
                onChange={(val) => handleRadioChange('entrepriseAccueil', val)} 
                options={[
                    { value: 'oui', label: 'Oui' },
                    { value: 'en_cours', label: 'En recherche' },
                    { value: 'non', label: 'Non' }
                ]}
             />
           </div>

           {formData.entrepriseAccueil === 'oui' && (
             <InputField width="full" label="Nom de l'entreprise" name="nomEntreprise" value={formData.nomEntreprise} onChange={handleChange} placeholder="Nom de l'entreprise" />
           )}
        </FormSection>

        {/* 6. Infos Complémentaires */}
        <FormSection number={6} title="Informations complémentaires">
           <SelectField width="full" label="Comment avez-vous connu l'école ?" name="source" value={formData.source} onChange={handleChange}>
             <option value="">Sélectionnez</option>
             <option value="internet">Internet / Google</option>
             <option value="reseaux">Réseaux Sociaux</option>
             <option value="salon">Salon Étudiant</option>
             <option value="bouche_oreille">Bouche à oreille</option>
             <option value="autre">Autre</option>
           </SelectField>

           <TextAreaField label="Motivations et projet professionnel" name="motivations" value={formData.motivations} onChange={handleChange} placeholder="Décrivez brièvement votre projet..." />
        </FormSection>

        {/* Validation */}
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 mt-8">
           <label className="flex items-start gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                name="agreement" 
                checked={formData.agreement} 
                onChange={(e) => setFormData(prev => ({ ...prev, agreement: e.target.checked }))}
                className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
              />
              <span className="text-sm text-slate-600">
                J'atteste sur l'honneur l'exactitude des informations fournies ci-dessus. Je m'engage à informer l'école de tout changement de situation.
              </span>
           </label>
           {errors.agreement && <p className="text-red-500 text-xs mt-2 ml-8 font-medium">{errors.agreement}</p>}
        </div>

        <div className="flex justify-end pt-6">
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold hover:shadow-lg hover:shadow-blue-500/25 transition-all flex items-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
            {isSubmitting ? 'Enregistrement...' : 'Enregistrer et continuer'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default QuestionnaireForm;