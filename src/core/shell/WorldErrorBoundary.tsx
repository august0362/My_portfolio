import { Component } from 'react';
import type { PropsWithChildren } from 'react';

export default class WorldErrorBoundary extends Component<PropsWithChildren, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return (
        <section role="alert">
          <h1>This world could not open</h1>
          <p>Try again, or use Back to Hub to visit another world.</p>
          {/* Reload also retries rejected lazy imports cached by React. */}
          <button type="button" onClick={() => window.location.reload()}>Retry</button>
        </section>
      );
    }

    return this.props.children;
  }
}
