export interface Fotografia {
  archivo: string;
  descripcion: string;
  pie: string;
}
export interface MediosProyecto {
  video: string | null;
  poster: string | null;
  subtitulos: string | null;
  fotografias: Fotografia[];
}

// Las rutas parten de public/. Mantener null y [] hasta disponer de material real.
export const medios: MediosProyecto = {
  video: null,
  poster: null,
  subtitulos: null,
  fotografias: [],
};
