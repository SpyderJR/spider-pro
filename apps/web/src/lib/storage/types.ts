/** Un dominio sincronizable como un único blob JSON por usuario (academy_progress, arcade_stats, terminal_state, settings). */
export interface BlobSyncTarget<T> {
  table: string;
  getLocal: () => T;
  setLocal: (value: T) => void;
  /** Se llama con cada cambio de estado del store — debe devolver una función de limpieza. */
  subscribeLocal: (onChange: () => void) => () => void;
  /**
   * Nunca debe perder datos: `remote` puede ser `null` la primera vez que este usuario sincroniza.
   * `localUpdatedAt`/`remoteUpdatedAt` (ISO) se pasan para estrategias "gana el más reciente";
   * los dominios que necesitan unión (ej. progreso de Academia) pueden ignorarlos.
   */
  merge: (local: T, remote: T | null, localUpdatedAt: string | null, remoteUpdatedAt: string | null) => T;
}

/** Un dominio sincronizable como filas independientes con id propio (achievements, journal_entries) — se unen por id, nunca se pierde un ítem. */
export interface SetSyncTarget<TItem> {
  table: string;
  idColumn: string;
  getLocalItems: () => TItem[];
  setLocalItems: (items: TItem[]) => void;
  subscribeLocal: (onChange: () => void) => () => void;
  getId: (item: TItem) => string;
  toRow: (userId: string, item: TItem) => Record<string, unknown>;
  fromRow: (row: Record<string, unknown>) => TItem;
}
