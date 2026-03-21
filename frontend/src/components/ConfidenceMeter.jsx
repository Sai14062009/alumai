import { motion } from 'framer-motion';

export default function ConfidenceMeter({ confidence = 0, size = 'default' }) {
  const r = size === 'small' ? 28 : 44;
  const sw = size === 'small' ? 4 : 5;
  const circ = 2 * Math.PI * r;
  const offset = circ - (confidence / 100) * circ;
  const vs = (r + sw) * 2;

  let color = '#FF4D6A', glow = 'rgba(255,77,106,0.25)';
  if (confidence >= 70) { color = '#00E59B'; glow = 'rgba(0,229,155,0.25)'; }
  else if (confidence >= 50) { color = '#FFB800'; glow = 'rgba(255,184,0,0.25)'; }

  return (
    <div className="relative flex items-center justify-center" style={{ width: vs, height: vs }}>
      <svg className="transform -rotate-90" width={vs} height={vs} viewBox={`0 0 ${vs} ${vs}`}>
        <circle cx={vs/2} cy={vs/2} r={r} strokeWidth={sw} stroke="var(--border)" fill="transparent" />
        <motion.circle cx={vs/2} cy={vs/2} r={r} strokeWidth={sw+6} strokeLinecap="round" stroke={glow} fill="transparent"
          initial={{ strokeDashoffset: circ }} animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.8, ease: "easeOut" }} style={{ strokeDasharray: circ, filter: 'blur(6px)' }} />
        <motion.circle cx={vs/2} cy={vs/2} r={r} strokeWidth={sw} strokeLinecap="round" stroke={color} fill="transparent"
          initial={{ strokeDashoffset: circ }} animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.8, ease: "easeOut" }} style={{ strokeDasharray: circ }} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-display font-bold tracking-tight" style={{ fontSize: size === 'small' ? '16px' : '26px', color: 'var(--text-primary)' }}>
          {confidence}<span className="text-xs" style={{ color: 'var(--text-muted)' }}>%</span>
        </span>
      </div>
    </div>
  );
}