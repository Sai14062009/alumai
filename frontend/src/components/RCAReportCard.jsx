import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, ShieldAlert, ThumbsUp, Cpu, Settings2, BarChart3, FileText, Wrench, MessageSquare } from 'lucide-react';
import ConfidenceMeter from './ConfidenceMeter';
import SeverityPill from './SeverityPill';
import { escalateTicket } from '../services/api';

const PipelineStep = ({ icon: Icon, label, color, delay }) => (
  <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay, type: "spring", stiffness: 300 }}
    className="flex flex-col items-center gap-2">
    <div className="relative">
      <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: `${color}12`, border: `1px solid ${color}18` }}>
        <Icon className="w-4 h-4" style={{ color }} />
      </div>
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: delay + 0.3, type: "spring" }}
        className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: color, boxShadow: `0 0 10px ${color}50` }}>
        <span className="text-[8px] font-bold" style={{ color: '#04060C' }}>✓</span>
      </motion.div>
    </div>
    <span className="font-mono text-[9px] tracking-wider uppercase" style={{ color: 'var(--text-muted)' }}>{label}</span>
  </motion.div>
);

const Connector = ({ delay }) => (
  <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay, duration: 0.4 }}
    className="w-8 h-px mt-[-18px]" style={{ background: 'var(--border-light)', transformOrigin: 'left' }} />
);

function parseSteps(text) {
  if (!text) return [];
  const lines = text.split(/\n/).map(l => l.trim()).filter(Boolean);
  const steps = [];
  for (const line of lines) {
    const cleaned = line.replace(/^(\d+[\.\)\-:]\s*|[-•]\s*|step\s*\d+[:\-.\s]*)/i, '').trim();
    if (cleaned) steps.push(cleaned);
  }
  if (steps.length <= 1 && text.length > 100) {
    const sentences = text.split(/(?<=[.!])\s+/).filter(s => s.trim().length > 10);
    if (sentences.length > 1) return sentences.map(s => s.trim());
  }
  return steps.length > 0 ? steps : [text];
}

export default function RCAReportCard({ result, onDismiss, onEscalate }) {
  const [escalating, setEscalating] = useState(false);
  const [reveal, setReveal] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReveal(true), 800); return () => clearTimeout(t); }, []);

  if (!result) return null;

  const analysis = result.ai_analysis || {};
  const classification = result.classification || {};
  const confidence = Math.round((result.confidence || analysis.confidence_score || 0) * 100);
  const rootCause = analysis.root_cause || "No root cause determined";
  const fix = analysis.fix || "No fix recommendation available";
  const summary = analysis.summary || "";
  const description = result.original_data?.description || result.description || "";
  const isEscalated = result.escalate || result.status === "Escalated";
  const severity = classification.severity || "Medium";
  const asset = classification.asset || "Unknown";
  const system = classification.system || "Unknown";
  const accentColor = isEscalated ? '#FFB800' : '#00E59B';

  const fixSteps = parseSteps(fix);

  const handleManualEscalate = async () => {
    setEscalating(true);
    try { await escalateTicket(result.id); } catch {}
    onEscalate(result);
    setEscalating(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(4,6,12,0.88)', backdropFilter: 'blur(16px)' }}>
      <motion.div initial={{ y: 50, opacity: 0, scale: 0.92 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 30, opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 250, damping: 25 }}
        className="glass rounded-[28px] w-full max-w-3xl max-h-[90vh] overflow-y-auto relative"
        style={{ boxShadow: `0 0 80px ${accentColor}08, 0 24px 64px rgba(0,0,0,0.5)` }}>

        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="absolute top-0 left-0 right-0 h-[2px] sticky"
          style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`, transformOrigin: 'center', opacity: 0.6 }} />

        {/* Header */}
        <div className="p-7 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="flex items-center gap-4">
            <motion.div initial={{ rotate: -90, scale: 0 }} animate={{ rotate: 0, scale: 1 }} transition={{ delay: 0.2, type: "spring" }}
              className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: `${accentColor}12`, border: `1px solid ${accentColor}18` }}>
              {isEscalated ? <ShieldAlert className="w-6 h-6" style={{ color: accentColor }} /> : <CheckCircle2 className="w-6 h-6" style={{ color: accentColor }} />}
            </motion.div>
            <div>
              <h2 className="font-display font-bold text-xl" style={{ color: 'var(--text-primary)' }}>{isEscalated ? "Human Review Required" : "RCA Report — Pending Review"}</h2>
              {isEscalated
                ? <p className="font-sans text-[11px] mt-0.5 font-light" style={{ color: '#FFB800' }}>Confidence below safety threshold</p>
                : <p className="font-sans text-[11px] mt-0.5 font-light" style={{ color: 'var(--text-muted)' }}>Review the analysis before accepting or escalating</p>
              }
            </div>
          </div>
          <div className="flex items-center gap-2">
            <SeverityPill level={severity} />
            <span className="font-mono text-[11px] px-3 py-1.5 rounded-xl" style={{ background: 'var(--bg-surface)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>#{result.id}</span>
          </div>
        </div>

        <div className="p-7 space-y-7">
          {/* Pipeline */}
          <div className="flex items-start justify-center gap-3 py-2">
            <PipelineStep icon={FileText} label="Intake" color="#00D4FF" delay={0.1} />
            <Connector delay={0.3} />
            <PipelineStep icon={Settings2} label="Classify" color="#B18CFF" delay={0.4} />
            <Connector delay={0.6} />
            <PipelineStep icon={BarChart3} label="RCA" color="#00E59B" delay={0.7} />
            <Connector delay={0.9} />
            <PipelineStep icon={ShieldAlert} label="Auditor" color={accentColor} delay={1.0} />
          </div>

          {/* Problem Statement */}
          {description && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: reveal ? 1 : 0, y: reveal ? 0 : 12 }} transition={{ delay: 1.05 }}
              className="rounded-2xl p-5" style={{ background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.1)' }}>
              <div className="flex items-center gap-2 mb-2.5">
                <MessageSquare className="w-3.5 h-3.5" style={{ color: '#00D4FF' }} />
                <span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: '#00D4FF' }}>Problem Statement</span>
              </div>
              <p className="font-sans text-[13px] leading-relaxed" style={{ color: 'var(--text-primary)' }}>{description}</p>
            </motion.div>
          )}

          {/* Meta */}
          <div className="grid grid-cols-3 gap-3">
            {[{ l: 'Asset', v: asset, i: Cpu }, { l: 'System', v: system, i: Settings2 }, { l: 'Status', v: isEscalated ? 'Escalated' : 'Pending Review', i: BarChart3 }].map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: reveal ? 1 : 0, y: reveal ? 0 : 12 }} transition={{ delay: 1.1 + i * 0.1 }}
                className="rounded-2xl p-4 flex items-center gap-3" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                <m.i className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
                <div className="min-w-0">
                  <p className="font-mono text-[8px] uppercase tracking-[0.2em]" style={{ color: 'var(--text-muted)' }}>{m.l}</p>
                  <p className="font-mono text-[13px] font-semibold truncate" style={{ color: m.l === 'Status' ? (isEscalated ? '#FF4D6A' : '#FFB800') : 'var(--text-primary)' }}>{m.v}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex gap-6">
            <div className="flex-1 space-y-5">
              {/* Auditor Flag */}
              {isEscalated && summary && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: reveal ? 1 : 0 }} transition={{ delay: 1.4 }}
                  className="rounded-2xl p-5" style={{ background: 'rgba(255,184,0,0.04)', border: '1px solid rgba(255,184,0,0.12)' }}>
                  <div className="flex items-center gap-2 mb-2.5">
                    <AlertTriangle className="w-3.5 h-3.5" style={{ color: '#FFB800' }} />
                    <span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: '#FFB800' }}>Auditor Flag</span>
                  </div>
                  <p className="font-sans text-[13px] leading-relaxed font-light" style={{ color: 'var(--text-secondary)' }}>{summary}</p>
                </motion.div>
              )}

              {/* Root Cause */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: reveal ? 1 : 0 }} transition={{ delay: 1.5 }}>
                <p className="font-mono text-[8px] uppercase tracking-[0.2em] mb-2" style={{ color: 'var(--text-muted)' }}>Root Cause</p>
                <div className="rounded-2xl p-5" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                  <p className="font-sans text-[14px] leading-relaxed" style={{ color: 'var(--text-primary)' }}>{rootCause}</p>
                </div>
              </motion.div>

              {/* Fix Steps */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: reveal ? 1 : 0 }} transition={{ delay: 1.7 }}>
                <div className="flex items-center gap-2 mb-3">
                  <Wrench className="w-3.5 h-3.5" style={{ color: '#00E59B' }} />
                  <p className="font-mono text-[8px] uppercase tracking-[0.2em]" style={{ color: 'var(--text-muted)' }}>Recommended Fix</p>
                </div>
                <div className="rounded-2xl p-5 space-y-0" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                  {fixSteps.map((step, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: reveal ? 1 : 0, x: reveal ? 0 : -10 }}
                      transition={{ delay: 1.8 + i * 0.12 }}
                      className="flex gap-4 relative">
                      {i < fixSteps.length - 1 && (
                        <div className="absolute left-[15px] top-[32px] bottom-0 w-px" style={{ background: 'var(--border)' }} />
                      )}
                      <div className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center font-mono text-[11px] font-bold mt-0.5 relative z-10"
                        style={{ background: i === 0 ? 'rgba(0,229,155,0.12)' : 'var(--bg-card-solid)', color: i === 0 ? '#00E59B' : 'var(--text-muted)', border: `1px solid ${i === 0 ? 'rgba(0,229,155,0.15)' : 'var(--border)'}` }}>
                        {i + 1}
                      </div>
                      <div className={`flex-1 pb-4 ${i === fixSteps.length - 1 ? 'pb-0' : ''}`}>
                        <p className="font-sans text-[13px] leading-relaxed pt-1" style={{ color: 'var(--text-secondary)' }}>{step}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Confidence */}
            <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: reveal ? 1 : 0, scale: reveal ? 1 : 0.7 }} transition={{ delay: 1.6, type: "spring" }}
              className="w-40 flex flex-col items-center justify-center rounded-3xl p-5 self-start" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
              <p className="font-mono text-[8px] uppercase tracking-[0.2em] mb-5" style={{ color: 'var(--text-muted)' }}>Confidence</p>
              <ConfidenceMeter confidence={confidence} />
              <p className="mt-4 font-display text-[12px] font-bold" style={{ color: confidence >= 70 ? '#00E59B' : confidence >= 50 ? '#FFB800' : '#FF4D6A' }}>
                {confidence >= 70 ? 'High' : confidence >= 50 ? 'Moderate' : 'Low'}
              </p>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 flex items-center justify-between" style={{ borderTop: '1px solid var(--border)' }}>
          {isEscalated ? (
            <>
              <p className="font-sans text-[11px] max-w-xs font-light" style={{ color: 'var(--text-muted)' }}>Human investigation required before resolution.</p>
              <motion.button whileTap={{ scale: 0.95 }} onClick={() => onEscalate(result)}
                className="haptic px-7 py-3 rounded-2xl font-display text-[13px] font-bold flex items-center gap-2 relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #FFB800, #FF8C00)', color: '#04060C', boxShadow: '0 0 24px rgba(255,184,0,0.15)' }}>
                <span className="relative z-10 flex items-center gap-2"><ShieldAlert className="w-4 h-4" /> BEGIN INVESTIGATION</span>
                <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity"
                  style={{ background: 'linear-gradient(90deg, transparent 25%, rgba(255,255,255,0.15) 50%, transparent 75%)', backgroundSize: '200% 100%', animation: 'shimmer 2s linear infinite' }} />
              </motion.button>
            </>
          ) : (
            <>
              {/* Override — Human Review (RED GLOW) */}
              <motion.button whileTap={{ scale: 0.95 }} onClick={handleManualEscalate} disabled={escalating}
                className="haptic px-6 py-3 rounded-2xl font-display text-[13px] font-bold flex items-center gap-2 relative overflow-hidden disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #FF4D6A, #FF6B8A)', color: '#fff', boxShadow: '0 0 30px rgba(255,77,106,0.2), 0 0 60px rgba(255,77,106,0.08)' }}>
                <span className="relative z-10 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> {escalating ? 'Escalating...' : 'Override — Human Review'}
                </span>
                <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity"
                  style={{ background: 'linear-gradient(90deg, transparent 25%, rgba(255,255,255,0.15) 50%, transparent 75%)', backgroundSize: '200% 100%', animation: 'shimmer 2s linear infinite' }} />
              </motion.button>

              {/* Accept — Pending Review (GREEN GLOW) */}
              <motion.button whileTap={{ scale: 0.95 }} onClick={onDismiss}
                className="haptic px-7 py-3 rounded-2xl font-display text-[13px] font-bold flex items-center gap-2 relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #00E59B, #00D4FF)', color: '#04060C', boxShadow: '0 0 30px rgba(0,229,155,0.2), 0 0 60px rgba(0,229,155,0.08)' }}>
                <span className="relative z-10 flex items-center gap-2">
                  <ThumbsUp className="w-4 h-4" /> Accept — Pending Review
                </span>
                <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity"
                  style={{ background: 'linear-gradient(90deg, transparent 25%, rgba(255,255,255,0.15) 50%, transparent 75%)', backgroundSize: '200% 100%', animation: 'shimmer 2s linear infinite' }} />
              </motion.button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}