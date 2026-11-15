import { Component } from 'react';
import type { PropsWithChildren } from 'react';
import { useCopy } from '@shared/i18n';
import { SHELL_COPY } from '../copy';

function WorldError() {
  const t = useCopy(SHELL_COPY);
  return (
    <section role="alert">
      <h1>{t.errorTitle}</h1>
      <p>{t.errorBody}</p>
      {/* Reload also retries rejected lazy imports cached by React. */}
      <button type="button" onClick={() => window.location.reload()}>{t.retry}</button>
    </section>
  );
}

export default class WorldErrorBoundary extends Component<PropsWithChildren, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? <WorldError /> : this.props.children;
  }
}
