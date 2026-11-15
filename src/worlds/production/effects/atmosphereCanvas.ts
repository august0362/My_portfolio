export interface WaterPulse { x: number; y: number; born: number; ambient?: boolean }
interface Mote { x: number; y: number; depth: number; size: number; phase: number }
interface Ember { x: number; phase: number; speed: number; size: number; sway: number }
export interface AtmosphereField { motes: Mote[]; embers: Ember[]; pulses: WaterPulse[]; nextRipple: number; seed: number }
export interface AtmosphereColors { cool: string; highlight: string; warm: string }

const TAU = Math.PI * 2;
/** Time between the floor's own quiet ripples, in seconds. */
const AMBIENT_RIPPLE_EVERY = 3.4;

function channels(value: string, fallback: string) {
  const color = /^#[a-f\d]{6}$/i.test(value.trim()) ? value.trim() : fallback;
  return [1, 3, 5].map(offset => parseInt(color.slice(offset, offset + 2), 16)).join(',');
}

export function createAtmosphereColors(cool = '#bacbfe', highlight = '#eee2fa', warm = '#ddcdbf'): AtmosphereColors {
  return { cool: channels(cool, '#bacbfe'), highlight: channels(highlight, '#eee2fa'), warm: channels(warm, '#ddcdbf') };
}

function seeded(start: number) {
  let seed = start;
  return () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
}

export function createAtmosphere(count = 150): AtmosphereField {
  const random = seeded(0x1a4f3b);
  return {
    motes: Array.from({ length: count }, () => ({ x: random(), y: random(), depth: .2 + random() * .8, size: .8 + random() * 3.5, phase: random() * TAU })),
    embers: Array.from({ length: Math.round(count / 5) }, () => ({ x: random(), phase: random(), speed: .045 + random() * .05, size: 1.4 + random() * 2.6, sway: .008 + random() * .02 })),
    pulses: [],
    nextRipple: 1.2,
    seed: 0x5eed,
  };
}

export function addWaterPulse(field: AtmosphereField, x: number, y: number, time: number, ambient = false) {
  if (![x, y, time].every(Number.isFinite)) return;
  field.pulses.push({ x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)), born: time, ambient });
  if (field.pulses.length > 6) field.pulses.shift();
}

export function pruneWaterPulses(field: AtmosphereField, time: number) {
  field.pulses = field.pulses.filter(pulse => time - pulse.born < 1.7);
}

/** The reflective floor ripples on its own every few seconds, at varying spots. */
export function scheduleAmbientRipples(field: AtmosphereField, time: number) {
  if (time < field.nextRipple) return;
  const random = seeded(field.seed);
  field.seed = (field.seed * 31 + 7) >>> 0;
  addWaterPulse(field, .12 + random() * .76, .76 + random() * .18, time, true);
  field.nextRipple = time + AMBIENT_RIPPLE_EVERY * (.7 + random() * .6);
}

function sparkle(context: CanvasRenderingContext2D, x: number, y: number, radius: number, color: string, alpha: number) {
  context.strokeStyle = `rgba(${color},${alpha})`;
  context.lineWidth = Math.max(.5, radius * .18);
  context.beginPath();
  context.moveTo(x - radius, y); context.lineTo(x + radius, y);
  context.moveTo(x, y - radius); context.lineTo(x, y + radius);
  context.stroke();
}

function drawAurora(context: CanvasRenderingContext2D, width: number, height: number, time: number, colors: AtmosphereColors) {
  for (let band = 0; band < 2; band++) {
    const base = height * (.14 + band * .13);
    const amplitude = height * (.035 + band * .015);
    context.beginPath();
    for (let step = 0; step <= 32; step++) {
      const x = step / 32 * width;
      const y = base + Math.sin(step * .35 + time * (.16 + band * .05) + band * 2) * amplitude + Math.sin(step * .12 - time * .09) * amplitude * .6;
      if (!step) context.moveTo(x, y); else context.lineTo(x, y);
    }
    for (let step = 32; step >= 0; step--) {
      const x = step / 32 * width;
      const y = base + height * .09 + Math.sin(step * .3 + time * .12 + band) * amplitude * .7;
      context.lineTo(x, y);
    }
    // fill() closes the band.
    const shimmer = .5 + Math.sin(time * .4 + band * 1.7) * .5;
    const fill = context.createLinearGradient(0, 0, width, 0);
    const tone = band ? colors.highlight : colors.cool;
    fill.addColorStop(0, `rgba(${tone},0)`);
    fill.addColorStop(.25 + shimmer * .2, `rgba(${tone},${.07 + shimmer * .05})`);
    fill.addColorStop(.6 + shimmer * .15, `rgba(${colors.warm},${.04 + shimmer * .03})`);
    fill.addColorStop(1, `rgba(${tone},0)`);
    context.fillStyle = fill;
    context.fill();
  }
}

export function drawAtmosphere(context: CanvasRenderingContext2D, field: AtmosphereField, width: number, height: number, time: number, sensorX: number, sensorY: number, colors: AtmosphereColors = createAtmosphereColors()) {
  context.clearRect(0, 0, width, height);
  const scale = width / 3840;

  drawAurora(context, width, height, time, colors);

  for (const mote of field.motes) {
    const x = ((mote.x + time * .0042 * mote.depth + Math.sin(time * .21 + mote.phase) * .016) % 1) * width + sensorX * mote.depth * 18 * scale;
    const y = ((mote.y - time * .0068 * mote.depth + Math.cos(time * .23 + mote.phase) * .011) % 1 + 1) % 1 * height + sensorY * mote.depth * 13 * scale;
    const size = Math.max(.45, mote.size * scale);
    const twinkle = .62 + Math.sin(time * 1.15 + mote.phase) * .38;
    const opacity = (.22 + mote.depth * .5) * twinkle;
    if (mote.depth > .82) {
      const glow = context.createRadialGradient(x, y, 0, x, y, size * 7);
      glow.addColorStop(0, `rgba(${colors.cool},${opacity * .65})`); glow.addColorStop(1, `rgba(${colors.cool},0)`);
      context.fillStyle = glow; context.beginPath(); context.arc(x, y, size * 7, 0, TAU); context.fill();
      if (twinkle > .9) sparkle(context, x, y, size * (5 + (twinkle - .9) * 40), colors.highlight, (twinkle - .9) * 6);
    }
    context.fillStyle = `rgba(${colors.highlight},${opacity})`;
    context.beginPath(); context.arc(x, y, size, 0, TAU); context.fill();
  }

  // Warm embers rise from the reflective floor and fade as they climb.
  for (const ember of field.embers) {
    const life = (ember.phase + time * ember.speed) % 1;
    const x = (ember.x + Math.sin(time * .8 + ember.phase * TAU) * ember.sway) * width + sensorX * 10 * scale;
    const y = height * (.97 - life * .55);
    const alpha = Math.sin(life * Math.PI) * (.55 + Math.sin(time * 3 + ember.phase * 9) * .2);
    const radius = Math.max(.6, ember.size * scale * 1.4);
    const glow = context.createRadialGradient(x, y, 0, x, y, radius * 6);
    glow.addColorStop(0, `rgba(${colors.warm},${alpha * .75})`); glow.addColorStop(1, `rgba(${colors.warm},0)`);
    context.fillStyle = glow; context.beginPath(); context.arc(x, y, radius * 6, 0, TAU); context.fill();
    context.fillStyle = `rgba(${colors.highlight},${alpha})`;
    context.beginPath(); context.arc(x, y, radius * .8, 0, TAU); context.fill();
  }

  // Caustics sway over the reflective floor, in the same normalized plane.
  for (let line = 0; line < 7; line++) {
    context.beginPath();
    const base = height * (.72 + line * .038);
    for (let step = 0; step <= 48; step++) {
      const x = step / 48 * width;
      const y = base + Math.sin(step * .28 + time * .45 + line) * height * .005 + Math.sin(step * .66 - time * .3 + line) * height * .0026;
      if (!step) context.moveTo(x, y); else context.lineTo(x, y);
    }
    const light = context.createLinearGradient(0, 0, width, 0);
    light.addColorStop(0, `rgba(${colors.warm},0)`);
    light.addColorStop(.35 + Math.sin(time * .26 + line) * .2, `rgba(${colors.warm},.17)`);
    light.addColorStop(1, `rgba(${colors.warm},0)`);
    context.strokeStyle = light; context.lineWidth = Math.max(.5, 1.9 * scale); context.stroke();
  }

  // Shooting stars cross the sky every few seconds.
  for (let index = 0; index < 4; index++) {
    const phase = (time + index * 2.3) % 9.2;
    if (phase > 1.6) continue;
    const progress = phase / 1.6, alpha = Math.sin(progress * Math.PI) * .7;
    const startX = .12 + ((index * .29) % .7), startY = .05 + index * .07;
    const x = width * (startX + progress * .22), y = height * (startY + progress * .12);
    const length = width * .14;
    const beam = context.createLinearGradient(x - length, y - length * .32, x, y);
    beam.addColorStop(0, `rgba(${colors.cool},0)`); beam.addColorStop(1, `rgba(${colors.highlight},${alpha})`);
    context.strokeStyle = beam; context.lineWidth = Math.max(.7, 2.4 * scale);
    context.beginPath(); context.moveTo(x - length, y - length * .32); context.lineTo(x, y); context.stroke();
    sparkle(context, x, y, Math.max(3, 16 * scale), colors.highlight, alpha);
  }

  scheduleAmbientRipples(field, time);
  pruneWaterPulses(field, time);
  for (const pulse of field.pulses) {
    const age = time - pulse.born;
    const reach = pulse.ambient ? 360 : 800, strength = pulse.ambient ? .32 : .5;
    for (let ring = 0; ring < 3; ring++) {
      const progress = (age - ring * .11) / 1.35;
      if (progress <= 0 || progress >= 1) continue;
      const radius = (15 + (1 - (1 - progress) ** 2) * reach) * scale;
      const opacity = (1 - progress) ** 2 * strength;
      context.strokeStyle = `rgba(${colors.highlight},${opacity})`;
      context.lineWidth = Math.max(.7, 2 * scale);
      context.beginPath(); context.ellipse(pulse.x * width, pulse.y * height, radius, radius * (pulse.ambient ? .38 : .57), -.06, 0, TAU); context.stroke();
      context.strokeStyle = `rgba(${colors.cool},${opacity * .25})`; context.lineWidth = Math.max(2, 12 * scale); context.stroke();
    }
  }
}
