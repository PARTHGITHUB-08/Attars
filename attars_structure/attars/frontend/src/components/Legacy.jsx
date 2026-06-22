import { ScrollReveal } from '../hooks/useScrollReveal';
import { ArrowRight } from 'lucide-react';

export default function Legacy() {
  const handleNav = (e, href) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="legacy" className="relative py-20 sm:py-28 md:py-36 overflow-hidden">
      <div className="absolute top-0 left-0 w-full gold-line" />

      <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
        {/* Text */}
        <ScrollReveal direction="up">
          <div className="ornament mb-6">
            <span className="text-gold text-sm">❊</span>
          </div>

          <h2 className="font-display text-display-md sm:text-display-lg text-cream mb-6 leading-tight">
            The Art of Pure{' '}
            <span className="text-gold">Fragrance</span>
          </h2>

          <p className="font-body text-cream-muted leading-[1.8] mb-5 text-[15px] max-w-2xl mx-auto">
            We believe in preserving the traditional art of <strong className="text-cream-dark font-semibold">Deg-Bhapka</strong>,
            a steam distillation technique that captures the true essence of nature. By using local copper stills and pure base ingredients,
            we create fragrances that honor time-tested methods while appealing to the modern olfactory sensibility.
          </p>

          <p className="font-body text-cream-faint leading-[1.8] mb-8 text-[15px] max-w-2xl mx-auto">
            Each attar is crafted with hours of patient distillation, where delicate flowers harvested at dawn
            surrender their volatile souls into a base of pure sandalwood oil. No synthetic chemicals,
            and no artificial shortcuts. Just the pure, unadulterated soul of nature.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mb-8 py-6 border-y border-border-subtle max-w-xl mx-auto">
            <div>
              <div className="text-xl font-display font-bold text-cream">100%</div>
              <div className="text-[11px] text-cream-faint font-body mt-1 leading-tight">
                Natural<br />Ingredients
              </div>
            </div>
            <div>
              <div className="text-xl font-display font-bold text-cream">Pure</div>
              <div className="text-[11px] text-cream-faint font-body mt-1 leading-tight">
                Sandalwood<br />Base Oil
              </div>
            </div>
            <div>
              <div className="text-xl font-display font-bold text-cream">Zero</div>
              <div className="text-[11px] text-cream-faint font-body mt-1 leading-tight">
                Synthetics
              </div>
            </div>
          </div>

          <a
            href="#collection"
            onClick={e => handleNav(e, '#collection')}
            className="inline-flex items-center gap-2 text-gold font-body text-sm font-medium hover:gap-3 transition-all duration-300 group"
          >
            Discover our collection
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </ScrollReveal>
      </div>
    </section>
  );
}
