export const prerender = false;
import { GoogleGenAI } from "@google/genai";

// Diagnostic GET: list models (development or with x-dev-gemini-key header)
export async function GET({ request }: { request: Request }) {
  try {
    // Gather apiKey same as POST
    const envNames = ['PUBLIC_GEMINI_KEY','GEMINI_API_KEY','GEMINI_KEY','VERCEL_GEMINI_KEY','NEXT_PUBLIC_GEMINI_KEY'];
    let apiKey: string | undefined;
    try { apiKey = (import.meta as any)?.env?.PUBLIC_GEMINI_KEY ?? undefined; } catch (_) { apiKey = undefined; }
    if (!apiKey) {
      for (const n of envNames) if (process.env[n]) { apiKey = process.env[n]; break; }
    }
    const devHeaderKey = request.headers.get('x-dev-gemini-key');
    if (!apiKey && devHeaderKey) apiKey = devHeaderKey;

    if (!apiKey) {
      const env_presence: Record<string, boolean> = {};
      for (const n of envNames) env_presence[n] = Boolean(((import.meta as any)?.env?.[n]) ?? process.env[n]);
      return new Response(JSON.stringify({ ok: false, reason: 'no_api_key', env_presence }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta2/models?key=${apiKey}`;
    const resp = await fetch(url);
    const raw = await resp.text();
    let data: any = null;
    try { data = JSON.parse(raw); } catch { data = { raw }; }
    if (!resp.ok) {
      // If provider returns 404, give targeted advice
      if (resp.status === 404) {
        return new Response(JSON.stringify({ ok: false, status: 404, text: 'Provider returned 404 - model root not found or key lacks permission. Check that the API key has access to the generative models API and that the endpoint URL is correct.', provider: data }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }
      return new Response(JSON.stringify({ ok: false, status: resp.status, provider: data }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ ok: true, provider: data }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: String(err) }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

export async function POST({ request }: { request: Request }) {
  // Show runtime environment for debugging
  console.debug('gemini endpoint NODE_ENV=', process.env.NODE_ENV);
  try {
    let body: any = {};
    try {
      body = await request.json();
    } catch (parseErr) {
      // Request body may be empty or invalid JSON; treat as empty
      body = {};
    }
    const input = body.input || '';

  // Mega-prompt: responder COMO Cesar Domínguez en ESPAÑOL, formato MARKDOWN
  const systemPrompt = `Eres la voz de Cesar Domínguez (dueño de este sitio). Responde por defecto en ESPAÑOL y formatea la respuesta en MARKDOWN.

Perfil: Cesar Domínguez — Ingeniero en Computación. Especialista en automatización, integración SmartOLT/OZMap, NOC tools. Tech: JavaScript, Java, Python, Tailwind, React, Docker, Astro, TypeScript, Node.js, Git, Nginx, MySQL, NestJS, Microsoft365, OZMAP API.

Instrucciones de estilo (MUY IMPORTANTES):
- Responde en ESPAÑOL.
- Habla como si fueras Cesar (primera persona ocasionalmente está bien: "Yo..."), mantén profesionalismo.
- Usa un tono enérgico y palabras llamativas: **Eficiencia**, **Automatización**, **Impacto**.
- SALIDA EN MARKDOWN: usa encabezados Markdown (\`#\`, \`##\`), **negrita** con \`**\`, *cursiva* con \`*\`, listas numeradas y viñetas, y bloques de código con triple backticks cuando muestres comandos.
- Estructura la respuesta así:
  1. Una línea corta de "Resumen:" (1-2 frases).
  2. Un encabezado principal con \`##\` con la idea central.
  3. Cuerpo con viñetas o listas numeradas según corresponda.
  4. Si debes mostrar comandos, usa un bloque de código con lenguaje si aplica: \`\`\`bash
  5. Al final, sugiere 2 acciones siguientes numeradas.

Respuesta esperada para la entrada del usuario:
Usuario: ${input}

Por favor responde SOLO con MARKDOWN (texto plano con sintaxis Markdown), sin JSON ni metadatos adicionales.`;
    // Check several common environment variable names for the Gemini key
    const envNames = [
      'PUBLIC_GEMINI_KEY',
      'GEMINI_API_KEY',
      'GEMINI_KEY',
      'VERCEL_GEMINI_KEY',
      'NEXT_PUBLIC_GEMINI_KEY'
    ];

    // In Vite/Astro dev, import.meta.env contains env vars loaded from .env
    // Prefer import.meta.env (if available) and fall back to process.env.
    // Note: import.meta is undefined in some server runtimes; guard access.
    let apiKey: string | undefined = undefined;
    try {
      // import.meta.env is available in Vite/Astro dev; use a safe cast
      const metaEnv = (import.meta as any)?.env as Record<string, any> | undefined;
      if (metaEnv) {
        for (const n of envNames) {
          if (metaEnv[n]) {
            apiKey = String(metaEnv[n]);
            console.debug('Found API key in import.meta.env for', n);
            break;
          }
        }
      }
    } catch (e) {
      // ignore meta access errors
    }

    // fallback to process.env if not found
    if (!apiKey) {
      for (const n of envNames) {
        if (process.env[n]) {
          apiKey = process.env[n];
          console.debug(`Found API key in process.env for ${n}`);
          break;
        }
      }
    }

    // Diagnostic: in development, log which env names exist (masked length) to help debugging
    if (process.env.NODE_ENV === 'development') {
      const presence: Record<string, string> = {};
      for (const n of envNames) {
        let val: any = undefined;
        try {
          val = (import.meta as any)?.env?.[n] ?? process.env[n];
        } catch (_) {
          val = process.env[n];
        }
        if (typeof val === 'string' && val.length > 0) {
          presence[n] = `<present length=${val.length}>`;
        } else {
          presence[n] = '<absent>';
        }
      }
      console.info('gemini env presence (masked):', JSON.stringify(presence));
    }

    // Accept header for dev testing (safe only in development)
    const devHeaderKey = request.headers.get('x-dev-gemini-key');
    if (!apiKey && process.env.NODE_ENV === 'development' && devHeaderKey) {
      apiKey = devHeaderKey;
      console.warn('Using apiKey from x-dev-gemini-key header because NODE_ENV=development');
    }

    // Also accept body.apiKey if running in development (used by client devkey command)
    if (!apiKey && process.env.NODE_ENV === 'development' && body.apiKey) {
      apiKey = body.apiKey; // only for dev testing
      console.warn('Using apiKey from request body because NODE_ENV=development');
    }

    if (!apiKey) {
      // Fallback: structured response when no key is configured
      if (process.env.NODE_ENV === 'development') console.info('No Gemini API key found in environment. Returning simulated response.');
      // Prepare a presence map so developer can see which env names are defined (no values leaked)
      const env_presence: Record<string, boolean> = {};
      for (const n of envNames) env_presence[n] = Boolean(process.env[n]);

      const simulated: any = {
        title: 'AI not configured',
        text: `To enable Gemini responses set PUBLIC_GEMINI_KEY in your environment.\n\nYou asked: ${input}`,
        suggestions: [
          'Try built-in commands: help, about, skills, projects.',
          'Set your PUBLIC_GEMINI_KEY (or GEMINI_API_KEY / GEMINI_KEY) in environment to get smart AI answers.'
        ],
        no_key: true
      };

      if (process.env.NODE_ENV === 'development') simulated.env_presence = env_presence;

      return new Response(JSON.stringify(simulated), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    // Use official Google GenAI client to generate content with retries
    try {
      const client = new GoogleGenAI({ apiKey });
      // Prefer smaller/faster models first if available for this key
      const modelsToTry = [
        'text-bison-001',          // smaller, fast text model (Google example)
        'gemini-mini',             // hypothetical smaller Gemini
        'gemini-1.0',              // another fallback small model
        'gemini-2.5-flash-lite',   // previous choice
        'gemini-2.5-flash'         // larger fallback
      ];
      const maxRetries = 3;
      let attempt = 0;
      let lastError: any = null;

      // Try each model in order, with retries per model
      let success = false;
      let finalResult: any = null;
      for (const modelToUse of modelsToTry) {
        attempt = 0;
        lastError = null;
        while (attempt < maxRetries) {
          attempt += 1;
          try {
            console.debug(`GenAI attempt ${attempt}/${maxRetries} model=${modelToUse}`);
            const gen = await client.models.generateContent({ model: modelToUse, contents: systemPrompt });
            const text = (gen as any)?.text ?? JSON.stringify(gen);
            finalResult = { text, model: modelToUse };
            success = true;
            break;
          } catch (e) {
            lastError = e;
            const msg = e instanceof Error ? e.message : String(e);
            const shouldRetry = msg.includes('503') || msg.includes('UNAVAILABLE') || msg.toLowerCase().includes('overloaded') || msg.toLowerCase().includes('temporarily');
            if (!shouldRetry || attempt >= maxRetries) {
              break; // stop retrying this model
            }
            // exponential backoff with jitter
            const backoff = Math.min(5000, Math.pow(2, attempt) * 250) + Math.floor(Math.random() * 300);
            console.warn(`GenAI request failed (attempt ${attempt}) for model ${modelToUse}: ${msg}. Retrying in ${backoff}ms`);
            await new Promise((res) => setTimeout(res, backoff));
          }
        }
        if (success) break; // we have a working model
      }

      // If we get here, either we succeeded (finalResult set) or retries exhausted
      if (typeof finalResult === 'object' && finalResult?.text) {
        return new Response(JSON.stringify({ text: finalResult.text, model: finalResult.model }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }

      // Otherwise, retries exhausted or non-retryable error occurred
      const message = lastError instanceof Error ? lastError.message : String(lastError);
      // If the message looks like a 404 or model missing, include models list for diagnostics
      if (message && (message.includes('404') || message.includes('NOT_FOUND') || message.toLowerCase().includes('requested entity'))) {
        try {
          const listUrl = `https://generativelanguage.googleapis.com/v1beta2/models?key=${apiKey}`;
          const listResp = await fetch(listUrl);
          const listText = await listResp.text();
          let listData: any = null;
          try { listData = JSON.parse(listText); } catch { listData = { raw: listText }; }
          const result = {
            text: `Provider error: ${message}`,
            advice: '404 from model generate: check that the model name exists for this project and that the Generative Models API is enabled for your API key. See provider_models for available models.',
            provider_models: listData
          };
          return new Response(JSON.stringify(result), { status: 502, headers: { 'Content-Type': 'application/json' } });
        } catch (e2) {
          return new Response(JSON.stringify({ text: `AI error: ${message}`, fetch_models_error: String(e2) }), { status: 500, headers: { 'Content-Type': 'application/json' } });
        }
      }

      // If it's an overloaded/503 error, give clear advice to retry later
      if (message && (message.includes('503') || message.includes('UNAVAILABLE') || message.toLowerCase().includes('overloaded'))) {
        return new Response(JSON.stringify({ text: `AI error: got status: ${message}. The model may be overloaded; try again later or reduce request rate.` }), { status: 503, headers: { 'Content-Type': 'application/json' } });
      }

      return new Response(JSON.stringify({ text: `AI error: ${message}` }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return new Response(JSON.stringify({ text: `AI error: ${message}` }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
  } catch (err) {
    // Return structured JSON with error details for the client
    const message = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ text: `AI error: ${message}` }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
