interface Props {
  page: number;
  pageCount: number;
  onPrev: () => void;
  onNext: () => void;
}

export function PaginationControls({ page, pageCount, onPrev, onNext }: Props) {
  if (pageCount <= 1) return null;
  return (
    <div className="flex items-center justify-between mt-3 text-[10px] font-mono text-slate-500">
      <button onClick={onPrev} disabled={page === 0} className="px-2.5 py-1 rounded border border-void-border disabled:opacity-30 hover:border-slate-600">
        ◀ Anterior
      </button>
      <span>
        Página {page + 1} de {pageCount}
      </span>
      <button
        onClick={onNext}
        disabled={page === pageCount - 1}
        className="px-2.5 py-1 rounded border border-void-border disabled:opacity-30 hover:border-slate-600"
      >
        Siguiente ▶
      </button>
    </div>
  );
}
