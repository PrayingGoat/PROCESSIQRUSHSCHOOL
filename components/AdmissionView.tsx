import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  FileText, 
  PenTool, 
  Briefcase, 
  GraduationCap, 
  ChevronRight, 
  Upload,
  Info,
  ChevronDown
} from 'lucide-react';
import { AdmissionTab } from '../types';
import QuestionnaireForm from './QuestionnaireForm';

const StepItem = ({ step, label, isActive, isCompleted }: { step: number, label: string, isActive: boolean, isCompleted: boolean }) => (
  <div className="flex flex-col items-center gap-2 relative z-10">
    <div className={`w-11 h-11 rounded-full border-2 flex items-center justify-center font-bold text-base transition-all duration-300 ${
      isCompleted 
        ? 'bg-emerald-500 border-emerald-500 text-white' 
        : isActive 
          ? 'bg-blue-500 border-blue-500 text-white' 
          : 'bg-slate-50 border-slate-200 text-slate-400'
    }`}>
      {isCompleted ? <CheckCircle2 size={20} /> : step}
    </div>
    <div className={`text-xs font-semibold ${isActive || isCompleted ? 'text-blue-600' : 'text-slate-400'}`}>
      {label}
    </div>
  </div>
);

const StepLine = ({ isCompleted }: { isCompleted: boolean }) => (
  <div className={`h-[3px] w-12 md:w-20 rounded-full mx-2 mb-6 transition-colors duration-300 ${isCompleted ? 'bg-emerald-500' : 'bg-slate-200'}`}></div>
);

const FormationCard = ({ 
  icon, 
  title, 
  desc, 
  duration, 
  color,
  selected,
  onClick
}: { 
  icon: React.ReactNode, 
  title: string, 
  desc: string, 
  duration: string, 
  color: string,
  selected: boolean,
  onClick: () => void
}) => {
  const gradients: Record<string, string> = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-emerald-500 to-emerald-600',
    purple: 'from-violet-500 to-violet-600',
    orange: 'from-orange-500 to-orange-600',
  };

  return (
    <div 
      onClick={onClick}
      className={`bg-white border-2 rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
        selected ? 'border-blue-500 bg-blue-50 shadow-blue-500/10' : 'border-slate-100 hover:border-blue-300'
      }`}
    >
      <div className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white bg-gradient-to-br ${gradients[color]}`}>
        {icon}
      </div>
      <h4 className="font-bold text-slate-800 text-lg mb-1">{title}</h4>
      <p className="text-xs text-slate-500 leading-relaxed mb-3 h-9">{desc}</p>
      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${selected ? 'bg-blue-200 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>
        {duration}
      </span>
    </div>
  );
};

const FileUploadCard = ({ title, desc, uploaded }: { title: string, desc: string, uploaded: boolean }) => (
  <div className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all ${uploaded ? 'bg-emerald-50 border-emerald-500' : 'bg-white border-slate-200'}`}>
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${uploaded ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
      <FileText size={24} />
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="font-semibold text-slate-800 text-sm">{title}</h4>
      <p className="text-xs text-slate-500">{desc}</p>
      <div className={`text-xs font-semibold mt-1 ${uploaded ? 'text-emerald-600' : 'text-amber-500'}`}>
        {uploaded ? 'Téléversé' : 'Non téléversé'}
      </div>
    </div>
    <button className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${uploaded ? 'text-emerald-700 bg-emerald-100' : 'text-blue-600 bg-blue-50 hover:bg-blue-100'}`}>
      {uploaded ? <CheckCircle2 size={14}/> : <Upload size={14}/>}
      {uploaded ? 'Modifier' : 'Ajouter'}
    </button>
  </div>
);

const AdmissionView = () => {
  const [activeTab, setActiveTab] = useState<AdmissionTab>(AdmissionTab.TESTS);
  const [selectedFormation, setSelectedFormation] = useState<string | null>(null);

  return (
    <div className="animate-fade-in max-w-6xl mx-auto">
      {/* Hero */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-10 mb-8 text-white relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
         <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-sm font-medium mb-4 backdrop-blur-sm">
              <Briefcase size={16} /> Processus d'admission
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-3">Admission Rush School</h1>
            <p className="text-indigo-100 text-lg leading-relaxed">Complétez votre dossier d'admission : tests, documents et formalités administratives.</p>
         </div>
      </div>

      {/* Stepper */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-8 flex items-center justify-center overflow-x-auto">
        <div className="flex items-center min-w-max">
          <StepItem step={1} label="Tests" isActive={activeTab === AdmissionTab.TESTS} isCompleted={activeTab !== AdmissionTab.TESTS} />
          <StepLine isCompleted={activeTab !== AdmissionTab.TESTS} />
          
          <StepItem step={2} label="Documents" isActive={activeTab === AdmissionTab.DOCUMENTS} isCompleted={activeTab === AdmissionTab.QUESTIONNAIRE || activeTab === AdmissionTab.ADMINISTRATIF || activeTab === AdmissionTab.ENTRETIEN} />
          <StepLine isCompleted={activeTab === AdmissionTab.QUESTIONNAIRE || activeTab === AdmissionTab.ADMINISTRATIF || activeTab === AdmissionTab.ENTRETIEN} />
          
          <StepItem step={3} label="Questionnaire" isActive={activeTab === AdmissionTab.QUESTIONNAIRE} isCompleted={activeTab === AdmissionTab.ADMINISTRATIF || activeTab === AdmissionTab.ENTRETIEN} />
          <StepLine isCompleted={activeTab === AdmissionTab.ADMINISTRATIF || activeTab === AdmissionTab.ENTRETIEN} />
          
          <StepItem step={4} label="Administratif" isActive={activeTab === AdmissionTab.ADMINISTRATIF} isCompleted={activeTab === AdmissionTab.ENTRETIEN} />
          <StepLine isCompleted={activeTab === AdmissionTab.ENTRETIEN} />
          
          <StepItem step={5} label="Entretien" isActive={activeTab === AdmissionTab.ENTRETIEN} isCompleted={false} />
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="flex overflow-x-auto gap-2 mb-8 bg-white p-2 rounded-2xl border border-slate-200 no-scrollbar">
        {[
          { id: AdmissionTab.TESTS, label: 'Tests', icon: <PenTool size={18}/> },
          { id: AdmissionTab.DOCUMENTS, label: 'Documents', icon: <FileText size={18}/> },
          { id: AdmissionTab.QUESTIONNAIRE, label: 'Questionnaire', icon: <Info size={18}/> },
          { id: AdmissionTab.ADMINISTRATIF, label: 'Administratif', icon: <Briefcase size={18}/> },
          { id: AdmissionTab.ENTRETIEN, label: 'Entretien', icon: <CheckCircle2 size={18}/> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === tab.id 
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div>
        {activeTab === AdmissionTab.TESTS && (
          <div className="space-y-6 animate-fade-in">
             <div className="bg-white border border-slate-200 rounded-3xl p-8">
                <div className="flex items-center gap-3 mb-2">
                  <GraduationCap className="text-blue-500" size={24} />
                  <h3 className="text-xl font-bold text-slate-800">Sélectionnez votre formation</h3>
                </div>
                <p className="text-slate-500 mb-8">Choisissez la formation pour laquelle vous postulez afin d'accéder au test correspondant.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
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

             {selectedFormation && (
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 flex gap-5 items-start">
                   <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-amber-500 shrink-0 shadow-sm">
                      <Info size={24} />
                   </div>
                   <div>
                      <h4 className="font-bold text-slate-800 text-lg mb-2">Instructions avant de commencer</h4>
                      <ul className="space-y-2 text-sm text-slate-600">
                         <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div> Assurez-vous d'avoir une connexion internet stable</li>
                         <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div> Prévoyez environ 20-25 minutes sans interruption</li>
                         <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div> Répondez sincèrement, il n'y a pas de mauvaises réponses</li>
                      </ul>
                      <button className="mt-6 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all">
                         Commencer le test
                      </button>
                   </div>
                </div>
             )}
          </div>
        )}

        {activeTab === AdmissionTab.DOCUMENTS && (
           <div className="animate-fade-in space-y-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center gap-5">
                 <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center shrink-0">
                    <Upload size={28} />
                 </div>
                 <div>
                    <h3 className="text-lg font-bold text-slate-800">Documents à téléverser</h3>
                    <p className="text-slate-500 text-sm">Téléversez les documents suivants pour compléter votre dossier d'admission</p>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                 <FileUploadCard title="CV" desc="Curriculum Vitae à jour" uploaded={false} />
                 <FileUploadCard title="Carte d'Identité" desc="Recto-verso de la CNI" uploaded={true} />
                 <FileUploadCard title="Lettre de motivation" desc="Exposez vos motivations" uploaded={false} />
                 <FileUploadCard title="Carte Vitale" desc="Attestation de droits" uploaded={false} />
                 <FileUploadCard title="Dernier Diplôme" desc="Copie du dernier diplôme" uploaded={false} />
              </div>

              {/* Tutorial Accordion */}
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                 <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-5 flex items-center gap-4 cursor-pointer hover:bg-amber-100/50 transition-colors">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-amber-500 shadow-sm">
                       <Info size={20} />
                    </div>
                    <div className="flex-1">
                       <h4 className="font-semibold text-slate-800">Comment récupérer son NIR ?</h4>
                       <p className="text-xs text-slate-500">Cliquez pour voir les étapes</p>
                    </div>
                    <ChevronDown className="text-slate-400" />
                 </div>
              </div>

              {/* Progress Footer */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-5">
                 <div className="w-full md:w-1/2">
                    <div className="flex justify-between text-sm font-semibold mb-2">
                       <span className="text-slate-800">1 / 5 documents</span>
                       <span className="text-emerald-500">20%</span>
                    </div>
                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                       <div className="h-full bg-emerald-500 rounded-full w-[20%]"></div>
                    </div>
                 </div>
                 <button className="w-full md:w-auto px-6 py-3 bg-slate-100 text-slate-400 font-bold rounded-xl cursor-not-allowed">
                    Continuer vers le questionnaire
                 </button>
              </div>
           </div>
        )}

        {activeTab === AdmissionTab.QUESTIONNAIRE && (
           <div className="animate-fade-in">
              <QuestionnaireForm />
           </div>
        )}

        {/* Other tabs can be implemented similarly with placeholders for brevity */}
        {(activeTab === AdmissionTab.ADMINISTRATIF || activeTab === AdmissionTab.ENTRETIEN) && (
           <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                 <Briefcase size={40} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Contenu à venir</h3>
              <p className="text-slate-500">Cette section n'est pas encore accessible ou est en cours de développement.</p>
           </div>
        )}
      </div>
    </div>
  );
};

export default AdmissionView;