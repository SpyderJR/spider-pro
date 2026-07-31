/** Rate of Change — momentum as a percentage change over `period` bars. */
export function roc(values: number[], period = 12): (number | null)[] {
  return values.map((v, i) => {
    if (i < period) return null;
    const past = values[i - period]!;
    if (past === 0) return null;
    return ((v - past) / past) * 100;
  });
}
