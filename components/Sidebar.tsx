import React, { useState } from 'react';
import { 
  Users, 
  Briefcase, 
  LayoutDashboard, 
  Settings, 
  LogOut,
  ChevronDown,
  BookOpen,
  PieChart
} from 'lucide-react';
import { ViewId } from '../types';

interface SidebarProps {
  isOpen: boolean;
  activeView: ViewId;
  setActiveView: (view: ViewId) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, activeView, setActiveView }) => {
  const [admissionOpen, setAdmissionOpen] = useState(true);
  const [commercialOpen, setCommercialOpen] = useState(true);
  const [rhOpen, setRhOpen] = useState(true);

  // Helper to check active state
  const isActive = (view: ViewId) => activeView === view;
  const isModuleActive = (modulePrefix: string) => activeView.startsWith(modulePrefix);

  return (
    <aside className={`fixed top-0 left-0 h-full w-[260px] bg-[#0f172a] text-[#94a3b8] flex flex-col z-50 transition-transform duration-300 border-r border-slate-800 ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
      
      {/* Logo */}
      <div className="h-[70px] flex items-center px-6 border-b border-slate-800/50">
        <div className="flex items-center gap-3">
            <div className="logo-dots scale-75 origin-left">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            </div>
            <span className="text-xl font-bold text-white tracking-tight">Process<span className="text-blue-500">IQ</span></span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2 no-scrollbar">
        
        {/* Admissions Group */}
        <div className="mb-2">
            <div
                onClick={() => setAdmissionOpen(!admissionOpen)}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 font-medium text-sm select-none ${
                    isModuleActive('admission') ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' : 'hover:bg-slate-800/50 hover:text-slate-200'
                }`}
            >
                <Briefcase size={20} className={isModuleActive('admission') ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'} />
                <span>Admissions</span>
                <ChevronDown size={16} className={`ml-auto transition-transform duration-300 ${admissionOpen ? 'rotate-180' : ''} ${isModuleActive('admission') ? 'text-indigo-200' : 'text-slate-600'}`} />
            </div>
            
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${admissionOpen ? 'max-h-[200px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="mt-1 ml-4 pl-4 border-l-2 border-slate-700/50 space-y-1">
                    <div onClick={() => setActiveView('admission-main')} className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer text-sm transition-colors ${activeView === 'admission-main' ? 'text-blue-400 bg-blue-500/10' : 'hover:text-slate-200'}`}>
                        <span>Vue d'ensemble</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Commercial Group */}
        <div className="mb-2">
            <div
                onClick={() => setCommercialOpen(!commercialOpen)}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 font-medium text-sm select-none ${
                    isModuleActive('commercial') ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' : 'hover:bg-slate-800/50 hover:text-slate-200'
                }`}
            >
                <LayoutDashboard size={20} className={isModuleActive('commercial') ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'} />
                <span>Commercial</span>
                <ChevronDown size={16} className={`ml-auto transition-transform duration-300 ${commercialOpen ? 'rotate-180' : ''} ${isModuleActive('commercial') ? 'text-indigo-200' : 'text-slate-600'}`} />
            </div>
            
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${commercialOpen ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="mt-1 ml-4 pl-4 border-l-2 border-slate-700/50 space-y-1">
                    <div onClick={() => setActiveView('commercial-dashboard')} className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer text-sm transition-colors ${isActive('commercial-dashboard') ? 'text-blue-400 bg-blue-500/10' : 'hover:text-slate-200'}`}>
                        <span>Tableau de bord</span>
                    </div>
                    <div onClick={() => setActiveView('commercial-placer')} className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer text-sm transition-colors ${isActive('commercial-placer') ? 'text-blue-400 bg-blue-500/10' : 'hover:text-slate-200'}`}>
                        <span>Élèves à placer</span>
                    </div>
                    <div onClick={() => setActiveView('commercial-alternance')} className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer text-sm transition-colors ${isActive('commercial-alternance') ? 'text-blue-400 bg-blue-500/10' : 'hover:text-slate-200'}`}>
                        <span>Alternance</span>
                    </div>
                </div>
            </div>
        </div>

        {/* RH Group */}
        <div className="mb-2">
            <div
                onClick={() => setRhOpen(!rhOpen)}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 font-medium text-sm select-none ${
                    isModuleActive('rh') ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' : 'hover:bg-slate-800/50 hover:text-slate-200'
                }`}
            >
                <Users size={20} className={isModuleActive('rh') ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'} />
                <span>Ressources Humaines</span>
                <ChevronDown size={16} className={`ml-auto transition-transform duration-300 ${rhOpen ? 'rotate-180' : ''} ${isModuleActive('rh') ? 'text-indigo-200' : 'text-slate-600'}`} />
            </div>
            
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${rhOpen ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="mt-1 ml-4 pl-4 border-l-2 border-slate-700/50 space-y-1">
                    <div onClick={() => setActiveView('rh-dashboard')} className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer text-sm transition-colors ${isActive('rh-dashboard') ? 'text-blue-400 bg-blue-500/10' : 'hover:text-slate-200'}`}>
                        <span>Vue d'ensemble</span>
                    </div>
                    <div onClick={() => setActiveView('rh-fiche')} className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer text-sm transition-colors ${isActive('rh-fiche') ? 'text-blue-400 bg-blue-500/10' : 'hover:text-slate-200'}`}>
                        <span>Fiche Entreprise</span>
                    </div>
                    <div onClick={() => setActiveView('rh-cerfa')} className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer text-sm transition-colors ${isActive('rh-cerfa') ? 'text-blue-400 bg-blue-500/10' : 'hover:text-slate-200'}`}>
                        <span>CERFA</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Étudiant */}
        <div
          onClick={() => setActiveView('etudiant')}
          className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 font-medium text-sm select-none mt-4 ${
            isActive('etudiant') 
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' 
              : 'hover:bg-slate-800/50 hover:text-slate-200'
          }`}
        >
          <BookOpen size={20} className={isActive('etudiant') ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'} />
          <span>Espace Étudiant</span>
        </div>

        {/* Paramètres */}
        <div
          onClick={() => setActiveView('parametres')}
          className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 font-medium text-sm select-none ${
            isActive('parametres') 
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' 
              : 'hover:bg-slate-800/50 hover:text-slate-200'
          }`}
        >
          <Settings size={20} className={isActive('parametres') ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'} />
          <span>Paramètres</span>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800/50">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors">
          <LogOut size={20} />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;