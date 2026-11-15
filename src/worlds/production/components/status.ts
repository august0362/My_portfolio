import type { ServerAvailability, StatusEndpoint } from '../types';

export function validateHealth(body: unknown, service: string): ServerAvailability {
  if (!body || typeof body !== 'object' || !('service' in body) || body.service !== service || !('status' in body)) return 'unknown';
  return body.status === 'online' || body.status === 'offline' ? body.status : 'unknown';
}

export async function checkAvailability(endpoint: StatusEndpoint, signal: AbortSignal, fetcher = fetch): Promise<ServerAvailability> {
  try {
    if (!endpoint.url.startsWith('https://')) return 'unknown';
    const response = await fetcher(endpoint.url, { mode: 'cors', credentials: 'omit', cache: 'no-store', signal });
    if (!response.ok || response.type === 'opaque') return 'unknown';
    return validateHealth(await response.json(), endpoint.service);
  } catch {
    // Network, CORS, timeout, and private-network failures are inconclusive.
    return 'unknown';
  }
}
