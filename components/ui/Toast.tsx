import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

const Toast: React.FC = () => {
    const { toastMessage, toastType, hideToast } = useAppStore();

    useEffect(() => {
        if (toastMessage) {
            const timer = setTimeout(hideToast, 5000);
            return () => clearTimeout(timer);
        }
    }, [toastMessage, hideToast]);

    if (!toastMessage) return null;

    const getIcon = () => {
        switch (toastType) {
            case 'success':
                return <CheckCircle2 size={20} className="text-emerald-600" />;
            case 'error':
                return <AlertCircle size={20} className="text-rose-600" />;
            case 'info':
                return <Info size={20} className="text-blue-600" />;
            default:
                return null;
        }
    };

    const getBgColor = () => {
        switch (toastType) {
            case 'success':
                return 'bg-emerald-50 border-emerald-200';
            case 'error':
                return 'bg-rose-50 border-rose-200';
            case 'info':
                return 'bg-blue-50 border-blue-200';
            default:
                return 'bg-slate-50 border-slate-200';
        }
    };

    const getTextColor = () => {
        switch (toastType) {
            case 'success':
                return 'text-emerald-800';
            case 'error':
                return 'text-rose-800';
            case 'info':
                return 'text-blue-800';
            default:
                return 'text-slate-800';
        }
    };

    return (
        <div className="fixed top-4 right-4 z-[9999] animate-in slide-in-from-top-5 duration-300">
            <div className={`${getBgColor()} border-2 rounded-2xl p-4 shadow-2xl flex items-center gap-3 min-w-[300px] max-w-md`}>
                {getIcon()}
                <p className={`${getTextColor()} font-bold text-sm flex-1`}>
                    {toastMessage}
                </p>
                <button
                    onClick={hideToast}
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <X size={18} />
                </button>
            </div>
        </div>
    );
};

export default Toast;
