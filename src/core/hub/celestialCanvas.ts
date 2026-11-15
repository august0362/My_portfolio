import { TAU } from './orbitMath';

export interface CelestialView { width: number; height: number; cx: number; cy: number; radius: number; vertical: number; lite: boolean; light: boolean; colors: { line: string; star: string; gold: string } }

// A seeded sky stays in place on resize and never touches personal assets.
const stars = Array.from({ length: 170 }, (_, index) => ({
  x: ((index * 127.1 + 31) % 997) / 997,
  y: ((index * index * 13.7 + 71) % 991) / 991,
  size: 0.4 + (index % 5) * 0.22,
}));

export function drawCelestial(ctx: CanvasRenderingContext2D, view: CelestialView, time: number, angle: number, px: number, py: number) {
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
    const x = star.x * w + px * (index % 3 + 1) * 3;
    const y = star.y * h + py * (index % 3 + 1) * 2 + Math.sin(time * 0.12 + index) * 2;
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
