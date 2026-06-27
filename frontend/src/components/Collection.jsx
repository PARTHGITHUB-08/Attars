import { useState, useEffect } from 'react';
import { ScrollReveal } from '../hooks/useScrollReveal';
import ProductCard from './ProductCard';
import api from '../api/axios';

const categories = [
  { key: 'all', label: 'All Saurabh' },
  { key: 'floral', label: 'Floral' },
  { key: 'woody', label: 'Woody' },
  { key: 'spicy', label: 'Spicy' },
  { key: 'rare', label: 'Rare & Limited' },
  { key: 'fresh', label: 'Fresh' },
];

// Fallback data in case API is down
const fallbackProducts = [
  {
    _id: '1', name: 'Mitti Attar', nameHindi: 'मिट्टी अत्तर',
    subtitle: 'The Scent of First Rain on Earth',
    description: 'Capturing the quintessential Indian monsoon experience.',
    price: 0.1, category: 'floral', badge: 'Bestseller',
    notes: { top: ['Wet Earth'], base: ['Sandalwood'] },
    volume: '12ml', image: '/images/mitti_attar.jpg',
    colorSwatch: '#8B6914', rating: 4.9, reviewCount: 287
  },
  {
    _id: '2', name: 'Gulab Attar', nameHindi: 'गुलाब अत्तर',
    subtitle: 'Premium Damask Rose — The Original',
    description: 'A honeyed, velvety rose harvested at dawn.',
    price: 0.1, category: 'floral', badge: 'Classic',
    notes: { top: ['Fresh Rose'], base: ['Sandalwood'] },
    volume: '12ml', image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&h=1000&fit=crop',
    colorSwatch: '#9B2335', rating: 4.8, reviewCount: 412
  },
  {
    _id: '3', name: 'Chandan Attar', nameHindi: 'चंदन अत्तर',
    subtitle: 'Mysore Sandalwood — Sacred & Meditative',
    description: 'Sourced from government-regulated plantations in Mysore.',
    price: 0.1, category: 'woody',
    notes: { top: ['Creamy Wood'], base: ['Musk'] },
    volume: '12ml', image: '/images/chandan_attar.jpg',
    colorSwatch: '#C4A35A', rating: 4.9, reviewCount: 198
  },
  {
    _id: '4', name: 'Oudh Attar', nameHindi: 'उद अत्तर',
    subtitle: 'Assamese Agarwood — Liquid Gold',
    description: 'Wild-harvested agarwood from ancient forests of Assam.',
    price: 0.1, category: 'woody', badge: 'Premium',
    notes: { top: ['Smoke', 'Leather'], base: ['Amber'] },
    volume: '12ml', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&h=1000&fit=crop',
    colorSwatch: '#5C4033', rating: 4.7, reviewCount: 134
  },
  {
    _id: '5', name: 'Bela Attar', nameHindi: 'बेला अत्तर',
    subtitle: 'Night-Blooming Jasmine — Intoxicating',
    description: 'In the quiet hours after midnight, Jasmine sambac releases its most potent fragrance.',
    price: 0.1, category: 'floral',
    notes: { top: ['Green Bud'], base: ['Vanilla'] },
    volume: '12ml', image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&h=1000&fit=crop',
    colorSwatch: '#E8E0D0', rating: 4.8, reviewCount: 176
  },
  {
    _id: '6', name: 'Kesar Attar', nameHindi: 'केसर अत्तर',
    subtitle: "Kashmiri Saffron — The Emperor's Choice",
    description: 'Made with Grade-1 Kashmiri Mongra saffron.',
    price: 0.1, originalPrice: 0.1, category: 'rare', badge: 'Rare',
    notes: { top: ['Honey'], base: ['Leather'] },
    volume: '12ml', image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&h=1000&fit=crop',
    colorSwatch: '#CC5500', rating: 5.0, reviewCount: 89
  },
  {
    _id: '7', name: 'Shamama Attar', nameHindi: 'शमामा अत्तर',
    subtitle: 'The Complex Masterpiece — 60+ Ingredients',
    description: 'A symphony of over 60 natural ingredients.',
    price: 0.1, category: 'rare', badge: 'Limited',
    notes: { top: ['Saffron', 'Cardamom'], base: ['Amber', 'Musk'] },
    volume: '12ml', image: '/images/shamama_attar.jpg',
    colorSwatch: '#6B4423', rating: 5.0, reviewCount: 47
  },
  {
    _id: '8', name: 'Hina Attar', nameHindi: 'हिना अत्तर',
    subtitle: 'Mehndi Flowers — Warm & Spiced Floral',
    description: 'Distilled from the tiny flowers of the henna plant.',
    price: 0.1, category: 'spicy',
    notes: { top: ['Hay'], base: ['Amber'] },
    volume: '12ml', image: 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=800&h=1000&fit=crop',
    colorSwatch: '#6B8E23', rating: 4.6, reviewCount: 93
  },
  {
    _id: '9', name: 'Kewra Attar', nameHindi: 'केवड़ा अत्तर',
    subtitle: 'Pandanus Flowers — The Culinary Treasure',
    description: 'Distilled from the male flowers of the Pandanus tree.',
    price: 0.1, category: 'fresh', badge: 'New',
    notes: { top: ['Watery Green'], base: ['Light Musk'] },
    volume: '12ml', image: 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=800&h=1000&fit=crop',
    colorSwatch: '#90EE90', rating: 4.5, reviewCount: 61
  },
];

export default function Collection() {
  const [products, setProducts] = useState(fallbackProducts);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    api.get('/products')
      .then(res => {
        if (res.success && res.data?.length > 0) setProducts(res.data);
      })
      .catch(() => { /* use fallback */ })
      .finally(() => setLoading(false));
  }, []);

  // Debounce search — 300ms
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput.trim().toLowerCase()), 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  const filtered = products
    .filter(p => p.image && p.image.trim() !== '')
    .filter(p => activeCategory === 'all' || p.category === activeCategory)
    .filter(p => !search ||
      p.name?.toLowerCase().includes(search) ||
      p.subtitle?.toLowerCase().includes(search) ||
      p.category?.toLowerCase().includes(search) ||
      p.notes?.top?.some(n => n.toLowerCase().includes(search)) ||
      p.notes?.base?.some(n => n.toLowerCase().includes(search))
    );

  return (
    <section id="collection" className="relative py-20 sm:py-28 md:py-36">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* Header */}
        <ScrollReveal className="text-center mb-12 sm:mb-16">
          <span className="text-[11px] tracking-[0.3em] uppercase text-gold/60 font-body font-medium">
            Curated for Connoisseurs
          </span>
          <h2 className="font-display text-display-md sm:text-display-lg text-cream mt-4 mb-4">
            The Royal <span className="text-gold">Collection</span>
          </h2>
          <p className="font-body text-cream-faint text-sm max-w-xl mx-auto leading-relaxed">
            Each attar tells a story — of Mughal gardens, temple offerings,
            and monsoon evenings in the heart of India.
          </p>
        </ScrollReveal>

        {/* Search bar */}
        <ScrollReveal delay={80} className="flex justify-center mb-6">
          <div className="relative w-full max-w-sm">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-cream-ghost pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input
              type="text"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Search saurabh, notes, categories…"
              className="w-full pl-9 pr-9 py-2.5 rounded-full bg-surface-2 border border-border-subtle text-cream placeholder-cream-ghost font-body text-xs focus:outline-none focus:border-gold/40 transition-all duration-300"
            />
            {searchInput && (
              <button onClick={() => setSearchInput('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-cream-ghost hover:text-cream transition-colors">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
            )}
          </div>
        </ScrollReveal>

        {/* Filter tabs */}
        <ScrollReveal delay={100} className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10 sm:mb-14">
          {categories.map(cat => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-4 sm:px-5 py-2 rounded-full text-[11px] sm:text-xs font-body font-medium tracking-wide border transition-all duration-300 ${
                activeCategory === cat.key
                  ? 'border-gold/40 bg-gold-muted text-gold'
                  : 'border-border-subtle text-cream-faint hover:border-border-default hover:text-cream-muted hover:bg-surface-2'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </ScrollReveal>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl border border-border-subtle bg-surface-1 overflow-hidden animate-pulse">
                <div className="aspect-[3/4] bg-surface-2" />
                <div className="p-5 space-y-3">
                  <div className="h-3 bg-surface-2 rounded w-2/3" />
                  <div className="h-4 bg-surface-2 rounded w-full" />
                  <div className="h-3 bg-surface-2 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {filtered.map((product, i) => (
              <ScrollReveal key={product._id} delay={i * 80}>
                <ProductCard product={product} />
              </ScrollReveal>
            ))}
          </div>
        )}

        {filtered.length === 0 && !loading && (
          <div className="text-center py-16">
            <p className="font-body text-cream-faint">
              {search ? `No saurabh match "${search}". Try a different search.` : 'No saurabh found in this category.'}
            </p>
            {search && (
              <button onClick={() => setSearchInput('')} className="mt-3 text-xs text-gold hover:underline">
                Clear search
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
