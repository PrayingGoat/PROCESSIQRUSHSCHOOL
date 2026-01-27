import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  step?: number;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, title, subtitle, icon, step, className = '' }) => {
  return (
    <div className={`bg-white/80 p-6 md:p-8 rounded-2xl border border-blue-100 shadow-sm transition-all hover:shadow-md ${className}`}>
      {(title || icon || step) && (
        <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
          {step && (
            <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center font-bold text-sm shadow-sm ring-1 ring-blue-500/10">
              {step}
            </div>
          )}
          {icon && (
            <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
              {icon}
            </div>
          )}
          <div>
            {title && <h3 className="text-lg font-bold text-slate-800">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-500 font-medium">{subtitle}</p>}
          </div>
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
