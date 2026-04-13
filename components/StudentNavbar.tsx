import React, { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard, Calendar, FileText, CheckCircle,
  Users, FolderOpen, ClipboardCheck, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

interface StudentNavbarProps {
  activeTab?: string;
}

const StudentNavbar: React.FC<StudentNavbarProps> = ({
  activeTab = 'dashboard'
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentTab, setCurrentTab] = useState<string>(activeTab);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const tabs: Tab[] = [
    { id: 'dashboard', label: 'Tableau de bord', icon: <LayoutDashboard size={16} />, path: '/etudiant/dashboard' },
    { id: 'planning', label: 'Planning', icon: <Calendar size={16} />, path: '/etudiant/planning' },
    { id: 'notes', label: 'Notes', icon: <FileText size={16} />, path: '/etudiant/notes' },
    { id: 'presences', label: 'Presences', icon: <CheckCircle size={16} />, path: '/etudiant/presences' },
    { id: 'rdv', label: 'Suivi pedagogique', icon: <Users size={16} />, path: '/etudiant/rdv' },
    { id: 'documents', label: 'Documents', icon: <FolderOpen size={16} />, path: '/etudiant/documents' },
    { id: 'questionnaires', label: 'Questionnaires', icon: <ClipboardCheck size={16} />, path: '/etudiant/questionnaires' }
  ];

  useEffect(() => {
    const path = location.pathname;
    const tab = tabs.find(t => path.includes(t.id)) || tabs[0];
    setCurrentTab(tab.id);
  }, [location.pathname]);

  useEffect(() => {
    checkScrollButtons();
    window.addEventListener('resize', checkScrollButtons);
    return () => window.removeEventListener('resize', checkScrollButtons);
  }, []);

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scrollBy = (offset: number) => {
    scrollContainerRef.current?.scrollBy({ left: offset, behavior: 'smooth' });
  };

  const handleTabClick = (tabId: string, path: string) => {
    setCurrentTab(tabId);
    navigate(path);
  };

  return (
    <div className="relative">
      {canScrollLeft && (
        <button
          onClick={() => scrollBy(-200)}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 bg-white/90 backdrop-blur border border-slate-200 rounded-full shadow-sm flex items-center justify-center hover:bg-white transition-colors"
        >
          <ChevronLeft size={14} className="text-slate-500" />
        </button>
      )}

      {canScrollRight && (
        <button
          onClick={() => scrollBy(200)}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 bg-white/90 backdrop-blur border border-slate-200 rounded-full shadow-sm flex items-center justify-center hover:bg-white transition-colors"
        >
          <ChevronRight size={14} className="text-slate-500" />
        </button>
      )}

      <div
        ref={scrollContainerRef}
        onScroll={checkScrollButtons}
        className="flex overflow-x-auto gap-1 border-b border-slate-200 pb-px scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id, tab.path)}
              className={`
                flex items-center gap-2 px-4 py-2.5 text-[0.82rem] font-medium whitespace-nowrap flex-shrink-0
                border-b-2 transition-all duration-200
                ${isActive
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }
              `}
            >
              <span className={isActive ? 'text-indigo-500' : 'text-slate-400'}>{tab.icon}</span>
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default StudentNavbar;
