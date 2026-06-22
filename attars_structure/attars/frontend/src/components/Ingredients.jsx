import { ScrollReveal } from '../hooks/useScrollReveal';
import { Flower, Trees, Sparkles, Moon, Flame, Leaf } from 'lucide-react';

const ingredients = [
  { icon: Flower, name: 'Damask Rose', origin: 'UP, India', desc: 'Harvested at 4 AM, requires 5,000 roses for 12ml attar', color: 'from-rose-900/20 to-rose-950/5' },
  { icon: Trees, name: 'Sandalwood', origin: 'Mysore, Karnataka', desc: 'Government-regulated plantations, trees aged 30+ years', color: 'from-amber-900/20 to-amber-950/5' },
  { icon: Sparkles, name: 'Kashmiri Saffron', origin: 'Pampore, Kashmir', desc: 'Grade-1 Mongra, 300+ hand-picked stigmas per gram', color: 'from-orange-900/20 to-orange-950/5' },
  { icon: Moon, name: 'Night Jasmine', origin: 'Madurai, TN', desc: 'Picked between midnight and 4 AM at peak potency', color: 'from-emerald-900/20 to-emerald-950/5' },
  { icon: Flame, name: 'Wild Agarwood', origin: 'Assam', desc: 'Naturally infected Aquilaria trees, 20+ year formation', color: 'from-stone-800/20 to-stone-950/5' },
  { icon: Leaf, name: 'Holy Tulsi', origin: 'Ayurvedic Farms', desc: 'Three sacred varieties: Krishna, Rama, and Vana Tulsi', color: 'from-green-900/20 to-green-950/5' },
];

export default function Ingredients() {
  return (
    <section id="ingredients" className="relative py-20 sm:py-28 bg-surface-1 overflow-hidden">
      <div className="absolute top-0 left-0 w-full gold-line" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gold/[0.02] blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
        <ScrollReveal className="text-center mb-12 sm:mb-16">
          <span className="text-[11px] tracking-[0.3em] uppercase text-gold/60 font-body font-medium">
            Gifts of the Earth
          </span>
          <h2 className="font-display text-display-md sm:text-display-lg text-cream mt-4 mb-4">
            Sacred <span className="text-gold">Ingredients</span>
          </h2>
          <p className="font-body text-cream-faint text-sm max-w-lg mx-auto leading-relaxed">
            Sourced from the finest origins across India — each ingredient is chosen
            for its purity, potency, and connection to the land.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {ingredients.map((ing, i) => (
            <ScrollReveal key={ing.name} delay={i * 80}>
              <div className="group relative rounded-2xl border border-border-subtle bg-surface-0/60 overflow-hidden hover:border-border-default transition-all duration-500 hover:-translate-y-1">
                {/* Gradient top bar */}
                <div className={`h-1 bg-gradient-to-r ${ing.color} opacity-60 group-hover:opacity-100 transition-opacity duration-500`} />

                <div className="p-5 sm:p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl border border-border-subtle bg-gold-subtle flex items-center justify-center flex-shrink-0 group-hover:border-gold/25 group-hover:bg-gold-muted transition-all duration-500">
                      <ing.icon className="w-5 h-5 text-gold/50 group-hover:text-gold transition-colors duration-500" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display text-base font-semibold text-cream mb-0.5">{ing.name}</h3>
                      <p className="text-[11px] text-gold/60 font-body tracking-wide uppercase mb-2">{ing.origin}</p>
                      <p className="text-[13px] text-cream-faint font-body leading-relaxed">{ing.desc}</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
