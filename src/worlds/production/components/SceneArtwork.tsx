import type { CSSProperties, ReactNode } from 'react';
import { useSettings } from '@shared/settings';
import type { Artwork, ProjectScene } from '../types';
import styles from '../Production.module.css';

export function ResponsiveArtwork({ art, critical = false, className }: { art: Artwork; critical?: boolean; className?: string }) {
  const { settings } = useSettings();
  const lite = settings.quality !== 'full';
  return <picture className={className}>
    {art.liteSrc && !lite && <source media="(max-width: 768px)" srcSet={art.liteSrc} />}
    <img src={lite && art.liteSrc ? art.liteSrc : art.src} alt={art.alt} width={art.width} height={art.height} loading={critical ? 'eager' : 'lazy'} decoding="async" fetchPriority={critical ? 'high' : 'auto'} draggable={false} />
  </picture>;
}

export default function SceneArtwork({ scene, children }: { scene: ProjectScene; children?: ReactNode }) {
  return <div className={styles.artwork}>
    <ResponsiveArtwork art={scene.background} critical className={styles.base} />
    <div className={styles.sprites} aria-hidden="true">
      {scene.layers.map(layer => <div key={layer.id} className={styles.sprite} data-piece={layer.id} style={{
        left: `${layer.x / scene.background.width * 100}%`, top: `${layer.y / scene.background.height * 100}%`,
        width: `${layer.width / scene.background.width * 100}%`, height: `${layer.height / scene.background.height * 100}%`,
      } as CSSProperties}><ResponsiveArtwork art={layer.image} critical /></div>)}
    </div>
    {children}
  </div>;
}
