// import { useState } from 'react';
// import { motion } from 'framer-motion';
// import { Eye, EyeOff, Lock, User, AlertCircle, Loader2 } from 'lucide-react';
// import { login } from '../services/api';

// /* ── Floating glass cards that move in the background ── */
// const FloatingCard = ({ children, x, y, w, h, delay, duration, rotate }) => (
//   <motion.div
//     className="absolute rounded-3xl pointer-events-none"
//     style={{
//       left: `${x}%`, top: `${y}%`, width: w, height: h,
//       background: 'rgba(255,255,255,0.02)',
//       border: '1px solid rgba(255,255,255,0.04)',
//       backdropFilter: 'blur(8px)',
//     }}
//     animate={{
//       y: [0, -20, 0],
//       x: [0, 10, 0],
//       rotate: [rotate || 0, (rotate || 0) + 3, rotate || 0],
//     }}
//     transition={{ duration: duration || 8, delay: delay || 0, repeat: Infinity, ease: "easeInOut" }}
//   >
//     {children}
//   </motion.div>
// );

// /* ── Scrolling text marquee ── */
// const Marquee = ({ text, direction = 'left', speed = 30, className = '' }) => (
//   <div className={`overflow-hidden whitespace-nowrap ${className}`}>
//     <motion.div
//       className="inline-flex gap-12"
//       animate={{ x: direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%'] }}
//       transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
//     >
//       {[...Array(2)].map((_, i) => (
//         <span key={i} className="inline-flex gap-12 font-display font-extrabold tracking-tight" style={{ color: 'rgba(255,255,255,0.03)', fontSize: '80px' }}>
//           {text.split('·').map((t, j) => <span key={j}>{t.trim()}</span>)}
//         </span>
//       ))}
//     </motion.div>
//   </div>
// );

// export default function Login({ onLogin }) {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!username.trim() || !password.trim()) { setError('Please enter both fields'); return; }
//     setLoading(true); setError('');
//     try {
//       const data = await login(username, password);
//       onLogin(data.user);
//     } catch (err) { setError(err.message || 'Invalid credentials'); }
//     finally { setLoading(false); }
//   };

//   return (
//     <div className="min-h-screen w-full flex relative overflow-hidden" style={{ background: '#04060C' }}>

//       {/* ════════════════════════════════════════
//           LEFT — Visual / Branding Side
//           ════════════════════════════════════════ */}
//       <div className="hidden lg:flex w-[55%] relative items-center justify-center overflow-hidden">

//         {/* Base gradient */}
//         <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, #04060C 0%, #061210 40%, #080C18 100%)' }} />

//         {/* Scrolling text backgrounds */}
//         <div className="absolute top-[15%] left-0 right-0">
//           <Marquee text="INTELLIGENT · DIAGNOSTICS · MAINTENANCE · AI · POWERED" direction="left" speed={40} />
//         </div>
//         <div className="absolute top-[45%] left-0 right-0">
//           <Marquee text="ROOT · CAUSE · ANALYSIS · AUTOMATED · TRIAGE · ENGINE" direction="right" speed={35} />
//         </div>
//         <div className="absolute top-[75%] left-0 right-0">
//           <Marquee text="INDUSTRIAL · PLANT · MONITORING · EMERALD · INTELLIGENCE" direction="left" speed={45} />
//         </div>

//         {/* Floating glass cards */}
//         <FloatingCard x={8} y={12} w="180px" h="120px" delay={0} duration={9} rotate={-6}>
//           <div className="p-5">
//             <div className="flex items-center gap-2 mb-3">
//               <div className="w-6 h-6 rounded-lg" style={{ background: 'rgba(0,229,155,0.15)' }} />
//               <div className="w-16 h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }} />
//             </div>
//             <div className="space-y-2">
//               <div className="w-full h-1.5 rounded-full" style={{ background: 'rgba(0,229,155,0.08)' }} />
//               <div className="w-3/4 h-1.5 rounded-full" style={{ background: 'rgba(0,229,155,0.05)' }} />
//             </div>
//           </div>
//         </FloatingCard>

//         <FloatingCard x={65} y={8} w="160px" h="160px" delay={1.5} duration={10} rotate={8}>
//           <div className="p-5 flex flex-col items-center justify-center h-full">
//             <div className="w-12 h-12 rounded-2xl mb-3 flex items-center justify-center" style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.1)' }}>
//               <div className="w-5 h-5 rounded-full" style={{ background: 'rgba(0,212,255,0.2)' }} />
//             </div>
//             <div className="w-16 h-1.5 rounded-full mb-1.5" style={{ background: 'rgba(255,255,255,0.06)' }} />
//             <div className="w-10 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.03)' }} />
//           </div>
//         </FloatingCard>

//         <FloatingCard x={15} y={62} w="200px" h="100px" delay={0.8} duration={8} rotate={3}>
//           <div className="p-5">
//             <div className="flex gap-2 mb-3">
//               {['#00E59B', '#FFB800', '#00D4FF', '#FF4D6A'].map((c, i) => (
//                 <div key={i} className="flex-1 h-8 rounded-lg" style={{ background: `${c}08`, border: `1px solid ${c}10` }} />
//               ))}
//             </div>
//             <div className="w-full h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.04)' }} />
//           </div>
//         </FloatingCard>

//         <FloatingCard x={55} y={70} w="150px" h="130px" delay={2} duration={11} rotate={-4}>
//           <div className="p-5">
//             <div className="flex items-end gap-1.5 h-16">
//               {[40, 65, 45, 80, 55, 70].map((h, i) => (
//                 <div key={i} className="flex-1 rounded-sm" style={{ height: `${h}%`, background: `rgba(0,229,155,${0.05 + i * 0.02})` }} />
//               ))}
//             </div>
//             <div className="mt-3 w-12 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }} />
//           </div>
//         </FloatingCard>

//         <FloatingCard x={35} y={25} w="140px" h="90px" delay={3} duration={9} rotate={5}>
//           <div className="p-4 flex items-center gap-3">
//             <div className="w-10 h-10 rounded-xl" style={{ background: 'rgba(177,140,255,0.08)', border: '1px solid rgba(177,140,255,0.1)' }} />
//             <div className="space-y-1.5">
//               <div className="w-14 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }} />
//               <div className="w-10 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.03)' }} />
//             </div>
//           </div>
//         </FloatingCard>

//         {/* Gradient orbs */}
//         <div className="absolute w-[500px] h-[500px] top-[-15%] left-[-10%] rounded-full" style={{ background: 'radial-gradient(circle, rgba(0,229,155,0.06) 0%, transparent 60%)', filter: 'blur(80px)' }} />
//         <div className="absolute w-[400px] h-[400px] bottom-[-10%] right-[5%] rounded-full" style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.04) 0%, transparent 60%)', filter: 'blur(60px)' }} />

//         {/* Main branding content */}
//         <div className="relative z-10 max-w-lg px-16">
//           <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>

//             {/* Logo */}
//             <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-10 relative"
//               style={{ background: 'linear-gradient(135deg, rgba(0,229,155,0.1), rgba(0,212,255,0.05))', border: '1px solid rgba(0,229,155,0.08)' }}>
//               <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
//                 <path d="M12 2L3 12L12 22L21 12L12 2Z" fill="url(#bLg)" />
//                 <path d="M12 7L7 12L12 17L17 12L12 7Z" fill="url(#bLg2)" opacity="0.4" />
//                 <defs>
//                   <linearGradient id="bLg" x1="3" y1="2" x2="21" y2="22"><stop stopColor="#00E59B" /><stop offset="1" stopColor="#00D4FF" /></linearGradient>
//                   <linearGradient id="bLg2" x1="7" y1="7" x2="17" y2="17"><stop stopColor="#00E59B" /><stop offset="1" stopColor="#00D4FF" /></linearGradient>
//                 </defs>
//               </svg>
//               <motion.div className="absolute -inset-3 rounded-3xl" animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 3, repeat: Infinity }}
//                 style={{ background: 'radial-gradient(circle, rgba(0,229,155,0.08) 0%, transparent 70%)' }} />
//             </div>

//             {/* Headline */}
//             <h1 className="font-display font-extrabold text-[52px] leading-[1.05] tracking-tight mb-6">
//               <span style={{ color: '#F0F2F8' }}>Industrial</span><br />
//               <span style={{ color: '#F0F2F8' }}>Intelligence,</span><br />
//               <span className="gradient-text">Reimagined.</span>
//             </h1>

//             <p className="font-sans text-[16px] leading-relaxed font-light mb-10" style={{ color: 'rgba(255,255,255,0.4)' }}>
//               AI-powered maintenance diagnostics that transform how industrial plants detect, analyze, and resolve equipment failures.
//             </p>

//             {/* Stats row */}
//             <div className="flex gap-8">
//               {[
//                 { value: '5', label: 'AI Agents' },
//                 { value: '98%', label: 'Accuracy' },
//                 { value: '<3s', label: 'Analysis' },
//               ].map((s, i) => (
//                 <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + i * 0.1 }}>
//                   <p className="font-display font-extrabold text-2xl tracking-tight" style={{ color: '#00E59B' }}>{s.value}</p>
//                   <p className="font-mono text-[9px] uppercase tracking-[0.2em] mt-1" style={{ color: 'rgba(255,255,255,0.25)' }}>{s.label}</p>
//                 </motion.div>
//               ))}
//             </div>
//           </motion.div>
//         </div>

//         {/* Bottom bar */}
//         <div className="absolute bottom-0 left-0 right-0 px-16 py-6 flex items-center justify-between" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
//           <p className="font-mono text-[9px] uppercase tracking-[0.2em]" style={{ color: 'rgba(255,255,255,0.15)' }}>AlumAI Emerald Intelligence v2.0</p>
//           <div className="flex gap-4">
//             {['Diagnostics', 'RCA Engine', 'Asset Monitor'].map((t, i) => (
//               <span key={i} className="font-mono text-[9px]" style={{ color: 'rgba(255,255,255,0.1)' }}>{t}</span>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* ════════════════════════════════════════
//           RIGHT — Login Form
//           ════════════════════════════════════════ */}
//       <div className="w-full lg:w-[45%] flex items-center justify-center relative" style={{ background: '#080C18' }}>

//         {/* Subtle gradient */}
//         <div className="absolute inset-0 opacity-50" style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(0,229,155,0.03) 0%, transparent 60%)' }} />

//         {/* Border line between panels */}
//         <div className="hidden lg:block absolute left-0 top-[10%] bottom-[10%] w-px" style={{ background: 'linear-gradient(180deg, transparent, rgba(0,229,155,0.1), transparent)' }} />

//         <motion.div
//           initial={{ y: 30, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
//           className="relative z-10 w-full max-w-[380px] mx-8"
//         >
//           {/* Mobile logo — only shows on small screens */}
//           <div className="lg:hidden text-center mb-10">
//             <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
//               style={{ background: 'linear-gradient(135deg, rgba(0,229,155,0.1), rgba(0,212,255,0.05))', border: '1px solid rgba(0,229,155,0.08)' }}>
//               <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
//                 <path d="M12 2L3 12L12 22L21 12L12 2Z" fill="url(#mLg)" />
//                 <defs><linearGradient id="mLg" x1="3" y1="2" x2="21" y2="22"><stop stopColor="#00E59B" /><stop offset="1" stopColor="#00D4FF" /></linearGradient></defs>
//               </svg>
//             </div>
//             <h1 className="font-display font-extrabold text-2xl tracking-tight" style={{ color: '#F0F2F8' }}>
//               Alum<span className="gradient-text">AI</span>
//             </h1>
//           </div>

//           {/* Welcome text */}
//           <div className="mb-8">
//             <h2 className="font-display font-bold text-[26px] tracking-tight mb-2" style={{ color: '#F0F2F8' }}>Welcome back</h2>
//             <p className="font-sans text-[14px] font-light" style={{ color: 'rgba(255,255,255,0.35)' }}>Sign in to access your command center</p>
//           </div>

//           {/* Form */}
//           <form onSubmit={handleSubmit} className="space-y-5">

//             {/* Username */}
//             <div>
//               <label className="font-mono text-[9px] uppercase tracking-[0.2em] mb-2.5 block" style={{ color: 'rgba(255,255,255,0.3)' }}>Username</label>
//               <div className="relative group">
//                 <div className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center pointer-events-none rounded-l-2xl"
//                   style={{ background: 'rgba(255,255,255,0.02)' }}>
//                   <User className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.2)' }} />
//                 </div>
//                 <input
//                   type="text"
//                   value={username}
//                   onChange={e => { setUsername(e.target.value); setError(''); }}
//                   placeholder="Enter username"
//                   className="w-full py-3.5 pl-12 pr-4 rounded-2xl font-sans text-[14px] outline-none transition-all duration-300"
//                   style={{
//                     background: 'rgba(255,255,255,0.03)',
//                     color: '#F0F2F8',
//                     border: '1px solid rgba(255,255,255,0.06)',
//                   }}
//                   onFocus={e => { e.target.style.borderColor = 'rgba(0,229,155,0.3)'; e.target.style.background = 'rgba(0,229,155,0.02)'; }}
//                   onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.06)'; e.target.style.background = 'rgba(255,255,255,0.03)'; }}
//                 />
//               </div>
//             </div>

//             {/* Password */}
//             <div>
//               <label className="font-mono text-[9px] uppercase tracking-[0.2em] mb-2.5 block" style={{ color: 'rgba(255,255,255,0.3)' }}>Password</label>
//               <div className="relative group">
//                 <div className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center pointer-events-none rounded-l-2xl"
//                   style={{ background: 'rgba(255,255,255,0.02)' }}>
//                   <Lock className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.2)' }} />
//                 </div>
//                 <input
//                   type={showPassword ? 'text' : 'password'}
//                   value={password}
//                   onChange={e => { setPassword(e.target.value); setError(''); }}
//                   placeholder="Enter password"
//                   className="w-full py-3.5 pl-12 pr-12 rounded-2xl font-sans text-[14px] outline-none transition-all duration-300"
//                   style={{
//                     background: 'rgba(255,255,255,0.03)',
//                     color: '#F0F2F8',
//                     border: '1px solid rgba(255,255,255,0.06)',
//                   }}
//                   onFocus={e => { e.target.style.borderColor = 'rgba(0,229,155,0.3)'; e.target.style.background = 'rgba(0,229,155,0.02)'; }}
//                   onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.06)'; e.target.style.background = 'rgba(255,255,255,0.03)'; }}
//                 />
//                 <button type="button" onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-4 top-1/2 -translate-y-1/2 haptic p-1 rounded-lg transition-colors"
//                   style={{ color: 'rgba(255,255,255,0.2)' }}
//                   onMouseEnter={e => e.target.style.color = 'rgba(255,255,255,0.5)'}
//                   onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.2)'}>
//                   {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//                 </button>
//               </div>
//             </div>

//             {/* Error */}
//             {error && (
//               <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
//                 className="flex items-center gap-2.5 px-4 py-3 rounded-2xl"
//                 style={{ background: 'rgba(255,77,106,0.06)', border: '1px solid rgba(255,77,106,0.1)' }}>
//                 <AlertCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#FF4D6A' }} />
//                 <span className="font-sans text-[13px]" style={{ color: '#FF4D6A' }}>{error}</span>
//               </motion.div>
//             )}

//             {/* Submit */}
//             <motion.button
//               type="submit"
//               disabled={loading}
//               whileHover={!loading ? { scale: 1.01 } : {}}
//               whileTap={!loading ? { scale: 0.98 } : {}}
//               className="w-full py-4 rounded-2xl font-display font-bold text-[15px] flex items-center justify-center gap-2.5 haptic disabled:opacity-60 relative overflow-hidden group"
//               style={{ background: 'linear-gradient(135deg, #00E59B, #00D4FF)', color: '#04060C' }}
//             >
//               {loading ? (
//                 <><Loader2 className="w-5 h-5 animate-spin" /> Authenticating...</>
//               ) : (
//                 <span className="relative z-10">Sign In</span>
//               )}
//               {/* Shimmer */}
//               {!loading && (
//                 <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
//                   style={{ background: 'linear-gradient(90deg, transparent 25%, rgba(255,255,255,0.15) 50%, transparent 75%)', backgroundSize: '200% 100%', animation: 'shimmer 2s linear infinite' }} />
//               )}
//             </motion.button>

//             {/* Divider */}
//             <div className="flex items-center gap-4 py-2">
//               <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.04)' }} />
//               <span className="font-mono text-[9px] uppercase tracking-[0.2em]" style={{ color: 'rgba(255,255,255,0.15)' }}>Secured Access</span>
//               <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.04)' }} />
//             </div>
//           </form>

//           {/* Security badges */}
//           <div className="flex items-center justify-center gap-4 mt-4">
//             {[
//               { icon: '🔒', text: 'JWT Auth' },
//               { icon: '🛡️', text: 'Encrypted' },
//               { icon: '⚡', text: '24h Token' },
//             ].map((b, i) => (
//               <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 + i * 0.1 }}
//                 className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl"
//                 style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
//                 <span className="text-[10px]">{b.icon}</span>
//                 <span className="font-mono text-[9px]" style={{ color: 'rgba(255,255,255,0.2)' }}>{b.text}</span>
//               </motion.div>
//             ))}
//           </div>

//           {/* Hint */}
//           <p className="text-center mt-8 font-mono text-[10px]" style={{ color: 'rgba(255,255,255,0.12)' }}>
//             Default: admin / Sai
//           </p>
//         </motion.div>
//       </div>
//     </div>
//   );
// }

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, User, AlertCircle, Loader2 } from 'lucide-react';
import { login, healthCheck } from '../services/api';

const FloatingCard = ({ children, x, y, w, h, delay, duration, rotate }) => (
  <motion.div
    className="absolute rounded-3xl pointer-events-none"
    style={{
      left: `${x}%`, top: `${y}%`, width: w, height: h,
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.04)',
      backdropFilter: 'blur(8px)',
    }}
    animate={{
      y: [0, -20, 0],
      x: [0, 10, 0],
      rotate: [rotate || 0, (rotate || 0) + 3, rotate || 0],
    }}
    transition={{ duration: duration || 8, delay: delay || 0, repeat: Infinity, ease: "easeInOut" }}
  >
    {children}
  </motion.div>
);

const Marquee = ({ text, direction = 'left', speed = 30, className = '' }) => (
  <div className={`overflow-hidden whitespace-nowrap ${className}`}>
    <motion.div
      className="inline-flex gap-12"
      animate={{ x: direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%'] }}
      transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
    >
      {[...Array(2)].map((_, i) => (
        <span key={i} className="inline-flex gap-12 font-display font-extrabold tracking-tight" style={{ color: 'rgba(255,255,255,0.03)', fontSize: '80px' }}>
          {text.split('·').map((t, j) => <span key={j}>{t.trim()}</span>)}
        </span>
      ))}
    </motion.div>
  </div>
);

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Authenticating...');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) { setError('Please enter both fields'); return; }
    setLoading(true); setError('');

    try {
      // First wake up the server
      setLoadingText('Connecting to server...');
      try { await healthCheck(); } catch { /* server waking up, ignore */ }

      // Now login
      setLoadingText('Authenticating...');
      const data = await login(username, password);
      onLogin(data.user);
    } catch (err) {
      const msg = err.message || 'Login failed';
      if (msg.includes('timeout') || msg.includes('Network Error') || msg.includes('ECONNABORTED')) {
        setError('Server is waking up — please try again in 15 seconds.');
      } else {
        setError(msg);
      }
    }
    finally { setLoading(false); setLoadingText('Authenticating...'); }
  };

  return (
    <div className="min-h-screen w-full flex relative overflow-hidden" style={{ background: '#04060C' }}>

      <div className="hidden lg:flex w-[55%] relative items-center justify-center overflow-hidden">

        <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, #04060C 0%, #061210 40%, #080C18 100%)' }} />

        <div className="absolute top-[15%] left-0 right-0">
          <Marquee text="INTELLIGENT · DIAGNOSTICS · MAINTENANCE · AI · POWERED" direction="left" speed={40} />
        </div>
        <div className="absolute top-[45%] left-0 right-0">
          <Marquee text="ROOT · CAUSE · ANALYSIS · AUTOMATED · TRIAGE · ENGINE" direction="right" speed={35} />
        </div>
        <div className="absolute top-[75%] left-0 right-0">
          <Marquee text="INDUSTRIAL · PLANT · MONITORING · EMERALD · INTELLIGENCE" direction="left" speed={45} />
        </div>

        <FloatingCard x={8} y={12} w="180px" h="120px" delay={0} duration={9} rotate={-6}>
          <div className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-lg" style={{ background: 'rgba(0,229,155,0.15)' }} />
              <div className="w-16 h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }} />
            </div>
            <div className="space-y-2">
              <div className="w-full h-1.5 rounded-full" style={{ background: 'rgba(0,229,155,0.08)' }} />
              <div className="w-3/4 h-1.5 rounded-full" style={{ background: 'rgba(0,229,155,0.05)' }} />
            </div>
          </div>
        </FloatingCard>

        <FloatingCard x={65} y={8} w="160px" h="160px" delay={1.5} duration={10} rotate={8}>
          <div className="p-5 flex flex-col items-center justify-center h-full">
            <div className="w-12 h-12 rounded-2xl mb-3 flex items-center justify-center" style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.1)' }}>
              <div className="w-5 h-5 rounded-full" style={{ background: 'rgba(0,212,255,0.2)' }} />
            </div>
            <div className="w-16 h-1.5 rounded-full mb-1.5" style={{ background: 'rgba(255,255,255,0.06)' }} />
            <div className="w-10 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.03)' }} />
          </div>
        </FloatingCard>

        <FloatingCard x={15} y={62} w="200px" h="100px" delay={0.8} duration={8} rotate={3}>
          <div className="p-5">
            <div className="flex gap-2 mb-3">
              {['#00E59B', '#FFB800', '#00D4FF', '#FF4D6A'].map((c, i) => (
                <div key={i} className="flex-1 h-8 rounded-lg" style={{ background: `${c}08`, border: `1px solid ${c}10` }} />
              ))}
            </div>
            <div className="w-full h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.04)' }} />
          </div>
        </FloatingCard>

        <FloatingCard x={55} y={70} w="150px" h="130px" delay={2} duration={11} rotate={-4}>
          <div className="p-5">
            <div className="flex items-end gap-1.5 h-16">
              {[40, 65, 45, 80, 55, 70].map((h, i) => (
                <div key={i} className="flex-1 rounded-sm" style={{ height: `${h}%`, background: `rgba(0,229,155,${0.05 + i * 0.02})` }} />
              ))}
            </div>
            <div className="mt-3 w-12 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }} />
          </div>
        </FloatingCard>

        <FloatingCard x={35} y={25} w="140px" h="90px" delay={3} duration={9} rotate={5}>
          <div className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl" style={{ background: 'rgba(177,140,255,0.08)', border: '1px solid rgba(177,140,255,0.1)' }} />
            <div className="space-y-1.5">
              <div className="w-14 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }} />
              <div className="w-10 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.03)' }} />
            </div>
          </div>
        </FloatingCard>

        <div className="absolute w-[500px] h-[500px] top-[-15%] left-[-10%] rounded-full" style={{ background: 'radial-gradient(circle, rgba(0,229,155,0.06) 0%, transparent 60%)', filter: 'blur(80px)' }} />
        <div className="absolute w-[400px] h-[400px] bottom-[-10%] right-[5%] rounded-full" style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.04) 0%, transparent 60%)', filter: 'blur(60px)' }} />

        <div className="relative z-10 max-w-lg px-16">
          <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>

            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-10 relative"
              style={{ background: 'linear-gradient(135deg, rgba(0,229,155,0.1), rgba(0,212,255,0.05))', border: '1px solid rgba(0,229,155,0.08)' }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L3 12L12 22L21 12L12 2Z" fill="url(#bLg)" />
                <path d="M12 7L7 12L12 17L17 12L12 7Z" fill="url(#bLg2)" opacity="0.4" />
                <defs>
                  <linearGradient id="bLg" x1="3" y1="2" x2="21" y2="22"><stop stopColor="#00E59B" /><stop offset="1" stopColor="#00D4FF" /></linearGradient>
                  <linearGradient id="bLg2" x1="7" y1="7" x2="17" y2="17"><stop stopColor="#00E59B" /><stop offset="1" stopColor="#00D4FF" /></linearGradient>
                </defs>
              </svg>
              <motion.div className="absolute -inset-3 rounded-3xl" animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 3, repeat: Infinity }}
                style={{ background: 'radial-gradient(circle, rgba(0,229,155,0.08) 0%, transparent 70%)' }} />
            </div>

            <h1 className="font-display font-extrabold text-[52px] leading-[1.05] tracking-tight mb-6">
              <span style={{ color: '#F0F2F8' }}>Industrial</span><br />
              <span style={{ color: '#F0F2F8' }}>Intelligence,</span><br />
              <span className="gradient-text">Reimagined.</span>
            </h1>

            <p className="font-sans text-[16px] leading-relaxed font-light mb-10" style={{ color: 'rgba(255,255,255,0.4)' }}>
              AI-powered maintenance diagnostics that transform how industrial plants detect, analyze, and resolve equipment failures.
            </p>

            <div className="flex gap-8">
              {[
                { value: '5', label: 'AI Agents' },
                { value: '98%', label: 'Accuracy' },
                { value: '<3s', label: 'Analysis' },
              ].map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + i * 0.1 }}>
                  <p className="font-display font-extrabold text-2xl tracking-tight" style={{ color: '#00E59B' }}>{s.value}</p>
                  <p className="font-mono text-[9px] uppercase tracking-[0.2em] mt-1" style={{ color: 'rgba(255,255,255,0.25)' }}>{s.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 px-16 py-6 flex items-center justify-between" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
          <p className="font-mono text-[9px] uppercase tracking-[0.2em]" style={{ color: 'rgba(255,255,255,0.15)' }}>AlumAI Emerald Intelligence v2.0</p>
          <div className="flex gap-4">
            {['Diagnostics', 'RCA Engine', 'Asset Monitor'].map((t, i) => (
              <span key={i} className="font-mono text-[9px]" style={{ color: 'rgba(255,255,255,0.1)' }}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full lg:w-[45%] flex items-center justify-center relative" style={{ background: '#080C18' }}>

        <div className="absolute inset-0 opacity-50" style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(0,229,155,0.03) 0%, transparent 60%)' }} />
        <div className="hidden lg:block absolute left-0 top-[10%] bottom-[10%] w-px" style={{ background: 'linear-gradient(180deg, transparent, rgba(0,229,155,0.1), transparent)' }} />

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 w-full max-w-[380px] mx-8"
        >
          <div className="lg:hidden text-center mb-10">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{ background: 'linear-gradient(135deg, rgba(0,229,155,0.1), rgba(0,212,255,0.05))', border: '1px solid rgba(0,229,155,0.08)' }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L3 12L12 22L21 12L12 2Z" fill="url(#mLg)" />
                <defs><linearGradient id="mLg" x1="3" y1="2" x2="21" y2="22"><stop stopColor="#00E59B" /><stop offset="1" stopColor="#00D4FF" /></linearGradient></defs>
              </svg>
            </div>
            <h1 className="font-display font-extrabold text-2xl tracking-tight" style={{ color: '#F0F2F8' }}>
              Alum<span className="gradient-text">AI</span>
            </h1>
          </div>

          <div className="mb-8">
            <h2 className="font-display font-bold text-[26px] tracking-tight mb-2" style={{ color: '#F0F2F8' }}>Welcome back</h2>
            <p className="font-sans text-[14px] font-light" style={{ color: 'rgba(255,255,255,0.35)' }}>Sign in to access your command center</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="font-mono text-[9px] uppercase tracking-[0.2em] mb-2.5 block" style={{ color: 'rgba(255,255,255,0.3)' }}>Username</label>
              <div className="relative group">
                <div className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center pointer-events-none rounded-l-2xl"
                  style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <User className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.2)' }} />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={e => { setUsername(e.target.value); setError(''); }}
                  placeholder="Enter username"
                  className="w-full py-3.5 pl-12 pr-4 rounded-2xl font-sans text-[14px] outline-none transition-all duration-300"
                  style={{ background: 'rgba(255,255,255,0.03)', color: '#F0F2F8', border: '1px solid rgba(255,255,255,0.06)' }}
                  onFocus={e => { e.target.style.borderColor = 'rgba(0,229,155,0.3)'; e.target.style.background = 'rgba(0,229,155,0.02)'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.06)'; e.target.style.background = 'rgba(255,255,255,0.03)'; }}
                />
              </div>
            </div>

            <div>
              <label className="font-mono text-[9px] uppercase tracking-[0.2em] mb-2.5 block" style={{ color: 'rgba(255,255,255,0.3)' }}>Password</label>
              <div className="relative group">
                <div className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center pointer-events-none rounded-l-2xl"
                  style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <Lock className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.2)' }} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                  placeholder="Enter password"
                  className="w-full py-3.5 pl-12 pr-12 rounded-2xl font-sans text-[14px] outline-none transition-all duration-300"
                  style={{ background: 'rgba(255,255,255,0.03)', color: '#F0F2F8', border: '1px solid rgba(255,255,255,0.06)' }}
                  onFocus={e => { e.target.style.borderColor = 'rgba(0,229,155,0.3)'; e.target.style.background = 'rgba(0,229,155,0.02)'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.06)'; e.target.style.background = 'rgba(255,255,255,0.03)'; }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 haptic p-1 rounded-lg transition-colors"
                  style={{ color: 'rgba(255,255,255,0.2)' }}
                  onMouseEnter={e => e.target.style.color = 'rgba(255,255,255,0.5)'}
                  onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.2)'}>
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2.5 px-4 py-3 rounded-2xl"
                style={{ background: 'rgba(255,77,106,0.06)', border: '1px solid rgba(255,77,106,0.1)' }}>
                <AlertCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#FF4D6A' }} />
                <span className="font-sans text-[13px]" style={{ color: '#FF4D6A' }}>{error}</span>
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={!loading ? { scale: 1.01 } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
              className="w-full py-4 rounded-2xl font-display font-bold text-[15px] flex items-center justify-center gap-2.5 haptic disabled:opacity-60 relative overflow-hidden group"
              style={{ background: 'linear-gradient(135deg, #00E59B, #00D4FF)', color: '#04060C' }}
            >
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> {loadingText}</>
              ) : (
                <span className="relative z-10">Sign In</span>
              )}
              {!loading && (
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: 'linear-gradient(90deg, transparent 25%, rgba(255,255,255,0.15) 50%, transparent 75%)', backgroundSize: '200% 100%', animation: 'shimmer 2s linear infinite' }} />
              )}
            </motion.button>

            <div className="flex items-center gap-4 py-2">
              <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.04)' }} />
              <span className="font-mono text-[9px] uppercase tracking-[0.2em]" style={{ color: 'rgba(255,255,255,0.15)' }}>Secured Access</span>
              <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.04)' }} />
            </div>
          </form>

          <div className="flex items-center justify-center gap-4 mt-4">
            {[
              { icon: '🔒', text: 'JWT Auth' },
              { icon: '🛡️', text: 'Encrypted' },
              { icon: '⚡', text: '24h Token' },
            ].map((b, i) => (
              <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 + i * 0.1 }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                <span className="text-[10px]">{b.icon}</span>
                <span className="font-mono text-[9px]" style={{ color: 'rgba(255,255,255,0.2)' }}>{b.text}</span>
              </motion.div>
            ))}
          </div>

          <p className="text-center mt-8 font-mono text-[10px]" style={{ color: 'rgba(255,255,255,0.12)' }}>
            Default: admin / Sai
          </p>
        </motion.div>
      </div>
    </div>
  );
}