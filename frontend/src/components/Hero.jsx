import { motion } from 'framer-motion';
import { ArrowRight, PlayCircle } from 'lucide-react';

export default function Hero() {
  const handleNav = (e, href) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1595425964272-fc617fa16e18?w=1920&h=1080&fit=crop&q=80"
          alt=""
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-surface-0 via-surface-0/70 to-surface-0" />
        <div className="absolute inset-0 bg-gradient-to-r from-surface-0/60 to-transparent" />
      </div>

      {/* Ambient glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-gold/[0.04] blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-saffron/[0.03] blur-[80px]" />

      {/* Corner ornaments */}
      <div className="absolute top-6 left-6 sm:top-10 sm:left-10 w-16 h-16 sm:w-20 sm:h-20 border-t border-l border-gold/15 rounded-tl-lg" />
      <div className="absolute top-6 right-6 sm:top-10 sm:right-10 w-16 h-16 sm:w-20 sm:h-20 border-t border-r border-gold/15 rounded-tr-lg" />
      <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 w-16 h-16 sm:w-20 sm:h-20 border-b border-l border-gold/15 rounded-bl-lg" />
      <div className="absolute bottom-6 right-6 sm:bottom-10 sm:right-10 w-16 h-16 sm:w-20 sm:h-20 border-b border-r border-gold/15 rounded-br-lg" />

      {/* Content */}
      <div className="relative z-10 text-center px-5 max-w-4xl mx-auto pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mb-7"
        >
          <span className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-gold/20 bg-gold-subtle backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
            <span className="text-[11px] font-body font-medium tracking-[0.2em] uppercase text-gold">
              Premium Natural Saurabh · Handcrafted in Small Batches
            </span>
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-display text-display-xl sm:text-display-lg md:text-display-xl mb-6"
        >
          <span className="text-cream">Where Tradition</span>
          <br />
          <span className="text-gold-shimmer">Meets the Soul</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="font-accent text-xl sm:text-2xl md:text-[1.7rem] text-cream-muted italic max-w-2xl mx-auto mb-3 leading-relaxed"
        >
          "शुभ्र गंधं सर्वभूतानाम्"
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="font-body text-sm sm:text-base text-cream-faint max-w-xl mx-auto mb-10 leading-relaxed"
        >
          Natural perfumes composed through traditional hydro-distillation — pure botanical extracts,
          organic carriers, and masterly patience.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#collection"
            onClick={e => handleNav(e, '#collection')}
            className="w-full sm:w-auto bg-gold-gradient hover:bg-gold-gradient-hover text-stone-950 px-8 py-4 rounded-full text-sm font-body font-semibold tracking-wide flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-gold/20 hover:shadow-gold/30 hover:translate-y-[-2px]"
          >
            Explore Collection
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="#legacy"
            onClick={e => handleNav(e, '#legacy')}
            className="w-full sm:w-auto border border-gold/30 hover:border-gold/50 text-gold hover:bg-gold-subtle px-8 py-4 rounded-full text-sm font-body font-medium tracking-wide flex items-center justify-center gap-2 transition-all duration-300"
          >
            <PlayCircle className="w-4 h-4" />
            Our Story
          </a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="mt-16 sm:mt-20 flex flex-col items-center gap-2"
        >
          <span className="text-[9px] tracking-[0.35em] uppercase text-cream-ghost font-body">
            Scroll to explore
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="w-px h-8 bg-gradient-to-b from-gold/50 to-transparent"
          />
        </motion.div>
      </div>
    </section>
  );
}
