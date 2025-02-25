import { c as createComponent, a as createAstro, r as renderTemplate, b as renderComponent, e as renderScript, f as addAttribute, g as renderHead, h as renderSlot, m as maybeRenderHead } from '../chunks/astro/server_B0lQFdft.mjs';
import 'kleur/colors';
/* empty css                                 */
import { jsx, jsxs } from 'react/jsx-runtime';
import { useRef, useEffect } from 'react';
import { Renderer, Triangle, Color, Program, Mesh } from 'ogl';
import { Folder, House, Webhook } from 'lucide-react';
import { Tooltip } from '@heroui/react';
export { renderers } from '../renderers.mjs';

const VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;
const FRAG = `#version 300 es
precision highp float;

uniform float uTime;
uniform float uAmplitude;
uniform vec3 uColorStops[3];
uniform vec2 uResolution;
uniform float uBlend;

out vec4 fragColor;

vec3 permute(vec3 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

float snoise(vec2 v){
  const vec4 C = vec4(
      0.211324865405187, 0.366025403784439,
      -0.577350269189626, 0.024390243902439
  );
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);

  vec3 p = permute(
      permute(i.y + vec3(0.0, i1.y, 1.0))
    + i.x + vec3(0.0, i1.x, 1.0)
  );

  vec3 m = max(
      0.5 - vec3(
          dot(x0, x0),
          dot(x12.xy, x12.xy),
          dot(x12.zw, x12.zw)
      ), 
      0.0
  );
  m = m * m;
  m = m * m;

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);

  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

struct ColorStop {
  vec3 color;
  float position;
};

#define COLOR_RAMP(colors, factor, finalColor) {                int index = 0;                                              for (int i = 0; i < 2; i++) {                                    ColorStop currentColor = colors[i];                         bool isInBetween = currentColor.position <= factor;         index = int(mix(float(index), float(i), float(isInBetween)));   }                                                           ColorStop currentColor = colors[index];                     ColorStop nextColor = colors[index + 1];                    float range = nextColor.position - currentColor.position;   float lerpFactor = (factor - currentColor.position) / range;   finalColor = mix(currentColor.color, nextColor.color, lerpFactor); }

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  
  ColorStop colors[3];
  colors[0] = ColorStop(uColorStops[0], 0.0);
  colors[1] = ColorStop(uColorStops[1], 0.5);
  colors[2] = ColorStop(uColorStops[2], 1.0);
  
  vec3 rampColor;
  COLOR_RAMP(colors, uv.x, rampColor);
  
  float height = snoise(vec2(uv.x * 2.0 + uTime * 0.1, uTime * 0.25)) * 0.5 * uAmplitude;
  height = exp(height);
  height = (uv.y * 2.0 - height + 0.2);
  float intensity = 0.6 * height;
  
  float midPoint = 0.20;
  float auroraAlpha = smoothstep(midPoint - uBlend * 0.5, midPoint + uBlend * 0.5, intensity);
  
  vec3 auroraColor = intensity * rampColor;
  
  fragColor = vec4(auroraColor * auroraAlpha, auroraAlpha);
}
`;
function Aurora(props) {
  const {
    colorStops = ["#00d8ff", "#7cff67", "#00d8ff"],
    amplitude = 1,
    blend = 0.5
  } = props;
  const propsRef = useRef(props);
  propsRef.current = props;
  const ctnDom = useRef(null);
  useEffect(() => {
    const ctn = ctnDom.current;
    if (!ctn) return;
    const renderer = new Renderer({
      alpha: true,
      premultipliedAlpha: true,
      antialias: true
    });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.canvas.style.backgroundColor = "transparent";
    let program;
    function resize() {
      if (!ctn) return;
      const width = ctn.offsetWidth;
      const height = ctn.offsetHeight;
      renderer.setSize(width, height);
      if (program) {
        program.uniforms.uResolution.value = [width, height];
      }
    }
    window.addEventListener("resize", resize);
    const geometry = new Triangle(gl);
    if (geometry.attributes.uv) {
      delete geometry.attributes.uv;
    }
    const colorStopsArray = colorStops.map((hex) => {
      const c = new Color(hex);
      return [c.r, c.g, c.b];
    });
    program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        uTime: { value: 0 },
        uAmplitude: { value: amplitude },
        uColorStops: { value: colorStopsArray },
        uResolution: { value: [ctn.offsetWidth, ctn.offsetHeight] },
        uBlend: { value: blend }
      }
    });
    const mesh = new Mesh(gl, { geometry, program });
    ctn.appendChild(gl.canvas);
    let animateId = 0;
    const update = (t) => {
      animateId = requestAnimationFrame(update);
      const { time = t * 0.01, speed = 1 } = propsRef.current;
      if (program) {
        program.uniforms.uTime.value = time * speed * 0.1;
        program.uniforms.uAmplitude.value = propsRef.current.amplitude ?? 1;
        program.uniforms.uBlend.value = propsRef.current.blend ?? blend;
        const stops = propsRef.current.colorStops ?? colorStops;
        program.uniforms.uColorStops.value = stops.map((hex) => {
          const c = new Color(hex);
          return [c.r, c.g, c.b];
        });
        renderer.render({ scene: mesh });
      }
    };
    animateId = requestAnimationFrame(update);
    resize();
    return () => {
      cancelAnimationFrame(animateId);
      window.removeEventListener("resize", resize);
      if (ctn && gl.canvas.parentNode === ctn) {
        ctn.removeChild(gl.canvas);
      }
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [amplitude]);
  return /* @__PURE__ */ jsx("div", { ref: ctnDom, className: "w-full h-full" });
}

const $$Astro$1 = createAstro();
const $$Index$1 = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Index$1;
  const propsStr = JSON.stringify(Astro2.props);
  const paramsStr = JSON.stringify(Astro2.params);
  return renderTemplate`${renderComponent($$result, "vercel-analytics", "vercel-analytics", { "data-props": propsStr, "data-params": paramsStr, "data-pathname": Astro2.url.pathname })} ${renderScript($$result, "/Users/macbookpro/Desktop/Programacion/cesarfolio/node_modules/@vercel/analytics/dist/astro/index.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/macbookpro/Desktop/Programacion/cesarfolio/node_modules/@vercel/analytics/dist/astro/index.astro", void 0);

const $$Astro = createAstro();
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  return renderTemplate`<html lang="en" data-astro-cid-sckkx6r4> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="generator"${addAttribute(Astro2.generator, "content")}><title>Cesarfolio</title>${renderHead()}</head> <body class="bg-black w-screen relative" data-astro-cid-sckkx6r4> ${renderComponent($$result, "Analytics", $$Index$1, { "data-astro-cid-sckkx6r4": true })} <span class="absolute top-0 left-0 w-full h-full z-10 *:z-10" data-astro-cid-sckkx6r4> ${renderComponent($$result, "Aurora", Aurora, { "colorStops": ["#3A29FF", "#FF94B4", "#FF3232"], "blend": 0.5, "amplitude": 1, "speed": 0.5, "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/macbookpro/Desktop/Programacion/cesarfolio/src/components/Aurora", "client:component-export": "default", "data-astro-cid-sckkx6r4": true })} </span> ${renderSlot($$result, $$slots["default"])} </body></html>`;
}, "/Users/macbookpro/Desktop/Programacion/cesarfolio/src/layouts/Layout.astro", void 0);

function Header() {
  return /* @__PURE__ */ jsxs("header", { className: "fixed top-5 z-40 flex p-4 gap-4 bg-[#f3f3f310] rounded-xl backdrop-blur-md", children: [
    /* @__PURE__ */ jsx(Tooltip, { closeDelay: 0, content: "Proyectos", className: "bg-[#00000080] rounded-md", children: /* @__PURE__ */ jsx(Folder, { className: "cursor-pointer", color: "#ffffff", size: "32" }) }),
    /* @__PURE__ */ jsx(Tooltip, { closeDelay: 0, content: "Inicio", className: "bg-[#00000080] rounded-md", children: /* @__PURE__ */ jsx(House, { className: "cursor-pointer", color: "#ffffff", size: "32" }) }),
    /* @__PURE__ */ jsx(Tooltip, { closeDelay: 0, content: "Tecnologias", className: "bg-[#00000080] rounded-md", children: /* @__PURE__ */ jsx(Webhook, { className: "cursor-pointer", color: "#ffffff", size: "32" }) })
  ] });
}

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {}, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="w-full h-full *:z-40 flex flex-col items-center justify-center"> ${renderComponent($$result2, "Header", Header, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/macbookpro/Desktop/Programacion/cesarfolio/src/components/navigation/header", "client:component-export": "default" })} <h1 class="text-9xl font-bold max-md:text-6xl text-center">Cesar Dominguez</h1> <p class="text-xl text-[#ffffff80]">Ingeniero en Computacion</p> </main> ` })}`;
}, "/Users/macbookpro/Desktop/Programacion/cesarfolio/src/pages/index.astro", void 0);

const $$file = "/Users/macbookpro/Desktop/Programacion/cesarfolio/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
