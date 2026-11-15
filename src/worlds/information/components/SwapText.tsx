import styles from './SwapText.module.css';

/**
 * Text that turns italic on hover without a jump: an upright and an italic copy share one grid cell and
 * cross-fade while sliding a little. Only opacity and transform animate, so there is no reflow.
 * The hover host is the nearest ancestor with `data-swap-host`.
 */
export default function SwapText({ children, className = '' }: { children: string; className?: string }) {
  return (
    <span className={`${styles.swap} ${className}`}>
      <span className={styles.upright}>{children}</span>
      <span className={styles.italic} aria-hidden="true">
        {children}
      </span>
    </span>
  );
}
