export interface EventPhoto {
  src: string;
  alt: string;
  caption?: string;
}

export interface GalleryEvent {
  id: string;
  name: string;
  photos: EventPhoto[];
}
