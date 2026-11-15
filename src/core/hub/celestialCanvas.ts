import { TAU } from './orbitMath';
import type { LightField } from './celestialMotion';

export interface CelestialView { width: number; height: number; cx: number; cy: number; radius: number; vertical: number; lite: boolean; light: boolean; colors: { line: string; star: string; gold: string } }

// A seeded sky stays in place on resize and never touches personal assets.
const stars = Array.from({ length: 170 }, (_, index) => ({
  x: ((index * 127.1 + 31) % 997) / 997,
  y: ((index * index * 13.7 + 71) % 991) / 991,
  size: 0.4 + (index % 5) * 0.22,
}));

export function drawCelestial(ctx: CanvasRenderingContext2D, view: CelestialView, time: number, angle: number, px: number, py: number, field?: LightField) {
  const { width: w, height: h, cx, cy, radius, vertical, lite, light } = view;
  const { line, star, gold } = view.colors;
  const tone = (rgb: string, alpha: number) => `rgba(${rgb},${alpha})`;
  // Daylight needs ink-like strokes, rather than night-time glow at low opacity.
  const stroke = (rgb: string, alpha: number) => tone(rgb, Math.min(1, alpha * (light ? 1.85 : 1.15)));
  const fineWidth = light ? 1 : 0.8;
  ctx.clearRect(0, 0, w, h);
  const point = (x: number, y: number, r: number, color: string) => {
    ctx.fillStyle = color;
    ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
  };
  const spark = (x: number, y: number, size: number, alpha: number) => {
    ctx.strokeStyle = tone(gold, alpha);
    ctx.beginPath(); ctx.moveTo(x - size, y); ctx.lineTo(x + size, y); ctx.moveTo(x, y - size); ctx.lineTo(x, y + size); ctx.stroke();
    point(x, y, 1, tone(gold, alpha));
  };

  stars.slice(0, lite ? 85 : stars.length).forEach((star, index) => {
    let x = star.x * w + px * (index % 3 + 1) * 3 + Math.sin(time * 0.1 + index * 2) * 7;
    let y = star.y * h + py * (index % 3 + 1) * 2 + Math.sin(time * 0.16 + index) * 9;
    if (field) {
      const dx = x - field.pointer.x, dy = y - field.pointer.y, distance = Math.hypot(dx, dy);
      const force = Math.max(0, 1 - distance / 155) * field.pointer.strength * 20;
      x += dx / Math.max(1, distance) * force; y += dy / Math.max(1, distance) * force;
    }
    const alpha = (light ? 0.32 : 0.2) + (Math.sin(time * 0.5 + index * 1.8) + 1) * 0.18;
    point(x, y, star.size, tone(view.colors.star, alpha));
    if (index % 23 === 0) spark(x, y, 3.5, alpha + 0.1);
  });

  // Long celestial meridians carry little lights across the background.
  const tracks = lite ? 3 : 5;
  for (let line = 0; line < tracks; line++) {
    ctx.save();
    ctx.translate(w * 0.5 + px * 8, h * 0.5 + py * 6);
    ctx.rotate(-0.48 + line * 0.41 + Math.sin(time * 0.035) * 0.06);
    const rx = w * (0.43 + line * 0.12), ry = h * (0.24 + line * 0.09);
    ctx.strokeStyle = line % 2 ? stroke(view.colors.line, 0.2) : stroke(gold, 0.2);
    ctx.lineWidth = fineWidth;
    ctx.beginPath(); ctx.ellipse(0, 0, rx, ry, 0, 0, TAU); ctx.stroke();
    ctx.setLineDash([2, 21]); ctx.lineDashOffset = -time * 4;
    ctx.strokeStyle = stroke(view.colors.line, 0.22);
    ctx.beginPath(); ctx.ellipse(0, 0, rx + 7, ry + 7, 0, 0, TAU); ctx.stroke();
    ctx.setLineDash([]);
    for (let dot = 0; dot < 3; dot++) {
      const a = time * (0.025 + line * 0.007) + line * 1.7 + dot * TAU / 3;
      spark(Math.cos(a) * rx, Math.sin(a) * ry, dot === 0 ? 5 : 2, 0.45);
    }
    ctx.restore();
  }

  // The option orbit has real front and rear depth, connected by traveling pixels.
  ctx.save(); ctx.translate(cx + px * 7, cy + py * 5);
  ctx.lineWidth = fineWidth;
  ctx.strokeStyle = stroke(gold, 0.32);
  ctx.beginPath(); ctx.ellipse(0, 0, radius, vertical, 0, 0, TAU); ctx.stroke();
  ctx.setLineDash([1, 9]); ctx.lineDashOffset = time * 3;
  ctx.strokeStyle = stroke(line, 0.3);
  ctx.beginPath(); ctx.ellipse(0, 0, radius + 14, vertical + 8, 0, 0, TAU); ctx.stroke(); ctx.setLineDash([]);
  for (let dot = 0; dot < (lite ? 18 : 34); dot++) {
    const a = dot * TAU / (lite ? 18 : 34) - time * 0.055;
    const depth = (Math.cos(a) + 1) / 2;
    const x = Math.sin(a) * radius, y = Math.cos(a) * vertical;
    ctx.fillStyle = tone(gold, 0.15 + depth * 0.4);
    ctx.fillRect(x - 1, y - 1, 1.5 + depth, 1.5 + depth);
  }

  // Project three independent circular planes; these are rings, not a ribbon.
  const size = Math.min(w * 0.2, h * 0.29, 215);
  for (let ring = 0; ring < 3; ring++) {
    const tilt = 0.6 + ring * 0.74 + Math.sin(time * 0.12 + ring) * 0.22;
    const turn = time * (0.11 - ring * 0.025) + ring * 1.12 + angle * 0.13;
    const rz = -0.35 + ring * 0.7 + px * 0.08;
    const project = (a: number) => {
      const x = Math.cos(a) * size, y = Math.sin(a) * size;
      const yy = y * Math.cos(tilt), z = y * Math.sin(tilt);
      const xx = x * Math.cos(turn) + z * Math.sin(turn);
      const zz = -x * Math.sin(turn) + z * Math.cos(turn);
      const perspective = 700 / (700 - zz);
      return { x: (xx * Math.cos(rz) - yy * Math.sin(rz)) * perspective, y: (xx * Math.sin(rz) + yy * Math.cos(rz)) * perspective, z: zz };
    };
    const count = lite ? 80 : 128;
    for (let segment = 0; segment < count; segment++) {
      const a = segment * TAU / count;
      const p = project(a), q = project(a + TAU / count);
      const near = (p.z / size + 1) / 2;
      ctx.strokeStyle = stroke(ring === 1 ? line : gold, 0.16 + near * 0.42);
      ctx.lineWidth = near > 0.7 ? 1.25 : fineWidth;
      ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
      if (segment % 8 === 0) point(p.x, p.y, 0.8, tone(gold, 0.3 + near * 0.4));
    }
    const highlight = project(time * 0.27 + ring * 2);
    ctx.shadowBlur = lite || light ? 0 : 16; ctx.shadowColor = tone(gold, 0.8);
    spark(highlight.x, highlight.y, 5, 0.85); ctx.shadowBlur = 0;
  }
  ctx.restore();

  // Sparse angular constellations balance the continuous circular linework.
  for (let group = 0; group < 3; group++) {
    const gx = w * [0.08, 0.88, 0.18][group], gy = h * [0.55, 0.24, 0.83][group];
    const drift = Math.sin(time * 0.15 + group) * 6;
    const nodes = [[0, 0], [34, -42], [67, -23], [94, -70], [122, -57]];
    ctx.strokeStyle = stroke(line, 0.32); ctx.lineWidth = fineWidth; ctx.beginPath();
    nodes.forEach(([x, y], index) => {
      if (index === 0) ctx.moveTo(gx + x, gy + y + drift); else ctx.lineTo(gx + x, gy + y + drift);
    }); ctx.stroke();
    nodes.forEach(([x, y], index) => point(gx + x, gy + y + drift, index % 2 ? 1.7 : 1, tone(star, 0.6)));
  }
}

export function drawLivingLight(ctx: CanvasRenderingContext2D, view: CelestialView, field: LightField, clock: number, time: number) {
  const { width: w, height: h, light, colors } = view;
  const rgba = (rgb: string, alpha: number) => `rgba(${rgb},${Math.max(0, Math.min(1, alpha))})`;
  const dot = (x: number, y: number, size: number, alpha: number, color = colors.gold) => {
    ctx.fillStyle = rgba(color, alpha); ctx.beginPath(); ctx.arc(x, y, size, 0, TAU); ctx.fill();
  };
  const glow = (x: number, y: number, radius: number, alpha: number, color = colors.gold) => {
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, rgba(color, alpha)); gradient.addColorStop(0.18, rgba(color, alpha * 0.35)); gradient.addColorStop(1, rgba(color, 0));
    ctx.fillStyle = gradient; ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
  };
  ctx.save();
  const pointer = field.pointer;
  if (pointer.strength > 0.01) {
    glow(pointer.x, pointer.y, 145, (light ? 0.11 : 0.075) * pointer.strength, colors.line);
    // Proximity reveals fine connections; the cursor itself remains native.
    let connections = 0;
    for (let index = 0; index < 80; index++) {
      const x = ((index * 197.3 + 73) % 997) / 997 * w + Math.sin(time * 0.2 + index) * 13;
      const y = ((index * index * 23.9 + 19) % 991) / 991 * h + Math.cos(time * 0.17 + index * 2) * 16;
      const distance = Math.hypot(x - pointer.x, y - pointer.y);
      if (distance < 125 && connections++ < 7) {
        ctx.strokeStyle = rgba(colors.line, (1 - distance / 125) * 0.36 * pointer.strength);
        ctx.lineWidth = 0.7; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(pointer.x, pointer.y); ctx.stroke();
        dot(x, y, 1.4, 0.7 * pointer.strength, colors.star);
      }
    }
  }

  // Weightless foreground dust drifts at a different speed from the star field.
  for (let index = 0; index < 65; index++) {
    const x = ((index * 197.3 + 73) % 997) / 997 * w + Math.sin(time * 0.2 + index) * 13;
    const y = ((index * index * 23.9 + 19) % 991) / 991 * h + Math.cos(time * 0.17 + index * 2) * 16;
    const pulse = (Math.sin(time * 0.6 + index * 2.1) + 1) / 2;
    dot(x, y, index % 11 === 0 ? 1.7 : 0.65, (light ? 0.2 : 0.12) + pulse * 0.27, index % 3 ? colors.star : colors.gold);
    if (index % 17 === 0) glow(x, y, 15, pulse * (light ? 0.13 : 0.19));
  }

  for (const ray of field.rays) {
    const near = Math.max(0, 1 - Math.hypot(ray.x - pointer.x, ray.y - pointer.y) / 90) * pointer.strength;
    const cycle = (time + ray.id * 2.1) % 12;
    const flare = Math.max(ray.held ? 1 : 0, clock < ray.flareUntil ? Math.min(1, ray.flareUntil - clock) : 0, cycle < 2.6 ? Math.sin(cycle / 2.6 * Math.PI) ** 2 : 0, near * 0.7);
    const color = ray.id % 2 ? colors.line : colors.gold;
    // A tapered trail follows the actual dragged path, rather than a fixed angle.
    for (let index = 1; index < ray.trail.length; index++) {
      const a = ray.trail[index - 1], b = ray.trail[index];
      const alpha = Math.max(0, 1 - (clock - b.time) / 0.9) ** 2;
      ctx.strokeStyle = rgba(color, alpha * (0.2 + flare * 0.7));
      ctx.lineWidth = 0.6 + alpha * (1 + flare);
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    }
    glow(ray.x, ray.y, 22 + flare * 28, (light ? 0.14 : 0.2) + flare * 0.25, color);
    ctx.strokeStyle = rgba(color, 0.35 + flare * 0.6); ctx.lineWidth = 0.8;
    ctx.beginPath(); ctx.moveTo(ray.x - 4 - flare * 6, ray.y); ctx.lineTo(ray.x + 4 + flare * 6, ray.y);
    ctx.moveTo(ray.x, ray.y - 4 - flare * 6); ctx.lineTo(ray.x, ray.y + 4 + flare * 6); ctx.stroke();
    dot(ray.x, ray.y, 1.4 + flare * 1.3, 0.7 + flare * 0.3, light ? color : colors.star);
    if (ray.held || near > 0.4) {
      ctx.strokeStyle = rgba(color, 0.3); ctx.lineWidth = 0.7;
      ctx.beginPath(); ctx.arc(ray.x, ray.y, 18 + Math.sin(time * 2) * 2, 0, TAU); ctx.stroke();
    }
  }

  // Slow, staggered streaks crest once and disappear; there is no rapid flashing.
  for (let index = 0; index < 4; index++) {
    const age = (time + index * 4.75) % 19;
    if (age > 2.2) continue;
    const progress = age / 2.2, alpha = Math.sin(progress * Math.PI) ** 2;
    const x = w * (0.1 + index * 0.22) + progress * Math.min(w * 0.22, 240);
    const y = h * (0.19 + index % 2 * 0.56) + progress * 85;
    const length = 48 + alpha * 60;
    const tail = ctx.createLinearGradient(x - length, y - length * 0.35, x, y);
    tail.addColorStop(0, rgba(colors.gold, 0)); tail.addColorStop(1, rgba(colors.gold, alpha * 0.8));
    ctx.strokeStyle = tail; ctx.lineWidth = light ? 1.3 : 1.1;
    ctx.beginPath(); ctx.moveTo(x - length, y - length * 0.35); ctx.lineTo(x, y); ctx.stroke();
    glow(x, y, 22, alpha * 0.35); dot(x, y, 1.8, alpha, light ? colors.gold : colors.star);
  }

  for (const point of pointer.trail) {
    const life = Math.max(0, 1 - (clock - point.time) / 0.65);
    dot(point.x, point.y, life * 1.6, life * 0.28 * pointer.strength);
  }
  for (const point of field.ripples) {
    const age = clock - point.time, life = Math.max(0, 1 - age / 1.4);
    for (let ring = 0; ring < 2; ring++) {
      const radius = Math.max(0, age * 115 - ring * 18);
      if (!radius) continue;
      ctx.strokeStyle = rgba(colors.gold, life * life * (light ? 0.65 : 0.45)); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.ellipse(point.x, point.y, radius, radius * 0.62, -0.15, 0, TAU); ctx.stroke();
    }
  }
  ctx.restore();
}
