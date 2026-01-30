import { useState, useMemo } from 'react';

export const usePagination = <T>(items: T[], itemsPerPage: number = 8) => {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = useMemo(() => Math.ceil(items.length / itemsPerPage), [items.length, itemsPerPage]);

    const paginatedItems = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return items.slice(start, start + itemsPerPage);
    }, [items, currentPage, itemsPerPage]);

    return {
        currentPage,
        setCurrentPage,
        totalPages,
        paginatedItems,
        itemsPerPage
    };
};
