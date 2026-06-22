import { useState } from 'react';
import { Plus, ShoppingBag, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export default function ProductCard({ product }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const { addItem } = useCart();
  const { showToast } = useToast();

  const handleAdd = (e) => {
    e.stopPropagation();
    addItem(product);
    showToast(`${product.name} added to cart`);
  };

  const handleQuickView = (e) => {
    e.stopPropagation();
    showToast(`${product.nameHindi || product.name} — ${product.subtitle}`);
  };

  return (
    <div className="group relative rounded-2xl border border-border-subtle bg-surface-1 overflow-hidden transition-all duration-500 hover:border-border-default hover:shadow-2xl hover:shadow-black/30 hover:-translate-y-1">
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-surface-2">
        {!imgLoaded && (
          <div className="absolute inset-0 bg-surface-2 animate-pulse" />
        )}
        <img
          src={product.image}
          alt={product.name}
          onLoad={() => setImgLoaded(true)}
          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
            imgLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-1 via-surface-1/10 to-transparent" />
        <div className="absolute inset-0 bg-gold/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-3.5 left-3.5">
            <span className="inline-block px-3 py-1 rounded-full text-[9px] font-body font-semibold tracking-[0.15em] uppercase bg-surface-0/80 backdrop-blur-md border border-border-subtle text-cream-muted">
              {product.badge}
            </span>
          </div>
        )}

        {/* Discount badge */}
        {product.originalPrice && (
          <div className="absolute top-3.5 right-3.5">
            <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-body font-bold bg-red-900/80 text-red-200 backdrop-blur-md border border-red-800/40">
              {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
            </span>
          </div>
        )}

        {/* Hover actions */}
        <div className="absolute bottom-3.5 right-3.5 flex gap-2 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <button
            onClick={handleQuickView}
            className="w-9 h-9 rounded-full bg-surface-0/80 backdrop-blur-md border border-border-subtle flex items-center justify-center hover:bg-surface-3 hover:border-gold/30 transition-all duration-300"
            aria-label="Quick view"
          >
            <Eye className="w-3.5 h-3.5 text-cream-muted" />
          </button>
          <button
            onClick={handleAdd}
            className="w-9 h-9 rounded-full bg-gold text-stone-950 flex items-center justify-center hover:bg-gold-light transition-all duration-300 shadow-lg shadow-gold/20"
            aria-label="Add to cart"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 sm:p-5">
        {/* Hindi name */}
        {product.nameHindi && (
          <p className="text-[11px] text-cream-ghost font-body mb-0.5">{product.nameHindi}</p>
        )}

        <div className="flex items-start justify-between gap-3 mb-1.5">
          <h3 className="font-display text-base sm:text-[17px] font-semibold text-cream leading-tight">
            {product.name}
          </h3>
          <div className="text-right flex-shrink-0">
            <div className="font-display text-base sm:text-[17px] font-semibold text-gold leading-tight">
              ₹{product.price.toLocaleString('en-IN')}
            </div>
            {product.originalPrice && (
              <div className="text-[11px] text-cream-ghost font-body line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </div>
            )}
          </div>
        </div>

        <p className="text-[12px] text-cream-faint font-body mb-3 leading-snug">{product.subtitle}</p>

        {/* Notes & Origin */}
        <div className="flex items-center justify-between pt-3 border-t border-border-subtle">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full border border-border-default" style={{ backgroundColor: product.colorSwatch }} />
            <span className="text-[10px] text-cream-ghost font-body tracking-wide uppercase">
              {product.notes?.top?.[0]} · {product.notes?.base?.[0]}
            </span>
          </div>
          <span className="text-[10px] text-cream-ghost font-body">
            {product.volume}
          </span>
        </div>

        {/* Rating */}
        {product.rating > 0 && (
          <div className="flex items-center gap-1.5 mt-2.5">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map(star => (
                <svg key={star} className={`w-3 h-3 ${star <= Math.round(product.rating) ? 'text-gold' : 'text-border-default'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-[10px] text-cream-ghost font-body">
              {product.rating} ({product.reviewCount})
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
