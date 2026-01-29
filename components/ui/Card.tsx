import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  step?: number;
  className?: string;
  variant?: 'default' | 'premium' | 'glass';
  noPadding?: boolean;
  collapsible?: boolean;
  defaultOpen?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  icon,
  step,
  className = '',
  variant = 'default',
  noPadding = false,
  collapsible = false,
  defaultOpen = true
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const variantStyles = {
    default: 'bg-white border border-slate-100 shadow-premium',
    premium: 'bg-white border border-slate-200 shadow-premium hover:shadow-premium-hover hover:-translate-y-1',
    glass: 'glass border border-white/40 shadow-premium backdrop-blur-md',
  };

  return (
    <div className={`rounded-3xl transition-all duration-300 ${variantStyles[variant]} ${className}`}>
      {(title || icon || step) && (
        <div
          className={`flex items-center gap-4 px-6 md:px-8 py-5 border-b border-slate-50 ${collapsible ? 'cursor-pointer select-none' : ''}`}
          onClick={() => collapsible && setIsOpen(!isOpen)}
        >
          {step && (
            <div className="w-9 h-9 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center font-black text-sm shadow-sm border border-primary-100/50">
              {step}
            </div>
          )}
          {icon && (
            <div className="w-10 h-10 bg-slate-50 text-slate-500 rounded-xl flex items-center justify-center border border-slate-100">
              {icon}
            </div>
          )}
          <div className="flex-1">
            {title && <h3 className="text-base font-black text-slate-800 tracking-tight leading-none">{title}</h3>}
            {subtitle && <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-1.5">{subtitle}</p>}
          </div>
          {collapsible && (
            <div className={`w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
              <ChevronDown size={18} strokeWidth={3} />
            </div>
          )}
        </div>
      )}
      <div className={`transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className={noPadding ? '' : 'p-6 md:p-8'}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Card;
