export const CHAPTERS = [
  { id: 'fc4', slug: 'sobre-mi', label: 'Sobre mí', caption: 'SOFTWARE E INFRAESTRUCTURA', alt: 'Mesa de trabajo con código, un router y un cuaderno de ingeniería.' },
  { id: 'origins', slug: 'como-empece', label: 'Cómo empecé', caption: 'DE LA CURIOSIDAD A LA LÓGICA', alt: 'Cuaderno con un diagrama de flujo y un portátil para aprender programación.' },
  { id: 'tlou', slug: 'habilidades', label: 'Habilidades', caption: 'HERRAMIENTAS QUE SE CONECTAN', alt: 'Estación de desarrollo con código, terminal y equipos de red.' },
  { id: 'franxx', slug: 'proyectos', label: 'Proyectos', caption: 'IDEAS CON UNA APLICACIÓN REAL', alt: 'Mesa de producto con interfaces conceptuales de comercio, inventario y seguridad.' },
  { id: 'horimiya', slug: 'experiencia', label: 'Experiencia', caption: 'AUTOMATIZACIÓN EN TELECOMUNICACIONES', alt: 'Centro de operaciones con equipos de fibra y un mapa conceptual de red.' },
  { id: 'onepiece', slug: 'contacto', label: 'Contacto', caption: 'EL INICIO DE UNA COLABORACIÓN', alt: 'Mesa preparada para conversar sobre un proyecto con un portátil y cuadernos.' },
] as const;

export function chapterPath(index: number, detail = false) {
  return `/${CHAPTERS[index].slug}${detail ? '/detalle' : ''}`;
}

export function readChapterPath(pathname: string) {
  const parts = pathname.split('/').filter(Boolean);
  const active = CHAPTERS.findIndex((chapter) => chapter.slug === parts[0]);
  if (parts.length === 0) return { active: 0, open: false };
  if (active < 0 || parts.length > 2 || (parts[1] && parts[1] !== 'detalle')) return null;
  return { active, open: parts[1] === 'detalle' };
}
