export default function WorldGlyph({ index }: { index: number }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth=".8" aria-hidden="true">
      <circle cx="50" cy="50" r="40" strokeDasharray="1 5" opacity=".5" />
      {index === 0 && <><path d="M61 22a29 29 0 1 0 0 56 25 25 0 0 1 0-56Z" fill="currentColor" fillOpacity=".13" /><path d="m66 29 2 7 7 2-7 2-2 7-2-7-7-2 7-2Z" /></>}
      {index === 1 && <><circle cx="50" cy="50" r="17" /><circle cx="50" cy="50" r="11" fill="currentColor" fillOpacity=".14" /><path d="M50 17v10m0 46v10M17 50h10m46 0h10M27 27l7 7m32 32 7 7m0-46-7 7M34 66l-7 7" /></>}
      {index === 2 && <><path d="m50 22 27 28-27 28-27-28Z" /><path d="m50 33 16 17-16 17-16-17Z" fill="currentColor" fillOpacity=".18" /><path d="M50 12v10m0 56v10M12 50h11m54 0h11" /></>}
      {index === 3 && <><path d="m50 19 6 24 25 7-25 7-6 24-6-24-25-7 25-7Z" fill="currentColor" fillOpacity=".13" /><path d="m28 24 4 6m36 40 4 6m4-48-6 4M30 68l-6 4" /></>}
      {index === 4 && <><path d="M20 49a30 30 0 0 0 60 0 31 20 0 0 1-60 0Z" fill="currentColor" fillOpacity=".15" /><path d="m50 19 3 10 10 3-10 3-3 10-3-10-10-3 10-3Z" /><path d="M29 34l-5-5m47 5 5-5" /></>}
      <path d="M50 4v5m0 82v5M4 50h5m82 0h5" opacity=".6" />
    </svg>
  );
}
