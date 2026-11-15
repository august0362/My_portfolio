import { useEffect, useRef } from 'react';
import type { MouseEvent } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useSettings } from '@shared/settings';
import styles from '../Production.module.css';

export default function useProjectTransition() {
  const rootRef = useRef<HTMLElement>(null);
  const pending = useRef(false);
  const timeout = useRef(0);
  const destination = useRef('');
  const navigate = useNavigate();
  const location = useLocation();
  const { settings } = useSettings();

  useEffect(() => {
    const root = rootRef.current;
    const cancel = () => {
      window.clearTimeout(timeout.current); pending.current = false;
      root?.querySelector('[data-production-ripple]')?.remove();
      if (root) delete root.dataset.leaving;
    };
    const interrupt = (event: globalThis.MouseEvent) => {
      const anchor = event.target instanceof Element ? event.target.closest('a[href]') : null;
      if (pending.current && anchor && !anchor.hasAttribute('data-project-entry')) cancel();
    };
    const visibility = () => {
      if (document.hidden && pending.current) { window.clearTimeout(timeout.current); void navigate(destination.current); }
    };
    document.addEventListener('visibilitychange', visibility);
    document.addEventListener('click', interrupt, { capture: true });
    window.addEventListener('popstate', cancel);
    return () => {
      cancel();
      document.removeEventListener('visibilitychange', visibility);
      document.removeEventListener('click', interrupt, { capture: true });
      window.removeEventListener('popstate', cancel);
    };
  }, [location.key, navigate]);

  function enterProject(event: MouseEvent<HTMLAnchorElement>) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey || event.currentTarget.target === '_blank') return;
    event.preventDefault();
    // Handle the capture phase before the shell's native bubbling link listener.
    event.stopPropagation();
    if (pending.current) return;
    const root = rootRef.current, anchor = event.currentTarget;
    destination.current = new URL(anchor.href).pathname;
    if (!root || settings.motion === 'reduced' || settings.quality === 'static') {
      void navigate(destination.current); return;
    }
    pending.current = true;
    const bounds = root.getBoundingClientRect(), marker = anchor.getBoundingClientRect();
    const x = event.detail === 0 ? marker.left + marker.width / 2 - bounds.left : event.clientX - bounds.left;
    const y = event.detail === 0 ? marker.top + marker.height / 2 - bounds.top : event.clientY - bounds.top;
    const reach = Math.hypot(Math.max(x, bounds.width - x), Math.max(y, bounds.height - y));
    const ripple = document.createElement('span');
    ripple.className = styles.worldRipple; ripple.dataset.productionRipple = '';
    ripple.setAttribute('aria-hidden', 'true');
    ripple.style.left = `${x}px`; ripple.style.top = `${y}px`; ripple.style.setProperty('--ripple-scale', String(reach / 22));
    for (let index = 0; index < 3; index++) {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', '0 0 48 48'); svg.style.setProperty('--ring-delay', `${index * 70}ms`);
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', '24'); circle.setAttribute('cy', '24'); circle.setAttribute('r', '22'); circle.setAttribute('vector-effect', 'non-scaling-stroke');
      svg.append(circle); ripple.append(svg);
    }
    root.append(ripple); root.dataset.leaving = 'true';
    // Navigation has a fixed deadline and never depends on an animation event.
    timeout.current = window.setTimeout(() => { void navigate(destination.current); }, 680);
  }
  return { rootRef, enterProject };
}
