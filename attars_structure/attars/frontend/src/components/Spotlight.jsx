import { ScrollReveal } from '../hooks/useScrollReveal';
import { Check, Crown } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function Spotlight() {
  const { showToast } = useToast();

  return (
    <section className="relative py-20 sm:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <ScrollReveal>
          <div className="rounded-2xl overflow-hidden border border-border-subtle bg-surface-1">
            <div className="grid md:grid-cols-2">
              {/* Image */}
              <div className="relative aspect-square md:aspect-auto min-h-[350px] md:min-h-0">
                <img
                  src="https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=900&h=900&fit=crop&q=80"
                  alt="The Mughal Garden Limited Edition Collection"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-surface-1 hidden md:block" />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-1 to-transparent md:hidden" />
                <div className="absolute top-5 left-5 px-4 py-2 rounded-full bg-surface-0/80 backdrop-blur-md border border-gold/20">
                  <span className="text-[10px] font-body font-semibold tracking-[0.15em] uppercase text-gold">
                    Limited Edition
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-7 sm:p-10 lg:p-14 flex flex-col justify-center">
                <div className="ornament justify-start mb-5">
                  <span className="text-gold text-xs">❊</span>
                </div>

                <h2 className="font-display text-display-sm sm:text-display-md text-cream mb-4 leading-tight">
                  The Mughal <span className="text-gold">Garden</span> Series
                </h2>

                <p className="font-body text-cream-muted text-[14px] leading-[1.8] mb-6">
                  Inspired by the legendary gardens of the Mughal emperors — from Shalimar
                  in Kashmir to Nishat in Srinagar — this limited series captures the fragrance
                  of paradise as envisioned by India's greatest patrons of art and beauty.
                  Three distinct blends, each an olfactory journey through a different garden.
                </p>

                <div className="space-y-3 mb-8">
                  {[
                    'Three signature blends: Shalimar, Nishat, Mehtab',
                    'Housed in hand-painted kalamkari crystal bottles',
                    'Each set includes a brass applicator & silk pouch',
                    'Only 200 sets available worldwide'
                  ].map(item => (
                    <div key={item} className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-gold-subtle border border-gold/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-gold" />
                      </span>
                      <span className="text-[13px] text-cream-muted font-body leading-snug">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-5">
                  <button
                    onClick={() => showToast('Mughal Garden Series added to wishlist!')}
                    className="bg-gold-gradient hover:bg-gold-gradient-hover text-stone-950 px-7 py-3.5 rounded-full text-sm font-body font-semibold tracking-wide inline-flex items-center gap-2 transition-all duration-300 shadow-lg shadow-gold/20 hover:shadow-gold/30 hover:translate-y-[-2px]"
                  >
                    Pre-Order Now
                    <Crown className="w-4 h-4" />
                  </button>
                  <div>
                    <div className="font-display text-2xl font-bold text-gold leading-none">₹18,000</div>
                    <div className="text-[11px] text-cream-ghost font-body mt-0.5">Set of 3 × 12ml</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
