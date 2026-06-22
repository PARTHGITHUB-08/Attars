import { useState, useEffect } from 'react';
import { ScrollReveal } from '../hooks/useScrollReveal';
import api from '../api/axios';

const fallbackTestimonials = [
  { name: 'Rukmani Pall', location: 'Mumbai, Maharashtra', initials: 'RP', text: 'The Mitti Attar transported me back to my grandmother\'s courtyard in Lucknow during the first monsoon rain. I wept. It was that real. No French perfume has ever moved me like this.', rating: 5, productName: 'Mitti Attar' },
  { name: 'Arjun Khanna', location: 'London, UK', initials: 'AK', text: 'I have worn Creed, Tom Ford, and Amouage for years. One drop of the Kesar Attar changed everything. The depth, the evolution on skin, the longevity — nothing in the West compares.', rating: 5, productName: 'Kesar Attar' },
  { name: 'Swami Shivanand', location: 'Rishikesh, Uttarakhand', initials: 'SS', text: 'We use the Chandan Attar in our ashram every morning for puja. The entire temple fills with such a sacred fragrance that devotees often ask what special incense we are burning.', rating: 5, productName: 'Chandan Attar' },
  { name: 'Priya Mehta', location: 'New Delhi', initials: 'PM', text: 'I gifted the Shamama to my father for his 70th birthday. He recognized it immediately — his grandfather used to wear the same attar from the same family. Three generations connected.', rating: 5, productName: 'Shamama Attar' },
  { name: 'David Chen', location: 'Singapore', initials: 'DC', text: 'As a niche fragrance collector with 200+ bottles, I can say this Oudh Attar is genuinely exceptional. Wild Assam oud at this quality is virtually impossible to find in commercial perfumery.', rating: 5, productName: 'Oudh Attar' },
  { name: 'Aisha Bano', location: 'Hyderabad', initials: 'AB', text: 'The Bela Attar is exactly how my mother\'s garden smelled at 2 AM — intoxicating, alive, almost surreal. I apply it on my wrists and the scent blooms for the entire day. Sublime.', rating: 5, productName: 'Bela Attar' },
];

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(s => (
        <svg key={s} className={`w-3.5 h-3.5 ${s <= rating ? 'text-gold' : 'text-border-default'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState(fallbackTestimonials);

  useEffect(() => {
    api.get('/testimonials')
      .then(res => { if (res.success && res.data?.length > 0) setTestimonials(res.data); })
      .catch(() => {});
  }, []);

  return (
    <section id="testimonials" className="relative py-20 sm:py-28 bg-surface-1 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-surface-0/50 via-transparent to-surface-0/50 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
        <ScrollReveal className="text-center mb-12 sm:mb-16">
          <span className="text-[11px] tracking-[0.3em] uppercase text-gold/60 font-body font-medium">
            Voices of Devotion
          </span>
          <h2 className="font-display text-display-md sm:text-display-lg text-cream mt-4">
            What Our <span className="text-gold">Devotees</span> Say
          </h2>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <ScrollReveal key={i} delay={i * 100}>
              <div className="h-full rounded-2xl border border-border-subtle bg-surface-0/50 p-6 sm:p-7 hover:border-border-default hover:bg-surface-2/40 transition-all duration-500 flex flex-col">
                <StarRating rating={t.rating} />

                <p className="font-accent text-[17px] sm:text-lg text-cream-muted italic leading-[1.7] mt-5 mb-6 flex-1">
                  "{t.text}"
                </p>

                <div className="flex items-center gap-3 pt-5 border-t border-border-subtle">
                  <div className="w-10 h-10 rounded-full bg-gold-subtle border border-gold/20 flex items-center justify-center flex-shrink-0">
                    <span className="font-display text-gold text-xs font-semibold">{t.initials}</span>
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-body font-medium text-cream truncate">{t.name}</div>
                    <div className="text-[11px] text-cream-faint font-body truncate">
                      {t.location}{t.productName ? ` · ${t.productName}` : ''}
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
