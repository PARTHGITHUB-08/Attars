import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag, CreditCard, Sparkles, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import api from '../api/axios';

export default function CartSidebar() {
  const { cartOpen, setCartOpen, items, updateQuantity, removeItem, total, count, clearCart } = useCart();
  const { showToast } = useToast();
  const [checkoutStep, setCheckoutStep] = useState('cart'); // 'cart', 'details', 'success'
  const [customer, setCustomer] = useState({ name: '', phone: '', email: '', address: '' });
  const [placedOrder, setPlacedOrder] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('UPI'); // 'UPI' or 'Cash'

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

  const validatePhone = (phone) => {
    const phoneRegex = /^\+?[0-9]{10,14}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ''));
  };

  const validateEmail = (email) => {
    if (!email || !email.trim()) return true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

  const handleProceedToVerify = () => {
    if (!customer.name.trim()) {
      showToast('Recipient name is required', 'error');
      return;
    }
    if (!validatePhone(customer.phone)) {
      showToast('Please enter a valid phone number (10-14 digits)', 'error');
      return;
    }
    if (!validateEmail(customer.email)) {
      showToast('Please enter a valid email address', 'error');
      return;
    }
    if (!customer.address.trim()) {
      showToast('Shipping address is required', 'error');
      return;
    }
    setCheckoutStep('verify');
  };

  const handleCheckoutSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!customer.name || !customer.phone || !customer.address) return;
    
    const phoneNumber = '919313319897';
    const orderId = `ORD-${Date.now().toString().slice(-6).toUpperCase()}`;
    const date = new Date().toLocaleDateString();

    let message = `Hello Attraz Perfumes, I would like to place an order:\n`;
    message += `*Order ID:* ${orderId}\n`;
    message += `*Date:* ${date}\n\n`;
    message += `*Customer Details:*\n`;
    message += `- Name: ${customer.name}\n`;
    message += `- Phone: ${customer.phone}\n`;
    message += `- Email: ${customer.email}\n`;
    message += `- Shipping Address: ${customer.address}\n\n`;
    message += `*Payment Method:* ${paymentMethod === 'UPI' ? 'UPI (Scan & Pay)' : 'Cash on Delivery'}\n\n`;
    message += `*Items Ordered:*\n`;
    items.forEach(item => {
      message += `- ${item.name} (${item.volume}) x ${item.qty} - ₹${(item.price * item.qty).toFixed(2)}\n`;
    });
    message += `\n*Delivery Charge:* ₹50.00 (FREE)\n`;
    message += `*Total Payable Amount:* ₹${total.toFixed(2)}\n\n`;
    
    if (paymentMethod === 'UPI') {
      message += `Please provide the invoice and the QR code for payment. Thank you!`;
    } else {
      message += `Payment will be done in cash on delivery. Thank you!`;
    }

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    const orderDetails = {
      invoiceId: orderId,
      date,
      items: [...items],
      subtotal: total,
      discount: 0,
      cgst: Number((total * 0.09).toFixed(2)),
      sgst: Number((total * 0.09).toFixed(2)),
      grandTotal: total,
      customer: {
        name: customer.name,
        contact: `${customer.phone.trim()} ${customer.email.trim()}`,
        address: customer.address,
        date
      },
      paymentMethod,
      paymentStatus: 'Pending'
    };
    
    // Save invoice to backend database
    try {
      await api.post('/invoices', orderDetails);
    } catch (err) {
      console.error('[API Error] Failed to store checkout invoice on backend:', err);
    }

    setPlacedOrder({ ...orderDetails, whatsappUrl, total, paymentMethod });
    setCheckoutStep('success');
    clearCart();

    // Attempt to redirect to WhatsApp
    try {
      window.open(whatsappUrl, '_blank');
    } catch (err) {
      console.error('Failed to open WhatsApp automatically', err);
    }
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
                    {checkoutStep === 'verify' && 'Order Verification'}
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
                                  <span className="text-sm font-display font-semibold text-gold">₹{(item.price * item.qty).toFixed(2)}</span>
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
                  <form onSubmit={(e) => { e.preventDefault(); handleProceedToVerify(); }} className="space-y-5">
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
                      <label className="block text-xs font-semibold uppercase text-cream-muted tracking-wider mb-2">Phone Number *</label>
                      <input
                        type="tel"
                        value={customer.phone}
                        onChange={e => setCustomer({ ...customer, phone: e.target.value })}
                        required
                        placeholder="e.g. 9876543210"
                        className="w-full bg-surface-2 border border-border-subtle rounded-xl p-3 text-sm text-cream focus:outline-none focus:border-gold/40 placeholder-cream-ghost transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase text-cream-muted tracking-wider mb-2">Email Address (Optional)</label>
                      <input
                        type="email"
                        value={customer.email}
                        onChange={e => setCustomer({ ...customer, email: e.target.value })}
                        placeholder="e.g. customer@example.com"
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

                    <div className="space-y-2">
                      <label className="block text-xs font-semibold uppercase text-cream-muted tracking-wider mb-2">Payment Method *</label>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <label className="flex-1 flex items-center justify-between p-3.5 rounded-xl border border-border-subtle bg-surface-2 hover:border-gold/30 transition-all cursor-pointer select-none">
                          <div className="flex items-center gap-2.5">
                            <input
                              type="radio"
                              name="paymentMethod"
                              value="UPI"
                              checked={paymentMethod === 'UPI'}
                              onChange={() => setPaymentMethod('UPI')}
                              className="accent-gold w-4 h-4"
                            />
                            <div className="text-left">
                              <span className="block text-xs font-semibold text-cream">UPI (Scan & Pay)</span>
                              <span className="block text-[10px] text-cream-ghost mt-0.5">Scan UPI QR code</span>
                            </div>
                          </div>
                        </label>
                        <label className="flex-1 flex items-center justify-between p-3.5 rounded-xl border border-border-subtle bg-surface-2 hover:border-gold/30 transition-all cursor-pointer select-none">
                          <div className="flex items-center gap-2.5">
                            <input
                              type="radio"
                              name="paymentMethod"
                              value="Cash"
                              checked={paymentMethod === 'Cash'}
                              onChange={() => setPaymentMethod('Cash')}
                              className="accent-gold w-4 h-4"
                            />
                            <div className="text-left">
                              <span className="block text-xs font-semibold text-cream">Cash on Delivery</span>
                              <span className="block text-[10px] text-cream-ghost mt-0.5">Pay in cash on delivery</span>
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border-subtle">
                      <div className="flex justify-between items-center text-sm font-semibold mb-2">
                        <span className="text-cream-muted">Total Payable:</span>
                        <span className="text-gold font-display text-base">₹{total.toFixed(2)}</span>
                      </div>
                      <p className="text-[10px] text-cream-ghost leading-relaxed">
                        By placing this order, you authorize packaging of natural raw oils with traditional applicator fittings. Free standard dispatch across India.
                      </p>
                    </div>
                  </form>
                )}

                {checkoutStep === 'verify' && (
                  <div className="space-y-6">
                    {/* Delivery Summary Panel */}
                    <div className="border border-border-subtle bg-surface-1/40 p-5 rounded-2xl shadow-lg space-y-3">
                      <h3 className="text-xs uppercase font-bold text-gold tracking-wider">Delivery Destination</h3>
                      <div className="text-xs space-y-1.5 font-body text-cream-muted">
                        <div><span className="font-semibold text-cream">Name:</span> {customer.name}</div>
                        <div><span className="font-semibold text-cream">Phone:</span> {customer.phone}</div>
                        <div><span className="font-semibold text-cream">Email:</span> {customer.email}</div>
                        <div><span className="font-semibold text-cream">Address:</span> {customer.address}</div>
                        <div><span className="font-semibold text-cream">Payment Mode:</span> {paymentMethod === 'UPI' ? 'UPI (Scan & Pay)' : 'Cash on Delivery'}</div>
                      </div>
                    </div>

                    {/* Products Summary Panel */}
                    <div className="border border-border-subtle bg-surface-1/40 p-5 rounded-2xl shadow-lg space-y-3">
                      <h3 className="text-xs uppercase font-bold text-gold tracking-wider">Verify Products</h3>
                      <div className="divide-y divide-border-subtle/50">
                        {items.map(item => (
                          <div key={item._id} className="py-2.5 flex justify-between items-center text-xs">
                            <div>
                              <div className="font-semibold text-cream">{item.name}</div>
                              <div className="text-[10px] text-cream-ghost mt-0.5">{item.volume} · Qty: {item.qty}</div>
                            </div>
                            <span className="font-semibold text-gold">₹{(item.price * item.qty).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pricing Breakdown Panel */}
                    <div className="border border-border-subtle bg-surface-1/40 p-5 rounded-2xl shadow-lg space-y-2.5">
                      <h3 className="text-xs uppercase font-bold text-gold tracking-wider">Verify Amount</h3>
                      <div className="text-xs space-y-1.5 font-body">
                        <div className="flex justify-between text-cream-muted font-body">
                          <span>Items Subtotal:</span>
                          <span>₹{total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-cream-muted font-body">
                          <span>Delivery Charge:</span>
                          <span>₹50.00</span>
                        </div>
                        <div className="flex justify-between text-gold font-semibold font-body">
                          <span>Delivery Fee Discount:</span>
                          <span>-₹50.00 (Free Delivery)</span>
                        </div>
                        <div className="flex justify-between border-t border-border-subtle/50 pt-2 font-bold text-cream font-body">
                          <span>Total Amount Payable:</span>
                          <span className="text-gold font-display text-sm font-body">₹{total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {checkoutStep === 'success' && placedOrder && (
                  <div className="text-center py-6 flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-gold-subtle border border-gold/25 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-6 h-6 text-gold animate-bounce" />
                    </div>
                    <h3 className="font-display text-xl text-cream font-semibold mb-1">Order Placed Successfully!</h3>
                    
                    {placedOrder.paymentMethod === 'UPI' ? (
                      <>
                        <p className="text-xs text-cream-ghost mb-6 max-w-[320px] mx-auto leading-relaxed">
                          Your order message has been generated. Please click the button below to send this to us on WhatsApp. Our automated system will immediately send you the UPI QR code on WhatsApp to complete your payment.
                        </p>

                        {/* QR Code WhatsApp Delivery Status Box */}
                        <div className="mb-6 border border-gold/15 bg-surface-1 rounded-2xl p-5 text-center font-body w-full max-w-sm mx-auto shadow-md space-y-2">
                          <div className="text-[10px] font-semibold text-gold tracking-wider uppercase">UPI QR Code Delivery</div>
                          <div className="text-cream text-xs leading-relaxed font-semibold">
                            UPI QR Code will be sent on WhatsApp
                          </div>
                          <div className="text-[10px] text-cream-ghost font-mono">
                            Sent automatically upon receiving your message.
                          </div>
                          <div className="text-[11px] font-bold text-cream">Amount Payable: ₹{placedOrder.total?.toFixed(2)}</div>
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="text-xs text-cream-ghost mb-6 max-w-[280px] mx-auto leading-relaxed">
                          Your Cash on Delivery order details are summary verified below.
                        </p>

                        {/* COD Pending Box */}
                        <div className="mb-6 border border-gold/15 bg-surface-1 rounded-2xl p-5 text-center font-body w-full max-w-sm mx-auto shadow-md">
                          <div className="text-[10px] font-semibold text-gold tracking-wider uppercase mb-2">Payment Pending (Cash)</div>
                          <div className="text-cream text-xs leading-relaxed font-semibold">
                            Total Payable: ₹{placedOrder.total?.toFixed(2)}
                          </div>
                          <div className="text-[10px] text-cream-ghost mt-1.5">
                            Please prepare cash to pay when the package is delivered to you.
                          </div>
                        </div>
                      </>
                    )}
                    
                    {/* Invoice visual summary */}
                    <div className="border border-gold/15 bg-surface-1 rounded-2xl p-5 text-left font-body text-xs space-y-4 w-full max-w-sm mx-auto shadow-md">
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
                            <span>₹{(it.price * it.qty).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="border-t border-border-subtle pt-3 flex justify-between font-semibold text-cream">
                        <span>Order Total:</span>
                        <span className="text-gold font-display text-sm">₹{placedOrder.total.toFixed(2)}</span>
                      </div>

                      <div className="border-t border-border-subtle/50 pt-2 text-[10px] text-cream-ghost">
                        <div className="font-semibold text-cream-muted mb-0.5">Delivery destination:</div>
                        <div className="truncate">{placedOrder.customer.name}</div>
                        <div className="truncate">{placedOrder.customer.address}</div>
                      </div>
                    </div>

                    <div className="mt-5 p-4 border border-border-subtle bg-surface-1/40 rounded-2xl text-center max-w-sm w-full mx-auto shadow-sm">
                      <p className="text-[11px] text-cream-ghost leading-normal">
                        Track your order and check if your payment status is done or pending anytime:
                      </p>
                      <a
                        href={`/track-order?id=${placedOrder.invoiceId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 block text-xs font-semibold text-gold hover:text-gold-light underline truncate font-mono"
                      >
                        Track Status: {placedOrder.invoiceId}
                      </a>
                    </div>

                    <a
                      href={placedOrder.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 w-full max-w-sm bg-green-600 hover:bg-green-700 text-white py-3 rounded-full text-xs font-bold tracking-wider flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-green-950/20"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.966C16.59 1.974 14.113 1.9 12.01 1.9c-5.44 0-9.866 4.372-9.87 9.802 0 1.714.47 3.393 1.357 4.869l-.993 3.629 3.753-.974zm11.233-6.84c-.29-.145-1.71-.843-1.974-.939-.264-.096-.456-.145-.648.145-.191.29-.74.939-.907 1.13-.167.191-.334.215-.624.07-.29-.145-1.223-.45-2.33-1.439-.86-.767-1.44-1.716-1.608-2.005-.167-.29-.018-.446.126-.59.13-.13.29-.338.435-.507.145-.167.192-.29.29-.482.097-.191.048-.36-.024-.505-.072-.145-.648-1.56-.888-2.137-.233-.564-.49-.487-.648-.495-.167-.008-.36-.008-.552-.008-.192 0-.505.072-.77.36-.264.29-1.01 0-1.01 2.457s1.777 4.82 2.023 5.157c.246.337 3.5 5.348 8.48 7.495 1.185.51 2.11.815 2.83 1.042 1.19.378 2.274.325 3.13.197.955-.143 1.974-.805 2.25-1.543.277-.738.277-1.37.193-1.505-.084-.135-.29-.215-.58-.36z" />
                      </svg>
                      Open WhatsApp to Complete Order
                    </a>

                    <button
                      onClick={handleClose}
                      className="mt-4 bg-surface-2 border border-border-subtle hover:border-gold/30 text-cream-muted px-8 py-3 rounded-full text-xs font-semibold tracking-wider transition-all duration-300"
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
                      <span className="font-semibold text-cream">₹{total.toFixed(2)}</span>
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
                      <span className="text-gold font-display text-base">₹{total.toFixed(2)}</span>
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
                    onClick={handleProceedToVerify}
                    disabled={!customer.name || !customer.phone || !customer.address}
                    className="flex-2 bg-gold-gradient hover:bg-gold-gradient-hover text-stone-950 px-8 py-3 rounded-full text-xs font-bold tracking-wider transition-all duration-300 shadow-md shadow-gold/15 disabled:opacity-50"
                  >
                    Continue to Verify
                  </button>
                </div>
              )}

              {checkoutStep === 'verify' && (
                <div className="p-6 border-t border-border-subtle bg-surface-1/35 backdrop-blur-md flex gap-3">
                  <button
                    onClick={() => setCheckoutStep('details')}
                    type="button"
                    className="flex-1 border border-border-default hover:bg-surface-2 py-3 rounded-full text-xs font-semibold tracking-wider text-cream-muted transition-all"
                  >
                    Back to Details
                  </button>
                  <button
                    onClick={handleCheckoutSubmit}
                    className="flex-2 bg-gold-gradient hover:bg-gold-gradient-hover text-stone-950 px-8 py-3 rounded-full text-xs font-bold tracking-wider transition-all duration-300 shadow-md shadow-gold/15"
                  >
                    Confirm & Place Order
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
