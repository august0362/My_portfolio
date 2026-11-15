import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router';
import { describe, expect, test, vi } from 'vitest';
import { SettingsProvider } from '@shared/settings';
import ProductionWorld from './index';
import { projects } from './data/projects';
import { boundView, fitScene, revealPoint, zoomView } from './hooks/mapMath';
import { checkAvailability, validateHealth } from './components/status';

function render(path: string) {
  return renderToStaticMarkup(<MemoryRouter initialEntries={[path]}><SettingsProvider><ProductionWorld /></SettingsProvider></MemoryRouter>);
}

describe('project routes and content', () => {
  test('the overview exposes the real project and its details', () => {
    const html = render('/');
    expect(html).toContain('The Forge');
    expect(html).toContain('href="/production/chess-ai"');
    expect(html).not.toContain('data-placeholder');
    expect(html).toContain('aria-label="Project destinations"');
    expect(html).toContain('data-project-board');
    expect(html).toContain('aria-label="Explore Chess AI Tournament"');
  });

  test('details label concept art and do not invent server availability', () => {
    const html = render('/chess-ai');
    expect(html).toContain('Server');
    expect(html).toContain('data-state="checking"');
    expect(html).not.toContain('data-state="online"');
    expect(html).toContain('not a gameplay screenshot');
    expect(html).toContain('target="_blank" rel="noopener noreferrer"');
    for (const url of Object.values(projects[0].links)) expect(html).toContain(`href="${url}"`);
  });

  test('the hero offers Play Game; the GitHub source link sits in the page footer', () => {
    const html = render('/chess-ai');
    const footer = html.indexOf('<footer');
    expect(html.indexOf('data-project-action="play"')).toBeLessThan(footer);
    expect(html.indexOf('data-project-action="source"')).toBeGreaterThan(footer);
    expect(html.match(/data-project-action="source"/g)).toHaveLength(1);
  });

  test('Vietnamese visitors read the project in Vietnamese', () => {
    vi.stubGlobal('localStorage', { getItem: () => JSON.stringify({ language: 'vi' }), setItem: () => {} });
    try {
      const html = render('/chess-ai');
      expect(html).toContain('Bốn hướng tiếp cận. Một bàn cờ.');
      expect(html).toContain('Chơi game');
      expect(html).toContain('Xem mã nguồn trên GitHub');
    } finally {
      vi.unstubAllGlobals();
    }
  });

  test.each(['/missing', '/missing/deeper'])('unknown route %s provides a usable return', path => {
    expect(render(path)).toContain('This project isn’t here.');
    expect(render(path)).toContain('href="/production"');
  });

  test('all scene layers and hotspots fit the shared scene coordinate system', () => {
    for (const project of projects) {
      const { background, layers } = project.scene;
      expect(project.hotspotPosition.x).toBeGreaterThan(0);
      expect(project.hotspotPosition.x).toBeLessThan(1);
      expect(project.hotspotPosition.y).toBeGreaterThan(0);
      expect(project.hotspotPosition.y).toBeLessThan(1);
      for (const layer of layers) {
        expect(layer.x + layer.width).toBeLessThanOrEqual(background.width);
        expect(layer.y + layer.height).toBeLessThanOrEqual(background.height);
      }
      expect(new Set(project.gallery.map(image => image.src)).size).toBe(project.gallery.length);
      expect(project.gallery.every(image => image.alt && image.caption)).toBe(true);
    }
  });
});

describe('bounded scene navigation', () => {
  test.each([[1440, 900], [375, 812], [900, 500]])('never exposes empty space at %s × %s', (width, height) => {
    const size = fitScene(width, height);
    for (const zoom of [0.1, 1, 1.4, 9]) {
      const view = boundView({ x: 99999, y: -99999, zoom }, size);
      expect(view.zoom).toBeGreaterThanOrEqual(1);
      expect(view.zoom).toBeLessThanOrEqual(1.8);
      expect(size.planeWidth * view.zoom / 2 - Math.abs(view.x)).toBeGreaterThanOrEqual(width / 2 - 0.001);
      expect(size.planeHeight * view.zoom / 2 - Math.abs(view.y)).toBeGreaterThanOrEqual(height / 2 - 0.001);
    }
  });

  test('zoom holds the pointer position and keyboard focus reveals distant markers', () => {
    const size = fitScene(375, 812);
    const view = zoomView({ x: 0, y: 0, zoom: 1 }, 1.5, size, { x: 30, y: 20 });
    expect(view.x).toBe(-15); expect(view.y).toBe(-10);
    const focused = revealPoint(view, size, { x: 0.8, y: 0.3 });
    expect(Math.abs((0.8 - 0.5) * size.planeWidth * focused.zoom + focused.x)).toBeLessThan(1);
  });
});

describe('honest server availability', () => {
  const endpoint = { url: 'https://example.test/health', service: 'chess-ai' };
  const signal = new AbortController().signal;
  test('requires an explicit result identifying the configured service', () => {
    expect(validateHealth({ service: 'chess-ai', status: 'online' }, 'chess-ai')).toBe('online');
    expect(validateHealth({ service: 'chess-ai', status: 'offline' }, 'chess-ai')).toBe('offline');
    for (const body of [null, 'online', {}, { status: 'online' }, { service: 'other', status: 'online' }, { service: 'chess-ai', status: 'ok' }]) expect(validateHealth(body, 'chess-ai')).toBe('unknown');
  });
  test('network, CORS, HTTP errors, invalid JSON and opaque responses stay unknown', async () => {
    const responses = [
      vi.fn().mockRejectedValue(new TypeError('Failed to fetch')),
      vi.fn().mockResolvedValue(new Response('', { status: 503 })),
      vi.fn().mockResolvedValue(new Response('not JSON')),
      vi.fn().mockResolvedValue({ ok: true, type: 'opaque' }),
    ];
    for (const fetcher of responses) expect(await checkAvailability(endpoint, signal, fetcher)).toBe('unknown');
  });
  test.each(['online', 'offline'] as const)('accepts validated %s JSON and uses CORS without credentials', async status => {
    const fetcher = vi.fn().mockResolvedValue(new Response(JSON.stringify({ service: 'chess-ai', status })));
    expect(await checkAvailability(endpoint, signal, fetcher)).toBe(status);
    expect(fetcher).toHaveBeenCalledWith(endpoint.url, expect.objectContaining({ mode: 'cors', credentials: 'omit', signal }));
  });
});
