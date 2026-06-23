import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, ChevronLeft, Calendar, FileText, CheckCircle2, Clock, MapPin, CreditCard, ShieldCheck } from 'lucide-react';
import api from '../api/axios';

export default function TrackOrder() {
  const [searchParams, setSearchParams] = useSearchParams();
  const orderIdParam = searchParams.get('id') || '';

  const [orderIdInput, setOrderIdInput] = useState(orderIdParam);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    if (orderIdParam) {
      fetchOrderStatus(orderIdParam);
    } else {
      setOrderData(null);
      setError('');
    }
  }, [orderIdParam]);

  const fetchOrderStatus = async (id) => {
    setLoading(true);
    setError('');
    setOrderData(null);
    try {
      const res = await api.get(`/invoices/${id.trim()}`);
      if (res.success && res.data) {
        setOrderData(res.data);
      } else {
        setError('Order details could not be loaded.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Order/Invoice not found. Please verify the ID.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!orderIdInput.trim()) return;
    setSearchParams({ id: orderIdInput.trim() });
  };

  return (
    <div className="min-h-screen bg-surface-0 text-cream font-body relative pb-20 select-none">
      {/* Background radial highlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-gold/[0.02] blur-[100px] pointer-events-none" />

      {/* Header Bar */}
      <header className="border-b border-border-subtle bg-surface-1/30 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-5 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full border border-gold/30 flex items-center justify-center bg-gold-subtle">
              <span className="font-display text-gold text-sm font-semibold">अ</span>
            </div>
            <span className="font-display text-sm font-semibold text-cream tracking-wide">ATTRAZ</span>
          </Link>
          <Link
            to="/"
            className="text-xs text-cream-ghost hover:text-gold flex items-center gap-1.5 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Store
          </Link>
        </div>
      </header>

      <main className="max-w-md mx-auto px-5 pt-10 sm:pt-16">
        
        {/* Page Title & Search Input */}
        <div className="text-center mb-8">
          <h1 className="font-display text-2xl font-bold tracking-wide text-cream mb-2">Track Your Order</h1>
          <p className="text-xs text-cream-ghost">Enter your unique Invoice/Order ID to verify payment status</p>
          
          <form onSubmit={handleSearchSubmit} className="mt-6 flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-cream-ghost absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="e.g. ORD-123456"
                value={orderIdInput}
                onChange={(e) => setOrderIdInput(e.target.value)}
                className="w-full bg-surface-1 border border-border-subtle rounded-full pl-10 pr-4 py-2.5 text-xs text-cream focus:outline-none focus:border-gold/40 placeholder-cream-ghost uppercase font-mono tracking-wider transition-colors"
              />
            </div>
            <button
              type="submit"
              className="bg-gold-gradient hover:bg-gold-gradient-hover text-stone-950 px-6 py-2.5 rounded-full text-xs font-bold transition-all shadow-md shadow-gold/10 flex items-center gap-1.5"
            >
              Verify Status
            </button>
          </form>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <div className="w-8 h-8 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
            <div className="text-xs text-cream-ghost">Retrieving security records...</div>
          </div>
        )}

        {/* Error Alert Box */}
        {error && !loading && (
          <div className="border border-red-900/30 bg-red-950/20 p-4 rounded-2xl text-center text-xs text-red-400 font-medium">
            {error}
          </div>
        )}

        {/* Track Order Results card */}
        {orderData && !loading && (
          <div className="space-y-6">
            
            {/* Status Timeline */}
            <div className="border border-border-subtle bg-surface-1/40 p-6 rounded-2xl shadow-xl space-y-5">
              <h3 className="font-display text-xs font-bold text-gold uppercase tracking-wider">Tracking Status</h3>
              
              <div className="space-y-6 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-border-subtle">
                
                {/* Step 1: Ordered */}
                <div className="flex gap-4 relative">
                  <div className="w-6.5 h-6.5 rounded-full bg-green-950/30 border border-green-900/40 flex items-center justify-center z-10 bg-surface-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-cream">Order Received</h4>
                    <p className="text-[10px] text-cream-ghost mt-0.5">Order ID {orderData.invoiceId} successfully created.</p>
                  </div>
                </div>

                {/* Step 2: Payment Status */}
                <div className="flex gap-4 relative">
                  <div className={`w-6.5 h-6.5 rounded-full flex items-center justify-center z-10 bg-surface-1 border ${
                    orderData.paymentStatus === 'Paid'
                      ? 'bg-green-950/30 border-green-900/40'
                      : 'bg-gold-subtle border-gold/20 animate-pulse'
                  }`}>
                    {orderData.paymentStatus === 'Paid' ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                    ) : (
                      <Clock className="w-3.5 h-3.5 text-gold" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-cream">
                      Payment Status: {orderData.paymentStatus === 'Paid' ? 'Done' : 'Pending'}
                    </h4>
                    <p className="text-[10px] text-cream-ghost mt-0.5">
                      {orderData.paymentMethod === 'UPI' 
                        ? (orderData.paymentStatus === 'Paid' 
                            ? 'UPI transaction has been verified by the administrator.' 
                            : 'Awaiting QR Code payment verification on WhatsApp.')
                        : 'Amount will be collected in cash on delivery.'}
                    </p>
                  </div>
                </div>

                {/* Step 3: Dispatch */}
                <div className="flex gap-4 relative">
                  <div className={`w-6.5 h-6.5 rounded-full border flex items-center justify-center z-10 bg-surface-1 ${
                    orderData.paymentStatus === 'Paid'
                      ? 'bg-gold-subtle border-gold/20 animate-pulse'
                      : 'border-border-subtle text-cream-ghost'
                  }`}>
                    <Calendar className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-cream-muted">Order Dispatch & Delivery</h4>
                    <p className="text-[10px] text-cream-ghost mt-0.5">
                      {orderData.paymentStatus === 'Paid' 
                        ? 'Payment verified. Preparing traditional wrapping for shipping.' 
                        : 'Awaiting payment confirmation prior to dispatch packaging.'}
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Order Specification Summary Card */}
            <div className="border border-border-subtle bg-surface-1/40 p-6 rounded-2xl shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gold" />
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-cream">{orderData.invoiceId}</span>
                </div>
                <span className="text-[10px] text-cream-ghost">{orderData.date}</span>
              </div>

              {/* Items List */}
              <div className="divide-y divide-border-subtle/50 max-h-48 overflow-y-auto pr-1">
                {orderData.items?.map((item, idx) => (
                  <div key={item._id || idx} className="py-2.5 flex justify-between text-xs font-body">
                    <div>
                      <div className="font-semibold text-cream">{item.name}</div>
                      <div className="text-[10px] text-cream-ghost mt-0.5">{item.volume} · Qty: {item.qty}</div>
                    </div>
                    <span className="font-semibold text-gold">₹{(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Pricing breakdown */}
              <div className="border-t border-border-subtle pt-3 text-xs space-y-1.5 font-body">
                <div className="flex justify-between text-cream-muted">
                  <span>Items Subtotal:</span>
                  <span>₹{orderData.subtotal?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-cream-muted">
                  <span>Delivery Charge:</span>
                  <span className="line-through text-cream-ghost">₹50.00</span>
                </div>
                <div className="flex justify-between text-gold font-semibold">
                  <span>Delivery Promotion:</span>
                  <span>Free Delivery</span>
                </div>
                <div className="flex justify-between border-t border-border-subtle/50 pt-2 font-bold text-cream text-sm">
                  <span>Total Paid:</span>
                  <span className="text-gold font-display text-sm">₹{orderData.grandTotal?.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Delivery address card */}
            <div className="border border-border-subtle bg-surface-1/40 p-6 rounded-2xl shadow-xl space-y-3 text-xs">
              <div className="flex items-center gap-2 text-gold">
                <MapPin className="w-4 h-4" />
                <h4 className="font-display font-semibold uppercase tracking-wider text-[10px]">Recipient Details</h4>
              </div>
              <div className="space-y-1.5 font-body text-cream-muted">
                <div><span className="font-semibold text-cream">Name:</span> {orderData.customer?.name}</div>
                <div><span className="font-semibold text-cream">Address:</span> {orderData.customer?.address}</div>
              </div>
            </div>

            {/* Security Verification badge */}
            <div className="flex items-center justify-center gap-2 text-[10px] text-cream-ghost font-body pt-2 uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4 text-gold/60" />
              <span>Secured Authenticated by Attraz</span>
            </div>

          </div>
        )}

        {/* Empty State / Lookup Instruction */}
        {!orderData && !loading && !error && (
          <div className="border border-border-subtle bg-surface-1/25 p-8 rounded-2xl text-center space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-full border border-gold/15 bg-gold-subtle flex items-center justify-center mx-auto mb-2">
              <Search className="w-5 h-5 text-gold" />
            </div>
            <h3 className="font-display text-sm font-semibold text-cream">Awaiting Order Lookup</h3>
            <p className="text-xs text-cream-ghost leading-relaxed">
              Retrieve your unique 6-digit Order/Invoice ID from the checkout confirmation page or WhatsApp message to verify if your payment status is done or pending.
            </p>
          </div>
        )}

      </main>
    </div>
  );
}
