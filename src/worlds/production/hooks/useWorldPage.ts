import { useEffect, useRef } from 'react';

export default function useWorldPage(title: string) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      document.title = `${title} | The Forge | Celestial`;
      headingRef.current?.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
    return () => cancelAnimationFrame(frame);
  }, [title]);
  return headingRef;
}
