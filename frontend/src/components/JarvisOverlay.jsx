import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { classifyTicket } from '../services/api';

const STATUSES = [
  "Initializing neural pipeline",
  "Running intake normalization",
  "Classifying asset & system",
  "Generating root cause analysis",
  "Auditing for hallucinations",
  "Calculating confidence score",
  "Synthesizing final report"
];

export default function JarvisOverlay({ ticket, onComplete, onError }) {
  const [statusIndex, setStatusIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const i = setInterval(() => {
      setStatusIndex(p => (p + 1) % STATUSES.length);
      setProgress(p => Math.min(p + 14, 95));
    }, 1200);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    if (!ticket) return;
    let m = true;
    (async () => {
      try {
        const r = await classifyTicket(ticket.id);
        setProgress(100);
        setTimeout(() => { if (m) onComplete(r); }, 1000);
      } catch (e) {
        setTimeout(() => { if (m) { if (onError) onError(e.message || "Failed."); else onComplete(null); } }, 500);
      }
    })();
    return () => { m = false; };
  }, [ticket, onComplete, onError]);

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-50 flex flex-col items-center justify-center"
        style={{ background: 'rgba(4,6,12,0.96)', backdropFilter: 'blur(24px)' }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.4 } }}>

        {/* Background pulse rings */}
        {[200, 300, 400].map((size, i) => (
          <motion.div key={i} className="absolute rounded-full"
            animate={{ scale: [1, 1.1, 1], opacity: [0.03, 0.06, 0.03] }}
            transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.5 }}
            style={{ width: size, height: size, border: '1px solid rgba(0,229,155,0.1)' }} />
        ))}

        {/* HUD */}
        <div className="relative w-52 h-52 flex items-center justify-center mb-14">
          {/* Outer dashed ring */}
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full" style={{ border: '1px dashed rgba(0,229,155,0.15)' }} />
          {/* Middle arc */}
          <motion.div animate={{ rotate: -360 }} transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
            className="absolute inset-5 rounded-full" style={{ borderTop: '2px solid rgba(0,229,155,0.4)', borderRight: '2px solid transparent', borderBottom: '2px solid transparent', borderLeft: '2px solid rgba(0,212,255,0.2)' }} />
          {/* Inner ring */}
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute inset-12 rounded-full" style={{ borderTop: '1.5px solid rgba(0,212,255,0.3)', borderRight: '1.5px solid transparent', borderBottom: '1.5px solid transparent', borderLeft: '1.5px solid transparent' }} />
          {/* Pulse core */}
          <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.35, 0.15] }} transition={{ duration: 2.5, repeat: Infinity }}
            className="absolute inset-16 rounded-full" style={{ background: 'radial-gradient(circle, rgba(0,229,155,0.3) 0%, transparent 70%)' }} />
          {/* Center */}
          <div className="relative z-10 font-mono font-bold text-2xl tracking-[0.4em] pl-1" style={{ color: '#00E59B', textShadow: '0 0 30px rgba(0,229,155,0.5), 0 0 60px rgba(0,229,155,0.2)' }}>AI</div>
        </div>

        {/* Progress */}
        <div className="w-72 mb-8">
          <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <motion.div className="h-full rounded-full" animate={{ width: `${progress}%` }} transition={{ duration: 0.5, ease: "easeOut" }}
              style={{ background: 'linear-gradient(90deg, #00E59B, #00D4FF)', boxShadow: '0 0 12px rgba(0,229,155,0.4)' }} />
          </div>
          <div className="flex justify-between mt-2">
            <span className="font-mono text-[10px]" style={{ color: 'rgba(255,255,255,0.15)' }}>Processing</span>
            <span className="font-mono text-[10px]" style={{ color: '#00E59B' }}>{progress}%</span>
          </div>
        </div>

        {/* Status text */}
        <div className="h-5 flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p key={statusIndex} initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -16, opacity: 0 }} transition={{ duration: 0.2 }}
              className="font-mono text-[12px] tracking-wider font-medium" style={{ color: 'rgba(0,229,155,0.6)' }}>
              {STATUSES[statusIndex]}...
            </motion.p>
          </AnimatePresence>
        </div>

        <p className="mt-5 font-mono text-[10px]" style={{ color: 'rgba(255,255,255,0.12)' }}>Ticket #{ticket?.id}</p>
      </motion.div>
    </AnimatePresence>
  );
}