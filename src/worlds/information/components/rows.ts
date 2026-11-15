/**
 * Justified-row layout: split photos, in order, into rows that each span the full width at one shared
 * height. Picks the split whose photos stay closest to `ideal` height (O(n²) dynamic programming).
 * Each row costs (photos in row) × ln(height / ideal)², so every photo counts and a too-small row is
 * penalized as much as a too-tall one.
 */
export function justifyRows(aspects: number[], width: number, gap: number, ideal: number): number[][] {
  const n = aspects.length;
  if (n === 0 || width <= 0) return [];
  const rowHeight = (from: number, to: number) => {
    let sum = 0;
    for (let i = from; i < to; i++) sum += aspects[i];
    return (width - gap * (to - from - 1)) / sum;
  };
  const cost = new Array<number>(n + 1).fill(Infinity);
  const prev = new Array<number>(n + 1).fill(0);
  cost[0] = 0;
  for (let to = 1; to <= n; to++) {
    for (let from = 0; from < to; from++) {
      const h = rowHeight(from, to);
      if (h <= 0) continue;
      const c = cost[from] + (to - from) * Math.log(h / ideal) ** 2;
      if (c < cost[to]) {
        cost[to] = c;
        prev[to] = from;
      }
    }
  }
  const rows: number[][] = [];
  for (let to = n; to > 0; to = prev[to]) {
    rows.unshift(Array.from({ length: to - prev[to] }, (_, k) => prev[to] + k));
  }
  return rows;
}

/**
 * Target row height for a container width. Wide screens aim for a row that fits the viewport; phones
 * aim taller so a portrait reads at half to full width instead of a thumbnail strip.
 */
export const idealRowHeight = (width: number) => (width < 600 ? width * 0.85 : Math.min(480, width * 0.4));
