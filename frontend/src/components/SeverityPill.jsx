import clsx from 'clsx';

const CONFIG = {
  critical: { bg: 'rgba(255,77,106,0.12)', color: '#FF4D6A', border: 'rgba(255,77,106,0.2)', dot: '#FF4D6A', pulse: true },
  high: { bg: 'rgba(255,184,0,0.1)', color: '#FFB800', border: 'rgba(255,184,0,0.15)', dot: '#FFB800' },
  medium: { bg: 'rgba(0,212,255,0.1)', color: '#00D4FF', border: 'rgba(0,212,255,0.15)', dot: '#00D4FF' },
  low: { bg: 'rgba(0,229,155,0.1)', color: '#00E59B', border: 'rgba(0,229,155,0.15)', dot: '#00E59B' },
};

export default function SeverityPill({ level }) {
  const norm = level?.toLowerCase() || 'low';
  const c = CONFIG[norm] || CONFIG.low;

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono text-[10px] font-semibold uppercase tracking-wider"
      style={{ background: c.bg, color: c.color, border: `1px solid ${c.border}` }}>
      <span className={clsx("w-1.5 h-1.5 rounded-full", c.pulse && "animate-pulse")} style={{ background: c.dot }} />
      {norm}
    </span>
  );
}