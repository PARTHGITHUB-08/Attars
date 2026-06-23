import { motion } from 'framer-motion';

export default function Preloader() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0,
        transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
      }}
      className="fixed inset-0 z-[9999] bg-surface-0 flex flex-col items-center justify-center select-none"
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-gold/[0.04] blur-[80px]" />
      
      <div className="relative flex flex-col items-center text-center">
        {/* Animated circle logo */}
        <motion.div
          initial={{ scale: 0.75, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-20 h-20 rounded-full border border-gold/45 flex items-center justify-center bg-surface-1 shadow-[0_0_40px_rgba(176,142,79,0.08)] mb-6 relative"
        >
          {/* Outer ring accent */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
            className="absolute inset-[-4px] border border-dashed border-gold/15 rounded-full"
          />
          <span className="font-display text-gold text-3xl font-semibold leading-none select-none">अ</span>
        </motion.div>

        {/* Fading brand name */}
        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-1.5"
        >
          <h1 className="font-display text-2xl font-semibold tracking-[0.25em] text-cream">
            ATTRAZ
          </h1>
          <p className="text-[9px] tracking-[0.35em] uppercase text-gold font-body font-medium opacity-80">
            The Soul of Fragrance
          </p>
        </motion.div>

        {/* Delicate golden line loader */}
        <div className="w-28 h-[1px] bg-border-subtle overflow-hidden mt-8 relative rounded-full">
          <motion.div
            initial={{ left: '-100%' }}
            animate={{ left: '100%' }}
            transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
            className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-gold to-transparent"
          />
        </div>
      </div>
    </motion.div>
  );
}
