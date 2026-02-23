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
import { clearSession, decodeJwtPayload, getAuthToken } from '../services/session';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const tokenPayload = decodeJwtPayload(getAuthToken());
  const userRole = localStorage.getItem('userRole');
  const isStudentSession = tokenPayload?.role === 'student' || userRole === 'eleve';

  const [admissionOpen, setAdmissionOpen] = useState(false);
  const [commercialOpen, setCommercialOpen] = useState(false);
  const [rhOpen, setRhOpen] = useState(false);
  const [etudiantOpen, setEtudiantOpen] = useState(false);

  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith('/admission') || path.startsWith('/classe-ntc')) setAdmissionOpen(true);
    if (path.startsWith('/commercial')) setCommercialOpen(true);
    if (path.startsWith('/rh')) setRhOpen(true);
    if (path.startsWith('/etudiant')) setEtudiantOpen(true);
  }, [location.pathname]);

  const isModuleActive = (modulePrefix: string) => location.pathname.startsWith(modulePrefix);

  const canAccessRole = (role: 'commercial' | 'admission' | 'rh' | 'eleve') => {
    if (isStudentSession) return role === 'eleve';
    if (!userRole) return role !== 'eleve';
    return userRole === role;
  };

  const handleLinkClick = () => {
    if (window.innerWidth < 768 && onClose) onClose();
  };

  const handleLogout = () => {
    clearSession();
    localStorage.removeItem('userRole');
    localStorage.removeItem('adminAuthToken');
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

        {canAccessRole('admission') && (
          <div className="mb-1">
            <div
              onClick={() => setAdmissionOpen(!admissionOpen)}
              className={`flex items-center gap-[14px] px-[18px] py-[14px] rounded-xl cursor-pointer transition-all duration-200 font-medium text-[0.95rem] relative ${isModuleActive('/admission') || isModuleActive('/classe-ntc') ? 'bg-brand text-white' : 'text-slate-400 hover:bg-white/10 hover:text-white'}`}
            >
              <Briefcase size={22} className={isModuleActive('/admission') || isModuleActive('/classe-ntc') ? 'text-white' : 'text-slate-400'} />
              <span>Admissions</span>
              <ChevronDown size={18} className={`ml-auto transition-transform duration-300 ${admissionOpen ? 'rotate-180' : ''}`} />
            </div>

            <div className={`overflow-hidden transition-all duration-300 bg-black/15 rounded-b-xl mt-[-4px] ${admissionOpen ? 'max-h-[400px]' : 'max-h-0'}`}>
              <NavLink to="/admission" onClick={handleLinkClick} className={({ isActive }) => `nav-subitem ${isActive ? 'active' : ''}`}>
                <div className="w-[18px] h-[18px] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-current opacity-70"></div>
                </div>
                <span>Tableau de bord</span>
              </NavLink>
              <NavLink to="/classe-ntc" onClick={handleLinkClick} className={({ isActive }) => `nav-subitem ${isActive ? 'active' : ''}`}>
                <div className="w-[18px] h-[18px] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-current opacity-70"></div>
                </div>
                <span>Classe NTC</span>
              </NavLink>
            </div>
          </div>
        )}

        {canAccessRole('commercial') && (
          <div className="mb-1">
            <div
              onClick={() => setCommercialOpen(!commercialOpen)}
              className={`flex items-center gap-[14px] px-[18px] py-[14px] rounded-xl cursor-pointer transition-all duration-200 font-medium text-[0.95rem] relative ${isModuleActive('/commercial') ? 'bg-brand text-white' : 'text-slate-400 hover:bg-white/10 hover:text-white'}`}
            >
              <LayoutDashboard size={22} className={isModuleActive('/commercial') ? 'text-white' : 'text-slate-400'} />
              <span>Commercial</span>
              <ChevronDown size={18} className={`ml-auto transition-transform duration-300 ${commercialOpen ? 'rotate-180' : ''}`} />
            </div>

            <div className={`overflow-hidden transition-all duration-300 bg-black/15 rounded-b-xl mt-[-4px] ${commercialOpen ? 'max-h-[300px]' : 'max-h-0'}`}>
              <NavLink to="/commercial/dashboard" onClick={handleLinkClick} className={({ isActive }) => `nav-subitem ${isActive ? 'active' : ''}`}>
                <div className="w-[18px] h-[18px] flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-current opacity-70"></div></div>
                <span>Tableau de bord</span>
              </NavLink>
              <NavLink to="/commercial/placer" onClick={handleLinkClick} className={({ isActive }) => `nav-subitem ${isActive ? 'active' : ''}`}>
                <div className="w-[18px] h-[18px] flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-current opacity-70"></div></div>
                <span>Eleves a placer</span>
              </NavLink>
              <NavLink to="/commercial/alternance" onClick={handleLinkClick} className={({ isActive }) => `nav-subitem ${isActive ? 'active' : ''}`}>
                <div className="w-[18px] h-[18px] flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-current opacity-70"></div></div>
                <span>Eleves en alternance</span>
              </NavLink>
            </div>
          </div>
        )}

        {canAccessRole('rh') && (
          <div className="mb-1">
            <div
              onClick={() => setRhOpen(!rhOpen)}
              className={`flex items-center gap-[14px] px-[18px] py-[14px] rounded-xl cursor-pointer transition-all duration-200 font-medium text-[0.95rem] relative ${isModuleActive('/rh') ? 'bg-brand text-white' : 'text-slate-400 hover:bg-white/10 hover:text-white'}`}
            >
              <Users size={22} className={isModuleActive('/rh') ? 'text-white' : 'text-slate-400'} />
              <span>RH</span>
              <ChevronDown size={18} className={`ml-auto transition-transform duration-300 ${rhOpen ? 'rotate-180' : ''}`} />
            </div>

            <div className={`overflow-hidden transition-all duration-300 bg-black/15 rounded-b-xl mt-[-4px] ${rhOpen ? 'max-h-[300px]' : 'max-h-0'}`}>
              <NavLink to="/rh/dashboard" onClick={handleLinkClick} className={({ isActive }) => `nav-subitem ${isActive ? 'active' : ''}`}>
                <div className="w-[18px] h-[18px] flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-current opacity-70"></div></div>
                <span>Vue d'ensemble</span>
              </NavLink>
              <NavLink to="/rh/fiche" onClick={handleLinkClick} className={({ isActive }) => `nav-subitem ${isActive ? 'active' : ''}`}>
                <div className="w-[18px] h-[18px] flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-current opacity-70"></div></div>
                <span>Fiche Entreprise</span>
              </NavLink>
              <NavLink to="/rh/cerfa" onClick={handleLinkClick} className={({ isActive }) => `nav-subitem ${isActive ? 'active' : ''}`}>
                <div className="w-[18px] h-[18px] flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-current opacity-70"></div></div>
                <span>CERFA</span>
              </NavLink>
              <NavLink to="/rh/pec" onClick={handleLinkClick} className={({ isActive }) => `nav-subitem ${isActive ? 'active' : ''}`}>
                <div className="w-[18px] h-[18px] flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-current opacity-70"></div></div>
                <span>Prises en charge</span>
              </NavLink>
              <NavLink to="/rh/ruptures" onClick={handleLinkClick} className={({ isActive }) => `nav-subitem ${isActive ? 'active' : ''}`}>
                <div className="w-[18px] h-[18px] flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-current opacity-70"></div></div>
                <span>Ruptures</span>
              </NavLink>
            </div>
          </div>
        )}

        {canAccessRole('eleve') && (
          <div className="mb-1">
            <div
              onClick={() => setEtudiantOpen(!etudiantOpen)}
              className={`flex items-center gap-[14px] px-[18px] py-[14px] rounded-xl cursor-pointer transition-all duration-200 font-medium text-[0.95rem] ${isModuleActive('/etudiant') ? 'bg-white/10 text-white' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}
            >
              <BookOpen size={22} />
              <span>Etudiant</span>
              <ChevronDown size={18} className={`ml-auto transition-transform ${etudiantOpen ? 'rotate-180' : ''}`} />
            </div>

            <div className={`overflow-hidden transition-all duration-300 ${etudiantOpen ? 'max-h-[600px]' : 'max-h-0'}`}>
              <NavLink to="/etudiant/dashboard" onClick={handleLinkClick} className={({ isActive }) => `nav-subitem ${isActive ? 'active bg-blue-600 text-white' : ''}`}>
                <LayoutDashboard size={17} />
                <span>Tableau de bord</span>
              </NavLink>
              <NavLink to="/etudiant/planning" onClick={handleLinkClick} className={({ isActive }) => `nav-subitem ${isActive ? 'active bg-blue-600 text-white' : ''}`}>
                <Calendar size={17} />
                <span>Planning</span>
              </NavLink>
              <NavLink to="/etudiant/notes" onClick={handleLinkClick} className={({ isActive }) => `nav-subitem ${isActive ? 'active bg-blue-600 text-white' : ''}`}>
                <ClipboardList size={17} />
                <span>Notes</span>
              </NavLink>
              <NavLink to="/etudiant/presences" onClick={handleLinkClick} className={({ isActive }) => `nav-subitem ${isActive ? 'active bg-blue-600 text-white' : ''}`}>
                <CheckCircle size={17} />
                <span>Presences</span>
              </NavLink>
              <NavLink to="/etudiant/rdv" onClick={handleLinkClick} className={({ isActive }) => `nav-subitem ${isActive ? 'active bg-blue-600 text-white' : ''}`}>
                <Video size={17} />
                <span>RDV Pedagogie</span>
              </NavLink>
              <NavLink to="/etudiant/documents" onClick={handleLinkClick} className={({ isActive }) => `nav-subitem ${isActive ? 'active bg-blue-600 text-white' : ''}`}>
                <FileText size={17} />
                <span>Documents</span>
              </NavLink>
              <NavLink to="/etudiant/questionnaires" onClick={handleLinkClick} className={({ isActive }) => `nav-subitem ${isActive ? 'active bg-blue-600 text-white' : ''}`}>
                <HelpCircle size={17} />
                <span>Questionnaires</span>
              </NavLink>
            </div>
          </div>
        )}

        {!isStudentSession && !userRole && (
          <NavLink
            to="/parametres"
            onClick={handleLinkClick}
            className={({ isActive }) => `flex items-center gap-[14px] px-[18px] py-[14px] rounded-xl cursor-pointer transition-all duration-200 font-medium text-[0.95rem] mb-1 ${isActive ? 'bg-brand text-white' : 'text-slate-400 hover:bg-white/10 hover:text-white'}`}
          >
            {({ isActive }) => (
              <>
                <Settings size={22} className={isActive ? 'text-white' : 'text-slate-400'} />
                <span>Parametres</span>
              </>
            )}
          </NavLink>
        )}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700/50">
        <button
          onClick={handleLogout}
          className="flex items-center gap-[14px] px-[18px] py-[14px] rounded-xl w-full hover:bg-rose-500/10 hover:text-rose-400 text-slate-400"
        >
          <LogOut size={22} />
          <span>Deconnexion</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
