import React from 'react';
import { 
  Users, 
  Calendar, 
  CheckCircle2, 
  Send, 
  ListTodo, 
  Database, 
  TrendingUp, 
  ArrowRight,
  Zap
} from 'lucide-react';
import { StatCardProps } from '../types';

const QuickActionCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center gap-4 cursor-pointer hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-0.5 transition-all duration-200">
    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <div className="font-semibold text-slate-800 mb-1">{title}</div>
      <div className="text-sm text-slate-400 leading-snug">{desc}</div>
    </div>
    <ArrowRight className="text-blue-500 shrink-0" size={20} />
  </div>
);

const StatCard = ({ label, value, icon, colorClass, footerText, progress }: StatCardProps) => {
  const styles = {
    blue: { bg: 'bg-gradient-to-br from-blue-50 to-blue-100', border: 'border-blue-200', text: 'text-blue-600', fill: 'bg-blue-500' },
    orange: { bg: 'bg-gradient-to-br from-amber-50 to-amber-100', border: 'border-amber-200', text: 'text-amber-600', fill: 'bg-amber-500' },
    green: { bg: 'bg-gradient-to-br from-emerald-50 to-emerald-100', border: 'border-emerald-200', text: 'text-emerald-600', fill: 'bg-emerald-500' },
    purple: { bg: 'bg-gradient-to-br from-violet-50 to-violet-100', border: 'border-violet-200', text: 'text-violet-600', fill: 'bg-violet-500' },
    cyan: { bg: 'bg-gradient-to-br from-cyan-50 to-cyan-100', border: 'border-cyan-200', text: 'text-cyan-600', fill: 'bg-cyan-500' },
  };
  
  const style = styles[colorClass];

  return (
    <div className={`${style.bg} border ${style.border} rounded-2xl p-6 relative`}>
      <div className="flex justify-between items-start mb-1">
        <div className={`w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center ${style.text}`}>
          {icon}
        </div>
        <div className={`text-4xl font-bold leading-none ${style.text}`}>{value}</div>
      </div>
      <div className={`text-sm font-medium text-right mb-4 ${style.text}`}>{label}</div>
      
      {progress !== undefined ? (
        <div className="h-2.5 bg-white/60 rounded-full overflow-hidden mt-2">
          <div className={`h-full rounded-full transition-all duration-500 ${style.fill}`} style={{ width: `${progress}%` }}></div>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 text-sm text-slate-500/80">
           {footerText}
        </div>
      )}
    </div>
  );
};

const DashboardView = () => {
  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 mb-4 tracking-tight">RUSH SCHOOL</h1>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-slate-400" />
              <span>1 membre</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-slate-400" />
              <span>Créé 29 déc. 2025 16:24</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3.5">
          <div className="text-right hidden md:block">
            <div className="text-xs text-slate-400 mb-0.5">Créé par</div>
            <div className="font-semibold text-slate-800 text-sm">Arsène POPHILLAT</div>
            <div className="text-xs text-slate-400 flex items-center justify-end gap-1">
               email@protected.com
            </div>
          </div>
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold shadow-lg shadow-blue-500/20">
            AP
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <div className="flex items-center gap-2.5 mb-5">
          <Zap className="text-amber-500" size={22} />
          <h2 className="text-lg font-bold text-slate-800">Actions Rapides</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <QuickActionCard 
            icon={<Zap size={24} />} 
            title="Connecter une Intégration" 
            desc="Liez des intégrations externes à votre projet" 
          />
          <QuickActionCard 
            icon={<ListTodo size={24} />} 
            title="Créer une Tâche" 
            desc="Automatisez les importations et les workflows" 
          />
          <QuickActionCard 
            icon={<Database size={24} />} 
            title="Voir les Données" 
            desc="Parcourez et analysez vos données importées" 
          />
        </div>
      </div>

      {/* Stats */}
      <div className="mb-8">
        <div className="flex items-center gap-2.5 mb-5">
          <TrendingUp className="text-blue-500" size={22} />
          <h2 className="text-lg font-bold text-slate-800">Statistiques Commerciales</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          <StatCard 
            label="Total Entreprises" 
            value="100" 
            icon={<Briefcase size={24} />} 
            colorClass="blue"
            footerText="+100 cette semaine"
          />
          <StatCard 
            label="Relances Programmées" 
            value="0" 
            icon={<Calendar size={24} />} 
            colorClass="orange"
            footerText="Contacts en attente"
          />
          <StatCard 
            label="Entreprises OK" 
            value="100" 
            icon={<CheckCircle2 size={24} />} 
            colorClass="green"
            footerText="100% taux de conversion"
          />
          <StatCard 
            label="Emails Envoyés" 
            value="0" 
            icon={<Send size={24} />} 
            colorClass="purple"
            footerText="Via automation"
          />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mt-5">
          <StatCard 
            label="Nombre total de tâches" 
            value="1" 
            icon={<ListTodo size={24} />} 
            colorClass="blue"
            footerText="1 activée"
          />
          <StatCard 
            label="Taux de Réussite" 
            value="50%" 
            icon={<CheckCircle2 size={24} />} 
            colorClass="green"
            progress={50}
          />
          <StatCard 
            label="Intégrations" 
            value="1" 
            icon={<Zap size={24} />} 
            colorClass="purple"
            footerText="0 actif"
          />
          <StatCard 
            label="Sources de Données" 
            value="1" 
            icon={<Database size={24} />} 
            colorClass="cyan"
            footerText="Connecté"
          />
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <div className="flex items-center gap-3 text-lg font-bold text-slate-800">
            <Zap className="text-amber-500" size={22} />
            Tâches Récemment Exécutées
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:border-blue-500 hover:text-blue-600 transition-colors bg-white">
            Tout Voir
            <ArrowRight size={14} />
          </button>
        </div>
        <div className="p-0">
          <div className="flex items-center p-5 border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer">
            <div className="w-11 h-11 rounded-xl bg-slate-50 flex items-center justify-center mr-4 text-slate-400">
              <Database size={20} />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-slate-800 mb-1">CARREFOUR</div>
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 text-xs font-medium">importData</span>
                <span>⏱ Dernière exécution: 13 janv. 2026 09:00</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-xs font-medium border border-emerald-100">
              <CheckCircle2 size={12} />
              Succès
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;

function Briefcase(props: any) {
  return (
    <svg 
      {...props}
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  )
}