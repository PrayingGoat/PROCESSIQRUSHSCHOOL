import React from 'react';
import { HistoryEntry } from '../../types';
import { Clock, CheckCircle2, FileText, AlertCircle, User, Calendar } from 'lucide-react';

interface HistoryTimelineProps {
    history: HistoryEntry[];
    loading?: boolean;
}

const HistoryTimeline: React.FC<HistoryTimelineProps> = ({ history, loading }) => {
    if (loading) {
        return (
            <div className="space-y-4 animate-pulse">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-100"></div>
                        <div className="flex-1 space-y-2">
                            <div className="h-4 bg-slate-100 rounded w-1/4"></div>
                            <div className="h-3 bg-slate-50 rounded w-3/4"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (!history || history.length === 0) {
        return (
            <div className="text-center py-10">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                    <Clock size={32} />
                </div>
                <p className="text-slate-400 font-medium">Aucun historique disponible</p>
            </div>
        );
    }

    // Sort by date desc
    const sortedHistory = [...history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const getIcon = (action: string) => {
        const lower = action.toLowerCase();
        if (lower.includes('création') || lower.includes('ajout')) return <CheckCircle2 size={16} />;
        if (lower.includes('document')) return <FileText size={16} />;
        if (lower.includes('erreur') || lower.includes('suppression')) return <AlertCircle size={16} />;
        if (lower.includes('note') || lower.includes('commentaire')) return <User size={16} />;
        return <Clock size={16} />;
    };

    const getColor = (action: string) => {
        const lower = action.toLowerCase();
        if (lower.includes('création') || lower.includes('validé')) return 'bg-emerald-100 text-emerald-600 border-emerald-200';
        if (lower.includes('document')) return 'bg-blue-100 text-blue-600 border-blue-200';
        if (lower.includes('erreur') || lower.includes('suppression')) return 'bg-rose-100 text-rose-600 border-rose-200';
        return 'bg-slate-100 text-slate-600 border-slate-200';
    };

    const formatDate = (dateStr: string) => {
        try {
            return new Date(dateStr).toLocaleString('fr-FR', {
                day: '2-digit', month: 'short', year: 'numeric',
                hour: '2-digit', minute: '2-digit'
            });
        } catch (e) { return dateStr; }
    };

    return (
        <div className="relative space-y-0 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
            {sortedHistory.map((item, index) => (
                <div key={item.id || index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">

                    {/* Icon */}
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 ${getColor(item.action)} z-10 bg-white relative`}>
                        {getIcon(item.action)}
                    </div>

                    {/* Content Card */}
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all">
                        <div className="flex justify-between items-start mb-1">
                            <span className="font-black text-slate-700 text-sm">{item.action}</span>
                            <time className="font-mono text-[10px] text-slate-400">{formatDate(item.date)}</time>
                        </div>
                        <p className="text-slate-500 text-xs leading-relaxed">{item.details}</p>
                        {item.utilisateur && (
                            <div className="mt-2 pt-2 border-t border-slate-50 flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                <User size={10} />
                                {item.utilisateur}
                            </div>
                        )}
                    </div>

                </div>
            ))}
        </div>
    );
};

export default HistoryTimeline;
