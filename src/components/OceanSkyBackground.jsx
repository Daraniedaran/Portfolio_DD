import { useEffect, useRef, useState } from "react";

/* =====================================================================================
 * OceanSkyBackground — full-screen, scroll-driven WebGL ocean + sky for this portfolio.
 *
 * CONCEPT
 *   A procedural ocean and sky rendered ENTIRELY in a GLSL fragment shader
 *   (raymarched height-field water, gradient sky, clouds, sun/moon, stars,
 *   storm lightning). Scrolling the page glides through 6 atmospheric scenes
 *   mapped to the portfolio sections:
 *     0 Dawn    → #home      (hopeful peach / indigo)
 *     1 Morning → #about     (fresh light blue)
 *     2 Midday  → #skills    (vibrant cyan)
 *     3 Sunset  → #education (golden amber / rose)
 *     4 Storm   → #projects  (dramatic slate / teal + lightning)
 *     5 Night   → #contact   (starry indigo + moon)
 *
 * HOW TO RE-THEME
 *   Edit ONLY the SCENES table below. Every color/param is centralized here;
 *   the shader receives the *interpolated* values as uniforms each frame, so
 *   the GLSL never needs touching to change the look. Colors are 0–1 RGB.
 *   Params flagged "warm" below use a delayed/eased blend curve so sunsets
 *   don't bleed into neighboring scenes too early.
 *
 * TECHNICAL NOTES (maps 1:1 to the spec)
 *   - One fixed full-viewport <canvas>, WebGL1 (alpha:false, antialias:false,
 *     depth:false), a single fullscreen triangle-strip quad; all pixels come
 *     from the fragment shader — no meshes, textures, or 3D libraries.
 *   - Ocean: 4-octave "wave" height field (UVs rotate per octave, crests
 *     sharpened with a choppiness exponent). Surface found by coarse forward
 *     march + bisection against the camera ray; normals via finite differences.
 *   - Camera: slow bounded drift (kept near the origin so mediump fragment
 *     precision stays clean on mobile GPUs), slight downward pitch, mild
 *     barrel distortion on the ray for a lens feel; height shifts per scene.
 *   - Sky: horizon→zenith gradient with per-scene curve, 2-layer advected
 *     procedural clouds, sun/moon from stacked pow(dot(dir,light),n) halo
 *     falloffs (glow + wide halo + disk), tiered twinkling starfield, and for
 *     the storm scene: random flash slots, a jagged bolt + branch, and a
 *     diffuse sheet-lightning glow on the clouds.
 *   - Water: Fresnel mix of diffuse refracted base ↔ reflected sky,
 *     subsurface-scatter approx on sun-facing crests, sun + moon speculars,
 *     high-frequency glitter sparkle, exponential distance fog into the
 *     horizon color (fog color == horizon color per scene, so the raymarch's
 *     far edge melts invisibly into the sky).
 *   - Scroll: native window scroll 0→1 is smoothstep-eased, then spring-
 *     smoothed (exponential damp ≈ critically-damped spring) every frame;
 *     scene index + blend derive from that gliding value. NOTE: we deliberately
 *     do NOT hijack wheel events — this canvas lives behind a real scrolling
 *     page, so trapping the wheel would break accessibility and mobile
 *     touch scrolling. (A standalone demo page could add velocity-damped
 *     wheel capture + end-to-start looping instead.)
 *   - Post: animated film grain, gentle filmic-ish tone map + gamma.
 *   - Perf: devicePixelRatio capped at 1.5; render scale adapts up/down from
 *     a rolling FPS average (0.45–1.0). Fragment precision is highp when the
 *     GPU reports it, mediump otherwise.
 *   - Fallbacks: prefers-reduced-motion renders ONE static frame; missing
 *     WebGL shows a pure-CSS gradient poster. Canvas pauses when tab hidden.
 *
 * UI OVERLAY (plain HTML/CSS, Tailwind utilities + a small <style> block)
 *   - Thin accent progress bar + nav dots per scene (click scrolls to the
 *     section). The portfolio sections themselves are the per-scene text
 *     blocks (existing Reveal animations); --ocean-accent updates per scene
 *     so overlay chrome matches the mood.
 * =================================================================================== */

// ─── Single source of truth: per-scene look. Edit me to re-theme. ──────────────
const SCENES = [
  {
    id: "home", label: "Dawn", section: "Home", accent: "#B81104",
    mood: "Calm seas, first light — the start of the journey.",
    skyHorizon: [1.0, 0.85, 0.69], skyZenith: [0.42, 0.51, 0.83], skyCurve: 1.4,
    sunDir: [0.8, 0.2, -0.55], sunColor: [1.0, 0.6, 0.34], sunI: 1.2,
    moonDir: [-0.4, 0.5, 0.6], moonColor: [0.8, 0.85, 1.0], moonAmt: 0.0, starAmt: 0.0,
    waterDeep: [0.1, 0.23, 0.38], waterShallow: [0.36, 0.62, 0.76],
    fogDensity: 0.012, waveH: 0.35, waveSpeed: 0.5, chop: 1.6,
    cloud: 0.35, storm: 0.0, glitter: 0.4, camH: 6.0,
  },
  {
    id: "about", label: "Morning", section: "About", accent: "#0ea5e9",
    mood: "Fresh light, clear water — who I am and what I do.",
    skyHorizon: [0.82, 0.91, 1.0], skyZenith: [0.22, 0.52, 0.85], skyCurve: 1.2,
    sunDir: [0.4, 0.55, -0.6], sunColor: [1.0, 0.95, 0.86], sunI: 1.4,
    moonDir: [-0.4, 0.5, 0.6], moonColor: [0.8, 0.85, 1.0], moonAmt: 0.0, starAmt: 0.0,
    waterDeep: [0.07, 0.25, 0.42], waterShallow: [0.24, 0.61, 0.77],
    fogDensity: 0.01, waveH: 0.45, waveSpeed: 0.6, chop: 1.8,
    cloud: 0.45, storm: 0.0, glitter: 0.6, camH: 5.5,
  },
  {
    id: "skills", label: "Midday", section: "Skills", accent: "#06b6d4",
    mood: "High sun, sparkling water — the toolkit at full brightness.",
    skyHorizon: [0.74, 0.93, 1.0], skyZenith: [0.09, 0.47, 0.84], skyCurve: 1.1,
    sunDir: [0.1, 0.9, -0.35], sunColor: [1.0, 1.0, 0.98], sunI: 1.6,
    moonDir: [-0.4, 0.5, 0.6], moonColor: [0.8, 0.85, 1.0], moonAmt: 0.0, starAmt: 0.0,
    waterDeep: [0.04, 0.23, 0.39], waterShallow: [0.18, 0.77, 0.83],
    fogDensity: 0.008, waveH: 0.55, waveSpeed: 0.75, chop: 2.0,
    cloud: 0.5, storm: 0.0, glitter: 0.9, camH: 5.0,
  },
  {
    id: "education", label: "Sunset", section: "Education", accent: "#f59e0b",
    mood: "Golden hour — qualifications in a warm light.",
    skyHorizon: [1.0, 0.64, 0.36], skyZenith: [0.3, 0.19, 0.51], skyCurve: 1.6,
    sunDir: [-0.75, 0.13, -0.6], sunColor: [1.0, 0.44, 0.2], sunI: 1.5,
    moonDir: [-0.4, 0.5, 0.6], moonColor: [0.85, 0.9, 1.0], moonAmt: 0.15, starAmt: 0.05,
    waterDeep: [0.13, 0.12, 0.3], waterShallow: [0.88, 0.42, 0.27],
    fogDensity: 0.011, waveH: 0.6, waveSpeed: 0.6, chop: 1.7,
    cloud: 0.6, storm: 0.0, glitter: 0.7, camH: 5.5,
  },
  {
    id: "projects", label: "Storm", section: "Projects", accent: "#14b8a6",
    mood: "Heavy weather, bright ideas — work forged under pressure.",
    skyHorizon: [0.32, 0.4, 0.47], skyZenith: [0.07, 0.11, 0.18], skyCurve: 1.3,
    sunDir: [0.2, 0.35, -0.8], sunColor: [0.7, 0.75, 0.82], sunI: 0.25,
    moonDir: [-0.4, 0.5, 0.6], moonColor: [0.8, 0.85, 1.0], moonAmt: 0.0, starAmt: 0.0,
    waterDeep: [0.04, 0.09, 0.14], waterShallow: [0.15, 0.28, 0.34],
    fogDensity: 0.02, waveH: 1.0, waveSpeed: 1.3, chop: 2.6,
    cloud: 0.9, storm: 1.0, glitter: 0.2, camH: 7.0,
  },
  {
    id: "contact", label: "Night", section: "Contact", accent: "#a855f7",
    mood: "Starlit calm — say hello under an open sky.",
    skyHorizon: [0.13, 0.19, 0.34], skyZenith: [0.01, 0.02, 0.07], skyCurve: 1.5,
    sunDir: [0.3, -0.3, -0.9], sunColor: [1.0, 0.6, 0.4], sunI: 0.0,
    moonDir: [-0.45, 0.55, -0.6], moonColor: [0.85, 0.9, 1.0], moonAmt: 1.0, starAmt: 1.0,
    waterDeep: [0.01, 0.05, 0.11], waterShallow: [0.09, 0.21, 0.35],
    fogDensity: 0.014, waveH: 0.4, waveSpeed: 0.4, chop: 1.5,
    cloud: 0.25, storm: 0.0, glitter: 0.55, camH: 6.0,
  },
];

// Minimal vertex shader: pass the quad corners straight to clip space.
const VERT = `
attribute vec2 aPos;
varying vec2 vNdc;
void main() {
  vNdc = aPos;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

// Fragment shader: ocean + sky + clouds + lightning + post. PRECISION_LINE is
// injected from JS (highp when the GPU reports it, else mediump).
const FRAG_BODY = `
varying vec2 vNdc;

uniform vec2 uRes;
uniform float uTime;
uniform vec3 uSkyHorizon;
uniform vec3 uSkyZenith;
uniform float uSkyCurve;
uniform vec3 uSunDir;
uniform vec3 uSunColor;
uniform float uSunI;
uniform vec3 uMoonDir;
uniform vec3 uMoonColor;
uniform float uMoonAmt;
uniform float uStarAmt;
uniform vec3 uWaterDeep;
uniform vec3 uWaterShallow;
uniform vec3 uFogColor;
uniform float uFogDensity;
uniform float uWaveH;
uniform float uWaveSpeed;
uniform float uChop;
uniform float uCloud;
uniform float uStorm;
uniform float uGlitter;
uniform float uCamH;

float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash12(i);
  float b = hash12(i + vec2(1.0, 0.0));
  float c = hash12(i + vec2(0.0, 1.0));
  float d = hash12(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * vnoise(p);
    p = p * 2.03 + vec2(17.3, 9.1);
    a *= 0.5;
  }
  return v;
}

mat2 rot2(float a) {
  float c = cos(a);
  float s = sin(a);
  return mat2(c, -s, s, c);
}

// Fractal wave height field: UVs rotate per octave for directional variety,
// pow(chop) sharpens the crests. Returns signed height around zero.
float waterHeight(vec2 p, float t) {
  float h = 0.0;
  float amp = 0.5;
  float freq = 0.16;
  float ang = 0.7;
  vec2 q = p;
  for (int i = 0; i < 4; i++) {
    vec2 d = vec2(cos(ang), sin(ang));
    float ph = dot(q, d) * freq + t * uWaveSpeed * (0.7 + 0.25 * float(i));
    float s = sin(ph) * 0.5 + 0.5;
    s = pow(s, uChop);
    h += amp * s;
    q = q * rot2(0.6 + 0.35 * float(i)) + vec2(3.1, 1.7) * float(i);
    amp *= 0.52;
    freq *= 2.02;
    ang += 0.9;
  }
  return (h - 0.55) * uWaveH * 2.0;
}

// Sky gradient + sun/moon stacked halos + disks + tiered twinkling stars.
// Clouds/lightning layer on top in main() for primary rays only; reflections
// reuse this cheaper version (plausible + fast).
vec3 skyGrad(vec3 dir, float t) {
  vec3 sunN = normalize(uSunDir);
  vec3 moonN = normalize(uMoonDir);
  float y = max(dir.y, 0.0);
  vec3 col = mix(uSkyHorizon, uSkyZenith, pow(y, uSkyCurve));

  float sd = max(dot(dir, sunN), 0.0);
  col += uSunColor * (pow(sd, 8.0) * 0.22 + pow(sd, 64.0) * 0.55) * uSunI;
  col += uSunColor * smoothstep(0.99930, 0.99965, sd) * 2.2 * uSunI;

  float md = max(dot(dir, moonN), 0.0);
  col += uMoonColor * (pow(md, 16.0) * 0.10 + pow(md, 220.0) * 0.45) * uMoonAmt;
  col += uMoonColor * smoothstep(0.99960, 0.99985, md) * 1.7 * uMoonAmt;

  if (uStarAmt > 0.003 && dir.y > 0.015) {
    vec2 sp = dir.xz / (dir.y + 0.30) * 34.0;
    vec2 cell = floor(sp);
    vec2 f = fract(sp);
    float h = hash12(cell);
    float density = 1.0 - 0.10 * uStarAmt;
    if (h > density) {
      vec2 spos = vec2(hash12(cell + 7.13), hash12(cell + 3.71));
      float d = length(f - spos);
      float mag = fract(h * 13.73);
      float tw = 0.55 + 0.45 * sin(t * (2.0 + mag * 3.0) + h * 40.0);
      float star = (1.0 - smoothstep(0.0, 0.10, d)) * (0.35 + 0.65 * mag) * tw;
      col += vec3(0.88, 0.92, 1.0) * star * uStarAmt * smoothstep(0.015, 0.35, dir.y);
    }
  }
  return col;
}

void main() {
  // Mild barrel distortion on the ray for a lens feel.
  vec2 px = vNdc;
  px *= 1.0 + 0.10 * dot(px, px);
  vec2 ndc = vec2(px.x * uRes.x / uRes.y, px.y);

  float t = uTime;

  // Camera: slow bounded drift (near origin => mediump-safe on mobile),
  // slight downward pitch toward the horizon line.
  vec3 ro = vec3(sin(t * 0.050) * 5.0, uCamH, sin(t * 0.033) * 5.0);
  vec3 fw = normalize(vec3(0.0, -0.11, -1.0));
  vec3 rt = normalize(cross(fw, vec3(0.0, 1.0, 0.0)));
  vec3 up = cross(rt, fw);
  vec3 rd = normalize(fw * 1.55 + ndc.x * rt + ndc.y * up);

  vec3 sunN = normalize(uSunDir);
  vec3 col;
  float cover = 0.0;

  if (rd.y < -0.0015) {
    // ---- Ocean: coarse forward march, then bisection refine ----
    float fPrev = ro.y - waterHeight(ro.xz, t);
    float tt = 0.0;
    float tPrev = 0.0;
    float hitT = -1.0;
    for (int i = 0; i < 24; i++) {
      tt += 1.5 + tt * 0.16;
      if (tt > 230.0) { break; }
      vec3 p = ro + rd * tt;
      float f = p.y - waterHeight(p.xz, t);
      if (f * fPrev < 0.0) {
        float a = tPrev;
        float b = tt;
        for (int j = 0; j < 6; j++) {
          float m = (a + b) * 0.5;
          vec3 pm = ro + rd * m;
          float fm = pm.y - waterHeight(pm.xz, t);
          if (fm * fPrev < 0.0) { b = m; } else { a = m; fPrev = fm; }
        }
        hitT = (a + b) * 0.5;
        break;
      }
      fPrev = f;
      tPrev = tt;
    }

    if (hitT < 0.0) {
      col = uFogColor; // missed: melt into fog so no hard edge shows
    } else {
      vec3 p = ro + rd * hitT;
      float e = 0.55;
      float hC = waterHeight(p.xz, t);
      float hX = waterHeight(p.xz + vec2(e, 0.0), t);
      float hZ = waterHeight(p.xz + vec2(0.0, e), t);
      vec3 n = normalize(vec3(hC - hX, e, hC - hZ));
      vec3 view = -rd;

      // Fresnel: diffuse refracted base <-> reflected sky.
      float ndv = max(dot(n, view), 0.0);
      float fres = 0.04 + 0.96 * pow(1.0 - ndv, 5.0);
      float hMix = clamp(hC / max(uWaveH * 2.0, 0.001) * 0.5 + 0.5, 0.0, 1.0);
      vec3 refr = mix(uWaterDeep, uWaterShallow, hMix * 0.65 + 0.20 * max(dot(n, sunN), 0.0));
      vec3 skyRef = skyGrad(reflect(rd, n), t);
      col = mix(refr, skyRef, fres);

      // Subsurface scatter: sun shining through crests toward the camera.
      float towardSun = max(dot(rd, sunN), 0.0);
      col += uWaterShallow * pow(towardSun, 3.0) * 0.35 * uSunI * clamp(hC * 2.0 + 0.45, 0.0, 1.0);

      // Sun + moon speculars (tight core + broad sheen).
      vec3 rf = reflect(rd, n);
      float sr = max(dot(rf, sunN), 0.0);
      col += uSunColor * (pow(sr, 240.0) * 2.0 + pow(sr, 36.0) * 0.22) * uSunI;
      float mr = max(dot(rf, normalize(uMoonDir)), 0.0);
      col += uMoonColor * (pow(mr, 300.0) * 1.3 + pow(mr, 48.0) * 0.12) * uMoonAmt;

      // High-frequency glitter sparkle riding on the sun path.
      float g = hash12(floor(p.xz * 9.0) + floor(t * 4.0) * 7.0);
      float gl = step(1.0 - 0.012 * (0.3 + uGlitter), g) * pow(sr, 5.0) * uGlitter;
      col += vec3(1.0, 0.98, 0.95) * gl * 1.6;

      // Distance fog into the horizon color.
      float fogF = 1.0 - exp(-hitT * uFogDensity);
      col = mix(col, uFogColor, fogF);
    }
  } else {
    // ---- Sky ----
    col = skyGrad(rd, t);

    // Two layered procedural cloud octaves advected by the wind.
    vec2 cuv = rd.xz / (abs(rd.y) + 0.18);
    float cl = fbm(cuv * 1.35 + vec2(t * 0.010, 0.0));
    cl = cl * 0.62 + 0.38 * fbm(cuv * 3.05 + vec2(-t * 0.016, t * 0.005));
    cover = smoothstep(1.0 - uCloud - 0.32, 1.0 - uCloud + 0.32, cl);
    cover *= smoothstep(0.0, 0.10, rd.y);
    vec3 cloudLit = mix(vec3(1.03, 1.0, 0.97), uSunColor, 0.28 * uSunI);
    vec3 cloudDark = vec3(0.30, 0.33, 0.40);
    vec3 cloudCol = mix(cloudLit, cloudDark, uStorm * 0.88);
    cloudCol += uSunColor * pow(max(dot(rd, sunN), 0.0), 3.0) * 0.30 * (1.0 - uStorm);
    col = mix(col, cloudCol, cover * 0.85);

    // ---- Storm lightning: random flash slots + jagged bolt + sheet glow ----
    if (uStorm > 0.01) {
      float slot = floor(t / 2.3);
      float r1 = hash12(vec2(slot, 1.7));
      float flash = 0.0;
      if (r1 > 0.68) {
        float lt = fract(t / 2.3);
        flash = exp(-lt * 9.0) * uStorm;
      }
      if (flash > 0.004) {
        float bx = (hash12(vec2(slot, 4.2)) - 0.5) * 1.7;
        float yy = cuv.y;
        float zig = (vnoise(vec2(yy * 3.0, slot * 7.0)) - 0.5) * 0.55
                  + (vnoise(vec2(yy * 9.0, slot * 3.0)) - 0.5) * 0.18;
        float dBolt = abs(cuv.x - (bx + zig));
        float bolt = (1.0 - smoothstep(0.0, 0.030, dBolt)) * smoothstep(0.0, 0.16, rd.y);
        float dBr = abs(cuv.x - (bx + zig + 0.28 + 0.10 * sin(yy * 7.0 + slot)));
        float branch = (1.0 - smoothstep(0.0, 0.015, dBr)) * 0.45 * smoothstep(0.0, 0.10, rd.y);
        col += vec3(0.84, 0.89, 1.0) * (bolt * 2.4 + branch) * flash;
        col += vec3(0.55, 0.60, 0.85) * flash * (cover * 0.65 + 0.22 * (1.0 - smoothstep(0.0, 0.45, rd.y)));
      }
    }
  }

  // ---- Post: animated grain, gentle tone map, gamma ----
  float gr = hash12(vNdc * uRes * 0.35 + fract(t) * 7.0) - 0.5;
  col += gr * 0.040;
  col = col / (col + 0.60) * 1.55;
  col = pow(max(col, vec3(0.0)), vec3(0.92));
  gl_FragColor = vec4(col, 1.0);
}
`;

// ─── Small JS helpers ──────────────────────────────────────────────────────────
const clamp01 = (x) => Math.min(1, Math.max(0, x));
const sstep = (x) => {
  const t = clamp01(x);
  return t * t * (3 - 2 * t);
};
const mixN = (a, b, t) => a + (b - a) * t;
const mix3 = (A, B, t) => [mixN(A[0], B[0], t), mixN(A[1], B[1], t), mixN(A[2], B[2], t)];
const norm3 = (v) => {
  const l = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / l, v[1] / l, v[2] / l];
};

export default function OceanSkyBackground() {
  const canvasRef = useRef(null);
  const barRef = useRef(null);
  const [active, setActive] = useState(0);

  // Nav dots: IntersectionObserver over the real portfolio sections, so the
  // active dot tracks the section actually in view (spec: fade/slide text is
  // handled by the existing Reveal component on those same sections).
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const i = SCENES.findIndex((s) => s.id === e.target.id);
            if (i >= 0) setActive(i);
          }
        }
      },
      { rootMargin: "-35% 0px -50% 0px", threshold: 0 }
    );
    SCENES.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let gl = null;
    try {
      gl = canvas.getContext("webgl", {
        alpha: false,
        antialias: false,
        depth: false,
        stencil: false,
        preserveDrawingBuffer: false,
        powerPreference: "low-power",
      });
    } catch {
      gl = null;
    }
    if (!gl) {
      canvas.style.display = "none"; // CSS poster fallback stays visible behind
      return;
    }

    // Fragment precision: highp when reported, else mediump (older mobiles).
    let prec = "mediump";
    try {
      const fmt = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT);
      if (fmt && fmt.precision > 0) prec = "highp";
    } catch {
      /* keep mediump */
    }

    const compile = (type, src) => {
      const sh = gl.createShader(type);
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        // eslint-disable-next-line no-console
        console.error("[ocean-sky] shader error:", gl.getShaderInfoLog(sh));
        return null;
      }
      return sh;
    };

    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, `precision ${prec} float;\n${FRAG_BODY}`);
    if (!vs || !fs) {
      canvas.style.display = "none";
      return;
    }
    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      // eslint-disable-next-line no-console
      console.error("[ocean-sky] link error:", gl.getProgramInfoLog(prog));
      canvas.style.display = "none";
      return;
    }
    gl.useProgram(prog);

    // Fullscreen triangle strip quad (4 verts, all math in fragment shader).
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const U = (n) => gl.getUniformLocation(prog, n);
    const u = {
      res: U("uRes"), time: U("uTime"),
      skyH: U("uSkyHorizon"), skyZ: U("uSkyZenith"), skyC: U("uSkyCurve"),
      sunD: U("uSunDir"), sunC: U("uSunColor"), sunI: U("uSunI"),
      moonD: U("uMoonDir"), moonC: U("uMoonColor"), moonA: U("uMoonAmt"), starA: U("uStarAmt"),
      deep: U("uWaterDeep"), shal: U("uWaterShallow"),
      fogC: U("uFogColor"), fogD: U("uFogDensity"),
      waveH: U("uWaveH"), waveS: U("uWaveSpeed"), chop: U("uChop"),
      cloud: U("uCloud"), storm: U("uStorm"), glit: U("uGlitter"), camH: U("uCamH"),
    };

    // ── Resolution: DPR capped at 1.5, adaptive scale 0.45–1.0 from FPS ──
    let scale = 1.0;
    const applySize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.max(2, Math.floor(canvas.clientWidth * dpr * scale));
      const h = Math.max(2, Math.floor(canvas.clientHeight * dpr * scale));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
      return [w, h];
    };
    let res = applySize();
    const onResize = () => {
      res = applySize();
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const rawScroll = () => {
      const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      return clamp01((window.scrollY || 0) / max);
    };

    // Upload one interpolated frame. warmT drives sun/water/horizon colors on
    // a delayed curve so scenes don't bleed into each other too early.
    const drawFrame = (timeSec, smooth) => {
      const sf = smooth * (SCENES.length - 1);
      const i0 = Math.min(SCENES.length - 2, Math.floor(sf));
      const i1 = i0 + 1;
      const b = sstep(sf - i0);
      const w = sstep((sf - i0 - 0.25) / 0.75);
      const A = SCENES[i0];
      const B = SCENES[i1];

      const skyH = mix3(A.skyHorizon, B.skyHorizon, w); // warm-delayed
      const skyZ = mix3(A.skyZenith, B.skyZenith, b);
      const sunC = mix3(A.sunColor, B.sunColor, w); // warm-delayed
      const sunI = mixN(A.sunI, B.sunI, w); // warm-delayed
      const shal = mix3(A.waterShallow, B.waterShallow, w); // warm-delayed
      const deep = mix3(A.waterDeep, B.waterDeep, b);

      gl.uniform2f(u.res, res[0], res[1]);
      gl.uniform1f(u.time, timeSec);
      gl.uniform3f(u.skyH, skyH[0], skyH[1], skyH[2]);
      gl.uniform3f(u.skyZ, skyZ[0], skyZ[1], skyZ[2]);
      gl.uniform1f(u.skyC, mixN(A.skyCurve, B.skyCurve, b));
      const sd = norm3(mix3(A.sunDir, B.sunDir, b));
      gl.uniform3f(u.sunD, sd[0], sd[1], sd[2]);
      gl.uniform3f(u.sunC, sunC[0], sunC[1], sunC[2]);
      gl.uniform1f(u.sunI, sunI);
      const md = norm3(mix3(A.moonDir, B.moonDir, b));
      gl.uniform3f(u.moonD, md[0], md[1], md[2]);
      const mc = mix3(A.moonColor, B.moonColor, b);
      gl.uniform3f(u.moonC, mc[0], mc[1], mc[2]);
      gl.uniform1f(u.moonA, mixN(A.moonAmt, B.moonAmt, b));
      gl.uniform1f(u.starA, mixN(A.starAmt, B.starAmt, b));
      gl.uniform3f(u.deep, deep[0], deep[1], deep[2]);
      gl.uniform3f(u.shal, shal[0], shal[1], shal[2]);
      gl.uniform3f(u.fogC, skyH[0], skyH[1], skyH[2]); // fog == horizon: seamless edge
      gl.uniform1f(u.fogD, mixN(A.fogDensity, B.fogDensity, b));
      gl.uniform1f(u.waveH, mixN(A.waveH, B.waveH, b));
      gl.uniform1f(u.waveS, mixN(A.waveSpeed, B.waveSpeed, b));
      gl.uniform1f(u.chop, mixN(A.chop, B.chop, b));
      gl.uniform1f(u.cloud, mixN(A.cloud, B.cloud, b));
      gl.uniform1f(u.storm, mixN(A.storm, B.storm, b));
      gl.uniform1f(u.glit, mixN(A.glitter, B.glitter, b));
      gl.uniform1f(u.camH, mixN(A.camH, B.camH, b));
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    // Overlay chrome: progress bar + per-scene accent var. Updated only when
    // values actually change (direct DOM writes, no per-frame React state).
    let lastScene = -1;
    const updateChrome = (smooth) => {
      if (barRef.current) barRef.current.style.transform = `scaleX(${smooth.toFixed(4)})`;
      const idx = Math.min(SCENES.length - 1, Math.round(smooth * (SCENES.length - 1)));
      if (idx !== lastScene) {
        lastScene = idx;
        document.documentElement.style.setProperty("--ocean-accent", SCENES[idx].accent);
      }
    };

    const startScroll = rawScroll();
    let smooth = sstep(startScroll);
    updateChrome(smooth);

    // prefers-reduced-motion: a single static frame, no loop.
    if (reduced) {
      res = applySize();
      drawFrame(0.0, smooth);
      updateChrome(smooth);
      return () => {
        window.removeEventListener("resize", onResize);
        window.removeEventListener("orientationchange", onResize);
      };
    }

    let raf = 0;
    let running = true;
    let last = performance.now();
    let emaMs = 16.7;
    let frames = 0;
    const t0 = last;

    const loop = (now) => {
      if (!running) return;
      raf = requestAnimationFrame(loop);
      const dtMs = Math.min(100, now - last);
      last = now;
      const dt = dtMs / 1000;

      // Rolling FPS → adaptive render scale (rechecked ~every 2s).
      emaMs = emaMs * 0.95 + dtMs * 0.05;
      if (++frames % 120 === 0) {
        const fps = 1000 / Math.max(emaMs, 0.01);
        if (fps < 42 && scale > 0.45) {
          scale = Math.max(0.45, scale - 0.15);
          res = applySize();
        } else if (fps > 57 && scale < 1.0) {
          scale = Math.min(1.0, scale + 0.1);
          res = applySize();
        }
      }

      // Native scroll → smoothstep ease → exponential spring glide.
      const target = sstep(rawScroll());
      if (smooth === undefined || smooth === null) smooth = target;
      smooth += (target - smooth) * (1 - Math.exp(-dt * 3.5));

      drawFrame((now - t0) / 1000, smooth);
      updateChrome(smooth);
    };
    raf = requestAnimationFrame(loop);

    const onVis = () => {
      if (document.hidden) {
        running = false;
        if (raf) cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(loop);
      }
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
    };
  }, []);

  const goTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      {/* Poster fallback: dawn gradient. Always behind; visible during load,
          if WebGL fails, or (static) for reduced motion. */}
      <div className="ocean-poster fixed inset-0 -z-20" aria-hidden="true" />

      <canvas
        ref={canvasRef}
        className="fixed inset-0 -z-10 h-full w-full pointer-events-none"
        aria-hidden="true"
      />

      {/* Thin scroll progress bar (accent follows the current scene). */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px] bg-slate-900/5">
        <div
          ref={barRef}
          className="ocean-bar h-full w-full origin-left"
          style={{ transform: "scaleX(0)" }}
        />
      </div>

      {/* Monospace HUD removed per request — progress bar + nav dots remain. */}

      {/* Nav dots: one per scene, pointer-events only on the buttons. */}
      <nav
        className="pointer-events-none fixed right-3 top-1/2 z-40 flex -translate-y-1/2 flex-col gap-2 sm:right-5 sm:gap-2.5"
        aria-label="Scene navigation"
      >
        {SCENES.map((s, i) => (
          <button
            key={s.id}
            onClick={() => goTo(s.id)}
            title={`${s.section} — ${s.label}`}
            aria-label={`Go to ${s.section}`}
            className={`ocean-dot pointer-events-auto rounded-full transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              i === active ? "is-active scale-125" : "hover:scale-125"
            }`}
          />
        ))}
      </nav>

      <style>{`
        :root { --ocean-accent: #B81104; }
        .ocean-poster {
          background:
            radial-gradient(900px 480px at 18% 18%, rgba(184,17,4,0.20), transparent 60%),
            radial-gradient(800px 520px at 82% 30%, rgba(255,250,205,0.7), transparent 60%),
            radial-gradient(700px 640px at 50% 92%, rgba(245,158,11,0.14), transparent 60%),
            linear-gradient(180deg, #fffdf0 0%, #FFFACD 45%, #fdeeda 100%);
        }
        .ocean-bar {
          background: linear-gradient(90deg, #FFFACD, #B81104);
          box-shadow: 0 0 12px color-mix(in srgb, var(--ocean-accent) 60%, transparent);
        }
        .ocean-dot {
          width: 10px; height: 10px;
          background: rgba(255,255,255,0.75);
          border: 1px solid rgba(15,23,42,0.18);
          box-shadow: 0 2px 8px rgba(15,23,42,0.15);
          cursor: pointer;
        }
        .ocean-dot:hover { border-color: var(--ocean-accent); }
        .ocean-dot.is-active {
          background: var(--ocean-accent);
          border-color: var(--ocean-accent);
          box-shadow: 0 0 12px color-mix(in srgb, var(--ocean-accent) 70%, transparent);
        }
        @media (max-width: 640px) {
          .ocean-dot { width: 8px; height: 8px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ocean-dot { transition: none; }
        }
      `}</style>
    </>
  );
}
