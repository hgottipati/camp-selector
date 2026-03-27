/**
 * Fun group branding for the weighted score — name only (not affiliated with any studio IP).
 */

export const LOKI_MATCH_NAME = 'Loki Match';

type LokiMatchScoreProps = {
  score: number;
  /** compact: white pill for photo overlays; full: rose pill for light backgrounds */
  variant?: 'compact' | 'full';
  className?: string;
};

export function LokiMatchScore({ score, variant = 'compact', className = '' }: LokiMatchScoreProps) {
  const label = `${LOKI_MATCH_NAME} score ${score}`;
  if (variant === 'full') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-2.5 py-1 text-xs font-bold text-rose-800 shadow-sm ${className}`}
        title={label}
      >
        <span className="tracking-tight">
          {LOKI_MATCH_NAME} <span className="text-rose-950">{score}</span>
        </span>
      </span>
    );
  }
  return (
    <span
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-rose-700 shadow-sm backdrop-blur sm:text-sm ${className}`}
      title={label}
    >
      <span className="tracking-tight">
        {LOKI_MATCH_NAME}{' '}
        <span className="font-bold tabular-nums text-rose-950">{score}</span>
      </span>
    </span>
  );
}
