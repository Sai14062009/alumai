import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getTickets, uploadTickets } from '../services/api';
import { RefreshCw, ArrowUpRight, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import FileUpload from '../components/FileUpload';

const ServiceNowLogo = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
    <rect width="44" height="44" rx="14" fill="url(#sn_bg)"/>
    <path d="M22 9L11 20L22 31L33 20L22 9Z" fill="#62D4A3" opacity="0.3"/>
    <path d="M22 13L15 20L22 27L29 20L22 13Z" fill="#62D4A3"/>
    <circle cx="22" cy="20" r="3.5" fill="#1A2332"/>
    <circle cx="22" cy="20" r="1.5" fill="#62D4A3"/>
    <defs><linearGradient id="sn_bg" x1="0" y1="0" x2="44" y2="44"><stop stopColor="#132620"/><stop offset="1" stopColor="#0D1A16"/></linearGradient></defs>
  </svg>
);

const TeamsLogo = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
    <rect width="44" height="44" rx="14" fill="url(#tm_bg)"/>
    <rect x="11" y="12" width="18" height="18" rx="4" fill="#5B5FC7"/>
    <text x="20" y="25" textAnchor="middle" fill="white" fontSize="12" fontWeight="800" fontFamily="Outfit">T</text>
    <circle cx="31" cy="13" r="5.5" fill="#7B83EB"/>
    <path d="M28 19h6v7a2 2 0 01-2 2h-2a2 2 0 01-2-2v-7z" fill="#7B83EB" opacity="0.6"/>
    <defs><linearGradient id="tm_bg" x1="0" y1="0" x2="44" y2="44"><stop stopColor="#1A1540"/><stop offset="1" stopColor="#12102A"/></linearGradient></defs>
  </svg>
);

const OutlookLogo = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
    <rect width="44" height="44" rx="14" fill="url(#ol_bg)"/>
    <rect x="9" y="13" width="26" height="18" rx="3" fill="#0078D4"/>
    <path d="M9 16l13 9 13-9" stroke="#4FC3F7" strokeWidth="1.3" fill="none" strokeLinecap="round"/>
    <ellipse cx="16" cy="22" rx="6" ry="7" fill="#0A5EB5"/>
    <text x="16" y="25" textAnchor="middle" fill="white" fontSize="9.5" fontWeight="800" fontFamily="Outfit">O</text>
    <defs><linearGradient id="ol_bg" x1="0" y1="0" x2="44" y2="44"><stop stopColor="#0A1E3D"/><stop offset="1" stopColor="#081428"/></linearGradient></defs>
  </svg>
);

const SOURCES = [
  { id: 'servicenow', title: 'ServiceNow', subtitle: 'IT Service Management', logo: ServiceNowLogo, color: '#62D4A3', glowBg: 'rgba(98,212,163,0.08)', glowBorder: 'rgba(98,212,163,0.12)', glowOrb: 'rgba(98,212,163,0.12)', tagline: 'Enterprise ITSM Pipeline' },
  { id: 'teams', title: 'Microsoft Teams', subtitle: 'Collaboration Hub', logo: TeamsLogo, color: '#7B83EB', glowBg: 'rgba(123,131,235,0.08)', glowBorder: 'rgba(123,131,235,0.12)', glowOrb: 'rgba(123,131,235,0.12)', tagline: 'Real-time Chat Feed' },
  { id: 'outlook', title: 'Outlook', subtitle: 'Email Gateway', logo: OutlookLogo, color: '#4FC3F7', glowBg: 'rgba(79,195,247,0.08)', glowBorder: 'rgba(79,195,247,0.12)', glowOrb: 'rgba(79,195,247,0.12)', tagline: 'Email Ticket Ingestion' },
];

export default function Triage({ onSelectSource }) {
  const [sourceCounts, setSourceCounts] = useState({});
  const [sourceTickets, setSourceTickets] = useState({});
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);

  const fetchCounts = async () => {
    setLoading(true);
    const counts = {};
    const tix = {};
    await Promise.allSettled(SOURCES.map(async (src) => {
      try {
        const r = await getTickets(src.id);
        const data = r.data || [];
        counts[src.id] = r.count || data.length;
        tix[src.id] = data;
      } catch { counts[src.id] = 0; tix[src.id] = []; }
    }));
    setSourceCounts(counts);
    setSourceTickets(tix);
    setLoading(false);
  };

  useEffect(() => { fetchCounts(); }, []);

  const handleUploadComplete = async (file) => {
    const res = await uploadTickets(file);
    setTimeout(() => fetchCounts(), 500);
    return res;
  };

  const getStats = (srcId) => {
    const t = sourceTickets[srcId] || [];
    if (!t.length) return { resolved: 0, pending: 0, escalated: 0 };
    return {
      resolved: t.filter(x => x.status?.includes('Resolved')).length,
      pending: t.filter(x => x.status === 'Pending' || x.status === 'Open' || !x.is_classified).length,
      escalated: t.filter(x => x.status === 'Escalated').length,
    };
  };

  const totalTickets = Object.values(sourceCounts).reduce((a, b) => a + b, 0);

  return (
    <div className="w-full max-w-[1200px] mx-auto space-y-8 pb-12">
      <div className="flex items-end justify-between">
        <div>
          <motion.h1 initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
            className="font-display font-extrabold text-3xl tracking-tight" style={{ color: 'var(--text-primary)' }}>Triage Center</motion.h1>
          <motion.p initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.05 }}
            className="font-sans text-sm mt-1 font-light" style={{ color: 'var(--text-muted)' }}>Select a data source to classify tickets</motion.p>
        </div>
        <div className="flex items-center gap-3">
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} whileTap={{ scale: 0.95 }}
            onClick={() => setShowUpload(!showUpload)}
            className="haptic flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-[11px] font-bold"
            style={{ background: showUpload ? 'rgba(0,229,155,0.1)' : 'transparent', color: '#00E59B', border: '1px solid rgba(0,229,155,0.2)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
            </svg>
            {showUpload ? 'Hide Upload' : 'Upload Data'}
          </motion.button>
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} whileTap={{ scale: 0.95 }} onClick={fetchCounts}
            className="haptic flex items-center gap-2 px-4 py-2.5 rounded-xl glass font-mono text-[11px] font-medium">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} style={{ color: 'var(--text-muted)' }} />
            <span style={{ color: 'var(--text-secondary)' }}>Refresh</span>
          </motion.button>
        </div>
      </div>

      {/* Upload Section */}
      <AnimatePresence>
        {showUpload && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden">
            <div className="glass gradient-border rounded-3xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-display font-bold text-[15px]" style={{ color: 'var(--text-primary)' }}>Import Ticket Data</h3>
                  <p className="font-sans text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    Upload Excel with columns: <span className="font-mono" style={{ color: 'var(--text-secondary)' }}>source, priority, asset_name, location, description, reported_by, created_at, status</span>
                  </p>
                </div>
                {totalTickets > 0 && (
                  <span className="font-mono text-[11px] px-3 py-1.5 rounded-xl" style={{ background: 'rgba(0,229,155,0.06)', color: '#00E59B', border: '1px solid rgba(0,229,155,0.1)' }}>
                    {totalTickets} tickets loaded
                  </span>
                )}
              </div>
              <FileUpload onUpload={handleUploadComplete} title="Upload Ticket Excel" subtitle="Drag and drop your master ticket file (.xlsx) or click to browse" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Source Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {SOURCES.map((src, idx) => {
          const count = sourceCounts[src.id] || 0;
          const stats = getStats(src.id);
          const Logo = src.logo;

          return (
            <motion.div key={src.id}
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -8, transition: { duration: 0.25 } }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelectSource(src.id)}
              className="rounded-[28px] cursor-pointer group relative overflow-hidden"
              style={{ background: 'var(--bg-card-solid)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}
            >
              {/* Background glow */}
              <div className="absolute inset-0 opacity-40 group-hover:opacity-70 transition-opacity duration-700 pointer-events-none"
                style={{ background: `radial-gradient(ellipse at 20% 0%, ${src.glowBg} 0%, transparent 60%)` }} />
              {/* Top line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `linear-gradient(90deg, transparent 10%, ${src.color} 50%, transparent 90%)` }} />
              {/* Orb */}
              <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                style={{ background: `radial-gradient(circle, ${src.glowOrb} 0%, transparent 70%)`, filter: 'blur(30px)' }} />

              <div className="relative z-10 p-7">
                <div className="flex items-start justify-between mb-6">
                  <Logo />
                  <div className="flex items-center gap-2">
                    {count > 0 && (
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: src.glowBg, border: `1px solid ${src.glowBorder}` }}>
                        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: src.color }} />
                        <span className="font-mono text-[10px] font-semibold" style={{ color: src.color }}>Active</span>
                      </div>
                    )}
                    <ArrowUpRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" style={{ color: src.color }} />
                  </div>
                </div>

                <h2 className="font-display font-bold text-[22px] mb-0.5 tracking-tight" style={{ color: 'var(--text-primary)' }}>{src.title}</h2>
                <p className="font-sans text-[12px] font-light mb-7" style={{ color: 'var(--text-muted)' }}>{src.tagline}</p>

                {loading ? (
                  <div className="flex items-center gap-2 mb-6">
                    <RefreshCw className="w-4 h-4 animate-spin" style={{ color: 'var(--text-muted)' }} />
                    <span className="font-mono text-[12px]" style={{ color: 'var(--text-muted)' }}>Loading...</span>
                  </div>
                ) : (
                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="font-display font-extrabold text-5xl tracking-tighter" style={{ color: src.color }}>{count}</span>
                    <span className="font-sans text-[13px] font-light" style={{ color: 'var(--text-muted)' }}>tickets</span>
                  </div>
                )}

                {!loading && count > 0 && (
                  <div className="flex items-center gap-3 pt-5" style={{ borderTop: '1px solid var(--border)' }}>
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ background: 'rgba(0,229,155,0.1)' }}>
                        <CheckCircle2 className="w-3 h-3" style={{ color: '#00E59B' }} />
                      </div>
                      <span className="font-mono text-[11px] font-semibold" style={{ color: 'var(--text-secondary)' }}>{stats.resolved}</span>
                      <span className="font-sans text-[10px]" style={{ color: 'var(--text-muted)' }}>done</span>
                    </div>
                    <div className="w-px h-4" style={{ background: 'var(--border)' }} />
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ background: 'rgba(177,140,255,0.1)' }}>
                        <Clock className="w-3 h-3" style={{ color: '#B18CFF' }} />
                      </div>
                      <span className="font-mono text-[11px] font-semibold" style={{ color: 'var(--text-secondary)' }}>{stats.pending}</span>
                      <span className="font-sans text-[10px]" style={{ color: 'var(--text-muted)' }}>pending</span>
                    </div>
                    {stats.escalated > 0 && (
                      <>
                        <div className="w-px h-4" style={{ background: 'var(--border)' }} />
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ background: 'rgba(255,77,106,0.1)' }}>
                            <AlertTriangle className="w-3 h-3" style={{ color: '#FF4D6A' }} />
                          </div>
                          <span className="font-mono text-[11px] font-semibold" style={{ color: '#FF4D6A' }}>{stats.escalated}</span>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {!loading && count > 0 && (
                  <div className="mt-4 w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${Math.round((stats.resolved / count) * 100)}%` }}
                      transition={{ delay: 0.5 + idx * 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${src.color}, ${src.color}80)` }} />
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}