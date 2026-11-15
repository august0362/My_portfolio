import { useEffect, useState } from 'react';
import type { ServerAvailability, StatusEndpoint } from '../types';
import { checkAvailability } from './status';
import styles from '../Production.module.css';

export default function ServerStatus({ endpoint }: { endpoint?: StatusEndpoint }) {
  const [availability, setAvailability] = useState<ServerAvailability>('unknown');
  const [checkedAt, setCheckedAt] = useState<number>();
  useEffect(() => {
    if (!endpoint) return;
    let disposed = false, refresh = 0, timeout = 0, generation = 0;
    let controller: AbortController | undefined;
    const check = async () => {
      if (document.hidden || disposed) return;
      const request = ++generation;
      controller?.abort(); controller = new AbortController();
      const activeController = controller;
      timeout = window.setTimeout(() => activeController.abort(), 4000);
      const result = await checkAvailability(endpoint, activeController.signal);
      if (request !== generation) return;
      window.clearTimeout(timeout);
      if (disposed || document.hidden) return;
      setAvailability(result); setCheckedAt(Date.now());
      refresh = window.setTimeout(() => { void check(); }, Math.max(30000, endpoint.refreshMs ?? 60000));
    };
    const visibility = () => {
      generation++;
      window.clearTimeout(refresh); window.clearTimeout(timeout); controller?.abort();
      if (!document.hidden) void check();
    };
    void check(); document.addEventListener('visibilitychange', visibility);
    return () => { disposed = true; generation++; window.clearTimeout(refresh); window.clearTimeout(timeout); controller?.abort(); document.removeEventListener('visibilitychange', visibility); };
  }, [endpoint]);

  const label = availability === 'online' ? 'Online' : availability === 'offline' ? 'Offline' : 'Unknown';
  return <div className={styles.serverStatus}>
    <span className={styles.serverBadge} data-state={availability} role="status"><i aria-hidden="true" /> Server <span>·</span> {label}</span>
    <span className={styles.serverExplanation}>{!endpoint ? 'Public availability is not monitored.' : availability === 'unknown' ? 'Availability could not be confirmed.' : `Health endpoint checked${checkedAt ? ` at ${new Date(checkedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : ''}.`}</span>
  </div>;
}
