export interface Artwork {
  src: string;
  liteSrc?: string;
  width: number;
  height: number;
  alt: string;
}

export interface SceneLayer {
  id: string;
  image: Artwork;
  x: number;
  y: number;
  width: number;
  height: number;
  depth: number;
  motion: { x: number; y: number; rotate: number; duration: number; delay: number };
}

export interface ProjectScene {
  background: Artwork;
  layers: readonly SceneLayer[];
  particles?: string;
}

export interface GalleryImage extends Artwork {
  title: string;
  caption: string;
  kind: 'concept' | 'gameplay';
}

export interface StatusEndpoint {
  url: string;
  service: string;
  refreshMs?: number;
}

export interface Project {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  objective: string;
  introductionHeading: string;
  featuresHeading: string;
  category: string;
  developmentStatus: { label: string; detail: string };
  features: readonly string[];
  approaches: readonly { name: string; description: string }[];
  technologies: readonly string[];
  contributions: readonly { role: string; description: string }[];
  teamContext: string;
  coverImage: Artwork;
  scene: ProjectScene;
  gallery: readonly GalleryImage[];
  hotspotPosition: { x: number; y: number };
  links: { demo?: string; repository?: string };
  demoNote?: string;
  statusEndpoint?: StatusEndpoint;
}

export type ServerAvailability = 'online' | 'offline' | 'unknown';
