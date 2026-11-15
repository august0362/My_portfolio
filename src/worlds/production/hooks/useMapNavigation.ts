import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent, PointerEvent } from 'react';
import { boundView, fitScene, revealPoint, zoomView } from './mapMath';
import type { MapSize, MapView } from './mapMath';

const INITIAL: MapView = { x: 0, y: 0, zoom: 1 };

export default function useMapNavigation(aspect: number) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<MapSize>(() => fitScene(1280, 800, aspect));
  const [view, setView] = useState(INITIAL);
  const [dragging, setDragging] = useState(false);
  const drag = useRef<{ id: number; x: number; y: number; view: MapView } | null>(null);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const resize = () => {
      const next = fitScene(viewport.clientWidth, viewport.clientHeight, aspect);
      setSize(next); setView(current => boundView(current, next));
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, [aspect]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const wheel = (event: WheelEvent) => {
      if ((event.target as Element).closest('button, a')) return;
      event.preventDefault();
      const rect = viewport.getBoundingClientRect();
      setView(current => zoomView(current, current.zoom * Math.exp(-Math.max(-120, Math.min(120, event.deltaY)) * 0.002), size, { x: event.clientX - rect.left - rect.width / 2, y: event.clientY - rect.top - rect.height / 2 }));
    };
    viewport.addEventListener('wheel', wheel, { passive: false });
    return () => viewport.removeEventListener('wheel', wheel);
  }, [size]);

  function endDrag(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerId !== drag.current?.id) return;
    drag.current = null; setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  }

  const handlers = {
    onPointerDown(event: PointerEvent<HTMLDivElement>) {
      if (!event.isPrimary || event.button !== 0 || (event.target as Element).closest('a, button')) return;
      drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY, view };
      event.currentTarget.setPointerCapture(event.pointerId); setDragging(true);
    },
    onPointerMove(event: PointerEvent<HTMLDivElement>) {
      const active = drag.current;
      if (!active || active.id !== event.pointerId) return;
      setView(boundView({ ...active.view, x: active.view.x + event.clientX - active.x, y: active.view.y + event.clientY - active.y }, size));
    },
    onPointerUp: endDrag, onPointerCancel: endDrag, onLostPointerCapture: endDrag,
    onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
      if (event.target !== event.currentTarget) return;
      const directions: Record<string, [number, number]> = { ArrowLeft: [60, 0], ArrowRight: [-60, 0], ArrowUp: [0, 60], ArrowDown: [0, -60] };
      const direction = directions[event.key];
      if (direction) { event.preventDefault(); setView(current => boundView({ ...current, x: current.x + direction[0], y: current.y + direction[1] }, size)); }
      else if (event.key === '+' || event.key === '=') { event.preventDefault(); zoomBy(0.15); }
      else if (event.key === '-') { event.preventDefault(); zoomBy(-0.15); }
      else if (event.key === 'Home') { event.preventDefault(); setView(INITIAL); }
    },
  };

  function zoomBy(delta: number) { setView(current => zoomView(current, current.zoom + delta, size)); }
  function focusPoint(point: { x: number; y: number }) { setView(current => revealPoint(current, size, point)); }
  return { viewportRef, size, view, dragging, handlers, zoomBy, focusPoint, reset: () => setView(INITIAL) };
}
