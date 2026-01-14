import React from 'react';
import { 
  Users, 
  BookOpen, 
  Briefcase, 
  LayoutDashboard, 
  CheckSquare, 
  Mail, 
  PieChart, 
  Settings, 
  LogOut 
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  activeItem: string;
  setActiveItem: (item: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, activeItem, setActiveItem }) => {
  const navItems = [
    { id: 'utilisateurs', label: 'Utilisateurs', icon: <Users size={20} /> },
    { id: 'annuaire', label: 'Annuaire Entreprise', icon: <BookOpen size={20} /> },
    { id: 'projets', label: 'Projets', icon: <Briefcase size={20} /> },
    { id: 'dashboard', label: 'Tableau de bord', icon: <LayoutDashboard size={20} /> },
    { id: 'taches', label: 'Tâches', icon: <CheckSquare size={20} /> },
    { id: 'emails', label: 'Modèles d\'e-mail', icon: <Mail size={20} /> },
    { id: 'visualisations', label: 'Visualisations', icon: <PieChart size={20} /> },
    { id: 'parametres', label: 'Paramètres', icon: <Settings size={20} /> },
  ];

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
        <span className="text-xl font-bold text-white">Process<span className="text-blue-500">IQ</span></span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
        {navItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveItem(item.id)}
            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl cursor-pointer transition-all duration-200 font-medium text-[0.95rem] ${
              activeItem === item.id 
                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' 
                : 'text-slate-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            <span className={`${activeItem === item.id ? 'text-white' : 'text-slate-400'}`}>
              {item.icon}
            </span>
            <span>{item.label}</span>
          </div>
        ))}
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