import React from 'react';
import { User, FileText, CheckSquare, Save } from 'lucide-react';

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

const InputField = ({ label, required, type = "text", placeholder, width = "full" }: { label: string, required?: boolean, type?: string, placeholder?: string, width?: "full" | "half" | "third" | "two-thirds" }) => {
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
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-white/70 border-0 rounded-xl text-base text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all shadow-sm"
      />
    </div>
  );
};

const RadioGroup = ({ label, options, layout = "horizontal" }: { label: string, options: string[], layout?: "horizontal" | "vertical" | "grid" }) => (
  <div className="col-span-12">
    <label className="block text-sm font-semibold text-slate-800 mb-2">{label}</label>
    <div className={`flex gap-3 ${layout === 'vertical' ? 'flex-col' : layout === 'grid' ? 'grid grid-cols-2 md:grid-cols-3' : 'flex-wrap'}`}>
      {options.map((opt, idx) => (
        <label key={idx} className="relative cursor-pointer group flex-1 min-w-[120px]">
          <input type="radio" name={label} className="peer sr-only" />
          <div className="flex items-center gap-3 px-4 py-3 bg-slate-200/50 rounded-xl border-2 border-transparent peer-checked:bg-white/90 peer-checked:border-blue-500 hover:bg-white/60 transition-all">
            <span className="w-7 h-7 bg-slate-600 text-white rounded-md flex items-center justify-center text-xs font-bold peer-checked:bg-blue-500 transition-colors">
              {String.fromCharCode(65 + idx)}
            </span>
            <span className="font-medium text-slate-700">{opt}</span>
          </div>
        </label>
      ))}
    </div>
  </div>
);

const QuestionnaireForm = () => {
  return (
    <div className="bg-[#B8D4CE] rounded-3xl p-6 md:p-10 max-w-4xl mx-auto shadow-xl shadow-[#B8D4CE]/20">
      <div className="flex items-center gap-4 mb-8 pb-6 border-b-2 border-black/5">
        <div className="w-14 h-14 bg-black/5 rounded-2xl flex items-center justify-center text-emerald-900">
          <User size={32} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-1">Fiche d'inscription étudiant</h2>
          <p className="text-slate-600">Complétez toutes les informations pour finaliser votre dossier</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5">
        
        {/* Section 1 */}
        <div className="col-span-12">
          <FormSection number={1} title="Informations personnelles">
            <div className="grid grid-cols-12 gap-5">
              <InputField label="Prénom" required width="half" placeholder="Votre prénom" />
              <InputField label="Nom de naissance" required width="half" placeholder="Votre nom de naissance" />
              <InputField label="Nom d'usage" width="full" placeholder="Si différent du nom de naissance" />
              <RadioGroup label="Sexe *" options={["Féminin", "Masculin"]} />
              <InputField label="Date de naissance" required width="half" type="date" />
              <InputField label="Nationalité" required width="half" placeholder="Ex: Française" />
              <InputField label="Commune de naissance" required width="half" placeholder="Ville de naissance" />
              <InputField label="Département" required width="half" placeholder="Ex: 75 - Paris" />
            </div>
          </FormSection>
        </div>

        {/* Section 2 */}
        <div className="col-span-12">
          <FormSection number={2} title="Coordonnées">
            <div className="grid grid-cols-12 gap-5">
              <InputField label="Adresse de résidence" required width="full" placeholder="Numéro et nom de rue" />
              <InputField label="Code postal" required width="third" placeholder="Ex: 75001" />
              <InputField label="Ville" required width="two-thirds" placeholder="Ville de résidence" />
              <InputField label="E-mail" required width="half" type="email" placeholder="votre@email.com" />
              <InputField label="Téléphone" required width="half" type="tel" placeholder="06 12 34 56 78" />
              <InputField label="NIR (Numéro de Sécurité Sociale)" width="full" placeholder="1 85 12 75 108 123 45" />
            </div>
          </FormSection>
        </div>

        {/* Section 4 */}
        <div className="col-span-12">
          <FormSection number={4} title="Parcours scolaire">
            <div className="grid grid-cols-12 gap-5">
              <InputField label="Dernier diplôme ou titre préparé" width="half" placeholder="Ex: Baccalauréat général" />
              <InputField label="Dernière classe suivie" width="half" placeholder="Ex: Terminale" />
              <RadioGroup label="Diplôme ou titre le plus élevé obtenu *" options={["BAC", "BAC +1", "BAC +2", "BAC +3", "BAC +4", "BAC +5"]} layout="grid" />
            </div>
          </FormSection>
        </div>

         {/* Submit */}
         <div className="col-span-12 mt-8 pt-8 border-t-2 border-black/5 flex flex-col items-center gap-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-5 h-5 accent-blue-500 rounded" />
              <span className="font-medium text-slate-800">J'atteste sur l'honneur l'exactitude des informations fournies <span className="text-red-500">*</span></span>
            </label>

            <button className="flex items-center gap-2.5 px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-slate-800 hover:-translate-y-1 transition-all shadow-lg shadow-slate-900/20">
              <Save size={20} />
              Enregistrer et continuer
            </button>
         </div>

      </div>
    </div>
  );
};

export default QuestionnaireForm;