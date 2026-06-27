import { useState } from 'react';
import { ScrollReveal } from '../hooks/useScrollReveal';
import { Send } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import api from '../api/axios';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await api.post('/newsletter/subscribe', { email });
      showToast('Welcome to the family! Check your email for 10% off.');
      setEmail('');
    } catch (err) {
      showToast(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="relative py-20 sm:py-28 overflow-hidden">
      <div className="absolute top-0 left-0 w-full gold-line" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gold/[0.025] blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-xl mx-auto px-5 sm:px-8 text-center">
        <ScrollReveal>
          <div className="ornament mb-6">
            <span className="text-gold text-sm">❊</span>
          </div>

          <h2 className="font-display text-display-md sm:text-display-lg text-cream mb-4">
            Join the <span className="text-gold">Fragrance</span> Family
          </h2>
          <p className="font-body text-cream-faint text-sm leading-relaxed mb-10">
            Receive stories from our distillery, early access to rare editions,
            and a welcome gift of <span className="text-gold font-medium">10% off</span> your first order.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Your email address"
              required
              className="flex-1 px-5 py-3.5 rounded-full bg-surface-2 border border-border-subtle text-cream placeholder-cream-ghost font-body text-sm focus:outline-none focus:border-gold/40 focus:ring-1 focus:ring-gold/20 transition-all duration-300"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-gold-gradient hover:bg-gold-gradient-hover text-stone-950 px-7 py-3.5 rounded-full text-sm font-body font-semibold tracking-wide whitespace-nowrap inline-flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-gold/20 hover:shadow-gold/30 hover:translate-y-[-2px] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-surface-0/30 border-t-surface-0 rounded-full animate-spin" />
              ) : (
                <>
                  Subscribe
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
          <p className="text-[10px] text-cream-ghost font-body mt-4 tracking-wide">
            No spam. Only fragrance. Unsubscribe anytime.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
