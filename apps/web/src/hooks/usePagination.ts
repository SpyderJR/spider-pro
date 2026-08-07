import { useEffect, useMemo, useState } from "react";

/**
 * Bounds how many rows of a growing list (trade history, diary entries) actually hit the DOM at
 * once. A paper-trading account accumulates history indefinitely — without this, a few months of
 * active use renders every row on every re-render, which is real, avoidable DOM/CPU cost for data
 * the user isn't even looking at.
 */
export function usePagination<T>(items: T[], pageSize: number) {
  const [page, setPage] = useState(0);
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));

  // Resets to page 0 when a filter shrinks the list below the current page, or the underlying
  // list changes size enough that the current page no longer exists.
  useEffect(() => {
    if (page >= pageCount) setPage(0);
  }, [pageCount, page]);

  const pageItems = useMemo(() => items.slice(page * pageSize, (page + 1) * pageSize), [items, page, pageSize]);

  return {
    pageItems,
    page,
    pageCount,
    prevPage: () => setPage((p) => Math.max(0, p - 1)),
    nextPage: () => setPage((p) => Math.min(pageCount - 1, p + 1)),
  };
}
