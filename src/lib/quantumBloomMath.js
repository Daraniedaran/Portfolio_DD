// LUNA: 4D Hypercube / Tesseract Particle Simulation
// Extracted directly from https://particles.casberry.in/?sim=LUNA
// Optimized for zero-allocation 60fps execution with Float32Array buffers.

const PI = Math.PI;
const PI_16 = Math.PI * 16;
const PI_4 = Math.PI * 4;
const INV3 = 1 / 3;

/**
 * Computes particle position and color for index `i` using exact LUNA formulas.
 * 
 * Original Casberry LUNA formula:
 *   t = time * spin
 *   phi = (i / count) * PI * 16
 *   layer = i / count
 *   w = sin(phi * 0.5 + t) * pulse
 *   x4 = cos(phi) * size, y4 = sin(phi) * size
 *   z4 = cos(phi * 2 + t) * size * 0.6, w4 = sin(phi * 1.5 + t * 0.5) * size * 0.4
 *   wDist = 2.5 - w4 / size
 *   x = (x4 * cos4 - w4 * sin4) / wDist
 *   y = (y4 + sin(t * 0.3) * size * 0.3) / wDist
 *   z = (z4 * cos4 + x4 * sin4 * 0.5) / wDist
 *   breath = 1 + 0.15 * sin(time * 1.5 + layer * PI * 4)
 *   hue = 0.65 + 0.15 * sin(phi + time * 0.4)
 *   light = 0.4 + 0.4 * abs(sin(phi * 0.5 + time))
 */
export function computeParticle(i, count, time, p, outPos, outCol) {
  const spin = p.spin ?? 0.8;
  const size = p.size ?? 60;
  const pulse = p.pulse ?? 1.0;

  const t = time * spin;
  const layer = i / count;
  const phi = layer * PI_16;

  // 4D rotation projected into 3D
  const cos4 = Math.cos(t * 0.7);
  const sin4 = Math.sin(t * 0.7);

  const x4 = Math.cos(phi) * size;
  const y4 = Math.sin(phi) * size;
  const z4 = Math.cos(phi * 2 + t) * size * 0.6;
  const w4 = Math.sin(phi * 1.5 + t * 0.5) * size * 0.4 * pulse;

  // Project 4D -> 3D (perspective divide by w dimension)
  const wDist = Math.max(0.4, 2.5 - w4 / size);
  const x = (x4 * cos4 - w4 * sin4) / wDist;
  const y = (y4 + Math.sin(t * 0.3) * size * 0.3) / wDist;
  const z = (z4 * cos4 + x4 * sin4 * 0.5) / wDist;

  // Breathing effect
  const breath = 1 + 0.15 * Math.sin(time * 1.5 + layer * PI_4);

  const o = i * 3;
  outPos[o] = x * breath;
  outPos[o + 1] = y * breath;
  outPos[o + 2] = z * breath;

  // Deep space color: ultraviolet -> electric blue -> hot white core
  let hue = 0.65 + 0.15 * Math.sin(phi + time * 0.4);
  hue = ((hue % 1) + 1) % 1; // wrap to [0, 1)

  const light = Math.min(0.95, Math.max(0.2, 0.4 + 0.4 * Math.abs(Math.sin(phi * 0.5 + time))));
  const sat = 1.0;

  // Fast inline HSL to RGB conversion
  const q = light < 0.5 ? light * (1.0 + sat) : light + sat - light * sat;
  const pp = 2.0 * light - q;

  outCol[o]     = hue2rgb(pp, q, hue + INV3);
  outCol[o + 1] = hue2rgb(pp, q, hue);
  outCol[o + 2] = hue2rgb(pp, q, hue - INV3);
}

function hue2rgb(pp, q, t) {
  if (t < 0) t += 1;
  else if (t > 1) t -= 1;
  if (t < 0.1666667) return pp + (q - pp) * 6.0 * t;
  if (t < 0.5) return q;
  if (t < 0.6666667) return pp + (q - pp) * (0.6666667 - t) * 6.0;
  return pp;
}

// Scroll modulation: subtly shifts scale and 4D spin as user navigates sections
export function paramsForScroll(base, progress) {
  const ease = progress * progress * (3.0 - 2.0 * progress);
  return {
    spin: base.spin * (1.0 + ease * 0.4),
    size: base.size * (1.0 + ease * 0.15),
    pulse: base.pulse * (1.0 + Math.sin(ease * PI) * 0.25),
  };
}

