import React from 'react';

const marqueeItems = [
  "100% Natural Distillation",
  "Pure Natural Fragrances",
  "No Alcohol & No Chemicals",
  "Mysore Sandalwood Base",
  "Damask Rose Harvested at Dawn",
  "Assamese Agarwood (Liquid Gold)",
  "The Scent of First Rain (Mitti)",
  "Deg-Bhapka Traditional Distillation"
];

export default function Marquee() {
  return (
    <div className="relative py-6 sm:py-8 border-y border-border-subtle bg-surface-1 overflow-hidden select-none">
      <div className="flex w-max items-center marquee-track whitespace-nowrap">
        {/* First set of items */}
        <div className="flex items-center gap-12 sm:gap-20 text-[11px] sm:text-xs font-body font-semibold tracking-[0.25em] uppercase text-gold">
          {marqueeItems.map((item, idx) => (
            <React.Fragment key={`marquee-1-${idx}`}>
              <span>{item}</span>
              <span className="text-gold/30">❊</span>
            </React.Fragment>
          ))}
        </div>
        {/* Second set of items for seamless loop */}
        <div className="flex items-center gap-12 sm:gap-20 text-[11px] sm:text-xs font-body font-semibold tracking-[0.25em] uppercase text-gold ml-12 sm:ml-20">
          {marqueeItems.map((item, idx) => (
            <React.Fragment key={`marquee-2-${idx}`}>
              <span>{item}</span>
              <span className="text-gold/30">❊</span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
