import React, { useState } from 'react';
import { User, Save, AlertCircle } from 'lucide-react';

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

const InputField = ({ label, required, type = "text", placeholder, width = "full", hint, onChange }: { label: string, required?: boolean, type?: string, placeholder?: string, width?: "full" | "half" | "third" | "two-thirds", hint?: string, onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void }) => {
  const widthClass = {
    "full": "col-span-12",
    "half": "col-span-12 md:col-span-6",
    "third": "col-span-12 md:col-span-4",
    "two-thirds": "col-span-12 md:col-span-8",
  }[width];

  return (
    <div className={widthClass}>
      <label className="block text-sm font-semibold text-slate-700 mb-2 group-focus-within:text-blue-600 transition-colors">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <input 
          type={type} 
          placeholder={placeholder}
          onChange={onChange}
          className="w-full px-4 py-3.5 bg-white border-2 border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm"
        />
        {type === 'tel' && (
           <div className="absolute left-0 top-0 bottom-0 px-3 bg-slate-50 border-r border-slate-200 rounded-l-xl flex items-center gap-1.5 text-slate-500 text-sm font-medium">
             <span className="w-5 h-3.5 bg-slate-800 rounded-[2px] relative overflow-hidden">
                <span className="absolute left-0 top-0 w-1/3 h-full bg-blue-700"></span>
                <span className="absolute left-1/3 top-0 w-1/3 h-full bg-white"></span>
                <span className="absolute right-0 top-0 w-1/3 h-full bg-red-600"></span>
             </span>
             +33
           </div>
        )}
      </div>
      {hint && <p className="mt-1.5 text-xs text-slate-400 flex items-center gap-1"><AlertCircle size={12}/> {hint}</p>}
    </div>
  );
};

const RadioGroup = ({ label, options, layout = "horizontal" }: { label: string, options: string[], layout?: "horizontal" | "vertical" | "grid" }) => (
  <div className="col-span-12">
    <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>
    <div className={`flex gap-3 ${layout === 'vertical' ? 'flex-col' : layout === 'grid' ? 'grid grid-cols-2 md:grid-cols-3' : 'flex-wrap'}`}>
      {options.map((opt, idx) => (
        <label key={idx} className="relative cursor-pointer group flex-1 min-w-[120px]">
          <input type="radio" name={label} className="peer sr-only" />
          <div className="flex items-center gap-3 px-4 py-3.5 bg-white border-2 border-slate-200 rounded-xl peer-checked:border-blue-500 peer-checked:bg-blue-50/50 hover:bg-slate-50 transition-all shadow-sm peer-checked:shadow-blue-500/10">
            <span className="w-7 h-7 bg-slate-200 text-slate-600 rounded-lg flex items-center justify-center text-xs font-bold peer-checked:bg-blue-600 peer-checked:text-white transition-all">
              {String.fromCharCode(65 + idx)}
            </span>
            <span className="font-medium text-slate-700 peer-checked:text-blue-700">{opt}</span>
          </div>
        </label>
      ))}
    </div>
  </div>
);

const QuestionnaireForm = () => {
  const [isMinor, setIsMinor] = useState(false);

  const checkAge = (e: React.ChangeEvent<HTMLInputElement>) => {
    const birthDate = new Date(e.target.value);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    setIsMinor(age < 18);
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
              <InputField label="Prénom" required width="half" placeholder="Votre prénom" />
              <InputField label="Nom de naissance" required width="half" placeholder="Votre nom de naissance" />
              <InputField label="Nom d'usage" width="full" placeholder="Si différent du nom de naissance" />
              <RadioGroup label="Sexe *" options={["Féminin", "Masculin"]} />
              <InputField label="Date de naissance" required width="half" type="date" onChange={checkAge} />
              <InputField label="NIR (Numéro de Sécurité Sociale)" width="half" placeholder="1 85 12 75 108 123 45" hint="15 chiffres - Voir carte Vitale" />
              <div className="col-span-12 grid grid-cols-12 gap-5">
                <InputField label="Nationalité" required width="half" placeholder="Ex: Française" />
                <InputField label="Commune de naissance" required width="half" placeholder="Ville de naissance" />
              </div>
              <InputField label="Département de naissance" required width="full" placeholder="Ex: 75 - Paris" />
            </div>
          </FormSection>
        </div>

        {/* Section Mineur (Conditionnel) */}
        {isMinor && (
          <div className="col-span-12 animate-fade-in-down">
            <div className="mb-8 p-7 bg-gradient-to-br from-amber-50 to-white border border-amber-200 rounded-2xl shadow-sm">
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
                            <InputField label="Nom" required width="half" placeholder="Nom du représentant" />
                            <InputField label="Prénom" required width="half" placeholder="Prénom du représentant" />
                            <InputField label="E-mail" required width="half" type="email" placeholder="email@exemple.com" />
                            <InputField label="Téléphone" required width="half" type="tel" placeholder="06 12 34 56 78" />
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
              <InputField label="Adresse de résidence" required width="full" placeholder="Numéro et nom de rue" />
              <InputField label="Code postal" required width="third" placeholder="Ex: 75001" />
              <InputField label="Ville" required width="two-thirds" placeholder="Ville de résidence" />
              <InputField label="E-mail" required width="half" type="email" placeholder="votre@email.com" />
              <InputField label="Téléphone" required width="half" type="tel" placeholder="06 12 34 56 78" />
            </div>
          </FormSection>
        </div>

        {/* Section 4 */}
        <div className="col-span-12">
          <FormSection number={isMinor ? 4 : 3} title="Parcours scolaire">
            <div className="grid grid-cols-12 gap-5">
              <InputField label="Dernier diplôme ou titre préparé" width="half" placeholder="Ex: Baccalauréat général" />
              <InputField label="Dernière classe suivie" width="half" placeholder="Ex: Terminale" />
              <RadioGroup label="Diplôme ou titre le plus élevé obtenu *" options={["Aucun", "CAP/BEP", "BAC", "BAC +2", "BAC +3/4", "BAC +5"]} layout="grid" />
            </div>
          </FormSection>
        </div>

        {/* Section 5 - Formation */}
        <div className="col-span-12">
            <FormSection number={isMinor ? 5 : 4} title="Formation souhaitée">
                <div className="grid grid-cols-12 gap-5">
                    <div className="col-span-12">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Formation visée *</label>
                        <select className="w-full px-4 py-3.5 bg-white border-2 border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-blue-500 transition-all cursor-pointer">
                            <option value="">Sélectionnez une formation</option>
                            <option value="bts_mco">BTS MCO - Management Commercial Opérationnel</option>
                            <option value="bts_ndrc">BTS NDRC - Négociation et Digitalisation de la Relation Client</option>
                            <option value="bachelor">BACHELOR RDC - Responsable Développement Commercial</option>
                            <option value="tp_ntc">TP NTC - Négociateur Technico-Commercial</option>
                        </select>
                    </div>
                    <InputField label="Date de visite / JPO" width="half" type="date" />
                    <RadioGroup label="Avez-vous déjà une entreprise d'accueil ?" options={["Oui", "En recherche", "Non"]} />
                </div>
            </FormSection>
        </div>

         {/* Submit */}
         <div className="col-span-12 mt-8 pt-8 border-t-2 border-slate-100 flex flex-col items-center gap-6 relative">
            <div className="absolute -top-3 bg-white px-4 text-xs font-semibold text-slate-400 uppercase tracking-widest">Validation</div>
            
            <label className="flex items-center gap-3 cursor-pointer p-4 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-200">
              <input type="checkbox" className="w-5 h-5 accent-blue-600 rounded cursor-pointer" />
              <span className="font-medium text-slate-700">J'atteste sur l'honneur l'exactitude des informations fournies <span className="text-red-500">*</span></span>
            </label>

            <button className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-1 transition-all duration-300">
              <Save size={20} className="group-hover:scale-110 transition-transform" />
              Enregistrer et continuer
            </button>
         </div>

      </div>
    </div>
  );
};

export default QuestionnaireForm;