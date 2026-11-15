import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent, type RefObject } from 'react';
import { albums } from '../data/albums';
import { delay, useReveal } from '../motion';
import styles from './Gallery.module.css';
import { CORNER, RingedPlanet } from './celestial';
import Lightbox from './Lightbox';
import Plate from './Plate';
import { idealRowHeight, justifyRows } from './rows';
import Section from './Section';
import shared from './Section.module.css';

const pad = (n: number) => String(n).padStart(2, '0');

/** Tracks an element's content width (used to plan justified rows). `key` re-attaches after a remount. */
function useWidth(ref: RefObject<HTMLElement | null>, key: string, fallback: number) {
  const [width, setWidth] = useState(fallback);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const w = Math.round(entry.contentRect.width);
      if (w > 0) setWidth(w); // A detached or hidden panel reports 0; keep the last real width.
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref, key]);
  return width;
}

export default function Gallery({ reduced }: { reduced: boolean }) {
  const [albumIndex, setAlbumIndex] = useState(0);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const album = albums[albumIndex];
  const width = useWidth(panelRef, album.id, 1200);
  // Approximates the .row column gap for planning only; rendered heights stay equal whatever the gap.
  const gap = width > 760 ? 24 : 12;
  const rows = useMemo(
    () => justifyRows(album.photos.map((p) => p.width / p.height), width, gap, idealRowHeight(width)),
    [album, width, gap],
  );

  useReveal(panelRef, [albumIndex]);
  const close = useCallback(() => setOpenIndex(null), []);

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const last = albums.length - 1;
    const next =
      e.key === 'ArrowRight' || e.key === 'ArrowDown' ? (albumIndex === last ? 0 : albumIndex + 1)
      : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? (albumIndex === 0 ? last : albumIndex - 1)
      : e.key === 'Home' ? 0
      : e.key === 'End' ? last
      : null;
    if (next === null) return;
    e.preventDefault();
    setAlbumIndex(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <Section
      id="gallery"
      number="03"
      kicker="Photographs"
      waves
      title={
        <>
          Fragments <em>of Me</em>
        </>
      }
    >
      <RingedPlanet className={CORNER} />

      <div className={styles.tabs} role="tablist" aria-label="Albums">
        {albums.map((a, i) => (
          <button
            key={a.id}
            ref={(el) => {
              tabRefs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`tab-${a.id}`}
            className={styles.tab}
            aria-selected={i === albumIndex}
            aria-controls="album-panel"
            tabIndex={i === albumIndex ? 0 : -1}
            onClick={() => setAlbumIndex(i)}
            onKeyDown={onTabKey}
            data-reveal="up"
            style={delay(i * 110)}
          >
            <span className={styles.tabNum}>{pad(i + 1)}</span>
            <span className={styles.tabTitle}>{a.title}</span>
            <span className={styles.tabCount}>{a.photos.length}</span>
            {a.date && (
              <time className={styles.tabDate} dateTime={a.date.iso}>
                {a.date.label}
              </time>
            )}
          </button>
        ))}
      </div>

      <div
        key={album.id}
        ref={panelRef}
        id="album-panel"
        role="tabpanel"
        aria-labelledby={`tab-${album.id}`}
        className={styles.panel}
      >
        {album.placeholder && (
          <p className={styles.pending} data-reveal="fade">
            <span className={shared.badge}>Photos pending</span>
            <span>
              Photos appear once the image pipeline strips their metadata. Plates show the planned proportions.
            </span>
          </p>
        )}

        <div className={styles.rows} role="list">
          {rows.map((row) => (
            <div key={row[0]} className={styles.row}>
              {row.map((i, k) => {
                const photo = album.photos[i];
                return (
                  <div
                    key={photo.id}
                    role="listitem"
                    className={styles.tile}
                    style={{ '--ratio': photo.width / photo.height } as CSSProperties}
                  >
                    <button
                      type="button"
                      className={styles.tileButton}
                      onClick={() => setOpenIndex(i)}
                      aria-label={`Open in viewer: ${photo.alt}`}
                      aria-haspopup="dialog"
                    >
                      <span className={styles.tileMedia} data-reveal="mask" style={delay(k * 120)}>
                        <Plate photo={photo} index={i} />
                      </span>
                      <span className={styles.tileIndex} aria-hidden="true">
                        {pad(i + 1)} / {pad(album.photos.length)}
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <Lightbox
        photos={album.photos}
        title={album.title}
        index={openIndex}
        onIndex={setOpenIndex}
        onClose={close}
        reduced={reduced}
      />
    </Section>
  );
}
