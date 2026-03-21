import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileSpreadsheet, CheckCircle2, AlertTriangle, X, Loader2 } from 'lucide-react';

export default function FileUpload({ onUpload, title, subtitle, accept = '.xlsx,.xls' }) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && (dropped.name.endsWith('.xlsx') || dropped.name.endsWith('.xls'))) {
      setFile(dropped);
      setError(null);
      setResult(null);
    } else {
      setError('Please upload an Excel file (.xlsx or .xls)');
    }
  }, []);

  const handleSelect = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setError(null);
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file || uploading) return;
    setUploading(true);
    setError(null);
    setResult(null);
    try {
      const res = await onUpload(file);
      setResult(res);
      setFile(null);
    } catch (err) {
      setError(err.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleClear = () => {
    setFile(null);
    setError(null);
    setResult(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className="w-full">
      <input ref={inputRef} type="file" accept={accept} onChange={handleSelect} className="hidden" />

      {/* Drop Zone */}
      <motion.div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !file && inputRef.current?.click()}
        animate={{
          borderColor: isDragging ? 'rgba(0,229,155,0.5)' : file ? 'rgba(0,229,155,0.2)' : 'var(--border)',
          background: isDragging ? 'rgba(0,229,155,0.04)' : 'transparent',
        }}
        className="relative rounded-2xl border-2 border-dashed p-8 cursor-pointer transition-all duration-300 group overflow-hidden"
        style={{ background: 'transparent' }}
      >
        {/* Hover/drag glow */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(0,229,155,0.03) 0%, transparent 70%)' }} />

        {!file ? (
          /* Empty state — drag prompt */
          <div className="relative z-10 flex flex-col items-center text-center">
            <motion.div
              animate={{ y: isDragging ? -4 : 0 }}
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
              style={{
                background: isDragging ? 'rgba(0,229,155,0.12)' : 'var(--bg-surface)',
                border: `1px solid ${isDragging ? 'rgba(0,229,155,0.2)' : 'var(--border)'}`,
              }}
            >
              <Upload className="w-6 h-6" style={{ color: isDragging ? '#00E59B' : 'var(--text-muted)' }} />
            </motion.div>

            <p className="font-display font-semibold text-[15px] mb-1" style={{ color: 'var(--text-primary)' }}>
              {isDragging ? 'Drop it here' : title || 'Upload Excel File'}
            </p>
            <p className="font-sans text-[12px] mb-4" style={{ color: 'var(--text-muted)' }}>
              {subtitle || 'Drag and drop your .xlsx file, or click to browse'}
            </p>

            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] px-2.5 py-1 rounded-lg"
                style={{ background: 'var(--bg-surface)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                .xlsx
              </span>
              <span className="font-mono text-[10px] px-2.5 py-1 rounded-lg"
                style={{ background: 'var(--bg-surface)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                .xls
              </span>
              <span className="font-mono text-[10px]" style={{ color: 'var(--text-muted)' }}>Max 10MB</span>
            </div>
          </div>
        ) : (
          /* File selected state */
          <div className="relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(0,229,155,0.08)', border: '1px solid rgba(0,229,155,0.15)' }}>
                <FileSpreadsheet className="w-5 h-5" style={{ color: '#00E59B' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-sans text-[14px] font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{file.name}</p>
                <p className="font-mono text-[11px]" style={{ color: 'var(--text-muted)' }}>{formatSize(file.size)}</p>
              </div>
              <motion.button whileTap={{ scale: 0.9 }} onClick={(e) => { e.stopPropagation(); handleClear(); }}
                className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 haptic"
                style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                <X className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
              </motion.button>
            </div>

            <div className="mt-4 flex gap-3">
              <motion.button whileTap={{ scale: 0.95 }} onClick={(e) => { e.stopPropagation(); handleUpload(); }}
                disabled={uploading}
                className="flex-1 py-3 rounded-xl font-display text-[13px] font-bold flex items-center justify-center gap-2 haptic disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #00E59B, #00D4FF)', color: '#04060C' }}>
                {uploading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</>
                ) : (
                  <><Upload className="w-4 h-4" /> Upload & Process</>
                )}
              </motion.button>
              <motion.button whileTap={{ scale: 0.95 }} onClick={(e) => { e.stopPropagation(); handleClear(); }}
                className="px-5 py-3 rounded-xl font-sans text-[12px] font-medium haptic"
                style={{ color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                Cancel
              </motion.button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Upload progress bar when uploading */}
      <AnimatePresence>
        {uploading && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="mt-3">
            <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '90%' }}
                transition={{ duration: 8, ease: 'linear' }}
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #00E59B, #00D4FF)' }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success message */}
      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="mt-4 rounded-2xl p-4 flex items-center gap-3"
            style={{ background: 'rgba(0,229,155,0.06)', border: '1px solid rgba(0,229,155,0.12)' }}>
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: '#00E59B' }} />
            <div>
              <p className="font-sans text-[13px] font-semibold" style={{ color: '#00E59B' }}>Upload successful</p>
              <p className="font-mono text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                {result.total_in_db ? `${result.total_in_db} total tickets in database` :
                 result.count ? `${result.count} records loaded` :
                 'Data processed successfully'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="mt-4 rounded-2xl p-4 flex items-center gap-3"
            style={{ background: 'rgba(255,77,106,0.06)', border: '1px solid rgba(255,77,106,0.12)' }}>
            <AlertTriangle className="w-5 h-5 flex-shrink-0" style={{ color: '#FF4D6A' }} />
            <div>
              <p className="font-sans text-[13px] font-semibold" style={{ color: '#FF4D6A' }}>Upload failed</p>
              <p className="font-mono text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}