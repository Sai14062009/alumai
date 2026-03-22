// import { useState, useMemo } from 'react';
// import SeverityPill from './SeverityPill';
// import { Search, ChevronLeft, ChevronRight, Zap, Layers, MapPin, User, Calendar, FileText } from 'lucide-react';

// const PAGE_SIZES = [10, 25, 50, 100];

// export default function TicketTable({ tickets, onClassify, onViewReport }) {
//   const [search, setSearch] = useState('');
//   const [sevFilter, setSevFilter] = useState('all');
//   const [statusFilter, setStatusFilter] = useState('all');
//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(25);
//   const [sortBy, setSortBy] = useState('id');
//   const [sortDir, setSortDir] = useState('desc');

//   const filtered = useMemo(() => {
//     let list = [...(tickets || [])];
//     if (search.trim()) {
//       const q = search.toLowerCase();
//       list = list.filter(t =>
//         (t.description || '').toLowerCase().includes(q) ||
//         String(t.id).includes(q) ||
//         (t.asset_name || '').toLowerCase().includes(q) ||
//         (t.location || '').toLowerCase().includes(q) ||
//         (t.reported_by || '').toLowerCase().includes(q)
//       );
//     }
//     if (sevFilter !== 'all') list = list.filter(t => (t.severity || t.priority || '').toLowerCase() === sevFilter);
//     if (statusFilter !== 'all') {
//       if (statusFilter === 'classified') list = list.filter(t => t.is_classified);
//       else if (statusFilter === 'open') list = list.filter(t => t.status === 'Open');
//       else if (statusFilter === 'in progress') list = list.filter(t => t.status === 'In Progress');
//       else if (statusFilter === 'escalated') list = list.filter(t => t.status === 'Escalated');
//       else if (statusFilter === 'resolved') list = list.filter(t => t.status?.includes('Resolved'));
//     }
//     list.sort((a, b) => {
//       let va = a[sortBy], vb = b[sortBy];
//       if (sortBy === 'id') { va = Number(va) || 0; vb = Number(vb) || 0; }
//       if (typeof va === 'string') va = va.toLowerCase();
//       if (typeof vb === 'string') vb = vb.toLowerCase();
//       if (va < vb) return sortDir === 'asc' ? -1 : 1;
//       if (va > vb) return sortDir === 'asc' ? 1 : -1;
//       return 0;
//     });
//     return list;
//   }, [tickets, search, sevFilter, statusFilter, sortBy, sortDir]);

//   const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
//   const safePage = Math.min(page, totalPages);
//   const paginated = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

//   const toggleSort = (col) => {
//     if (sortBy === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
//     else { setSortBy(col); setSortDir('desc'); }
//   };

//   const SortIcon = ({ col }) => (
//     <span className="ml-1 inline-block transition-transform" style={{ color: sortBy === col ? '#00E59B' : 'var(--text-muted)', transform: sortBy === col && sortDir === 'asc' ? 'rotate(180deg)' : '' }}>▾</span>
//   );

//   const statusConfig = {
//     'Open': { color: '#FF4D6A' },
//     'In Progress': { color: '#FFB800' },
//     'Awaiting Parts': { color: '#B18CFF' },
//     'Scheduled': { color: '#00D4FF' },
//     'Resolved': { color: '#FFB800' },
//     'Resolved ✅': { color: '#FFB800' },
//     'Pending Review': { color: '#FFB800' },
//     'Escalated': { color: '#FF4D6A' },
//     'Pending': { color: 'var(--text-muted)' },
//   };

//   const getDisplayStatus = (ticket) => {
//     if (ticket.is_classified && ticket.status === 'Escalated') return 'Escalated';
//     if (ticket.is_classified && (ticket.status === 'Resolved' || ticket.status === 'Resolved ✅')) return 'Pending Review';
//     return ticket.status || 'Open';
//   };

//   if (!tickets || tickets.length === 0) {
//     return (<div className="p-16 text-center glass rounded-3xl" style={{ color: 'var(--text-muted)' }}><Layers className="w-10 h-10 mx-auto mb-4 opacity-30" /><p className="font-sans text-sm">No tickets found.</p></div>);
//   }

//   const stickyLeft = { position: 'sticky', left: 0, zIndex: 2 };
//   const stickyRight = { position: 'sticky', right: 0, zIndex: 2 };

//   return (
//     <div className="space-y-4">
//       {/* Toolbar */}
//       <div className="flex flex-wrap items-center gap-3">
//         <div className="flex-1 min-w-[180px] relative">
//           <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
//           <input type="text" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
//             placeholder="Search tickets, assets, locations..."
//             className="w-full py-2.5 pl-10 pr-4 rounded-xl font-sans text-[13px] outline-none transition-all"
//             style={{ background: 'var(--bg-card-solid)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
//             onFocus={e => e.target.style.borderColor = 'rgba(0,229,155,0.25)'}
//             onBlur={e => e.target.style.borderColor = 'var(--border)'} />
//         </div>
//         <select value={sevFilter} onChange={e => { setSevFilter(e.target.value); setPage(1); }}
//           className="px-3 py-2.5 rounded-xl font-mono text-[11px] outline-none cursor-pointer"
//           style={{ background: 'var(--bg-card-solid)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
//           <option value="all">All Priority</option>
//           <option value="critical">Critical</option>
//           <option value="high">High</option>
//           <option value="medium">Medium</option>
//           <option value="low">Low</option>
//         </select>
//         <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
//           className="px-3 py-2.5 rounded-xl font-mono text-[11px] outline-none cursor-pointer"
//           style={{ background: 'var(--bg-card-solid)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
//           <option value="all">All Status</option>
//           <option value="open">Open</option>
//           <option value="in progress">In Progress</option>
//           <option value="classified">Classified</option>
//           <option value="escalated">Escalated</option>
//           <option value="resolved">Resolved</option>
//         </select>
//         <span className="font-mono text-[11px] px-3 py-2.5 rounded-xl" style={{ background: 'var(--bg-surface)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
//           {filtered.length} results
//         </span>
//       </div>

//       {/* Table */}
//       <div className="glass gradient-border rounded-3xl overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full text-left" style={{ minWidth: '900px' }}>
//             <thead>
//               <tr style={{ borderBottom: '1px solid var(--border)' }}>
//                 <th onClick={() => toggleSort('id')} className="px-4 py-3.5 font-mono text-[9px] font-semibold uppercase tracking-[0.15em] cursor-pointer select-none whitespace-nowrap" style={{ ...stickyLeft, color: 'var(--text-muted)', background: 'var(--bg-card-solid)' }}>ID<SortIcon col="id" /></th>
//                 <th className="px-4 py-3.5 font-mono text-[9px] font-semibold uppercase tracking-[0.15em] whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>Source</th>
//                 <th onClick={() => toggleSort('severity')} className="px-4 py-3.5 font-mono text-[9px] font-semibold uppercase tracking-[0.15em] cursor-pointer select-none whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>Priority<SortIcon col="severity" /></th>
//                 <th className="px-4 py-3.5 font-mono text-[9px] font-semibold uppercase tracking-[0.15em] whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>Asset</th>
//                 <th className="px-4 py-3.5 font-mono text-[9px] font-semibold uppercase tracking-[0.15em] whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>Location</th>
//                 <th className="px-4 py-3.5 font-mono text-[9px] font-semibold uppercase tracking-[0.15em] whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>Description</th>
//                 <th className="px-4 py-3.5 font-mono text-[9px] font-semibold uppercase tracking-[0.15em] whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>Reported</th>
//                 <th onClick={() => toggleSort('created_at')} className="px-4 py-3.5 font-mono text-[9px] font-semibold uppercase tracking-[0.15em] cursor-pointer select-none whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>Date<SortIcon col="created_at" /></th>
//                 <th onClick={() => toggleSort('status')} className="px-4 py-3.5 font-mono text-[9px] font-semibold uppercase tracking-[0.15em] cursor-pointer select-none whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>Status<SortIcon col="status" /></th>
//                 <th className="px-4 py-3.5 font-mono text-[9px] font-semibold uppercase tracking-[0.15em] text-center whitespace-nowrap" style={{ ...stickyRight, color: 'var(--text-muted)', background: 'var(--bg-card-solid)' }}>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {paginated.map((ticket, idx) => {
//                 const desc = ticket.description || "";
//                 const isClassified = ticket.is_classified;
//                 const displayStatus = getDisplayStatus(ticket);
//                 const sc = statusConfig[displayStatus] || statusConfig['Pending'];
//                 const sourceColors = { servicenow: '#62D4A3', teams: '#7B83EB', outlook: '#4FC3F7' };
//                 const srcColor = sourceColors[ticket.source?.toLowerCase()] || 'var(--text-secondary)';

//                 return (
//                   <tr key={ticket.id || idx}
//                     className="group transition-colors duration-150 relative hover:bg-[var(--bg-card-hover)]"
//                     style={{ borderBottom: '1px solid var(--border)' }}>

//                     <td className="px-4 py-3.5 font-mono text-[12px] font-bold whitespace-nowrap" style={{ ...stickyLeft, color: '#00E59B', background: 'var(--bg-card-solid)' }}>
//                       <div className="flex items-center gap-2">
//                         <span className="w-[2px] h-5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: '#00E59B' }} />
//                         #{ticket.id}
//                       </div>
//                     </td>

//                     <td className="px-4 py-3.5 whitespace-nowrap">
//                       <span className="font-sans text-[10px] font-semibold capitalize px-2 py-1 rounded-lg"
//                         style={{ background: `${srcColor}10`, color: srcColor, border: `1px solid ${srcColor}15` }}>
//                         {ticket.source}
//                       </span>
//                     </td>

//                     <td className="px-4 py-3.5 whitespace-nowrap">
//                       {(ticket.severity || ticket.priority) ? <SeverityPill level={ticket.severity || ticket.priority} /> : <span className="font-mono text-[10px]" style={{ color: 'var(--text-muted)' }}>—</span>}
//                     </td>

//                     <td className="px-4 py-3.5 whitespace-nowrap">
//                       <span className="font-mono text-[11px] font-medium" style={{ color: 'var(--text-primary)' }}>
//                         {ticket.asset_name || ticket.asset || '—'}
//                       </span>
//                     </td>

//                     <td className="px-4 py-3.5 whitespace-nowrap">
//                       <div className="flex items-center gap-1.5 max-w-[150px]">
//                         <MapPin className="w-3 h-3 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
//                         <span className="font-sans text-[11px] truncate" style={{ color: 'var(--text-secondary)' }}>
//                           {ticket.location || '—'}
//                         </span>
//                       </div>
//                     </td>

//                     <td className="px-4 py-3.5" style={{ maxWidth: '220px' }}>
//                       <span className="font-sans text-[11px] line-clamp-2" style={{ color: 'var(--text-secondary)' }} title={desc}>
//                         {desc.length > 60 ? desc.substring(0, 60) + '...' : desc}
//                       </span>
//                     </td>

//                     <td className="px-4 py-3.5 whitespace-nowrap">
//                       <div className="flex items-center gap-1.5">
//                         <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
//                           <User className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
//                         </div>
//                         <span className="font-sans text-[11px] truncate max-w-[90px]" style={{ color: 'var(--text-secondary)' }}>
//                           {ticket.reported_by || '—'}
//                         </span>
//                       </div>
//                     </td>

//                     <td className="px-4 py-3.5 whitespace-nowrap">
//                       <div className="flex items-center gap-1.5">
//                         <Calendar className="w-3 h-3 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
//                         <span className="font-mono text-[10px]" style={{ color: 'var(--text-muted)' }}>
//                           {ticket.created_at || '—'}
//                         </span>
//                       </div>
//                     </td>

//                     <td className="px-4 py-3.5 whitespace-nowrap">
//                       <div className="flex items-center gap-1.5">
//                         <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: sc.color }} />
//                         <span className="font-mono text-[10px] font-semibold uppercase" style={{ color: sc.color }}>
//                           {displayStatus}
//                         </span>
//                       </div>
//                     </td>

//                     {/* Sticky right — Action */}
//                     <td className="px-4 py-3.5 text-center whitespace-nowrap" style={{ ...stickyRight, background: 'var(--bg-card-solid)' }}>
//                       <div className="absolute left-0 top-0 bottom-0 w-6 pointer-events-none" style={{ background: 'linear-gradient(90deg, var(--bg-card-solid)00, var(--bg-card-solid))' }} />

//                       {isClassified ? (
//                         ticket.status === 'Escalated' ? (
//                           <div className="inline-flex items-center gap-1.5">
//                             <span className="font-mono text-[10px] px-2.5 py-1.5 rounded-lg inline-flex items-center gap-1"
//                               style={{ background: 'rgba(255,77,106,0.08)', color: '#FF4D6A', border: '1px solid rgba(255,77,106,0.12)' }}>
//                               ⚠ Escalated
//                             </span>
//                             {ticket.rca_analysis && (
//                               <button onClick={() => onViewReport && onViewReport(ticket)}
//                                 className="haptic px-2.5 py-1.5 rounded-lg font-mono text-[10px] font-bold inline-flex items-center gap-1 transition-all active:scale-95"
//                                 style={{ background: 'rgba(0,212,255,0.08)', color: '#00D4FF', border: '1px solid rgba(0,212,255,0.12)' }}>
//                                 <FileText className="w-3 h-3" /> Report
//                               </button>
//                             )}
//                           </div>
//                         ) : (
//                           <div className="inline-flex items-center gap-1.5">
//                             <span className="font-mono text-[10px] px-2.5 py-1.5 rounded-lg inline-flex items-center gap-1"
//                               style={{ background: 'rgba(0,229,155,0.06)', color: '#00E59B' }}>
//                               ✓ Done
//                             </span>
//                             <button onClick={() => onViewReport && onViewReport(ticket)}
//                               className="haptic px-2.5 py-1.5 rounded-lg font-mono text-[10px] font-bold inline-flex items-center gap-1 transition-all active:scale-95"
//                               style={{ background: 'rgba(0,212,255,0.08)', color: '#00D4FF', border: '1px solid rgba(0,212,255,0.12)' }}>
//                               <FileText className="w-3 h-3" /> Report
//                             </button>
//                           </div>
//                         )
//                       ) : (
//                         <button onClick={() => onClassify(ticket)}
//                           className="haptic px-3.5 py-1.5 rounded-xl font-display text-[10px] font-bold inline-flex items-center gap-1.5 transition-transform active:scale-95"
//                           style={{ background: 'linear-gradient(135deg, #00E59B, #00D4FF)', color: '#04060C' }}>
//                           <Zap className="w-3 h-3" /> RCA
//                         </button>
//                       )}
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination */}
//         <div className="px-5 py-4 flex flex-wrap items-center justify-between gap-3" style={{ borderTop: '1px solid var(--border)' }}>
//           <div className="flex items-center gap-2">
//             <span className="font-mono text-[10px]" style={{ color: 'var(--text-muted)' }}>Rows:</span>
//             <select value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}
//               className="px-2 py-1 rounded-lg font-mono text-[11px] outline-none cursor-pointer"
//               style={{ background: 'var(--bg-surface)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
//               {PAGE_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
//             </select>
//           </div>
//           <div className="flex items-center gap-1">
//             <span className="font-mono text-[10px] mr-3" style={{ color: 'var(--text-muted)' }}>
//               {(safePage - 1) * pageSize + 1}–{Math.min(safePage * pageSize, filtered.length)} of {filtered.length}
//             </span>
//             <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={safePage <= 1}
//               className="w-8 h-8 rounded-lg flex items-center justify-center disabled:opacity-20 transition-colors haptic"
//               style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
//               <ChevronLeft className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
//             </button>
//             {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//               let pn;
//               if (totalPages <= 5) pn = i + 1;
//               else if (safePage <= 3) pn = i + 1;
//               else if (safePage >= totalPages - 2) pn = totalPages - 4 + i;
//               else pn = safePage - 2 + i;
//               return (
//                 <button key={pn} onClick={() => setPage(pn)}
//                   className="w-8 h-8 rounded-lg flex items-center justify-center font-mono text-[11px] font-semibold transition-all haptic"
//                   style={{
//                     background: safePage === pn ? 'rgba(0,229,155,0.12)' : 'transparent',
//                     color: safePage === pn ? '#00E59B' : 'var(--text-muted)',
//                     border: safePage === pn ? '1px solid rgba(0,229,155,0.15)' : '1px solid transparent',
//                   }}>{pn}</button>
//               );
//             })}
//             <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={safePage >= totalPages}
//               className="w-8 h-8 rounded-lg flex items-center justify-center disabled:opacity-20 transition-colors haptic"
//               style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
//               <ChevronRight className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import SeverityPill from './SeverityPill';
import { Search, ChevronLeft, ChevronRight, Zap, Layers, MapPin, User, Calendar, FileText } from 'lucide-react';

const PAGE_SIZES = [10, 25, 50, 100];

export default function TicketTable({ tickets, onClassify, onViewReport }) {
  const [search, setSearch] = useState('');
  const [sevFilter, setSevFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [sortBy, setSortBy] = useState('id');
  const [sortDir, setSortDir] = useState('desc');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const filtered = useMemo(() => {
    let list = [...(tickets || [])];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(t =>
        (t.description || '').toLowerCase().includes(q) ||
        String(t.id).includes(q) ||
        (t.asset_name || '').toLowerCase().includes(q) ||
        (t.location || '').toLowerCase().includes(q) ||
        (t.reported_by || '').toLowerCase().includes(q)
      );
    }
    if (sevFilter !== 'all') list = list.filter(t => (t.severity || t.priority || '').toLowerCase() === sevFilter);
    if (statusFilter !== 'all') {
      if (statusFilter === 'classified') list = list.filter(t => t.is_classified);
      else if (statusFilter === 'open') list = list.filter(t => t.status === 'Open');
      else if (statusFilter === 'in progress') list = list.filter(t => t.status === 'In Progress');
      else if (statusFilter === 'escalated') list = list.filter(t => t.status === 'Escalated');
      else if (statusFilter === 'resolved') list = list.filter(t => t.status?.includes('Resolved'));
    }
    list.sort((a, b) => {
      let va = a[sortBy], vb = b[sortBy];
      if (sortBy === 'id') { va = Number(va) || 0; vb = Number(vb) || 0; }
      if (typeof va === 'string') va = va.toLowerCase();
      if (typeof vb === 'string') vb = vb.toLowerCase();
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return list;
  }, [tickets, search, sevFilter, statusFilter, sortBy, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const toggleSort = (col) => {
    if (sortBy === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(col); setSortDir('desc'); }
  };

  const SortIcon = ({ col }) => (
    <span className="ml-1 inline-block transition-transform" style={{ color: sortBy === col ? '#00E59B' : 'var(--text-muted)', transform: sortBy === col && sortDir === 'asc' ? 'rotate(180deg)' : '' }}>▾</span>
  );

  const statusConfig = {
    'Open': { color: '#FF4D6A' },
    'In Progress': { color: '#FFB800' },
    'Awaiting Parts': { color: '#B18CFF' },
    'Scheduled': { color: '#00D4FF' },
    'Resolved': { color: '#FFB800' },
    'Resolved ✅': { color: '#FFB800' },
    'Pending Review': { color: '#FFB800' },
    'Escalated': { color: '#FF4D6A' },
    'Pending': { color: 'var(--text-muted)' },
  };

  const getDisplayStatus = (ticket) => {
    if (ticket.is_classified && ticket.status === 'Escalated') return 'Escalated';
    if (ticket.is_classified && (ticket.status === 'Resolved' || ticket.status === 'Resolved ✅')) return 'Pending Review';
    return ticket.status || 'Open';
  };

  const sourceColors = { servicenow: '#62D4A3', teams: '#7B83EB', outlook: '#4FC3F7' };

  if (!tickets || tickets.length === 0) {
    return (<div className="p-16 text-center glass rounded-3xl" style={{ color: 'var(--text-muted)' }}><Layers className="w-10 h-10 mx-auto mb-4 opacity-30" /><p className="font-sans text-sm">No tickets found.</p></div>);
  }

  const stickyLeft = { position: 'sticky', left: 0, zIndex: 2 };
  const stickyRight = { position: 'sticky', right: 0, zIndex: 2 };

  const ActionButton = ({ ticket }) => {
    const isClassified = ticket.is_classified;
    if (isClassified && ticket.status === 'Escalated') {
      return (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-[10px] px-2.5 py-1.5 rounded-lg inline-flex items-center gap-1"
            style={{ background: 'rgba(255,77,106,0.08)', color: '#FF4D6A', border: '1px solid rgba(255,77,106,0.12)' }}>
            ⚠ Escalated
          </span>
          {ticket.rca_analysis && (
            <button onClick={() => onViewReport && onViewReport(ticket)}
              className="haptic px-2.5 py-1.5 rounded-lg font-mono text-[10px] font-bold inline-flex items-center gap-1 active:scale-95"
              style={{ background: 'rgba(0,212,255,0.08)', color: '#00D4FF', border: '1px solid rgba(0,212,255,0.12)' }}>
              <FileText className="w-3 h-3" /> Report
            </button>
          )}
        </div>
      );
    }
    if (isClassified) {
      return (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-[10px] px-2.5 py-1.5 rounded-lg inline-flex items-center gap-1"
            style={{ background: 'rgba(0,229,155,0.06)', color: '#00E59B' }}>
            ✓ Done
          </span>
          <button onClick={() => onViewReport && onViewReport(ticket)}
            className="haptic px-2.5 py-1.5 rounded-lg font-mono text-[10px] font-bold inline-flex items-center gap-1 active:scale-95"
            style={{ background: 'rgba(0,212,255,0.08)', color: '#00D4FF', border: '1px solid rgba(0,212,255,0.12)' }}>
            <FileText className="w-3 h-3" /> Report
          </button>
        </div>
      );
    }
    return (
      <button onClick={() => onClassify(ticket)}
        className="haptic px-4 py-2 rounded-xl font-display text-[11px] font-bold inline-flex items-center gap-1.5 active:scale-95"
        style={{ background: 'linear-gradient(135deg, #00E59B, #00D4FF)', color: '#04060C' }}>
        <Zap className="w-3.5 h-3.5" /> Run RCA
      </button>
    );
  };

  // ═══════════════════════════════════════
  // PAGINATION (shared)
  // ═══════════════════════════════════════
  const Pagination = () => (
    <div className="px-4 sm:px-5 py-3 sm:py-4 flex flex-wrap items-center justify-between gap-3" style={{ borderTop: '1px solid var(--border)' }}>
      <div className="flex items-center gap-2">
        <span className="font-mono text-[10px]" style={{ color: 'var(--text-muted)' }}>Rows:</span>
        <select value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}
          className="px-2 py-1 rounded-lg font-mono text-[11px] outline-none cursor-pointer"
          style={{ background: 'var(--bg-surface)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
          {PAGE_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div className="flex items-center gap-1">
        <span className="font-mono text-[10px] mr-2 sm:mr-3" style={{ color: 'var(--text-muted)' }}>
          {(safePage - 1) * pageSize + 1}–{Math.min(safePage * pageSize, filtered.length)} of {filtered.length}
        </span>
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={safePage <= 1}
          className="w-8 h-8 rounded-lg flex items-center justify-center disabled:opacity-20 haptic"
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
          <ChevronLeft className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
        </button>
        {!isMobile && Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          let pn;
          if (totalPages <= 5) pn = i + 1;
          else if (safePage <= 3) pn = i + 1;
          else if (safePage >= totalPages - 2) pn = totalPages - 4 + i;
          else pn = safePage - 2 + i;
          return (
            <button key={pn} onClick={() => setPage(pn)}
              className="w-8 h-8 rounded-lg flex items-center justify-center font-mono text-[11px] font-semibold haptic"
              style={{
                background: safePage === pn ? 'rgba(0,229,155,0.12)' : 'transparent',
                color: safePage === pn ? '#00E59B' : 'var(--text-muted)',
                border: safePage === pn ? '1px solid rgba(0,229,155,0.15)' : '1px solid transparent',
              }}>{pn}</button>
          );
        })}
        {isMobile && (
          <span className="font-mono text-[11px] px-2" style={{ color: 'var(--text-muted)' }}>{safePage}/{totalPages}</span>
        )}
        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={safePage >= totalPages}
          className="w-8 h-8 rounded-lg flex items-center justify-center disabled:opacity-20 haptic"
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
          <ChevronRight className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 sm:gap-3">
        <div className="flex-1 min-w-0 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
          <input type="text" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search tickets..."
            className="w-full py-2.5 pl-10 pr-4 rounded-xl font-sans text-[13px] outline-none transition-all"
            style={{ background: 'var(--bg-card-solid)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
            onFocus={e => e.target.style.borderColor = 'rgba(0,229,155,0.25)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'} />
        </div>
        <div className="flex gap-2">
          <select value={sevFilter} onChange={e => { setSevFilter(e.target.value); setPage(1); }}
            className="flex-1 sm:flex-none px-3 py-2.5 rounded-xl font-mono text-[11px] outline-none cursor-pointer"
            style={{ background: 'var(--bg-card-solid)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
            <option value="all">All Priority</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            className="flex-1 sm:flex-none px-3 py-2.5 rounded-xl font-mono text-[11px] outline-none cursor-pointer"
            style={{ background: 'var(--bg-card-solid)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in progress">In Progress</option>
            <option value="classified">Classified</option>
            <option value="escalated">Escalated</option>
            <option value="resolved">Resolved</option>
          </select>
          <span className="hidden sm:flex font-mono text-[11px] px-3 py-2.5 rounded-xl items-center" style={{ background: 'var(--bg-surface)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
            {filtered.length}
          </span>
        </div>
      </div>

      <div className="glass gradient-border rounded-2xl sm:rounded-3xl overflow-hidden">

        {/* ═══ MOBILE: Card View ═══ */}
        {isMobile ? (
          <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
            {paginated.map((ticket, idx) => {
              const displayStatus = getDisplayStatus(ticket);
              const sc = statusConfig[displayStatus] || statusConfig['Pending'];
              const srcColor = sourceColors[ticket.source?.toLowerCase()] || 'var(--text-secondary)';
              const desc = ticket.description || '';

              return (
                <motion.div key={ticket.id || idx}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.03 }}
                  className="p-4 space-y-3"
                  style={{ borderBottom: '1px solid var(--border)' }}>

                  {/* Row 1: ID + Source + Priority + Status */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[13px] font-bold" style={{ color: '#00E59B' }}>#{ticket.id}</span>
                      <span className="font-sans text-[9px] font-semibold capitalize px-2 py-0.5 rounded-md"
                        style={{ background: `${srcColor}10`, color: srcColor, border: `1px solid ${srcColor}15` }}>
                        {ticket.source}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {(ticket.severity || ticket.priority) && <SeverityPill level={ticket.severity || ticket.priority} />}
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: sc.color }} />
                        <span className="font-mono text-[9px] font-semibold uppercase" style={{ color: sc.color }}>{displayStatus}</span>
                      </div>
                    </div>
                  </div>

                  {/* Row 2: Asset + Location */}
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[12px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {ticket.asset_name || ticket.asset || '—'}
                    </span>
                    {ticket.location && (
                      <div className="flex items-center gap-1 min-w-0">
                        <MapPin className="w-3 h-3 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
                        <span className="font-sans text-[10px] truncate" style={{ color: 'var(--text-muted)' }}>{ticket.location}</span>
                      </div>
                    )}
                  </div>

                  {/* Row 3: Description */}
                  <p className="font-sans text-[11px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {desc.length > 120 ? desc.substring(0, 120) + '...' : desc}
                  </p>

                  {/* Row 4: Reporter + Date + Action */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-3">
                      {ticket.reported_by && (
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
                          <span className="font-sans text-[10px]" style={{ color: 'var(--text-muted)' }}>{ticket.reported_by}</span>
                        </div>
                      )}
                      {ticket.created_at && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
                          <span className="font-mono text-[9px]" style={{ color: 'var(--text-muted)' }}>{ticket.created_at}</span>
                        </div>
                      )}
                    </div>
                    <ActionButton ticket={ticket} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          /* ═══ DESKTOP: Table View ═══ */
          <div className="overflow-x-auto">
            <table className="w-full text-left" style={{ minWidth: '900px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <th onClick={() => toggleSort('id')} className="px-4 py-3.5 font-mono text-[9px] font-semibold uppercase tracking-[0.15em] cursor-pointer select-none whitespace-nowrap" style={{ ...stickyLeft, color: 'var(--text-muted)', background: 'var(--bg-card-solid)' }}>ID<SortIcon col="id" /></th>
                  <th className="px-4 py-3.5 font-mono text-[9px] font-semibold uppercase tracking-[0.15em] whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>Source</th>
                  <th onClick={() => toggleSort('severity')} className="px-4 py-3.5 font-mono text-[9px] font-semibold uppercase tracking-[0.15em] cursor-pointer select-none whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>Priority<SortIcon col="severity" /></th>
                  <th className="px-4 py-3.5 font-mono text-[9px] font-semibold uppercase tracking-[0.15em] whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>Asset</th>
                  <th className="px-4 py-3.5 font-mono text-[9px] font-semibold uppercase tracking-[0.15em] whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>Location</th>
                  <th className="px-4 py-3.5 font-mono text-[9px] font-semibold uppercase tracking-[0.15em] whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>Description</th>
                  <th className="px-4 py-3.5 font-mono text-[9px] font-semibold uppercase tracking-[0.15em] whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>Reported</th>
                  <th onClick={() => toggleSort('created_at')} className="px-4 py-3.5 font-mono text-[9px] font-semibold uppercase tracking-[0.15em] cursor-pointer select-none whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>Date<SortIcon col="created_at" /></th>
                  <th onClick={() => toggleSort('status')} className="px-4 py-3.5 font-mono text-[9px] font-semibold uppercase tracking-[0.15em] cursor-pointer select-none whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>Status<SortIcon col="status" /></th>
                  <th className="px-4 py-3.5 font-mono text-[9px] font-semibold uppercase tracking-[0.15em] text-center whitespace-nowrap" style={{ ...stickyRight, color: 'var(--text-muted)', background: 'var(--bg-card-solid)' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((ticket, idx) => {
                  const desc = ticket.description || "";
                  const displayStatus = getDisplayStatus(ticket);
                  const sc = statusConfig[displayStatus] || statusConfig['Pending'];
                  const srcColor = sourceColors[ticket.source?.toLowerCase()] || 'var(--text-secondary)';

                  return (
                    <tr key={ticket.id || idx} className="group transition-colors duration-150 hover:bg-[var(--bg-card-hover)]" style={{ borderBottom: '1px solid var(--border)' }}>
                      <td className="px-4 py-3.5 font-mono text-[12px] font-bold whitespace-nowrap" style={{ ...stickyLeft, color: '#00E59B', background: 'var(--bg-card-solid)' }}>
                        <div className="flex items-center gap-2">
                          <span className="w-[2px] h-5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: '#00E59B' }} />
                          #{ticket.id}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="font-sans text-[10px] font-semibold capitalize px-2 py-1 rounded-lg"
                          style={{ background: `${srcColor}10`, color: srcColor, border: `1px solid ${srcColor}15` }}>
                          {ticket.source}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {(ticket.severity || ticket.priority) ? <SeverityPill level={ticket.severity || ticket.priority} /> : <span className="font-mono text-[10px]" style={{ color: 'var(--text-muted)' }}>—</span>}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="font-mono text-[11px] font-medium" style={{ color: 'var(--text-primary)' }}>{ticket.asset_name || ticket.asset || '—'}</span>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 max-w-[150px]">
                          <MapPin className="w-3 h-3 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
                          <span className="font-sans text-[11px] truncate" style={{ color: 'var(--text-secondary)' }}>{ticket.location || '—'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5" style={{ maxWidth: '220px' }}>
                        <span className="font-sans text-[11px] line-clamp-2" style={{ color: 'var(--text-secondary)' }} title={desc}>
                          {desc.length > 60 ? desc.substring(0, 60) + '...' : desc}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                            <User className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
                          </div>
                          <span className="font-sans text-[11px] truncate max-w-[90px]" style={{ color: 'var(--text-secondary)' }}>{ticket.reported_by || '—'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3 h-3 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
                          <span className="font-mono text-[10px]" style={{ color: 'var(--text-muted)' }}>{ticket.created_at || '—'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: sc.color }} />
                          <span className="font-mono text-[10px] font-semibold uppercase" style={{ color: sc.color }}>{displayStatus}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-center whitespace-nowrap" style={{ ...stickyRight, background: 'var(--bg-card-solid)' }}>
                        <ActionButton ticket={ticket} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <Pagination />
      </div>
    </div>
  );
}