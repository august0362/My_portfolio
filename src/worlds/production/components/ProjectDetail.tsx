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
import styles from '../Production.module.css';

function Detail({ project }: { project: Project }) {
  const headingRef = useWorldPage(project.title);
  return <article className={styles.detail}>
    <header className={styles.detailHero}>
      <div className={styles.heroArtwork}><SceneArtwork scene={project.scene} /></div>
      <div className={styles.heroShade} aria-hidden="true" />
      <Link className={styles.backToProduction} to="/production"><Icon name="left" /> Back to Production</Link>
      <div className={styles.heroContent}>
        <p className={styles.category}>{project.category}</p>
        <h1 ref={headingRef} tabIndex={-1}>{project.title}</h1>
        <p className={styles.subtitle}>{project.subtitle}</p>
        <div className={styles.projectState}><span>{project.developmentStatus.label}</span><ServerStatus key={project.slug} endpoint={project.statusEndpoint} /></div>
        <ProjectActions project={project} />
        {project.demoNote && <p className={styles.demoNote}>{project.demoNote}</p>}
      </div>
      <span className={styles.heroArtCaption}>Portfolio concept artwork · Not gameplay</span>
    </header>
    <div className={styles.detailBody}>
      <section className={styles.introduction} aria-labelledby="about-project">
        <h2 id="about-project">{project.introductionHeading}</h2>
        <div><p className={styles.lead}>{project.description}</p><p>{project.objective}</p><p className={styles.factNote}>{project.developmentStatus.detail}</p></div>
      </section>
      <section className={styles.approachesSection} aria-labelledby="approaches-title">
        <div className={styles.sectionHeading}><h2 id="approaches-title">Inside the arena</h2><p>Different paths to the next move.</p></div>
        <div className={styles.approaches}>{project.approaches.map(approach => <div key={approach.name}><span className={styles.smallStar} aria-hidden="true">✧</span><h3>{approach.name}</h3><p>{approach.description}</p></div>)}</div>
      </section>
      <section className={styles.featuresSection} aria-labelledby="experience-title">
        <div><h2 id="experience-title">{project.featuresHeading}</h2><ul className={styles.featureList}>{project.features.map(feature => <li key={feature}><span aria-hidden="true">◇</span>{feature}</li>)}</ul></div>
        <div className={styles.technologyPanel}><Icon name="source" /><h3>The toolkit</h3><ul>{project.technologies.map(technology => <li key={technology}>{technology}</li>)}</ul><p>The game runs as a desktop application. This world presents the project; it does not run chess inference.</p></div>
      </section>
      <section className={styles.visualsSection} aria-labelledby="visuals-title"><div className={styles.sectionHeading}><h2 id="visuals-title">A world imagined</h2><p>Concept art for the portfolio experience.</p></div><Gallery images={project.gallery} /></section>
      <section className={styles.contributionSection} aria-labelledby="contribution-title"><div><h2 id="contribution-title">My part in the project</h2><p>{project.teamContext}</p></div><dl>{project.contributions.map(contribution => <div key={contribution.role}><dt>{contribution.role}</dt><dd>{contribution.description}</dd></div>)}</dl></section>
      <footer className={styles.detailFooter}><div><span className={styles.smallStar} aria-hidden="true">✧</span><h2>Explore the work.</h2><p>Read the source, or visit the owner’s demo.</p></div><ProjectActions project={project} sourceLabel="View Source" /><Link className={styles.footerBack} to="/production"><Icon name="left" /> Return to The Forge</Link></footer>
    </div>
  </article>;
}

export default function ProjectDetail() {
  const { slug } = useParams();
  const project = findProject(slug);
  return project ? <Detail key={project.slug} project={project} /> : <ProjectNotFound />;
}
