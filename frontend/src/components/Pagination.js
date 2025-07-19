import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange, canGoPrev, canGoNext }) => {
  return (
    <div>
      <button disabled={!canGoPrev} onClick={() => onPageChange(currentPage - 1)}>
        Anterior
      </button>
      <span> Página {currentPage} de {totalPages} </span>
      <button disabled={!canGoNext} onClick={() => onPageChange(currentPage + 1)}>
        Próximo
      </button>
    </div>
  );
};

export default Pagination;