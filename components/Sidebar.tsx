import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Users,
  Briefcase,
  LayoutDashboard,
  Settings,
  LogOut,
  ChevronDown,
  BookOpen
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [admissionOpen, setAdmissionOpen] = useState(false);
  const [commercialOpen, setCommercialOpen] = useState(false);
  const [rhOpen, setRhOpen] = useState(false);

  // Auto-expand groups based on current path
  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith('/admission')) setAdmissionOpen(true);
    if (path.startsWith('/commercial')) setCommercialOpen(true);
    if (path.startsWith('/rh')) setRhOpen(true);
  }, [location.pathname]);

  const isModuleActive = (modulePrefix: string) => location.pathname.startsWith(modulePrefix);

  const handleLinkClick = () => {
    if (window.innerWidth < 768 && onClose) {
      onClose();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
    if (onClose) onClose();
  };

  return (
    <aside className={`fixed top-0 left-0 h-full w-[260px] bg-[#0f172a] text-[#e2e8f0] flex flex-col z-50 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>

      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <img src="/images/logo-process-iq.png" alt="Process IQ" className="h-8 w-auto brightness-0 invert" />
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-1">

        {/* Admissions Group */}
        <div className="mb-1">
          <div
            onClick={() => setAdmissionOpen(!admissionOpen)}
            className={`flex items-center gap-[14px] px-[18px] py-[14px] rounded-xl cursor-pointer transition-all duration-200 font-medium text-[0.95rem] relative ${isModuleActive('/admission') ? 'bg-[#6366F1] text-white' : 'text-[#94a3b8] hover:bg-white/10 hover:text-white'
              }`}
          >
            <Briefcase size={22} className={isModuleActive('/admission') ? 'text-white' : 'text-[#94a3b8]'} />
            <span>Admissions</span>
            <ChevronDown size={18} className={`ml-auto transition-transform duration-300 ${admissionOpen ? 'rotate-180' : ''}`} />
          </div>

          <div className={`overflow-hidden transition-all duration-300 bg-black/15 rounded-b-xl mt-[-4px] ${admissionOpen ? 'max-h-[400px]' : 'max-h-0'}`}>
            <NavLink
              to="/admission"
              onClick={handleLinkClick}
              className={({ isActive }) => `nav-subitem ${isActive ? 'active' : ''}`}
            >
              <div className="w-[18px] h-[18px] flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-current opacity-70"></div>
              </div>
              <span>Tableau de bord</span>
            </NavLink>
          </div>
        </div>

        {/* Commercial Group */}
        <div className="mb-1">
          <div
            onClick={() => setCommercialOpen(!commercialOpen)}
            className={`flex items-center gap-[14px] px-[18px] py-[14px] rounded-xl cursor-pointer transition-all duration-200 font-medium text-[0.95rem] relative ${isModuleActive('/commercial') ? 'bg-[#6366F1] text-white' : 'text-[#94a3b8] hover:bg-white/10 hover:text-white'
              }`}
          >
            <LayoutDashboard size={22} className={isModuleActive('/commercial') ? 'text-white' : 'text-[#94a3b8]'} />
            <span>Commercial</span>
            <ChevronDown size={18} className={`ml-auto transition-transform duration-300 ${commercialOpen ? 'rotate-180' : ''}`} />
          </div>

          <div className={`overflow-hidden transition-all duration-300 bg-black/15 rounded-b-xl mt-[-4px] ${commercialOpen ? 'max-h-[300px]' : 'max-h-0'}`}>
            <NavLink
              to="/commercial/dashboard"
              onClick={handleLinkClick}
              className={({ isActive }) => `nav-subitem ${isActive ? 'active' : ''}`}
            >
              <div className="w-[18px] h-[18px] flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-current opacity-70"></div></div>
              <span>Tableau de bord</span>
            </NavLink>
            <NavLink
              to="/commercial/placer"
              onClick={handleLinkClick}
              className={({ isActive }) => `nav-subitem ${isActive ? 'active' : ''}`}
            >
              <div className="w-[18px] h-[18px] flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-current opacity-70"></div></div>
              <span>Élèves à placer</span>
            </NavLink>
            <NavLink
              to="/commercial/alternance"
              onClick={handleLinkClick}
              className={({ isActive }) => `nav-subitem ${isActive ? 'active' : ''}`}
            >
              <div className="w-[18px] h-[18px] flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-current opacity-70"></div></div>
              <span>Élèves en alternance</span>
            </NavLink>
          </div>
        </div>

        {/* RH Group */}
        <div className="mb-1">
          <div
            onClick={() => setRhOpen(!rhOpen)}
            className={`flex items-center gap-[14px] px-[18px] py-[14px] rounded-xl cursor-pointer transition-all duration-200 font-medium text-[0.95rem] relative ${isModuleActive('/rh') ? 'bg-[#6366F1] text-white' : 'text-[#94a3b8] hover:bg-white/10 hover:text-white'
              }`}
          >
            <Users size={22} className={isModuleActive('/rh') ? 'text-white' : 'text-[#94a3b8]'} />
            <span>RH</span>
            <ChevronDown size={18} className={`ml-auto transition-transform duration-300 ${rhOpen ? 'rotate-180' : ''}`} />
          </div>

          <div className={`overflow-hidden transition-all duration-300 bg-black/15 rounded-b-xl mt-[-4px] ${rhOpen ? 'max-h-[300px]' : 'max-h-0'}`}>
            <NavLink
              to="/rh/dashboard"
              onClick={handleLinkClick}
              className={({ isActive }) => `nav-subitem ${isActive ? 'active' : ''}`}
            >
              <div className="w-[18px] h-[18px] flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-current opacity-70"></div></div>
              <span>Vue d'ensemble</span>
            </NavLink>
            <NavLink
              to="/rh/fiche"
              onClick={handleLinkClick}
              className={({ isActive }) => `nav-subitem ${isActive ? 'active' : ''}`}
            >
              <div className="w-[18px] h-[18px] flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-current opacity-70"></div></div>
              <span>Fiche Entreprise</span>
            </NavLink>
            <NavLink
              to="/rh/cerfa"
              onClick={handleLinkClick}
              className={({ isActive }) => `nav-subitem ${isActive ? 'active' : ''}`}
            >
              <div className="w-[18px] h-[18px] flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-current opacity-70"></div></div>
              <span>CERFA</span>
            </NavLink>
            <NavLink
              to="/rh/pec"
              onClick={handleLinkClick}
              className={({ isActive }) => `nav-subitem ${isActive ? 'active' : ''}`}
            >
              <div className="w-[18px] h-[18px] flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-current opacity-70"></div></div>
              <span>Prises en charge</span>
            </NavLink>
            <NavLink
              to="/rh/ruptures"
              onClick={handleLinkClick}
              className={({ isActive }) => `nav-subitem ${isActive ? 'active' : ''}`}
            >
              <div className="w-[18px] h-[18px] flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-current opacity-70"></div></div>
              <span>Ruptures</span>
            </NavLink>
          </div>
        </div>

        {/* Étudiant */}
        <NavLink
          to="/etudiant"
          onClick={handleLinkClick}
          className={({ isActive }) => `flex items-center gap-[14px] px-[18px] py-[14px] rounded-xl cursor-pointer transition-all duration-200 font-medium text-[0.95rem] mb-1 ${isActive
            ? 'bg-[#6366F1] text-white'
            : 'text-[#94a3b8] hover:bg-white/10 hover:text-white'
            }`}
        >
          {({ isActive }) => (
            <>
              <BookOpen size={22} className={isActive ? 'text-white' : 'text-[#94a3b8]'} />
              <span>Étudiant</span>
            </>
          )}
        </NavLink>

        {/* Paramètres */}
        <NavLink
          to="/parametres"
          onClick={handleLinkClick}
          className={({ isActive }) => `flex items-center gap-[14px] px-[18px] py-[14px] rounded-xl cursor-pointer transition-all duration-200 font-medium text-[0.95rem] mb-1 ${isActive
            ? 'bg-[#6366F1] text-white'
            : 'text-[#94a3b8] hover:bg-white/10 hover:text-white'
            }`}
        >
          {({ isActive }) => (
            <>
              <Settings size={22} className={isActive ? 'text-white' : 'text-[#94a3b8]'} />
              <span>Paramètres</span>
            </>
          )}
        </NavLink>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700/50">
        <button
          onClick={handleLogout}
          className="flex items-center gap-[14px] px-[18px] py-[14px] rounded-xl cursor-pointer transition-all duration-200 font-medium text-[0.95rem] w-full hover:bg-red-500/10 hover:text-red-400 text-[#94a3b8]"
        >
          <LogOut size={22} className="nav-icon" />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;