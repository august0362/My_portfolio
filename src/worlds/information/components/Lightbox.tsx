import { useEffect, useRef, type CSSProperties, type KeyboardEvent, type MouseEvent, type PointerEvent } from 'react';
import type { Photo } from '../types';
import styles from './Lightbox.module.css';
import Plate from './Plate';

interface Props {
  photos: Photo[];
  title: string;
  index: number | null;
  onIndex: (i: number) => void;
  onClose: () => void;
  reduced: boolean;
}

const pad = (n: number) => String(n).padStart(2, '0');

/** Modal viewer on native <dialog>: focus containment, Esc and top-layer come from the platform. */
export default function Lightbox({ photos, title, index, onIndex, onClose, reduced }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const swipeX = useRef<number | null>(null);
  const open = index !== null;
  const photo = index !== null ? photos[index] : undefined;
  const count = photos.length;

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      d.showModal();
    } else if (!open && d.open) {
      d.close();
    }
  }, [open]);

  // Every close path (Esc, button, backdrop) ends in the native close event.
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    const handle = () => {
      onClose();
      returnFocus.current?.focus();
    };
    d.addEventListener('close', handle);
    return () => d.removeEventListener('close', handle);
  }, [onClose]);

  const close = () => ref.current?.close();
  const step = (dir: 1 | -1) => {
    if (index !== null) onIndex((index + dir + count) % count);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDialogElement>) => {
    if (e.key === 'ArrowRight') step(1);
    else if (e.key === 'ArrowLeft') step(-1);
    else return;
    e.preventDefault();
  };

  const onClick = (e: MouseEvent<HTMLDialogElement>) => {
    if ((e.target as HTMLElement).hasAttribute('data-dismiss')) close();
  };

  const onPointerDown = (e: PointerEvent<HTMLDialogElement>) => {
    swipeX.current = e.pointerType === 'mouse' ? null : e.clientX;
  };
  const onPointerUp = (e: PointerEvent<HTMLDialogElement>) => {
    if (swipeX.current === null) return;
    const dx = e.clientX - swipeX.current;
    swipeX.current = null;
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
  };

  const ratio = photo ? photo.width / photo.height : 1;

  return (
    <dialog
      ref={ref}
      className={styles.dialog}
      data-motion={reduced ? 'reduced' : 'full'}
      aria-label={`${title}: photo viewer`}
      onKeyDown={onKeyDown}
      onClick={onClick}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    >
      {photo && index !== null && (
        <div className={styles.stage} data-dismiss>
          <header className={styles.bar}>
            <p className={styles.counter} aria-live="polite">
              <span className={styles.album}>{title}</span>
              <span>
                {pad(index + 1)} / {pad(count)}
              </span>
            </p>
            <button type="button" className={styles.close} onClick={close}>
              Close <span aria-hidden="true">✕</span>
            </button>
          </header>

          <button type="button" className={`${styles.nav} ${styles.prev}`} onClick={() => step(-1)} aria-label="Previous photo">
            <span aria-hidden="true">←</span>
          </button>

          <figure key={photo.id} className={styles.figure} style={{ '--ratio': ratio } as CSSProperties}>
            <div className={styles.media}>
              <Plate photo={photo} full index={index} />
            </div>
            <figcaption className={styles.caption}>{photo.caption ?? photo.alt}</figcaption>
          </figure>

          <button type="button" className={`${styles.nav} ${styles.next}`} onClick={() => step(1)} aria-label="Next photo">
            <span aria-hidden="true">→</span>
          </button>

          <p className={styles.hint} aria-hidden="true">
            ← → to browse · Esc to close
          </p>
        </div>
      )}
    </dialog>
  );
}
