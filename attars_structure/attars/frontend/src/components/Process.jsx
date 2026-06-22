import { ScrollReveal } from '../hooks/useScrollReveal';
import { Flower2, Flame, Droplets, Gem } from 'lucide-react';

const steps = [
  {
    icon: Flower2,
    step: '01',
    title: 'Harvesting',
    desc: 'Flowers plucked by hand at dawn — before sunrise opens the petals and evaporates the precious essential oils. Each picker harvests only 2-3 kg per morning.',
    detail: 'Rose: 4-6 AM | Jasmine: 12-4 AM | Saffron: Oct-Nov only'
  },
  {
    icon: Flame,
    step: '02',
    title: 'Deg-Bhapka',
    desc: 'Copper stills (Deg) filled with flowers and water sit over cow-dung fires. A receiver (Bhapka) containing sandalwood oil sits in a water bath to capture condensing vapours.',
    detail: 'Temperature: 80-90°C | Duration: 15-20 hours continuous'
  },
  {
    icon: Droplets,
    step: '03',
    title: 'Absorption',
    desc: 'As aromatic vapours condense, they mix with water and flow into the Bhapka where sandalwood oil absorbs the fragrance molecules. Water is drained; oil remains enriched.',
    detail: 'Ratio: 1kg flowers → ~10ml pure attar'
  },
  {
    icon: Gem,
    step: '04',
    title: 'Maturation',
    desc: 'The raw attar is sealed in traditional kuppis (earthen pots) or deer-skin bottles for months. The fragrance deepens, mellows, and reaches its full complexity over time.',
    detail: 'Aging: 3-12 months | Some attars improve for years'
  }
];

export default function Process() {
  return (
    <section className="relative py-20 sm:py-28 bg-surface-1 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-surface-0 via-transparent to-surface-0 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gold/[0.02] blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
        <ScrollReveal className="text-center mb-14 sm:mb-20">
          <span className="text-[11px] tracking-[0.3em] uppercase text-gold/60 font-body font-medium">
            The Sacred Process
          </span>
          <h2 className="font-display text-display-md sm:text-display-lg text-cream mt-4">
            From Petal to <span className="text-gold">Attar</span>
          </h2>
          <p className="font-body text-cream-faint text-sm max-w-lg mx-auto mt-4 leading-relaxed">
            A 400-year-old technique that modern chemistry cannot replicate — the Deg-Bhapka
            method preserves the complete olfactory fingerprint of each flower.
          </p>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {steps.map((s, i) => (
            <ScrollReveal key={s.step} delay={i * 120}>
              <div className="group relative rounded-2xl border border-border-subtle bg-surface-0/60 p-6 sm:p-7 hover:border-border-default hover:bg-surface-2/50 transition-all duration-500 h-full">
                {/* Step number */}
                <div className="absolute top-5 right-5 text-[10px] tracking-[0.2em] font-body text-gold/30 font-medium">
                  STEP {s.step}
                </div>

                {/* Icon */}
                <div className="w-14 h-14 rounded-xl border border-border-subtle bg-gold-subtle flex items-center justify-center mb-5 group-hover:border-gold/25 group-hover:bg-gold-muted transition-all duration-500">
                  <s.icon className="w-6 h-6 text-gold/60 group-hover:text-gold transition-colors duration-500" strokeWidth={1.5} />
                </div>

                <h3 className="font-display text-display-sm text-cream mb-3">{s.title}</h3>
                <p className="font-body text-cream-faint text-[13px] leading-[1.7] mb-4">{s.desc}</p>
                <div className="pt-3 border-t border-border-subtle">
                  <p className="text-[10px] tracking-wider uppercase text-cream-ghost font-body">{s.detail}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
