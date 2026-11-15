import type { Project } from '../types';
import base from '../assets/chess-ai/chess-base.webp';
import baseLite from '../assets/chess-ai/chess-base-lite.webp';
import concept from '../assets/chess-ai/chess-concept.webp';
import study from '../assets/chess-ai/environment-study.webp';
import pawn from '../assets/chess-ai/silver-pawn.webp';
import pawnLite from '../assets/chess-ai/silver-pawn-lite.webp';
import mini from '../assets/chess-ai/silver-mini.webp';
import miniLite from '../assets/chess-ai/silver-mini-lite.webp';
import rook from '../assets/chess-ai/chrome-rook.webp';
import rookLite from '../assets/chess-ai/chrome-rook-lite.webp';
import dust from '../assets/chess-ai/dust.webp';

const cover = {
  src: concept, width: 1440, height: 810,
  alt: 'Concept artwork of reflective silver chess pieces beneath celestial rings in an obsidian hall.',
};

// Project facts: owner-supplied brief and github.com/august0362/BTL_AI.
// Scene geometry: the supplied layers_manifest.json, in its 3840 × 2160 space.
export const projects: readonly Project[] = [{
  slug: 'chess-ai',
  title: 'Chess AI Tournament',
  subtitle: 'Four approaches. One board.',
  description: 'A chess arena where people and independently developed AI agents meet, compete, and revisit their games.',
  objective: 'Bring different approaches to chess AI into one playable environment, with shared matches, tournaments, and tools for reviewing play.',
  introductionHeading: 'A meeting of minds, across sixty-four squares.',
  featuresHeading: 'Built to play. Built to compare.',
  platformNote: 'Play Game opens the game website. The GitHub repository documents the Windows / Pygame application. This portfolio does not run chess inference.',
  category: 'Artificial intelligence · Chess application',
  developmentStatus: {
    label: 'Playable chess project',
    detail: 'The features described here follow the Windows / Pygame repository. The owner-provided game website is linked through Play Game; its feature set has not been independently verified.',
  },
  features: [
    'Human vs Bot and Bot vs Bot matches',
    'Tournaments and AI rankings',
    'Game history and replay',
    'Position evaluation and game analysis interfaces',
  ],
  approaches: [
    { name: 'Alpha-Beta + Linear Regression', description: 'Game-tree search paired with a learned linear evaluation.' },
    { name: 'Alpha-Beta + Genetic Algorithm', description: 'An alternative search agent with an evaluation tuned through evolution.' },
    { name: 'Monte Carlo Tree Search', description: 'A separate agent exploring positions through repeated simulations.' },
    { name: 'Deep Reinforcement Learning', description: 'The RL Hybrid agent brings deep reinforcement learning into the same arena.' },
  ],
  technologies: ['Python', 'Pygame', 'python-chess', 'PyTorch'],
  contributions: [
    { role: 'Product Owner', description: 'Shaped the product direction and the experience of playing and comparing agents.' },
    { role: 'Lead Integrator', description: 'Brought the team’s independently developed agents together with the application.' },
    { role: 'GUI / UX developer', description: 'Developed the interface and the flows for gameplay, tournaments, and review.' },
    { role: 'Deep RL developer', description: 'Developed the deep reinforcement learning agent within the team’s shared project.' },
  ],
  teamContext: 'A team project with four independently developed AI approaches. My work connected the product, interface, integration, and Deep RL development.',
  coverImage: cover,
  scene: {
    background: { src: base, liteSrc: baseLite, width: 3840, height: 2160, alt: cover.alt },
    layers: [
      { id: 'silver-pawn', image: { src: pawn, liteSrc: pawnLite, width: 327, height: 374, alt: '' }, x: 1118, y: 115, width: 327, height: 374, depth: 0.9, motion: { x: -12, y: -20, rotate: -2, duration: 8.5, delay: -2 } },
      { id: 'silver-mini', image: { src: mini, liteSrc: miniLite, width: 92, height: 101, alt: '' }, x: 1580, y: 223, width: 92, height: 101, depth: 0.5, motion: { x: 6, y: -12, rotate: 3, duration: 7, delay: -4 } },
      { id: 'chrome-rook', image: { src: rook, liteSrc: rookLite, width: 425, height: 517, alt: '' }, x: 3027, y: 257, width: 425, height: 517, depth: 1, motion: { x: 15, y: -23, rotate: 2.3, duration: 10, delay: -6 } },
    ],
    particles: dust,
  },
  gallery: [
    { ...cover, title: 'The celestial chess hall', kind: 'concept', caption: 'Owner-supplied concept artwork for this portfolio world. This is not a gameplay screenshot.' },
    { src: study, width: 1920, height: 1080, alt: 'An alternative concept study of a silver chessboard in a celestial metallic hall.', title: 'Environment study', kind: 'concept', caption: 'An alternative clean-plate concept from the supplied artwork pack. Current gameplay screenshots have not been supplied.' },
  ],
  hotspotPosition: { x: 0.505, y: 0.49 },
  links: { demo: 'https://admin-linux.tail451544.ts.net/', repository: 'https://github.com/august0362/BTL_AI' },
  demoNote: 'Play the web version, or explore the desktop application on GitHub.',
}];

export function findProject(slug: string | undefined) {
  return projects.find(project => project.slug === slug);
}
