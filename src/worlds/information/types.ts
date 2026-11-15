/** A photo or a placeholder plate. Real photos are metadata-free WebP (CORE-03, or its stopgap). */
export interface Photo {
  id: string;
  alt: string;
  width: number;
  height: number;
  /** Full-size optimized WebP. Absent on placeholders. */
  src?: string;
  /** ~480 px thumbnail for grids. */
  thumb?: string;
  caption?: string;
  placeholder?: true;
}

export interface Album {
  /** Stable slug, also the folder name under assets/photos/. */
  id: string;
  title: string;
  /** When the album was shot. Only the parts the creator supplied and approved for publishing. */
  date?: AlbumDate;
  photos: Photo[];
  placeholder?: true;
}

export interface AlbumDate {
  /** HTML date string: `YYYY-MM-DD`, yearless `--MM-DD`, or year-only `YYYY`. */
  iso: string;
  label: string;
}

export interface Milestone {
  id: string;
  period: string;
  title: string;
  /** Paragraphs, in the language the creator wrote them. */
  description: string[];
  /** Language of `description` (BCP 47), when it differs from the page. */
  lang?: string;
  /** Short highlighted fact, e.g. a GPA the creator supplied. */
  note?: string;
  /** The chapter still in progress. */
  current?: true;
  image?: Photo;
  placeholder?: true;
}
