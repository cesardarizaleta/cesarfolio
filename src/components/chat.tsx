import React, { useState, useRef, useEffect } from "react";
let marked: any = null;
try { marked = require('marked'); } catch (e) { try { marked = (await import('marked')).marked; } catch {} }
import { collection, getDocs, addDoc } from "firebase/firestore";
import {db} from "../components/firebase/config";

export default function Chat() {
    const [messages, setMessages] = useState<string[]>([]);
    const [typedText, setTypedText] = useState("");
    const [devApiKey, setDevApiKey] = useState<string | null>(() => typeof window !== 'undefined' ? sessionStorage.getItem('DEV_GEMINI_KEY') : null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [markedParser, setMarkedParser] = useState<any>(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
        // Typing effect for welcome message
        const welcomeText = "Welcome to CesarFolio - Terminal Portfolio";
        let index = 0;
        const interval = setInterval(() => {
            setTypedText(welcomeText.slice(0, index));
            index++;
            if (index > welcomeText.length) clearInterval(interval);
        }, 100);
        return () => clearInterval(interval);
    }, []);

    // Dynamically import marked on client only
    useEffect(() => {
        if (typeof window === 'undefined') return;
        let mounted = true;
        import('marked').then((mod) => {
            if (mounted) setMarkedParser(() => mod.marked);
        }).catch(() => {});
        return () => { mounted = false; };
    }, []);

    function handleCommand(command: string): string {
        switch (command) {
            case "ls":
                return "about.txt  projects.txt  contact.txt  skills.txt  experience.txt  education.txt";
            case "cat about.txt":
                return "Cesar Dominguez - Full Stack Developer";
            case "about":
                return `Cesar Dominguez\nComputer Engineer\n\nHi there! I'm Cesar, a passionate developer and open-source enthusiast. I enjoy working on a variety of projects, from web development to machine learning. Feel free to check out my repositories and contributions, and don't hesitate to reach out if you have any questions or want to collaborate on a project!\n\nSoy una persona proactiva, organizada y responsable, con más de 3 años de experiencia en desarrollo Full Stack y DevOps, donde priorizo código limpio, automatización y soluciones eficientes. Además, tengo un fuerte interés en telecomunicaciones: disfruto instalando y configurando routers.`;
            case "skills":
                return `Knowledge:\n- JavaScript\n- Java\n- Python\n- Tailwind CSS\n- React\n- Docker\n- Astro\n- TypeScript\n- Node.js\n- Git/GitHub\n- Nginx\n- MySQL\n- NestJS\n- Microsoft 365\n- Click-Up\n- OZMAP API\n\nIn Process:\n- Vue.js\n- Kubernetes`;
            case "experience":
                return `FIBEXTELECOM - ISP\nAUTOMATIZADOR DE PROCESOS - Presencial - 2025\n\nComo especialista en automatización de procesos en Fibex Telecom, soy responsable de diseñar e implementar soluciones para optimizar los flujos de trabajo internos de la empresa. Esto incluye la integración y mejora de software administrativo y el desarrollo de bots automatizados para aumentar la eficiencia operativa y reducir las tareas manuales repetitivas.\n\nSistemas:\n- Software para la gestion de informes automatizados de OZMAP y SmartOLT\n- Auditorias en tiempo real sobre cambios realizados en la plataforma\n- Informes generales e individuales sobre Cajas, Postes, Clientes FTTH, etc.\n- Georeferenciacion de clientes, OLTS, ONUS, Cajas, Postes, etc.\n- Analisis regional general (Puertos totales pendientes, Cajas NAP Pendientes, Prospectos, Mangas Pendientes)\n- Creacion de informes masivos para la entidad reguladora\n- Integracion entre SmartOLT y OZMap para datos en tiempo real\n\nSoftware de gestión para la creación de tickets y la detección de fallas, tanto masivas como individuales, a nivel nacional en tiempo real, para ofrecer soporte inmediato (NOC).\n- Gestion del personal administrativo por roles (Administrador, Usuario y Supervisor), tambien por departamento (NOC, Cobranzas, etc.)\n- Metricas en tiempo real sobre todo el personal y las conexiones a nivel nacional.\n- Creacion y asignacion de Tickets de soporte\n- Deteccion de fallas individual para la creacion de tickets automaticos.\n- Deteccion de fallas masivas a nivel nacional para atencion inmediata.\n- Dashboard administrativo para visualizar estadisticas generales sobre OLTS, ONUS, Usuarios, etc.\n- Visualizar datos en tiempo real de ONUs para obtener su potencia y el estado del cliente.`;
            case "education":
                return `Universidad Jose Antonio Paez\n2022 - Actualmente\nIngeniero en Computacion`;
            case "projects":
                return `Proyectos:\n- eCommerce con IA personalizada\n- Inventario electronico de escritorio\n- Plataforma CTF - Crystalbox\n- Landing Page - LIDA (lidalabs.com)\n- CesarFolio - A portfolio website made with Astro and TailwindCSS`;
            case "contact":
                return `Email: cesardarizaleta@gmail.com\nPhone: 0414-4019911\nGitHub: @cesardarizaleta\nLocation: Parral - Valencia, Carabobo, Venezuela`;
            case "languages":
                return `Idiomas:\n- Inglés: Nivel Avanzado B2 (CEVAC)`;
            case "courses":
                return `Cursos:\n- Java - AcademiaEP: Nivel Intermedio\n- Excel - CENTECPRO: Nivel Intermedio\n- Docker - Platzi: Nivel Avanzado\n- NestJS - Platzi: Nivel Intermedio\n- Redes de Internet: Nivel Profesional\n- Pentesting a Redes: Nivel Profesional`;
            case "quote":
                return `"Happiness is not an ideal of reason, but of imagination." - Immanuel Kant`;
            case "cat projects.txt":
                return "CesarFolio - A portfolio website made with React and TailwindCSS";
            case "cat contact.txt":
                return "Email: cesardarizaleta@gmail.com";
            case "help":
                return "Available commands:\n- ls: List files\n- cat [file]: Show file content\n- about: Personal information\n- skills: Technical skills\n- experience: Work experience\n- education: Academic background\n- projects: Personal projects\n- contact: Contact information\n- languages: Languages spoken\n- courses: Completed courses\n- quote: Inspirational quote\n- clear: Clear terminal\n- help: Show this help";
            case "clear":
                setMessages([]);
                return "";

            default:
                return "[AI] Querying remote assistant...";
        }
    }

    function handleInput(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === "Enter") {
            const input = event.currentTarget.value.trim();
            if (input === "") return;

            // Mostrar el comando ingresado
            setMessages(prev => [...prev, `> ${input}`]);
            // Clear input immediately to avoid using the synthetic event inside async callbacks
            event.currentTarget.value = "";

            // Comandos locales
            const parts = input.split(" ");
            if(parts[0] === "devkey") {
                const key = parts[1];
                if(!key) {
                    setMessages(prev => [...prev, "Usage: devkey <KEY> (stores key in sessionStorage for testing)"]);
                } else {
                    try { sessionStorage.setItem('DEV_GEMINI_KEY', key); } catch(e) {}
                    setDevApiKey(key);
                    setMessages(prev => [...prev, "Dev API key set (stored in sessionStorage). Don't use in production."]);
                }
                event.currentTarget.value = "";
                return;
            }

            if(parts[0] === "login") {
                const email = input.split(" ")[1];
                const password = input.split(" ")[2];
                login(email, password);
                setMessages(prev => [...prev, "User created"]);
                event.currentTarget.value = "";
                return;
            }

            const local = handleCommand(input);
            if (local !== "[AI] Querying remote assistant...") {
                setMessages(prev => [...prev, local]);
                event.currentTarget.value = "";
                return;
            }

            // Si no es un comando local, llamar al endpoint AI
            setMessages(prev => [...prev, "[AI] Thinking..."]);
            (async () => {
                try {
                    const bodyPayload: any = { input };
                    if (devApiKey) bodyPayload.apiKey = devApiKey;
                    const res = await fetch('/api/gemini', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(bodyPayload) });
                    const ct = res.headers.get('content-type') || '';
                    let text: string;
                    if (ct.includes('application/json')) {
                        // Puede lanzar si el body está vacío -> capturado por try/catch
                        const json = await res.json();
                        text = json?.text || JSON.stringify(json) || 'No response';
                    } else {
                        const raw = await res.text();
                        text = raw ? `Provider raw: ${raw}` : 'Empty response from provider';
                    }

                    if (!res.ok) {
                        text = `Provider error (${res.status}): ${text}`;
                    }

                    // If structured response (title + suggestions), render prettily
                    let rendered = text;
                    try {
                        const parsed = JSON.parse(text.startsWith('{') || text.startsWith('[') ? text : '{}');
                        if (parsed && parsed.title) {
                            rendered = `=== ${parsed.title} ===\n${parsed.text || ''}\n\nSuggestions:`;
                            if (Array.isArray(parsed.suggestions)) {
                                rendered += '\n' + parsed.suggestions.map((s: string, i: number) => `${i+1}) ${s}`).join('\n');
                            }
                        }
                    } catch (e) {
                        // ignore parse error and keep raw text
                    }

                    // Reemplazar la última ocurrencia de '[AI] Thinking...'
                    setMessages(prev => {
                        const copy = [...prev];
                        const idx = copy.lastIndexOf('[AI] Thinking...');
                        if (idx !== -1) {
                            copy[idx] = rendered;
                        } else {
                            copy.push(rendered);
                        }
                        return copy;
                    });
                } catch (err: any) {
                    const message = `AI Error: ${err?.message || String(err)}`;
                    setMessages(prev => {
                        const copy = [...prev];
                        const idx = copy.lastIndexOf('[AI] Thinking...');
                        if (idx !== -1) copy[idx] = message; else copy.push(message);
                        return copy;
                    });
                }
            })();
        }
    }

    async function login(email: string, password: string) {
        const userRef = collection(db, "users");
            await addDoc(userRef, {
                email: email,
                password: password
        });
    }

    return (
        <div className="p-8 text-white font-mono rounded-lg shadow-2xl max-h-full overflow-y-auto neon-scroll neon-tall">
            <pre className="text-orange-400 mb-4 animate-pulse">
{`
 ██████╗███████╗██████╗ 
██╔════╝╚══███╔╝██╔══██╗
██║       ███╔╝ ██████╔╝
██║      ███╔╝  ██╔══██╗
╚██████╗███████╗██║  ██║
 ╚═════╝╚══════╝╚═╝  ╚═╝
`}
            </pre>
            <p className="text-orange-300 text-lg font-bold mb-2">{typedText}<span className="animate-pulse">|</span></p>
            <p className="text-orange-300 mb-4">Type 'help' to see the available commands</p>
            <div className="space-y-1 markdown-body">
                {messages.map((message, index) => (
                    <div key={index} className="text-orange-200">
                        {markedParser ? (
                            <div dangerouslySetInnerHTML={{ __html: markedParser.parse(message) }} />
                        ) : (
                            <pre className="whitespace-pre-wrap">{message}</pre>
                        )}
                    </div>
                ))}
            </div>
            <span className="flex items-center gap-2 mt-4">
                <span className="text-orange-400 font-bold animate-blink">{'>'}</span>
                <input
                    onKeyDown={handleInput}
                    type="text"
                    ref={inputRef}
                    className="bg-transparent text-orange-200 border-none outline-none w-full caret-orange-400"
                    placeholder="Enter command..."
                />
            </span>
        </div>
    );
}