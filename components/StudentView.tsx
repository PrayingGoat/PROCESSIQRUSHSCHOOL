import React from 'react';
import { GraduationCap } from 'lucide-react';

const StudentView = () => {
  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Espace Étudiant</h1>
        <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold">
          Suivi et informations
        </div>
      </div>

      <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-20 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-300">
          <GraduationCap size={40} />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Espace Étudiant</h3>
        <p className="text-slate-500">Les informations étudiantes seront disponibles ici prochainement.</p>
      </div>
    </div>
  );
};

export default StudentView;