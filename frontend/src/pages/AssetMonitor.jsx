import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, AlertTriangle, ShieldCheck, Wifi, X, Zap, Clock, AlertOctagon, FileText } from 'lucide-react';
import { getAllTicketsWithStats } from '../services/api';
import SeverityPill from '../components/SeverityPill';

// ════════════════════════════════════════════════════════
// DPW ALUMINUM PLANT — COMPONENT REGISTRY (PERMANENT)
// ════════════════════════════════════════════════════════

const PLANT_SECTIONS = [
  {
    id: 'ingot',
    title: 'Ingot Casting',
    subtitle: 'Melting → Holding → Casting',
    groups: [
      { label: 'Melters', cols: 4, assets: ['Melter-1','Melter-2','Melter-3','Melter-4','Melter-5','Melter-6','Melter-7','Melter-8'] },
      { label: 'Holders', cols: 4, assets: ['Holder-1','Holder-2','Holder-3','Holder-4','Holder-5','Holder-6','Holder-7','Holder-8'] },
      { label: 'Casting Pits', cols: 3, assets: ['Casting Pit-1','Casting Pit-2','Casting Pit-3','Casting Pit-4','Casting Pit-5'] },
      { label: 'Support Systems', cols: 1, assets: ['Transfer Launder','Degassing Unit','Metal Treatment Station'] },
    ]
  },
  {
    id: 'plate',
    title: 'Plate',
    subtitle: 'Scalping → Heat Treat → Finishing',
    groups: [
      { label: 'Processing Line', cols: 1, assets: ['Scalper','Reheat Furnace','Stretcher','Ager'] },
      { label: 'Finishing', cols: 1, assets: ['Plate Saw','Ultrasonic Inspection'] },
    ]
  },
  {
    id: 'rolling',
    title: 'Rolling',
    subtitle: 'Hot Mill → Cold Mill',
    groups: [
      { label: 'Hot Rolling', cols: 1, assets: ['Hot Rolling Mill','Roughing Stand','Finishing Stand','Coil Box'] },
      { label: 'Cold Rolling', cols: 1, assets: ['Cold Rolling Mill','Roll Grinding','Annealing Furnace'] },
    ]
  },
  {
    id: 'finishing',
    title: 'Sheet Finishing',
    subtitle: 'Leveling → Cutting → Shipping',
    groups: [
      { label: 'Processing', cols: 1, assets: ['Tension Leveler','Slitter','Cut-to-Length Line'] },
      { label: 'Quality & Shipping', cols: 1, assets: ['Inspection Line','Packaging Line'] },
    ]
  },
];

const SHORT_NAMES = {
  'Melter-1':'M1','Melter-2':'M2','Melter-3':'M3','Melter-4':'M4',
  'Melter-5':'M5','Melter-6':'M6','Melter-7':'M7','Melter-8':'M8',
  'Holder-1':'H1','Holder-2':'H2','Holder-3':'H3','Holder-4':'H4',
  'Holder-5':'H5','Holder-6':'H6','Holder-7':'H7','Holder-8':'H8',
  'Casting Pit-1':'CP1','Casting Pit-2':'CP2','Casting Pit-3':'CP3',
  'Casting Pit-4':'CP4','Casting Pit-5':'CP5',
  'Transfer Launder':'Launder','Degassing Unit':'Degas',
  'Metal Treatment Station':'Treatment','Ultrasonic Inspection':'UT Inspect',
  'Hot Rolling Mill':'Hot Mill','Roughing Stand':'Roughing',
  'Finishing Stand':'Finishing','Coil Box':'Coil Box',
  'Cold Rolling Mill':'Cold Mill','Roll Grinding':'Roll Grind',
  'Annealing Furnace':'Annealing','Tension Leveler':'Leveler',
  'Cut-to-Length Line':'CTL Line','Inspection Line':'Inspect',
  'Packaging Line':'Packaging','Reheat Furnace':'Reheat',
};

const ALL_PLANT_ASSETS = PLANT_SECTIONS.flatMap(s => s.groups.flatMap(g => g.assets));

// ════════════════════════════════════════════════════════
// STATUS LOGIC — maps ticket data to component status
// ════════════════════════════════════════════════════════

function computeAssetStatuses(allTickets) {
  const statusMap = {};
  ALL_PLANT_ASSETS.forEach(name => {
    statusMap[name] = { status: 'online', tickets: [], activeCount: 0, worstPriority: null };
  });

  allTickets.forEach(ticket => {
    const assetName = ticket.asset_name || ticket.asset || '';
    let matched = null;

    if (statusMap[assetName] !== undefined) {
      matched = assetName;
    } else {
      for (const plantAsset of ALL_PLANT_ASSETS) {
        if (assetName.toLowerCase().includes(plantAsset.toLowerCase()) ||
            plantAsset.toLowerCase().includes(assetName.toLowerCase())) {
          matched = plantAsset;
          break;
        }
      }
    }

    if (!matched) return;

    statusMap[matched].tickets.push(ticket);
    const tStatus = ticket.status || '';
    const isResolved = tStatus.includes('Resolved') || tStatus === 'Resolved ✅';
    const isEscalated = tStatus === 'Escalated';
    const isActive = tStatus === 'Open' || tStatus === 'In Progress' || tStatus === 'Awaiting Parts';
    const isPending = tStatus === 'Pending' || tStatus === 'Pending Review' || tStatus === 'Scheduled';

    if (!isResolved) {
      statusMap[matched].activeCount++;
      if (isActive || isEscalated) {
        statusMap[matched].status = 'fault';
      } else if (isPending && statusMap[matched].status === 'online') {
        statusMap[matched].status = 'pending';
      }
    }

    const priOrder = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
    const pri = ticket.severity || ticket.priority || '';
    if ((priOrder[pri] || 0) > (priOrder[statusMap[matched].worstPriority] || 0)) {
      statusMap[matched].worstPriority = pri;
    }
  });

  return statusMap;
}

// ════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════

export default function AssetMonitor() {
  const [allTickets, setAllTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const result = await getAllTicketsWithStats();
      setAllTickets(result.all || []);
    } catch (e) { setError(e.message || 'Failed to load'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const i = setInterval(fetchData, 30000);
    return () => clearInterval(i);
  }, [fetchData]);

  const statusMap = useMemo(() => computeAssetStatuses(allTickets), [allTickets]);

  const stats = useMemo(() => {
    let online = 0, fault = 0, pending = 0;
    Object.values(statusMap).forEach(s => {
      if (s.status === 'fault') fault++;
      else if (s.status === 'pending') pending++;
      else online++;
    });
    return { total: ALL_PLANT_ASSETS.length, online, fault, pending };
  }, [statusMap]);

  const getSectionHealth = (section) => {
    let total = 0, healthy = 0;
    section.groups.forEach(g => g.assets.forEach(a => {
      total++;
      if (statusMap[a]?.status === 'online') healthy++;
    }));
    return total > 0 ? Math.round((healthy / total) * 100) : 100;
  };

  const selectedInfo = selectedAsset ? statusMap[selectedAsset] : null;

  if (loading) return (
    <div className="w-full h-96 flex flex-col items-center justify-center">
      <RefreshCw className="w-6 h-6 animate-spin mb-4" style={{ color: '#00E59B' }} />
      <p className="font-sans text-sm" style={{ color: 'var(--text-muted)' }}>Loading plant status...</p>
    </div>
  );

  return (
    <div className="w-full max-w-[1200px] mx-auto space-y-6 pb-12">

      {/* Header */}
      <div className="flex items-end justify-between mb-2">
        <div>
          <h1 className="font-display font-extrabold text-3xl tracking-tight flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
            DPW Plant Monitor
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-[10px] font-bold uppercase tracking-widest"
              style={{ background: 'rgba(255,77,106,0.08)', color: '#FF4D6A', border: '1px solid rgba(255,77,106,0.12)' }}>
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#FF4D6A', boxShadow: '0 0 8px rgba(255,77,106,0.4)' }} />
              LIVE
            </span>
          </h1>
          <p className="font-sans text-sm mt-1 font-light" style={{ color: 'var(--text-muted)' }}>
            DPW Aluminum — {stats.total} components across 4 production sections
          </p>
        </div>
        <motion.button whileTap={{ scale: 0.95 }} onClick={fetchData}
          className="haptic flex items-center gap-2 px-4 py-2.5 rounded-xl glass font-mono text-[11px] font-medium">
          <RefreshCw className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
          <span style={{ color: 'var(--text-secondary)' }}>Refresh</span>
        </motion.button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Assets', value: stats.total, icon: Zap, color: '#00D4FF' },
          { label: 'Online', value: stats.online, icon: Wifi, color: '#00E59B' },
          { label: 'Active Faults', value: stats.fault, icon: AlertOctagon, color: '#FF4D6A' },
          { label: 'Pending Review', value: stats.pending, icon: Clock, color: '#FFB800' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="glass gradient-border rounded-3xl p-5 flex items-center justify-between relative overflow-hidden">
            <div className="relative z-10">
              <p className="font-sans text-[12px] font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>{s.label}</p>
              <p className="font-display text-3xl font-extrabold" style={{ color: s.color }}>{s.value}</p>
            </div>
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center relative z-10"
              style={{ background: `${s.color}10`, border: `1px solid ${s.color}15` }}>
              <s.icon className="w-5 h-5" style={{ color: s.color }} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Dot Matrix Overview */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
        className="glass gradient-border rounded-3xl p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] font-semibold" style={{ color: 'var(--text-muted)' }}>Status Matrix</p>
          <div className="flex items-center gap-5">
            {[
              { l: 'Online', c: '#00E59B' },
              { l: 'Fault', c: '#FF4D6A' },
              { l: 'Pending', c: '#FFB800' },
            ].map((x, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: x.c }} />
                <span className="font-mono text-[9px]" style={{ color: 'var(--text-muted)' }}>{x.l}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-6">
          {PLANT_SECTIONS.map((section) => (
            <div key={section.id} className="flex-1">
              <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.15em] mb-3 text-center" style={{ color: 'var(--text-muted)' }}>{section.title}</p>
              <div className="flex flex-wrap gap-[5px] justify-center">
                {section.groups.flatMap(g => g.assets).map((asset) => {
                  const s = statusMap[asset]?.status || 'online';
                  const isFault = s === 'fault';
                  const colors = { online: '#00E59B', fault: '#FF4D6A', pending: '#FFB800' };
                  return (
                    <motion.div
                      key={asset}
                      whileHover={{ scale: 1.5 }}
                      onClick={() => setSelectedAsset(asset)}
                      className={`w-[14px] h-[14px] rounded-full cursor-pointer transition-all ${isFault ? 'animate-[dotPulse_2s_ease-in-out_infinite]' : ''}`}
                      style={{
                        background: colors[s] || colors.online,
                        boxShadow: isFault ? '0 0 8px rgba(255,77,106,0.5)' : s === 'pending' ? '0 0 6px rgba(255,184,0,0.3)' : `0 0 4px ${colors[s]}30`,
                      }}
                      title={`${asset} — ${s}`}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Plant Layout + Detail Panel */}
      <div className="flex gap-4">

        {/* Plant Sections */}
        <div className={`flex gap-3 overflow-x-auto transition-all duration-300 ${selectedAsset ? 'flex-[3]' : 'flex-1'}`}>
          {PLANT_SECTIONS.map((section, si) => {
            const health = getSectionHealth(section);
            const healthColor = health >= 90 ? '#00E59B' : health >= 70 ? '#FFB800' : '#FF4D6A';
            return (
              <motion.div key={section.id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + si * 0.08 }}
                className="glass gradient-border rounded-3xl overflow-hidden flex-1 min-w-[190px]">

                <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)' }}>
                  <div>
                    <h3 className="font-display font-bold text-[13px]" style={{ color: 'var(--text-primary)' }}>{section.title}</h3>
                    <p className="font-sans text-[10px]" style={{ color: 'var(--text-muted)' }}>{section.subtitle}</p>
                  </div>
                  <span className="font-mono text-[12px] font-bold" style={{ color: healthColor }}>{health}%</span>
                </div>

                <div className="p-3 space-y-3">
                  {section.groups.map((group, gi) => (
                    <div key={gi}>
                      <p className="font-mono text-[8px] uppercase tracking-[0.15em] mb-2 px-1" style={{ color: 'var(--text-muted)' }}>{group.label}</p>
                      <div className="grid gap-[4px]" style={{ gridTemplateColumns: `repeat(${group.cols}, 1fr)` }}>
                        {group.assets.map((asset) => {
                          const info = statusMap[asset] || { status: 'online', tickets: [], activeCount: 0 };
                          const short = SHORT_NAMES[asset] || asset;
                          const s = info.status;
                          const isFault = s === 'fault';
                          const isPending = s === 'pending';
                          const isSelected = selectedAsset === asset;

                          const bg = isFault ? 'rgba(255,77,106,0.08)' : isPending ? 'rgba(255,184,0,0.06)' : 'rgba(0,229,155,0.05)';
                          const border = isSelected ? '#00D4FF' : isFault ? 'rgba(255,77,106,0.2)' : isPending ? 'rgba(255,184,0,0.12)' : 'rgba(0,229,155,0.08)';
                          const dotColor = isFault ? '#FF4D6A' : isPending ? '#FFB800' : '#00E59B';

                          return (
                            <motion.div
                              key={asset}
                              whileTap={{ scale: 0.93 }}
                              onClick={() => setSelectedAsset(selectedAsset === asset ? null : asset)}
                              className={`rounded-lg px-2 py-1.5 cursor-pointer flex items-center gap-1.5 transition-all ${isFault ? 'animate-[unitGlow_2s_ease-in-out_infinite]' : ''}`}
                              style={{ background: bg, border: `1px solid ${border}`, borderWidth: isSelected ? '2px' : '1px' }}
                            >
                              <span className={`w-[6px] h-[6px] rounded-full flex-shrink-0 ${isFault ? 'animate-pulse' : ''}`}
                                style={{ background: dotColor }} />
                              <span className="font-mono text-[9px] font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{short}</span>
                              {info.activeCount > 0 && (
                                <span className="font-mono text-[7px] font-bold ml-auto px-1 py-0.5 rounded-full"
                                  style={{ background: isFault ? 'rgba(255,77,106,0.15)' : 'rgba(255,184,0,0.1)', color: dotColor }}>
                                  {info.activeCount}
                                </span>
                              )}
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Detail Panel — shows when asset is selected */}
        <AnimatePresence>
          {selectedAsset && selectedInfo && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 340 }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="flex-shrink-0 overflow-hidden"
            >
              <div className="glass gradient-border rounded-3xl p-5 h-full w-[340px]">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className={`w-3 h-3 rounded-full ${selectedInfo.status === 'fault' ? 'animate-pulse' : ''}`}
                      style={{ background: selectedInfo.status === 'fault' ? '#FF4D6A' : selectedInfo.status === 'pending' ? '#FFB800' : '#00E59B',
                        boxShadow: selectedInfo.status === 'fault' ? '0 0 8px rgba(255,77,106,0.5)' : 'none' }} />
                    <div>
                      <h3 className="font-display font-bold text-[15px]" style={{ color: 'var(--text-primary)' }}>{selectedAsset}</h3>
                      <p className="font-mono text-[10px] uppercase" style={{
                        color: selectedInfo.status === 'fault' ? '#FF4D6A' : selectedInfo.status === 'pending' ? '#FFB800' : '#00E59B'
                      }}>{selectedInfo.status === 'fault' ? 'Active Fault' : selectedInfo.status === 'pending' ? 'Pending Review' : 'Online'}</p>
                    </div>
                  </div>
                  <motion.button whileTap={{ scale: 0.85 }} onClick={() => setSelectedAsset(null)}
                    className="w-8 h-8 rounded-xl flex items-center justify-center haptic"
                    style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                    <X className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
                  </motion.button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[
                    { l: 'Total', v: selectedInfo.tickets.length, c: '#00D4FF' },
                    { l: 'Active', v: selectedInfo.activeCount, c: '#FF4D6A' },
                    { l: 'Resolved', v: selectedInfo.tickets.filter(t => t.status?.includes('Resolved')).length, c: '#00E59B' },
                  ].map((s, i) => (
                    <div key={i} className="rounded-xl p-3 text-center" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                      <p className="font-display font-extrabold text-xl" style={{ color: s.c }}>{s.v}</p>
                      <p className="font-mono text-[8px] uppercase tracking-[0.15em]" style={{ color: 'var(--text-muted)' }}>{s.l}</p>
                    </div>
                  ))}
                </div>

                {/* Active Tickets */}
                {selectedInfo.activeCount > 0 && (
                  <div className="mb-4">
                    <p className="font-mono text-[9px] uppercase tracking-[0.15em] mb-2" style={{ color: '#FF4D6A' }}>Active Issues</p>
                    <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                      {selectedInfo.tickets
                        .filter(t => !t.status?.includes('Resolved'))
                        .map((t, i) => (
                          <div key={i} className="rounded-xl p-3" style={{ background: 'rgba(255,77,106,0.04)', border: '1px solid rgba(255,77,106,0.08)' }}>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="font-mono text-[10px] font-bold" style={{ color: '#00E59B' }}>#{t.id}</span>
                              <div className="flex items-center gap-2">
                                {(t.severity || t.priority) && <SeverityPill level={t.severity || t.priority} />}
                                <span className="font-mono text-[8px] uppercase font-semibold px-1.5 py-0.5 rounded"
                                  style={{
                                    color: t.status === 'Open' ? '#FF4D6A' : '#FFB800',
                                    background: t.status === 'Open' ? 'rgba(255,77,106,0.08)' : 'rgba(255,184,0,0.08)'
                                  }}>{t.status}</span>
                              </div>
                            </div>
                            <p className="font-sans text-[11px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                              {(t.description || '').substring(0, 100)}{(t.description || '').length > 100 ? '...' : ''}
                            </p>
                            <div className="flex items-center gap-3 mt-2">
                              <span className="font-mono text-[9px]" style={{ color: 'var(--text-muted)' }}>{t.reported_by}</span>
                              <span className="font-mono text-[9px]" style={{ color: 'var(--text-muted)' }}>{t.created_at}</span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Resolved Tickets */}
                {selectedInfo.tickets.filter(t => t.status?.includes('Resolved')).length > 0 && (
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-[0.15em] mb-2" style={{ color: '#00E59B' }}>Resolved</p>
                    <div className="space-y-1.5 max-h-[150px] overflow-y-auto pr-1">
                      {selectedInfo.tickets
                        .filter(t => t.status?.includes('Resolved'))
                        .slice(0, 5)
                        .map((t, i) => (
                          <div key={i} className="rounded-lg p-2.5 flex items-center gap-2" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                            <span className="font-mono text-[10px] font-bold" style={{ color: '#00E59B' }}>#{t.id}</span>
                            <span className="font-sans text-[10px] truncate flex-1" style={{ color: 'var(--text-muted)' }}>
                              {(t.description || '').substring(0, 50)}...
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* No tickets */}
                {selectedInfo.tickets.length === 0 && (
                  <div className="text-center py-8">
                    <ShieldCheck className="w-10 h-10 mx-auto mb-3" style={{ color: '#00E59B', opacity: 0.4 }} />
                    <p className="font-sans text-[13px] font-medium" style={{ color: 'var(--text-primary)' }}>All Clear</p>
                    <p className="font-sans text-[11px]" style={{ color: 'var(--text-muted)' }}>No tickets for this component</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes dotPulse {
          0%, 100% { box-shadow: 0 0 6px rgba(255,77,106,0.4); }
          50% { box-shadow: 0 0 14px rgba(255,77,106,0.7); }
        }
        @keyframes unitGlow {
          0%, 100% { box-shadow: 0 1px 4px rgba(255,77,106,0.1); }
          50% { box-shadow: 0 1px 12px rgba(255,77,106,0.25); }
        }
      `}</style>
    </div>
  );
}
