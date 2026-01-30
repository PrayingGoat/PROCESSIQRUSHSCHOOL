import { create } from 'zustand';

interface AppState {
    toastMessage: string | null;
    toastType: 'success' | 'error' | 'info';
    showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
    hideToast: () => void;
}

export const useAppStore = create<AppState>((set) => ({
    toastMessage: null,
    toastType: 'info',
    showToast: (message, type = 'info') => set({ toastMessage: message, toastType: type }),
    hideToast: () => set({ toastMessage: null }),
}));
