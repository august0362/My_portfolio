import type { CSSProperties, ReactNode } from 'react';
import { useSettings } from '@shared/settings';
import type { Artwork, ProjectScene } from '../types';
import useSceneAtmosphere from '../hooks/useSceneAtmosphere';
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
  const { sceneRef, canvasRef } = useSceneAtmosphere();
  return <div className={styles.artwork} ref={sceneRef} data-chess-scene="" data-motion="false" data-active="false">
    <div className={styles.sceneFrame} data-scene-frame="">
      <ResponsiveArtwork art={scene.background} critical className={styles.base} />
      <div className={styles.sprites} aria-hidden="true">
        {scene.layers.map(layer => <div key={layer.id} className={styles.sprite} data-piece={layer.id} style={{
          left: `${layer.x / scene.background.width * 100}%`, top: `${layer.y / scene.background.height * 100}%`,
          width: `${layer.width / scene.background.width * 100}%`, height: `${layer.height / scene.background.height * 100}%`,
          '--float-x': `${layer.motion.x / layer.width * 100}%`, '--float-y': `${layer.motion.y / layer.height * 100}%`,
          '--float-rotate': `${layer.motion.rotate}deg`, '--float-duration': `${layer.motion.duration}s`, '--float-delay': `${layer.motion.delay}s`,
          '--depth-x': `${8 * layer.depth / layer.width * 100}%`, '--depth-y': `${6 * layer.depth / layer.height * 100}%`,
        } as CSSProperties}><div className={styles.spriteDepth}><div className={styles.floatingPiece}><ResponsiveArtwork art={layer.image} critical /></div></div></div>)}
      </div>
      <div className={styles.sceneTint} aria-hidden="true" />
      {scene.particles && <img className={styles.dust} src={scene.particles} width={1920} height={1080} alt="" aria-hidden="true" loading="lazy" decoding="async" draggable={false} />}
      <div className={styles.sceneGlow} aria-hidden="true" />
      <canvas ref={canvasRef} className={styles.atmosphereCanvas} aria-hidden="true" />
    </div>
    {children}
  </div>;
}
