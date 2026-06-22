import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag, CreditCard, Sparkles, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartSidebar() {
  const { cartOpen, setCartOpen, items, updateQuantity, removeItem, total, count, clearCart } = useCart();
  const [checkoutStep, setCheckoutStep] = useState('cart'); // 'cart', 'details', 'success'
  const [customer, setCustomer] = useState({ name: '', contact: '', address: '' });
  const [placedOrder, setPlacedOrder] = useState(null);

  if (!cartOpen) return null;

  const handleClose = () => {
    setCartOpen(false);
    // Reset step if closing after a successful checkout
    if (checkoutStep === 'success') {
      setCheckoutStep('cart');
    }
  };

  const handleQtyChange = (id, newQty) => {
    updateQuantity(id, newQty);
  };

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    if (!customer.name || !customer.contact || !customer.address) return;
    
    // Simulate placing order
    const orderDetails = {
      orderId: `ORD-${Date.now().toString().slice(-6).toUpperCase()}`,
      date: new Date().toLocaleDateString(),
      items: [...items],
      total: total,
      customer: { ...customer }
    };
    
    setPlacedOrder(orderDetails);
    setCheckoutStep('success');
    clearCart();
  };

  return (
    <AnimatePresence>
      {cartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden font-body select-none">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-stone-950/70 backdrop-blur-sm cursor-pointer"
          />

          {/* Drawer container */}
          <div className="absolute inset-y-0 right-0 max-w-full flex">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-screen max-w-md bg-surface-0 border-l border-border-subtle flex flex-col shadow-2xl relative"
            >
              {/* Header */}
              <div className="p-6 border-b border-border-subtle flex items-center justify-between bg-surface-1/35 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full border border-gold/30 flex items-center justify-center bg-gold-subtle">
                    <ShoppingBag className="w-4 h-4 text-gold" />
                  </div>
                  <h2 className="font-display text-lg font-semibold text-cream">
                    {checkoutStep === 'cart' && 'Your Fragrance Bag'}
                    {checkoutStep === 'details' && 'Delivery Details'}
                    {checkoutStep === 'success' && 'Order Authenticated'}
                  </h2>
                </div>
                <button
                  onClick={handleClose}
                  className="w-8 h-8 rounded-full border border-border-subtle flex items-center justify-center hover:bg-surface-2 hover:border-gold/30 transition-all duration-300"
                  aria-label="Close cart"
                >
                  <X className="w-4 h-4 text-cream-muted" />
                </button>
              </div>

              {/* Steps rendering */}
              <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
                {checkoutStep === 'cart' && (
                  <>
                    {items.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center py-20">
                        <div className="w-16 h-16 rounded-full border border-gold/15 bg-gold-subtle flex items-center justify-center mb-6 animate-pulse">
                          <Sparkles className="w-6 h-6 text-gold" />
                        </div>
                        <h3 className="font-display text-lg text-cream mb-2">Your bag is empty</h3>
                        <p className="text-xs text-cream-ghost max-w-[280px] leading-relaxed mb-8">
                          Inhale the luxury of Indian heritage. Begin your olfactory voyage by choosing a signature attar.
                        </p>
                        <button
                          onClick={handleClose}
                          className="px-6 py-3 rounded-full bg-gold text-stone-950 text-xs font-semibold tracking-wider hover:bg-gold-light transition-all duration-300"
                        >
                          Browse Attars
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-5">
                        {items.map(item => (
                          <div key={item._id} className="flex gap-4 p-4 rounded-xl border border-border-subtle bg-surface-1/40 hover:border-border-default transition-all duration-300">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-16 h-20 object-cover rounded-lg border border-border-subtle flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0 flex flex-col justify-between">
                              <div>
                                <div className="flex items-start justify-between gap-2">
                                  <h4 className="font-display text-sm font-semibold text-cream truncate">{item.name}</h4>
                                  <span className="text-sm font-display font-semibold text-gold">₹{(item.price * item.qty).toLocaleString('en-IN')}</span>
                                </div>
                                <p className="text-[10px] text-cream-ghost uppercase tracking-wider mt-0.5">{item.volume} · {item.nameHindi}</p>
                              </div>

                              <div className="flex items-center justify-between mt-2 pt-2 border-t border-border-subtle/50">
                                <div className="flex items-center gap-2 border border-border-subtle rounded-full bg-surface-0 px-2 py-1">
                                  <button
                                    onClick={() => handleQtyChange(item._id, item.qty - 1)}
                                    className="p-1 text-cream-ghost hover:text-gold transition-colors"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <span className="text-xs font-semibold px-1 text-cream">{item.qty}</span>
                                  <button
                                    onClick={() => handleQtyChange(item._id, item.qty + 1)}
                                    className="p-1 text-cream-ghost hover:text-gold transition-colors"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>

                                <button
                                  onClick={() => removeItem(item._id)}
                                  className="text-cream-ghost hover:text-red-400 p-1.5 transition-colors"
                                  title="Remove item"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {checkoutStep === 'details' && (
                  <form onSubmit={handleCheckoutSubmit} className="space-y-5">
                    <div>
                      <label className="block text-xs font-semibold uppercase text-cream-muted tracking-wider mb-2">Recipient Full Name *</label>
                      <input
                        type="text"
                        value={customer.name}
                        onChange={e => setCustomer({ ...customer, name: e.target.value })}
                        required
                        placeholder="e.g. Rukmani Pall"
                        className="w-full bg-surface-2 border border-border-subtle rounded-xl p-3 text-sm text-cream focus:outline-none focus:border-gold/40 placeholder-cream-ghost transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase text-cream-muted tracking-wider mb-2">Phone Number / Email *</label>
                      <input
                        type="text"
                        value={customer.contact}
                        onChange={e => setCustomer({ ...customer, contact: e.target.value })}
                        required
                        placeholder="e.g. +91 98765 43210"
                        className="w-full bg-surface-2 border border-border-subtle rounded-xl p-3 text-sm text-cream focus:outline-none focus:border-gold/40 placeholder-cream-ghost transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase text-cream-muted tracking-wider mb-2">Shipping Address *</label>
                      <textarea
                        value={customer.address}
                        onChange={e => setCustomer({ ...customer, address: e.target.value })}
                        required
                        rows="4"
                        placeholder="Complete postal address with PIN code..."
                        className="w-full bg-surface-2 border border-border-subtle rounded-xl p-3 text-sm text-cream focus:outline-none focus:border-gold/40 placeholder-cream-ghost resize-none transition-all duration-300"
                      />
                    </div>

                    <div className="pt-4 border-t border-border-subtle">
                      <div className="flex justify-between items-center text-sm font-semibold mb-2">
                        <span className="text-cream-muted">Total Payable:</span>
                        <span className="text-gold font-display text-base">₹{total.toLocaleString('en-IN')}</span>
                      </div>
                      <p className="text-[10px] text-cream-ghost leading-relaxed">
                        By placing this order, you authorize packaging of natural raw oils with traditional applicator fittings. Free standard dispatch across India.
                      </p>
                    </div>
                  </form>
                )}

                {checkoutStep === 'success' && placedOrder && (
                  <div className="text-center py-6">
                    <div className="w-12 h-12 rounded-full bg-gold-subtle border border-gold/25 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-6 h-6 text-gold animate-bounce" />
                    </div>
                    <h3 className="font-display text-xl text-cream font-semibold mb-1">Prasad Placed Successfully!</h3>
                    <p className="text-xs text-cream-ghost mb-6">Your order has been recorded in the royal registry.</p>
                    
                    {/* Invoice visual summary */}
                    <div className="border border-gold/15 bg-surface-1 rounded-2xl p-5 text-left font-body text-xs space-y-4 max-w-sm mx-auto shadow-md">
                      <div className="flex justify-between border-b border-border-subtle pb-2">
                        <div>
                          <span className="font-semibold text-cream">Invoice No:</span>
                          <span className="text-cream-muted ml-1">{placedOrder.orderId}</span>
                        </div>
                        <span className="text-cream-ghost">{placedOrder.date}</span>
                      </div>

                      <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                        {placedOrder.items.map(it => (
                          <div key={it._id} className="flex justify-between text-cream-muted">
                            <span className="truncate max-w-[200px]">{it.name} (x{it.qty})</span>
                            <span>₹{(it.price * it.qty).toLocaleString('en-IN')}</span>
                          </div>
                        ))}
                      </div>

                      <div className="border-t border-border-subtle pt-3 flex justify-between font-semibold text-cream">
                        <span>Paid Total (COD):</span>
                        <span className="text-gold font-display text-sm">₹{placedOrder.total.toLocaleString('en-IN')}</span>
                      </div>

                      <div className="border-t border-border-subtle/50 pt-2 text-[10px] text-cream-ghost">
                        <div className="font-semibold text-cream-muted mb-0.5">Delivery destination:</div>
                        <div className="truncate">{placedOrder.customer.name}</div>
                        <div className="truncate">{placedOrder.customer.address}</div>
                      </div>
                    </div>

                    <button
                      onClick={handleClose}
                      className="mt-8 bg-gold-gradient hover:bg-gold-gradient-hover text-stone-950 px-8 py-3 rounded-full text-xs font-semibold tracking-wider transition-all duration-300 shadow-md shadow-gold/15"
                    >
                      Back to Shop
                    </button>
                  </div>
                )}
              </div>

              {/* Footer pricing/actions */}
              {items.length > 0 && checkoutStep === 'cart' && (
                <div className="p-6 border-t border-border-subtle bg-surface-1/35 backdrop-blur-md space-y-4">
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-cream-muted">
                      <span>Subtotal</span>
                      <span className="font-semibold text-cream">₹{total.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-cream-muted">
                      <span>Traditional Wrapping</span>
                      <span className="text-gold uppercase font-semibold text-[10px]">Complimentary</span>
                    </div>
                    <div className="flex justify-between text-cream-muted">
                      <span>Delivery Dispatch</span>
                      <span className="text-gold uppercase font-semibold text-[10px]">Free</span>
                    </div>
                    <div className="flex justify-between border-t border-border-subtle pt-3 text-sm font-semibold text-cream">
                      <span>Total Value</span>
                      <span className="text-gold font-display text-base">₹{total.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setCheckoutStep('details')}
                    className="w-full bg-gold-gradient hover:bg-gold-gradient-hover text-stone-950 py-3.5 rounded-full text-xs font-semibold tracking-wider flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-gold/15"
                  >
                    <CreditCard className="w-4 h-4" />
                    Enter Delivery Details
                  </button>
                </div>
              )}

              {checkoutStep === 'details' && (
                <div className="p-6 border-t border-border-subtle bg-surface-1/35 backdrop-blur-md flex gap-3">
                  <button
                    onClick={() => setCheckoutStep('cart')}
                    type="button"
                    className="flex-1 border border-border-default hover:bg-surface-2 py-3 rounded-full text-xs font-semibold tracking-wider text-cream-muted transition-all"
                  >
                    Back to Bag
                  </button>
                  <button
                    onClick={handleCheckoutSubmit}
                    disabled={!customer.name || !customer.contact || !customer.address}
                    className="flex-2 bg-gold-gradient hover:bg-gold-gradient-hover text-stone-950 px-8 py-3 rounded-full text-xs font-bold tracking-wider transition-all duration-300 shadow-md shadow-gold/15 disabled:opacity-50"
                  >
                    Place Cash on Delivery Order
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
