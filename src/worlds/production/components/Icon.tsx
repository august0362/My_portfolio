export default function Icon({ name }: { name: 'plus' | 'minus' | 'reset' | 'arrow' | 'expand' | 'close' | 'left' | 'right' | 'source' | 'compass' }) {
  const paths = {
    plus: 'M12 5v14M5 12h14', minus: 'M5 12h14',
    reset: 'M4 10a8 8 0 1 1 1 7M4 4v6h6', arrow: 'M5 12h14m-6-6 6 6-6 6',
    expand: 'M9 4H4v5m11-5h5v5M4 15v5h5m6 0h5v-5', close: 'm6 6 12 12M6 18 18 6',
    left: 'm15 5-7 7 7 7', right: 'm9 5 7 7-7 7',
    source: 'm8 6-6 6 6 6m8-12 6 6-6 6M14 3l-4 18',
    compass: 'm16 8-3 5-5 3 3-5 5-3M12 2v2m0 16v2M2 12h2m16 0h2',
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]} /></svg>;
}
