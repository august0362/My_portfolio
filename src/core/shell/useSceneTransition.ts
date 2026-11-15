import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router';
import styles from './SceneTransition.module.css';

export default function useSceneTransition(reduced: boolean) {
  const shellRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const waterRef = useRef<HTMLDivElement>(null);
  const location = useLocation(), navigate = useNavigate();
  const previousLocation = useRef(location.key);
  /** True while a veil covers the old page, so the next page can open it. */
  const veiled = useRef(false);

  useEffect(() => {
    const shell = shellRef.current, scene = sceneRef.current, water = waterRef.current;
    if (!shell || !scene || !water) return;
    let navigation = 0, leaving = false;
    const removals = new Set<number>();
    const surfaces = new Set<HTMLElement>();
    let selected: HTMLAnchorElement | null = null, departingHub: HTMLElement | null = null;
    let arrival: Animation | undefined;
    let coreFlash: Animation | undefined;
    if (previousLocation.current !== location.key && !reduced && typeof scene.animate === 'function') {
      arrival = scene.animate([
        { opacity: 0, filter: 'blur(6px)', transform: 'translateY(5px) scale(1.008)' },
        { opacity: 1, filter: 'blur(0px)', transform: 'translateY(0) scale(1)' },
      ], { duration: 620, easing: 'cubic-bezier(.2,.65,.25,1)' });
    }
    previousLocation.current = location.key;
    let opening: HTMLSpanElement | undefined;
    if (veiled.current && !reduced) {
      // The new page opens through the veil that closed over the old one.
      opening = document.createElement('span');
      opening.className = `${styles.veil} ${styles.veilOpen}`;
      opening.setAttribute('aria-hidden', 'true');
      water.append(opening);
      const finished = window.setTimeout(() => { opening?.remove(); }, 900);
      removals.add(finished);
    }
    veiled.current = false;

    function veil(x: number, y: number, delayMs: number) {
      const cover = document.createElement('span');
      cover.className = styles.veil;
      cover.setAttribute('aria-hidden', 'true');
      cover.style.setProperty('--veil-x', `${x}px`); cover.style.setProperty('--veil-y', `${y}px`);
      cover.style.animationDelay = `${delayMs}ms`;
      const ring = document.createElement('i');
      ring.style.animationDelay = `${delayMs}ms`;
      cover.append(ring);
      water!.append(cover);
      veiled.current = true;
    }

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
    function surfaceRipple(card: HTMLAnchorElement, clientX: number, clientY: number) {
      if (reduced) return;
      card.querySelector(`.${styles.surface}`)?.remove();
      const bounds = card.getBoundingClientRect(), width = card.clientWidth, height = card.clientHeight;
      const x = Math.max(0, Math.min(width, (clientX - bounds.left) / bounds.width * width));
      const y = Math.max(0, Math.min(height, (clientY - bounds.top) / bounds.height * height));
      const surface = document.createElement('span');
      surface.className = styles.surface; surface.setAttribute('aria-hidden', 'true');
      surface.style.setProperty('--press-x', `${x}px`); surface.style.setProperty('--press-y', `${y}px`);
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
      for (let ring = 0; ring < 3; ring++) {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', String(x)); circle.setAttribute('cy', String(y)); circle.setAttribute('r', '10');
        circle.setAttribute('vector-effect', 'non-scaling-stroke');
        circle.style.transformOrigin = `${x}px ${y}px`; circle.style.animationDelay = `${ring * 85}ms`;
        svg.append(circle);
      }
      const crest = document.createElement('span'); crest.className = styles.crest;
      surface.append(svg, crest); card.append(surface); surfaces.add(surface);
      const removal = window.setTimeout(() => { surface.remove(); surfaces.delete(surface); removals.delete(removal); }, 1300);
      removals.add(removal);
    }
    function radiate(x: number, y: number, origin: 'core' | 'card') {
      if (reduced) return;
      const wave = document.createElement('span');
      wave.className = styles.emission; wave.dataset.pulse = origin;
      wave.style.left = `${x}px`; wave.style.top = `${y}px`;
      const reach = Math.min(1100, Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y)) * 0.95);
      wave.style.setProperty('--pulse-scale', String(reach / 18));
      wave.style.setProperty('--spark-reach', `${Math.min(reach * 0.7, 350)}px`);
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', '0 0 36 36');
      for (let ring = 0; ring < 3; ring++) {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', '18'); circle.setAttribute('cy', '18'); circle.setAttribute('r', '18');
        circle.setAttribute('vector-effect', 'non-scaling-stroke');
        circle.style.animationDelay = `${ring * 115}ms`; svg.append(circle);
      }
      wave.append(svg);
      for (let index = 0; index < 16; index++) {
        const spark = document.createElement('i');
        spark.style.setProperty('--spark-angle', `${index * 22.5 + (origin === 'core' ? 0 : 11)}deg`);
        spark.style.setProperty('--spark-factor', String(0.55 + index % 4 * 0.15));
        spark.style.animationDelay = `${index % 3 * 30}ms`; wave.append(spark);
      }
      water!.append(wave);
      const pulses = water!.querySelectorAll('[data-pulse]');
      if (pulses.length > 3) pulses[0].remove();
      const removal = window.setTimeout(() => { wave.remove(); removals.delete(removal); }, 1850);
      removals.add(removal);
    }
    const press = (event: PointerEvent) => {
      if (!event.isPrimary || event.button !== 0 || !(event.target instanceof Element)) return;
      if (event.target.closest('[data-portal-pulse]')) return;
      const card = event.target.closest<HTMLAnchorElement>('[data-portal-card]');
      if (card) surfaceRipple(card, event.clientX, event.clientY);
      else if (event.target.closest('a, button')) ripple(event.clientX, event.clientY);
    };
    const click = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || !(event.target instanceof Element)) return;
      const core = event.target.closest<HTMLButtonElement>('[data-portal-pulse]');
      if (core) {
        const rect = core.getBoundingClientRect();
        radiate(rect.left + rect.width / 2, rect.top + rect.height / 2, 'core');
        coreFlash?.cancel();
        coreFlash = core.animate?.([{ filter: 'brightness(1)' }, { filter: 'brightness(1.65)' }, { filter: 'brightness(1)' }], { duration: reduced ? 160 : 650, easing: 'ease-out' });
        return;
      }
      if (reduced) return;
      const link = event.target.closest<HTMLAnchorElement>('a[href]');
      if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
      const destination = new URL(link.href, window.location.href);
      if (destination.origin !== window.location.origin || (destination.pathname === location.pathname && destination.search === location.search)) return;
      event.preventDefault();
      if (leaving) return;
      leaving = true;
      arrival?.cancel();
      const cardExit = link.hasAttribute('data-portal-card');
      const rect = link.getBoundingClientRect();
      if (cardExit) {
        selected = link; departingHub = link.closest('main');
        radiate(event.detail === 0 ? rect.left + rect.width / 2 : event.clientX, event.detail === 0 ? rect.top + rect.height * 0.65 : event.clientY, 'card');
        if (event.detail === 0 || !link.querySelector(`.${styles.surface}`)) surfaceRipple(link, rect.left + rect.width / 2, rect.top + rect.height * 0.65);
        link.classList.add(styles.selected);
        link.dataset.departing = 'true';
        if (departingHub) departingHub.dataset.departing = 'true';
        scene.dataset.cardExit = 'true'; water.dataset.cardExit = 'true';
      } else if (event.detail === 0) ripple(rect.left + rect.width / 2, rect.top + rect.height / 2);
      const keyboard = event.detail === 0;
      veil(keyboard ? rect.left + rect.width / 2 : event.clientX, keyboard ? rect.top + rect.height / 2 : event.clientY, cardExit ? 300 : 0);
      // Keep the raised water and lifted card readable before the background fades.
      scene.dataset.leaving = 'true'; water.dataset.leaving = 'true';
      navigation = window.setTimeout(() => { void navigate(`${destination.pathname}${destination.search}${destination.hash}`); }, cardExit ? 820 : 520);
    };
    shell.addEventListener('pointerdown', press, { capture: true });
    shell.addEventListener('click', click);
    return () => {
      shell.removeEventListener('pointerdown', press, { capture: true }); shell.removeEventListener('click', click);
      window.clearTimeout(navigation); removals.forEach(id => window.clearTimeout(id));
      surfaces.forEach(surface => surface.remove());
      if (selected) { selected.classList.remove(styles.selected); delete selected.dataset.departing; }
      if (departingHub) delete departingHub.dataset.departing;
      arrival?.cancel(); coreFlash?.cancel(); water.replaceChildren(); delete scene.dataset.leaving; delete water.dataset.leaving;
      delete scene.dataset.cardExit; delete water.dataset.cardExit;
    };
  }, [location.key, location.pathname, location.search, navigate, reduced]);

  return { shellRef, sceneRef, waterRef };
}
