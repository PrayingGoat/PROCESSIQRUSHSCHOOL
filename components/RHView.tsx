import React, { useState } from 'react';
import { RHTab, StatCardProps } from '../types';
import { 
  FileText, 
  Euro, 
  UserMinus, 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Download, 
  Edit,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const RHStatCard = ({ value, label, icon, colorClass }: { value: string, label: string, icon: React.ReactNode, colorClass: 'blue' | 'green' | 'orange' | 'purple' }) => {
  const styles = {
    blue: { bg: 'bg-white', iconBg: 'bg-blue-50', iconColor: 'text-blue-500' },
    green: { bg: 'bg-white', iconBg: 'bg-emerald-50', iconColor: 'text-emerald-500' },
    orange: { bg: 'bg-white', iconBg: 'bg-amber-50', iconColor: 'text-amber-500' },
    purple: { bg: 'bg-white', iconBg: 'bg-violet-50', iconColor: 'text-violet-500' },
  };
  const style = styles[colorClass];

  return (
    <div className={`${style.bg} border border-slate-200 rounded-xl p-5 flex items-center gap-4 hover:-translate-y-0.5 hover:shadow-md transition-all`}>
      <div className={`w-12 h-12 rounded-xl ${style.iconBg} ${style.iconColor} flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <div>
        <div className="text-2xl font-bold text-slate-800">{value}</div>
        <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">{label}</div>
      </div>
    </div>
  );
};

const CerfaTable = () => {
  const rows = [
    { id: 'CERFA-2026-0124', user: 'Marie Lambert', email: 'm.lambert@email.com', avatar: 'ML', avatarColor: 'bg-blue-500', company: 'Carrefour', siret: '652 014 051', formation: 'BTS MCO', date: '12/01/2026', status: 'Validé', statusClass: 'bg-emerald-100 text-emerald-700' },
    { id: 'CERFA-2026-0123', user: 'Thomas Durand', email: 't.durand@email.com', avatar: 'TD', avatarColor: 'bg-emerald-500', company: 'BNP Paribas', siret: '662 042 449', formation: 'BTS NDRC', date: '10/01/2026', status: 'En cours', statusClass: 'bg-amber-100 text-amber-700' },
    { id: 'CERFA-2026-0122', user: 'Sophie Roux', email: 's.roux@email.com', avatar: 'SR', avatarColor: 'bg-purple-500', company: 'Decathlon', siret: '500 569 405', formation: 'Bachelor', date: '08/01/2026', status: 'Refusé', statusClass: 'bg-red-100 text-red-700' },
    { id: 'CERFA-2026-0121', user: 'Jules Martin', email: 'j.martin@email.com', avatar: 'JM', avatarColor: 'bg-orange-500', company: 'Orange', siret: '380 129 866', formation: 'TP NTC', date: '05/01/2026', status: 'Brouillon', statusClass: 'bg-blue-100 text-blue-700' },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-4 w-10"><input type="checkbox" className="rounded border-slate-300" /></th>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">N° CERFA</th>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Étudiant</th>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Entreprise</th>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Formation</th>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Statut</th>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="p-4"><input type="checkbox" className="rounded border-slate-300" /></td>
                <td className="p-4">
                  <span className="font-mono text-sm font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">{row.id}</span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg ${row.avatarColor} text-white flex items-center justify-center text-xs font-bold`}>{row.avatar}</div>
                    <div>
                      <div className="text-sm font-semibold text-slate-800">{row.user}</div>
                      <div className="text-xs text-slate-500">{row.email}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div>
                    <div className="text-sm font-medium text-slate-800">{row.company}</div>
                    <div className="text-xs text-slate-500">SIRET: {row.siret}</div>
                  </div>
                </td>
                <td className="p-4">
                  <span className="inline-block px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-semibold">{row.formation}</span>
                </td>
                <td className="p-4 text-sm text-slate-600">{row.date}</td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${row.statusClass}`}>
                    {row.status}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-1">
                    <button className="p-1.5 hover:bg-blue-50 hover:text-blue-600 rounded text-slate-400 transition-colors"><Eye size={16} /></button>
                    <button className="p-1.5 hover:bg-blue-50 hover:text-blue-600 rounded text-slate-400 transition-colors"><Download size={16} /></button>
                    <button className="p-1.5 hover:bg-blue-50 hover:text-blue-600 rounded text-slate-400 transition-colors"><Edit size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between p-4 border-t border-slate-200">
        <span className="text-sm text-slate-500">Affichage 1-4 sur 24 CERFA</span>
        <div className="flex gap-1">
          <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-400 disabled:opacity-50" disabled><ChevronLeft size={16}/></button>
          <button className="w-8 h-8 flex items-center justify-center rounded border border-blue-500 bg-blue-500 text-white font-medium">1</button>
          <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-600 hover:border-blue-500 hover:text-blue-500">2</button>
          <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-600 hover:border-blue-500 hover:text-blue-500">3</button>
          <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-600 hover:border-blue-500 hover:text-blue-500"><ChevronRight size={16}/></button>
        </div>
      </div>
    </div>
  );
};

const RHView = () => {
  const [activeTab, setActiveTab] = useState<RHTab>(RHTab.CERFA);

  return (
    <div className="animate-fade-in">
      {/* Header Info */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Ressources Humaines</h1>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Users size={16} />
            <span>Gestion administrative des alternants</span>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
          <Download size={16} />
          Exporter
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <RHStatCard value="24" label="CERFA en cours" icon={<FileText size={24} />} colorClass="blue" />
        <RHStatCard value="18" label="Prises en charge" icon={<Euro size={24} />} colorClass="green" />
        <RHStatCard value="3" label="Ruptures ce mois" icon={<UserMinus size={24} />} colorClass="orange" />
        <RHStatCard value="156" label="Étudiants actifs" icon={<Users size={24} />} colorClass="purple" />
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-2 mb-6 bg-white p-1.5 rounded-xl border border-slate-200 w-fit no-scrollbar">
        {[
          { id: RHTab.CERFA, label: 'CERFA', icon: <FileText size={16}/> },
          { id: RHTab.PEC, label: 'Prises en charge', icon: <Euro size={16}/> },
          { id: RHTab.RUPTURES, label: 'Ruptures', icon: <UserMinus size={16}/> },
          { id: RHTab.SUIVI, label: 'Suivi étudiants', icon: <Users size={16}/> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === tab.id 
                ? 'bg-slate-800 text-white' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Rechercher..." 
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
            />
          </div>
          <div className="flex gap-2">
            <select className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Tous les statuts</option>
              <option>Validé</option>
              <option>En cours</option>
            </select>
            <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50">
              <Filter size={18} />
            </button>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20">
          <Plus size={18} />
          {activeTab === RHTab.CERFA ? 'Nouveau CERFA' : 'Nouvelle entrée'}
        </button>
      </div>

      {/* Content */}
      {activeTab === RHTab.CERFA && <CerfaTable />}
      
      {activeTab !== RHTab.CERFA && (
        <div className="bg-white border border-slate-200 rounded-xl p-12 flex flex-col items-center justify-center text-center">
           <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
              <Users size={32} />
           </div>
           <h3 className="text-lg font-bold text-slate-800 mb-2">Section en construction</h3>
           <p className="text-slate-500 max-w-sm">La vue {activeTab} est en cours de développement. Revenez plus tard.</p>
        </div>
      )}
    </div>
  );
};

export default RHView;