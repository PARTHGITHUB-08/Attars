import { X } from 'lucide-react';
import { useEffect } from 'react';

export default function MobileMenu({ open, onClose, links, onNavClick }) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-surface-0/98 backdrop-blur-2xl flex flex-col items-center justify-center gap-7 animate-[fadeIn_0.3s_ease]">
      <button
        onClick={onClose}
        className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center rounded-full border border-border-subtle hover:border-gold/30 transition-colors"
        aria-label="Close menu"
      >
        <X className="w-5 h-5 text-cream" />
      </button>

      <div className="ornament mb-4">
        <span className="text-gold text-xs">❊</span>
      </div>

      {links.map((l, i) => (
        <a
          key={l.href}
          href={l.href}
          onClick={e => onNavClick(e, l.href)}
          className="font-display text-3xl font-semibold text-cream hover:text-gold transition-colors duration-300"
          style={{ animationDelay: `${i * 80}ms` }}
        >
          {l.label}
        </a>
      ))}

      <div className="ornament mt-6">
        <span className="text-gold text-xs">❊</span>
      </div>
      <p className="text-xs text-cream-ghost font-body tracking-widest uppercase mt-2">Pure Natural Fragrances</p>
    </div>
  );
}
