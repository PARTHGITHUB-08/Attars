import { ScrollReveal } from '../hooks/useScrollReveal';
import { Leaf, Droplets, Beaker, Sparkles } from 'lucide-react';

const steps = [
  {
    icon: Leaf,
    step: '01',
    title: 'Ethical Sourcing',
    desc: 'We ethically source wild-grown and organic botanicals at their peak aromatic hour — hand-harvested Damask Rose at dawn and Night Jasmine at midnight to capture the absolute highest concentration of volatile oils.',
    detail: 'Damask Rose: Kannauj | Jasmine: Madurai | Saffron: Pampore'
  },
  {
    icon: Droplets,
    step: '02',
    title: 'Hydro-Distillation',
    desc: 'Aromatic compounds are extracted using low-temperature, vacuum-regulated hydro-distillation. This gentle process protects the delicate top notes from thermal damage, preserving absolute olfactory fidelity.',
    detail: 'Method: Vacuum Hydro | Heat: Controlled Low-Temp | Yield: 100% Pure'
  },
  {
    icon: Beaker,
    step: '03',
    title: 'Sandalwood Maturation',
    desc: 'Precious botanical extracts are matured directly inside a base of aged Mysore Sandalwood carrier oil, creating a rich, living fixative that naturally binds and amplifies the complex fragrance layers.',
    detail: 'Carrier: Aged Mysore Sandalwood | Ratio: Pure Oil Base'
  },
  {
    icon: Sparkles,
    step: '04',
    title: 'Cellared Maceration',
    desc: 'The final compositions are cellared in amber glass vessels for six months. This slow resting period allows the molecular layers to settle, smoothing raw notes and developing maximum longevity.',
    detail: 'Cellaring: 6 Months | Temperature: 18°C Controlled'
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
            Artisanal Craftsmanship
          </span>
          <h2 className="font-display text-display-md sm:text-display-lg text-cream mt-4">
            The Journey of <span className="text-gold">Creation</span>
          </h2>
          <p className="font-body text-cream-faint text-sm max-w-lg mx-auto mt-4 leading-relaxed">
            Composing luxury fragrances through low-temperature hydro-distillation, sandalwood oil maturation,
            and cellared maceration to capture the true depth of nature.
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
