import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, ShieldCheck, Wifi, X, Zap, Clock, AlertOctagon } from 'lucide-react';
import { getAllTicketsWithStats } from '../services/api';
import SeverityPill from '../components/SeverityPill';

const PLANT_SECTIONS = [
  {
    id: 'ingot', title: 'Ingot Casting', subtitle: 'Melt → Hold → Cast',
    groups: [
      { label: 'Melters', cols: 4, assets: ['Melter-1','Melter-2','Melter-3','Melter-4','Melter-5','Melter-6','Melter-7','Melter-8'] },
      { label: 'Holders', cols: 4, assets: ['Holder-1','Holder-2','Holder-3','Holder-4','Holder-5','Holder-6','Holder-7','Holder-8'] },
      { label: 'Casting Pits', cols: 3, assets: ['Casting Pit-1','Casting Pit-2','Casting Pit-3','Casting Pit-4','Casting Pit-5'] },
      { label: 'Support', cols: 1, assets: ['Transfer Launder','Degassing Unit','Metal Treatment Station'] },
    ]
  },
  {
    id: 'plate', title: 'Plate', subtitle: 'Scalp → Treat → Finish',
    groups: [
      { label: 'Processing', cols: 1, assets: ['Scalper','Reheat Furnace','Stretcher','Ager'] },
      { label: 'Finishing', cols: 1, assets: ['Plate Saw','Ultrasonic Inspection'] },
    ]
  },
  {
    id: 'rolling', title: 'Rolling', subtitle: 'Hot → Cold Mill',
    groups: [
      { label: 'Hot Rolling', cols: 1, assets: ['Hot Rolling Mill','Roughing Stand','Finishing Stand','Coil Box'] },
      { label: 'Cold Rolling', cols: 1, assets: ['Cold Rolling Mill','Roll Grinding','Annealing Furnace'] },
    ]
  },
  {
    id: 'finishing', title: 'Sheet Finishing', subtitle: 'Level → Cut → Ship',
    groups: [
      { label: 'Processing', cols: 1, assets: ['Tension Leveler','Slitter','Cut-to-Length Line'] },
      { label: 'QC & Ship', cols: 1, assets: ['Inspection Line','Packaging Line'] },
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
  'Metal Treatment Station':'Treat.','Ultrasonic Inspection':'UT Insp.',
  'Hot Rolling Mill':'Hot Mill','Roughing Stand':'Rough.',
  'Finishing Stand':'Finish.','Coil Box':'Coil Box',
  'Cold Rolling Mill':'Cold Mill','Roll Grinding':'Roll Gr.',
  'Annealing Furnace':'Anneal.','Tension Leveler':'Leveler',
  'Cut-to-Length Line':'CTL','Inspection Line':'Inspect',
  'Packaging Line':'Package','Reheat Furnace':'Reheat',
  'Plate Saw':'Saw','Scalper':'Scalper','Stretcher':'Stretch.','Ager':'Ager',
  'Slitter':'Slitter',
};

const ALL_PLANT_ASSETS = PLANT_SECTIONS.flatMap(s => s.groups.flatMap(g => g.assets));

// Fuzzy match ticket asset name to plant component
function matchAsset(ticketAssetName) {
  if (!ticketAssetName) return null;
  const name = ticketAssetName.trim();

  // Exact match
  if (ALL_PLANT_ASSETS.includes(name)) return name;

  // Case-insensitive match
  const lower = name.toLowerCase();
  for (const plant of ALL_PLANT_ASSETS) {
    if (plant.toLowerCase() === lower) return plant;
  }

  // Partial match — ticket name contains plant name or vice versa
  for (const plant of ALL_PLANT_ASSETS) {
    if (lower.includes(plant.toLowerCase()) || plant.toLowerCase().includes(lower)) return plant;
  }

  // Word match — "Melter 3" matches "Melter-3", "Casting Pit 2" matches "Casting Pit-2"
  const normalized = lower.replace(/[\s\-_]+/g, '');
  for (const plant of ALL_PLANT_ASSETS) {
    const plantNorm = plant.toLowerCase().replace(/[\s\-_]+/g, '');
    if (normalized === plantNorm) return plant;
    if (normalized.includes(plantNorm) || plantNorm.includes(normalized)) return plant;
  }

  return null;
}

function computeAssetStatuses(allTickets) {
  const statusMap = {};
  ALL_PLANT_ASSETS.forEach(name => {
    statusMap[name] = { status: 'online', tickets: [], activeCount: 0, resolvedCount: 0, worstPriority: null };
  });

  allTickets.forEach(ticket => {
    const assetName = ticket.asset_name || ticket.asset || '';
    const matched = matchAsset(assetName);
    if (!matched) return;

    statusMap[matched].tickets.push(ticket);
    const tStatus = ticket.status || '';
    const isResolved = tStatus.includes('Resolved') || tStatus === 'Resolved ✅';
    const isEscalated = tStatus === 'Escalated';
    const isClassified = ticket.is_classified;
    const isOpen = tStatus === 'Open' || tStatus === 'In Progress' || tStatus === 'Awaiting Parts' || tStatus === 'Scheduled';

    if (isResolved) {
      statusMap[matched].resolvedCount++;
    } else if (isEscalated) {
      statusMap[matched].activeCount++;
      statusMap[matched].status = 'fault';
    } else if (isClassified) {
      statusMap[matched].activeCount++;
      if (statusMap[matched].status === 'online') statusMap[matched].status = 'pending';
    } else if (isOpen) {
      // Unclassified but open — count as pending to show on monitor
      statusMap[matched].activeCount++;
      if (statusMap[matched].status === 'online') statusMap[matched].status = 'pending';
    }

    const priOrder = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
    const pri = ticket.severity || ticket.priority || '';
    if ((priOrder[pri] || 0) > (priOrder[statusMap[matched].worstPriority] || 0)) statusMap[matched].worstPriority = pri;
  });
  return statusMap;
}

export default function AssetMonitor() {
  const [allTickets, setAllTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try { const result = await getAllTicketsWithStats(); setAllTickets(result.all || []); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => { const i = setInterval(fetchData, 30000); return () => clearInterval(i); }, [fetchData]);

  const statusMap = useMemo(() => computeAssetStatuses(allTickets), [allTickets]);

  const stats = useMemo(() => {
    let online = 0, fault = 0, pending = 0;
    Object.values(statusMap).forEach(s => { if (s.status === 'fault') fault++; else if (s.status === 'pending') pending++; else online++; });
    return { total: ALL_PLANT_ASSETS.length, online, fault, pending };
  }, [statusMap]);

  const getSectionHealth = (section) => {
    let total = 0, healthy = 0;
    section.groups.forEach(g => g.assets.forEach(a => { total++; if (statusMap[a]?.status === 'online') healthy++; }));
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
    <div className="w-full max-w-[1200px] mx-auto space-y-4 pb-12" style={{ overflowX: 'hidden' }}>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <h1 className="font-display font-extrabold text-xl sm:text-2xl md:text-3xl tracking-tight flex flex-wrap items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            DPW Plant Monitor
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full font-mono text-[8px] sm:text-[10px] font-bold uppercase tracking-widest"
              style={{ background: 'rgba(255,77,106,0.08)', color: '#FF4D6A', border: '1px solid rgba(255,77,106,0.12)' }}>
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full animate-pulse" style={{ background: '#FF4D6A' }} /> LIVE
            </span>
          </h1>
          <p className="font-sans text-[10px] sm:text-xs md:text-sm mt-1 font-light" style={{ color: 'var(--text-muted)' }}>{stats.total} components · 4 sections</p>
        </div>
        <motion.button whileTap={{ scale: 0.95 }} onClick={fetchData}
          className="haptic flex items-center gap-2 px-3 py-2 rounded-xl glass font-mono text-[10px] sm:text-[11px] font-medium self-start sm:self-auto flex-shrink-0">
          <RefreshCw className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
          <span style={{ color: 'var(--text-secondary)' }}>Refresh</span>
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        {[
          { label: 'Total', value: stats.total, icon: Zap, color: '#00D4FF' },
          { label: 'Online', value: stats.online, icon: Wifi, color: '#00E59B' },
          { label: 'Faults', value: stats.fault, icon: AlertOctagon, color: '#FF4D6A' },
          { label: 'Pending', value: stats.pending, icon: Clock, color: '#FFB800' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="glass gradient-border rounded-xl sm:rounded-2xl p-2.5 sm:p-4 flex items-center justify-between">
            <div>
              <p className="font-sans text-[9px] sm:text-[11px] font-medium" style={{ color: 'var(--text-secondary)' }}>{s.label}</p>
              <p className="font-display text-lg sm:text-2xl md:text-3xl font-extrabold" style={{ color: s.color }}>{s.value}</p>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${s.color}10`, border: `1px solid ${s.color}15` }}>
              <s.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: s.color }} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Dot Matrix */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
        className="glass gradient-border rounded-xl sm:rounded-2xl p-3 sm:p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="font-mono text-[8px] sm:text-[10px] uppercase tracking-[0.15em] font-semibold" style={{ color: 'var(--text-muted)' }}>Status Matrix</p>
          <div className="flex items-center gap-2 sm:gap-4">
            {[{ l: 'Online', c: '#00E59B' }, { l: 'Fault', c: '#FF4D6A' }, { l: 'Pending', c: '#FFB800' }].map((x, i) => (
              <div key={i} className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ background: x.c }} />
                <span className="font-mono text-[7px] sm:text-[9px]" style={{ color: 'var(--text-muted)' }}>{x.l}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
  {PLANT_SECTIONS.map((section) => {
    const allAssets = section.groups.flatMap(g => g.assets);
    const cols = allAssets.length > 12 ? 6 : allAssets.length > 8 ? 5 : allAssets.length > 5 ? 4 : 3;
    return (
      <div key={section.id}>
        <p className="font-mono text-[7px] sm:text-[9px] font-semibold uppercase tracking-[0.1em] mb-2 text-center" style={{ color: 'var(--text-muted)' }}>{section.title}</p>
        <div className="overflow-hidden" style={{ border: '1.5px solid rgba(136,146,176,0.25)', borderRadius: '10px' }}>
          <div className="grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
            {allAssets.map((asset) => {
              const s = statusMap[asset]?.status || 'online';
              const isFault = s === 'fault';
              const isPending = s === 'pending';
              const colors = { online: '#00E59B', fault: '#FF4D6A', pending: '#FFB800' };
              return (
                <div key={asset} onClick={() => setSelectedAsset(selectedAsset === asset ? null : asset)}
                  className="flex items-center justify-center cursor-pointer transition-colors hover:bg-[var(--bg-surface)]"
                  style={{ padding: '6px', borderRight: '0.5px solid rgba(136,146,176,0.15)', borderBottom: '0.5px solid rgba(136,146,176,0.15)' }}
                  title={`${asset} — ${s}`}>
                  <div className={`w-[10px] h-[10px] sm:w-[11px] sm:h-[11px] rounded-full ${isFault ? 'animate-[dotPulse_2s_ease-in-out_infinite]' : ''}`}
                    style={{ background: colors[s] || colors.online, boxShadow: isFault ? '0 0 6px rgba(255,77,106,0.5)' : isPending ? '0 0 4px rgba(255,184,0,0.3)' : '0 0 3px rgba(0,229,155,0.2)' }} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  })}
</div>
      </motion.div>

      {/* Main area — Plant sections + side detail panel */}
      <div className="flex flex-col lg:flex-row gap-3">

        {/* Plant Sections */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 ${selectedAsset ? 'lg:grid-cols-2' : 'lg:grid-cols-4'} gap-2 sm:gap-3 flex-1 transition-all`}>
          {PLANT_SECTIONS.map((section, si) => {
            const health = getSectionHealth(section);
            const healthColor = health >= 90 ? '#00E59B' : health >= 70 ? '#FFB800' : '#FF4D6A';
            return (
              <motion.div key={section.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + si * 0.08 }}
                className="glass gradient-border rounded-xl sm:rounded-2xl overflow-hidden">
                <div className="px-3 py-2 sm:py-2.5 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)' }}>
                  <div className="min-w-0">
                    <h3 className="font-display font-bold text-[11px] sm:text-[13px] truncate" style={{ color: 'var(--text-primary)' }}>{section.title}</h3>
                    <p className="font-sans text-[8px] sm:text-[10px] truncate" style={{ color: 'var(--text-muted)' }}>{section.subtitle}</p>
                  </div>
                  <span className="font-mono text-[10px] sm:text-[12px] font-bold flex-shrink-0 ml-2" style={{ color: healthColor }}>{health}%</span>
                </div>
                <div className="p-2 sm:p-3 space-y-2">
                  {section.groups.map((group, gi) => (
                    <div key={gi}>
                      <p className="font-mono text-[7px] sm:text-[8px] uppercase tracking-[0.1em] mb-1 px-0.5" style={{ color: 'var(--text-muted)' }}>{group.label}</p>
                      <div className="grid gap-[3px]" style={{ gridTemplateColumns: `repeat(${group.cols}, 1fr)` }}>
                        {group.assets.map((asset) => {
                          const info = statusMap[asset] || { status: 'online', activeCount: 0 };
                          const short = SHORT_NAMES[asset] || asset;
                          const s = info.status;
                          const isFault = s === 'fault';
                          const isPending = s === 'pending';
                          const isSelected = selectedAsset === asset;
                          const bg = isFault ? 'rgba(255,77,106,0.08)' : isPending ? 'rgba(255,184,0,0.06)' : 'rgba(0,229,155,0.05)';
                          const border = isSelected ? '#00D4FF' : isFault ? 'rgba(255,77,106,0.2)' : isPending ? 'rgba(255,184,0,0.12)' : 'rgba(0,229,155,0.08)';
                          const dotColor = isFault ? '#FF4D6A' : isPending ? '#FFB800' : '#00E59B';
                          return (
                            <div key={asset} onClick={() => setSelectedAsset(selectedAsset === asset ? null : asset)}
                              className={`rounded-md px-1.5 py-1 cursor-pointer flex items-center gap-1 ${isFault ? 'animate-[unitGlow_2s_ease-in-out_infinite]' : ''}`}
                              style={{ background: bg, border: `${isSelected ? '2' : '1'}px solid ${border}` }}>
                              <span className={`w-[4px] h-[4px] sm:w-[5px] sm:h-[5px] rounded-full flex-shrink-0 ${isFault ? 'animate-pulse' : ''}`} style={{ background: dotColor }} />
                              <span className="font-mono text-[7px] sm:text-[8px] font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{short}</span>
                              {info.activeCount > 0 && (
                                <span className="font-mono text-[6px] font-bold ml-auto px-0.5 rounded-full" style={{ background: 'rgba(255,77,106,0.15)', color: dotColor }}>{info.activeCount}</span>
                              )}
                            </div>
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

        {/* Side Detail Panel — slides in when asset is selected */}
        <AnimatePresence>
          {selectedAsset && selectedInfo && (
            <motion.div
              initial={{ opacity: 0, x: 20, width: 0 }}
              animate={{ opacity: 1, x: 0, width: 'auto' }}
              exit={{ opacity: 0, x: 20, width: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="w-full lg:w-[340px] flex-shrink-0 overflow-hidden"
            >
              <div className="glass gradient-border rounded-xl sm:rounded-2xl p-3 sm:p-4 h-full max-h-[70vh] lg:max-h-none overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`w-3 h-3 rounded-full flex-shrink-0 ${selectedInfo.status === 'fault' ? 'animate-pulse' : ''}`}
                      style={{ background: selectedInfo.status === 'fault' ? '#FF4D6A' : selectedInfo.status === 'pending' ? '#FFB800' : '#00E59B' }} />
                    <div className="min-w-0">
                      <h3 className="font-display font-bold text-[13px] sm:text-[15px] truncate" style={{ color: 'var(--text-primary)' }}>{selectedAsset}</h3>
                      <p className="font-mono text-[8px] sm:text-[10px] uppercase font-semibold" style={{
                        color: selectedInfo.status === 'fault' ? '#FF4D6A' : selectedInfo.status === 'pending' ? '#FFB800' : '#00E59B'
                      }}>{selectedInfo.status === 'fault' ? 'Active Fault' : selectedInfo.status === 'pending' ? 'Pending' : 'Online'}</p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedAsset(null)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center haptic flex-shrink-0"
                    style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                    <X className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
                  </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-1.5 sm:gap-2 mb-3">
                  {[
                    { l: 'Total', v: selectedInfo.tickets.length, c: '#00D4FF' },
                    { l: 'Active', v: selectedInfo.activeCount, c: '#FF4D6A' },
                    { l: 'Resolved', v: selectedInfo.resolvedCount, c: '#00E59B' },
                  ].map((s, i) => (
                    <div key={i} className="rounded-lg sm:rounded-xl p-2 sm:p-2.5 text-center" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                      <p className="font-display font-extrabold text-base sm:text-lg" style={{ color: s.c }}>{s.v}</p>
                      <p className="font-mono text-[6px] sm:text-[7px] uppercase tracking-[0.1em]" style={{ color: 'var(--text-muted)' }}>{s.l}</p>
                    </div>
                  ))}
                </div>

                {selectedInfo.worstPriority && (
                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-mono text-[8px] uppercase" style={{ color: 'var(--text-muted)' }}>Priority:</span>
                    <SeverityPill level={selectedInfo.worstPriority} />
                  </div>
                )}

                {/* Active Tickets */}
                {selectedInfo.tickets.filter(t => !t.status?.includes('Resolved')).length > 0 && (
                  <div className="mb-3">
                    <p className="font-mono text-[7px] sm:text-[8px] uppercase tracking-[0.15em] font-bold mb-2" style={{ color: '#FF4D6A' }}>Active Issues</p>
                    <div className="space-y-1.5">
                      {selectedInfo.tickets.filter(t => !t.status?.includes('Resolved')).map((t, i) => (
                        <div key={i} className="rounded-lg p-2 sm:p-2.5" style={{ background: 'rgba(255,77,106,0.04)', border: '1px solid rgba(255,77,106,0.08)' }}>
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono text-[9px] sm:text-[10px] font-bold" style={{ color: '#00E59B' }}>#{t.id}</span>
                              {(t.severity || t.priority) && <SeverityPill level={t.severity || t.priority} />}
                            </div>
                            <span className="font-mono text-[7px] sm:text-[8px] uppercase font-semibold px-1 py-0.5 rounded"
                              style={{ color: '#FFB800', background: 'rgba(255,184,0,0.08)' }}>{t.status}</span>
                          </div>
                          <p className="font-sans text-[9px] sm:text-[10px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                            {(t.description || '').substring(0, 100)}{(t.description || '').length > 100 ? '...' : ''}
                          </p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="font-mono text-[7px] sm:text-[8px]" style={{ color: 'var(--text-muted)' }}>{t.reported_by}</span>
                            <span className="font-mono text-[7px] sm:text-[8px]" style={{ color: 'var(--text-muted)' }}>{t.created_at}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Resolved */}
                {selectedInfo.resolvedCount > 0 && (
                  <div>
                    <p className="font-mono text-[7px] sm:text-[8px] uppercase tracking-[0.15em] font-bold mb-2" style={{ color: '#00E59B' }}>Resolved</p>
                    <div className="space-y-1">
                      {selectedInfo.tickets.filter(t => t.status?.includes('Resolved')).map((t, i) => (
                        <div key={i} className="rounded-lg p-2 flex items-center gap-2" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                          <span className="font-mono text-[8px] sm:text-[9px] font-bold" style={{ color: '#00E59B' }}>#{t.id}</span>
                          <span className="font-sans text-[8px] sm:text-[9px] truncate flex-1" style={{ color: 'var(--text-muted)' }}>{(t.description || '').substring(0, 40)}...</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Empty */}
                {selectedInfo.tickets.length === 0 && (
                  <div className="text-center py-6">
                    <ShieldCheck className="w-8 h-8 mx-auto mb-2" style={{ color: '#00E59B', opacity: 0.3 }} />
                    <p className="font-display font-bold text-xs" style={{ color: 'var(--text-primary)' }}>All Clear</p>
                    <p className="font-sans text-[10px]" style={{ color: 'var(--text-muted)' }}>No tickets for {selectedAsset}</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        @keyframes dotPulse { 0%,100%{box-shadow:0 0 6px rgba(255,77,106,0.4)} 50%{box-shadow:0 0 14px rgba(255,77,106,0.7)} }
        @keyframes unitGlow { 0%,100%{box-shadow:0 1px 4px rgba(255,77,106,0.1)} 50%{box-shadow:0 1px 12px rgba(255,77,106,0.25)} }
      `}</style>
    </div>
  );
}