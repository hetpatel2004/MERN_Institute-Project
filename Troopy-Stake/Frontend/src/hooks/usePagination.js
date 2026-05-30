import { useState } from "react";

export default function usePagination(initialPage = 1, initialLimit = 20) {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const nextPage = () => setPage((p) => Math.min(p + 1, totalPages));
  const prevPage = () => setPage((p) => Math.max(p - 1, 1));
  const goToPage = (p) => setPage(p);
  const resetPage = () => setPage(1);

  return {
    page,
    limit,
    totalPages,
    totalItems,
    setPage,
    setLimit,
    setTotalPages,
    setTotalItems,
    nextPage,
    prevPage,
    goToPage,
    resetPage,
  };
}
