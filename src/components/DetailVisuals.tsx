import { useState } from 'react';
import { ArrowDown, ArrowRight, Boxes, Braces, Cable, Database, FileCode2, Globe, GraduationCap, Mail, MapPin, Network, Radio, Router, ShieldCheck, ShoppingBag, Terminal, Workflow } from 'lucide-react';

type SkillGroup = { group: string; jp: string; items: [string, number, boolean?][] };
const TECH: Record<string, string> = {
  JavaScript: 'javascript', TypeScript: 'typescript', Java: 'java', Python: 'python',
  React: 'react', Astro: 'astro', 'Tailwind CSS': 'tailwindcss', 'Vue.js': 'vuejs',
  'Node.js': 'nodejs', NestJS: 'nestjs', MySQL: 'mysql', Docker: 'docker',
  'Git / GitHub': 'git', Nginx: 'nginx', Kubernetes: 'kubernetes', Linux: 'linux',
};
const SCENES = [
  { image: 'frontend', title: 'Todo empieza con una idea.', text: 'Los lenguajes permiten expresar la lógica: trabajar con información, tomar decisiones y convertir un problema en instrucciones.' },
  { image: 'frontend', title: 'La parte que puedes tocar.', text: 'Componentes, páginas y estilos: herramientas para construir la experiencia que una persona ve y utiliza.' },
  { image: 'backend', title: 'Lo que ocurre detrás.', text: 'Servicios, APIs y bases de datos conectan una interfaz con la información y las reglas de la aplicación.' },
  { image: 'infra', title: 'Del código a la operación.', text: 'Versionar, desplegar y mantener servicios: herramientas para acompañar el software cuando sale del editor.' },
  { image: 'infra', title: 'Conectar el mundo físico.', text: 'Equipos, redes y plataformas de telecomunicaciones acercan el desarrollo a lo que ocurre en la infraestructura.' },
  { image: 'frontend', title: 'El trabajo alrededor del código.', text: 'Sistemas y herramientas que acompañan la organización, la documentación y el trabajo diario.' },
];

export function SkillInventory({ groups }: { groups: SkillGroup[] }) {
  const [selected, setSelected] = useState(1);
  const group = groups[selected];
  const scene = SCENES[selected];
  return <div className="skill-inventory">
    <nav className="skill-category-nav" aria-label="Áreas de habilidades">{groups.map((item, index) => <button key={item.group} type="button" aria-pressed={selected === index} onClick={() => setSelected(index)}>{item.group}</button>)}</nav>
    <div className="skill-workbench" key={group.group}>
      <figure className="workbench-picture"><img src={`/skills/${scene.image}.png`} alt={`Ilustración de un espacio de trabajo de ${group.group.toLowerCase()}`} loading="lazy" /><figcaption><span lang="ja">{group.jp}</span><strong>{scene.title}</strong></figcaption></figure>
      <div className="tool-collection"><h3>{group.group}</h3><p>{scene.text}</p><ul className="technology-collection">{group.items.map(([name, , learning]) => {
        const icon = TECH[name];
        const Fallback = name.includes('router') ? Router : name === 'Redes de Internet' ? Network : name === 'APIs REST' ? Workflow : name === 'SQL' ? Database : name === 'OZMAP' ? MapPin : name === 'SmartOLT' ? Radio : FileCode2;
        return <li key={name}>{icon ? <img src={`/tech/${icon}.svg`} alt="" width="40" height="40" loading="lazy" /> : <Fallback size={35} aria-hidden="true" />}<span>{name}</span>{learning && <small>EN PROCESO</small>}</li>;
      })}</ul></div>
    </div>
  </div>;
}

export function IdentitySheet() {
  return <figure className="identity-sheet"><div className="identity-photo"><img src="https://github.com/cesardarizaleta.png" alt="César Domínguez" width="240" height="240" /><span>CD.</span></div><figcaption><strong>César<br />Domínguez</strong><p>Full Stack &amp; DevOps</p><span><MapPin size={14} aria-hidden="true" /> Valencia, Venezuela</span><div className="identity-disciplines"><span><Braces size={18} /> Software</span><span><Network size={18} /> Infraestructura</span></div></figcaption></figure>;
}

export function OriginSketch() {
  return <figure className="origin-sketch"><div className="origin-steps"><span><Globe />Blog</span><ArrowRight /><span><Workflow />Raptor</span><ArrowRight /><span><img src="/tech/python.svg" alt="" />Python</span><ArrowRight /><span><GraduationCap />Ingeniería</span></div><figcaption>Una pregunta abrió el siguiente camino.</figcaption></figure>;
}

export function ProjectSketch({ name }: { name: string }) {
  if (name === 'eCommerce con IA') return <figure className="project-sketch shop-sketch"><div className="shop-shelf"><ShoppingBag /><ShoppingBag /><ShoppingBag /></div><div className="sketch-flow"><span>Catálogo</span><ArrowRight /><span>Recomendaciones</span><ArrowRight /><span>Compra</span></div><figcaption>Esquema conceptual · Comercio y atención personalizada</figcaption></figure>;
  if (name === 'Inventario Electrónico') return <figure className="project-sketch inventory-sketch"><div className="inventory-drawing"><Boxes /><div><span>ENTRADAS <ArrowRight /></span><span>EXISTENCIAS <Database /></span><span>SALIDAS <ArrowRight /></span></div><img src="/tech/java.svg" alt="Java" /><img src="/tech/mysql.svg" alt="MySQL" /></div><figcaption>Esquema conceptual · Stock y movimientos</figcaption></figure>;
  if (name === 'Crystalbox CTF') return <figure className="project-sketch security-sketch"><ShieldCheck size={64} /><div><span>ANALIZAR</span><span>EXPLORAR</span><span>RESOLVER</span></div><figcaption>Esquema conceptual · Retos de seguridad</figcaption></figure>;
  return <figure className="project-sketch web-sketch"><div className="browser-drawing"><span className="browser-controls"><i /><i /><i /></span><strong>{name === 'CesarFolio' ? 'CESARFOLIO' : 'LIDA'}</strong><div className="browser-lines"><i /><i /><i /></div></div><div className="web-tools"><img src="/tech/astro.svg" alt="Astro" /><img src={name === 'CesarFolio' ? '/tech/react.svg' : '/tech/tailwindcss.svg'} alt={name === 'CesarFolio' ? 'React' : 'Tailwind CSS'} /></div><figcaption>Esquema conceptual · Presentación en la web</figcaption></figure>;
}

export function NetworkSketch() {
  return <figure className="network-sketch"><div className="network-source"><Radio /><strong>SmartOLT</strong><span>ESTADO DE EQUIPOS</span></div><div className="network-connection"><Cable /><span>INTEGRACIÓN</span></div><div className="network-source"><MapPin /><strong>OZMAP</strong><span>UBICACIÓN EN LA RED</span></div><div className="network-destination"><ArrowDown /><span><Terminal />Informes</span><span><ShieldCheck />Auditorías</span><span><Network />NOC y tickets</span></div><figcaption>Datos operativos y geográficos en un mismo flujo.</figcaption></figure>;
}

export function ContactLetter() {
  return <div className="contact-letter"><Mail size={32} aria-hidden="true" /><p>Para: <strong>César Domínguez</strong></p><p>Asunto: <span>La próxima idea</span></p><div className="letter-line" /><p className="letter-prompt">Tengo un proyecto en mente…</p><span className="letter-location">VALENCIA · VENEZUELA</span></div>;
}
