import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import MobileMenu from './MobileMenu';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { count, setCartOpen } = useCart();
  const { showToast } = useToast();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { label: 'Legacy', href: '#legacy' },
    { label: 'Collection', href: '#collection' },
    { label: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-surface-0/90 backdrop-blur-xl border-b border-border-subtle shadow-lg shadow-black/20'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 sm:h-[72px] flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-full border border-gold/30 flex items-center justify-center group-hover:border-gold/60 transition-colors duration-300 bg-gold-subtle">
              <span className="font-display text-gold text-base font-semibold leading-none">अ</span>
            </div>
            <div className="flex flex-col">
              <span className="font-display text-lg font-semibold text-cream tracking-wide leading-none">
                ATTRAZ
              </span>
              <span className="text-[8px] tracking-[0.25em] uppercase text-gold/50 font-body leading-none mt-0.5">
                The Soul of Fragrance
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-8">
            {links.map(l => (
              <a
                key={l.href}
                href={l.href}
                onClick={e => handleNavClick(e, l.href)}
                className="relative text-[13px] font-body font-medium text-cream-muted hover:text-gold transition-colors duration-300 tracking-wide"
              >
                {l.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold transition-all duration-300 hover:w-full" />
              </a>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => showToast('Search coming soon')}
              className="hidden sm:flex w-9 h-9 items-center justify-center rounded-full border border-border-subtle hover:border-gold/30 hover:bg-gold-subtle transition-all duration-300"
              aria-label="Search"
            >
              <Search className="w-[15px] h-[15px] text-cream-muted" />
            </button>
            <button
              onClick={() => setCartOpen(true)}
              className="relative w-9 h-9 flex items-center justify-center rounded-full border border-border-subtle hover:border-gold/30 hover:bg-gold-subtle transition-all duration-300"
              aria-label="Cart"
            >
              <ShoppingBag className="w-[15px] h-[15px] text-cream-muted" />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-gold text-stone-950 text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                  {count}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-full border border-border-subtle hover:border-gold/30 transition-all duration-300"
              aria-label="Menu"
            >
              <Menu className="w-[15px] h-[15px] text-cream" />
            </button>
          </div>
        </div>
      </nav>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} links={links} onNavClick={handleNavClick} />
    </>
  );
}
