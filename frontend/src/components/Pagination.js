import React from 'react';

const DOTS = '...';

/**
 * Helper function to generate the pagination range.
 * @param {number} currentPage - The current active page.
 * @param {number} totalPages - The total number of pages.
 * @param {number} siblingCount - The number of pages to show on each side of the current page.
 * @returns {Array<number|string>} - The array of page numbers and ellipses.
 */
const usePaginationRange = (currentPage, totalPages, siblingCount = 1) => {
  // The total number of pages to display in the pagination bar
  const totalPageNumbers = siblingCount + 5;

  // Case 1: If the number of pages is less than the page numbers we want to show
  if (totalPageNumbers >= totalPages) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

  const shouldShowLeftDots = leftSiblingIndex > 2;
  const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

  const firstPageIndex = 1;
  const lastPageIndex = totalPages;

  // Case 2: No left dots to show, but right dots to be shown
  if (!shouldShowLeftDots && shouldShowRightDots) {
    let leftItemCount = 3 + 2 * siblingCount;
    let leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
    return [...leftRange, DOTS, totalPages];
  }

  // Case 3: No right dots to show, but left dots to be shown
  if (shouldShowLeftDots && !shouldShowRightDots) {
    let rightItemCount = 3 + 2 * siblingCount;
    let rightRange = Array.from({ length: rightItemCount }, (_, i) => totalPages - rightItemCount + 1 + i);
    return [firstPageIndex, DOTS, ...rightRange];
  }

  // Case 4: Both left and right dots to be shown
  if (shouldShowLeftDots && shouldShowRightDots) {
    let middleRange = Array.from({ length: rightSiblingIndex - leftSiblingIndex + 1 }, (_, i) => leftSiblingIndex + i);
    return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
  }

  // Default case (should not be reached, but for safety)
  return Array.from({ length: totalPages }, (_, i) => i + 1);
};

function Pagination({ currentPage, totalPages, onPageChange }) {
  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const paginationRange = usePaginationRange(currentPage, totalPages);

  return (
    <nav aria-label="pagination navigation" className="pagination-controls">
      <button
        onClick={handlePrev}
        disabled={currentPage === 1}
        aria-label="Go to previous page"
      >
        Previous
      </button>
      {paginationRange.map((pageNumber, index) => {
        if (pageNumber === DOTS) {
          // Use a unique key for ellipses
          return <span key={`${DOTS}-${index}`} className="pagination-dots" aria-hidden="true">&#8230;</span>;
        }

        return (
          <button
            key={pageNumber}
            onClick={() => onPageChange(pageNumber)}
            className={`page-number ${currentPage === pageNumber ? 'active' : ''}`}
            aria-current={currentPage === pageNumber ? 'page' : undefined}
            aria-label={`Go to page ${pageNumber}`}
          >
            {pageNumber}
          </button>
        );
      })}
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        aria-label="Go to next page"
      >
        Next
      </button>
    </nav>
  );
}

export default Pagination;