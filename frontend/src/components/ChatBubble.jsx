import { motion } from 'framer-motion';
import clsx from 'clsx';
import { Bot, User } from 'lucide-react';

export default function ChatBubble({ message, isTyping }) {
  if (isTyping) {
    return (
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex w-full justify-start mb-5">
        <div className="flex items-end gap-2.5 max-w-[80%]">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mb-1" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
            <Bot className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
          </div>
          <div className="rounded-2xl rounded-bl-lg px-4 py-3" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
            <div className="flex gap-1.5 items-center h-4">
              {[0, 0.2, 0.4].map((d, i) => (
                <span key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: '#00E59B', animation: `typing-dot 1.4s infinite ${d}s` }} />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  const isUser = message.role === 'user';

  return (
    <motion.div initial={{ opacity: 0, y: 8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
      className={clsx("flex w-full mb-5", isUser ? "justify-end" : "justify-start")}>
      <div className={clsx("flex items-end gap-2.5 max-w-[80%]", isUser ? "flex-row-reverse" : "flex-row")}>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mb-1"
          style={{
            background: isUser ? 'linear-gradient(135deg, #00E59B, #00D4FF)' : 'var(--bg-surface)',
            border: isUser ? 'none' : '1px solid var(--border)',
          }}>
          {isUser ? <User className="w-3.5 h-3.5" style={{ color: '#04060C' }} /> : <Bot className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />}
        </div>
        <div className={clsx("px-5 py-3.5 text-[13px] leading-relaxed font-sans rounded-2xl", isUser ? "rounded-br-lg" : "rounded-bl-lg")}
          style={{
            background: isUser ? 'linear-gradient(135deg, rgba(0,229,155,0.15), rgba(0,212,255,0.08))' : 'var(--bg-surface)',
            color: isUser ? 'var(--text-primary)' : 'var(--text-primary)',
            border: `1px solid ${isUser ? 'rgba(0,229,155,0.15)' : 'var(--border)'}`,
            boxShadow: isUser ? '0 0 20px rgba(0,229,155,0.05)' : 'none',
          }}>
          {message.content}
        </div>
      </div>
    </motion.div>
  );
}