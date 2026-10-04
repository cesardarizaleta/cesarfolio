import { useCallback, useLayoutEffect, useRef, useState, type MouseEvent as ReactMouseEvent, type PointerEvent as ReactPointerEvent } from "react";
import { gsap } from "gsap";
import { CHAPTERS, chapterPath, readChapterPath } from "../lib/navigation";
import { ContactLetter, IdentitySheet, NetworkSketch, OriginSketch, ProjectSketch, SkillInventory } from "./DetailVisuals";
import { BookOpenText, BriefcaseBusiness, Code2, FolderKanban, Github, Gitlab, Linkedin, Send, UserRound, ZoomIn, ZoomOut } from "lucide-react";

const SOCIAL_LINKS = [
  { label: "GitHub", href: "https://github.com/cesardarizaleta", Icon: Github },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/cesardarizaleta", Icon: Linkedin },
  { label: "GitLab", href: "https://gitlab.com/cesardarizaleta", Icon: Gitlab },
] as const;

type Module = {
  id: string;
  label: string;
  kicker: string;
  character: string;
  origin: string;
  subtitle: string;
  description: string;
  art: string;
  tear: string;
};

const NAV_ICONS = [UserRound, BookOpenText, Code2, FolderKanban, BriefcaseBusiness, Send] as const;

const MODULES: Module[] = [
  {
    id: "fc4",
    label: "SOBRE MÍ",
    kicker: "EL COMIENZO / はじまり",
    character: "sanji",
    origin: "ONE PIECE",
    subtitle: "INGENIERO EN COMPUTACIÓN",
    description: "Código, automatización y una forma muy personal de contar quién soy.",
    art: "/art/sanji-eclipse.png",
    tear: "/art/sanji-tear.png",
  },
  {
    id: "origins",
    label: "CÓMO EMPECÉ",
    kicker: "LOS ORÍGENES / 原点",
    character: "soldado de Black Ops III",
    origin: "BLACK OPS III",
    subtitle: "BLOG · RAPTOR · PYTHON · INGENIERÍA",
    description: "Una curiosidad que empezó en un blog y terminó llevándome a Ingeniería en Computación.",
    art: "/art/black-ops-iii-eclipse.png",
    tear: "/art/black-ops-iii-tear.png",
  },
  {
    id: "tlou",
    label: "HABILIDADES",
    kicker: "EL INVENTARIO / 道具",
    character: "ellie",
    origin: "THE LAST OF US",
    subtitle: "HERRAMIENTAS PARA CONSTRUIR",
    description: "Cada herramienta tiene una historia. Estas son las que me acompañan.",
    art: "/art/ellie-eclipse.png",
    tear: "/art/ellie-tear.png",
  },
  {
    id: "franxx",
    label: "PROYECTOS",
    kicker: "LO QUE CREO / 創造",
    character: "zero two",
    origin: "DARLING IN THE FRANXX",
    subtitle: "PRODUCTO · FRONTEND · BACKEND",
    description: "De una idea a algo real: proyectos hechos para funcionar.",
    art: "/art/zero-two-eclipse.png",
    tear: "/art/zero-two-tear.png",
  },
  {
    id: "horimiya",
    label: "EXPERIENCIA",
    kicker: "EL CAMINO / 軌跡",
    character: "hori & miyamura",
    origin: "HORIMIYA",
    subtitle: "EXPERIENCIA Y APRENDIZAJE",
    description: "Las personas, lugares y retos que han moldeado mi trabajo.",
    art: "/art/horimiya-eclipse.png",
    tear: "/art/horimiya-tear.png",
  },
  {
    id: "onepiece",
    label: "CONTACTO",
    kicker: "EL ENCUENTRO / 縁",
    character: "zoro",
    origin: "ONE PIECE",
    subtitle: "EMPECEMOS UNA CONVERSACIÓN",
    description: "Una buena historia suele comenzar con un mensaje.",
    art: "/art/zoro-eclipse.png",
    tear: "/art/zoro-tear.png",
  },
];

const SKILLS: { group: string; jp: string; items: [string, number, boolean?][] }[] = [
  {
    group: "LENGUAJES",
    jp: "言語",
    items: [["JavaScript", 92], ["TypeScript", 84], ["Java", 80], ["Python", 76], ["SQL", 78]],
  },
  {
    group: "FRONTEND",
    jp: "画面",
    items: [["React", 86], ["Astro", 86], ["Tailwind CSS", 90], ["Vue.js", 30, true]],
  },
  {
    group: "BACKEND",
    jp: "裏側",
    items: [["Node.js", 84], ["NestJS", 72], ["MySQL", 76], ["APIs REST", 86]],
  },
  {
    group: "DEVOPS & INFRA",
    jp: "基盤",
    items: [["Docker", 86], ["Git / GitHub", 90], ["Nginx", 76], ["Kubernetes", 34, true]],
  },
  {
    group: "TELECOM",
    jp: "通信",
    items: [["Redes de Internet", 88], ["Config. de routers", 84], ["OZMAP", 80], ["SmartOLT", 78]],
  },
  {
    group: "HERRAMIENTAS",
    jp: "道具",
    items: [["Linux", 76], ["Microsoft 365", 86], ["Click-Up", 80]],
  },
];

const UNITS: { code: string; name: string; role: string; stack: string; status: string; desc: string }[] = [
  {
    code: "02",
    name: "eCommerce con IA",
    role: "Full Stack",
    stack: "React · Node · IA",
    status: "OPERATIVO",
    desc: "Tienda en línea con recomendaciones y atención personalizada mediante inteligencia artificial.",
  },
  {
    code: "16",
    name: "Inventario Electrónico",
    role: "Desktop Dev",
    stack: "Java · MySQL",
    status: "OPERATIVO",
    desc: "Sistema de escritorio para el control de inventario, stock y movimientos.",
  },
  {
    code: "00",
    name: "Crystalbox CTF",
    role: "Backend · Seguridad",
    stack: "Web · Retos",
    status: "OPERATIVO",
    desc: "Plataforma de retos CTF para práctica de seguridad ofensiva y defensiva.",
  },
  {
    code: "15",
    name: "LIDA — Landing Page",
    role: "Frontend",
    stack: "Astro · Tailwind",
    status: "EN LÍNEA",
    desc: "Sitio de presentación para LIDA Labs. Disponible en lidalabs.com.",
  },
  {
    code: "01",
    name: "CesarFolio",
    role: "Frontend",
    stack: "Astro · React",
    status: "EN LÍNEA",
    desc: "Este portafolio: un menú de videojuego construido a mano, sin scroll.",
  },
];

const FIBS = [
  "Informes automatizados de OZMAP y SmartOLT.",
  "Auditorías en tiempo real sobre cambios en la plataforma.",
  "Georreferenciación de clientes, OLTs, ONUs, cajas y postes.",
  "Integración SmartOLT ↔ OZMap con datos en vivo.",
  "Sistema de tickets y detección de fallas (individuales y masivas) a nivel nacional para el NOC.",
  "Gestión de personal por roles y departamentos, con métricas en tiempo real.",
  "Dashboard administrativo: OLTs, ONUs, usuarios y potencia de ONUs al instante.",
];

const COURSES = [
  ["Docker", "Platzi", "Avanzado"],
  ["NestJS", "Platzi", "Intermedio"],
  ["Java", "AcademiaEP", "Intermedio"],
  ["Excel", "CENTECPRO", "Intermedio"],
  ["Redes de Internet", "Autodidacta", "Profesional"],
  ["Pentesting a Redes", "Autodidacta", "Profesional"],
];

function Section({ id }: { id: string }) {
  if (id === "fc4") return <div className="section-content about-content">
    <h2>Una mente que construye.</h2>
    <p className="intro">Ingeniero en Computación · Desarrollador Full Stack &amp; DevOps</p>
    <IdentitySheet />
    <div className="fact-strip"><span>VALENCIA, VENEZUELA</span><span>+3 AÑOS DE EXPERIENCIA</span><span className="available">DISPONIBLE</span></div>
    <p>Soy una persona proactiva, organizada y responsable. Priorizo el código limpio, la automatización y las soluciones que resuelven de verdad.</p>
    <p>Llevo más de tres años construyendo software Full Stack y DevOps, y tengo un fuerte interés en las telecomunicaciones: disfruto instalando y configurando routers. Mi especialidad es llevar procesos manuales a sistemas automatizados que trabajan en tiempo real.</p>
    <h3>Del proceso a la solución</h3>
    <p>Mi trabajo conecta la interfaz que utiliza una persona con los servicios, los datos y la infraestructura que la hacen funcionar. El desarrollo Full Stack y DevOps me permite pensar en el recorrido completo: cómo se usa una herramienta, de dónde obtiene su información y cómo llega a estar disponible.</p>
    <h3>Lo que me interesa resolver</h3>
    <p>La automatización y las telecomunicaciones se encuentran cuando un equipo necesita consultar el estado de una red, relacionar información de distintas plataformas o dejar de repetir una tarea manual. Ese es el contexto de los informes, las integraciones y los sistemas en tiempo real que describo en mi experiencia.</p>
    <div className="closing-line">“Un buen sistema no se nota. Simplemente funciona.”</div>
  </div>;

  if (id === "origins") return <div className="section-content origin-content">
    <h2>Así empezó todo.</h2>
    <p className="intro">Antes de la ingeniería y de los proyectos, hubo una curiosidad que me llevó de una pregunta a otra.</p>
    <OriginSketch />
    <div className="origin-timeline">
      <article><span>01</span><div><h3>UN BLOG</h3><p>Comencé leyendo un blog sobre programación. Quería entender qué había detrás de todo eso. Fue el primer contacto con una idea que sigue presente en mi trabajo: las herramientas que usamos tienen una lógica que podemos conocer y construir.</p></div></article>
      <article><span>02</span><div><h3>RAPTOR Y LA LÓGICA</h3><p>Vi videos sobre cómo programar en Raptor y empecé a seguir la lógica de los programas paso a paso. Los diagramas de flujo permiten ver entradas, decisiones y repeticiones antes de pensar en la sintaxis de un lenguaje.</p></div></article>
      <article><span>03</span><div><h3>PYTHON</h3><p>Después conocí Python. Lo que veía me daba ganas de seguir indagando y probar más cosas. El siguiente paso de esa historia era pasar de representar una solución en un diagrama a expresarla como instrucciones que una computadora puede ejecutar.</p></div></article>
      <article><span>04</span><div><h3>INGENIERÍA</h3><p>Entré a Ingeniería en Computación y todo fue una locura: distintos lenguajes, nuevas formas de pensar y lógica por todas partes. La curiosidad inicial encontró un campo mucho más amplio, en el que conviven software, datos y sistemas.</p></div></article>
    </div>
    <p className="context-note">Ese recorrido da contexto al resto del portafolio: las herramientas cambian, pero entender el problema sigue siendo el punto de partida.</p>
  </div>;

  if (id === "tlou") return <div className="section-content skills-content">
    <h2>Lo que llevo conmigo.</h2>
    <p className="intro">Tecnologías, herramientas y campos que utilizo. Los recursos marcados como «en proceso» todavía los estoy aprendiendo.</p>
    <SkillInventory groups={SKILLS} />
    <h3>Cómo se conectan estas herramientas</h3>
    <dl className="context-list">
      <div><dt>Interfaz y producto</dt><dd>React y Astro organizan lo que ve y utiliza el visitante; Tailwind CSS permite trabajar la presentación. JavaScript y TypeScript conectan esas interfaces con la lógica de la aplicación.</dd></div>
      <div><dt>Servicios y datos</dt><dd>Node.js, NestJS, SQL y MySQL forman parte de las herramientas para construir servicios, consultar información y exponerla mediante APIs REST. Java también aparece en el proyecto de inventario de escritorio.</dd></div>
      <div><dt>Despliegue y operación</dt><dd>Docker, Linux, Nginx y Git acompañan el recorrido del código hasta su ejecución. En telecomunicaciones, OZMAP y SmartOLT aparecen en las integraciones y consultas operativas de mi experiencia.</dd></div>
    </dl>
    <p className="context-note">Vue.js y Kubernetes permanecen marcados como aprendizajes en proceso. Puedes cambiar de área para explorar el resto de mis herramientas.</p>
  </div>;

  if (id === "franxx") return <div className="section-content projects-content">
    <h2>Ideas en movimiento.</h2>
    <p className="intro">Cinco proyectos construidos entre producto, automatización y seguridad.</p>
    <div className="project-list">{UNITS.map((u) => <article className="project-item" key={u.name}>
      <ProjectSketch name={u.name} /><div className="project-story"><span className="project-status">{u.status}</span><h3>{u.name}</h3><p>{u.desc}</p><small>{u.role} <span>·</span> {u.stack}</small></div>
    </article>)}</div>
    <h3>Qué problema aborda cada proyecto</h3>
    <dl className="context-list">
      <div><dt>eCommerce con IA</dt><dd>Combina la compra en línea con recomendaciones y atención personalizada. El foco está en conectar la experiencia del cliente con los servicios que permiten ofrecer esas funciones.</dd></div>
      <div><dt>Inventario Electrónico</dt><dd>Organiza existencias y movimientos en una aplicación de escritorio. Java y MySQL conectan el flujo de trabajo con la información almacenada del inventario.</dd></div>
      <div><dt>Crystalbox CTF</dt><dd>Ofrece retos para practicar seguridad ofensiva y defensiva. Una plataforma CTF reúne desafíos que permiten ejercitar el análisis de problemas de seguridad.</dd></div>
      <div><dt>LIDA y CesarFolio</dt><dd>Exploran dos formas de presentar información en la web: una landing de empresa y este portafolio interactivo. Astro participa en ambos; React controla la navegación y los diálogos de CesarFolio.</dd></div>
    </dl>
  </div>;

  if (id === "horimiya") return <div className="section-content experience-content">
    <h2>El camino recorrido.</h2>
    <NetworkSketch />
    <div className="career-block"><span className="year">2025 — AHORA</span><h3>FIBEXTELECOM · ISP</h3><p className="intro">Automatizador de Procesos · Presencial</p><p>Diseño e implemento soluciones que optimizan los flujos internos de la empresa, integrando y mejorando software administrativo y creando bots para reducir tareas manuales.</p><ul>{FIBS.map((f) => <li key={f}>{f}</li>)}</ul></div>
    <h3>El contexto de una operación de red</h3>
    <p>En un ISP, la información de clientes, equipos y ubicaciones tiene que relacionarse con lo que ocurre en la red. Una OLT concentra conexiones de fibra; las ONUs son equipos del lado del usuario. Consultar su estado y potencia ayuda a contextualizar una incidencia.</p>
    <p>Las integraciones entre SmartOLT y OZMAP conectan datos operativos con información geográfica. Los informes, las auditorías y los tickets ofrecen distintas maneras de consultar esa información: entender qué cambió, dónde sucede y qué necesita atención del NOC, el centro de operaciones de red.</p>
    <div className="career-grid"><div><h4>EDUCACIÓN</h4><p><b>Universidad José Antonio Páez</b><br />2022 – Actualidad · Ingeniería en Computación</p><h4>IDIOMAS</h4><p><b>Inglés — Nivel B2</b><br />Certificado por CEVAC</p></div><div><h4>CURSOS</h4><ul className="course-list">{COURSES.map(([name, place, level]) => <li key={name}><b>{name}</b><span>{place}</span><em>{level}</em></li>)}</ul></div></div>
  </div>;

  const routes = [
    { number: "01", name: "CORREO", detail: "cesardarizaleta@gmail.com", href: "mailto:cesardarizaleta@gmail.com" },
    { number: "02", name: "TELÉFONO", detail: "0414-401 99 11", href: "tel:+584144019911" },
    { number: "03", name: "GITHUB", detail: "@cesardarizaleta", href: "https://github.com/cesardarizaleta" },
  ];
  return <div className="section-content contact-content">
    <h2>Hablemos de tu idea.</h2>
    <p className="intro">Desde Valencia, Venezuela. Si tienes algo que construir, aquí puedes encontrarme.</p>
    <ContactLetter />
    <h3>¿Qué tienes en mente?</h3>
    <p>Podemos conversar sobre una aplicación web, una integración entre sistemas, una tarea que quieras automatizar o una oportunidad de trabajo en Full Stack y DevOps. Los proyectos y la experiencia de este portafolio muestran el contexto desde el que puedo aportar.</p>
    <p>Para empezar, cuéntame qué necesitas resolver, quién utilizará la solución y qué herramientas o procesos existen hoy. Si tienes una referencia, un repositorio o una descripción del problema, también puede ayudar a entender el alcance.</p>
    <div className="contact-list">{routes.map((route) => <a key={route.name} href={route.href} target={route.href.startsWith("http") ? "_blank" : undefined} rel={route.href.startsWith("http") ? "noreferrer" : undefined}>
      <span>{route.number}</span><strong>{route.name}</strong><small>{route.detail}</small><b aria-hidden="true">↗</b>
    </a>)}</div>
    <p className="signature">César Domínguez</p>
  </div>;
}

export default function GameMenu({ initialActive = 0, initialOpen = false }: { initialActive?: number; initialOpen?: boolean }) {
  const pageRef = useRef<HTMLDivElement>(null);
  const wipeRef = useRef<HTMLDivElement>(null);
  const detailOverlayRef = useRef<HTMLDivElement>(null);
  const detailPanelRef = useRef<HTMLDivElement>(null);
  const sceneParallaxRef = useRef<{ image: HTMLImageElement; x: (value: number) => void; y: (value: number) => void } | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const lockedRef = useRef(false);
  const [active, setActive] = useState(initialActive);
  const [open, setOpen] = useState(initialOpen);
  const [detailZoomed, setDetailZoomed] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const module = MODULES[active];
  const chapter = CHAPTERS[active];

  const updateRoute = useCallback((index: number, detail: boolean) => {
    const path = chapterPath(index, detail);
    if (window.location.pathname !== path) window.history.pushState(null, "", path);
    document.title = `${CHAPTERS[index].label} — César Domínguez`;
  }, []);

  const moveDetailImage = (event: ReactPointerEvent<HTMLElement>) => {
    const image = event.currentTarget.querySelector<HTMLImageElement>(".detail-scene-image");
    if (!image || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (sceneParallaxRef.current?.image !== image) {
      sceneParallaxRef.current = {
        image,
        x: gsap.quickTo(image, "x", { duration: .38, ease: "power3.out" }),
        y: gsap.quickTo(image, "y", { duration: .38, ease: "power3.out" }),
      };
    }
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - .5;
    const y = (event.clientY - bounds.top) / bounds.height - .5;
    sceneParallaxRef.current.x(x * -20);
    sceneParallaxRef.current.y(y * -12);
  };

  const resetDetailImage = (event: ReactPointerEvent<HTMLElement>) => {
    const image = event.currentTarget.querySelector<HTMLImageElement>(".detail-scene-image");
    if (image && sceneParallaxRef.current?.image === image) {
      sceneParallaxRef.current.x(0);
      sceneParallaxRef.current.y(0);
    }
  };

  const toggleDetailZoom = (event: ReactMouseEvent<HTMLButtonElement>) => {
    const nextZoom = !detailZoomed;
    setDetailZoomed(nextZoom);
    const image = event.currentTarget.closest(".detail-scene")?.querySelector<HTMLImageElement>(".detail-scene-image");
    if (image) {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) gsap.set(image, { scale: nextZoom ? 1.24 : 1.06 });
      else gsap.to(image, { scale: nextZoom ? 1.24 : 1.06, duration: .72, ease: "power3.inOut", overwrite: "auto" });
    }
  };

  const resetDetail = useCallback(() => {
    setOpen(false);
    setDetailZoomed(false);
    sceneParallaxRef.current = null;
  }, []);

  const closeDetail = useCallback(() => {
    resetDetail();
    updateRoute(active, false);
  }, [active, resetDetail, updateRoute]);

  const openDetail = () => {
    if (lockedRef.current) return;
    setDetailZoomed(false);
    setOpen(true);
    updateRoute(active, true);
  };

  const navigateTo = useCallback((index: number) => {
    const next = (index + MODULES.length) % MODULES.length;
    if (next === active || lockedRef.current) return;
    updateRoute(next, false);
    const wipe = wipeRef.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!wipe || reduce) { setActive(next); resetDetail(); return; }
    lockedRef.current = true;
    setIsTransitioning(true);
    timelineRef.current?.kill();
    timelineRef.current = gsap.timeline({ onComplete: () => { gsap.set(wipe, { clearProps: "all" }); lockedRef.current = false; setIsTransitioning(false); } })
      .set(wipe, { display: "block", xPercent: -110 })
      .to(wipe, { xPercent: 0, duration: .26, ease: "power4.in" })
      .call(() => { setActive(next); resetDetail(); })
      .to(wipe, { xPercent: 110, duration: .42, ease: "power4.out" });
  }, [active, resetDetail, updateRoute]);

  const renderNavButton = (item: Module, index: number) => {
    const Icon = NAV_ICONS[index] ?? UserRound;
    return <button type="button" key={item.id} className={index === active ? "selected" : ""} onClick={() => navigateTo(index)} disabled={isTransitioning} aria-current={index === active ? "page" : undefined} aria-label={item.label} title={item.label}>
      <Icon size={21} strokeWidth={1.75} aria-hidden="true" />
    </button>;
  };

  useLayoutEffect(() => () => { timelineRef.current?.kill(); }, []);

  useLayoutEffect(() => {
    const restoreRoute = () => {
      const route = readChapterPath(window.location.pathname);
      if (!route) { window.location.reload(); return; }
      timelineRef.current?.kill();
      if (wipeRef.current) gsap.set(wipeRef.current, { clearProps: "all" });
      lockedRef.current = false;
      setIsTransitioning(false);
      setActive(route.active);
      setOpen(route.open);
      setDetailZoomed(false);
      sceneParallaxRef.current = null;
      document.title = `${CHAPTERS[route.active].label} — César Domínguez`;
    };
    window.addEventListener("popstate", restoreRoute);
    return () => window.removeEventListener("popstate", restoreRoute);
  }, []);

  useLayoutEffect(() => {
    if (!open || !detailOverlayRef.current) return;
    const overlay = detailOverlayRef.current;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const background = Array.from(overlay.parentElement?.children ?? []).filter((element): element is HTMLElement => element instanceof HTMLElement && element !== overlay);
    background.forEach((element) => { element.inert = true; });
    overlay.querySelector<HTMLButtonElement>(".detail-close")?.focus({ preventScroll: true });
    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const elements = Array.from(overlay.querySelectorAll<HTMLElement>('button:not(:disabled),a[href],[tabindex="0"]'));
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (!overlay.contains(document.activeElement)) { event.preventDefault(); (event.shiftKey ? last : first)?.focus(); }
      else if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    overlay.addEventListener("keydown", trapFocus);
    return () => {
      background.forEach((element) => { element.inert = false; });
      overlay.removeEventListener("keydown", trapFocus);
      if (previousFocus?.isConnected && previousFocus !== document.body) previousFocus.focus({ preventScroll: true });
      else pageRef.current?.querySelector<HTMLButtonElement>(".tear-portal")?.focus({ preventScroll: true });
    };
  }, [open, active]);
  useLayoutEffect(() => {
    if (!pageRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".hero-art", { scale: 1.08, opacity: .4 }, { scale: 1, opacity: 1, duration: 1.35, ease: "power3.out" });
      gsap.fromTo(".tear-portal", { x: -80, opacity: 0, scaleX: .94 }, { x: 0, opacity: 1, scaleX: 1, duration: .75, ease: "power4.out", delay: .12, clearProps: "transform" });
      gsap.fromTo(".hero-copy > *", { y: 32, opacity: 0 }, { y: 0, opacity: 1, duration: .68, stagger: .09, ease: "power3.out", delay: .13 });
      gsap.fromTo(".social-rail a", { x: 18, opacity: 0 }, { x: 0, opacity: 1, duration: .5, stagger: .08, ease: "power2.out", delay: .3 });
    }, pageRef);
    return () => ctx.revert();
  }, [active]);

  useLayoutEffect(() => {
    const overlay = detailOverlayRef.current;
    const panel = detailPanelRef.current;
    if (!open || !overlay || !panel || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.timeline({ onComplete: () => {
        if (!overlay.contains(document.activeElement)) overlay.querySelector<HTMLButtonElement>(".detail-close")?.focus({ preventScroll: true });
      } })
        .fromTo(".detail-backdrop", { autoAlpha: 0 }, { autoAlpha: 1, duration: .34, ease: "power2.out" }, 0)
        .fromTo(panel, {
          autoAlpha: 0,
          scaleX: .035,
          scaleY: .78,
          xPercent: 7,
          rotateY: -15,
          transformOrigin: "100% 50%",
          filter: "brightness(1.75) drop-shadow(-28px 18px 36px rgba(0,0,0,.7))",
        }, {
          autoAlpha: 1,
          scaleX: 1,
          scaleY: 1,
          xPercent: 0,
          rotateY: 0,
          filter: "brightness(1) drop-shadow(-20px 16px 32px rgba(0,0,0,.58))",
          duration: .92,
          ease: "elastic.out(1,.72)",
        }, 0)
        .fromTo(".detail-close", { scale: 0, rotation: -100, autoAlpha: 0 }, { scale: 1, rotation: 0, autoAlpha: 1, duration: .42, ease: "back.out(2.6)" }, .36)
        .fromTo(".detail-scene", {
          clipPath: "polygon(50% 50%,50% 50%,50% 50%,50% 50%,50% 50%,50% 50%,50% 50%,50% 50%,50% 50%,50% 50%,50% 50%,50% 50%,50% 50%,50% 50%,50% 50%,50% 50%,50% 50%,50% 50%,50% 50%,50% 50%,50% 50%,50% 50%)",
          autoAlpha: 0,
          y: 20,
          scale: .92,
        }, {
          clipPath: "polygon(0 4%,8% 2%,12% 5%,31% 1%,40% 3%,71% 0,76% 4%,100% 1%,98% 27%,100% 34%,97% 65%,99% 72%,96% 98%,73% 96%,66% 100%,42% 97%,31% 100%,2% 96%,3% 70%,0 62%,2% 35%,0 28%)",
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: .84,
          ease: "power4.out",
        }, .31)
        .fromTo(".detail-scene-caption > *", { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: .42, stagger: .08, ease: "power3.out" }, .83)
        .fromTo(".detail-scene-glint", { xPercent: -310, autoAlpha: 0 }, { xPercent: 480, autoAlpha: .85, duration: .92, ease: "power2.inOut" }, .47)
        .fromTo(".section-content > *", { y: 20, autoAlpha: 0, filter: "blur(5px)" }, { y: 0, autoAlpha: 1, filter: "blur(0px)", duration: .48, stagger: .055, ease: "power3.out", clearProps: "filter" }, .76);
    }, overlay);
    return () => ctx.revert();
  }, [active, open]);

  useLayoutEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) { closeDetail(); return; }
      if (open) return;
      if (event.target instanceof HTMLElement && event.target.closest("input,textarea,select,a")) return;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") { event.preventDefault(); navigateTo(active + 1); }
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") { event.preventDefault(); navigateTo(active - 1); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, open, closeDetail, navigateTo]);

  return <main className={`ink-world chapter-${module.id}`} ref={pageRef} data-module={module.id} aria-busy={isTransitioning}>
    <div className="ink-frame">
      <div className="hero-art" key={`art-${module.id}`} style={{ backgroundImage: `url(${module.art})` }} role="img" aria-label={`Ilustración de ${module.character}`} />
      <div className="hero-shade" aria-hidden="true" />
      <div className="frame-grain" aria-hidden="true" />
      <header className="ink-header">
        <button className="profile-avatar" type="button" onClick={() => navigateTo(0)} aria-label="Ir al inicio" title="César Domínguez · GitHub">
          <img src="https://github.com/cesardarizaleta.png" alt="Foto de perfil de César Domínguez" width="47" height="47" />
        </button>
        <span className="brand-text">CESARFOLIO</span>
        <nav className="top-nav" aria-label="Secciones del portafolio">
          {MODULES.slice(0, 3).map(renderNavButton)}
          <span className="nav-spacer" aria-hidden="true" />
          {MODULES.slice(3).map((item, index) => renderNavButton(item, index + 3))}
        </nav>
      </header>
      <div className="left-japanese" lang="ja" aria-hidden="true">想像を現実にする</div>
      <button className="tear-portal" key={`tear-${module.id}`} type="button" onClick={openDetail} aria-label={`Explorar capítulo: ${module.label}`}>
        <span className="tear-outline" aria-hidden="true" />
        <span className="tear-visual" style={{ backgroundImage: `url(${module.tear})` }} aria-hidden="true" />
        <span className="tear-action">EXPLORAR CAPÍTULO <b>↗</b></span>
      </button>
      <section className="hero-copy" aria-live="polite" key={`copy-${module.id}`}>
        <p className="hero-kicker"><span className="red-cross">✳</span> {module.kicker} <span className="kicker-line" /></p>
        <h1>{active === 0 ? <>CÉSAR <em>DOMÍNGUEZ</em></> : module.label}</h1>
        <p className="hero-subtitle">{active === 0 ? "INGENIERO EN COMPUTACIÓN · FULL STACK & DEVOPS" : module.subtitle}</p>
        <div className="hero-rule"><i /></div>
        <p className="hero-description">{module.description}</p>
      </section>
      <nav className="social-rail" aria-label="Redes sociales">
        {SOCIAL_LINKS.map(({ label, href, Icon }) => <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} title={label}><Icon size={22} strokeWidth={1.6} aria-hidden="true" /></a>)}
      </nav>
      <div className="hero-character" aria-hidden="true">{module.character.toUpperCase()} <span>— {module.origin}</span></div>
      <div className="frame-bottom"><span>© CÉSAR DOMÍNGUEZ</span><div className="chapter-dots" aria-label="Cambiar sección">{MODULES.map((item, i) => <button key={item.id} type="button" aria-label={`Ir a ${item.label}`} className={i === active ? "selected" : ""} onClick={() => navigateTo(i)} disabled={isTransitioning} />)}</div><span>VALENCIA, VENEZUELA</span></div>
      <button className="side-next" type="button" onClick={() => navigateTo(active + 1)} disabled={isTransitioning} aria-label="Siguiente sección">→</button>
      {open && <div className="detail-overlay" ref={detailOverlayRef} role="dialog" aria-modal="true" aria-label={`Información de ${module.label}`}>
        <button className="detail-backdrop" type="button" onClick={closeDetail} aria-label="Cerrar información" />
        <div className="detail-panel" key={`detail-${module.id}`} ref={detailPanelRef}>
          <button className="detail-close" type="button" onClick={closeDetail} aria-label="Cerrar capítulo">✕</button>
          <div className="detail-scroll" tabIndex={0} aria-label={`Contenido de ${chapter.label}`}>
            <figure className="detail-scene" onPointerMove={moveDetailImage} onPointerLeave={resetDetailImage}>
              <img className="detail-scene-image" src={`/banners/${chapter.slug}.png`} alt={chapter.alt} width="1536" height="512" decoding="async" />
              <span className="detail-scene-glint" aria-hidden="true" />
              <figcaption className="detail-scene-caption"><span><b>{chapter.label.toUpperCase()}</b><small>{chapter.caption}</small></span><button className={detailZoomed ? "is-zoomed" : ""} type="button" aria-pressed={detailZoomed} aria-label={detailZoomed ? "Restablecer ilustración" : "Ampliar ilustración"} onClick={toggleDetailZoom}>{detailZoomed ? <ZoomOut size={17} /> : <ZoomIn size={17} />}</button></figcaption>
            </figure>
            <Section id={module.id} />
          </div>
        </div>
      </div>}
      <div className="ink-wipe" ref={wipeRef} aria-hidden="true"><span lang="ja">次の章へ</span><strong>CESARFOLIO</strong></div>
    </div>
  </main>;
}
