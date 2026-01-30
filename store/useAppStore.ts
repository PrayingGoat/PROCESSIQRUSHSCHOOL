import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
    toastMessage: string | null;
    toastType: 'success' | 'error' | 'info';
    showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
    hideToast: () => void;

    // Cache
    candidates: any[];
    lastCandidatesFetch: number | null;
    setCandidates: (candidates: any[]) => void;

    // Form Drafts
    draftStudent: any | null;
    setDraftStudent: (data: any) => void;
    clearDraftStudent: () => void;

    draftCompany: any | null;
    setDraftCompany: (data: any) => void;
    clearDraftCompany: () => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            toastMessage: null,
            toastType: 'info',
            showToast: (message, type = 'info') => set({ toastMessage: message, toastType: type }),
            hideToast: () => set({ toastMessage: null }),

            candidates: [],
            lastCandidatesFetch: null,
            setCandidates: (candidates) => set({ candidates, lastCandidatesFetch: Date.now() }),

            draftStudent: null,
            setDraftStudent: (data) => set({ draftStudent: data }),
            clearDraftStudent: () => set({ draftStudent: null }),

            draftCompany: null,
            setDraftCompany: (data) => set({ draftCompany: data }),
            clearDraftCompany: () => set({ draftCompany: null }),
        }),
        {
            name: 'app-storage',
            partialize: (state) => ({
                draftStudent: state.draftStudent,
                draftCompany: state.draftCompany
            }),
        }
    )
);
