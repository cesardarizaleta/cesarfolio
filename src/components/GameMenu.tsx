import { useCallback, useEffect, useRef, useState } from "react";

type Theme = {
  id: string;
  num: string;
  label: string;
  kicker: string;
  franchise: string;
  jp: string;
  motif: string;
  tagline: string;
  bg: string;
};

const THEMES: Theme[] = [
  {
    id: "fc4",
    num: "01",
    label: "SOBRE MÍ",
    kicker: "Quién soy",
    franchise: "FAR CRY 4",
    jp: "ファークライ 4",
    motif: "KYRAT · REGIÓN AUTÓNOMA",
    tagline: "Bienvenido a mi territorio.",
    bg: "/backgrounds/farcry4.jpg",
  },
  {
    id: "tlou",
    num: "02",
    label: "HABILIDADES",
    kicker: "Con qué cuento",
    franchise: "THE LAST OF US",
    jp: "ザ・ラスト・オブ・アス",
    motif: "EQUIPAJE · SUPERVIVENCIA",
    tagline: "Lo que llevas cuando todo lo demás falla.",
    bg: "/backgrounds/tlou.jpg",
  },
  {
    id: "franxx",
    num: "03",
    label: "PROYECTOS",
    kicker: "Lo que he construido",
    franchise: "DARLING IN THE FRANXX",
    jp: "ダーリン・イン・ザ・フランキス",
    motif: "PLANTACIÓN 13 · UNIDADES FRANXX",
    tagline: "Encontrar a tu compañero es encontrar tu arma.",
    bg: "/backgrounds/franxx.jpg",
  },
  {
    id: "horimiya",
    num: "04",
    label: "EXPERIENCIA",
    kicker: "Mi recorrido",
    franchise: "HORIMIYA",
    jp: "ホリミヤ",
    motif: "クラス 3-1 · EXPEDIENTE",
    tagline: "Las historias pequeñas también importan.",
    bg: "/backgrounds/horimiya.jpg",
  },
  {
    id: "onepiece",
    num: "05",
    label: "CONTACTO",
    kicker: "Zarpa conmigo",
    franchise: "ONE PIECE",
    jp: "ワンピース",
    motif: "GRAND LINE · RECOMPENSA",
    tagline: "El mar te espera. Levántate y navega.",
    bg: "/backgrounds/onepiece.jpg",
  },
];

const BOOT_TIPS = [
  "CONSEJO: usa ↑ ↓ para cambiar de mundo.",
  "CONSEJO: ENTER abre el módulo seleccionado.",
  "CONSEJO: ESC te devuelve al menú principal.",
  "CONSEJO: cada módulo es un universo distinto.",
  "CONSEJO: este portafolio no se hace scroll.",
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

function Bars({ group, jp, items }: { group: string; jp: string; items: [string, number, boolean?][] }) {
  return (
    <div className="skill-group">
      <div className="skill-head">
        <span className="skill-name">{group}</span>
        <span className="skill-jp">{jp}</span>
      </div>
      {items.map(([name, pct, wip]) => (
        <div className="skill-row" key={name}>
          <span className="skill-item">{name}</span>
          {wip && <span className="wip">EN PROCESO</span>}
          <span className="skill-bar">
            <i style={{ width: `${pct}%` }} />
          </span>
        </div>
      ))}
    </div>
  );
}

function Section({ id }: { id: string }) {
  if (id === "fc4") {
    return (
      <div className="sec sec-fc4">
        <div className="dossier">
          <div className="dossier-id">
            <span className="tag">EXPEDIENTE · 01</span>
            <h3>CÉSAR DOMÍNGUEZ</h3>
            <p className="role">Ingeniero en Computación</p>
            <p className="role dim">Desarrollador Full Stack &amp; DevOps</p>
            <ul className="facts">
              <li><span>ORIGEN</span>Parral, Valencia, Carabobo — Venezuela</li>
              <li><span>ESTADO</span><b className="live">DISPONIBLE</b></li>
              <li><span>EXPERIENCIA</span>+3 años</li>
            </ul>
            <div className="statline">
              <div><strong>3+</strong><em>años</em></div>
              <div><strong>5+</strong><em>proyectos</em></div>
              <div><strong>16</strong><em>tecnologías</em></div>
            </div>
          </div>
          <div className="dossier-body">
            <p className="lead">
              Soy una persona proactiva, organizada y responsable. Priorizo el código limpio, la
              automatización y las soluciones que resuelven de verdad.
            </p>
            <p>
              Llevo más de tres años construyendo software Full Stack y DevOps, y tengo un fuerte interés
              en las telecomunicaciones: disfruto instalando y configurando routers. Mi especialidad es
              llevar procesos manuales a sistemas automatizados que trabajan en tiempo real.
            </p>
            <div className="quote-fc">
              <span>“</span> Un buen sistema no se nota. Simplemente funciona.
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (id === "tlou") {
    return (
      <div className="sec sec-tlou">
        <p className="field-note">
          Notas de campo — todo lo que cargo en la mochila. Las barras marcan cuánta confianza tengo en
          cada recurso. Lo que dice <b>EN PROCESO</b> todavía lo estoy aprendiendo.
        </p>
        <div className="grid-skills">
          {SKILLS.map((g) => (
            <Bars key={g.group} {...g} />
          ))}
        </div>
      </div>
    );
  }

  if (id === "franxx") {
    return (
      <div className="sec sec-franxx">
        <p className="franxx-note">PLANTACIÓN 13 · REGISTRO DE UNIDADES DESPLEGADAS</p>
        <div className="units">
          {UNITS.map((u) => (
            <article className="unit" key={u.name}>
              <div className="unit-top">
                <span className="unit-code">UNIDAD {u.code}</span>
                <span className="unit-status">{u.status}</span>
              </div>
              <h3>{u.name}</h3>
              <p>{u.desc}</p>
              <div className="unit-meta">
                <span>{u.role}</span>
                <span className="dot" />
                <span>{u.stack}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    );
  }

  if (id === "horimiya") {
    return (
      <div className="sec sec-horimiya">
        <article className="note-card">
          <span className="tape" />
          <span className="note-year">2025</span>
          <h3>FIBEXTELECOM · ISP</h3>
          <p className="note-role">Automatizador de Procesos · Presencial</p>
          <p>
            Diseño e implemento soluciones que optimizan los flujos internos de la empresa, integrando y
            mejorando software administrativo y creando bots para reducir tareas manuales.
          </p>
          <ul className="ticks">
            {FIBS.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </article>

        <div className="horimiya-cols">
          <article className="note-card small">
            <span className="tape tape-blue" />
            <h4>EDUCACIÓN</h4>
            <p className="edu">
              <b>Universidad José Antonio Páez</b>
              <span>2022 – Actualidad · Ingeniería en Computación</span>
            </p>
            <h4>IDIOMAS</h4>
            <p className="edu">
              <b>Inglés — Nivel B2</b>
              <span>Certificado por CEVAC</span>
            </p>
          </article>
          <article className="note-card small">
            <span className="tape tape-pink" />
            <h4>CURSOS</h4>
            <ul className="courses">
              {COURSES.map(([name, place, level]) => (
                <li key={name}>
                  <b>{name}</b>
                  <span>{place}</span>
                  <em>{level}</em>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    );
  }

  return (
    <div className="sec sec-onepiece">
      <div className="bounty">
        <div className="bounty-inner">
          <span className="bounty-top">MARINE · GRAND LINE</span>
          <h3>SE BUSCA</h3>
          <span className="bounty-namesub">WANTED · DEAD OR ALIVE</span>
          <div className="bounty-silhouette" aria-hidden="true">
            <span>海賊</span>
          </div>
          <p className="bounty-name">“EL DESARROLLADOR”</p>
          <p className="bounty-real">CÉSAR DOMÍNGUEZ</p>
          <div className="bounty-reward">
            <span>RECOMPENSA</span>
            <strong>฿ 300.000.000</strong>
          </div>
          <span className="bounty-seal">MARINE</span>
        </div>
      </div>
      <div className="contact-list">
        <a className="contact-row" href="mailto:cesardarizaleta@gmail.com">
          <span>CORREO</span>
          <b>cesardarizaleta@gmail.com</b>
          <i>→</i>
        </a>
        <a className="contact-row" href="tel:+584144019911">
          <span>TELÉFONO</span>
          <b>0414-401 99 11</b>
          <i>→</i>
        </a>
        <a className="contact-row" href="https://github.com/cesardarizaleta" target="_blank" rel="noreferrer">
          <span>GITHUB</span>
          <b>@cesardarizaleta</b>
          <i>→</i>
        </a>
        <div className="contact-row static">
          <span>BASE</span>
          <b>Valencia, Carabobo — Venezuela</b>
          <i>⚓</i>
        </div>
        <p className="contact-cta">¿Tienes una tripulación que necesita un navegante? Escríbeme.</p>
      </div>
    </div>
  );
}

export default function GameMenu() {
  const [phase, setPhase] = useState<"boot" | "start" | "menu">("boot");
  const [progress, setProgress] = useState(0);
  const [tip, setTip] = useState(0);
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState<number | null>(null);
  const [sound, setSound] = useState(true);
  const [attract, setAttract] = useState(false);
  const [clock, setClock] = useState("--:--");

  const audioRef = useRef<AudioContext | null>(null);
  const soundRef = useRef(sound);
  const idleRef = useRef<number | null>(null);
  const openRef = useRef<number | null>(null);
  const attractRef = useRef(false);

  soundRef.current = sound;
  openRef.current = open;
  attractRef.current = attract;

  const blip = useCallback((freq: number, dur: number, type: OscillatorType = "square", vol = 0.035) => {
    if (!soundRef.current || typeof window === "undefined") return;
    try {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!Ctx) return;
      if (!audioRef.current) audioRef.current = new Ctx();
      const ac = audioRef.current;
      if (ac.state === "suspended") ac.resume();
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      osc.connect(gain);
      gain.connect(ac.destination);
      const t = ac.currentTime;
      gain.gain.setValueAtTime(vol, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      osc.start(t);
      osc.stop(t + dur);
    } catch {
      /* audio no disponible */
    }
  }, []);

  const hoverSfx = useCallback(() => blip(880, 0.06, "square", 0.028), [blip]);
  const openSfx = useCallback(() => { blip(420, 0.1, "sawtooth", 0.03); setTimeout(() => blip(840, 0.14, "square", 0.03), 60); }, [blip]);
  const backSfx = useCallback(() => { blip(520, 0.08, "square", 0.028); setTimeout(() => blip(300, 0.12, "square", 0.028), 60); }, [blip]);

  useEffect(() => {
    let p = 0;
    const iv = window.setInterval(() => {
      p += Math.random() * 12 + 4;
      if (p >= 100) {
        p = 100;
        window.clearInterval(iv);
        window.setTimeout(() => setPhase("start"), 420);
      }
      setProgress(Math.min(100, Math.round(p)));
    }, 190);
    const tipIv = window.setInterval(() => setTip((t) => (t + 1) % BOOT_TIPS.length), 1400);
    return () => {
      window.clearInterval(iv);
      window.clearInterval(tipIv);
    };
  }, []);

  const updateClock = useCallback(() => {
    const d = new Date();
    setClock(`${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`);
  }, []);

  useEffect(() => {
    if (phase !== "menu") return;
    updateClock();
    const iv = window.setInterval(updateClock, 20000);
    return () => window.clearInterval(iv);
  }, [phase, updateClock]);

  const wake = useCallback(() => {
    setAttract(false);
    if (idleRef.current) window.clearTimeout(idleRef.current);
    idleRef.current = window.setTimeout(() => {
      if (openRef.current === null) setAttract(true);
    }, 9000);
  }, []);

  useEffect(() => {
    if (phase !== "menu") return;
    wake();
    const iv = window.setInterval(() => {
      if (openRef.current !== null || !attractRef.current) return;
      setActive((i) => (i + 1) % THEMES.length);
    }, 5200);
    return () => window.clearInterval(iv);
  }, [phase, wake]);

  const select = useCallback((i: number, playSfx = true) => {
    wake();
    setActive((prev) => {
      if (prev !== i && playSfx) hoverSfx();
      return i;
    });
  }, [wake, hoverSfx]);

  const openSection = useCallback((i: number) => {
    wake();
    openSfx();
    setActive(i);
    setOpen(i);
  }, [wake, openSfx]);

  const closeSection = useCallback(() => {
    wake();
    backSfx();
    setOpen(null);
  }, [wake, backSfx]);

  useEffect(() => {
    if (phase !== "menu") return;
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter", "Escape", " "].includes(e.key)) {
        e.preventDefault();
      }
      if (open !== null) {
        if (e.key === "Escape" || e.key === "Backspace") closeSection();
        return;
      }
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") select((active - 1 + THEMES.length) % THEMES.length);
      else if (e.key === "ArrowDown" || e.key === "ArrowRight") select((active + 1) % THEMES.length);
      else if (e.key === "Enter" || e.key === " ") openSection(active);
      else if (/^[1-5]$/.test(e.key)) openSection(Number(e.key) - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, open, active, select, openSection, closeSection]);

  useEffect(() => {
    if (phase !== "start") return;
    const startNow = () => {
      try {
        const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (Ctx && !audioRef.current) audioRef.current = new Ctx();
      } catch {
        /* sin audio */
      }
      blip(660, 0.16, "square", 0.04);
      window.setTimeout(() => blip(990, 0.22, "square", 0.04), 90);
      setPhase("menu");
    };
    const onKey = () => startNow();
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onKey);
    };
  }, [phase, blip]);

  const theme = THEMES[active];

  return (
    <div className={`game${open !== null ? " is-open" : ""}`} data-theme={theme.id}>
      <div className="bg-stack" aria-hidden="true">
        {THEMES.map((t, i) => (
          <div
            key={t.id}
            className={`bg-layer${i === active ? " is-active" : ""}`}
            style={{ backgroundImage: `url(${t.bg})` }}
          />
        ))}
      </div>
      <div className="scrim" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />
      <div className="scanlines" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />

      {phase === "menu" && (
        <>
          <header className="hud-top">
            <div className="hud-left">
              <span className="brand-mark">CF</span>
              <span className="brand-name">CESARFOLIO</span>
              <span className="build">v1.0.0</span>
            </div>
            <div className="hud-right">
              <span className="signal"><i /><i /><i /><i /></span>
              <span className="hud-online">SESIÓN LOCAL</span>
              <span className="hud-clock">{clock}</span>
            </div>
          </header>

          <nav className="menu" aria-label="Menú principal">
            <p className="menu-eyebrow">MENÚ PRINCIPAL</p>
            <ul>
              {THEMES.map((t, i) => (
                <li key={t.id}>
                  <button
                    type="button"
                    className={i === active ? "is-active" : ""}
                    onMouseEnter={() => select(i)}
                    onFocus={() => select(i)}
                    onClick={() => openSection(i)}
                  >
                    <span className="mi-num">{t.num}</span>
                    <span className="mi-body">
                      <span className="mi-label">{t.label}</span>
                      <span className="mi-kicker">{t.kicker}</span>
                    </span>
                    <span className="mi-franchise">{t.franchise}</span>
                    <span className="mi-arrow">▶</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <aside className="world" aria-hidden={open !== null}>
            <p className="world-motif">{theme.motif}</p>
            <h2 className="world-title">{theme.franchise}</h2>
            <p className="world-jp">{theme.jp}</p>
            <p className="world-tagline">{theme.tagline}</p>
            <p className="world-hint">
              <kbd>ENTER</kbd> para abrir · <kbd>↑↓</kbd> para cambiar
            </p>
          </aside>

          <footer className="hud-bottom">
            <div className="hints">
              <span><kbd>↑↓</kbd> NAVEGAR</span>
              <span><kbd>ENTER</kbd> SELECCIONAR</span>
              <span><kbd>ESC</kbd> VOLVER</span>
              <span><kbd>1-5</kbd> ACCESO RÁPIDO</span>
            </div>
            <button type="button" className="sound-btn" onClick={() => { setSound((s) => !s); blip(700, 0.08, "square", 0.03); }}>
              {sound ? "♪ SONIDO ON" : "♪ SONIDO OFF"}
            </button>
          </footer>

          <div className="panel-wrap" aria-hidden={open === null}>
            {open !== null && (
              <div className="panel" role="dialog" aria-modal="true" aria-label={THEMES[open].label}>
                <div className="panel-head">
                  <div>
                    <p className="panel-motif">{THEMES[open].motif}</p>
                    <h2 className="panel-title">{THEMES[open].label}</h2>
                    <p className="panel-sub">{THEMES[open].franchise} · {THEMES[open].jp}</p>
                  </div>
                  <button type="button" className="panel-close" onClick={closeSection}>
                    ESC <span>✕</span>
                  </button>
                </div>
                <div className="panel-body">
                  <Section id={THEMES[open].id} />
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {phase === "start" && (
        <div className="boot start" onPointerDown={() => setPhase("menu")}>
          <div className="boot-inner">
            <p className="boot-tag">UN PORTAFOLIO INTERACTIVO</p>
            <h1 className="boot-title">CESARFOLIO</h1>
            <p className="boot-sub">FAR CRY 4 · THE LAST OF US · DARLING IN THE FRANXX · HORIMIYA · ONE PIECE</p>
            <p className="press">PRESIONA CUALQUIER TECLA</p>
          </div>
          <span className="boot-foot">© 2026 CÉSAR DOMÍNGUEZ</span>
        </div>
      )}

      {phase === "boot" && (
        <div className="boot">
          <div className="boot-inner">
            <p className="boot-tag">CARGANDO SISTEMA</p>
            <h1 className="boot-title small">CESARFOLIO</h1>
            <div className="bar">
              <i style={{ width: `${progress}%` }} />
            </div>
            <p className="boot-progress">{progress}%</p>
            <p className="boot-tip">{BOOT_TIPS[tip]}</p>
          </div>
          <span className="boot-foot">INICIALIZANDO MÓDULOS · 05</span>
        </div>
      )}
    </div>
  );
}
