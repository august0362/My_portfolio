import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router';
import styles from './SceneTransition.module.css';

export default function useSceneTransition(reduced: boolean) {
  const shellRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const waterRef = useRef<HTMLDivElement>(null);
  const location = useLocation(), navigate = useNavigate();
  const previousLocation = useRef(location.key);

  useEffect(() => {
    const shell = shellRef.current, scene = sceneRef.current, water = waterRef.current;
    if (!shell || !scene || !water) return;
    let navigation = 0, leaving = false;
    const removals = new Set<number>();
    let arrival: Animation | undefined;
    if (previousLocation.current !== location.key && !reduced && typeof scene.animate === 'function') {
      arrival = scene.animate([
        { opacity: 0, filter: 'blur(6px)', transform: 'translateY(5px) scale(1.008)' },
        { opacity: 1, filter: 'blur(0px)', transform: 'translateY(0) scale(1)' },
      ], { duration: 620, easing: 'cubic-bezier(.2,.65,.25,1)' });
    }
    previousLocation.current = location.key;

    function ripple(x: number, y: number) {
      if (reduced) return;
      const wave = document.createElement('span');
      wave.className = styles.ripple;
      wave.style.left = `${x}px`; wave.style.top = `${y}px`;
      for (let ring = 0; ring < 2; ring++) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 44 44');
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', '22'); circle.setAttribute('cy', '22'); circle.setAttribute('r', '20');
        circle.setAttribute('vector-effect', 'non-scaling-stroke');
        svg.append(circle); wave.append(svg);
      }
      water!.append(wave);
      if (water!.children.length > 6) water!.firstElementChild?.remove();
      const removal = window.setTimeout(() => { wave.remove(); removals.delete(removal); }, 1000);
      removals.add(removal);
    }
    const press = (event: PointerEvent) => {
      if (!event.isPrimary || event.button !== 0 || !(event.target instanceof Element)) return;
      if (event.target.closest('a, button')) ripple(event.clientX, event.clientY);
    };
    const click = (event: MouseEvent) => {
      if (reduced || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || !(event.target instanceof Element)) return;
      const link = event.target.closest<HTMLAnchorElement>('a[href]');
      if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
      const destination = new URL(link.href, window.location.href);
      if (destination.origin !== window.location.origin || (destination.pathname === location.pathname && destination.search === location.search)) return;
      event.preventDefault();
      if (leaving) return;
      leaving = true;
      arrival?.cancel();
      if (event.detail === 0) { const rect = link.getBoundingClientRect(); ripple(rect.left + rect.width / 2, rect.top + rect.height / 2); }
      // Let the water crest register before the scene softly loses focus.
      scene.dataset.leaving = 'true'; water.dataset.leaving = 'true';
      navigation = window.setTimeout(() => { void navigate(`${destination.pathname}${destination.search}${destination.hash}`); }, 420);
    };
    shell.addEventListener('pointerdown', press, { capture: true });
    shell.addEventListener('click', click);
    return () => {
      shell.removeEventListener('pointerdown', press, { capture: true }); shell.removeEventListener('click', click);
      window.clearTimeout(navigation); removals.forEach(id => window.clearTimeout(id));
      arrival?.cancel(); water.replaceChildren(); delete scene.dataset.leaving; delete water.dataset.leaving;
    };
  }, [location.key, location.pathname, location.search, navigate, reduced]);

  return { shellRef, sceneRef, waterRef };
}
