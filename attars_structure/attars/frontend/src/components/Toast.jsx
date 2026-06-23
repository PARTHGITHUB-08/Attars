import { useToast } from '../context/ToastContext';
import { CheckCircle, AlertCircle, X } from 'lucide-react';
import { useEffect, useState } from 'react';

function ToastItem({ id, message, type, onRemove }) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setExiting(true);
      setTimeout(() => onRemove(id), 300);
    }, 3200);
    return () => clearTimeout(t);
  }, [id, onRemove]);

  return (
    <div
      className={`flex items-start gap-3 px-5 py-4 rounded-xl bg-surface-3/95 backdrop-blur-xl border border-border-default shadow-2xl shadow-black/40 max-w-sm transition-all duration-300 ${
        exiting ? 'opacity-0 translate-x-8' : 'opacity-100 translate-x-0'
      }`}
    >
      {type === 'success' ? (
        <CheckCircle className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
      ) : (
        <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
      )}
      <p className="text-[13px] text-cream-muted font-body leading-snug flex-1">{message}</p>
      <button onClick={() => { setExiting(true); setTimeout(() => onRemove(id), 300); }} className="flex-shrink-0">
        <X className="w-3.5 h-3.5 text-cream-ghost hover:text-cream-muted transition-colors" />
      </button>
    </div>
  );
}

export default function Toast() {
  const { toasts, removeToast } = useToast();

  const handleRemove = (id) => {
    if (removeToast) removeToast(id);
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-6 right-6 z-[100] flex flex-col gap-2.5">
      {toasts.map(t => (
        <ToastItem key={t.id} {...t} onRemove={handleRemove} />
      ))}
    </div>
  );
}
