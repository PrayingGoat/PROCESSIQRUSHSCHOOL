import { useState, useCallback } from 'react';
import { useAppStore } from '../store/useAppStore';

interface UseApiOptions<T> {
    onSuccess?: (data: T) => void;
    onError?: (error: any) => void;
    successMessage?: string;
    errorMessage?: string;
    showToast?: boolean;
    silentLoading?: boolean;
}

export const useApi = <T, Args extends any[]>(
    apiFunc: (...args: Args) => Promise<T>,
    options: UseApiOptions<T> = {}
) => {
    const { showToast: notify } = useAppStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);
    const [data, setData] = useState<T | null>(null);

    const execute = useCallback(async (...args: Args) => {
        if (!options.silentLoading) {
            setLoading(true);
        }
        setError(null);
        try {
            const result = await apiFunc(...args);
            setData(result);

            if (options.successMessage && options.showToast !== false) {
                notify(options.successMessage, 'success');
            }

            if (options.onSuccess) {
                options.onSuccess(result);
            }

            return result;
        } catch (err: any) {
            const msg = err.message || options.errorMessage || "Une erreur est survenue";
            setError(err);

            if (options.showToast !== false) {
                notify(msg, 'error');
            }

            if (options.onError) {
                options.onError(err);
            }

            throw err;
        } finally {
            if (!options.silentLoading) {
                setLoading(false);
            }
        }
    }, [apiFunc, notify, options]);

    return {
        execute,
        loading,
        error,
        data,
        setData
    };
};
