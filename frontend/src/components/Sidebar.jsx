// import { motion, AnimatePresence } from 'framer-motion';
// import { BarChart2, GitBranch, AlertTriangle, Activity, Sun, Moon, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
// import { useTheme, useSidebar } from '../App';
// import clsx from 'clsx';

// export default function Sidebar({ currentPage, setPage, escalatedCount }) {
//   const { theme, toggleTheme } = useTheme();
//   const { collapsed, setCollapsed } = useSidebar();

//   const navItems = [
//     { id: 'dashboard', label: 'Mission Control', icon: BarChart2 },
//     { id: 'triage', label: 'Triage Center', icon: GitBranch },
//     { id: 'escalation', label: 'Escalation Hub', icon: AlertTriangle, badge: escalatedCount },
//     { id: 'monitor', label: 'Asset Monitor', icon: Activity },
//   ];

//   const w = collapsed ? 'w-[72px]' : 'w-[270px]';

//   return (
//     <motion.div
//       layout
//       className={clsx("fixed left-0 top-0 h-full flex flex-col z-40 glass-sidebar transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]", w)}
//     >
//       {/* ── Header ── */}
//       <div className={clsx("flex items-center pt-6 pb-4 relative", collapsed ? "px-0 justify-center" : "px-5 justify-between")}>
//         <div
//           className={clsx("flex items-center gap-3 cursor-pointer group", collapsed && "justify-center")}
//           onClick={() => setPage('landing')}
//         >
//           <div className="relative flex-shrink-0">
//             <div className="w-10 h-10 rounded-2xl flex items-center justify-center relative overflow-hidden"
//               style={{ background: 'linear-gradient(135deg, rgba(0,229,155,0.15), rgba(0,212,255,0.08))' }}>
//               <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
//                 <path d="M12 2L3 12L12 22L21 12L12 2Z" fill="url(#slg)" />
//                 <path d="M12 7L7 12L12 17L17 12L12 7Z" fill="url(#slg2)" opacity="0.5" />
//                 <defs>
//                   <linearGradient id="slg" x1="3" y1="2" x2="21" y2="22"><stop stopColor="#00E59B" /><stop offset="1" stopColor="#00D4FF" /></linearGradient>
//                   <linearGradient id="slg2" x1="7" y1="7" x2="17" y2="17"><stop stopColor="#00E59B" /><stop offset="1" stopColor="#00D4FF" /></linearGradient>
//                 </defs>
//               </svg>
//             </div>
//             <div className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
//               style={{ background: 'radial-gradient(circle, rgba(0,229,155,0.12) 0%, transparent 70%)' }} />
//           </div>

//           <AnimatePresence>
//             {!collapsed && (
//               <motion.div
//                 initial={{ opacity: 0, x: -8 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 exit={{ opacity: 0, x: -8 }}
//                 transition={{ duration: 0.2 }}
//                 className="overflow-hidden whitespace-nowrap"
//               >
//                 <h1 className="font-display font-bold text-[16px] tracking-tight leading-tight" style={{ color: 'var(--text-primary)' }}>
//                   Alum<span className="gradient-text">AI</span>
//                 </h1>
//                 <p className="font-mono text-[8px] tracking-[0.2em] uppercase" style={{ color: 'var(--text-muted)' }}>Intelligence</p>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>

//         <AnimatePresence>
//           {!collapsed && (
//             <motion.button
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               whileTap={{ scale: 0.85 }}
//               onClick={() => setCollapsed(true)}
//               className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors haptic"
//               style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
//             >
//               <ChevronLeft className="w-3.5 h-3.5" />
//             </motion.button>
//           )}
//         </AnimatePresence>
//       </div>

//       {collapsed && (
//         <div className="flex justify-center pb-2">
//           <motion.button
//             whileTap={{ scale: 0.85 }}
//             onClick={() => setCollapsed(false)}
//             className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors haptic"
//             style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
//           >
//             <ChevronRight className="w-3.5 h-3.5" />
//           </motion.button>
//         </div>
//       )}

//       {/* ── Divider ── */}
//       <div className={clsx("h-px", collapsed ? "mx-3" : "mx-5")} style={{ background: 'var(--border)' }} />

//       {/* ── Nav Label ── */}
//       <AnimatePresence>
//         {!collapsed && (
//           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="px-6 pt-5 pb-2">
//             <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.2em]" style={{ color: 'var(--text-muted)' }}>Menu</p>
//           </motion.div>
//         )}
//       </AnimatePresence>
//       {collapsed && <div className="pt-4" />}

//       {/* ── Navigation ── */}
//       <nav className={clsx("flex-1 space-y-1 overflow-y-auto", collapsed ? "px-2" : "px-3")}>
//         {navItems.map((item) => {
//           const isActive = currentPage === item.id || (currentPage === 'dataview' && item.id === 'triage');
//           const Icon = item.icon;

//           return (
//             <div key={item.id} className="relative group">
//               <motion.button
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() => setPage(item.id)}
//                 className={clsx(
//                   "w-full flex items-center rounded-2xl font-sans text-[13px] font-medium transition-all duration-200 relative",
//                   collapsed ? "justify-center px-0 py-3" : "gap-3 px-3.5 py-3"
//                 )}
//                 style={{
//                   background: isActive ? 'var(--gradient-sidebar-active)' : 'transparent',
//                   color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
//                 }}
//               >
//                 {isActive && (
//                   <motion.div
//                     layoutId="nav-active-bar"
//                     className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full"
//                     style={{ background: 'linear-gradient(180deg, #00E59B, #00D4FF)', boxShadow: '0 0 12px rgba(0,229,155,0.4)' }}
//                     transition={{ type: "spring", stiffness: 400, damping: 30 }}
//                   />
//                 )}

//                 <div className={clsx("flex-shrink-0 rounded-xl flex items-center justify-center transition-all duration-200", collapsed ? "w-10 h-10" : "w-9 h-9")}
//                   style={{
//                     background: isActive ? 'rgba(0,229,155,0.12)' : 'var(--bg-surface)',
//                     border: `1px solid ${isActive ? 'rgba(0,229,155,0.15)' : 'var(--border)'}`,
//                     boxShadow: isActive ? '0 0 16px rgba(0,229,155,0.08)' : 'none',
//                   }}>
//                   <Icon className="w-[16px] h-[16px]" style={{ color: isActive ? '#00E59B' : 'var(--text-muted)' }} />
//                 </div>

//                 <AnimatePresence>
//                   {!collapsed && (
//                     <motion.span
//                       initial={{ opacity: 0, width: 0 }}
//                       animate={{ opacity: 1, width: 'auto' }}
//                       exit={{ opacity: 0, width: 0 }}
//                       transition={{ duration: 0.2 }}
//                       className="flex-1 text-left overflow-hidden whitespace-nowrap font-semibold text-[13px]"
//                     >
//                       {item.label}
//                     </motion.span>
//                   )}
//                 </AnimatePresence>

//                 {item.badge > 0 && (
//                   <span className={clsx(
//                     "flex items-center justify-center rounded-full text-[9px] font-bold",
//                     collapsed ? "absolute -top-0.5 -right-0.5 w-4 h-4" : "min-w-[22px] h-[22px] px-1.5"
//                   )}
//                     style={{ background: 'linear-gradient(135deg, #FF4D6A, #FF6B8A)', color: '#fff', boxShadow: '0 0 10px rgba(255,77,106,0.3)' }}>
//                     {collapsed ? '' : item.badge}
//                     {collapsed && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
//                   </span>
//                 )}
//               </motion.button>

//               {collapsed && (
//                 <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-2 rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 whitespace-nowrap z-50"
//                   style={{ background: 'var(--bg-card-solid)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-elevated)' }}>
//                   <span className="font-sans text-[12px] font-semibold" style={{ color: 'var(--text-primary)' }}>{item.label}</span>
//                   {item.badge > 0 && (
//                     <span className="ml-2 px-1.5 py-0.5 rounded-full text-[9px] font-bold" style={{ background: 'rgba(255,77,106,0.15)', color: '#FF4D6A' }}>{item.badge}</span>
//                   )}
//                   <div className="absolute right-full top-1/2 -translate-y-1/2 border-[5px] border-transparent" style={{ borderRightColor: 'var(--border)' }} />
//                 </div>
//               )}
//             </div>
//           );
//         })}
//       </nav>

//       {/* ── Bottom ── */}
//       <div className={clsx("pb-4 space-y-1.5", collapsed ? "px-2" : "px-3")}>
//         <div className={clsx("h-px", collapsed ? "mx-1" : "mx-2")} style={{ background: 'var(--border)' }} />

//         {/* Theme Toggle */}
//         <div className="relative group">
//           <motion.button
//             whileTap={{ scale: 0.9 }}
//             onClick={toggleTheme}
//             className={clsx(
//               "w-full flex items-center rounded-2xl font-sans text-[12px] font-medium transition-all duration-200",
//               collapsed ? "justify-center px-0 py-2.5" : "gap-3 px-3.5 py-2.5"
//             )}
//             style={{ color: 'var(--text-secondary)' }}
//           >
//             <div className={clsx("flex-shrink-0 rounded-xl flex items-center justify-center", collapsed ? "w-10 h-10" : "w-9 h-9")}
//               style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
//               {theme === 'dark' ? <Sun className="w-4 h-4" style={{ color: '#FFB800' }} /> : <Moon className="w-4 h-4" style={{ color: '#B18CFF' }} />}
//             </div>
//             <AnimatePresence>
//               {!collapsed && (
//                 <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="overflow-hidden whitespace-nowrap">
//                   {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
//                 </motion.span>
//               )}
//             </AnimatePresence>
//           </motion.button>
//           {collapsed && (
//             <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-2 rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 whitespace-nowrap z-50"
//               style={{ background: 'var(--bg-card-solid)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-elevated)' }}>
//               <span className="font-sans text-[12px] font-semibold" style={{ color: 'var(--text-primary)' }}>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
//               <div className="absolute right-full top-1/2 -translate-y-1/2 border-[5px] border-transparent" style={{ borderRightColor: 'var(--border)' }} />
//             </div>
//           )}
//         </div>

//         {/* Profile */}
//         <div className={clsx(
//           "rounded-2xl flex items-center transition-all duration-300",
//           collapsed ? "justify-center p-2" : "gap-3 p-3"
//         )} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
//           <div className={clsx(
//             "rounded-xl flex items-center justify-center font-display font-bold relative overflow-hidden flex-shrink-0",
//             collapsed ? "w-10 h-10 text-[12px]" : "w-9 h-9 text-[11px]"
//           )}
//             style={{ background: 'linear-gradient(135deg, rgba(0,229,155,0.2), rgba(0,212,255,0.15))', color: '#00E59B' }}>
//             AA
//             <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2" style={{ background: '#00E59B', borderColor: 'var(--bg-surface)' }} />
//           </div>

//           <AnimatePresence>
//             {!collapsed && (
//               <motion.div
//                 initial={{ opacity: 0, width: 0 }}
//                 animate={{ opacity: 1, width: 'auto' }}
//                 exit={{ opacity: 0, width: 0 }}
//                 transition={{ duration: 0.2 }}
//                 className="flex-1 min-w-0 overflow-hidden"
//               >
//                 <p className="font-sans text-[12px] font-semibold truncate" style={{ color: 'var(--text-primary)' }}>AlumAI Admin</p>
//                 <p className="font-mono text-[9px] truncate" style={{ color: 'var(--text-muted)' }}>admin@alumai.io</p>
//               </motion.div>
//             )}
//           </AnimatePresence>

//           <AnimatePresence>
//             {!collapsed && (
//               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
//                 <LogOut className="w-3.5 h-3.5 flex-shrink-0 cursor-pointer transition-colors hover:opacity-70" style={{ color: 'var(--text-muted)' }} />
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>
//       </div>
//     </motion.div>
//   );
// }

import { motion, AnimatePresence } from 'framer-motion';
import { BarChart2, GitBranch, AlertTriangle, Activity, Sun, Moon, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme, useSidebar, useAuth } from '../App';
import clsx from 'clsx';

export default function Sidebar({ currentPage, setPage, escalatedCount }) {
  const { theme, toggleTheme } = useTheme();
  const { collapsed, setCollapsed } = useSidebar();
  const { user, logout: handleLogout } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Mission Control', icon: BarChart2 },
    { id: 'triage', label: 'Triage Center', icon: GitBranch },
    { id: 'escalation', label: 'Escalation Hub', icon: AlertTriangle, badge: escalatedCount },
    { id: 'monitor', label: 'Asset Monitor', icon: Activity },
  ];

  const w = collapsed ? 'w-[72px]' : 'w-[270px]';
  const displayName = user?.name || 'AlumAI Admin';
  const displayEmail = user?.username ? `${user.username}@alumai.io` : 'admin@alumai.io';

  return (
    <motion.div
      layout
      className={clsx("fixed left-0 top-0 h-full flex flex-col z-40 glass-sidebar transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]", w)}
    >
      {/* ── Header ── */}
      <div className={clsx("flex items-center pt-6 pb-4 relative", collapsed ? "px-0 justify-center" : "px-5 justify-between")}>
        <div
          className={clsx("flex items-center gap-3 cursor-pointer group", collapsed && "justify-center")}
          onClick={() => setPage('landing')}
        >
          <div className="relative flex-shrink-0">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, rgba(0,229,155,0.15), rgba(0,212,255,0.08))' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L3 12L12 22L21 12L12 2Z" fill="url(#slg)" />
                <path d="M12 7L7 12L12 17L17 12L12 7Z" fill="url(#slg2)" opacity="0.5" />
                <defs>
                  <linearGradient id="slg" x1="3" y1="2" x2="21" y2="22"><stop stopColor="#00E59B" /><stop offset="1" stopColor="#00D4FF" /></linearGradient>
                  <linearGradient id="slg2" x1="7" y1="7" x2="17" y2="17"><stop stopColor="#00E59B" /><stop offset="1" stopColor="#00D4FF" /></linearGradient>
                </defs>
              </svg>
            </div>
            <div className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: 'radial-gradient(circle, rgba(0,229,155,0.12) 0%, transparent 70%)' }} />
          </div>

          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden whitespace-nowrap"
              >
                <h1 className="font-display font-bold text-[16px] tracking-tight leading-tight" style={{ color: 'var(--text-primary)' }}>
                  Alum<span className="gradient-text">AI</span>
                </h1>
                <p className="font-mono text-[8px] tracking-[0.2em] uppercase" style={{ color: 'var(--text-muted)' }}>Intelligence</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {!collapsed && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              whileTap={{ scale: 0.85 }}
              onClick={() => setCollapsed(true)}
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors haptic"
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {collapsed && (
        <div className="flex justify-center pb-2">
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => setCollapsed(false)}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors haptic"
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </motion.button>
        </div>
      )}

      {/* ── Divider ── */}
      <div className={clsx("h-px", collapsed ? "mx-3" : "mx-5")} style={{ background: 'var(--border)' }} />

      {/* ── Nav Label ── */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="px-6 pt-5 pb-2">
            <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.2em]" style={{ color: 'var(--text-muted)' }}>Menu</p>
          </motion.div>
        )}
      </AnimatePresence>
      {collapsed && <div className="pt-4" />}

      {/* ── Navigation ── */}
      <nav className={clsx("flex-1 space-y-1 overflow-y-auto", collapsed ? "px-2" : "px-3")}>
        {navItems.map((item) => {
          const isActive = currentPage === item.id || (currentPage === 'dataview' && item.id === 'triage');
          const Icon = item.icon;

          return (
            <div key={item.id} className="relative group">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setPage(item.id)}
                className={clsx(
                  "w-full flex items-center rounded-2xl font-sans text-[13px] font-medium transition-all duration-200 relative",
                  collapsed ? "justify-center px-0 py-3" : "gap-3 px-3.5 py-3"
                )}
                style={{
                  background: isActive ? 'var(--gradient-sidebar-active)' : 'transparent',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                }}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-active-bar"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full"
                    style={{ background: 'linear-gradient(180deg, #00E59B, #00D4FF)', boxShadow: '0 0 12px rgba(0,229,155,0.4)' }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}

                <div className={clsx("flex-shrink-0 rounded-xl flex items-center justify-center transition-all duration-200", collapsed ? "w-10 h-10" : "w-9 h-9")}
                  style={{
                    background: isActive ? 'rgba(0,229,155,0.12)' : 'var(--bg-surface)',
                    border: `1px solid ${isActive ? 'rgba(0,229,155,0.15)' : 'var(--border)'}`,
                    boxShadow: isActive ? '0 0 16px rgba(0,229,155,0.08)' : 'none',
                  }}>
                  <Icon className="w-[16px] h-[16px]" style={{ color: isActive ? '#00E59B' : 'var(--text-muted)' }} />
                </div>

                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex-1 text-left overflow-hidden whitespace-nowrap font-semibold text-[13px]"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {item.badge > 0 && (
                  <span className={clsx(
                    "flex items-center justify-center rounded-full text-[9px] font-bold",
                    collapsed ? "absolute -top-0.5 -right-0.5 w-4 h-4" : "min-w-[22px] h-[22px] px-1.5"
                  )}
                    style={{ background: 'linear-gradient(135deg, #FF4D6A, #FF6B8A)', color: '#fff', boxShadow: '0 0 10px rgba(255,77,106,0.3)' }}>
                    {collapsed ? '' : item.badge}
                    {collapsed && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </span>
                )}
              </motion.button>

              {collapsed && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-2 rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 whitespace-nowrap z-50"
                  style={{ background: 'var(--bg-card-solid)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-elevated)' }}>
                  <span className="font-sans text-[12px] font-semibold" style={{ color: 'var(--text-primary)' }}>{item.label}</span>
                  {item.badge > 0 && (
                    <span className="ml-2 px-1.5 py-0.5 rounded-full text-[9px] font-bold" style={{ background: 'rgba(255,77,106,0.15)', color: '#FF4D6A' }}>{item.badge}</span>
                  )}
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-[5px] border-transparent" style={{ borderRightColor: 'var(--border)' }} />
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* ── Bottom ── */}
      <div className={clsx("pb-4 space-y-1.5", collapsed ? "px-2" : "px-3")}>
        <div className={clsx("h-px", collapsed ? "mx-1" : "mx-2")} style={{ background: 'var(--border)' }} />

        {/* Theme Toggle */}
        <div className="relative group">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className={clsx(
              "w-full flex items-center rounded-2xl font-sans text-[12px] font-medium transition-all duration-200",
              collapsed ? "justify-center px-0 py-2.5" : "gap-3 px-3.5 py-2.5"
            )}
            style={{ color: 'var(--text-secondary)' }}
          >
            <div className={clsx("flex-shrink-0 rounded-xl flex items-center justify-center", collapsed ? "w-10 h-10" : "w-9 h-9")}
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
              {theme === 'dark' ? <Sun className="w-4 h-4" style={{ color: '#FFB800' }} /> : <Moon className="w-4 h-4" style={{ color: '#B18CFF' }} />}
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="overflow-hidden whitespace-nowrap">
                  {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
          {collapsed && (
            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-2 rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 whitespace-nowrap z-50"
              style={{ background: 'var(--bg-card-solid)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-elevated)' }}>
              <span className="font-sans text-[12px] font-semibold" style={{ color: 'var(--text-primary)' }}>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
              <div className="absolute right-full top-1/2 -translate-y-1/2 border-[5px] border-transparent" style={{ borderRightColor: 'var(--border)' }} />
            </div>
          )}
        </div>

        {/* Logout Button */}
        <div className="relative group">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleLogout}
            className={clsx(
              "w-full flex items-center rounded-2xl font-sans text-[12px] font-medium transition-all duration-200",
              collapsed ? "justify-center px-0 py-2.5" : "gap-3 px-3.5 py-2.5"
            )}
            style={{ color: 'var(--text-secondary)' }}
          >
            <div className={clsx("flex-shrink-0 rounded-xl flex items-center justify-center", collapsed ? "w-10 h-10" : "w-9 h-9")}
              style={{ background: 'rgba(255,77,106,0.06)', border: '1px solid rgba(255,77,106,0.1)' }}>
              <LogOut className="w-4 h-4" style={{ color: '#FF4D6A' }} />
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="overflow-hidden whitespace-nowrap">
                  Sign Out
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
          {collapsed && (
            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-2 rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 whitespace-nowrap z-50"
              style={{ background: 'var(--bg-card-solid)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-elevated)' }}>
              <span className="font-sans text-[12px] font-semibold" style={{ color: '#FF4D6A' }}>Sign Out</span>
              <div className="absolute right-full top-1/2 -translate-y-1/2 border-[5px] border-transparent" style={{ borderRightColor: 'var(--border)' }} />
            </div>
          )}
        </div>

        {/* Profile */}
        <div className={clsx(
          "rounded-2xl flex items-center transition-all duration-300",
          collapsed ? "justify-center p-2" : "gap-3 p-3"
        )} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
          <div className={clsx(
            "rounded-xl flex items-center justify-center font-display font-bold relative overflow-hidden flex-shrink-0",
            collapsed ? "w-10 h-10 text-[12px]" : "w-9 h-9 text-[11px]"
          )}
            style={{ background: 'linear-gradient(135deg, rgba(0,229,155,0.2), rgba(0,212,255,0.15))', color: '#00E59B' }}>
            {displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2" style={{ background: '#00E59B', borderColor: 'var(--bg-surface)' }} />
          </div>

          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="flex-1 min-w-0 overflow-hidden"
              >
                <p className="font-sans text-[12px] font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{displayName}</p>
                <p className="font-mono text-[9px] truncate" style={{ color: 'var(--text-muted)' }}>{displayEmail}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}