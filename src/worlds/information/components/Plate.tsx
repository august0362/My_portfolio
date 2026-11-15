import type { CSSProperties } from 'react';
import type { Photo } from '../types';
import styles from './Plate.module.css';

interface Props {
  photo: Photo;
  /** Use the full-size source (lightbox) instead of the thumbnail. */
  full?: boolean;
  /** Variation index for placeholder gradients. */
  index?: number;
  className?: string;
}

/** A real optimized photo, or a clearly labeled placeholder plate with the same proportions. */
export default function Plate({ photo, full = false, index = 0, className = '' }: Props) {
  const src = full ? photo.src : (photo.thumb ?? photo.src);
  if (src) {
    return (
      <img
        className={`${styles.img} ${className}`}
        src={src}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        loading={full ? 'eager' : 'lazy'}
        decoding="async"
      />
    );
  }
  const style = {
    aspectRatio: `${photo.width} / ${photo.height}`,
    '--angle': `${150 + ((index * 37) % 80)}deg`,
    '--spot-x': `${20 + ((index * 29) % 60)}%`,
  } as CSSProperties;
  return (
    <div className={`${styles.plate} ${className}`} style={style} role="img" aria-label={photo.alt}>
      <span className={styles.frame} aria-hidden="true" />
      <span className={styles.mark} aria-hidden="true">
        ✦
      </span>
      <span className={styles.label} aria-hidden="true">
        {photo.width > photo.height ? '3 : 2' : '2 : 3'} · pending
      </span>
    </div>
  );
}
