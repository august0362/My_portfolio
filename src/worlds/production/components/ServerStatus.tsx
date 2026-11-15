import { useEffect, useState } from 'react';
import { useCopy, useLanguage } from '@shared/i18n';
import { COPY } from '../data/locale';
import type { ServerAvailability, StatusEndpoint } from '../types';
import { checkAvailability } from './status';
import styles from '../Production.module.css';

type State = ServerAvailability | 'checking';

export default function ServerStatus({ endpoint }: { endpoint?: StatusEndpoint }) {
  const t = useCopy(COPY);
  const language = useLanguage();
  const [availability, setAvailability] = useState<State>(endpoint ? 'checking' : 'unknown');
  const [checkedAt, setCheckedAt] = useState<number>();
  const [attempt, setAttempt] = useState(0);
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
  }, [endpoint, attempt]);

  const label = availability === 'checking' ? t.checking : availability === 'online' ? t.online : availability === 'offline' ? t.offline : t.unknown;
  const note = availability === 'checking' ? t.checkingNote : availability === 'online' ? t.onlineNote : availability === 'offline' ? t.offlineNote : t.unknownNote;
  const time = checkedAt && availability !== 'checking' ? ` · ${t.checkedAt} ${new Date(checkedAt).toLocaleTimeString(language === 'vi' ? 'vi-VN' : 'en-GB', { hour: '2-digit', minute: '2-digit' })}` : '';
  return <div className={styles.serverStatus}>
    <span className={styles.serverBadge} data-state={availability} role="status"><i aria-hidden="true" /> {t.server} <span aria-hidden="true">·</span> {label}</span>
    <span className={styles.serverExplanation}>{note}{time}</span>
    {endpoint && (availability === 'unknown' || availability === 'offline') && <button type="button" className={styles.serverRetry} onClick={() => { setAvailability('checking'); setAttempt(value => value + 1); }}>{t.recheck}</button>}
  </div>;
}
