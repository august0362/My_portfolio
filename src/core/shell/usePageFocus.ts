import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';

export default function usePageFocus(title: string) {
  const mainRef = useRef<HTMLElement>(null);
  const location = useLocation();

  useEffect(() => {
    document.title = `${title} | Celestial`;
    mainRef.current?.focus();
  }, [title, location.key]);

  return mainRef;
}
