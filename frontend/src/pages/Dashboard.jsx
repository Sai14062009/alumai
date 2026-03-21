// import { useEffect, useState, useRef } from 'react';
// import { motion } from 'framer-motion';
// import { PieChart, Pie, Cell, Area, AreaChart, ReferenceLine, Tooltip as RechartsTooltip, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from 'recharts';
// import { getAllTicketsWithStats } from '../services/api';
// import { TrendingUp, ArrowUpRight, ArrowDownRight, RefreshCw, Upload, AlertOctagon, Zap, Shield, Clock, Eye } from 'lucide-react';
// import SeverityPill from '../components/SeverityPill';

// const SEVERITY_COLORS = { Critical: '#FF4D6A', High: '#FFB800', Medium: '#00D4FF', Low: '#00E59B' };

// function useCounter(target, duration = 1500) {
//   const [count, setCount] = useState(0);
//   const ref = useRef(null);
//   useEffect(() => {
//     if (target === 0) { setCount(0); return; }
//     const startTime = performance.now();
//     const step = (now) => {
//       const p = Math.min((now - startTime) / duration, 1);
//       setCount(Math.floor((1 - Math.pow(1 - p, 3)) * target));
//       if (p < 1) ref.current = requestAnimationFrame(step);
//     };
//     ref.current = requestAnimationFrame(step);
//     return () => cancelAnimationFrame(ref.current);
//   }, [target, duration]);
//   return count;
// }

// const StatCard = ({ label, value, icon: Icon, color, mesh, delay, onClick, subtitle, trend }) => {
//   const av = useCounter(value);
//   return (
//     <motion.div initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay, ease: [0.22, 1, 0.36, 1] }}
//       whileHover={{ y: -4, transition: { duration: 0.2 } }} onClick={onClick}
//       className={`glass gradient-border rounded-3xl p-6 relative overflow-hidden group ${onClick ? 'cursor-pointer' : ''}`}>
//       <div className={`absolute inset-0 ${mesh} opacity-60 group-hover:opacity-100 transition-opacity duration-500`} />
//       <div className="absolute top-0 left-8 right-8 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
//         style={{ background: `linear-gradient(90deg, transparent, ${color}50, transparent)` }} />
//       <div className="relative z-10">
//         <div className="flex justify-between items-start mb-5">
//           <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: `${color}10`, border: `1px solid ${color}15` }}>
//             <Icon className="w-5 h-5" style={{ color }} />
//           </div>
//           {trend !== undefined && trend !== null && (
//             <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold"
//               style={{ background: trend > 0 ? 'rgba(0,229,155,0.08)' : 'rgba(255,77,106,0.08)', color: trend > 0 ? '#00E59B' : '#FF4D6A' }}>
//               {trend > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}{Math.abs(trend)}%
//             </div>
//           )}
//         </div>
//         <p className="font-display font-extrabold text-4xl tracking-tight mb-1" style={{ color: 'var(--text-primary)' }}>{av}</p>
//         <p className="font-sans text-[13px] font-medium" style={{ color: 'var(--text-secondary)' }}>{label}</p>
//         {subtitle && <p className="font-mono text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>{subtitle}</p>}
//       </div>
//     </motion.div>
//   );
// };

// const ChartTooltip = ({ active, payload, label }) => {
//   if (!active || !payload?.length) return null;
//   return (
//     <div className="glass rounded-xl px-4 py-3" style={{ boxShadow: 'var(--shadow-elevated)' }}>
//       <p className="font-mono text-[10px] mb-1" style={{ color: 'var(--text-muted)' }}>{label}</p>
//       <p className="font-display font-bold text-sm" style={{ color: '#00E59B' }}>{payload[0].value}%</p>
//     </div>
//   );
// };

// const SeverityDonutTooltip = ({ active, payload }) => {
//   if (!active || !payload?.length) return null;
//   const d = payload[0].payload;
//   return (
//     <div className="glass rounded-xl px-4 py-3" style={{ boxShadow: 'var(--shadow-elevated)' }}>
//       <div className="flex items-center gap-2">
//         <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
//         <span className="font-sans text-[12px] font-semibold" style={{ color: d.color }}>{d.name}</span>
//       </div>
//       <p className="font-mono text-[11px] mt-1" style={{ color: 'var(--text-primary)' }}>{d.value} tickets</p>
//     </div>
//   );
// };

// export default function Dashboard({ onNavigate }) {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [stats, setStats] = useState({ total: 0, resolved: 0, escalated: 0, pending: 0 });
//   const [severityData, setSeverityData] = useState([]);
//   const [confidenceData, setConfidenceData] = useState([]);
//   const [recentTickets, setRecentTickets] = useState([]);

//   const fetchData = async () => {
//     setLoading(true); setError(null);
//     try {
//       const result = await getAllTicketsWithStats();
//       const { all, stats: s } = result;
//       setStats(s);
//       setSeverityData(Object.entries(s.bySeverity).filter(([_, c]) => c > 0).map(([name, value]) => ({ name, value, color: SEVERITY_COLORS[name] })));
//       const classified = s.classifiedTickets || [];
//       setConfidenceData(classified.map(t => ({ label: `#${t.id}`, confidence: Math.round((t.confidence_score || 0) * 100) })).slice(-12));
//       setRecentTickets([...all].sort((a, b) => (b.id || 0) - (a.id || 0)).slice(0, 8));
//     } catch (err) { setError(err.message || "Failed to load."); }
//     finally { setLoading(false); }
//   };

//   useEffect(() => { fetchData(); }, []);

//   if (loading) return (
//     <div className="w-full h-96 flex flex-col items-center justify-center">
//       <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 animate-pulse" style={{ background: 'rgba(0,229,155,0.1)' }}>
//         <RefreshCw className="w-5 h-5 animate-spin" style={{ color: '#00E59B' }} />
//       </div>
//       <p className="font-sans text-sm" style={{ color: 'var(--text-muted)' }}>Loading intelligence...</p>
//     </div>
//   );

//   if (error) return (
//     <div className="w-full max-w-md mx-auto mt-20 text-center glass rounded-3xl p-10">
//       <AlertOctagon className="w-12 h-12 mx-auto mb-4" style={{ color: '#FF4D6A' }} />
//       <h2 className="font-display font-bold text-xl mb-2" style={{ color: 'var(--text-primary)' }}>Connection Error</h2>
//       <p className="font-sans text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>{error}</p>
//       <button onClick={fetchData} className="haptic px-6 py-3 rounded-2xl font-display font-bold text-sm" style={{ background: 'var(--gradient-accent)', color: '#04060C' }}>Retry</button>
//     </div>
//   );

//   if (stats.total === 0) return (
//     <div className="w-full max-w-md mx-auto mt-20 text-center glass rounded-3xl p-10">
//       <Upload className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
//       <h2 className="font-display font-bold text-xl mb-2" style={{ color: 'var(--text-primary)' }}>No Tickets Found</h2>
//       <p className="font-sans text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>Upload your Excel via the Triage Center to get started.</p>
//       <button onClick={() => onNavigate('triage')} className="haptic px-6 py-3 rounded-2xl font-display font-bold text-sm" style={{ background: 'var(--gradient-accent)', color: '#04060C' }}>Go to Triage</button>
//     </div>
//   );

//   const resolvedPct = stats.total > 0 ? Math.round(stats.resolved / stats.total * 100) : 0;
//   const totalSev = severityData.reduce((a, b) => a + b.value, 0);

//   const statusColors = {
//     'Open': '#FF4D6A', 'In Progress': '#FFB800', 'Awaiting Parts': '#B18CFF',
//     'Scheduled': '#00D4FF', 'Resolved': '#FFB800', 'Resolved ✅': '#FFB800',
//     'Pending Review': '#FFB800', 'Escalated': '#FF4D6A', 'Pending': 'var(--text-muted)',
//   };
//   const sourceColors = { servicenow: '#62D4A3', teams: '#7B83EB', outlook: '#4FC3F7' };

//   const getDisplayStatus = (tkt) => {
//     if (tkt.is_classified && tkt.status === 'Escalated') return 'Escalated';
//     if (tkt.is_classified && (tkt.status === 'Resolved' || tkt.status === 'Resolved ✅')) return 'Pending Review';
//     return tkt.status || 'Open';
//   };

//   return (
//     <div className="w-full max-w-[1200px] mx-auto space-y-6 pb-12">
//       {/* Header */}
//       <div className="flex items-end justify-between mb-2">
//         <div>
//           <motion.h1 initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="font-display font-extrabold text-3xl tracking-tight" style={{ color: 'var(--text-primary)' }}>Mission Control</motion.h1>
//           <motion.p initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.05 }} className="font-sans text-sm mt-1 font-light" style={{ color: 'var(--text-muted)' }}>Real-time intelligence overview</motion.p>
//         </div>
//         <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} whileTap={{ scale: 0.95 }} onClick={fetchData}
//           className="haptic flex items-center gap-2 px-4 py-2.5 rounded-xl glass font-mono text-[11px] font-medium">
//           <RefreshCw className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
//           <span style={{ color: 'var(--text-secondary)' }}>Refresh</span>
//         </motion.button>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         <StatCard label="Total Tickets" value={stats.total} icon={Zap} color="#00D4FF" mesh="mesh-2" delay={0} subtitle="All sources" />
//         <StatCard label="Resolved" value={stats.resolved} icon={Shield} color="#00E59B" mesh="mesh-1" delay={0.06} trend={resolvedPct} subtitle={`${resolvedPct}% success`} />
//         <StatCard label="Pending" value={stats.pending} icon={Clock} color="#B18CFF" mesh="mesh-2" delay={0.12} subtitle="Awaiting classification" />
//         <StatCard label="Escalated" value={stats.escalated} icon={AlertOctagon} color="#FF4D6A" mesh="mesh-3" delay={0.18} onClick={() => onNavigate('escalation')} subtitle={stats.escalated > 0 ? 'Action required' : 'All clear'} />
//       </div>

//       {/* Charts */}
//       <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
//         {/* Confidence Area — 3 cols */}
//         <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 }} className="md:col-span-3 glass gradient-border rounded-3xl p-6 flex flex-col" style={{ minHeight: '360px' }}>
//           <div className="flex items-center justify-between mb-6">
//             <div>
//               <h3 className="font-display font-bold text-[15px]" style={{ color: 'var(--text-primary)' }}>AI Confidence</h3>
//               <p className="font-sans text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>Classified tickets performance</p>
//             </div>
//             <TrendingUp className="w-4 h-4" style={{ color: '#00E59B' }} />
//           </div>
//           {confidenceData.length > 0 ? (
//             <div className="flex-1 w-full" style={{ minHeight: '260px' }}>
//               <ResponsiveContainer width="100%" height="100%">
//                 <AreaChart data={confidenceData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
//                   <defs>
//                     <linearGradient id="confGrad" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="0%" stopColor="#00E59B" stopOpacity={0.25} />
//                       <stop offset="95%" stopColor="#00E59B" stopOpacity={0} />
//                     </linearGradient>
//                   </defs>
//                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
//                   <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }} dy={10} />
//                   <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }} domain={[0, 100]} />
//                   <RechartsTooltip content={<ChartTooltip />} />
//                   <ReferenceLine y={70} stroke="#FFB800" strokeDasharray="5 5" strokeOpacity={0.4} />
//                   <Area type="monotone" dataKey="confidence" stroke="#00E59B" strokeWidth={2.5} fill="url(#confGrad)" dot={{ r: 3, fill: '#00E59B', stroke: 'var(--bg-card-solid)', strokeWidth: 2 }} activeDot={{ r: 6, fill: '#00E59B', stroke: 'var(--bg-card-solid)', strokeWidth: 2 }} />
//                 </AreaChart>
//               </ResponsiveContainer>
//             </div>
//           ) : (
//             <div className="flex-1 flex items-center justify-center font-sans text-sm" style={{ color: 'var(--text-muted)', minHeight: '260px' }}>Classify tickets to see data</div>
//           )}
//         </motion.div>

//         {/* Severity — 2 cols */}
//         <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="md:col-span-2 glass gradient-border rounded-3xl p-6 flex flex-col" style={{ minHeight: '360px' }}>
//           <h3 className="font-display font-bold text-[15px] mb-1" style={{ color: 'var(--text-primary)' }}>Severity</h3>
//           <p className="font-sans text-[11px] mb-4" style={{ color: 'var(--text-muted)' }}>Distribution by level</p>
//           {severityData.length > 0 ? (
//             <div className="flex-1 flex flex-col items-center justify-between">
//               <div className="relative" style={{ width: '170px', height: '170px' }}>
//                 <ResponsiveContainer width="100%" height="100%">
//                   <PieChart>
//                     <Pie data={severityData} cx="50%" cy="50%" innerRadius={50} outerRadius={72} paddingAngle={4} dataKey="value" strokeWidth={0}
//                       animationBegin={300} animationDuration={1200} animationEasing="ease-out">
//                       {severityData.map((e, i) => <Cell key={i} fill={e.color} style={{ filter: `drop-shadow(0 0 4px ${e.color}40)` }} />)}
//                     </Pie>
//                     <RechartsTooltip content={<SeverityDonutTooltip />} />
//                   </PieChart>
//                 </ResponsiveContainer>
//                 <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
//                   <span className="font-display font-extrabold text-2xl tracking-tight" style={{ color: 'var(--text-primary)' }}>{totalSev}</span>
//                   <span className="font-mono text-[8px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Total</span>
//                 </div>
//               </div>
//               <div className="w-full space-y-2.5 mt-4">
//                 {severityData.map((item, i) => {
//                   const pct = totalSev > 0 ? Math.round((item.value / totalSev) * 100) : 0;
//                   return (
//                     <motion.div key={item.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.08 }}
//                       className="flex items-center gap-3">
//                       <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: item.color, boxShadow: `0 0 6px ${item.color}40` }} />
//                       <span className="font-sans text-[11px] font-medium w-14 flex-shrink-0" style={{ color: 'var(--text-secondary)' }}>{item.name}</span>
//                       <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
//                         <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
//                           transition={{ delay: 0.7 + i * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
//                           className="h-full rounded-full" style={{ background: item.color }} />
//                       </div>
//                       <span className="font-mono text-[10px] font-bold w-8 text-right flex-shrink-0" style={{ color: item.color }}>{pct}%</span>
//                     </motion.div>
//                   );
//                 })}
//               </div>
//             </div>
//           ) : (
//             <div className="flex-1 flex items-center justify-center font-sans text-sm" style={{ color: 'var(--text-muted)' }}>No data yet</div>
//           )}
//         </motion.div>
//       </div>

//       {/* Recent Activity — pure CSS hover, no flicker */}
//       <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.35 }} className="glass gradient-border rounded-3xl overflow-hidden">
//         <div className="px-6 py-5 flex justify-between items-center" style={{ borderBottom: '1px solid var(--border)' }}>
//           <div>
//             <h3 className="font-display font-bold text-[15px]" style={{ color: 'var(--text-primary)' }}>Recent Activity</h3>
//             <p className="font-sans text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>Latest tickets across all pipelines</p>
//           </div>
//           <button className="font-mono text-[11px] font-semibold px-3 py-1.5 rounded-xl transition-colors" style={{ color: '#00E59B', background: 'rgba(0,229,155,0.06)' }} onClick={() => onNavigate('triage')}>View all →</button>
//         </div>
//         <div className="overflow-x-auto">
//           <table className="w-full text-left" style={{ minWidth: '800px' }}>
//             <thead>
//               <tr style={{ borderBottom: '1px solid var(--border)' }}>
//                 {['ID', 'Source', 'Priority', 'Asset', 'Description', 'Status', 'Confidence', ''].map((h, i) => (
//                   <th key={i} className={`px-5 py-3.5 font-mono text-[9px] font-semibold uppercase tracking-[0.15em] ${i === 7 ? 'text-right' : ''}`} style={{ color: 'var(--text-muted)' }}>{h}</th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {recentTickets.map((tkt, idx) => {
//                 const desc = tkt.description || "";
//                 const conf = tkt.confidence_score;
//                 const displayStatus = getDisplayStatus(tkt);
//                 const stColor = statusColors[displayStatus] || 'var(--text-muted)';
//                 const srcColor = sourceColors[tkt.source?.toLowerCase()] || 'var(--text-secondary)';

//                 return (
//                   <tr key={tkt.id || idx}
//                     className="group transition-colors duration-150 relative hover:bg-[var(--bg-card-hover)]"
//                     style={{ borderBottom: '1px solid var(--border)' }}>

//                     <td className="px-5 py-4 font-mono text-[12px] font-bold relative" style={{ color: '#00E59B' }}>
//                       <div className="absolute left-0 top-0 bottom-0 w-[2px] opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: '#00E59B' }} />
//                       #{tkt.id}
//                     </td>
//                     <td className="px-5 py-4">
//                       <span className="font-sans text-[10px] font-semibold capitalize px-2 py-1 rounded-lg"
//                         style={{ background: `${srcColor}10`, color: srcColor, border: `1px solid ${srcColor}15` }}>{tkt.source}</span>
//                     </td>
//                     <td className="px-5 py-4">{(tkt.severity || tkt.priority) ? <SeverityPill level={tkt.severity || tkt.priority} /> : <span className="font-mono text-[10px]" style={{ color: 'var(--text-muted)' }}>—</span>}</td>
//                     <td className="px-5 py-4 font-mono text-[11px]" style={{ color: 'var(--text-primary)' }}>{tkt.asset_name || tkt.asset || '—'}</td>
//                     <td className="px-5 py-4 font-sans text-[11px] max-w-[200px] truncate" style={{ color: 'var(--text-secondary)' }} title={desc}>{desc.length > 45 ? desc.substring(0, 45) + '...' : desc}</td>
//                     <td className="px-5 py-4">
//                       <div className="flex items-center gap-1.5">
//                         <span className="w-1.5 h-1.5 rounded-full" style={{ background: stColor }} />
//                         <span className="font-mono text-[10px] uppercase font-semibold" style={{ color: stColor }}>{displayStatus}</span>
//                       </div>
//                     </td>
//                     <td className="px-5 py-4">
//                       {conf != null ? (
//                         <div className="flex items-center gap-2">
//                           <div className="w-14 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
//                             <div className="h-full rounded-full" style={{ width: `${Math.round(conf * 100)}%`, background: conf >= 0.7 ? '#00E59B' : conf >= 0.5 ? '#FFB800' : '#FF4D6A' }} />
//                           </div>
//                           <span className="font-mono text-[10px] font-bold" style={{ color: conf >= 0.7 ? '#00E59B' : conf >= 0.5 ? '#FFB800' : '#FF4D6A' }}>{Math.round(conf * 100)}%</span>
//                         </div>
//                       ) : <span className="font-mono text-[10px]" style={{ color: 'var(--text-muted)' }}>—</span>}
//                     </td>
//                     <td className="px-5 py-4 text-right">
//                       <span className="opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold px-3 py-1.5 rounded-xl cursor-pointer"
//                         style={{ color: '#00E59B', background: 'rgba(0,229,155,0.06)', border: '1px solid rgba(0,229,155,0.1)' }}
//                         onClick={() => onNavigate('triage')}>
//                         <Eye className="w-3 h-3" /> View
//                       </span>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       </motion.div>
//     </div>
//   );
// }

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, Area, AreaChart, ReferenceLine, Tooltip as RechartsTooltip, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from 'recharts';
import { getAllTicketsWithStats } from '../services/api';
import { TrendingUp, ArrowUpRight, ArrowDownRight, RefreshCw, Upload, AlertOctagon, Zap, Shield, Clock, Eye } from 'lucide-react';
import SeverityPill from '../components/SeverityPill';

const SEVERITY_COLORS = { Critical: '#FF4D6A', High: '#FFB800', Medium: '#00D4FF', Low: '#00E59B' };

function useCounter(target, duration = 1500) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    if (target === 0) { setCount(0); return; }
    const startTime = performance.now();
    const step = (now) => {
      const p = Math.min((now - startTime) / duration, 1);
      setCount(Math.floor((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) ref.current = requestAnimationFrame(step);
    };
    ref.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(ref.current);
  }, [target, duration]);
  return count;
}

const StatCard = ({ label, value, icon: Icon, color, mesh, delay, onClick, subtitle, trend }) => {
  const av = useCounter(value);
  return (
    <motion.div initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }} onClick={onClick}
      className={`glass gradient-border rounded-2xl md:rounded-3xl p-4 md:p-6 relative overflow-hidden group ${onClick ? 'cursor-pointer' : ''}`}>
      <div className={`absolute inset-0 ${mesh} opacity-60 group-hover:opacity-100 transition-opacity duration-500`} />
      <div className="absolute top-0 left-8 right-8 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(90deg, transparent, ${color}50, transparent)` }} />
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-3 md:mb-5">
          <div className="w-9 h-9 md:w-11 md:h-11 rounded-xl md:rounded-2xl flex items-center justify-center" style={{ background: `${color}10`, border: `1px solid ${color}15` }}>
            <Icon className="w-4 h-4 md:w-5 md:h-5" style={{ color }} />
          </div>
          {trend !== undefined && trend !== null && (
            <div className="flex items-center gap-1 px-2 py-0.5 md:px-2.5 md:py-1 rounded-full text-[10px] md:text-[11px] font-mono font-semibold"
              style={{ background: trend > 0 ? 'rgba(0,229,155,0.08)' : 'rgba(255,77,106,0.08)', color: trend > 0 ? '#00E59B' : '#FF4D6A' }}>
              {trend > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}{Math.abs(trend)}%
            </div>
          )}
        </div>
        <p className="font-display font-extrabold text-2xl md:text-4xl tracking-tight mb-1" style={{ color: 'var(--text-primary)' }}>{av}</p>
        <p className="font-sans text-[11px] md:text-[13px] font-medium" style={{ color: 'var(--text-secondary)' }}>{label}</p>
        {subtitle && <p className="font-mono text-[9px] md:text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>{subtitle}</p>}
      </div>
    </motion.div>
  );
};

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-xl px-4 py-3" style={{ boxShadow: 'var(--shadow-elevated)' }}>
      <p className="font-mono text-[10px] mb-1" style={{ color: 'var(--text-muted)' }}>{label}</p>
      <p className="font-display font-bold text-sm" style={{ color: '#00E59B' }}>{payload[0].value}%</p>
    </div>
  );
};

const SeverityDonutTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="glass rounded-xl px-4 py-3" style={{ boxShadow: 'var(--shadow-elevated)' }}>
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
        <span className="font-sans text-[12px] font-semibold" style={{ color: d.color }}>{d.name}</span>
      </div>
      <p className="font-mono text-[11px] mt-1" style={{ color: 'var(--text-primary)' }}>{d.value} tickets</p>
    </div>
  );
};

export default function Dashboard({ onNavigate }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ total: 0, resolved: 0, escalated: 0, pending: 0 });
  const [severityData, setSeverityData] = useState([]);
  const [confidenceData, setConfidenceData] = useState([]);
  const [recentTickets, setRecentTickets] = useState([]);

  const fetchData = async () => {
    setLoading(true); setError(null);
    try {
      const result = await getAllTicketsWithStats();
      const { all, stats: s } = result;
      setStats(s);
      setSeverityData(Object.entries(s.bySeverity).filter(([_, c]) => c > 0).map(([name, value]) => ({ name, value, color: SEVERITY_COLORS[name] })));
      const classified = s.classifiedTickets || [];
      setConfidenceData(classified.map(t => ({ label: `#${t.id}`, confidence: Math.round((t.confidence_score || 0) * 100) })).slice(-12));
      setRecentTickets([...all].sort((a, b) => (b.id || 0) - (a.id || 0)).slice(0, 8));
    } catch (err) { setError(err.message || "Failed to load."); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return (
    <div className="w-full h-96 flex flex-col items-center justify-center">
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 animate-pulse" style={{ background: 'rgba(0,229,155,0.1)' }}>
        <RefreshCw className="w-5 h-5 animate-spin" style={{ color: '#00E59B' }} />
      </div>
      <p className="font-sans text-sm" style={{ color: 'var(--text-muted)' }}>Loading intelligence...</p>
    </div>
  );

  if (error) return (
    <div className="w-full max-w-md mx-auto mt-10 md:mt-20 text-center glass rounded-3xl p-6 md:p-10">
      <AlertOctagon className="w-12 h-12 mx-auto mb-4" style={{ color: '#FF4D6A' }} />
      <h2 className="font-display font-bold text-xl mb-2" style={{ color: 'var(--text-primary)' }}>Connection Error</h2>
      <p className="font-sans text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>{error}</p>
      <button onClick={fetchData} className="haptic px-6 py-3 rounded-2xl font-display font-bold text-sm" style={{ background: 'var(--gradient-accent)', color: '#04060C' }}>Retry</button>
    </div>
  );

  if (stats.total === 0) return (
    <div className="w-full max-w-md mx-auto mt-10 md:mt-20 text-center glass rounded-3xl p-6 md:p-10">
      <Upload className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
      <h2 className="font-display font-bold text-xl mb-2" style={{ color: 'var(--text-primary)' }}>No Tickets Found</h2>
      <p className="font-sans text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>Upload your Excel via the Triage Center to get started.</p>
      <button onClick={() => onNavigate('triage')} className="haptic px-6 py-3 rounded-2xl font-display font-bold text-sm" style={{ background: 'var(--gradient-accent)', color: '#04060C' }}>Go to Triage</button>
    </div>
  );

  const resolvedPct = stats.total > 0 ? Math.round(stats.resolved / stats.total * 100) : 0;
  const totalSev = severityData.reduce((a, b) => a + b.value, 0);

  const statusColors = {
    'Open': '#FF4D6A', 'In Progress': '#FFB800', 'Awaiting Parts': '#B18CFF',
    'Scheduled': '#00D4FF', 'Resolved': '#FFB800', 'Resolved ✅': '#FFB800',
    'Pending Review': '#FFB800', 'Escalated': '#FF4D6A', 'Pending': 'var(--text-muted)',
  };
  const sourceColors = { servicenow: '#62D4A3', teams: '#7B83EB', outlook: '#4FC3F7' };

  const getDisplayStatus = (tkt) => {
    if (tkt.is_classified && tkt.status === 'Escalated') return 'Escalated';
    if (tkt.is_classified && (tkt.status === 'Resolved' || tkt.status === 'Resolved ✅')) return 'Pending Review';
    return tkt.status || 'Open';
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto space-y-4 md:space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-2">
        <div>
          <motion.h1 initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="font-display font-extrabold text-2xl md:text-3xl tracking-tight" style={{ color: 'var(--text-primary)' }}>Mission Control</motion.h1>
          <motion.p initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.05 }} className="font-sans text-xs md:text-sm mt-1 font-light" style={{ color: 'var(--text-muted)' }}>Real-time intelligence overview</motion.p>
        </div>
        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} whileTap={{ scale: 0.95 }} onClick={fetchData}
          className="haptic flex items-center gap-2 px-4 py-2.5 rounded-xl glass font-mono text-[11px] font-medium self-start sm:self-auto">
          <RefreshCw className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
          <span style={{ color: 'var(--text-secondary)' }}>Refresh</span>
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <StatCard label="Total Tickets" value={stats.total} icon={Zap} color="#00D4FF" mesh="mesh-2" delay={0} subtitle="All sources" />
        <StatCard label="Resolved" value={stats.resolved} icon={Shield} color="#00E59B" mesh="mesh-1" delay={0.06} trend={resolvedPct} subtitle={`${resolvedPct}% success`} />
        <StatCard label="Pending" value={stats.pending} icon={Clock} color="#B18CFF" mesh="mesh-2" delay={0.12} subtitle="Awaiting classification" />
        <StatCard label="Escalated" value={stats.escalated} icon={AlertOctagon} color="#FF4D6A" mesh="mesh-3" delay={0.18} onClick={() => onNavigate('escalation')} subtitle={stats.escalated > 0 ? 'Action required' : 'All clear'} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Confidence Area */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 }} className="lg:col-span-3 glass gradient-border rounded-2xl md:rounded-3xl p-4 md:p-6 flex flex-col" style={{ minHeight: '300px' }}>
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <div>
              <h3 className="font-display font-bold text-[14px] md:text-[15px]" style={{ color: 'var(--text-primary)' }}>AI Confidence</h3>
              <p className="font-sans text-[10px] md:text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>Classified tickets performance</p>
            </div>
            <TrendingUp className="w-4 h-4" style={{ color: '#00E59B' }} />
          </div>
          {confidenceData.length > 0 ? (
            <div className="flex-1 w-full" style={{ minHeight: '200px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={confidenceData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="confGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00E59B" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#00E59B" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }} domain={[0, 100]} />
                  <RechartsTooltip content={<ChartTooltip />} />
                  <ReferenceLine y={70} stroke="#FFB800" strokeDasharray="5 5" strokeOpacity={0.4} />
                  <Area type="monotone" dataKey="confidence" stroke="#00E59B" strokeWidth={2.5} fill="url(#confGrad)" dot={{ r: 3, fill: '#00E59B', stroke: 'var(--bg-card-solid)', strokeWidth: 2 }} activeDot={{ r: 6, fill: '#00E59B', stroke: 'var(--bg-card-solid)', strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center font-sans text-sm" style={{ color: 'var(--text-muted)', minHeight: '200px' }}>Classify tickets to see data</div>
          )}
        </motion.div>

        {/* Severity */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="lg:col-span-2 glass gradient-border rounded-2xl md:rounded-3xl p-4 md:p-6 flex flex-col" style={{ minHeight: '300px' }}>
          <h3 className="font-display font-bold text-[14px] md:text-[15px] mb-1" style={{ color: 'var(--text-primary)' }}>Severity</h3>
          <p className="font-sans text-[10px] md:text-[11px] mb-4" style={{ color: 'var(--text-muted)' }}>Distribution by level</p>
          {severityData.length > 0 ? (
            <div className="flex-1 flex flex-col items-center justify-between">
              <div className="relative" style={{ width: '150px', height: '150px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={severityData} cx="50%" cy="50%" innerRadius={45} outerRadius={65} paddingAngle={4} dataKey="value" strokeWidth={0}
                      animationBegin={300} animationDuration={1200} animationEasing="ease-out">
                      {severityData.map((e, i) => <Cell key={i} fill={e.color} style={{ filter: `drop-shadow(0 0 4px ${e.color}40)` }} />)}
                    </Pie>
                    <RechartsTooltip content={<SeverityDonutTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="font-display font-extrabold text-xl md:text-2xl tracking-tight" style={{ color: 'var(--text-primary)' }}>{totalSev}</span>
                  <span className="font-mono text-[8px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Total</span>
                </div>
              </div>
              <div className="w-full space-y-2 md:space-y-2.5 mt-4">
                {severityData.map((item, i) => {
                  const pct = totalSev > 0 ? Math.round((item.value / totalSev) * 100) : 0;
                  return (
                    <motion.div key={item.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.08 }}
                      className="flex items-center gap-2 md:gap-3">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: item.color, boxShadow: `0 0 6px ${item.color}40` }} />
                      <span className="font-sans text-[10px] md:text-[11px] font-medium w-12 md:w-14 flex-shrink-0" style={{ color: 'var(--text-secondary)' }}>{item.name}</span>
                      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                          transition={{ delay: 0.7 + i * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                          className="h-full rounded-full" style={{ background: item.color }} />
                      </div>
                      <span className="font-mono text-[9px] md:text-[10px] font-bold w-8 text-right flex-shrink-0" style={{ color: item.color }}>{pct}%</span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center font-sans text-sm" style={{ color: 'var(--text-muted)' }}>No data yet</div>
          )}
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.35 }} className="glass gradient-border rounded-2xl md:rounded-3xl overflow-hidden">
        <div className="px-4 md:px-6 py-4 md:py-5 flex justify-between items-center" style={{ borderBottom: '1px solid var(--border)' }}>
          <div>
            <h3 className="font-display font-bold text-[14px] md:text-[15px]" style={{ color: 'var(--text-primary)' }}>Recent Activity</h3>
            <p className="font-sans text-[10px] md:text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>Latest tickets across all pipelines</p>
          </div>
          <button className="font-mono text-[10px] md:text-[11px] font-semibold px-3 py-1.5 rounded-xl transition-colors" style={{ color: '#00E59B', background: 'rgba(0,229,155,0.06)' }} onClick={() => onNavigate('triage')}>View all →</button>
        </div>

        {/* Mobile card view */}
        <div className="md:hidden p-3 space-y-2">
          {recentTickets.map((tkt, idx) => {
            const displayStatus = getDisplayStatus(tkt);
            const stColor = statusColors[displayStatus] || 'var(--text-muted)';
            const srcColor = sourceColors[tkt.source?.toLowerCase()] || 'var(--text-secondary)';
            return (
              <div key={tkt.id || idx} className="rounded-xl p-3" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-bold" style={{ color: '#00E59B' }}>#{tkt.id}</span>
                    <span className="font-sans text-[9px] font-semibold capitalize px-1.5 py-0.5 rounded"
                      style={{ background: `${srcColor}10`, color: srcColor }}>{tkt.source}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: stColor }} />
                    <span className="font-mono text-[9px] uppercase font-semibold" style={{ color: stColor }}>{displayStatus}</span>
                  </div>
                </div>
                <p className="font-sans text-[11px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {(tkt.description || '').substring(0, 80)}{(tkt.description || '').length > 80 ? '...' : ''}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  {(tkt.severity || tkt.priority) && <SeverityPill level={tkt.severity || tkt.priority} />}
                  <span className="font-mono text-[9px]" style={{ color: 'var(--text-muted)' }}>{tkt.asset_name || tkt.asset || ''}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop table view */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left" style={{ minWidth: '800px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['ID', 'Source', 'Priority', 'Asset', 'Description', 'Status', 'Confidence', ''].map((h, i) => (
                  <th key={i} className={`px-5 py-3.5 font-mono text-[9px] font-semibold uppercase tracking-[0.15em] ${i === 7 ? 'text-right' : ''}`} style={{ color: 'var(--text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentTickets.map((tkt, idx) => {
                const desc = tkt.description || "";
                const conf = tkt.confidence_score;
                const displayStatus = getDisplayStatus(tkt);
                const stColor = statusColors[displayStatus] || 'var(--text-muted)';
                const srcColor = sourceColors[tkt.source?.toLowerCase()] || 'var(--text-secondary)';
                return (
                  <tr key={tkt.id || idx}
                    className="group transition-colors duration-150 relative hover:bg-[var(--bg-card-hover)]"
                    style={{ borderBottom: '1px solid var(--border)' }}>
                    <td className="px-5 py-4 font-mono text-[12px] font-bold relative" style={{ color: '#00E59B' }}>
                      <div className="absolute left-0 top-0 bottom-0 w-[2px] opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: '#00E59B' }} />
                      #{tkt.id}
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-sans text-[10px] font-semibold capitalize px-2 py-1 rounded-lg"
                        style={{ background: `${srcColor}10`, color: srcColor, border: `1px solid ${srcColor}15` }}>{tkt.source}</span>
                    </td>
                    <td className="px-5 py-4">{(tkt.severity || tkt.priority) ? <SeverityPill level={tkt.severity || tkt.priority} /> : <span className="font-mono text-[10px]" style={{ color: 'var(--text-muted)' }}>—</span>}</td>
                    <td className="px-5 py-4 font-mono text-[11px]" style={{ color: 'var(--text-primary)' }}>{tkt.asset_name || tkt.asset || '—'}</td>
                    <td className="px-5 py-4 font-sans text-[11px] max-w-[200px] truncate" style={{ color: 'var(--text-secondary)' }} title={desc}>{desc.length > 45 ? desc.substring(0, 45) + '...' : desc}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: stColor }} />
                        <span className="font-mono text-[10px] uppercase font-semibold" style={{ color: stColor }}>{displayStatus}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {conf != null ? (
                        <div className="flex items-center gap-2">
                          <div className="w-14 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                            <div className="h-full rounded-full" style={{ width: `${Math.round(conf * 100)}%`, background: conf >= 0.7 ? '#00E59B' : conf >= 0.5 ? '#FFB800' : '#FF4D6A' }} />
                          </div>
                          <span className="font-mono text-[10px] font-bold" style={{ color: conf >= 0.7 ? '#00E59B' : conf >= 0.5 ? '#FFB800' : '#FF4D6A' }}>{Math.round(conf * 100)}%</span>
                        </div>
                      ) : <span className="font-mono text-[10px]" style={{ color: 'var(--text-muted)' }}>—</span>}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold px-3 py-1.5 rounded-xl cursor-pointer"
                        style={{ color: '#00E59B', background: 'rgba(0,229,155,0.06)', border: '1px solid rgba(0,229,155,0.1)' }}
                        onClick={() => onNavigate('triage')}>
                        <Eye className="w-3 h-3" /> View
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}