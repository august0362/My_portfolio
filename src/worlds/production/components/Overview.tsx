import { useState } from 'react';
import { Link } from 'react-router';
import { projects } from '../data/projects';
import useMapNavigation from '../hooks/useMapNavigation';
import useWorldPage from '../hooks/useWorldPage';
import useProjectTransition from '../hooks/useProjectTransition';
import SceneArtwork from './SceneArtwork';
import Icon from './Icon';
import ForgeCrest from './ForgeCrest';
import styles from '../Atlas.module.css';

export default function Overview() {
  const [selectedSlug, setSelectedSlug] = useState(projects[0].slug);
  const project = projects.find(item => item.slug === selectedSlug) ?? projects[0];
  const map = useMapNavigation(project.scene.background.width / project.scene.background.height);
  const headingRef = useWorldPage('Explore');
  const transition = useProjectTransition();
  return <section className={styles.atlas} ref={transition.rootRef} aria-labelledby="forge-title" data-atlas-scene="" data-scene-interaction="" data-scene-motion="false" data-scene-active="false" data-exploring={map.dragging}>
    <div className={styles.viewport} ref={map.viewportRef} tabIndex={0} role="region" aria-label="Explore the project world" aria-describedby="map-help" data-dragging={map.dragging} {...map.handlers}>
      <div className={styles.plane} data-map-plane="" style={{ width: map.size.planeWidth, height: map.size.planeHeight, transform: `translate(calc(-50% + ${map.view.x}px), calc(-50% + ${map.view.y}px)) scale(${map.view.zoom})` }}>
        <SceneArtwork scene={project.scene} />
      </div>
    </div>
    <div className={styles.vignette} aria-hidden="true" />
    <div className={styles.frame} aria-hidden="true"><span /><span /><span /><span /></div>
    <header className={styles.masthead} data-atlas-ui="">
      <Icon name="compass" />
      <h1 id="forge-title" ref={headingRef} tabIndex={-1}>The Forge</h1>
      <span>Production world</span>
    </header>
    <div className={styles.destinationAnchor} data-atlas-ui="">
      <div className={styles.destinationFloat}>
        <section className={styles.destination} aria-labelledby="destination-title" data-project-board="">
          <div className={styles.crest}><ForgeCrest /></div>
          <span className={styles.category}>{project.category.split(' · ')[0]}</span>
          <div className={styles.titleRule}><i aria-hidden="true" /><h2 id="destination-title">{project.title}</h2><i aria-hidden="true" /></div>
          <p className={styles.subtitle}>{project.subtitle}</p>
          <p className={styles.description}>{project.description}</p>
          <Link className={styles.enter} to={`/production/${project.slug}`} aria-label={`Explore ${project.title}`} onClickCapture={transition.enterProject} data-project-entry="">
            <span className={styles.enterWater} aria-hidden="true"><span /><span /><span /><Icon name="arrow" /></span>
            <span>View project</span>
          </Link>
        </section>
      </div>
    </div>
    <nav className={styles.destinations} aria-label="Project destinations" data-atlas-ui="">
      <span className={styles.railHeading}>Destinations</span>
      {projects.map(item => <button type="button" key={item.slug} aria-label={`Focus ${item.title}`} aria-pressed={item.slug === project.slug} onClick={() => { setSelectedSlug(item.slug); map.reset(); map.focusPoint(item.hotspotPosition); }}><span>{item.title}</span><i aria-hidden="true" /></button>)}
    </nav>
    <div className={styles.exploreDock} data-atlas-ui="">
      <div className={styles.explorationHint}><Icon name="compass" /><p id="map-help">Drag to explore <span>Scroll to zoom · Arrow keys to pan</span></p></div>
      <div className={styles.mapControls} role="group" aria-label="Scene view">
        <button type="button" aria-label="Zoom out" disabled={map.view.zoom <= 1.001} onClick={() => map.zoomBy(-0.15)}><Icon name="minus" /></button>
        <output aria-label="Zoom level">{Math.round(map.view.zoom * 100)}%</output>
        <button type="button" aria-label="Zoom in" disabled={map.view.zoom >= 1.799} onClick={() => map.zoomBy(0.15)}><Icon name="plus" /></button>
        <span className={styles.controlDivider} />
        <button type="button" aria-label="Reset view" onClick={map.reset}><Icon name="reset" /></button>
      </div>
    </div>
    <span className={styles.artCaption} data-atlas-ui="">Concept artwork · Not gameplay</span>
  </section>;
}
