import { useEffect, useRef } from 'react';

/** Sets the page title, and on arrival focuses the heading and scrolls to the top. */
export default function useWorldPage(title: string) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  // A language switch renames the page but must not move focus or scroll.
  useEffect(() => {
    document.title = `${title} | Celestial Portal`;
  }, [title]);
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      headingRef.current?.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
    return () => cancelAnimationFrame(frame);
  }, []);
  return headingRef;
}
