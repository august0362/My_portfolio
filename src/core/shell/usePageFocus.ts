import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';

export default function usePageFocus(title: string) {
  const mainRef = useRef<HTMLElement>(null);
  const location = useLocation();

  // A language switch renames the page but must not move focus away from the control.
  useEffect(() => {
    document.title = `${title} | Celestial Portal`;
  }, [title]);

  useEffect(() => {
    mainRef.current?.focus();
  }, [location.key]);

  return mainRef;
}
