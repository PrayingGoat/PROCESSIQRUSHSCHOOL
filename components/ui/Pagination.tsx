import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = ''
}) => {
  if (totalPages <= 1) return null;

  const renderPageNumbers = () => {
    const pages = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(renderPageButton(i));
      }
    } else {
      // Always show first page
      pages.push(renderPageButton(1));

      if (currentPage > 3) {
        pages.push(<MoreHorizontal key="ellipsis-start" className="text-slate-300 w-5 h-5 mx-1" />);
      }

      // Show pages around current
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== totalPages) {
          pages.push(renderPageButton(i));
        }
      }

      if (currentPage < totalPages - 2) {
        pages.push(<MoreHorizontal key="ellipsis-end" className="text-slate-300 w-5 h-5 mx-1" />);
      }

      // Always show last page
      pages.push(renderPageButton(totalPages));
    }

    return pages;
  };

  const renderPageButton = (page: number) => (
    <button
      key={page}
      onClick={() => onPageChange(page)}
      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all duration-300 ${currentPage === page
          ? 'bg-brand text-white shadow-lg shadow-brand/25 scale-110 z-10'
          : 'bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-800 border border-slate-100'
        }`}
    >
      {page}
    </button>
  );

  return (
    <div className={`flex items-center justify-center gap-2 py-8 ${className}`}>
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-primary-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
      >
        <ChevronLeft size={20} strokeWidth={2.5} />
      </button>

      <div className="flex items-center gap-1.5">
        {renderPageNumbers()}
      </div>

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-brand hover:bg-brand/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
      >
        <ChevronRight size={20} strokeWidth={2.5} />
      </button>
    </div>
  );
};

export default Pagination;
