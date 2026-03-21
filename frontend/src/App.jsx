// import { useState, useEffect, useCallback, createContext, useContext } from 'react';
// import { AnimatePresence } from 'framer-motion';

// import Sidebar from './components/Sidebar';
// import PageTransition from './components/PageTransition';
// import JarvisOverlay from './components/JarvisOverlay';
// import RCAReportCard from './components/RCAReportCard';

// import Login from './pages/Login';
// import Landing from './pages/Landing';
// import Dashboard from './pages/Dashboard';
// import Triage from './pages/Triage';
// import DataView from './pages/DataView';
// import Escalation from './pages/Escalation';
// import AssetMonitor from './pages/AssetMonitor';

// import { getEscalatedTickets, isAuthenticated, getStoredUser, logout } from './services/api';

// export const ThemeContext = createContext();
// export const useTheme = () => useContext(ThemeContext);

// export const SidebarContext = createContext();
// export const useSidebar = () => useContext(SidebarContext);

// export const AuthContext = createContext();
// export const useAuth = () => useContext(AuthContext);

// export default function App() {
//   const [currentPage, setCurrentPage] = useState("landing");
//   const [selectedSource, setSelectedSource] = useState(null);
//   const [classifyingTicket, setClassifyingTicket] = useState(null);
//   const [rcaResult, setRcaResult] = useState(null);
//   const [escalatedCount, setEscalatedCount] = useState(0);
//   const [classifyError, setClassifyError] = useState(null);
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

//   // Auth state
//   const [user, setUser] = useState(() => getStoredUser());
//   const [authenticated, setAuthenticated] = useState(() => isAuthenticated());

//   // Theme state
//   const [theme, setTheme] = useState(() => {
//     if (typeof window !== 'undefined') return localStorage.getItem('alumai-theme') || 'dark';
//     return 'dark';
//   });

//   const toggleTheme = () => {
//     const next = theme === 'dark' ? 'light' : 'dark';
//     setTheme(next);
//     localStorage.setItem('alumai-theme', next);
//   };

//   useEffect(() => { document.documentElement.className = theme; }, [theme]);

//   // Listen for auth expired events
//   useEffect(() => {
//     const handleAuthExpired = () => {
//       setAuthenticated(false);
//       setUser(null);
//     };
//     window.addEventListener('auth-expired', handleAuthExpired);
//     return () => window.removeEventListener('auth-expired', handleAuthExpired);
//   }, []);

//   const handleLogin = (userData) => {
//     setUser(userData);
//     setAuthenticated(true);
//     setCurrentPage("landing");
//   };

//   const handleLogout = () => {
//     logout();
//     setUser(null);
//     setAuthenticated(false);
//   };

//   const refreshEscalatedCount = useCallback(async () => {
//     try { const e = await getEscalatedTickets(); setEscalatedCount(e.length); }
//     catch { setEscalatedCount(0); }
//   }, []);

//   useEffect(() => {
//     if (!authenticated) return;
//     refreshEscalatedCount();
//     const i = setInterval(refreshEscalatedCount, 30000);
//     return () => clearInterval(i);
//   }, [refreshEscalatedCount, authenticated]);

//   useEffect(() => {
//     if (['dashboard', 'escalation'].includes(currentPage)) refreshEscalatedCount();
//   }, [currentPage, refreshEscalatedCount]);

//   const handleClassifyComplete = (result) => {
//     setClassifyingTicket(null);
//     if (!result) { setClassifyError("Classification failed."); setTimeout(() => setClassifyError(null), 5000); return; }
//     setRcaResult(result);
//     refreshEscalatedCount();
//   };

//   const handleClassifyError = (msg) => { setClassifyingTicket(null); setClassifyError(msg); setTimeout(() => setClassifyError(null), 5000); };
//   const handleEscalate = () => { setRcaResult(null); setCurrentPage("escalation"); refreshEscalatedCount(); };

//   // View saved RCA report for a classified ticket
//   const handleViewReport = (reportData) => {
//     setRcaResult(reportData);
//   };

//   const renderPage = () => {
//     switch (currentPage) {
//       case "landing": return <Landing onEnter={() => setCurrentPage("dashboard")} />;
//       case "dashboard": return <Dashboard onNavigate={setCurrentPage} />;
//       case "triage": return <Triage onSelectSource={(s) => { setSelectedSource(s); setCurrentPage("dataview"); }} />;
//       case "dataview": return (
//         <DataView
//           source={selectedSource}
//           onBack={() => setCurrentPage("triage")}
//           onClassify={(t) => setClassifyingTicket(t)}
//           onViewReport={handleViewReport}
//         />
//       );
//       case "escalation": return <Escalation />;
//       case "monitor": return <AssetMonitor />;
//       default: return <Landing onEnter={() => setCurrentPage("dashboard")} />;
//     }
//   };

//   // ─── NOT AUTHENTICATED → SHOW LOGIN ───
//   if (!authenticated) {
//     return (
//       <ThemeContext.Provider value={{ theme, toggleTheme }}>
//         <div className="noise" style={{ background: 'var(--bg-deep)' }}>
//           <Login onLogin={handleLogin} />
//         </div>
//       </ThemeContext.Provider>
//     );
//   }

//   // ─── AUTHENTICATED → SHOW APP ───
//   const isFullPage = currentPage === "landing";
//   const sidebarWidth = sidebarCollapsed ? '72px' : '270px';

//   return (
//     <ThemeContext.Provider value={{ theme, toggleTheme }}>
//       <SidebarContext.Provider value={{ collapsed: sidebarCollapsed, setCollapsed: setSidebarCollapsed }}>
//         <AuthContext.Provider value={{ user, logout: handleLogout }}>
//           <div className="noise flex h-screen overflow-hidden" style={{ background: 'var(--bg-deep)' }}>
//             <div className="orb w-[600px] h-[600px] -top-40 -right-40 fixed" style={{ background: 'radial-gradient(circle, rgba(0,229,155,0.04) 0%, transparent 70%)', animation: 'meshMove 20s ease-in-out infinite' }} />
//             <div className="orb w-[500px] h-[500px] bottom-0 left-1/4 fixed" style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.03) 0%, transparent 70%)', animation: 'meshMove 25s ease-in-out infinite reverse' }} />

//             {!isFullPage && <Sidebar currentPage={currentPage} setPage={setCurrentPage} escalatedCount={escalatedCount} />}

//             <main className={`flex-1 overflow-y-auto relative ${isFullPage ? '' : 'p-8'}`}
//               style={{ background: 'var(--bg-deep)', marginLeft: isFullPage ? '0' : sidebarWidth, transition: 'margin-left 0.3s cubic-bezier(0.22, 1, 0.36, 1)' }}>
//               <AnimatePresence mode="wait">
//                 <PageTransition key={currentPage}>{renderPage()}</PageTransition>
//               </AnimatePresence>
//             </main>

//             <AnimatePresence>
//               {classifyError && (
//                 <div className="fixed top-6 right-6 z-50 glass rounded-2xl px-5 py-4 font-sans text-sm max-w-md animate-slide-in-up" style={{ color: '#FF4D6A', borderLeft: '3px solid #FF4D6A' }}>
//                   {classifyError}
//                 </div>
//               )}
//             </AnimatePresence>

//             {classifyingTicket && <JarvisOverlay ticket={classifyingTicket} onComplete={handleClassifyComplete} onError={handleClassifyError} />}
//             <AnimatePresence>{rcaResult && <RCAReportCard result={rcaResult} onDismiss={() => setRcaResult(null)} onEscalate={handleEscalate} />}</AnimatePresence>
//           </div>
//         </AuthContext.Provider>
//       </SidebarContext.Provider>
//     </ThemeContext.Provider>
//   );
// }

import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import Sidebar from './components/Sidebar';
import PageTransition from './components/PageTransition';
import JarvisOverlay from './components/JarvisOverlay';
import RCAReportCard from './components/RCAReportCard';

import Login from './pages/Login';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Triage from './pages/Triage';
import DataView from './pages/DataView';
import Escalation from './pages/Escalation';
import AssetMonitor from './pages/AssetMonitor';

import { getEscalatedTickets, isAuthenticated, getStoredUser, logout } from './services/api';
import { Menu, X } from 'lucide-react';

export const ThemeContext = createContext();
export const useTheme = () => useContext(ThemeContext);

export const SidebarContext = createContext();
export const useSidebar = () => useContext(SidebarContext);

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export default function App() {
  const [currentPage, setCurrentPage] = useState("landing");
  const [selectedSource, setSelectedSource] = useState(null);
  const [classifyingTicket, setClassifyingTicket] = useState(null);
  const [rcaResult, setRcaResult] = useState(null);
  const [escalatedCount, setEscalatedCount] = useState(0);
  const [classifyError, setClassifyError] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [user, setUser] = useState(() => getStoredUser());
  const [authenticated, setAuthenticated] = useState(() => isAuthenticated());

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('alumai-theme') || 'dark';
    return 'dark';
  });

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('alumai-theme', next);
  };

  useEffect(() => { document.documentElement.className = theme; }, [theme]);

  useEffect(() => {
    const handleAuthExpired = () => { setAuthenticated(false); setUser(null); };
    window.addEventListener('auth-expired', handleAuthExpired);
    return () => window.removeEventListener('auth-expired', handleAuthExpired);
  }, []);

  const handleLogin = (userData) => { setUser(userData); setAuthenticated(true); setCurrentPage("landing"); };
  const handleLogout = () => { logout(); setUser(null); setAuthenticated(false); };

  const refreshEscalatedCount = useCallback(async () => {
    try { const e = await getEscalatedTickets(); setEscalatedCount(e.length); }
    catch { setEscalatedCount(0); }
  }, []);

  useEffect(() => {
    if (!authenticated) return;
    refreshEscalatedCount();
    const i = setInterval(refreshEscalatedCount, 30000);
    return () => clearInterval(i);
  }, [refreshEscalatedCount, authenticated]);

  useEffect(() => {
    if (['dashboard', 'escalation'].includes(currentPage)) refreshEscalatedCount();
  }, [currentPage, refreshEscalatedCount]);

  const navigateTo = (page) => { setCurrentPage(page); setMobileMenuOpen(false); };

  const handleClassifyComplete = (result) => {
    setClassifyingTicket(null);
    if (!result) { setClassifyError("Classification failed."); setTimeout(() => setClassifyError(null), 5000); return; }
    setRcaResult(result);
    refreshEscalatedCount();
  };

  const handleClassifyError = (msg) => { setClassifyingTicket(null); setClassifyError(msg); setTimeout(() => setClassifyError(null), 5000); };
  const handleEscalate = () => { setRcaResult(null); navigateTo("escalation"); refreshEscalatedCount(); };
  const handleViewReport = (reportData) => { setRcaResult(reportData); };

  const renderPage = () => {
    switch (currentPage) {
      case "landing": return <Landing onEnter={() => navigateTo("dashboard")} />;
      case "dashboard": return <Dashboard onNavigate={navigateTo} />;
      case "triage": return <Triage onSelectSource={(s) => { setSelectedSource(s); navigateTo("dataview"); }} />;
      case "dataview": return (
        <DataView source={selectedSource} onBack={() => navigateTo("triage")}
          onClassify={(t) => setClassifyingTicket(t)} onViewReport={handleViewReport} />
      );
      case "escalation": return <Escalation />;
      case "monitor": return <AssetMonitor />;
      default: return <Landing onEnter={() => navigateTo("dashboard")} />;
    }
  };

  if (!authenticated) {
    return (
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <div className="noise" style={{ background: 'var(--bg-deep)' }}><Login onLogin={handleLogin} /></div>
      </ThemeContext.Provider>
    );
  }

  const isFullPage = currentPage === "landing";
  const sidebarWidth = sidebarCollapsed ? '72px' : '270px';

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <SidebarContext.Provider value={{ collapsed: sidebarCollapsed, setCollapsed: setSidebarCollapsed }}>
        <AuthContext.Provider value={{ user, logout: handleLogout }}>
          <div className="noise flex h-screen overflow-hidden" style={{ background: 'var(--bg-deep)' }}>
            <div className="orb w-[600px] h-[600px] -top-40 -right-40 fixed" style={{ background: 'radial-gradient(circle, rgba(0,229,155,0.04) 0%, transparent 70%)', animation: 'meshMove 20s ease-in-out infinite' }} />
            <div className="orb w-[500px] h-[500px] bottom-0 left-1/4 fixed" style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.03) 0%, transparent 70%)', animation: 'meshMove 25s ease-in-out infinite reverse' }} />

            {/* Desktop Sidebar */}
            {!isFullPage && !isMobile && (
              <Sidebar currentPage={currentPage} setPage={navigateTo} escalatedCount={escalatedCount} />
            )}

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
              {mobileMenuOpen && isMobile && !isFullPage && (
                <>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 z-40" style={{ background: 'rgba(4,6,12,0.7)', backdropFilter: 'blur(8px)' }}
                    onClick={() => setMobileMenuOpen(false)} />
                  <motion.div initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="fixed left-0 top-0 h-full z-50">
                    <Sidebar currentPage={currentPage} setPage={navigateTo} escalatedCount={escalatedCount} />
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            {/* Mobile Top Bar */}
            {!isFullPage && isMobile && (
              <div className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-3 glass-sidebar"
                style={{ borderBottom: '1px solid var(--border)' }}>
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="w-10 h-10 rounded-xl flex items-center justify-center haptic"
                  style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                  {mobileMenuOpen ? <X className="w-5 h-5" style={{ color: 'var(--text-primary)' }} /> : <Menu className="w-5 h-5" style={{ color: 'var(--text-primary)' }} />}
                </motion.button>
                <div className="flex items-center gap-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L3 12L12 22L21 12L12 2Z" fill="url(#mobLg)" />
                    <defs><linearGradient id="mobLg" x1="3" y1="2" x2="21" y2="22"><stop stopColor="#00E59B" /><stop offset="1" stopColor="#00D4FF" /></linearGradient></defs>
                  </svg>
                  <span className="font-display font-bold text-[14px]" style={{ color: 'var(--text-primary)' }}>Alum<span className="gradient-text">AI</span></span>
                </div>
                <div className="w-10" />
              </div>
            )}

            {/* Main Content */}
            <main
              className={`flex-1 overflow-y-auto relative ${isFullPage ? '' : 'p-3 sm:p-4 md:p-6 lg:p-8'}`}
              style={{
                background: 'var(--bg-deep)',
                marginLeft: isFullPage ? '0' : (isMobile ? '0' : sidebarWidth),
                paddingTop: !isFullPage && isMobile ? '70px' : undefined,
                transition: 'margin-left 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
              }}>
              <AnimatePresence mode="wait">
                <PageTransition key={currentPage}>{renderPage()}</PageTransition>
              </AnimatePresence>
            </main>

            <AnimatePresence>
              {classifyError && (
                <div className="fixed top-20 md:top-6 right-4 md:right-6 z-50 glass rounded-2xl px-4 md:px-5 py-3 md:py-4 font-sans text-sm max-w-[90vw] md:max-w-md" style={{ color: '#FF4D6A', borderLeft: '3px solid #FF4D6A' }}>
                  {classifyError}
                </div>
              )}
            </AnimatePresence>

            {classifyingTicket && <JarvisOverlay ticket={classifyingTicket} onComplete={handleClassifyComplete} onError={handleClassifyError} />}
            <AnimatePresence>{rcaResult && <RCAReportCard result={rcaResult} onDismiss={() => setRcaResult(null)} onEscalate={handleEscalate} />}</AnimatePresence>
          </div>
        </AuthContext.Provider>
      </SidebarContext.Provider>
    </ThemeContext.Provider>
  );
}