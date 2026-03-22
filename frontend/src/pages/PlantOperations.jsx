// import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { ChevronDown, X, RefreshCw, Gauge } from 'lucide-react';
// import { getAllTicketsWithStats } from '../services/api';
// import SeverityPill from '../components/SeverityPill';

// const MELTER_DATA = {
//   'M1': { nm:'Melter-1',cd:'1M2',cx:'Complex 1',st:'Heating',sp:3,bt:1337,ft:2155,wt:84000,ch:159,gr:'C42Z',cy:291 },
//   'M2': { nm:'Melter-2',cd:'2WM',cx:'Complex 2',st:'Melting',sp:1,bt:1412,ft:2280,wt:72500,ch:163,gr:'C343H',cy:210 },
//   'M3': { nm:'Melter-3',cd:'8M3',cx:'Complex 8',st:'Drip Time',sp:2,bt:1298,ft:1890,wt:68200,ch:147,gr:'A356',cy:226 },
//   'M4': { nm:'Melter-4',cd:'4M',cx:'Complex 4',st:'Charging',sp:0,bt:890,ft:1420,wt:17840,ch:171,gr:'6061',cy:18 },
//   'M5': { nm:'Melter-5',cd:'5M3',cx:'Complex 5',st:'Melting',sp:1,bt:1380,ft:2190,wt:84000,ch:155,gr:'7075',cy:195 },
//   'M6': { nm:'Melter-6',cd:'5M2',cx:'Complex 5',st:'Transferring',sp:4,bt:1425,ft:1650,wt:80000,ch:152,gr:'5052',cy:318 },
//   'M7': { nm:'Melter-7',cd:'8M2',cx:'Complex 8',st:'Heating',sp:3,bt:1305,ft:2100,wt:78500,ch:149,gr:'C42Z',cy:238 },
//   'M8': { nm:'Melter-8',cd:'5M1',cx:'Complex 5',st:'Idle',sp:-1,bt:720,ft:850,wt:0,ch:144,gr:'—',cy:0 },
// };

// const HOLDER_DATA = {
//   'H1': { nm:'Holder-1',cd:'1EH',cx:'Complex 1',st:'Holding',bt:1431,ft:1359,gr:'C42Z',taps:8,lt:'07-13 01:28' },
//   'H2': { nm:'Holder-2',cd:'1WH',cx:'Complex 1',st:'Holding',bt:1434,ft:1369,gr:'C42Z',taps:0,lt:'07-12 16:31' },
//   'H3': { nm:'Holder-3',cd:'2EM',cx:'Complex 2',st:'Receiving',bt:1395,ft:1280,gr:'C343H',taps:3,lt:'07-13 03:15' },
//   'H4': { nm:'Holder-4',cd:'5WH',cx:'Complex 5',st:'Holding',bt:1418,ft:1345,gr:'7075',taps:5,lt:'07-12 22:40' },
//   'H5': { nm:'Holder-5',cd:'5EH',cx:'Complex 5',st:'Low Temp',bt:1285,ft:1190,gr:'5052',taps:2,lt:'07-13 04:10' },
//   'H6': { nm:'Holder-6',cd:'8WH',cx:'Complex 8',st:'Holding',bt:1404,ft:1325,gr:'A356',taps:6,lt:'07-12 19:55' },
//   'H7': { nm:'Holder-7',cd:'8EH',cx:'Complex 8',st:'Holding',bt:1398,ft:1310,gr:'C42Z',taps:4,lt:'07-13 02:05' },
//   'H8': { nm:'Holder-8',cd:'4WH',cx:'Complex 4',st:'Empty',bt:0,ft:680,gr:'—',taps:0,lt:'—' },
// };

// const PIT_DATA = {
//   'CP1': { nm:'Casting Pit-1',cd:'West Pit',cx:'Complex 8',st:'Casting',bt:1304,gr:'C42Z',cno:'P8383',spd:3.2,len:248,tleft:34,bct:82 },
//   'CP2': { nm:'Casting Pit-2',cd:'East Pit',cx:'Complex 8',st:'Casting',bt:1325,gr:'C343H',cno:'N6347',spd:3.0,len:130,tleft:72,bct:129 },
//   'CP3': { nm:'Casting Pit-3',cd:'Pit 3',cx:'Complex 5',st:'Idle',bt:0,gr:'—',cno:'—',spd:0,len:0,tleft:0,bct:0 },
//   'CP4': { nm:'Casting Pit-4',cd:'Pit 4',cx:'Complex 1',st:'Preparing',bt:1380,gr:'6061',cno:'R2190',spd:0,len:0,tleft:15,bct:95 },
//   'CP5': { nm:'Casting Pit-5',cd:'Pit 5',cx:'Complex 2',st:'Cooling',bt:890,gr:'7075',cno:'K4401',spd:0,len:320,tleft:0,bct:110 },
// };

// const TYPE_DATA = { 'Melters': MELTER_DATA, 'Holders': HOLDER_DATA, 'Casting Pits': PIT_DATA };
// const CYCLE_STEPS = ['Charge','Melt','Skim','Heat','Transfer'];

// const STATUS_COLORS = {
//   'Heating':'#EF9F27','Melting':'#E24B4A','Drip Time':'#E24B4A','Idle':'#1D9E75',
//   'Transferring':'#378ADD','Charging':'#7F77DD','Holding':'#1D9E75','Receiving':'#378ADD',
//   'Low Temp':'#E24B4A','Empty':'#888780','Casting':'#E24B4A','Preparing':'#7F77DD','Cooling':'#378ADD',
// };

// const ALL_ASSETS_MAP = {};
// Object.entries(MELTER_DATA).forEach(([k,v]) => { ALL_ASSETS_MAP[v.nm] = k; });
// Object.entries(HOLDER_DATA).forEach(([k,v]) => { ALL_ASSETS_MAP[v.nm] = k; });
// Object.entries(PIT_DATA).forEach(([k,v]) => { ALL_ASSETS_MAP[v.nm] = k; });

// function matchTickets(allTickets, assetFullName) {
//   return allTickets.filter(t => {
//     const n = (t.asset_name || t.asset || '').toLowerCase().replace(/[\s\-_]+/g, '');
//     const target = assetFullName.toLowerCase().replace(/[\s\-_]+/g, '');
//     return n === target || n.includes(target) || target.includes(n);
//   });
// }

// function Dropdown({ value, placeholder, options, onSelect, disabled }) {
//   const [open, setOpen] = useState(false);
//   const ref = useRef(null);

//   useEffect(() => {
//     const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
//     document.addEventListener('mousedown', handler);
//     return () => document.removeEventListener('mousedown', handler);
//   }, []);

//   return (
//     <div ref={ref} className="relative min-w-[160px] sm:min-w-[180px]" style={{ zIndex: open ? 100 : 'auto' }}>
//       <motion.button whileTap={{ scale: 0.97 }} onClick={() => !disabled && setOpen(!open)}
//         className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-[14px] sm:rounded-[16px] text-left font-sans text-[12px] sm:text-[13px] font-semibold flex items-center justify-between gap-2 transition-all"
//         style={{
//           background: value ? 'linear-gradient(135deg, rgba(0,229,155,0.06), rgba(0,212,255,0.03))' : 'var(--bg-surface)',
//           color: value ? '#00E59B' : disabled ? 'var(--text-muted)' : 'var(--text-secondary)',
//           border: `1.5px solid ${value ? 'rgba(0,229,155,0.2)' : 'var(--border)'}`,
//           opacity: disabled ? 0.4 : 1,
//           cursor: disabled ? 'not-allowed' : 'pointer',
//           boxShadow: value ? '0 4px 20px rgba(0,229,155,0.08)' : '0 2px 8px rgba(0,0,0,0.03)',
//         }}>
//         <span className="truncate">{value || placeholder}</span>
//         <ChevronDown className={`w-3.5 h-3.5 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} style={{ color: 'var(--text-muted)' }} />
//       </motion.button>

//       <AnimatePresence>
//         {open && (
//           <motion.div initial={{ opacity: 0, y: -8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.96 }}
//             transition={{ duration: 0.2 }}
//             className="absolute top-full left-0 right-0 sm:min-w-[220px] mt-2 rounded-[16px] overflow-hidden overflow-y-auto max-h-[240px]"
//             style={{
//               background: 'var(--bg-card-solid)',
//               border: '1px solid var(--border)',
//               boxShadow: '0 16px 48px rgba(0,0,0,0.15), 0 4px 16px rgba(0,0,0,0.08)',
//               zIndex: 100,
//             }}>
//             {options.map((opt, i) => (
//               <motion.div key={opt.value} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
//                 onClick={() => { onSelect(opt.value); setOpen(false); }}
//                 className="px-4 py-2.5 sm:py-3 cursor-pointer transition-all font-sans text-[12px] sm:text-[13px]"
//                 style={{
//                   color: opt.value === value ? '#00E59B' : 'var(--text-secondary)',
//                   fontWeight: opt.value === value ? 600 : 500,
//                   borderBottom: i < options.length - 1 ? '1px solid var(--border)' : 'none',
//                 }}
//                 onMouseEnter={e => { e.target.style.background = 'rgba(0,229,155,0.04)'; e.target.style.color = '#00E59B'; }}
//                 onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = opt.value === value ? '#00E59B' : 'var(--text-secondary)'; }}>
//                 {opt.label}
//               </motion.div>
//             ))}
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

// function KpiBar({ value, max, gradient }) {
//   const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
//   return (
//     <div className="w-full h-[5px] rounded-full mt-2 overflow-hidden" style={{ background: 'var(--border)' }}>
//       <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
//         className="h-full rounded-full" style={{ background: gradient }} />
//     </div>
//   );
// }

// function KpiCard({ unitId, type, data, tickets, onRemove }) {
//   const sc = STATUS_COLORS[data.st] || '#888780';
//   const activeTickets = tickets.filter(t => !t.status?.includes('Resolved'));
//   const worstSev = activeTickets.reduce((w, t) => {
//     const order = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
//     const pri = t.severity || t.priority || '';
//     return (order[pri] || 0) > (order[w] || 0) ? pri : w;
//   }, null);

//   const isMelter = type === 'Melters';
//   const isHolder = type === 'Holders';
//   const isPit = type === 'Casting Pits';

//   const tileStyle = { background: 'var(--bg-surface)', border: '1px solid var(--border)', boxShadow: 'inset 0 -3px 8px rgba(0,0,0,0.02), inset 0 2px 0 rgba(255,255,255,0.07), 0 3px 10px rgba(0,0,0,0.02)' };

//   return (
//     <motion.div layout
//       initial={{ opacity: 0, y: 30, scale: 0.92 }}
//       animate={{ opacity: 1, y: 0, scale: 1 }}
//       exit={{ opacity: 0, scale: 0.9, y: 20 }}
//       transition={{ type: 'spring', stiffness: 280, damping: 24 }}
//       className="rounded-[24px] sm:rounded-[28px] overflow-hidden relative group"
//       style={{
//         background: 'var(--bg-card)', backdropFilter: 'blur(24px) saturate(180%)',
//         border: '1px solid var(--border)',
//         boxShadow: '0 12px 40px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.03), inset 0 1px 0 rgba(255,255,255,0.08)',
//       }}
//       whileHover={{ y: -4, boxShadow: '0 20px 60px rgba(0,0,0,0.1), 0 8px 24px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.15)' }}>

//       <div className="h-[4px] w-full" style={{ background: `linear-gradient(90deg, ${sc}, ${sc}80, ${sc})`, backgroundSize: '200% 100%', animation: 'shimmer 3s linear infinite' }} />

//       <div className="p-5 sm:p-6">
//         <div className="flex items-center justify-between mb-4">
//           <div className="flex items-center gap-3 sm:gap-4">
//             <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-[16px] sm:rounded-[18px] flex items-center justify-center font-mono text-[15px] sm:text-[17px] font-extrabold relative overflow-hidden"
//               style={{ background: `linear-gradient(145deg, ${sc}18, ${sc}08)`, color: sc, border: `1.5px solid ${sc}25`, boxShadow: `inset 0 -4px 8px ${sc}08, inset 0 2px 0 rgba(255,255,255,0.12), 0 4px 14px ${sc}15` }}>
//               <div className="absolute top-0 left-0 right-0 h-[50%] rounded-b-full" style={{ background: 'rgba(255,255,255,0.04)' }} />
//               <span className="relative z-10">{unitId}</span>
//             </div>
//             <div className="min-w-0">
//               <h3 className="font-display font-bold text-[15px] sm:text-[17px] truncate" style={{ color: 'var(--text-primary)' }}>{data.nm}</h3>
//               <p className="font-mono text-[9px] sm:text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{data.cx} · {data.cd}</p>
//             </div>
//           </div>
//           <motion.button whileTap={{ scale: 0.8 }} whileHover={{ rotate: 90 }} onClick={onRemove}
//             className="w-8 h-8 sm:w-9 sm:h-9 rounded-[12px] flex items-center justify-center haptic flex-shrink-0"
//             style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
//             <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: 'var(--text-muted)' }} />
//           </motion.button>
//         </div>

//         <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl mb-4 font-mono text-[10px] sm:text-[11px] font-semibold"
//           style={{ background: `${sc}12`, color: sc }}>
//           <span className="w-[7px] h-[7px] rounded-full relative" style={{ background: sc }}>
//             <span className="absolute inset-0 rounded-full animate-ping" style={{ background: sc, opacity: 0.3 }} />
//           </span>
//           {data.st}
//         </div>

//         {isMelter && data.sp >= 0 && (
//           <div className="flex gap-1 mb-4">
//             {CYCLE_STEPS.map((step, i) => (
//               <div key={step} className="flex-1 py-1.5 sm:py-2 rounded-[10px] sm:rounded-[12px] text-center font-mono text-[7px] sm:text-[8px] font-bold uppercase tracking-wider"
//                 style={{
//                   background: i === data.sp ? `${sc}14` : i < data.sp ? 'rgba(29,158,117,0.06)' : 'var(--bg-surface)',
//                   color: i === data.sp ? sc : i < data.sp ? '#0F6E56' : 'var(--text-muted)',
//                   border: `1px solid ${i === data.sp ? `${sc}25` : 'transparent'}`,
//                   boxShadow: i === data.sp ? `0 2px 10px ${sc}12` : 'none',
//                 }}>
//                 {step}
//               </div>
//             ))}
//           </div>
//         )}

//         <div className="grid grid-cols-2 gap-2 sm:gap-[10px] mb-4">
//           <div className="rounded-[16px] sm:rounded-[18px] p-3 sm:p-4 relative overflow-hidden" style={tileStyle}>
//             <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)' }} />
//             <p className="font-mono text-[8px] sm:text-[9px] uppercase tracking-wider font-semibold" style={{ color: 'var(--text-muted)' }}>Bath Temp</p>
//             <p className="font-display font-extrabold text-[20px] sm:text-[24px] mt-1.5 leading-none" style={{ color: 'var(--text-primary)' }}>
//               {data.bt > 0 ? data.bt.toLocaleString() : '—'}<span className="text-[10px] sm:text-[11px] font-normal ml-1" style={{ color: 'var(--text-muted)' }}>°F</span>
//             </p>
//             {data.bt > 0 && <KpiBar value={data.bt} max={1500} gradient="linear-gradient(90deg, #EF9F27, #E24B4A)" />}
//           </div>

//           {(isMelter || isHolder) && (
//             <div className="rounded-[16px] sm:rounded-[18px] p-3 sm:p-4 relative overflow-hidden" style={tileStyle}>
//               <p className="font-mono text-[8px] sm:text-[9px] uppercase tracking-wider font-semibold" style={{ color: 'var(--text-muted)' }}>Flue Temp</p>
//               <p className="font-display font-extrabold text-[20px] sm:text-[24px] mt-1.5 leading-none" style={{ color: 'var(--text-primary)' }}>
//                 {data.ft > 0 ? data.ft.toLocaleString() : '—'}<span className="text-[10px] sm:text-[11px] font-normal ml-1" style={{ color: 'var(--text-muted)' }}>°F</span>
//               </p>
//               {data.ft > 0 && <KpiBar value={data.ft} max={2500} gradient="linear-gradient(90deg, #E24B4A, #F09595)" />}
//             </div>
//           )}

//           {isPit && (
//             <div className="rounded-[16px] sm:rounded-[18px] p-3 sm:p-4" style={tileStyle}>
//               <p className="font-mono text-[8px] sm:text-[9px] uppercase tracking-wider font-semibold" style={{ color: 'var(--text-muted)' }}>Cast No.</p>
//               <p className="font-display font-extrabold text-[16px] sm:text-[18px] mt-1.5" style={{ color: 'var(--text-primary)' }}>{data.cno}</p>
//             </div>
//           )}

//           {isMelter && (
//             <>
//               <div className="rounded-[16px] sm:rounded-[18px] p-3 sm:p-4" style={tileStyle}>
//                 <p className="font-mono text-[8px] sm:text-[9px] uppercase tracking-wider font-semibold" style={{ color: 'var(--text-muted)' }}>Charge Wt</p>
//                 <p className="font-display font-extrabold text-[20px] sm:text-[24px] mt-1.5 leading-none" style={{ color: 'var(--text-primary)' }}>
//                   {data.wt > 0 ? data.wt.toLocaleString() : '—'}<span className="text-[10px] sm:text-[11px] font-normal ml-1" style={{ color: 'var(--text-muted)' }}>lbs</span>
//                 </p>
//               </div>
//               <div className="rounded-[16px] sm:rounded-[18px] p-3 sm:p-4" style={tileStyle}>
//                 <p className="font-mono text-[8px] sm:text-[9px] uppercase tracking-wider font-semibold" style={{ color: 'var(--text-muted)' }}>Charge #</p>
//                 <p className="font-display font-extrabold text-[20px] sm:text-[24px] mt-1.5 leading-none" style={{ color: 'var(--text-primary)' }}>{data.ch}</p>
//               </div>
//               <div className="rounded-[16px] sm:rounded-[18px] p-3 sm:p-4" style={tileStyle}>
//                 <p className="font-mono text-[8px] sm:text-[9px] uppercase tracking-wider font-semibold" style={{ color: 'var(--text-muted)' }}>Cycle Time</p>
//                 <p className="font-display font-extrabold text-[20px] sm:text-[24px] mt-1.5 leading-none" style={{ color: 'var(--text-primary)' }}>
//                   {data.cy}<span className="text-[10px] sm:text-[11px] font-normal ml-1" style={{ color: 'var(--text-muted)' }}>min</span>
//                 </p>
//                 <KpiBar value={data.cy} max={330} gradient="linear-gradient(90deg, #1D9E75, #5DCAA5)" />
//               </div>
//             </>
//           )}

//           {isHolder && (
//             <>
//               <div className="rounded-[16px] sm:rounded-[18px] p-3 sm:p-4" style={tileStyle}>
//                 <p className="font-mono text-[8px] sm:text-[9px] uppercase tracking-wider font-semibold" style={{ color: 'var(--text-muted)' }}>Taps Taken</p>
//                 <p className="font-display font-extrabold text-[20px] sm:text-[24px] mt-1.5 leading-none" style={{ color: 'var(--text-primary)' }}>{data.taps}</p>
//               </div>
//               <div className="col-span-2 rounded-[16px] sm:rounded-[18px] p-3 sm:p-4" style={tileStyle}>
//                 <p className="font-mono text-[8px] sm:text-[9px] uppercase tracking-wider font-semibold" style={{ color: 'var(--text-muted)' }}>Last Tap</p>
//                 <p className="font-mono text-[14px] sm:text-[16px] font-semibold mt-1.5" style={{ color: 'var(--text-primary)' }}>{data.lt}</p>
//               </div>
//             </>
//           )}

//           {isPit && (
//             <>
//               <div className="rounded-[16px] sm:rounded-[18px] p-3 sm:p-4" style={tileStyle}>
//                 <p className="font-mono text-[8px] sm:text-[9px] uppercase tracking-wider font-semibold" style={{ color: 'var(--text-muted)' }}>Cast Speed</p>
//                 <p className="font-display font-extrabold text-[20px] sm:text-[24px] mt-1.5 leading-none" style={{ color: 'var(--text-primary)' }}>
//                   {data.spd}<span className="text-[10px] sm:text-[11px] font-normal ml-1" style={{ color: 'var(--text-muted)' }}>in/min</span>
//                 </p>
//               </div>
//               <div className="rounded-[16px] sm:rounded-[18px] p-3 sm:p-4" style={tileStyle}>
//                 <p className="font-mono text-[8px] sm:text-[9px] uppercase tracking-wider font-semibold" style={{ color: 'var(--text-muted)' }}>Cast Length</p>
//                 <p className="font-display font-extrabold text-[20px] sm:text-[24px] mt-1.5 leading-none" style={{ color: 'var(--text-primary)' }}>
//                   {data.len}<span className="text-[10px] sm:text-[11px] font-normal ml-1" style={{ color: 'var(--text-muted)' }}>in</span>
//                 </p>
//               </div>
//               <div className="rounded-[16px] sm:rounded-[18px] p-3 sm:p-4" style={tileStyle}>
//                 <p className="font-mono text-[8px] sm:text-[9px] uppercase tracking-wider font-semibold" style={{ color: 'var(--text-muted)' }}>Time Left</p>
//                 <p className="font-display font-extrabold text-[20px] sm:text-[24px] mt-1.5 leading-none" style={{ color: data.tleft > 0 ? '#EF9F27' : 'var(--text-primary)' }}>
//                   {data.tleft}<span className="text-[10px] sm:text-[11px] font-normal ml-1" style={{ color: 'var(--text-muted)' }}>min</span>
//                 </p>
//               </div>
//             </>
//           )}

//           <div className="rounded-[16px] sm:rounded-[18px] p-3 sm:p-4" style={tileStyle}>
//             <p className="font-mono text-[8px] sm:text-[9px] uppercase tracking-wider font-semibold" style={{ color: 'var(--text-muted)' }}>Grade</p>
//             <span className="inline-block mt-2 px-3 py-1 rounded-[10px] font-mono text-[13px] sm:text-[15px] font-extrabold"
//               style={{ background: 'rgba(226,75,74,0.08)', color: '#A32D2D' }}>{data.gr}</span>
//           </div>
//         </div>

//         <div className="rounded-[16px] sm:rounded-[18px] p-3 sm:p-4 flex items-center gap-2 sm:gap-3"
//           style={{ background: 'linear-gradient(135deg, var(--bg-surface), var(--bg-card-solid))', border: '1px solid var(--border)' }}>
//           <span className="w-[9px] h-[9px] sm:w-[10px] sm:h-[10px] rounded-full flex-shrink-0 relative" style={{
//             background: activeTickets.length > 0 ? '#EF9F27' : '#1D9E75',
//             boxShadow: `0 0 8px ${activeTickets.length > 0 ? 'rgba(239,159,39,0.4)' : 'rgba(29,158,117,0.3)'}`,
//           }}>
//             {activeTickets.length > 0 && <span className="absolute inset-0 rounded-full animate-ping" style={{ background: '#EF9F27', opacity: 0.3 }} />}
//           </span>
//           <span className="font-mono text-[14px] sm:text-[15px] font-bold" style={{ color: activeTickets.length > 0 ? '#EF9F27' : '#1D9E75' }}>
//             {activeTickets.length}
//           </span>
//           <span className="font-sans text-[11px] sm:text-[12px]" style={{ color: 'var(--text-muted)' }}>active tickets</span>
//           {worstSev && <div className="ml-auto"><SeverityPill level={worstSev} /></div>}
//         </div>
//       </div>
//     </motion.div>
//   );
// }

// export default function PlantOperations() {
//   const [allTickets, setAllTickets] = useState([]);
//   const [section, setSection] = useState(null);
//   const [type, setType] = useState(null);
//   const [selected, setSelected] = useState([]);

//   const fetchData = useCallback(async () => {
//     try { const result = await getAllTicketsWithStats(); setAllTickets(result.all || []); }
//     catch (e) { console.error(e); }
//   }, []);

//   useEffect(() => { fetchData(); const i = setInterval(fetchData, 30000); return () => clearInterval(i); }, [fetchData]);

//   const typeOptions = section === 'Ingot Casting' ? [
//     { value: 'Melters', label: 'Melters' },
//     { value: 'Holders', label: 'Holders' },
//     { value: 'Casting Pits', label: 'Casting Pits' },
//   ] : [];

//   const unitOptions = type && TYPE_DATA[type]
//     ? Object.entries(TYPE_DATA[type]).filter(([k]) => !selected.includes(k)).map(([k, v]) => ({ value: k, label: `${k} — ${v.nm}` }))
//     : [];

//   const addUnit = (unitId) => { if (!selected.includes(unitId)) setSelected(prev => [...prev, unitId]); };
//   const removeUnit = (unitId) => { setSelected(prev => prev.filter(u => u !== unitId)); };

//   return (
//     <div className="w-full max-w-[1200px] mx-auto space-y-4 sm:space-y-5 pb-12" style={{ overflowX: 'hidden' }}>

//       <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
//         <div>
//           <h1 className="font-display font-extrabold text-xl sm:text-2xl md:text-3xl tracking-tight flex flex-wrap items-center gap-2" style={{ color: 'var(--text-primary)' }}>
//             Plant Operations
//             <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full font-mono text-[8px] sm:text-[10px] font-bold uppercase tracking-widest"
//               style={{ background: 'rgba(255,77,106,0.08)', color: '#FF4D6A', border: '1px solid rgba(255,77,106,0.12)' }}>
//               <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full animate-pulse" style={{ background: '#FF4D6A' }} /> LIVE
//             </span>
//           </h1>
//           <p className="font-sans text-[10px] sm:text-xs md:text-sm mt-1 font-light" style={{ color: 'var(--text-muted)' }}>DPW Aluminum — Real-time asset performance</p>
//         </div>
//         <motion.button whileTap={{ scale: 0.95 }} onClick={fetchData}
//           className="haptic flex items-center gap-2 px-3 py-2 rounded-xl glass font-mono text-[10px] sm:text-[11px] font-medium self-start sm:self-auto flex-shrink-0">
//           <RefreshCw className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
//           <span style={{ color: 'var(--text-secondary)' }}>Refresh</span>
//         </motion.button>
//       </div>

//       {/* Selector — HIGH Z-INDEX */}
//       <div className="glass gradient-border rounded-[20px] sm:rounded-[24px] p-4 sm:p-6 relative" style={{ zIndex: 40 }}>
//         <p className="font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.15em] font-semibold mb-3 sm:mb-4" style={{ color: 'var(--text-muted)' }}>Select Equipment</p>

//         <div className="flex flex-wrap gap-2 sm:gap-3 items-start">
//           <Dropdown placeholder="Select plant..." value="DPW Plant"
//             options={[{ value: 'DPW Plant', label: 'DPW Plant' }]} onSelect={() => {}} />
//           <Dropdown placeholder="Select section..." value={section}
//             options={[{ value: 'Ingot Casting', label: 'Ingot Casting' }]}
//             onSelect={(v) => { setSection(v); setType(null); setSelected([]); }} />
//           <Dropdown placeholder="Select type..." value={type} options={typeOptions} disabled={!section}
//             onSelect={(v) => { setType(v); setSelected([]); }} />
//           <Dropdown placeholder={selected.length > 0 ? 'Add more...' : 'Select unit...'} value={null}
//             options={unitOptions} disabled={!type} onSelect={addUnit} />
//         </div>

//         {selected.length > 0 && (
//           <div className="mt-4">
//             <p className="font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.15em] font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>Selected Units</p>
//             <div className="flex flex-wrap gap-2">
//               {selected.map(u => (
//                 <motion.div key={u} layout initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
//                   className="w-12 h-12 sm:w-14 sm:h-14 rounded-[14px] sm:rounded-[16px] flex items-center justify-center font-mono text-[12px] sm:text-[14px] font-bold cursor-pointer relative"
//                   onClick={() => removeUnit(u)}
//                   style={{
//                     background: 'linear-gradient(145deg, rgba(0,229,155,0.1), rgba(0,212,255,0.05))',
//                     color: '#00E59B', border: '2px solid rgba(0,229,155,0.25)',
//                     boxShadow: '0 6px 20px rgba(0,229,155,0.1), inset 0 2px 0 rgba(255,255,255,0.12)',
//                   }}>
//                   {u}
//                   <span className="absolute -top-1 -right-1 w-[14px] h-[14px] rounded-full flex items-center justify-center text-[8px] font-bold"
//                     style={{ background: '#FF4D6A', color: '#fff', boxShadow: '0 2px 6px rgba(255,77,106,0.3)' }}>x</span>
//                 </motion.div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Cards — LOW Z-INDEX */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 relative" style={{ zIndex: 1 }}>
//         <AnimatePresence>
//           {selected.map(unitId => {
//             const d = TYPE_DATA[type]?.[unitId];
//             if (!d) return null;
//             const tickets = matchTickets(allTickets, d.nm);
//             return <KpiCard key={unitId} unitId={unitId} type={type} data={d} tickets={tickets} onRemove={() => removeUnit(unitId)} />;
//           })}
//         </AnimatePresence>
//       </div>

//       {selected.length === 0 && (
//         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 sm:py-20">
//           <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-[22px] mx-auto mb-5 flex items-center justify-center"
//             style={{ background: 'var(--bg-surface)', boxShadow: 'inset 0 -4px 10px rgba(0,0,0,0.03)' }}>
//             <Gauge className="w-8 h-8 sm:w-10 sm:h-10" style={{ color: 'var(--text-muted)', opacity: 0.25 }} />
//           </div>
//           <p className="font-display font-bold text-base sm:text-lg" style={{ color: 'var(--text-secondary)' }}>No units selected</p>
//           <p className="font-sans text-[11px] sm:text-[13px] mt-1 max-w-xs mx-auto" style={{ color: 'var(--text-muted)' }}>
//             Navigate: Plant → Section → Type → Unit
//           </p>
//         </motion.div>
//       )}

//       <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
//     </div>
//   );
// }

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, X, RefreshCw, Gauge, Upload } from 'lucide-react';
import { getAllTicketsWithStats, getAllKPIs, uploadKPIData } from '../services/api';
import SeverityPill from '../components/SeverityPill';

const CYCLE_STEPS = ['Charge','Melt','Skim','Heat','Transfer'];
const STATUS_COLORS = {
  'Heating':'#EF9F27','Melting':'#E24B4A','Drip Time':'#E24B4A','Idle':'#1D9E75',
  'Transferring':'#378ADD','Charging':'#7F77DD','Holding':'#1D9E75','Receiving':'#378ADD',
  'Low Temp':'#E24B4A','Empty':'#888780','Casting':'#E24B4A','Preparing':'#7F77DD','Cooling':'#378ADD',
};
const SHORT_MAP = {
  'Melter-1':'M1','Melter-2':'M2','Melter-3':'M3','Melter-4':'M4','Melter-5':'M5','Melter-6':'M6','Melter-7':'M7','Melter-8':'M8',
  'Holder-1':'H1','Holder-2':'H2','Holder-3':'H3','Holder-4':'H4','Holder-5':'H5','Holder-6':'H6','Holder-7':'H7','Holder-8':'H8',
  'Casting Pit-1':'CP1','Casting Pit-2':'CP2','Casting Pit-3':'CP3','Casting Pit-4':'CP4','Casting Pit-5':'CP5',
};

function matchTickets(allTickets, name) {
  return allTickets.filter(t => {
    const n = (t.asset_name || t.asset || '').toLowerCase().replace(/[\s\-_]+/g, '');
    const target = name.toLowerCase().replace(/[\s\-_]+/g, '');
    return n === target || n.includes(target) || target.includes(n);
  });
}

function Dropdown({ value, placeholder, options, onSelect, disabled }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  return (
    <div ref={ref} className="relative w-full sm:w-auto sm:min-w-[170px]" style={{ zIndex: open ? 100 : 'auto' }}>
      <motion.button whileTap={{ scale: 0.97 }} onClick={() => !disabled && setOpen(!open)}
        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-[14px] sm:rounded-[16px] text-left font-sans text-[12px] sm:text-[13px] font-semibold flex items-center justify-between gap-2 transition-all"
        style={{
          background: value ? 'linear-gradient(135deg, rgba(0,229,155,0.06), rgba(0,212,255,0.03))' : 'var(--bg-surface)',
          color: value ? '#00E59B' : disabled ? 'var(--text-muted)' : 'var(--text-secondary)',
          border: `1.5px solid ${value ? 'rgba(0,229,155,0.2)' : 'var(--border)'}`,
          opacity: disabled ? 0.4 : 1, cursor: disabled ? 'not-allowed' : 'pointer',
          boxShadow: value ? '0 4px 20px rgba(0,229,155,0.08)' : '0 2px 8px rgba(0,0,0,0.03)',
        }}>
        <span className="truncate">{value || placeholder}</span>
        <ChevronDown className={`w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} style={{ color: 'var(--text-muted)' }} />
      </motion.button>
      <AnimatePresence>
        {open && options.length > 0 && (
          <motion.div initial={{ opacity: 0, y: -8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 sm:min-w-[240px] mt-2 rounded-[16px] overflow-hidden overflow-y-auto max-h-[260px]"
            style={{ background: 'var(--bg-card-solid)', border: '1px solid var(--border)', boxShadow: '0 16px 48px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.1)', zIndex: 100 }}>
            {options.map((opt, i) => (
              <motion.div key={opt.value} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                onClick={() => { onSelect(opt.value); setOpen(false); }}
                className="px-4 py-3 cursor-pointer transition-all font-sans text-[12px] sm:text-[13px]"
                style={{ color: 'var(--text-secondary)', fontWeight: 500, borderBottom: i < options.length - 1 ? '1px solid var(--border)' : 'none' }}
                onMouseEnter={e => { e.target.style.background = 'rgba(0,229,155,0.06)'; e.target.style.color = '#00E59B'; }}
                onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = 'var(--text-secondary)'; }}>
                {opt.label}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function KpiBar({ value, max, gradient }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div className="w-full h-[5px] rounded-full mt-2 overflow-hidden" style={{ background: 'var(--border)' }}>
      <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="h-full rounded-full" style={{ background: gradient }} />
    </div>
  );
}

function KpiCard({ unitId, assetType, data, tickets, onRemove }) {
  const sc = STATUS_COLORS[data.status] || '#888780';
  const activeTickets = tickets.filter(t => !t.status?.includes('Resolved'));
  const worstSev = activeTickets.reduce((w, t) => {
    const order = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
    const pri = t.severity || t.priority || '';
    return (order[pri] || 0) > (order[w] || 0) ? pri : w;
  }, null);

  const isMelter = assetType === 'Melter';
  const isHolder = assetType === 'Holder';
  const isPit = assetType === 'Casting Pit';
  const tileStyle = { background: 'var(--bg-surface)', border: '1px solid var(--border)', boxShadow: 'inset 0 -3px 8px rgba(0,0,0,0.02), inset 0 2px 0 rgba(255,255,255,0.07), 0 3px 10px rgba(0,0,0,0.02)' };

  return (
    <motion.div layout initial={{ opacity: 0, y: 30, scale: 0.92 }} animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }} transition={{ type: 'spring', stiffness: 280, damping: 24 }}
      className="rounded-[24px] sm:rounded-[28px] overflow-hidden relative group"
      style={{ background: 'var(--bg-card)', backdropFilter: 'blur(24px) saturate(180%)', border: '1px solid var(--border)',
        boxShadow: '0 12px 40px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.03), inset 0 1px 0 rgba(255,255,255,0.08)' }}
      whileHover={{ y: -4, boxShadow: '0 20px 60px rgba(0,0,0,0.1), 0 8px 24px rgba(0,0,0,0.05)' }}>

      <div className="h-[4px] w-full" style={{ background: `linear-gradient(90deg, ${sc}, ${sc}80, ${sc})`, backgroundSize: '200% 100%', animation: 'shimmer 3s linear infinite' }} />

      <div className="p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-[16px] sm:rounded-[18px] flex items-center justify-center font-mono text-[15px] sm:text-[17px] font-extrabold relative overflow-hidden"
              style={{ background: `linear-gradient(145deg, ${sc}18, ${sc}08)`, color: sc, border: `1.5px solid ${sc}25`,
                boxShadow: `inset 0 -4px 8px ${sc}08, inset 0 2px 0 rgba(255,255,255,0.12), 0 4px 14px ${sc}15` }}>
              <div className="absolute top-0 left-0 right-0 h-[50%] rounded-b-full" style={{ background: 'rgba(255,255,255,0.04)' }} />
              <span className="relative z-10">{unitId}</span>
            </div>
            <div className="min-w-0">
              <h3 className="font-display font-bold text-[15px] sm:text-[17px] truncate" style={{ color: 'var(--text-primary)' }}>{data.asset_name}</h3>
              <p className="font-mono text-[9px] sm:text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{data.complex} · {data.code}</p>
            </div>
          </div>
          <motion.button whileTap={{ scale: 0.8 }} whileHover={{ rotate: 90 }} onClick={onRemove}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-[12px] flex items-center justify-center haptic flex-shrink-0"
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: 'var(--text-muted)' }} />
          </motion.button>
        </div>

        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl mb-4 font-mono text-[10px] sm:text-[11px] font-semibold"
          style={{ background: `${sc}12`, color: sc }}>
          <span className="w-[7px] h-[7px] rounded-full relative" style={{ background: sc }}>
            <span className="absolute inset-0 rounded-full animate-ping" style={{ background: sc, opacity: 0.3 }} />
          </span>
          {data.status}
        </div>

        {isMelter && data.cycle_step != null && data.cycle_step >= 0 && (
          <div className="flex gap-1 mb-4">
            {CYCLE_STEPS.map((step, i) => (
              <div key={step} className="flex-1 py-1.5 sm:py-2 rounded-[10px] sm:rounded-[12px] text-center font-mono text-[7px] sm:text-[8px] font-bold uppercase tracking-wider"
                style={{
                  background: i === data.cycle_step ? `${sc}14` : i < data.cycle_step ? 'rgba(29,158,117,0.06)' : 'var(--bg-surface)',
                  color: i === data.cycle_step ? sc : i < data.cycle_step ? '#0F6E56' : 'var(--text-muted)',
                  border: `1px solid ${i === data.cycle_step ? `${sc}25` : 'transparent'}`,
                  boxShadow: i === data.cycle_step ? `0 2px 10px ${sc}12` : 'none',
                }}>{step}</div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 sm:gap-[10px] mb-4">
          {data.bath_temp != null && (
            <div className="rounded-[16px] sm:rounded-[18px] p-3 sm:p-4 relative overflow-hidden" style={tileStyle}>
              <p className="font-mono text-[8px] sm:text-[9px] uppercase tracking-wider font-semibold" style={{ color: 'var(--text-muted)' }}>Bath Temp</p>
              <p className="font-display font-extrabold text-[20px] sm:text-[24px] mt-1.5 leading-none" style={{ color: 'var(--text-primary)' }}>
                {data.bath_temp > 0 ? data.bath_temp.toLocaleString() : '—'}<span className="text-[10px] sm:text-[11px] font-normal ml-1" style={{ color: 'var(--text-muted)' }}>°F</span>
              </p>
              {data.bath_temp > 0 && <KpiBar value={data.bath_temp} max={1500} gradient="linear-gradient(90deg, #EF9F27, #E24B4A)" />}
            </div>
          )}
          {data.flue_temp != null && (isMelter || isHolder) && (
            <div className="rounded-[16px] sm:rounded-[18px] p-3 sm:p-4" style={tileStyle}>
              <p className="font-mono text-[8px] sm:text-[9px] uppercase tracking-wider font-semibold" style={{ color: 'var(--text-muted)' }}>Flue Temp</p>
              <p className="font-display font-extrabold text-[20px] sm:text-[24px] mt-1.5 leading-none" style={{ color: 'var(--text-primary)' }}>
                {data.flue_temp > 0 ? data.flue_temp.toLocaleString() : '—'}<span className="text-[10px] sm:text-[11px] font-normal ml-1" style={{ color: 'var(--text-muted)' }}>°F</span>
              </p>
              {data.flue_temp > 0 && <KpiBar value={data.flue_temp} max={2500} gradient="linear-gradient(90deg, #E24B4A, #F09595)" />}
            </div>
          )}
          {isPit && data.cast_no && <div className="rounded-[16px] sm:rounded-[18px] p-3 sm:p-4" style={tileStyle}><p className="font-mono text-[8px] sm:text-[9px] uppercase tracking-wider font-semibold" style={{ color: 'var(--text-muted)' }}>Cast No.</p><p className="font-display font-extrabold text-[16px] sm:text-[18px] mt-1.5" style={{ color: 'var(--text-primary)' }}>{data.cast_no}</p></div>}

          {isMelter && (<>
            <div className="rounded-[16px] sm:rounded-[18px] p-3 sm:p-4" style={tileStyle}><p className="font-mono text-[8px] sm:text-[9px] uppercase tracking-wider font-semibold" style={{ color: 'var(--text-muted)' }}>Charge Wt</p><p className="font-display font-extrabold text-[20px] sm:text-[24px] mt-1.5 leading-none" style={{ color: 'var(--text-primary)' }}>{data.charge_weight > 0 ? data.charge_weight.toLocaleString() : '—'}<span className="text-[10px] font-normal ml-1" style={{ color: 'var(--text-muted)' }}>lbs</span></p></div>
            <div className="rounded-[16px] sm:rounded-[18px] p-3 sm:p-4" style={tileStyle}><p className="font-mono text-[8px] sm:text-[9px] uppercase tracking-wider font-semibold" style={{ color: 'var(--text-muted)' }}>Charge #</p><p className="font-display font-extrabold text-[20px] sm:text-[24px] mt-1.5 leading-none" style={{ color: 'var(--text-primary)' }}>{data.charge_no}</p></div>
            <div className="rounded-[16px] sm:rounded-[18px] p-3 sm:p-4" style={tileStyle}><p className="font-mono text-[8px] sm:text-[9px] uppercase tracking-wider font-semibold" style={{ color: 'var(--text-muted)' }}>Cycle Time</p><p className="font-display font-extrabold text-[20px] sm:text-[24px] mt-1.5 leading-none" style={{ color: 'var(--text-primary)' }}>{data.cycle_time}<span className="text-[10px] font-normal ml-1" style={{ color: 'var(--text-muted)' }}>min</span></p><KpiBar value={data.cycle_time} max={data.std_cycle_time || 330} gradient="linear-gradient(90deg, #1D9E75, #5DCAA5)" /></div>
          </>)}
          {isHolder && (<>
            <div className="rounded-[16px] sm:rounded-[18px] p-3 sm:p-4" style={tileStyle}><p className="font-mono text-[8px] sm:text-[9px] uppercase tracking-wider font-semibold" style={{ color: 'var(--text-muted)' }}>Taps Taken</p><p className="font-display font-extrabold text-[20px] sm:text-[24px] mt-1.5 leading-none" style={{ color: 'var(--text-primary)' }}>{data.taps_taken}</p></div>
            <div className="col-span-2 rounded-[16px] sm:rounded-[18px] p-3 sm:p-4" style={tileStyle}><p className="font-mono text-[8px] sm:text-[9px] uppercase tracking-wider font-semibold" style={{ color: 'var(--text-muted)' }}>Last Tap</p><p className="font-mono text-[14px] sm:text-[16px] font-semibold mt-1.5" style={{ color: 'var(--text-primary)' }}>{data.last_tap}</p></div>
          </>)}
          {isPit && (<>
            <div className="rounded-[16px] sm:rounded-[18px] p-3 sm:p-4" style={tileStyle}><p className="font-mono text-[8px] sm:text-[9px] uppercase tracking-wider font-semibold" style={{ color: 'var(--text-muted)' }}>Cast Speed</p><p className="font-display font-extrabold text-[20px] sm:text-[24px] mt-1.5 leading-none" style={{ color: 'var(--text-primary)' }}>{data.cast_speed}<span className="text-[10px] font-normal ml-1" style={{ color: 'var(--text-muted)' }}>in/min</span></p></div>
            <div className="rounded-[16px] sm:rounded-[18px] p-3 sm:p-4" style={tileStyle}><p className="font-mono text-[8px] sm:text-[9px] uppercase tracking-wider font-semibold" style={{ color: 'var(--text-muted)' }}>Cast Length</p><p className="font-display font-extrabold text-[20px] sm:text-[24px] mt-1.5 leading-none" style={{ color: 'var(--text-primary)' }}>{data.cast_length}<span className="text-[10px] font-normal ml-1" style={{ color: 'var(--text-muted)' }}>in</span></p></div>
            <div className="rounded-[16px] sm:rounded-[18px] p-3 sm:p-4" style={tileStyle}><p className="font-mono text-[8px] sm:text-[9px] uppercase tracking-wider font-semibold" style={{ color: 'var(--text-muted)' }}>Time Left</p><p className="font-display font-extrabold text-[20px] sm:text-[24px] mt-1.5 leading-none" style={{ color: data.time_remaining > 0 ? '#EF9F27' : 'var(--text-primary)' }}>{data.time_remaining}<span className="text-[10px] font-normal ml-1" style={{ color: 'var(--text-muted)' }}>min</span></p></div>
          </>)}

          <div className="rounded-[16px] sm:rounded-[18px] p-3 sm:p-4" style={tileStyle}>
            <p className="font-mono text-[8px] sm:text-[9px] uppercase tracking-wider font-semibold" style={{ color: 'var(--text-muted)' }}>Grade</p>
            <span className="inline-block mt-2 px-3 py-1 rounded-[10px] font-mono text-[13px] sm:text-[15px] font-extrabold"
              style={{ background: 'rgba(226,75,74,0.08)', color: '#A32D2D' }}>{data.sample_grade}</span>
          </div>
        </div>

        <div className="rounded-[16px] sm:rounded-[18px] p-3 sm:p-4 flex items-center gap-2 sm:gap-3"
          style={{ background: 'linear-gradient(135deg, var(--bg-surface), var(--bg-card-solid))', border: '1px solid var(--border)' }}>
          <span className="w-[9px] h-[9px] rounded-full flex-shrink-0 relative" style={{
            background: activeTickets.length > 0 ? '#EF9F27' : '#1D9E75',
            boxShadow: `0 0 8px ${activeTickets.length > 0 ? 'rgba(239,159,39,0.4)' : 'rgba(29,158,117,0.3)'}`,
          }}>{activeTickets.length > 0 && <span className="absolute inset-0 rounded-full animate-ping" style={{ background: '#EF9F27', opacity: 0.3 }} />}</span>
          <span className="font-mono text-[14px] sm:text-[15px] font-bold" style={{ color: activeTickets.length > 0 ? '#EF9F27' : '#1D9E75' }}>{activeTickets.length}</span>
          <span className="font-sans text-[11px] sm:text-[12px]" style={{ color: 'var(--text-muted)' }}>active tickets</span>
          {worstSev && <div className="ml-auto"><SeverityPill level={worstSev} /></div>}
        </div>
      </div>
    </motion.div>
  );
}

export default function PlantOperations() {
  const [allTickets, setAllTickets] = useState([]);
  const [kpiData, setKpiData] = useState([]);
  const [section, setSection] = useState(null);
  const [type, setType] = useState(null);
  const [selected, setSelected] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [noData, setNoData] = useState(false);
  const fileRef = useRef(null);

  const fetchData = useCallback(async () => {
    try {
      const [ticketRes, kpiRes] = await Promise.all([getAllTicketsWithStats(), getAllKPIs()]);
      setAllTickets(ticketRes.all || []);
      setKpiData(kpiRes.kpis || []);
      setNoData((kpiRes.kpis || []).length === 0);
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => { fetchData(); const i = setInterval(fetchData, 30000); return () => clearInterval(i); }, [fetchData]);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try { await uploadKPIData(file); await fetchData(); } catch (e) { console.error(e); }
    finally { setUploading(false); if (fileRef.current) fileRef.current.value = ''; }
  };

  // Build type categories from KPI data
  const melters = kpiData.filter(k => k.asset_type === 'Melter');
  const holders = kpiData.filter(k => k.asset_type === 'Holder');
  const pits = kpiData.filter(k => k.asset_type === 'Casting Pit');

  const typeOptions = section === 'Ingot Casting' ? [
    ...(melters.length > 0 ? [{ value: 'Melters', label: `Melters (${melters.length})` }] : []),
    ...(holders.length > 0 ? [{ value: 'Holders', label: `Holders (${holders.length})` }] : []),
    ...(pits.length > 0 ? [{ value: 'Casting Pits', label: `Casting Pits (${pits.length})` }] : []),
  ] : [];

  const getAssetsForType = (t) => {
    if (t === 'Melters') return melters;
    if (t === 'Holders') return holders;
    if (t === 'Casting Pits') return pits;
    return [];
  };

  const currentAssets = getAssetsForType(type);
  const unitOptions = currentAssets
    .filter(k => !selected.includes(k.asset_name))
    .map(k => ({ value: k.asset_name, label: `${SHORT_MAP[k.asset_name] || k.asset_name} — ${k.asset_name}` }));

  const addUnit = (name) => { if (!selected.includes(name)) setSelected(prev => [...prev, name]); };
  const removeUnit = (name) => { setSelected(prev => prev.filter(u => u !== name)); };

  return (
    <div className="w-full max-w-[1200px] mx-auto space-y-4 sm:space-y-5 pb-12" style={{ overflowX: 'hidden' }}>

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <h1 className="font-display font-extrabold text-xl sm:text-2xl md:text-3xl tracking-tight flex flex-wrap items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            Plant Operations
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full font-mono text-[8px] sm:text-[10px] font-bold uppercase tracking-widest"
              style={{ background: 'rgba(255,77,106,0.08)', color: '#FF4D6A', border: '1px solid rgba(255,77,106,0.12)' }}>
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full animate-pulse" style={{ background: '#FF4D6A' }} /> LIVE
            </span>
          </h1>
          <p className="font-sans text-[10px] sm:text-xs md:text-sm mt-1 font-light" style={{ color: 'var(--text-muted)' }}>DPW Aluminum — Real-time asset performance</p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <input type="file" ref={fileRef} accept=".xlsx,.xls" onChange={handleUpload} className="hidden" />
          <motion.button whileTap={{ scale: 0.95 }} onClick={() => fileRef.current?.click()}
            className="haptic flex items-center gap-2 px-3 py-2 rounded-xl glass font-mono text-[10px] sm:text-[11px] font-medium">
            <Upload className="w-3.5 h-3.5" style={{ color: uploading ? '#FFB800' : '#00E59B' }} />
            <span style={{ color: 'var(--text-secondary)' }}>{uploading ? 'Uploading...' : 'Upload KPIs'}</span>
          </motion.button>
          <motion.button whileTap={{ scale: 0.95 }} onClick={fetchData}
            className="haptic flex items-center gap-2 px-3 py-2 rounded-xl glass font-mono text-[10px] sm:text-[11px] font-medium">
            <RefreshCw className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
            <span style={{ color: 'var(--text-secondary)' }}>Refresh</span>
          </motion.button>
        </div>
      </div>

      {/* No data state */}
      {noData && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="glass gradient-border rounded-[20px] p-8 sm:p-12 text-center">
          <Upload className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--text-muted)', opacity: 0.3 }} />
          <p className="font-display font-bold text-base sm:text-lg mb-2" style={{ color: 'var(--text-primary)' }}>No KPI Data</p>
          <p className="font-sans text-[12px] sm:text-[13px] mb-5 max-w-sm mx-auto" style={{ color: 'var(--text-muted)' }}>
            Upload the Asset KPI Excel file to populate plant operational data
          </p>
          <motion.button whileTap={{ scale: 0.95 }} onClick={() => fileRef.current?.click()}
            className="haptic px-6 py-3 rounded-xl font-display text-[12px] font-bold"
            style={{ background: 'var(--gradient-accent)', color: '#04060C' }}>
            Upload KPI Excel
          </motion.button>
        </motion.div>
      )}

      {/* Selector */}
      {!noData && (
        <div className="glass gradient-border rounded-[20px] sm:rounded-[24px] p-4 sm:p-6 relative" style={{ zIndex: 40 }}>
          <p className="font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.15em] font-semibold mb-3 sm:mb-4" style={{ color: 'var(--text-muted)' }}>Select Equipment</p>
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-3 items-start">
            <Dropdown placeholder="Select plant..." value="DPW Plant" options={[{ value: 'DPW Plant', label: 'DPW Plant' }]} onSelect={() => {}} />
            <Dropdown placeholder="Select section..." value={section} options={[{ value: 'Ingot Casting', label: 'Ingot Casting' }]}
              onSelect={(v) => { setSection(v); setType(null); setSelected([]); }} />
            <Dropdown placeholder="Select type..." value={type} options={typeOptions} disabled={!section}
              onSelect={(v) => { setType(v); setSelected([]); }} />
            <Dropdown placeholder={selected.length > 0 ? 'Add more...' : 'Select unit...'} value={null}
              options={unitOptions} disabled={!type} onSelect={addUnit} />
          </div>

          <AnimatePresence>
            {selected.length > 0 && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-4 overflow-hidden">
                <p className="font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.15em] font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>Selected — tap to remove</p>
                <div className="flex flex-wrap gap-2">
                  <AnimatePresence>
                    {selected.map(name => (
                      <motion.div key={name} layout initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-[14px] flex items-center justify-center font-mono text-[11px] sm:text-[13px] font-bold cursor-pointer relative"
                        onClick={() => removeUnit(name)}
                        style={{ background: 'linear-gradient(145deg, rgba(0,229,155,0.1), rgba(0,212,255,0.05))', color: '#00E59B', border: '2px solid rgba(0,229,155,0.25)',
                          boxShadow: '0 6px 20px rgba(0,229,155,0.1), inset 0 2px 0 rgba(255,255,255,0.12)' }}>
                        {SHORT_MAP[name] || name}
                        <span className="absolute -top-1.5 -right-1.5 w-[14px] h-[14px] rounded-full flex items-center justify-center text-[7px] font-bold"
                          style={{ background: '#FF4D6A', color: '#fff', boxShadow: '0 2px 6px rgba(255,77,106,0.3)' }}>x</span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Cards */}
      {!noData && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 relative" style={{ zIndex: 1 }}>
          <AnimatePresence>
            {selected.map(name => {
              const data = kpiData.find(k => k.asset_name === name);
              if (!data) return null;
              const tickets = matchTickets(allTickets, name);
              const unitId = SHORT_MAP[name] || name;
              return <KpiCard key={name} unitId={unitId} assetType={data.asset_type} data={data} tickets={tickets} onRemove={() => removeUnit(name)} />;
            })}
          </AnimatePresence>
        </div>
      )}

      {!noData && selected.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12 sm:py-20">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-[22px] mx-auto mb-5 flex items-center justify-center"
            style={{ background: 'var(--bg-surface)', boxShadow: 'inset 0 -4px 10px rgba(0,0,0,0.03)' }}>
            <Gauge className="w-8 h-8 sm:w-10 sm:h-10" style={{ color: 'var(--text-muted)', opacity: 0.25 }} />
          </div>
          <p className="font-display font-bold text-base sm:text-lg" style={{ color: 'var(--text-secondary)' }}>No units selected</p>
          <p className="font-sans text-[11px] sm:text-[13px] mt-1 max-w-xs mx-auto" style={{ color: 'var(--text-muted)' }}>Navigate: Plant → Section → Type → Unit</p>
        </motion.div>
      )}

      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
    </div>
  );
}