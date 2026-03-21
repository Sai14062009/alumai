// import { useState, useEffect, useCallback } from 'react';
// import { motion } from 'framer-motion';
// import { ArrowLeft, RefreshCw } from 'lucide-react';
// import TicketTable from '../components/TicketTable';
// import { getTickets } from '../services/api';

// export default function DataView({ source, onBack, onClassify }) {
//   const [tickets, setTickets] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const fetchTickets = useCallback(async () => {
//     setLoading(true); setError(null);
//     try { const r = await getTickets(source); setTickets(r.data || []); }
//     catch (err) { setError(err.message || "Failed."); setTickets([]); }
//     finally { setLoading(false); }
//   }, [source]);

//   useEffect(() => { if (source) fetchTickets(); }, [source, fetchTickets]);

//   const handleClassify = (ticket) => {
//     onClassify(ticket);
//     // Re-fetch after a delay to let classification complete
//     // The Jarvis overlay takes ~5-15 seconds, so we poll
//     const poll = setInterval(async () => {
//       try {
//         const r = await getTickets(source);
//         const updated = r.data || [];
//         const classified = updated.find(t => t.id === ticket.id);
//         if (classified && classified.is_classified) {
//           setTickets(updated);
//           clearInterval(poll);
//         }
//       } catch {}
//     }, 3000);
//     // Stop polling after 60 seconds max
//     setTimeout(() => clearInterval(poll), 60000);
//   };

//   const name = source === 'servicenow' ? 'ServiceNow' : source === 'teams' ? 'Microsoft Teams' : source === 'outlook' ? 'Outlook' : source;

//   return (
//     <div className="w-full max-w-[1200px] mx-auto space-y-6 pb-12">
//       <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
//         <div>
//           <motion.button whileTap={{ scale: 0.95 }} onClick={onBack}
//             className="haptic flex items-center gap-1.5 font-mono text-[12px] font-semibold mb-4" style={{ color: '#00E59B' }}>
//             <ArrowLeft className="w-4 h-4" /> Back to Triage
//           </motion.button>
//           <div className="flex items-center gap-3">
//             <h1 className="font-display font-extrabold text-3xl tracking-tight" style={{ color: 'var(--text-primary)' }}>{name}</h1>
//             <span className="font-mono text-[11px] px-3 py-1 rounded-full" style={{ background: 'var(--bg-surface)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
//               {tickets.length} records
//             </span>
//           </div>
//         </div>
//         <motion.button whileTap={{ scale: 0.95 }} onClick={fetchTickets}
//           className="haptic flex items-center gap-2 px-4 py-2.5 rounded-xl glass font-mono text-[11px] font-medium">
//           <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} style={{ color: 'var(--text-muted)' }} />
//           <span style={{ color: 'var(--text-secondary)' }}>Refresh</span>
//         </motion.button>
//       </div>

//       {error && (
//         <div className="rounded-2xl p-4 font-sans text-sm" style={{ background: 'rgba(255,77,106,0.06)', color: '#FF4D6A', border: '1px solid rgba(255,77,106,0.12)' }}>{error}</div>
//       )}

//       {loading ? (
//         <div className="w-full h-64 flex flex-col items-center justify-center glass rounded-3xl">
//           <RefreshCw className="w-6 h-6 animate-spin mb-4" style={{ color: '#00E59B' }} />
//           <p className="font-sans text-sm" style={{ color: 'var(--text-muted)' }}>Loading tickets...</p>
//         </div>
//       ) : (
//         <TicketTable tickets={tickets} onClassify={handleClassify} />
//       )}
//     </div>
//   );
// }

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import TicketTable from '../components/TicketTable';
import { getTickets } from '../services/api';

export default function DataView({ source, onBack, onClassify, onViewReport }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTickets = useCallback(async () => {
    setLoading(true); setError(null);
    try { const r = await getTickets(source); setTickets(r.data || []); }
    catch (err) { setError(err.message || "Failed."); setTickets([]); }
    finally { setLoading(false); }
  }, [source]);

  useEffect(() => { if (source) fetchTickets(); }, [source, fetchTickets]);

  const handleClassify = (ticket) => {
    onClassify(ticket);
    const poll = setInterval(async () => {
      try {
        const r = await getTickets(source);
        const updated = r.data || [];
        const classified = updated.find(t => t.id === ticket.id);
        if (classified && classified.is_classified) {
          setTickets(updated);
          clearInterval(poll);
        }
      } catch {}
    }, 3000);
    setTimeout(() => clearInterval(poll), 60000);
  };

  const handleViewReport = (ticket) => {
    // Build report data from ticket's saved rca_analysis
    const rca = ticket.rca_analysis || {};
    const reportData = {
      id: ticket.id,
      status: ticket.status,
      confidence: ticket.confidence_score || rca.confidence_score || 0,
      original_data: {
        source: ticket.source,
        description: ticket.description,
      },
      description: ticket.description,
      classification: {
        asset: rca.asset || ticket.asset || ticket.asset_name || 'Unknown',
        system: rca.system || ticket.system || 'Unknown',
        severity: ticket.severity || ticket.priority || 'Medium',
      },
      ai_analysis: {
        summary: rca.summary || '',
        root_cause: rca.root_cause || 'No root cause data saved.',
        fix: rca.fix || 'No fix data saved.',
        confidence_score: rca.confidence_score || ticket.confidence_score || 0,
      },
      escalate: ticket.status === 'Escalated',
    };
    onViewReport(reportData);
  };

  const name = source === 'servicenow' ? 'ServiceNow' : source === 'teams' ? 'Microsoft Teams' : source === 'outlook' ? 'Outlook' : source;

  return (
    <div className="w-full max-w-[1200px] mx-auto space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <motion.button whileTap={{ scale: 0.95 }} onClick={onBack}
            className="haptic flex items-center gap-1.5 font-mono text-[12px] font-semibold mb-4" style={{ color: '#00E59B' }}>
            <ArrowLeft className="w-4 h-4" /> Back to Triage
          </motion.button>
          <div className="flex items-center gap-3">
            <h1 className="font-display font-extrabold text-3xl tracking-tight" style={{ color: 'var(--text-primary)' }}>{name}</h1>
            <span className="font-mono text-[11px] px-3 py-1 rounded-full" style={{ background: 'var(--bg-surface)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
              {tickets.length} records
            </span>
          </div>
        </div>
        <motion.button whileTap={{ scale: 0.95 }} onClick={fetchTickets}
          className="haptic flex items-center gap-2 px-4 py-2.5 rounded-xl glass font-mono text-[11px] font-medium">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} style={{ color: 'var(--text-muted)' }} />
          <span style={{ color: 'var(--text-secondary)' }}>Refresh</span>
        </motion.button>
      </div>

      {error && (
        <div className="rounded-2xl p-4 font-sans text-sm" style={{ background: 'rgba(255,77,106,0.06)', color: '#FF4D6A', border: '1px solid rgba(255,77,106,0.12)' }}>{error}</div>
      )}

      {loading ? (
        <div className="w-full h-64 flex flex-col items-center justify-center glass rounded-3xl">
          <RefreshCw className="w-6 h-6 animate-spin mb-4" style={{ color: '#00E59B' }} />
          <p className="font-sans text-sm" style={{ color: 'var(--text-muted)' }}>Loading tickets...</p>
        </div>
      ) : (
        <TicketTable tickets={tickets} onClassify={handleClassify} onViewReport={handleViewReport} />
      )}
    </div>
  );
}