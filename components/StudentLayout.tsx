import React, { useRef, useEffect } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import StudentNavbar from './StudentNavbar';

const TAB_ORDER = [
  'dashboard',
  'planning',
  'notes',
  'presences',
  'rdv',
  'documents',
  'questionnaires'
];

function getTabIndex(pathname: string): number {
  const segment = pathname.split('/').pop() || 'dashboard';
  const idx = TAB_ORDER.indexOf(segment);
  return idx >= 0 ? idx : 0;
}

const StudentLayout: React.FC = () => {
  const location = useLocation();
  const outlet = useOutlet();
  const prevIndex = useRef(getTabIndex(location.pathname));
  const currentIndex = getTabIndex(location.pathname);

  const direction = currentIndex >= prevIndex.current ? 1 : -1;

  useEffect(() => {
    prevIndex.current = currentIndex;
  }, [currentIndex]);

  return (
    <div className="space-y-6">
      {/* Hero — always visible */}
      <StudentHero />

      {/* Navigation tabs */}
      <StudentNavbar />

      {/* Animated page content */}
      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            initial={{ x: direction * 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction * -60, opacity: 0 }}
            transition={{
              x: { type: 'spring', stiffness: 400, damping: 35 },
              opacity: { duration: 0.15 }
            }}
          >
            {outlet}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

/* ── Extracted Hero block (shared across all student pages) ── */
import {
  Check, TrendingUp, GraduationCap
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { api } from '../services/api';

const formationLabel = (value?: string): string => {
  const map: Record<string, string> = {
    bts_mco: 'BTS MCO', bts_ndrc: 'BTS NDRC',
    bachelor_rdc: 'BACHELOR RDC', tp_ntc: 'TP NTC'
  };
  return map[value || ''] || '';
};

const StudentHero: React.FC = () => {
  const [student, setStudent] = useState<any>(null);

  useEffect(() => {
    (async () => {
      try {
        const s = await api.getCurrentStudent();
        setStudent(s);
      } catch { /* silent */ }
    })();
  }, []);

  const fullName = useMemo(() => {
    if (!student) return '';
    const first = student.firstName || student.prenom || '';
    const last = student.lastName || student.nom || student.nom_usage || student.nom_naissance || '';
    return `${first} ${last}`.trim();
  }, [student]);

  const formation = formationLabel(student?.formation);

  return (
    <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-indigo-950 rounded-[20px] p-8 relative overflow-hidden">
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl" />
      <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-semibold">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              En ligne
            </span>
            {formation && (
              <span className="px-3 py-1 bg-white/10 text-white/70 rounded-full text-xs font-medium">
                {formation}
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">
            {fullName || 'Espace Etudiant'}
          </h1>
          <p className="text-slate-400 text-sm">Promotion 2026 - Rush School</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl px-5 py-3 text-center min-w-[100px]">
            <GraduationCap size={18} className="text-indigo-400 mx-auto mb-1" />
            <div className="text-[0.7rem] text-slate-400 uppercase tracking-wide">Espace etudiant</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentLayout;
