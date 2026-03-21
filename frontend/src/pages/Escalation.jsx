import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle2, Sparkles, RefreshCw } from 'lucide-react';
import ChatBubble from '../components/ChatBubble';
import SeverityPill from '../components/SeverityPill';
import { getEscalatedTickets, sendMessage, finalizeRCA } from '../services/api';

export default function Escalation() {
  const [tickets, setTickets] = useState([]);
  const [activeTicket, setActiveTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const chatEndRef = useRef(null);

  const fetchEscalated = async () => {
    setLoading(true); setError(null);
    try { const e = await getEscalatedTickets(); setTickets(e); if (e.length > 0 && !activeTicket) selectTicket(e[0]); }
    catch (err) { setError(err.message || "Failed."); }
    finally { setLoading(false); }
  };

  const selectTicket = (t) => {
    setActiveTicket(t);
    const h = t.chat_history || [];
    if (h.length > 0) { setMessages(h.map(m => ({ role: m.role === 'assistant' ? 'ai' : m.role, content: m.content }))); }
    else {
      const rca = t.rca_analysis || {};
      setMessages([{ role: 'ai', content: rca.summary ? `Escalated ticket. Initial finding: ${rca.summary}. How should we proceed?` : `Ticket #${t.id} escalated. What would you like to investigate first?` }]);
    }
  };

  useEffect(() => { fetchEscalated(); }, []);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault(); if (!inputValue.trim() || !activeTicket) return;
    const msg = inputValue; setInputValue('');
    setMessages(p => [...p, { role: 'user', content: msg }]); setIsTyping(true);
    try { const r = await sendMessage(activeTicket.id, msg); setMessages(p => [...p, { role: 'ai', content: r.reply }]); }
    catch (err) { setMessages(p => [...p, { role: 'ai', content: `Error: ${err.message || "AI unreachable."}` }]); }
    finally { setIsTyping(false); }
  };

  const confetti = () => {
    for (let i = 0; i < 50; i++) {
      const p = document.createElement('div');
      p.style.cssText = `position:fixed;width:6px;height:6px;border-radius:50%;pointer-events:none;z-index:9999;left:50%;top:50%;background:${['#00E59B','#00D4FF','#B18CFF','#FFB800'][~~(Math.random()*4)]}`;
      document.body.appendChild(p);
      const a = Math.random()*Math.PI*2, v = 12+Math.random()*20;
      p.animate([{transform:'translate(0,0) scale(1)',opacity:1},{transform:`translate(${Math.cos(a)*v}vmax,${Math.sin(a)*v}vmax) scale(0)`,opacity:0}],{duration:1000+Math.random()*800,easing:'cubic-bezier(0,.9,.57,1)'});
      setTimeout(()=>p.remove(),2000);
    }
  };

  const handleFinalize = async () => {
    if (!activeTicket) return;
    try {
      const r = await finalizeRCA(activeTicket.id);
      if (r.status === 'success') {
        confetti(); setToast(`Ticket #${activeTicket.id} Resolved`); setTimeout(()=>setToast(null),3000);
        const nt = tickets.filter(t=>t.id!==activeTicket.id); setTickets(nt);
        if (nt.length>0) selectTicket(nt[0]); else { setActiveTicket(null); setMessages([]); }
      } else setMessages(p=>[...p,{role:'ai',content:`Issue: ${r.message||"Cannot finalize."}`}]);
    } catch(e) { setMessages(p=>[...p,{role:'ai',content:`Error: ${e.message||"Failed."}`}]); }
  };

  return (
    <div className="w-full h-[calc(100vh-96px)] flex gap-4">
      <AnimatePresence>
        {toast && (
          <motion.div initial={{opacity:0,y:-20}} animate={{opacity:1,y:0}} exit={{opacity:0,scale:0.9}}
            className="fixed top-6 right-6 z-50 glass rounded-2xl px-5 py-3.5 flex items-center gap-2.5 glow-ring"
            style={{borderLeft:'3px solid #00E59B'}}>
            <CheckCircle2 className="w-4 h-4" style={{color:'#00E59B'}} />
            <span className="font-sans text-[13px] font-semibold" style={{color:'var(--text-primary)'}}>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Left — Ticket list */}
      <div className="w-[320px] flex-shrink-0 glass rounded-3xl overflow-hidden flex flex-col">
        <div className="p-5 flex justify-between items-center" style={{borderBottom:'1px solid var(--border)'}}>
          <div>
            <h2 className="font-display font-bold text-[15px]" style={{color:'var(--text-primary)'}}>Escalated</h2>
            <p className="font-sans text-[11px] mt-0.5 font-light" style={{color:'var(--text-muted)'}}>Awaiting human review</p>
          </div>
          <motion.button whileTap={{scale:0.9}} onClick={fetchEscalated}
            className="haptic w-9 h-9 rounded-xl flex items-center justify-center" style={{background:'var(--bg-surface)',border:'1px solid var(--border)'}}>
            <RefreshCw className={`w-3.5 h-3.5 ${loading?'animate-spin':''}`} style={{color:'var(--text-muted)'}} />
          </motion.button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {loading ? (
            <div className="text-center p-10"><RefreshCw className="w-5 h-5 animate-spin mx-auto mb-3" style={{color:'#00E59B'}} /><p className="font-sans text-[11px]" style={{color:'var(--text-muted)'}}>Loading...</p></div>
          ) : error ? (
            <div className="text-center p-10 font-sans text-[11px]" style={{color:'#FF4D6A'}}>{error}</div>
          ) : (
            <AnimatePresence>
              {tickets.map(t => (
                <motion.div key={t.id} layout initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,x:-20}}
                  onClick={()=>selectTicket(t)}
                  className="p-4 rounded-2xl cursor-pointer transition-all duration-200 group"
                  style={{
                    background: activeTicket?.id===t.id ? 'rgba(0,229,155,0.04)' : 'transparent',
                    border: `1px solid ${activeTicket?.id===t.id ? 'rgba(0,229,155,0.15)' : 'var(--border)'}`,
                    borderLeft: activeTicket?.id===t.id ? '3px solid #00E59B' : '1px solid var(--border)',
                  }}>
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-mono text-[12px] font-bold" style={{color:'#00E59B'}}>#{t.id}</span>
                    {t.severity && <SeverityPill level={t.severity} />}
                  </div>
                  <p className="font-sans text-[11px] line-clamp-2 mb-1.5 font-light" style={{color:'var(--text-secondary)'}}>{t.description||"No description"}</p>
                  <span className="font-mono text-[9px]" style={{color:'var(--text-muted)'}}>Asset: {t.asset||'Unknown'}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
          {!loading && !error && tickets.length===0 && (
            <div className="text-center p-10 font-sans text-[12px]" style={{color:'var(--text-muted)'}}>No escalated tickets.</div>
          )}
        </div>
      </div>

      {/* Right — Chat */}
      <div className="flex-1 glass rounded-3xl flex flex-col relative overflow-hidden">
        {activeTicket ? (
          <>
            <div className="p-5 flex items-center gap-3.5 flex-shrink-0" style={{borderBottom:'1px solid var(--border)'}}>
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{background:'rgba(0,229,155,0.08)',border:'1px solid rgba(0,229,155,0.12)'}}>
                <Sparkles className="w-4 h-4" style={{color:'#00E59B'}} />
              </div>
              <div>
                <h2 className="font-display font-bold text-[14px] flex items-center gap-2" style={{color:'var(--text-primary)'}}>
                  AI Diagnostic Partner
                  <span className="w-2 h-2 rounded-full animate-pulse" style={{background:'#00E59B',boxShadow:'0 0 8px rgba(0,229,155,0.4)'}} />
                </h2>
                <p className="font-mono text-[10px]" style={{color:'var(--text-muted)'}}>Ticket #{activeTicket.id} · {activeTicket.source}</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {messages.map((m,i) => <ChatBubble key={i} message={m} />)}
              {isTyping && <ChatBubble isTyping />}
              <div ref={chatEndRef} />
            </div>

            <div className="p-4 flex-shrink-0" style={{borderTop:'1px solid var(--border)'}}>
              <form onSubmit={handleSend} className="relative flex items-center">
                <input type="text" value={inputValue} onChange={e=>setInputValue(e.target.value)}
                  placeholder="Describe observations, provide diagnostics..."
                  className="w-full py-3.5 pl-5 pr-14 rounded-2xl font-sans text-[13px] outline-none transition-all duration-200"
                  style={{background:'var(--bg-surface)',color:'var(--text-primary)',border:'1px solid var(--border)'}}
                  onFocus={e=>e.target.style.borderColor='rgba(0,229,155,0.25)'}
                  onBlur={e=>e.target.style.borderColor='var(--border)'} />
                <button type="submit" disabled={!inputValue.trim()||isTyping}
                  className="absolute right-2 w-10 h-10 rounded-xl flex items-center justify-center disabled:opacity-30 transition-all haptic"
                  style={{background:'linear-gradient(135deg, #00E59B, #00D4FF)',color:'#04060C'}}>
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>

            <motion.button whileHover={{scale:1.03}} whileTap={{scale:0.95}} onClick={handleFinalize}
              className="absolute bottom-20 right-6 px-5 py-2.5 rounded-2xl font-display text-[12px] font-bold flex items-center gap-2 z-20"
              style={{background:'linear-gradient(135deg, #00E59B, #00D4FF)',color:'#04060C',boxShadow:'0 0 24px rgba(0,229,155,0.15)'}}>
              <CheckCircle2 className="w-4 h-4" /> FINALIZE RCA
            </motion.button>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center" style={{color:'var(--text-muted)'}}>
            <Sparkles className="w-10 h-10 mb-4 opacity-15" />
            <p className="font-sans text-[13px] font-light">{tickets.length===0?"No escalated tickets.":"Select a ticket to begin."}</p>
          </div>
        )}
      </div>
    </div>
  );
}