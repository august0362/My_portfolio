import { useEffect, useRef, useState } from 'react';
import { useCopy } from '@shared/i18n';
import { COPY } from '../data/locale';
import type { GalleryImage } from '../types';
import Icon from './Icon';
import styles from '../Production.module.css';

export default function Gallery({ images }: { images: readonly GalleryImage[] }) {
  const t = useCopy(COPY);
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const image = images[index];
  const step = (direction: number) => setIndex(current => (current + direction + images.length) % images.length);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !open) return;
    dialog.showModal();
    return () => { dialog.close(); triggerRef.current?.focus({ preventScroll: true }); };
  }, [open]);
  if (!image) return <p>{t.noImages}</p>;
  return <div className={styles.gallery}>
    <div className={styles.galleryFrame}>
      <button type="button" ref={triggerRef} className={styles.galleryOpen} onClick={() => setOpen(true)} aria-label={`${t.enlarge}: ${image.title}`}><img src={image.src} alt={image.alt} width={image.width} height={image.height} loading="lazy" decoding="async" /><span><Icon name="expand" /> {t.enlarge}</span></button>
      <span className={styles.imageKind}>{image.kind === 'concept' ? t.conceptKind : t.gameplayKind}</span>
    </div>
    <div className={styles.galleryInfo} aria-live="polite">
      <div><h3>{image.title}</h3><p>{image.caption}</p></div>
      {images.length > 1 && <div className={styles.galleryControls}>
        <button type="button" aria-label={t.previousImage} onClick={() => step(-1)}><Icon name="left" /></button>
        <span>{index + 1} / {images.length}</span>
        <button type="button" aria-label={t.nextImage} onClick={() => step(1)}><Icon name="right" /></button>
      </div>}
    </div>
    {images.length > 1 && <div className={styles.thumbnails} role="group" aria-label={t.chooseImage}>{images.map((item, itemIndex) => <button type="button" key={item.src} aria-label={`${t.show}: ${item.title}`} aria-pressed={itemIndex === index} onClick={() => setIndex(itemIndex)}><img src={item.src} alt="" width={160} height={90} loading="lazy" decoding="async" /></button>)}</div>}
    <dialog ref={dialogRef} className={styles.lightbox} aria-label={t.artwork} onCancel={() => setOpen(false)} onClose={() => setOpen(false)} onKeyDown={event => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); step(event.key === 'ArrowLeft' ? -1 : 1); }
    }} onClick={event => { if (event.target === event.currentTarget) { const rect = event.currentTarget.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) setOpen(false); } }}>
      <button className={styles.lightboxClose} type="button" aria-label={t.closeArtwork} onClick={() => setOpen(false)} autoFocus><Icon name="close" /></button>
      <img src={image.src} alt={image.alt} width={image.width} height={image.height} decoding="async" />
      <div className={styles.galleryInfo} aria-live="polite"><div><h3>{image.title}</h3><p>{image.caption}</p></div>{images.length > 1 && <div className={styles.galleryControls}><button type="button" aria-label={t.previousImage} onClick={() => step(-1)}><Icon name="left" /></button><span>{index + 1} / {images.length}</span><button type="button" aria-label={t.nextImage} onClick={() => step(1)}><Icon name="right" /></button></div>}</div>
    </dialog>
  </div>;
}
