import { Link } from 'react-router';
import { projects } from '../data/projects';
import useMapNavigation from '../hooks/useMapNavigation';
import useWorldPage from '../hooks/useWorldPage';
import useProjectTransition from '../hooks/useProjectTransition';
import SceneArtwork from './SceneArtwork';
import Icon from './Icon';
import styles from '../Production.module.css';

export default function Overview() {
  const project = projects[0];
  const map = useMapNavigation(project.scene.background.width / project.scene.background.height);
  const headingRef = useWorldPage('Explore');
  const transition = useProjectTransition();
  return <section className={styles.overview} ref={transition.rootRef} aria-labelledby="forge-title">
    <div className={styles.map} ref={map.viewportRef} tabIndex={0} role="region" aria-label="Explore the project world" aria-describedby="map-help" data-dragging={map.dragging} data-scene-interaction="" {...map.handlers}>
      <div className={styles.mapPlane} data-map-plane="" style={{ width: map.size.planeWidth, height: map.size.planeHeight, transform: `translate(calc(-50% + ${map.view.x}px), calc(-50% + ${map.view.y}px)) scale(${map.view.zoom})` }}>
        <SceneArtwork scene={project.scene} />
        {projects.map(item => <Link key={item.slug} className={styles.hotspot} to={`/production/${item.slug}`} onClickCapture={transition.enterProject} data-project-entry="" style={{ left: `${item.hotspotPosition.x * 100}%`, top: `${item.hotspotPosition.y * 100}%` }} aria-label={`Explore ${item.title}`} aria-describedby={`marker-${item.slug}`} onFocus={event => { if (event.currentTarget.matches(':focus-visible')) map.focusPoint(item.hotspotPosition); }}>
          <span className={styles.marker}><svg viewBox="0 0 48 48" aria-hidden="true"><path d="m24 4 20 20-20 20L4 24Z" /><path d="m24 13 11 11-11 11-11-11Z" /><circle cx="24" cy="24" r="3" /></svg></span>
          <span className={styles.markerLabel} id={`marker-${item.slug}`}><strong>{item.title}</strong><span>Enter the arena <Icon name="arrow" /></span></span>
        </Link>)}
      </div>
    </div>
    <div className={styles.shade} aria-hidden="true" />
    <header className={styles.overviewHeader}>
      <span className={styles.worldName}><Icon name="compass" /> Production world</span>
      <h1 id="forge-title" ref={headingRef} tabIndex={-1}>The Forge</h1>
      <p>A world of ideas, made tangible.</p>
    </header>
    <aside className={styles.preview} aria-label="Featured project">
      <span className={styles.previewCategory}>{project.category.split(' · ')[0]}</span>
      <h2>{project.title}</h2>
      <p>{project.description}</p>
      <Link className={styles.primaryButton} to={`/production/${project.slug}`} onClickCapture={transition.enterProject} data-project-entry="">View project <Icon name="arrow" /></Link>
    </aside>
    <div className={styles.exploreDock}>
      <p id="map-help">Drag to explore <span>·</span> Scroll to zoom<span className={styles.keyboardHelp}> · Arrow keys to pan</span></p>
      <div className={styles.mapControls} role="group" aria-label="Scene view">
        <button type="button" aria-label="Zoom out" disabled={map.view.zoom <= 1.001} onClick={() => map.zoomBy(-0.15)}><Icon name="minus" /></button>
        <output aria-label="Zoom level">{Math.round(map.view.zoom * 100)}%</output>
        <button type="button" aria-label="Zoom in" disabled={map.view.zoom >= 1.799} onClick={() => map.zoomBy(0.15)}><Icon name="plus" /></button>
        <span className={styles.controlDivider} />
        <button type="button" aria-label="Reset view" onClick={map.reset}><Icon name="reset" /></button>
      </div>
    </div>
    <span className={styles.artCaption}>Concept artwork · Not gameplay</span>
  </section>;
}
