import { useState, useEffect } from 'react';
import { ScrollReveal } from '../hooks/useScrollReveal';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';

const fallbackTestimonials = [];

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
  const [showModal, setShowModal] = useState(false);
  const [productList, setProductList] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();
  
  const [form, setForm] = useState({
    name: '',
    location: '',
    productName: '',
    rating: 5,
    text: ''
  });

  // Fetch approved testimonials
  const fetchTestimonials = () => {
    api.get('/testimonials')
      .then(res => { 
        if (res.success) {
          setTestimonials(res.data || []); 
        } 
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchTestimonials();

    // Fetch products list for dropdown
    api.get('/products')
      .then(res => {
        if (res.success && res.data) {
          setProductList(res.data);
        }
      })
      .catch(() => {});
  }, []);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!form.name || !form.location || !form.text) {
      showToast('All required fields must be filled', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/testimonials', form);
      if (res.success) {
        showToast('Thank you! Your review has been submitted for approval.', 'success');
        setShowModal(false);
        setForm({ name: '', location: '', productName: '', rating: 5, text: '' });
        // Refresh testimonials (if they were auto-approved, but usually they need admin approval)
        fetchTestimonials();
      } else {
        showToast(res.message || 'Error submitting review', 'error');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to submit review. Try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const defaultProducts = [
    { name: 'Mitti Attar' },
    { name: 'Gulab Attar' },
    { name: 'Chandan Attar' },
    { name: 'Oudh Attar' },
    { name: 'Bela Attar' },
    { name: 'Kesar Attar' },
    { name: 'Shamama Attar' },
    { name: 'Hina Attar' },
    { name: 'Kewra Attar' }
  ];
  const selectOptions = productList.length > 0 ? productList : defaultProducts;

  return (
    <section id="testimonials" className="relative py-20 sm:py-28 bg-surface-1 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-surface-0/50 via-transparent to-surface-0/50 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
        <ScrollReveal className="text-center mb-12 sm:mb-16 flex flex-col items-center">
          <span className="text-[11px] tracking-[0.3em] uppercase text-gold/60 font-body font-medium">
            Voices of Devotion
          </span>
          <h2 className="font-display text-display-md sm:text-display-lg text-cream mt-4 mb-6">
            What Our <span className="text-gold">Devotees</span> Say
          </h2>
          {testimonials.length > 0 && (
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-2.5 rounded-full border border-gold text-gold hover:bg-gold-subtle font-body font-semibold text-xs tracking-wider uppercase transition-all duration-300 shadow-sm"
            >
              Share Your Experience
            </button>
          )}
        </ScrollReveal>

        {testimonials.length === 0 ? (
          <ScrollReveal className="text-center py-16 px-4 rounded-2xl border border-border-subtle bg-surface-0/50 max-w-md mx-auto shadow-md">
            <p className="text-cream-muted font-accent text-[17px] italic mb-6 leading-relaxed">
              "Be the first to share your journey with our traditional hydro-distilled fragrances."
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-2.5 rounded-full bg-gold-gradient text-stone-950 font-body font-semibold text-xs tracking-wider uppercase hover:scale-[1.03] transition-all duration-300 shadow-lg"
            >
              Write the First Review
            </button>
          </ScrollReveal>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className="h-full rounded-2xl border border-border-subtle bg-surface-0/50 p-6 sm:p-7 hover:border-border-default hover:bg-surface-2/40 transition-all duration-500 flex flex-col shadow-sm">
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
        )}
      </div>

      {/* Review Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm transition-all duration-300 animate-fade-in">
          <div className="bg-surface-0 border border-border-subtle rounded-2xl w-full max-w-lg p-6 sm:p-8 shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-cream-ghost hover:text-cream transition-colors"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header */}
            <div className="text-center pb-4 border-b border-border-subtle">
              <span className="text-[10px] uppercase tracking-[0.2em] text-gold font-body font-semibold">Share Your Fragrance Journey</span>
              <h3 className="font-display text-xl text-cream mt-1">Write a Review</h3>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitReview} className="space-y-4 font-body">
              <div>
                <label className="block text-[10px] uppercase font-bold text-cream-ghost mb-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Rukmani Pall"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-surface-2 border border-border-subtle rounded-xl p-3 text-xs text-cream focus:outline-none focus:border-gold/40 placeholder-cream-ghost/50"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-cream-ghost mb-1">Location</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Mumbai, India"
                    value={form.location}
                    onChange={e => setForm({ ...form, location: e.target.value })}
                    className="w-full bg-surface-2 border border-border-subtle rounded-xl p-3 text-xs text-cream focus:outline-none focus:border-gold/40 placeholder-cream-ghost/50"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-cream-ghost mb-1">Select Attar</label>
                  <select 
                    value={form.productName}
                    onChange={e => setForm({ ...form, productName: e.target.value })}
                    className="w-full bg-surface-2 border border-border-subtle rounded-xl p-3 text-xs text-cream focus:outline-none focus:border-gold/40"
                  >
                    <option value="">General Review</option>
                    {selectOptions.map((p, idx) => (
                      <option key={idx} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Star Rating Selector */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-cream-ghost mb-2">Rating</label>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setForm({ ...form, rating: star })}
                      className="text-gold focus:outline-none transition-transform hover:scale-110"
                    >
                      <svg 
                        className={`w-6 h-6 ${star <= form.rating ? 'text-gold fill-gold' : 'text-border-default fill-none'}`} 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-cream-ghost mb-1">Your Review</label>
                <textarea 
                  required
                  rows={4}
                  maxLength={500}
                  placeholder="Tell us about the longevity, scent profile, and your experience..."
                  value={form.text}
                  onChange={e => setForm({ ...form, text: e.target.value })}
                  className="w-full bg-surface-2 border border-border-subtle rounded-xl p-3 text-xs text-cream focus:outline-none focus:border-gold/40 placeholder-cream-ghost/50 resize-none font-body"
                />
                <div className="text-right text-[9px] text-cream-ghost mt-1">
                  {form.text.length} / 500 characters
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gold-gradient text-stone-950 font-semibold p-3.5 rounded-xl text-xs uppercase tracking-wider hover:scale-[1.01] hover:bg-gold-gradient-hover transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
