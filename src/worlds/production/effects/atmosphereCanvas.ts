export interface WaterPulse { x: number; y: number; born: number }
interface Mote { x: number; y: number; depth: number; size: number; phase: number }
export interface AtmosphereField { motes: Mote[]; pulses: WaterPulse[] }

export function createAtmosphere(count = 96): AtmosphereField {
  let seed = 0x1a4f3b;
  const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
  return { motes: Array.from({ length: count }, () => ({ x: random(), y: random(), depth: .2 + random() * .8, size: .8 + random() * 3.5, phase: random() * Math.PI * 2 })), pulses: [] };
}

export function addWaterPulse(field: AtmosphereField, x: number, y: number, time: number) {
  if (![x, y, time].every(Number.isFinite)) return;
  field.pulses.push({ x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)), born: time });
  if (field.pulses.length > 6) field.pulses.shift();
}

export function pruneWaterPulses(field: AtmosphereField, time: number) {
  field.pulses = field.pulses.filter(pulse => time - pulse.born < 1.7);
}

export function drawAtmosphere(context: CanvasRenderingContext2D, field: AtmosphereField, width: number, height: number, time: number, sensorX: number, sensorY: number) {
  context.clearRect(0, 0, width, height);
  const scale = width / 3840;
  for (const mote of field.motes) {
    const x = ((mote.x + time * .0017 * mote.depth + Math.sin(time * .11 + mote.phase) * .012) % 1) * width + sensorX * mote.depth * 14 * scale;
    const y = ((mote.y - time * .003 * mote.depth + Math.cos(time * .13 + mote.phase) * .008) % 1 + 1) % 1 * height + sensorY * mote.depth * 10 * scale;
    const size = Math.max(.45, mote.size * scale);
    const opacity = (.2 + mote.depth * .45) * (.72 + Math.sin(time * .55 + mote.phase) * .28);
    if (mote.depth > .87) {
      const glow = context.createRadialGradient(x, y, 0, x, y, size * 6);
      glow.addColorStop(0, `rgba(205,229,255,${opacity * .6})`); glow.addColorStop(1, 'rgba(180,216,255,0)');
      context.fillStyle = glow; context.beginPath(); context.arc(x, y, size * 6, 0, Math.PI * 2); context.fill();
    }
    context.fillStyle = `rgba(225,237,255,${opacity})`;
    context.beginPath(); context.arc(x, y, size, 0, Math.PI * 2); context.fill();
  }

  // Thin caustics sit over the reflective floor, in the same normalized plane.
  for (let line = 0; line < 6; line++) {
    context.beginPath();
    const base = height * (.73 + line * .043);
    for (let step = 0; step <= 48; step++) {
      const x = step / 48 * width;
      const y = base + Math.sin(step * .28 + time * .22 + line) * height * .0035 + Math.sin(step * .66 - time * .15 + line) * height * .0018;
      if (!step) context.moveTo(x, y); else context.lineTo(x, y);
    }
    const light = context.createLinearGradient(0, 0, width, 0);
    light.addColorStop(0, 'rgba(154,203,255,0)');
    light.addColorStop(.35 + Math.sin(time * .13 + line) * .12, 'rgba(193,223,255,.11)');
    light.addColorStop(1, 'rgba(154,203,255,0)');
    context.strokeStyle = light; context.lineWidth = Math.max(.5, 1.7 * scale); context.stroke();
  }

  for (let index = 0; index < 3; index++) {
    const phase = (time + index * 5.6) % 19;
    if (phase > 2.6) continue;
    const progress = phase / 2.6, alpha = Math.sin(progress * Math.PI) * .32;
    const x = width * (.22 + index * .27 + progress * .11), y = height * (.1 + index * .19 + progress * .08);
    const length = width * .12;
    const beam = context.createLinearGradient(x - length, y + length * .3, x, y);
    beam.addColorStop(0, 'rgba(192,223,255,0)'); beam.addColorStop(1, `rgba(224,238,255,${alpha})`);
    context.strokeStyle = beam; context.lineWidth = Math.max(.6, 1.8 * scale);
    context.beginPath(); context.moveTo(x - length, y + length * .3); context.lineTo(x, y); context.stroke();
  }

  pruneWaterPulses(field, time);
  for (const pulse of field.pulses) {
    const age = time - pulse.born;
    for (let ring = 0; ring < 3; ring++) {
      const progress = (age - ring * .11) / 1.35;
      if (progress <= 0 || progress >= 1) continue;
      const radius = (15 + (1 - (1 - progress) ** 2) * 800) * scale;
      const opacity = (1 - progress) ** 2 * .5;
      context.strokeStyle = `rgba(204,233,255,${opacity})`;
      context.lineWidth = Math.max(.7, 2 * scale);
      context.beginPath(); context.ellipse(pulse.x * width, pulse.y * height, radius, radius * .57, -.08, 0, Math.PI * 2); context.stroke();
      context.strokeStyle = `rgba(157,203,255,${opacity * .25})`; context.lineWidth = Math.max(2, 12 * scale); context.stroke();
    }
  }
}
