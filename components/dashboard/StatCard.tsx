import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
    label: string;
    value: string | number;
    icon: LucideIcon;
    color: 'indigo' | 'rose' | 'emerald' | 'blue' | 'purple' | 'amber';
    trend?: string;
    trendIcon?: LucideIcon;
    trendColor?: string;
    description?: string;
    progress?: number;
    trendLabel?: string;
}

const StatCard: React.FC<StatCardProps> = ({
    label,
    value,
    icon: Icon,
    color,
    trend,
    trendIcon: TrendIcon,
    trendColor = 'emerald-500',
    description,
    progress,
    trendLabel
}) => {
    const colorClasses = {
        indigo: 'from-indigo-500 to-indigo-600 bg-indigo-50 text-indigo-600 shadow-indigo-500/20',
        rose: 'from-rose-500 to-rose-600 bg-rose-50 text-rose-600 shadow-rose-500/20',
        emerald: 'from-emerald-500 to-emerald-600 bg-emerald-50 text-emerald-600 shadow-emerald-500/20',
        blue: 'from-blue-500 to-blue-600 bg-blue-50 text-blue-600 shadow-blue-500/20',
        purple: 'from-purple-500 to-purple-600 bg-purple-50 text-purple-600 shadow-purple-500/20',
        amber: 'from-amber-500 to-amber-600 bg-amber-50 text-amber-600 shadow-amber-500/20',
    };

    return (
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-32 h-32 bg-${color}-500/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-${color}-500/10 transition-colors`}></div>
            <div className="flex justify-between items-start mb-6 relative z-10">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colorClasses[color].split(' ')[0]} ${colorClasses[color].split(' ')[1]} flex items-center justify-center text-white shadow-lg ${colorClasses[color].split(' ')[4]} group-hover:scale-110 transition-transform`}>
                    <Icon size={28} />
                </div>
                <span className={`px-3 py-1 ${colorClasses[color].split(' ')[2]} ${colorClasses[color].split(' ')[3]} rounded-full text-[10px] font-black uppercase tracking-wider`}>
                    {label}
                </span>
            </div>

            <div className="text-5xl font-black text-slate-800 mb-2 tracking-tighter relative z-10">{value}</div>

            <div className="relative z-10">
                {trend && (
                    <div className="text-slate-400 text-sm font-bold flex items-center gap-2">
                        {TrendIcon && <TrendIcon size={16} className={`text-${trendColor}`} />}
                        <span className={`text-${trendColor}`}>{trend}</span> {trendLabel}
                    </div>
                )}

                {progress !== undefined && (
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-2">
                        <div className={`bg-${color}-500 h-full rounded-full`} style={{ width: `${progress}%` }}></div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatCard;
