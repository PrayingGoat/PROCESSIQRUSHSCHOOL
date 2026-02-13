import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Users,
  Briefcase,
  LayoutDashboard,
  Settings,
  LogOut,
  ChevronDown,
  BookOpen,
  Calendar,
  ClipboardList,
  CheckCircle,
  FileText,
  HelpCircle,
  Video
} from 'lucide-react';
import { clearSession } from '../services/session';

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
  const [etudiantOpen, setEtudiantOpen] = useState(false);

  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith('/admission')) setAdmissionOpen(true);
    if (path.startsWith('/commercial')) setCommercialOpen(true);
    if (path.startsWith('/rh')) setRhOpen(true);
    if (path.startsWith('/etudiant')) setEtudiantOpen(true);
  }, [location.pathname]);

  const isModuleActive = (modulePrefix: string) => location.pathname.startsWith(modulePrefix);

  const handleLinkClick = () => {
    if (window.innerWidth < 768 && onClose) onClose();
  };

  const handleLogout = () => {
    clearSession();
    navigate('/login');
    if (onClose) onClose();
  };

  return (
    <aside className={`fixed top-0 left-0 h-full w-[260px] bg-sidebar text-slate-200 flex flex-col z-50 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>

      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <img src="/images/logo-process-iq.png" alt="Process IQ" className="h-8 w-auto brightness-0 invert" />
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-1">

        {/* Admissions */}
        <div className="mb-1">
          <div
            onClick={() => setAdmissionOpen(!admissionOpen)}
            className={`flex items-center gap-[14px] px-[18px] py-[14px] rounded-xl cursor-pointer transition-all duration-200 font-medium text-[0.95rem] ${isModuleActive('/admission') ? 'bg-brand text-white' : 'text-slate-400 hover:bg-white/10 hover:text-white'}`}
          >
            <Briefcase size={22} />
            <span>Admissions</span>
            <ChevronDown size={18} className={`ml-auto transition-transform ${admissionOpen ? 'rotate-180' : ''}`} />
          </div>
        </div>

        {/* Commercial */}
        <div className="mb-1">
          <div
            onClick={() => setCommercialOpen(!commercialOpen)}
            className={`flex items-center gap-[14px] px-[18px] py-[14px] rounded-xl cursor-pointer transition-all duration-200 font-medium text-[0.95rem] ${isModuleActive('/commercial') ? 'bg-brand text-white' : 'text-slate-400 hover:bg-white/10 hover:text-white'}`}
          >
            <LayoutDashboard size={22} />
            <span>Commercial</span>
            <ChevronDown size={18} className={`ml-auto transition-transform ${commercialOpen ? 'rotate-180' : ''}`} />
          </div>
        </div>

        {/* RH */}
        <div className="mb-1">
          <div
            onClick={() => setRhOpen(!rhOpen)}
            className={`flex items-center gap-[14px] px-[18px] py-[14px] rounded-xl cursor-pointer transition-all duration-200 font-medium text-[0.95rem] ${isModuleActive('/rh') ? 'bg-brand text-white' : 'text-slate-400 hover:bg-white/10 hover:text-white'}`}
          >
            <Users size={22} />
            <span>RH</span>
            <ChevronDown size={18} className={`ml-auto transition-transform ${rhOpen ? 'rotate-180' : ''}`} />
          </div>
        </div>

        {/* ================= ETUDIANT ================= */}
        <div className="mb-1">
          <div
            onClick={() => setEtudiantOpen(!etudiantOpen)}
            className={`flex items-center gap-[14px] px-[18px] py-[14px] rounded-xl cursor-pointer transition-all duration-200 font-medium text-[0.95rem] ${
              isModuleActive('/etudiant')
                ? 'bg-white/10 text-white'
                : 'text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <BookOpen size={22} />
            <span>Étudiant</span>
            <ChevronDown size={18} className={`ml-auto transition-transform ${etudiantOpen ? 'rotate-180' : ''}`} />
          </div>

          {/* Sous menu étudiant */}
          <div className={`overflow-hidden transition-all duration-300 ${etudiantOpen ? 'max-h-[600px]' : 'max-h-0'}`}>

            <NavLink to="/etudiant/dashboard" onClick={handleLinkClick} className={({ isActive }) => `nav-subitem ${isActive ? 'active bg-blue-600 text-white' : ''}`}>
              <LayoutDashboard size={17}/>
              <span>Tableau de bord</span>
            </NavLink>

            <NavLink to="/etudiant/planning" onClick={handleLinkClick} className={({ isActive }) => `nav-subitem ${isActive ? 'active bg-blue-600 text-white' : ''}`}>
              <Calendar size={17}/>
              <span>Planning</span>
            </NavLink>

            <NavLink to="/etudiant/notes" onClick={handleLinkClick} className={({ isActive }) => `nav-subitem ${isActive ? 'active bg-blue-600 text-white' : ''}`}>
              <ClipboardList size={17}/>
              <span>Notes</span>
            </NavLink>

            <NavLink to="/etudiant/presences" onClick={handleLinkClick} className={({ isActive }) => `nav-subitem ${isActive ? 'active bg-blue-600 text-white' : ''}`}>
              <CheckCircle size={17}/>
              <span>Présences</span>
            </NavLink>

            <NavLink to="/etudiant/rdv" onClick={handleLinkClick} className={({ isActive }) => `nav-subitem ${isActive ? 'active bg-blue-600 text-white' : ''}`}>
              <Video size={17}/>
              <span>RDV Pédagogie</span>
            </NavLink>

            <NavLink to="/etudiant/documents" onClick={handleLinkClick} className={({ isActive }) => `nav-subitem ${isActive ? 'active bg-blue-600 text-white' : ''}`}>
              <FileText size={17}/>
              <span>Documents</span>
            </NavLink>

            <NavLink to="/etudiant/questionnaires" onClick={handleLinkClick} className={({ isActive }) => `nav-subitem ${isActive ? 'active bg-blue-600 text-white' : ''}`}>
              <HelpCircle size={17}/>
              <span>Questionnaires</span>
            </NavLink>

          </div>
        </div>
        {/* ============================================ */}

        {/* Paramètres */}
        <NavLink to="/parametres" onClick={handleLinkClick}
          className={({ isActive }) => `flex items-center gap-[14px] px-[18px] py-[14px] rounded-xl font-medium text-[0.95rem] ${isActive ? 'bg-brand text-white' : 'text-slate-400 hover:bg-white/10 hover:text-white'}`}>
          <Settings size={22}/>
          <span>Paramètres</span>
        </NavLink>

      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700/50">
        <button
          onClick={handleLogout}
          className="flex items-center gap-[14px] px-[18px] py-[14px] rounded-xl w-full hover:bg-rose-500/10 hover:text-rose-400 text-slate-400"
        >
          <LogOut size={22}/>
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
