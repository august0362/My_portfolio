import { Link, useParams } from 'react-router';
import { findProject } from '../data/projects';
import useWorldPage from '../hooks/useWorldPage';
import type { Project } from '../types';
import SceneArtwork from './SceneArtwork';
import ServerStatus from './ServerStatus';
import ProjectActions from './ProjectActions';
import Gallery from './Gallery';
import ProjectNotFound from './ProjectNotFound';
import Icon from './Icon';
import ForgeCrest from './ForgeCrest';
import styles from '../Production.module.css';
import atlas from '../Atlas.module.css';

function Detail({ project }: { project: Project }) {
  const headingRef = useWorldPage(project.title);
  return <article className={`${styles.detail} ${atlas.detailAtlas}`} data-scene-interaction="" data-scene-motion="false" data-scene-active="false">
    <div className={atlas.detailBackdrop} aria-hidden="true"><SceneArtwork scene={project.scene} /></div>
    <div className={atlas.dossier}>
    <header className={`${styles.detailHero} ${atlas.dossierHero}`}>
      <Link className={`${styles.backToProduction} ${atlas.dossierBack}`} to="/production" aria-label="Back to Production"><Icon name="close" /></Link>
      <div className={`${styles.heroContent} ${atlas.dossierHeading}`}>
        <div className={atlas.dossierCrest}><ForgeCrest /></div>
        <p className={`${styles.category} ${atlas.dossierCategory}`}>{project.category}</p>
        <h1 ref={headingRef} tabIndex={-1}>{project.title}</h1>
        <p className={`${styles.subtitle} ${atlas.dossierSubtitle}`}>{project.subtitle}</p>
        <div className={styles.projectState}><span>{project.developmentStatus.label}</span><ServerStatus key={project.slug} endpoint={project.statusEndpoint} /></div>
        <ProjectActions project={project} />
        {project.demoNote && <p className={`${styles.demoNote} ${atlas.dossierNote}`}>{project.demoNote}</p>}
      </div>
      <span className={atlas.dossierCaption}>Portfolio concept artwork · Not gameplay</span>
    </header>
    <div className={`${styles.detailBody} ${atlas.dossierBody}`}>
      <section className={styles.introduction} aria-labelledby="about-project">
        <h2 id="about-project">{project.introductionHeading}</h2>
        <div><p className={styles.lead}>{project.description}</p><p>{project.objective}</p><p className={styles.factNote}>{project.developmentStatus.detail}</p></div>
      </section>
      <section className={styles.approachesSection} aria-labelledby="approaches-title">
        <div className={styles.sectionHeading}><h2 id="approaches-title">The approaches</h2><p>The ideas behind the experience.</p></div>
        <div className={styles.approaches}>{project.approaches.map(approach => <div key={approach.name}><span className={styles.smallStar} aria-hidden="true">✧</span><h3>{approach.name}</h3><p>{approach.description}</p></div>)}</div>
      </section>
      <section className={styles.featuresSection} aria-labelledby="experience-title">
        <div><h2 id="experience-title">{project.featuresHeading}</h2><ul className={styles.featureList}>{project.features.map(feature => <li key={feature}><span aria-hidden="true">◇</span>{feature}</li>)}</ul></div>
        <div className={styles.technologyPanel}><Icon name="source" /><h3>The toolkit</h3><ul>{project.technologies.map(technology => <li key={technology}>{technology}</li>)}</ul><p>{project.platformNote}</p></div>
      </section>
      <section className={styles.visualsSection} aria-labelledby="visuals-title"><div className={styles.sectionHeading}><h2 id="visuals-title">A closer look</h2><p>{project.gallery.every(image => image.kind === 'concept') ? 'Concept art for the portfolio experience.' : 'A visual journal of the project.'}</p></div><Gallery images={project.gallery} /></section>
      <section className={styles.contributionSection} aria-labelledby="contribution-title"><div><h2 id="contribution-title">My part in the project</h2><p>{project.teamContext}</p></div><dl>{project.contributions.map(contribution => <div key={contribution.role}><dt>{contribution.role}</dt><dd>{contribution.description}</dd></div>)}</dl></section>
      <footer className={styles.detailFooter}><div><span className={styles.smallStar} aria-hidden="true">✧</span><h2>Explore the work.</h2><p>Continue with the project resources.</p></div><ProjectActions project={project} sourceLabel="View Source" /><Link className={styles.footerBack} to="/production"><Icon name="left" /> Return to The Forge</Link></footer>
    </div>
    </div>
  </article>;
}

export default function ProjectDetail() {
  const { slug } = useParams();
  const project = findProject(slug);
  return project ? <Detail key={project.slug} project={project} /> : <ProjectNotFound />;
}
