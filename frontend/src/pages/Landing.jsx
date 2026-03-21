import { motion } from 'framer-motion';
import { ArrowRight, Inbox, Filter, BrainCircuit, Activity, MessageSquare, Sparkles } from 'lucide-react';

const PILLARS = [
  { id: "intake", title: "Intake", desc: "Omnichannel ingestion from ITSM, Chat, and Email.", icon: Inbox, color: '#00E59B' },
  { id: "triage", title: "Triage", desc: "Real-time routing and severity classification.", icon: Filter, color: '#00D4FF' },
  { id: "classifier", title: "Classifier", desc: "Neural entity extraction to physical assets.", icon: BrainCircuit, color: '#B18CFF' },
  { id: "rca", title: "RCA Engine", desc: "Deep diagnostics pinpointing failure modes.", icon: Activity, color: '#FFB800' },
  { id: "assistant", title: "Assistant", desc: "Human-in-the-loop copilot for sign-off.", icon: MessageSquare, color: '#FF6B8A' },
];

export default function Landing({ onEnter }) {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center relative" style={{ background: 'var(--bg-deep)', overflow: 'hidden' }}>
      
      {/* Mesh gradient orbs — contained within viewport */}
      <div className="absolute w-[500px] h-[500px] top-[-150px] left-[-150px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(0,229,155,0.07) 0%, transparent 60%)', filter: 'blur(100px)', animation: 'meshMove 18s ease-in-out infinite' }} />
      <div className="absolute w-[400px] h-[400px] bottom-[-100px] right-[-100px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.05) 0%, transparent 60%)', filter: 'blur(100px)', animation: 'meshMove 22s ease-in-out infinite reverse' }} />
      <div className="absolute w-[300px] h-[300px] top-[40%] left-[50%] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(177,140,255,0.04) 0%, transparent 60%)', filter: 'blur(100px)', animation: 'meshMove 15s ease-in-out infinite' }} />

      <div className="relative z-10 max-w-5xl mx-auto w-full px-4 sm:px-8 flex flex-col items-center">
        
        <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="text-center mb-10 sm:mb-20">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-6 sm:mb-8 font-mono text-[9px] sm:text-[11px] font-medium tracking-widest uppercase"
            style={{ background: 'rgba(0,229,155,0.06)', color: '#00E59B', border: '1px solid rgba(0,229,155,0.12)' }}>
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            System Online
          </motion.div>
          
          <h1 className="font-display font-black text-4xl sm:text-6xl md:text-8xl tracking-tight mb-4 sm:mb-6" style={{ color: 'var(--text-primary)' }}>
            Alum<span className="gradient-text">AI</span>
          </h1>
          <p className="font-sans text-sm sm:text-lg md:text-xl max-w-xl mx-auto leading-relaxed font-light px-4" style={{ color: 'var(--text-secondary)' }}>
            Five intelligent agents. One unified command center.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 w-full mb-10 sm:mb-16 px-2">
          {PILLARS.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div key={p.id}
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="glass gradient-border rounded-2xl sm:rounded-3xl p-3 sm:p-6 w-[calc(33%-8px)] sm:w-[180px] min-w-[100px] flex flex-col items-center text-center cursor-default group"
              >
                <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center mb-2 sm:mb-4 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `${p.color}12`, border: `1px solid ${p.color}18` }}>
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: p.color }} />
                </div>
                <h3 className="font-display font-bold text-[10px] sm:text-[14px] mb-0.5 sm:mb-1" style={{ color: 'var(--text-primary)' }}>{p.title}</h3>
                <p className="font-sans text-[8px] sm:text-[11px] leading-relaxed font-light hidden sm:block" style={{ color: 'var(--text-muted)' }}>{p.desc}</p>
              </motion.div>
            );
          })}
        </div>

        <motion.button
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
          whileHover={{ scale: 1.04, boxShadow: '0 0 40px rgba(0,229,155,0.2)' }}
          whileTap={{ scale: 0.96 }}
          onClick={onEnter}
          className="haptic flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-display font-bold text-[13px] sm:text-[15px] group relative overflow-hidden"
          style={{ background: 'var(--gradient-accent)', color: '#04060C' }}>
          <span className="relative z-10">Enter Command Center</span>
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)', backgroundSize: '200% 100%', animation: 'shimmer 2s linear infinite' }} />
        </motion.button>
      </div>
    </div>
  );
}