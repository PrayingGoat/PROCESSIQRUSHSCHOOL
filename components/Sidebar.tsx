import React, { useState } from 'react';
import { 
  Users, 
  BookOpen, 
  Briefcase, 
  LayoutDashboard, 
  CheckSquare, 
  Mail, 
  PieChart, 
  Settings, 
  LogOut,
  ChevronDown,
  FileText,
  UserMinus,
  Euro
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  activeItem: string;
  setActiveItem: (item: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, activeItem, setActiveItem }) => {
  const [rhSubmenuOpen, setRhSubmenuOpen] = useState(false);

  const toggleRhSubmenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRhSubmenuOpen(!rhSubmenuOpen);
    setActiveItem('rh');
  };

  return (
    <aside className={`fixed top-0 left-0 h-full w-[260px] bg-sidebar text-slate-200 flex flex-col z-50 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="relative w-10 h-10">
          <span className="absolute w-3 h-3 rounded-full bg-pink-500 top-0 left-2"></span>
          <span className="absolute w-3 h-3 rounded-full bg-orange-500 top-2 left-5"></span>
          <span className="absolute w-3 h-3 rounded-full bg-cyan-500 top-5 left-6"></span>
          <span className="absolute w-3 h-3 rounded-full bg-emerald-500 top-7 left-3"></span>
          <span className="absolute w-3 h-3 rounded-full bg-purple-500 top-4 left-1"></span>
        </div>
        <span className="text-2xl font-bold text-white tracking-tight">Process<span className="text-blue-500">IQ</span></span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
        {/* Admissions */}
        <div
          onClick={() => setActiveItem('admission')}
          className={`flex items-center gap-3 px-4 py-3.5 rounded-xl cursor-pointer transition-all duration-200 font-medium text-[0.95rem] ${
            activeItem === 'admission' 
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
              : 'text-slate-400 hover:bg-white/10 hover:text-white'
          }`}
        >
          <Briefcase size={20} />
          <span>Admissions</span>
        </div>

        {/* Commercial */}
        <div
          onClick={() => setActiveItem('dashboard')}
          className={`flex items-center gap-3 px-4 py-3.5 rounded-xl cursor-pointer transition-all duration-200 font-medium text-[0.95rem] ${
            activeItem === 'dashboard' 
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
              : 'text-slate-400 hover:bg-white/10 hover:text-white'
          }`}
        >
          <LayoutDashboard size={20} />
          <span>Commercial</span>
        </div>

        {/* RH Group */}
        <div className={`rounded-xl transition-colors ${rhSubmenuOpen ? 'bg-white/5' : ''}`}>
          <div
            onClick={toggleRhSubmenu}
            className={`flex items-center justify-between px-4 py-3.5 rounded-xl cursor-pointer transition-all duration-200 font-medium text-[0.95rem] ${
              activeItem === 'rh' && !rhSubmenuOpen
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                : 'text-slate-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Users size={20} />
              <span>RH</span>
            </div>
            <ChevronDown size={16} className={`transition-transform duration-300 ${rhSubmenuOpen ? 'rotate-180' : ''}`} />
          </div>
          
          {/* RH Submenu */}
          <div className={`overflow-hidden transition-all duration-300 ${rhSubmenuOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="pl-4 pr-2 py-1 space-y-1">
              <div onClick={() => setActiveItem('rh-fiche')} className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer pl-10">
                <BookOpen size={16} />
                <span>Fiche Entreprise</span>
              </div>
              <div onClick={() => setActiveItem('rh-cerfa')} className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer pl-10">
                <FileText size={16} />
                <span>CERFA</span>
              </div>
              <div onClick={() => setActiveItem('rh-pec')} className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer pl-10">
                <Euro size={16} />
                <span>Prises en charge</span>
              </div>
              <div onClick={() => setActiveItem('rh-ruptures')} className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer pl-10">
                <UserMinus size={16} />
                <span>Ruptures</span>
              </div>
            </div>
          </div>
        </div>

        {/* Étudiant */}
        <div
          onClick={() => setActiveItem('etudiant')}
          className={`flex items-center gap-3 px-4 py-3.5 rounded-xl cursor-pointer transition-all duration-200 font-medium text-[0.95rem] ${
            activeItem === 'etudiant' 
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
              : 'text-slate-400 hover:bg-white/10 hover:text-white'
          }`}
        >
          <BookOpen size={20} />
          <span>Étudiant</span>
        </div>

        {/* Paramètres */}
        <div
          onClick={() => setActiveItem('parametres')}
          className={`flex items-center gap-3 px-4 py-3.5 rounded-xl cursor-pointer transition-all duration-200 font-medium text-[0.95rem] ${
            activeItem === 'parametres' 
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
              : 'text-slate-400 hover:bg-white/10 hover:text-white'
          }`}
        >
          <Settings size={20} />
          <span>Paramètres</span>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <button className="flex items-center gap-3 px-4 py-3.5 w-full rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-300 transition-colors">
          <LogOut size={20} />
          <span className="font-medium">Déconnexion</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;