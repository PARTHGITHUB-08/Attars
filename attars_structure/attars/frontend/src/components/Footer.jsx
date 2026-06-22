import { Instagram, Twitter, Youtube, Lock, MapPin, Phone, Mail } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { Link } from 'react-router-dom';

const shopLinks = ['All Attars', 'Floral Collection', 'Woody Collection', 'Spicy Collection', 'Rare & Limited'];
const learnLinks = ['Our Story', 'Deg-Bhapka Process', 'Blog', 'FAQ'];
const supportLinks = [
  { label: 'Contact Us', href: '#contact', external: false },
  { label: 'Shipping Info', href: '#contact', external: false },
  { label: 'Returns Policy', href: '#contact', external: false },
  { label: 'Privacy Policy', href: '#contact', external: false },
  { label: 'Admin Panel', href: '/admin', external: true }
];

export default function Footer() {
  const { showToast } = useToast();

  const handleSocial = (name) => showToast(`Opening ${name}...`);

  return (
    <footer className="relative border-t border-border-subtle bg-surface-1">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14 sm:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-10 mb-14">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-full border border-gold/30 flex items-center justify-center bg-gold-subtle">
                <span className="font-display text-gold text-base font-semibold leading-none">अ</span>
              </div>
              <div className="flex flex-col">
                <span className="font-display text-lg font-semibold text-cream tracking-wide leading-none">ATTARS</span>
                <span className="text-[8px] tracking-[0.25em] uppercase text-gold/50 font-body leading-none mt-0.5">The Soul of Fragrance</span>
              </div>
            </div>
            <p className="text-[13px] text-cream-faint font-body leading-[1.7] mb-5 max-w-xs">
              Handcrafted natural attars. Preserving the pure art of traditional
              steam distillation for the modern fragrance connoisseur.
            </p>

            {/* Contact */}
            <div className="space-y-2 mb-5">
              <div className="flex items-center gap-2.5 text-[12px] text-cream-faint font-body">
                <MapPin className="w-3.5 h-3.5 text-gold/40 flex-shrink-0" />
                <span>Uttar Pradesh, India</span>
              </div>
              <div className="flex items-center gap-2.5 text-[12px] text-cream-faint font-body">
                <Phone className="w-3.5 h-3.5 text-gold/40 flex-shrink-0" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2.5 text-[12px] text-cream-faint font-body">
                <Mail className="w-3.5 h-3.5 text-gold/40 flex-shrink-0" />
                <span>namaste@attars.in</span>
              </div>
            </div>

            {/* Socials */}
            <div className="flex gap-2.5">
              {[
                { Icon: Instagram, name: 'Instagram' },
                { Icon: Twitter, name: 'Twitter' },
                { Icon: Youtube, name: 'YouTube' },
              ].map(({ Icon, name }) => (
                <button
                  key={name}
                  onClick={() => handleSocial(name)}
                  className="w-9 h-9 rounded-full border border-border-subtle flex items-center justify-center hover:border-gold/30 hover:bg-gold-subtle transition-all duration-300"
                  aria-label={name}
                >
                  <Icon className="w-3.5 h-3.5 text-cream-faint" />
                </button>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-[10px] tracking-[0.2em] uppercase text-gold/50 font-body font-semibold mb-4">
              Shop
            </h4>
            <ul className="space-y-2.5">
              {shopLinks.map(l => (
                <li key={l}>
                  <a href="#collection" className="text-[13px] text-cream-faint font-body hover:text-gold transition-colors duration-300">{l}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Learn */}
          <div>
            <h4 className="text-[10px] tracking-[0.2em] uppercase text-gold/50 font-body font-semibold mb-4">
              Learn
            </h4>
            <ul className="space-y-2.5">
              {learnLinks.map(l => (
                <li key={l}>
                  <a href="#legacy" className="text-[13px] text-cream-faint font-body hover:text-gold transition-colors duration-300">{l}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-[10px] tracking-[0.2em] uppercase text-gold/50 font-body font-semibold mb-4">
              Support
            </h4>
            <ul className="space-y-2.5">
              {supportLinks.map(l => (
                <li key={l.label}>
                  {l.external ? (
                    <Link to={l.href} className="text-[13px] text-cream-faint font-body hover:text-gold transition-colors duration-300">{l.label}</Link>
                  ) : (
                    <a href={l.href} className="text-[13px] text-cream-faint font-body hover:text-gold transition-colors duration-300">{l.label}</a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="gold-line mb-6" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-cream-ghost font-body text-center sm:text-left">
            © 2025 Attars. All rights reserved. Crafted with श्रद्धा in India.
          </p>
          <div className="flex items-center gap-5">
            <span className="text-[11px] text-cream-ghost font-body flex items-center gap-1.5">
              🌍 We ship worldwide
            </span>
            <span className="text-[11px] text-cream-ghost font-body flex items-center gap-1.5">
              <Lock className="w-3 h-3" /> Secure Payments
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
