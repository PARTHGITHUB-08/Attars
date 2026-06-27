import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Key, Shield, List, MessageSquare, Mail, 
  Download, Plus, Edit2, Trash2, CheckCircle, 
  XCircle, Home, LogOut, Package, RefreshCw,
  FileText, Printer, PlusCircle, Trash,
  BarChart2, TrendingUp, TrendingDown, Users, ShoppingBag,
  Star, AlertCircle, DollarSign, Activity, Eye, Award
} from 'lucide-react';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';

export default function Admin() {
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const { showToast } = useToast();

  // Authentication States
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [authError, setAuthError] = useState('');
  const [loginMode, setLoginMode] = useState('login'); // 'login' or 'forgot'
  const [resetKeySent, setResetKeySent] = useState(false);
  const [resetKey, setResetKey] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Security Form States
  const [securityUsername, setSecurityUsername] = useState('');
  const [securityPassword, setSecurityPassword] = useState('');
  const [securityConfirmPassword, setSecurityConfirmPassword] = useState('');

  // Data States
  const [products, setProducts] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Dashboard Stats State
  const [dashStats, setDashStats] = useState(null);
  const [dashLoading, setDashLoading] = useState(false);

  // Billing States
  const [billingInvoices, setBillingInvoices] = useState([]);
  const [invoiceCustomer, setInvoiceCustomer] = useState({ name: '', contact: '', address: '', date: new Date().toISOString().split('T')[0], notes: '' });
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedProductQty, setSelectedProductQty] = useState(1);
  const [invoiceDiscount, setInvoiceDiscount] = useState(0);
  const [invoiceId, setInvoiceId] = useState(`INV-2026-${Math.floor(1000 + Math.random() * 9000)}`);

  // Form States (for creating/editing products)
  const [editingProduct, setEditingProduct] = useState(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '',
    nameHindi: '',
    subtitle: '',
    description: '',
    price: 0,
    originalPrice: '',
    category: 'floral',
    tags: '',
    volume: '12ml',
    image: '',
    badge: '',
    colorSwatch: '#8B6914',
    inStock: true,
    stockCount: 50,
    featured: false,
    origin: ''
  });

  // Check auth via server on mount, then load data if authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get('/admin/me');
        if (res.success) {
          setIsAuthenticated(true);
          setSecurityUsername(res.username || '');
        }
      } catch {
        setIsAuthenticated(false);
      } finally {
        setAuthChecked(true);
      }
    };
    checkAuth();

    // Listen for 401 responses (e.g., expired token)
    const handleUnauthorized = () => {
      setIsAuthenticated(false);
    };
    window.addEventListener('attars:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('attars:unauthorized', handleUnauthorized);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
    }
  }, [isAuthenticated]);

  const handleLogout = async () => {
    try {
      await api.post('/admin/logout');
    } catch {
      // ignore errors - clear state regardless
    }
    setIsAuthenticated(false);
    showToast('Exited Admin Panel');
    window.location.href = '/';
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAuthError('');
    try {
      const res = await api.post('/admin/login', { username: loginUser, password: loginPass });
      if (res.success) {
        setIsAuthenticated(true);
        showToast('Access authenticated successfully', 'success');
      }
    } catch (err) {
      setAuthError(err.response?.data?.message || 'Invalid credentials');
      showToast('Authentication failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSendResetKey = async () => {
    setLoading(true);
    try {
      const res = await api.post('/admin/forgot-password');
      if (res.success) {
        if (res.devKey) {
          showToast(`Development Mode: Key is ${res.devKey}`, 'success');
        } else {
          showToast('Reset key emailed to parthgelani08@gmail.com', 'success');
        }
        setResetKeySent(true);
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Error sending reset key', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    if (!resetKey || !newUsername || !newPassword) {
      showToast('All fields are required', 'error');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/admin/reset-password', {
        key: resetKey,
        username: newUsername,
        password: newPassword
      });
      if (res.success) {
        showToast('Credentials reset successfully! Please log in.', 'success');
        setLoginMode('login');
        setResetKeySent(false);
        setResetKey('');
        setNewUsername('');
        setNewPassword('');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Invalid key or reset error', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadAdminUsername = async () => {
    try {
      const res = await api.get('/admin/credentials');
      if (res.success) {
        setSecurityUsername(res.username);
      }
    } catch (err) {
      // ignore if not authenticated
    }
  };

  const handleUpdateCredentials = async (e) => {
    e.preventDefault();
    if (!securityUsername || !securityPassword) {
      showToast('Username and password are required', 'error');
      return;
    }
    if (securityPassword !== securityConfirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await api.put('/admin/credentials',
        { username: securityUsername, password: securityPassword }
      );
      if (res.success) {
        showToast('Admin credentials updated successfully!', 'success');
        setSecurityPassword('');
        setSecurityConfirmPassword('');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Error updating credentials', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      // Fetch Products (admin view includes all, with/without images)
      const prodRes = await api.get('/products?adminView=true');
      if (prodRes.success) {
        const pList = prodRes.data || [];
        setProducts(pList);
        if (pList.length > 0) setSelectedProductId(pList[0]._id);
      }

      // Fetch Reviews (admin route — auth cookie sent automatically)
      const testRes = await api.get('/testimonials/admin');
      if (testRes.success) setTestimonials(testRes.data || []);

      // Fetch Subscribers
      const subRes = await api.get('/newsletter/subscribers');
      if (subRes.success) setSubscribers(subRes.data || []);

      // Fetch Invoices
      const invRes = await api.get('/invoices');
      if (invRes.success) setBillingInvoices(invRes.data || []);

    } catch (err) {
      showToast(err.message || 'Error fetching records', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Load dashboard stats
  const loadDashboard = async () => {
    setDashLoading(true);
    try {
      const res = await api.get('/admin/dashboard');
      if (res.success) setDashStats(res.data);
    } catch (err) {
      showToast('Error loading dashboard stats', 'error');
    } finally {
      setDashLoading(false);
    }
  };

  // Load dashboard when tab switches to it
  useEffect(() => {
    if (isAuthenticated && activeTab === 'dashboard') {
      loadDashboard();
    }
  }, [activeTab, isAuthenticated]);

  // CSV Downloader
  const handleExportCSV = (type) => {
    if (type === 'subscribers') {
      const headers = ['ID', 'Email', 'Subscribed At', 'Active'];
      const mapFn = (row) => [row._id, row.email, row.subscribedAt, row.active];
      downloadCSV('attars_subscribers.csv', headers, subscribers, mapFn);
      showToast('Subscribers list exported as CSV');
    } else if (type === 'products') {
      const headers = ['ID', 'Name', 'Subtitle', 'Price', 'Original Price', 'Category', 'Stock Count', 'In Stock', 'Rating', 'Origin'];
      const mapFn = (row) => [row._id, row.name, row.subtitle, row.price, row.originalPrice, row.category, row.stockCount, row.inStock, row.rating, row.origin];
      downloadCSV('attars_products.csv', headers, products, mapFn);
      showToast('Products catalog exported as CSV');
    } else if (type === 'reviews') {
      const headers = ['ID', 'Name', 'Location', 'Rating', 'Product Name', 'Approved', 'Text'];
      const mapFn = (row) => [row._id, row.name, row.location, row.rating, row.productName, row.approved, row.text];
      downloadCSV('attars_reviews.csv', headers, testimonials, mapFn);
      showToast('Reviews records exported as CSV');
    }
  };

  const downloadCSV = (filename, headers, data, mapRowFn) => {
    const csvContent = [
      headers.join(','),
      ...data.map(row => mapRowFn(row).map(val => `"${String(val ?? '').replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Product CRUD Handlers
  const openCreateForm = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      nameHindi: '',
      subtitle: '',
      description: '',
      price: '',
      originalPrice: '',
      category: 'floral',
      tags: '',
      volume: '12ml',
      image: 'https://images.unsplash.com/photo-1594035910387-fbd1a485b12e?w=800&h=1000&fit=crop',
      badge: '',
      colorSwatch: '#8B6914',
      inStock: true,
      stockCount: 50,
      featured: false,
      origin: ''
    });
    setShowProductForm(true);
  };

  const openEditForm = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name || '',
      nameHindi: product.nameHindi || '',
      subtitle: product.subtitle || '',
      description: product.description || '',
      price: product.price || '',
      originalPrice: product.originalPrice || '',
      category: product.category || 'floral',
      tags: product.tags ? product.tags.join(', ') : '',
      volume: product.volume || '12ml',
      image: product.image || '',
      badge: product.badge || '',
      colorSwatch: product.colorSwatch || '#8B6914',
      inStock: product.inStock !== false,
      stockCount: product.stockCount ?? 50,
      featured: product.featured === true,
      origin: product.origin || ''
    });
    setShowProductForm(true);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...productForm,
        price: Number(productForm.price),
        originalPrice: productForm.originalPrice ? Number(productForm.originalPrice) : undefined,
        tags: productForm.tags ? productForm.tags.split(',').map(t => t.trim()).filter(Boolean) : []
      };

      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, payload);
        showToast('Product updated successfully');
      } else {
        await api.post('/products', payload);
        showToast('Product created successfully');
      }

      setShowProductForm(false);
      loadAllData();
    } catch (err) {
      showToast(err.message || 'Error saving product', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    setLoading(true);
    try {
      await api.delete(`/products/${id}`);
      showToast('Product deleted');
      loadAllData();
    } catch (err) {
      showToast(err.message || 'Error deleting product', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Testimonial Approval Toggle
  const handleToggleApproval = async (id, currentStatus) => {
    setLoading(true);
    try {
      await api.put(`/testimonials/${id}`, { approved: !currentStatus });
      showToast(`Review ${!currentStatus ? 'Approved' : 'Moved to Pending'}`);
      loadAllData();
    } catch (err) {
      showToast(err.message || 'Error updating review', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm('Are you sure you want to delete this testimonial?')) return;
    setLoading(true);
    try {
      await api.delete(`/testimonials/${id}`);
      showToast('Review deleted');
      loadAllData();
    } catch (err) {
      showToast(err.message || 'Error deleting review', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Subscriber Unsubscribe Handler
  const handleDeleteSubscriber = async (id) => {
    if (!window.confirm('Are you sure you want to unsubscribe this email?')) return;
    setLoading(true);
    try {
      await api.delete(`/newsletter/subscribers/${id}`);
      showToast('Subscriber removed');
      loadAllData();
    } catch (err) {
      showToast(err.message || 'Error removing subscriber', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Billing and Invoice Generation Handlers
  const handleAddItemToInvoice = () => {
    if (!selectedProductId) {
      showToast('Please select a product first', 'error');
      return;
    }
    const prod = products.find(p => p._id === selectedProductId);
    if (!prod) return;

    // Check if item already exists in invoice items
    const existsIdx = invoiceItems.findIndex(item => item._id === selectedProductId);
    if (existsIdx > -1) {
      const updated = [...invoiceItems];
      updated[existsIdx].qty += Number(selectedProductQty);
      setInvoiceItems(updated);
    } else {
      setInvoiceItems([...invoiceItems, {
        _id: prod._id,
        name: prod.name,
        nameHindi: prod.nameHindi,
        price: prod.price,
        volume: prod.volume,
        qty: Number(selectedProductQty)
      }]);
    }
    showToast(`Added ${prod.name} (x${selectedProductQty}) to invoice`);
  };

  const handleRemoveItemFromInvoice = (id) => {
    setInvoiceItems(invoiceItems.filter(item => item._id !== id));
  };

  const handleClearInvoice = () => {
    setInvoiceItems([]);
    setInvoiceCustomer({ name: '', contact: '', address: '', date: new Date().toISOString().split('T')[0], notes: '' });
    setInvoiceDiscount(0);
    setInvoiceId(`INV-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  };

  const handleGenerateInvoice = async () => {
    if (!invoiceCustomer.name) {
      showToast('Please enter customer name', 'error');
      return;
    }
    if (invoiceItems.length === 0) {
      showToast('Please add at least one product to the invoice', 'error');
      return;
    }

    // Calculations
    const subtotal = invoiceItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const discountVal = Number(invoiceDiscount) || 0;
    const taxable = Math.max(0, subtotal - discountVal);
    const cgst = Math.round(taxable * 0.09);
    const sgst = Math.round(taxable * 0.09);
    const grandTotal = taxable + cgst + sgst;

    const newInvoice = {
      invoiceId,
      customer: { ...invoiceCustomer },
      items: [...invoiceItems],
      subtotal,
      discount: discountVal,
      cgst,
      sgst,
      grandTotal,
      date: invoiceCustomer.date || new Date().toLocaleDateString()
    };

    setLoading(true);
    try {
      await api.post('/invoices', newInvoice);
      showToast('Invoice generated successfully! Opening print dialog...', 'success');
      await loadAllData();
      
      // Trigger printing while the DOM elements are fully populated
      setTimeout(() => {
        window.print();
      }, 150);
    } catch (err) {
      showToast(err.message || 'Error generating invoice', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsPaid = async (id) => {
    if (!window.confirm('Verify payment and send final email to the customer?')) return;
    setLoading(true);
    try {
      await api.put(`/invoices/${id}/mark-paid`, {});
      showToast('Payment verified and invoice email sent!', 'success');
      loadAllData();
    } catch (err) {
      showToast(err.response?.data?.message || err.message || 'Error verifying payment', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInvoice = async (id) => {
    if (!window.confirm('Delete this invoice record from registry?')) return;
    setLoading(true);
    try {
      await api.delete(`/invoices/${id}`);
      showToast('Invoice record deleted');
      loadAllData();
    } catch (err) {
      showToast(err.message || 'Error deleting invoice', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadInvoiceToGenerator = (inv) => {
    setInvoiceId(inv.invoiceId);
    setInvoiceCustomer({
      name: inv.customer.name,
      contact: inv.customer.contact,
      address: inv.customer.address,
      date: inv.date,
      notes: inv.customer.notes || ''
    });
    setInvoiceItems(inv.items);
    setInvoiceDiscount(inv.discount);
    showToast('Invoice details loaded into editor');
  };



  // Show nothing while checking session (avoids login flash on page reload)
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-surface-0 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  // Render Dashboard if Authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-surface-0 text-cream flex items-center justify-center p-5 font-body">
        {/* Background elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-gold/[0.02] blur-[80px] pointer-events-none" />
        
        {loginMode === 'login' ? (
          <form onSubmit={handleLogin} className="w-full max-w-sm border border-border-subtle bg-surface-1/40 p-8 rounded-2xl shadow-2xl relative space-y-6">
            <div className="text-center pb-4 border-b border-border-subtle">
              <div className="w-12 h-12 rounded-full border border-gold/30 flex items-center justify-center bg-gold-subtle mx-auto mb-3">
                <span className="font-display text-gold text-sm font-semibold">स</span>
              </div>
              <h2 className="font-display text-lg font-bold tracking-wider text-cream">SAURABH ADMIN PORTAL</h2>
              <p className="text-[10px] text-cream-ghost uppercase tracking-[0.2em] mt-1">Security Authenticator</p>
            </div>

            {authError && (
              <div className="text-xs text-red-400 bg-red-950/20 border border-red-900/30 p-3 rounded-xl text-center">
                {authError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-cream-ghost mb-1">Username</label>
                <input 
                  type="text" 
                  value={loginUser} 
                  onChange={e => setLoginUser(e.target.value)} 
                  required 
                  placeholder="Username" 
                  className="w-full bg-surface-2 border border-border-subtle rounded-xl p-3 text-xs text-cream focus:outline-none focus:border-gold/40 placeholder-cream-ghost"
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-[10px] uppercase font-bold text-cream-ghost">Password</label>
                  <button
                    type="button"
                    onClick={() => { setLoginMode('forgot'); setAuthError(''); }}
                    className="text-gold hover:text-gold-light text-[10px] uppercase tracking-wider font-bold transition-colors"
                  >
                    Forgot?
                  </button>
                </div>
                <input 
                  type="password" 
                  value={loginPass} 
                  onChange={e => setLoginPass(e.target.value)} 
                  required 
                  placeholder="Password" 
                  className="w-full bg-surface-2 border border-border-subtle rounded-xl p-3 text-xs text-cream focus:outline-none focus:border-gold/40 placeholder-cream-ghost"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold-gradient hover:bg-gold-gradient-hover text-stone-950 py-3 rounded-full text-xs font-bold tracking-wider transition-all duration-300 shadow-md shadow-gold/15 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-stone-950/30 border-t-stone-950 rounded-full animate-spin" />
              ) : (
                'Authenticate Access'
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetSubmit} className="w-full max-w-sm border border-border-subtle bg-surface-1/40 p-8 rounded-2xl shadow-2xl relative space-y-6">
            <div className="text-center pb-4 border-b border-border-subtle">
              <div className="w-12 h-12 rounded-full border border-gold/30 flex items-center justify-center bg-gold-subtle mx-auto mb-3">
                <span className="font-display text-gold text-sm font-semibold">अ</span>
              </div>
              <h2 className="font-display text-lg font-bold tracking-wider text-cream">ACCESS RECOVERY</h2>
              <p className="text-[10px] text-cream-ghost uppercase tracking-[0.2em] mt-1">Credentials Reset Manager</p>
            </div>

            {!resetKeySent ? (
              <div className="space-y-4 text-center">
                <p className="text-xs text-cream-ghost leading-relaxed">
                  A verification key will be sent to the registered email (<span className="text-gold font-semibold">parthgelani08@gmail.com</span>) to recover your admin access.
                </p>
                <button
                  type="button"
                  onClick={handleSendResetKey}
                  disabled={loading}
                  className="w-full bg-gold-gradient hover:bg-gold-gradient-hover text-stone-950 py-3 rounded-full text-xs font-bold tracking-wider transition-all duration-300 shadow-md shadow-gold/15 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-stone-950/30 border-t-stone-950 rounded-full animate-spin" />
                  ) : (
                    'Send Recovery Key'
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-xs text-cream-ghost leading-relaxed text-center pb-2">
                  Please check your inbox at <span className="text-gold font-semibold">parthgelani08@gmail.com</span> for the recovery key.
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-cream-ghost mb-1">Verification Key</label>
                  <input 
                    type="text" 
                    value={resetKey} 
                    onChange={e => setResetKey(e.target.value)} 
                    required 
                    placeholder="Enter 6-digit key" 
                    className="w-full bg-surface-2 border border-border-subtle rounded-xl p-3 text-xs text-cream focus:outline-none focus:border-gold/40 placeholder-cream-ghost text-center font-mono tracking-widest font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-cream-ghost mb-1">New Username</label>
                  <input 
                    type="text" 
                    value={newUsername} 
                    onChange={e => setNewUsername(e.target.value)} 
                    required 
                    placeholder="New admin username" 
                    className="w-full bg-surface-2 border border-border-subtle rounded-xl p-3 text-xs text-cream focus:outline-none focus:border-gold/40 placeholder-cream-ghost"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-cream-ghost mb-1">New Password</label>
                  <input 
                    type="password" 
                    value={newPassword} 
                    onChange={e => setNewPassword(e.target.value)} 
                    required 
                    placeholder="New password" 
                    className="w-full bg-surface-2 border border-border-subtle rounded-xl p-3 text-xs text-cream focus:outline-none focus:border-gold/40 placeholder-cream-ghost"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gold-gradient hover:bg-gold-gradient-hover text-stone-950 py-3 rounded-full text-xs font-bold tracking-wider transition-all duration-300 shadow-md shadow-gold/15 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-stone-950/30 border-t-stone-950 rounded-full animate-spin" />
                  ) : (
                    'Verify & Reset Credentials'
                  )}
                </button>
                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={handleSendResetKey}
                    className="text-cream-ghost hover:text-gold transition-colors text-[10px] uppercase tracking-wider font-semibold"
                  >
                    Resend Code
                  </button>
                </div>
              </div>
            )}

            <div className="border-t border-border-subtle pt-4 text-center">
              <button
                type="button"
                onClick={() => { setLoginMode('login'); setResetKeySent(false); }}
                className="text-cream-ghost hover:text-gold transition-colors text-[10px] uppercase tracking-wider font-semibold"
              >
                Back to Login
              </button>
            </div>
          </form>
        )}
      </div>
    );
  }

  // Render Dashboard if Authenticated
  return (
    <div className="min-h-screen bg-surface-0 text-cream pb-16 relative">
      {/* Header */}
      <header className="border-b border-border-subtle bg-surface-1/30 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full border border-gold/30 flex items-center justify-center bg-gold-subtle">
              <span className="font-display text-gold text-sm font-semibold">स</span>
            </div>
            <span className="font-display text-base font-semibold text-cream tracking-wide">SAURABH ADMIN</span>
          </Link>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => loadAllData()}
              className="w-9 h-9 flex items-center justify-center rounded-full border border-border-subtle hover:bg-surface-2 transition-all duration-300"
              title="Refresh Records"
            >
              <RefreshCw className={`w-4 h-4 text-cream-muted ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button 
              onClick={handleLogout}
              className="px-4 py-2 rounded-full border border-red-500/20 text-red-400 hover:bg-red-950/20 text-xs font-body font-semibold tracking-wide flex items-center gap-2 transition-all"
            >
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-5 sm:px-8 pt-8">
        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="border border-border-subtle bg-surface-1/50 rounded-2xl p-6 flex items-center gap-5">
            <div className="w-12 h-12 rounded-xl bg-gold-subtle border border-gold/15 flex items-center justify-center">
              <Package className="w-5 h-5 text-gold" />
            </div>
            <div>
              <div className="text-2xl font-display font-bold">{products.length}</div>
              <div className="text-xs text-cream-ghost tracking-wide uppercase font-body mt-0.5">Total Products</div>
            </div>
          </div>
          <div className="border border-border-subtle bg-surface-1/50 rounded-2xl p-6 flex items-center gap-5">
            <div className="w-12 h-12 rounded-xl bg-gold-subtle border border-gold/15 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-gold" />
            </div>
            <div>
              <div className="text-2xl font-display font-bold">{testimonials.length}</div>
              <div className="text-xs text-cream-ghost tracking-wide uppercase font-body mt-0.5">Reviews ({testimonials.filter(t => !t.approved).length} Pending)</div>
            </div>
          </div>
          <div className="border border-border-subtle bg-surface-1/50 rounded-2xl p-6 flex items-center gap-5">
            <div className="w-12 h-12 rounded-xl bg-gold-subtle border border-gold/15 flex items-center justify-center">
              <Mail className="w-5 h-5 text-gold" />
            </div>
            <div>
              <div className="text-2xl font-display font-bold">{subscribers.length}</div>
              <div className="text-xs text-cream-ghost tracking-wide uppercase font-body mt-0.5">Newsletter Subscriptions</div>
            </div>
          </div>
          <div className="border border-border-subtle bg-surface-1/50 rounded-2xl p-6 flex items-center gap-5">
            <div className="w-12 h-12 rounded-xl bg-gold-subtle border border-gold/15 flex items-center justify-center">
              <FileText className="w-5 h-5 text-gold" />
            </div>
            <div>
              <div className="text-2xl font-display font-bold">{billingInvoices.length}</div>
              <div className="text-xs text-cream-ghost tracking-wide uppercase font-body mt-0.5">Invoices Generated</div>
            </div>
          </div>
        </div>

        {/* Action Panel Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-border-subtle pb-6 mb-8">
          <div className="flex gap-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart2 },
              { id: 'products', label: 'Products', icon: Package },
              { id: 'testimonials', label: 'Reviews', icon: MessageSquare },
              { id: 'subscribers', label: 'Subscribers', icon: Mail },
              { id: 'billing', label: 'Invoice Generator', icon: FileText },
              { id: 'security', label: 'Security Settings', icon: Shield }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setShowProductForm(false); }}
                className={`px-5 py-2.5 rounded-full text-xs font-body font-semibold tracking-wide flex items-center gap-2 border transition-all ${
                  activeTab === tab.id
                    ? 'border-gold/40 bg-gold-muted text-gold'
                    : 'border-border-subtle text-cream-faint hover:bg-surface-2 hover:text-cream-muted'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            {activeTab !== 'billing' && activeTab !== 'security' && activeTab !== 'dashboard' && (
              <button
                onClick={() => handleExportCSV(activeTab)}
                className="px-4 py-2.5 rounded-full border border-border-default bg-surface-1/30 hover:border-gold/30 hover:bg-gold-subtle text-xs font-body font-semibold tracking-wide flex items-center justify-center gap-2 transition-all"
              >
                <Download className="w-3.5 h-3.5" /> Download Records (CSV)
              </button>
            )}
            {activeTab === 'products' && (
              <button
                onClick={openCreateForm}
                className="bg-gold-gradient hover:bg-gold-gradient-hover text-stone-950 px-5 py-2.5 rounded-full text-xs font-body font-bold tracking-wide flex items-center justify-center gap-2 transition-all shadow-md shadow-gold/10"
              >
                <Plus className="w-4 h-4" /> Add Product
              </button>
            )}
          </div>
        </div>

        {/* Tab Contents */}
        {loading && <div className="text-center py-20 text-cream-ghost font-body">Processing action...</div>}

        {/* ─── DASHBOARD TAB ─────────────────────────────────────────── */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {dashLoading ? (
              <div className="flex items-center justify-center py-24">
                <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
              </div>
            ) : dashStats ? (
              <>
                {/* KPI Cards Row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Revenue', value: `₹${(dashStats.invoices.totalRevenue || 0).toLocaleString('en-IN')}`, sub: `${dashStats.invoices.paid} paid invoices`, icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-950/20 border-emerald-900/30' },
                    { label: 'Total Products', value: dashStats.products.total, sub: `${dashStats.products.outOfStock} out of stock`, icon: Package, color: 'text-blue-400', bg: 'bg-blue-950/20 border-blue-900/30' },
                    { label: 'Subscribers', value: dashStats.subscribers.active, sub: `${dashStats.subscribers.total} total signups`, icon: Users, color: 'text-purple-400', bg: 'bg-purple-950/20 border-purple-900/30' },
                    { label: 'Pending Reviews', value: dashStats.reviews.pending, sub: `${dashStats.reviews.approved} approved`, icon: Star, color: 'text-amber-400', bg: 'bg-amber-950/20 border-amber-900/30' },
                  ].map((kpi, i) => (
                    <div key={i} className={`border rounded-2xl p-5 flex flex-col gap-3 ${kpi.bg}`}>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-widest font-bold text-cream-ghost font-body">{kpi.label}</span>
                        <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
                      </div>
                      <div className={`text-3xl font-display font-bold ${kpi.color}`}>{kpi.value}</div>
                      <div className="text-[10px] text-cream-ghost font-body">{kpi.sub}</div>
                    </div>
                  ))}
                </div>

                {/* Revenue Chart + Category Breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                  {/* Monthly Revenue Bar Chart */}
                  <div className="lg:col-span-2 border border-border-subtle bg-surface-1/40 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-display text-sm font-semibold text-cream tracking-wide">Revenue — Last 6 Months</h3>
                      <TrendingUp className="w-4 h-4 text-gold" />
                    </div>
                    <div className="flex items-end gap-2 h-40">
                      {(dashStats.invoices.monthlyRevenue || []).map((m, i) => {
                        const maxRev = Math.max(...(dashStats.invoices.monthlyRevenue || []).map(x => x.revenue || 0), 1);
                        const pct = ((m.revenue || 0) / maxRev) * 100;
                        return (
                          <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                            <div className="text-[9px] text-gold font-bold font-body opacity-0 group-hover:opacity-100 transition-opacity">
                              ₹{((m.revenue || 0) / 1000).toFixed(0)}k
                            </div>
                            <div className="w-full relative rounded-t-sm overflow-hidden bg-surface-2" style={{ height: '120px' }}>
                              <div
                                className="absolute bottom-0 w-full bg-gradient-to-t from-gold/80 to-gold/30 rounded-t-sm transition-all duration-700"
                                style={{ height: `${Math.max(pct, 3)}%` }}
                              />
                            </div>
                            <div className="text-[9px] text-cream-ghost font-body text-center">{m.month}</div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-4 pt-4 border-t border-border-subtle flex justify-between text-[10px] text-cream-ghost font-body">
                      <span>Total: <span className="text-gold font-bold">₹{(dashStats.invoices.totalRevenue || 0).toLocaleString('en-IN')}</span></span>
                      <span>Invoices: <span className="text-cream font-bold">{dashStats.invoices.total}</span></span>
                    </div>
                  </div>

                  {/* Category Pie-style Breakdown */}
                  <div className="border border-border-subtle bg-surface-1/40 rounded-2xl p-6">
                    <h3 className="font-display text-sm font-semibold text-cream tracking-wide mb-6">Catalog by Category</h3>
                    <div className="space-y-3">
                      {(dashStats.categoryBreakdown || []).map((cat, i) => {
                        const total = (dashStats.categoryBreakdown || []).reduce((s, c) => s + c.count, 0) || 1;
                        const pct = Math.round((cat.count / total) * 100);
                        const colors = ['bg-gold', 'bg-amber-500', 'bg-emerald-500', 'bg-blue-500', 'bg-purple-500', 'bg-rose-500', 'bg-cyan-500'];
                        return (
                          <div key={i} className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${colors[i % colors.length]}`} />
                            <div className="flex-1">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-[11px] text-cream capitalize font-body">{cat.name}</span>
                                <span className="text-[10px] text-cream-ghost">{cat.count} · {pct}%</span>
                              </div>
                              <div className="h-1.5 bg-surface-2 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full ${colors[i % colors.length]} opacity-70`} style={{ width: `${pct}%` }} />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Top Products + Weekly Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                  {/* Top Products Table */}
                  <div className="lg:col-span-2 border border-border-subtle bg-surface-1/40 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-display text-sm font-semibold text-cream tracking-wide">Top Products by Revenue</h3>
                      <Award className="w-4 h-4 text-gold" />
                    </div>
                    <div className="space-y-3">
                      {(dashStats.topProducts || []).length === 0 ? (
                        <p className="text-xs text-cream-ghost font-body text-center py-8">No invoice data yet. Generate invoices to see top products.</p>
                      ) : (dashStats.topProducts || []).map((p, i) => (
                        <div key={i} className="flex items-center gap-4 py-2 border-b border-border-subtle/50 last:border-0">
                          <div className="w-6 h-6 rounded-full bg-gold-subtle border border-gold/20 flex items-center justify-center text-[10px] font-bold text-gold font-display">
                            {i + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs text-cream font-body font-semibold truncate">{p.name}</div>
                            <div className="text-[10px] text-cream-ghost">{p.orders} order{p.orders !== 1 ? 's' : ''}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-gold font-display">₹{(p.revenue || 0).toLocaleString('en-IN')}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Weekly Activity Sparkline + Quick Stats */}
                  <div className="border border-border-subtle bg-surface-1/40 rounded-2xl p-6 flex flex-col gap-6">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-display text-sm font-semibold text-cream tracking-wide">7-Day Orders</h3>
                        <Activity className="w-4 h-4 text-gold" />
                      </div>
                      <div className="flex items-end gap-1 h-16">
                        {(dashStats.weeklyActivity || [0,0,0,0,0,0,0]).map((v, i) => {
                          const max = Math.max(...(dashStats.weeklyActivity || [1]), 1);
                          const days = ['Mo','Tu','We','Th','Fr','Sa','Su'];
                          const today = new Date().getDay();
                          const dayIdx = (today - 6 + i + 7) % 7;
                          return (
                            <div key={i} className="flex-1 flex flex-col items-center gap-1">
                              <div className="w-full rounded-t-sm bg-gold/30 hover:bg-gold/60 transition-colors" style={{ height: `${Math.max((v / max) * 52, v > 0 ? 8 : 2)}px` }} />
                              <span className="text-[8px] text-cream-ghost">{days[dayIdx]}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div className="space-y-3 pt-2 border-t border-border-subtle">
                      {[
                        { label: 'In Stock', value: dashStats.products.inStock, total: dashStats.products.total, color: 'text-emerald-400' },
                        { label: 'Featured', value: dashStats.products.featured, total: dashStats.products.total, color: 'text-gold' },
                        { label: 'Reviews Live', value: dashStats.reviews.approved, total: dashStats.reviews.total, color: 'text-blue-400' },
                      ].map((s, i) => (
                        <div key={i} className="flex justify-between text-xs font-body">
                          <span className="text-cream-ghost">{s.label}</span>
                          <span className={`font-semibold ${s.color}`}>{s.value} <span className="text-cream-ghost font-normal">/ {s.total}</span></span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recent Invoices */}
                {(dashStats.invoices.recentInvoices || []).length > 0 && (
                  <div className="border border-border-subtle bg-surface-1/40 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-display text-sm font-semibold text-cream tracking-wide">Recent Invoices</h3>
                      <button onClick={() => setActiveTab('billing')} className="text-[10px] text-gold hover:underline font-body">View All →</button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs font-body">
                        <thead>
                          <tr className="border-b border-border-subtle text-cream-ghost text-[10px] uppercase tracking-wider">
                            <th className="pb-2 text-left">Invoice</th>
                            <th className="pb-2 text-left">Customer</th>
                            <th className="pb-2 text-center">Date</th>
                            <th className="pb-2 text-center">Status</th>
                            <th className="pb-2 text-right">Amount</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border-subtle/40">
                          {(dashStats.invoices.recentInvoices || []).map((inv, i) => (
                            <tr key={i} className="text-cream">
                              <td className="py-2 font-mono text-[11px] text-gold">{inv.invoiceId}</td>
                              <td className="py-2">{inv.customer?.name || 'Walk-in'}</td>
                              <td className="py-2 text-center text-cream-ghost">{inv.date || '—'}</td>
                              <td className="py-2 text-center">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${inv.paymentStatus === 'Paid' ? 'bg-emerald-950/30 text-emerald-400' : 'bg-gold-subtle text-gold'}`}>
                                  {inv.paymentStatus || 'Pending'}
                                </span>
                              </td>
                              <td className="py-2 text-right font-bold text-gold">₹{(inv.grandTotal || 0).toLocaleString('en-IN')}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'Add Product', icon: Plus, action: () => { setActiveTab('products'); setTimeout(openCreateForm, 50); }, color: 'border-gold/30 hover:bg-gold-subtle text-gold' },
                    { label: 'View Reviews', icon: MessageSquare, action: () => setActiveTab('testimonials'), color: 'border-blue-900/40 hover:bg-blue-950/20 text-blue-400' },
                    { label: 'New Invoice', icon: Printer, action: () => setActiveTab('billing'), color: 'border-emerald-900/40 hover:bg-emerald-950/20 text-emerald-400' },
                    { label: 'Security', icon: Shield, action: () => setActiveTab('security'), color: 'border-purple-900/40 hover:bg-purple-950/20 text-purple-400' },
                  ].map((q, i) => (
                    <button key={i} onClick={q.action} className={`border rounded-xl p-4 flex flex-col items-center gap-2 transition-all font-body ${q.color}`}>
                      <q.icon className="w-5 h-5" />
                      <span className="text-[11px] font-semibold">{q.label}</span>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-24 text-cream-ghost font-body text-sm">
                <BarChart2 className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>No dashboard data available.</p>
                <button onClick={loadDashboard} className="mt-4 text-gold hover:underline text-xs">Retry</button>
              </div>
            )}
          </div>
        )}

        {!loading && activeTab === 'products' && !showProductForm && (
          <div className="border border-border-subtle bg-surface-1/30 rounded-2xl overflow-hidden shadow-xl">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-surface-2/80 text-cream-ghost border-b border-border-subtle font-body text-xs uppercase tracking-wider">
                  <th className="p-4 sm:p-5">Details</th>
                  <th className="p-4 sm:p-5">Price</th>
                  <th className="p-4 sm:p-5">Category</th>
                  <th className="p-4 sm:p-5">Stock status</th>
                  <th className="p-4 sm:p-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle font-body">
                {products.map(p => (
                  <tr key={p._id} className="hover:bg-surface-2/30 transition-colors">
                    <td className="p-4 sm:p-5 flex items-center gap-4">
                      <img src={p.image} alt={p.name} className="w-10 h-12 object-cover rounded-md border border-border-subtle" />
                      <div>
                        <div className="font-display font-semibold text-cream text-base">{p.name}</div>
                        <div className="text-xs text-cream-ghost mt-0.5">{p.subtitle}</div>
                      </div>
                    </td>
                    <td className="p-4 sm:p-5">
                      <div className="text-gold font-semibold">₹{p.price.toLocaleString('en-IN')}</div>
                      {p.originalPrice && <div className="text-xs text-cream-ghost line-through">₹{p.originalPrice.toLocaleString('en-IN')}</div>}
                    </td>
                    <td className="p-4 sm:p-5 capitalize">{p.category}</td>
                    <td className="p-4 sm:p-5">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${p.inStock ? 'bg-gold-subtle text-gold border border-gold/15' : 'bg-red-950/20 text-red-400 border border-red-900/30'}`}>
                        {p.inStock ? `In Stock (${p.stockCount})` : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="p-4 sm:p-5 text-right">
                      <div className="inline-flex gap-2">
                        <button onClick={() => openEditForm(p)} className="p-2 rounded-full border border-border-default hover:border-gold/30 hover:bg-gold-subtle text-cream-muted hover:text-gold transition-all" title="Edit Product">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDeleteProduct(p._id)} className="p-2 rounded-full border border-border-default hover:border-red-900/40 hover:bg-red-950/20 text-cream-muted hover:text-red-400 transition-all" title="Delete Product">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Product Form Create / Edit */}
        {!loading && activeTab === 'products' && showProductForm && (
          <form onSubmit={handleProductSubmit} className="border border-border-subtle bg-surface-1/40 p-6 sm:p-8 rounded-2xl max-w-4xl mx-auto shadow-2xl">
            <h2 className="font-display text-xl text-gold mb-6 pb-3 border-b border-border-subtle">
              {editingProduct ? 'Modify Product Specifications' : 'Add New Fragrance Masterpiece'}
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-xs text-cream-muted uppercase tracking-wider mb-2 font-semibold">Fragrance Name (English) *</label>
                <input 
                  type="text" 
                  value={productForm.name} 
                  onChange={e => setProductForm({...productForm, name: e.target.value})} 
                  required 
                  className="w-full bg-surface-2 border border-border-subtle rounded-xl p-3 text-sm text-cream focus:outline-none focus:border-gold/40"
                />
              </div>
              <div>
                <label className="block text-xs text-cream-muted uppercase tracking-wider mb-2 font-semibold">Fragrance Name (Hindi swara)</label>
                <input 
                  type="text" 
                  value={productForm.nameHindi} 
                  onChange={e => setProductForm({...productForm, nameHindi: e.target.value})} 
                  placeholder="e.g. मिट्टी अत्तर"
                  className="w-full bg-surface-2 border border-border-subtle rounded-xl p-3 text-sm text-cream focus:outline-none focus:border-gold/40"
                />
              </div>
              <div>
                <label className="block text-xs text-cream-muted uppercase tracking-wider mb-2 font-semibold">Sub-Heading / Tagline *</label>
                <input 
                  type="text" 
                  value={productForm.subtitle} 
                  onChange={e => setProductForm({...productForm, subtitle: e.target.value})} 
                  required 
                  placeholder="e.g. The Scent of First Rain on Earth"
                  className="w-full bg-surface-2 border border-border-subtle rounded-xl p-3 text-sm text-cream focus:outline-none focus:border-gold/40"
                />
              </div>
              <div>
                <label className="block text-xs text-cream-muted uppercase tracking-wider mb-2 font-semibold">Distillery Origin Location</label>
                <input 
                  type="text" 
                  value={productForm.origin} 
                  onChange={e => setProductForm({...productForm, origin: e.target.value})} 
                  placeholder="e.g. Uttar Pradesh, India"
                  className="w-full bg-surface-2 border border-border-subtle rounded-xl p-3 text-sm text-cream focus:outline-none focus:border-gold/40"
                />
              </div>
              <div>
                <label className="block text-xs text-cream-muted uppercase tracking-wider mb-2 font-semibold">Price (INR) *</label>
                <input 
                  type="number" 
                  value={productForm.price} 
                  onChange={e => setProductForm({...productForm, price: e.target.value})} 
                  required 
                  className="w-full bg-surface-2 border border-border-subtle rounded-xl p-3 text-sm text-cream focus:outline-none focus:border-gold/40"
                />
              </div>
              <div>
                <label className="block text-xs text-cream-muted uppercase tracking-wider mb-2 font-semibold">Original/Striking Price (INR - optional)</label>
                <input 
                  type="number" 
                  value={productForm.originalPrice} 
                  onChange={e => setProductForm({...productForm, originalPrice: e.target.value})} 
                  className="w-full bg-surface-2 border border-border-subtle rounded-xl p-3 text-sm text-cream focus:outline-none focus:border-gold/40"
                />
              </div>
              <div>
                <label className="block text-xs text-cream-muted uppercase tracking-wider mb-2 font-semibold">Category Classification *</label>
                <select 
                  value={productForm.category} 
                  onChange={e => setProductForm({...productForm, category: e.target.value})}
                  className="w-full bg-surface-2 border border-border-subtle rounded-xl p-3 text-sm text-cream focus:outline-none focus:border-gold/40"
                >
                  <option value="floral">Floral</option>
                  <option value="woody">Woody</option>
                  <option value="spicy">Spicy</option>
                  <option value="rare">Rare & Limited</option>
                  <option value="fresh">Fresh</option>
                  <option value="oriental">Oriental</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-cream-muted uppercase tracking-wider mb-2 font-semibold">Volume Unit</label>
                <input 
                  type="text" 
                  value={productForm.volume} 
                  onChange={e => setProductForm({...productForm, volume: e.target.value})} 
                  className="w-full bg-surface-2 border border-border-subtle rounded-xl p-3 text-sm text-cream focus:outline-none focus:border-gold/40"
                />
              </div>
              <div>
                <label className="block text-xs text-cream-muted uppercase tracking-wider mb-2 font-semibold">Creative Badge</label>
                <select 
                  value={productForm.badge} 
                  onChange={e => setProductForm({...productForm, badge: e.target.value})}
                  className="w-full bg-surface-2 border border-border-subtle rounded-xl p-3 text-sm text-cream focus:outline-none focus:border-gold/40"
                >
                  <option value="">None</option>
                  <option value="Bestseller">Bestseller</option>
                  <option value="Classic">Classic</option>
                  <option value="Premium">Premium</option>
                  <option value="Rare">Rare</option>
                  <option value="New">New</option>
                  <option value="Limited">Limited</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-cream-muted uppercase tracking-wider mb-2 font-semibold">Color Swatch hex</label>
                <input 
                  type="color" 
                  value={productForm.colorSwatch} 
                  onChange={e => setProductForm({...productForm, colorSwatch: e.target.value})} 
                  className="w-full h-11 bg-surface-2 border border-border-subtle rounded-xl p-1 focus:outline-none focus:border-gold/40"
                />
              </div>
              <div>
                <label className="block text-xs text-cream-muted uppercase tracking-wider mb-2 font-semibold">Image URL *</label>
                <input 
                  type="text" 
                  value={productForm.image} 
                  onChange={e => setProductForm({...productForm, image: e.target.value})} 
                  required 
                  className="w-full bg-surface-2 border border-border-subtle rounded-xl p-3 text-sm text-cream focus:outline-none focus:border-gold/40"
                />
              </div>
              <div>
                <label className="block text-xs text-cream-muted uppercase tracking-wider mb-2 font-semibold">Tags (comma separated)</label>
                <input 
                  type="text" 
                  value={productForm.tags} 
                  onChange={e => setProductForm({...productForm, tags: e.target.value})} 
                  placeholder="e.g. bestseller, monsoon, earthy"
                  className="w-full bg-surface-2 border border-border-subtle rounded-xl p-3 text-sm text-cream focus:outline-none focus:border-gold/40"
                />
              </div>
              <div>
                <label className="block text-xs text-cream-muted uppercase tracking-wider mb-2 font-semibold">Stock Quantity</label>
                <input 
                  type="number" 
                  value={productForm.stockCount} 
                  onChange={e => setProductForm({...productForm, stockCount: Number(e.target.value)})} 
                  className="w-full bg-surface-2 border border-border-subtle rounded-xl p-3 text-sm text-cream focus:outline-none focus:border-gold/40"
                />
              </div>
              <div className="flex gap-6 mt-8">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={productForm.inStock} 
                    onChange={e => setProductForm({...productForm, inStock: e.target.checked})}
                    className="accent-gold w-4 h-4"
                  />
                  <span className="text-xs uppercase text-cream-muted font-semibold tracking-wider">In Stock status</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={productForm.featured} 
                    onChange={e => setProductForm({...productForm, featured: e.target.checked})}
                    className="accent-gold w-4 h-4"
                  />
                  <span className="text-xs uppercase text-cream-muted font-semibold tracking-wider">Featured item</span>
                </label>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-xs text-cream-muted uppercase tracking-wider mb-2 font-semibold">Fragrance Narrative / Detailed Description *</label>
              <textarea 
                value={productForm.description} 
                onChange={e => setProductForm({...productForm, description: e.target.value})} 
                required 
                rows="4"
                className="w-full bg-surface-2 border border-border-subtle rounded-xl p-3 text-sm text-cream focus:outline-none focus:border-gold/40 resize-y"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border-subtle">
              <button 
                type="button" 
                onClick={() => setShowProductForm(false)}
                className="px-6 py-3 rounded-full border border-border-default hover:bg-surface-2 text-xs font-body font-semibold tracking-wider transition-all"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="bg-gold-gradient hover:bg-gold-gradient-hover text-stone-950 px-8 py-3 rounded-full text-xs font-body font-bold tracking-wider transition-all shadow-md shadow-gold/15"
              >
                {editingProduct ? 'Save Changes' : 'Publish Fragrance'}
              </button>
            </div>
          </form>
        )}

        {/* Testimonials Review approval panel */}
        {!loading && activeTab === 'testimonials' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map(t => (
              <div key={t._id} className="border border-border-subtle bg-surface-1/40 p-6 rounded-2xl shadow-lg flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg key={i} className={`w-3.5 h-3.5 ${i < t.rating ? 'text-gold' : 'text-border-default'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold ${t.approved ? 'bg-gold-subtle text-gold border border-gold/15' : 'bg-yellow-950/20 text-yellow-400 border border-yellow-900/30'}`}>
                      {t.approved ? 'Approved' : 'Pending Approval'}
                    </span>
                  </div>
                  
                  <p className="font-accent italic text-cream-muted text-base leading-relaxed mb-4">"{t.text}"</p>
                </div>

                <div className="pt-4 border-t border-border-subtle flex items-center justify-between">
                  <div>
                    <div className="text-sm font-body font-semibold text-cream">{t.name}</div>
                    <div className="text-xs text-cream-ghost">{t.location}{t.productName ? ` · ${t.productName}` : ''}</div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggleApproval(t._id, t.approved)}
                      className={`p-2 rounded-full border border-border-default transition-all ${
                        t.approved 
                          ? 'hover:border-yellow-900/40 hover:bg-yellow-950/20 hover:text-yellow-400 text-cream-muted' 
                          : 'hover:border-gold/30 hover:bg-gold-subtle hover:text-gold text-cream-muted'
                      }`}
                      title={t.approved ? 'Move to Pending' : 'Approve Testimonial'}
                    >
                      {t.approved ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleDeleteReview(t._id)}
                      className="p-2 rounded-full border border-border-default hover:border-red-900/40 hover:bg-red-950/20 text-cream-muted hover:text-red-400 transition-all"
                      title="Delete Testimonial"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {testimonials.length === 0 && (
              <div className="col-span-2 text-center py-20 text-cream-ghost font-body">No testimonials submitted yet.</div>
            )}
          </div>
        )}

        {/* Newsletter Subscribers lists panel */}
        {!loading && activeTab === 'subscribers' && (
          <div className="border border-border-subtle bg-surface-1/30 rounded-2xl overflow-hidden shadow-xl max-w-3xl mx-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-surface-2/80 text-cream-ghost border-b border-border-subtle font-body text-xs uppercase tracking-wider">
                  <th className="p-4 sm:p-5">Subscriber Email</th>
                  <th className="p-4 sm:p-5">Subscription Date</th>
                  <th className="p-4 sm:p-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle font-body">
                {subscribers.map(s => (
                  <tr key={s._id} className="hover:bg-surface-2/30 transition-colors">
                    <td className="p-4 sm:p-5 font-semibold text-cream-muted">{s.email}</td>
                    <td className="p-4 sm:p-5 text-xs text-cream-ghost">{new Date(s.subscribedAt).toLocaleDateString()}</td>
                    <td className="p-4 sm:p-5 text-right">
                      <button 
                        onClick={() => handleDeleteSubscriber(s._id)} 
                        className="p-2 rounded-full border border-border-default hover:border-red-900/40 hover:bg-red-950/20 text-cream-muted hover:text-red-400 transition-all" 
                        title="Remove Subscriber"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {subscribers.length === 0 && (
              <div className="text-center py-20 text-cream-ghost">No email subscribers found.</div>
            )}
          </div>
        )}

        {/* Invoice / Billing Workspace */}
        {!loading && activeTab === 'billing' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left side: Invoice Creator Form */}
            <div className="lg:col-span-5 space-y-6">
              <div className="border border-border-subtle bg-surface-1/40 p-6 rounded-2xl shadow-xl space-y-5">
                <h3 className="font-display text-lg text-gold border-b border-border-subtle pb-2 font-semibold">1. Recipient Information</h3>
                <div className="space-y-4 font-body">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-cream-ghost mb-1">Customer Full Name *</label>
                    <input 
                      type="text" 
                      value={invoiceCustomer.name} 
                      onChange={e => setInvoiceCustomer({ ...invoiceCustomer, name: e.target.value })} 
                      placeholder="e.g. Rukmani Pall" 
                      className="w-full bg-surface-2 border border-border-subtle rounded-xl p-2.5 text-xs text-cream focus:outline-none focus:border-gold/40"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-cream-ghost mb-1">Contact Email / Phone</label>
                    <input 
                      type="text" 
                      value={invoiceCustomer.contact} 
                      onChange={e => setInvoiceCustomer({ ...invoiceCustomer, contact: e.target.value })} 
                      placeholder="e.g. +91 98765 43210" 
                      className="w-full bg-surface-2 border border-border-subtle rounded-xl p-2.5 text-xs text-cream focus:outline-none focus:border-gold/40"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-cream-ghost mb-1">Billing / Delivery Address</label>
                    <textarea 
                      value={invoiceCustomer.address} 
                      onChange={e => setInvoiceCustomer({ ...invoiceCustomer, address: e.target.value })} 
                      placeholder="Address details..." 
                      rows="2"
                      className="w-full bg-surface-2 border border-border-subtle rounded-xl p-2.5 text-xs text-cream focus:outline-none focus:border-gold/40 resize-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-cream-ghost mb-1">Date</label>
                      <input 
                        type="date" 
                        value={invoiceCustomer.date} 
                        onChange={e => setInvoiceCustomer({ ...invoiceCustomer, date: e.target.value })} 
                        className="w-full bg-surface-2 border border-border-subtle rounded-xl p-2.5 text-xs text-cream focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-cream-ghost mb-1">Invoice Code</label>
                      <input 
                        type="text" 
                        value={invoiceId} 
                        onChange={e => setInvoiceId(e.target.value)} 
                        className="w-full bg-surface-2 border border-border-subtle rounded-xl p-2.5 text-xs text-cream focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-border-subtle bg-surface-1/40 p-6 rounded-2xl shadow-xl space-y-5">
                <h3 className="font-display text-lg text-gold border-b border-border-subtle pb-2 font-semibold">2. Choose Products</h3>
                <div className="space-y-4 font-body">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-cream-ghost mb-1">Select Fragrance</label>
                    <select 
                      value={selectedProductId} 
                      onChange={e => setSelectedProductId(e.target.value)}
                      className="w-full bg-surface-2 border border-border-subtle rounded-xl p-2.5 text-xs text-cream focus:outline-none"
                    >
                      {products.map(p => (
                        <option key={p._id} value={p._id}>{p.name} — ₹{p.price.toLocaleString('en-IN')}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-3 gap-4 items-end">
                    <div className="col-span-2">
                      <label className="block text-[10px] uppercase font-bold text-cream-ghost mb-1">Quantity</label>
                      <input 
                        type="number" 
                        min="1"
                        value={selectedProductQty} 
                        onChange={e => setSelectedProductQty(Number(e.target.value))} 
                        className="w-full bg-surface-2 border border-border-subtle rounded-xl p-2.5 text-xs text-cream focus:outline-none"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddItemToInvoice}
                      className="bg-gold-subtle hover:bg-gold/15 text-gold border border-gold/30 p-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-300"
                    >
                      <PlusCircle className="w-4 h-4" /> Add Item
                    </button>
                  </div>
                </div>
              </div>

              <div className="border border-border-subtle bg-surface-1/40 p-6 rounded-2xl shadow-xl space-y-5">
                <h3 className="font-display text-lg text-gold border-b border-border-subtle pb-2 font-semibold">3. Adjustments</h3>
                <div className="grid grid-cols-2 gap-4 font-body">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-cream-ghost mb-1">Special Discount (₹)</label>
                    <input 
                      type="number" 
                      min="0"
                      value={invoiceDiscount} 
                      onChange={e => setInvoiceDiscount(Number(e.target.value))} 
                      className="w-full bg-surface-2 border border-border-subtle rounded-xl p-2.5 text-xs text-cream focus:outline-none"
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <button
                      type="button"
                      onClick={handleClearInvoice}
                      className="w-full border border-border-default hover:bg-surface-2 p-2.5 rounded-xl text-xs font-semibold text-cream-muted transition-all"
                    >
                      Reset Sheet
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side: Live Stationery Invoice Sheet */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Stationery Invoice wrapper */}
              <div 
                id="invoice-print-area" 
                className="border border-border-default bg-surface-0 p-8 sm:p-12 rounded-2xl shadow-2xl text-stone-900 font-body relative overflow-hidden"
              >
                {/* Vintage Watermark Accent */}
                <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full border border-stone-200/50 flex items-center justify-center text-[100px] text-stone-100 font-display select-none pointer-events-none">अ</div>

                {/* Logo & Store Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b-2 border-stone-800 pb-6 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full border-2 border-stone-800 flex items-center justify-center bg-stone-50">
                      <span className="font-display text-stone-900 text-xl font-bold leading-none">स</span>
                    </div>
                    <div>
                      <h1 className="font-display text-xl font-bold tracking-wider leading-none text-stone-900">SAURABH PERFUMES</h1>
                      <span className="text-[9px] tracking-[0.25em] uppercase text-stone-500 font-semibold mt-1 block">The Soul of Pure Fragrance</span>
                    </div>
                  </div>
                  {/* Company info removed from top right corner */}
                </div>

                {/* Tax Invoice Details / Bill To */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 text-xs text-stone-600">
                  <div className="space-y-1">
                    <div className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Billed Recipient:</div>
                    <div className="text-sm font-bold text-stone-950">{invoiceCustomer.name || 'Walk-in Customer'}</div>
                    {invoiceCustomer.contact && <div>{invoiceCustomer.contact}</div>}
                    {invoiceCustomer.address && <div className="max-w-xs">{invoiceCustomer.address}</div>}
                  </div>
                  <div className="space-y-1 sm:text-right">
                    <div className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Invoice Info:</div>
                    <div className="text-sm font-bold text-stone-950">{invoiceId}</div>
                    <div><span className="font-semibold text-stone-800">Date:</span> {invoiceCustomer.date}</div>
                    <div><span className="font-semibold text-stone-800">Supply State:</span> Gujrat (24)</div>
                  </div>
                </div>

                {/* Items Table */}
                <table className="w-full text-left border-collapse text-xs mb-8">
                  <thead>
                    <tr className="border-b-2 border-stone-800 font-bold text-stone-800 uppercase tracking-wider text-[10px]">
                      <th className="py-2.5">Item Specification</th>
                      <th className="py-2.5 text-center">Volume</th>
                      <th className="py-2.5 text-center">Price</th>
                      <th className="py-2.5 text-center">Qty</th>
                      <th className="py-2.5 text-right">Net Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {invoiceItems.map((item, idx) => (
                      <tr key={item._id || idx} className="text-stone-700">
                        <td className="py-3 flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => handleRemoveItemFromInvoice(item._id)}
                            className="p-1 rounded text-stone-400 hover:text-red-600 border border-transparent hover:border-red-200 print:hidden transition-colors"
                            title="Remove"
                          >
                            <Trash className="w-3 h-3" />
                          </button>
                          <div>
                            <div className="font-bold text-stone-900">{item.name}</div>
                            {item.nameHindi && <div className="text-[10px] text-stone-400">{item.nameHindi}</div>}
                          </div>
                        </td>
                        <td className="py-3 text-center">{item.volume || '12ml'}</td>
                        <td className="py-3 text-center">₹{item.price.toLocaleString('en-IN')}</td>
                        <td className="py-3 text-center">{item.qty}</td>
                        <td className="py-3 text-right font-semibold">₹{(item.price * item.qty).toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                    {invoiceItems.length === 0 && (
                      <tr>
                        <td colSpan="5" className="py-8 text-center text-stone-400 italic">No products added. Select items on the left to build the bill.</td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {/* Summary Calculations */}
                <div className="border-t-2 border-stone-800 pt-6 flex flex-col sm:flex-row justify-between items-start gap-6">
                  <div className="text-[11px] text-stone-500 leading-normal max-w-xs">
                    <span className="font-bold text-stone-700 uppercase tracking-wider block mb-1">Terms & Attestations</span>
                    Authentic raw floral oils extracted using traditional hydro-distillation. Store in dry cooling areas. Shelf life unlimited.
                  </div>
                  
                  <div className="w-full sm:w-64 text-xs space-y-1.5">
                    <div className="flex justify-between text-stone-600">
                      <span>Total Value:</span>
                      <span className="font-semibold">₹{invoiceItems.reduce((sum, item) => sum + (item.price * item.qty), 0).toLocaleString('en-IN')}</span>
                    </div>
                    {invoiceDiscount > 0 && (
                      <div className="flex justify-between text-stone-600">
                        <span>Less Discount:</span>
                        <span className="font-semibold">-₹{invoiceDiscount.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-stone-600">
                      <span>Central Tax (CGST 9%):</span>
                      <span>₹{(Math.max(0, invoiceItems.reduce((sum, item) => sum + (item.price * item.qty), 0) - invoiceDiscount) * 0.09).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-stone-600">
                      <span>State Tax (SGST 9%):</span>
                      <span>₹{(Math.max(0, invoiceItems.reduce((sum, item) => sum + (item.price * item.qty), 0) - invoiceDiscount) * 0.09).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between border-t border-stone-300 pt-2 text-sm font-bold text-stone-950">
                      <span>Total Payable:</span>
                      <span className="text-gold font-display text-base">₹{(
                        Math.max(0, invoiceItems.reduce((sum, item) => sum + (item.price * item.qty), 0) - invoiceDiscount) * 1.18
                      ).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                    </div>
                  </div>
                </div>

                {/* Signature Row */}
                <div className="mt-12 pt-8 border-t border-stone-200 flex justify-between items-end text-[10px] text-stone-400">
                  <div>
                    <div>Verification Status: <span className="text-green-600 font-bold">APPROVED ONLINE</span></div>
                    <div>Digital Trace ID: {invoiceId}-SAURABH</div>
                  </div>
                  <div className="text-right">
                    <div className="w-32 border-b border-stone-300 pb-1 text-center font-display italic text-stone-600">Meet Gelani</div>
                    <div className="mt-1">Authorized Signatory</div>
                  </div>
                </div>

              </div>

              {/* Action Buttons to print / save invoice */}
              <div className="flex justify-end gap-3 p-4 border border-border-subtle bg-surface-1/40 rounded-2xl shadow-xl">
                <button
                  type="button"
                  onClick={handleGenerateInvoice}
                  disabled={invoiceItems.length === 0}
                  className="bg-gold-gradient hover:bg-gold-gradient-hover text-stone-950 px-8 py-3 rounded-full text-xs font-bold tracking-wider transition-all duration-300 shadow-md shadow-gold/15 flex items-center gap-2 disabled:opacity-50"
                >
                  <Printer className="w-4 h-4" /> Print / Save Tax Invoice
                </button>
              </div>

              {/* Invoices Log / Session History */}
              <div className="border border-border-subtle bg-surface-1/40 p-6 rounded-2xl shadow-xl space-y-4">
                <div className="flex justify-between items-center border-b border-border-subtle pb-2">
                  <h3 className="font-display text-sm text-cream font-semibold tracking-wide uppercase">Session Billing Registry</h3>
                  <span className="bg-gold-subtle text-gold px-2.5 py-0.5 rounded text-[10px] uppercase font-bold border border-gold/15">
                    Total: {billingInvoices.length}
                  </span>
                </div>
                {billingInvoices.length > 0 ? (
                  <div className="divide-y divide-border-subtle max-h-60 overflow-y-auto scrollbar-thin">
                    {billingInvoices.map((inv, idx) => (
                      <div key={inv.invoiceId || idx} className="py-3 flex items-center justify-between gap-4 text-xs font-body">
                        <div>
                          <div className="font-display font-semibold text-cream">{inv.customer?.name || 'Walk-in'} ({inv.invoiceId})</div>
                          <div className="text-[10px] text-cream-ghost mt-0.5">{inv.date} · {inv.items?.length} Items</div>
                          <div className="flex gap-1.5 mt-1">
                            <span className="inline-block px-2 py-0.5 rounded bg-surface-2 border border-border-subtle text-[9px] uppercase font-bold text-cream-ghost">
                              {inv.paymentMethod || 'UPI'}
                            </span>
                            <span className={`inline-block px-2 py-0.5 rounded text-[9px] uppercase font-bold ${
                              (inv.paymentStatus || 'Pending') === 'Paid'
                                ? 'bg-green-950/20 text-green-400 border border-green-900/30'
                                : 'bg-gold-subtle text-gold border border-gold/15'
                            }`}>
                              {inv.paymentStatus || 'Pending'}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-gold">₹{inv.grandTotal?.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                          {inv.paymentMethod === 'UPI' && inv.paymentStatus !== 'Paid' && (
                            <button
                              onClick={() => handleMarkAsPaid(inv._id || inv.invoiceId)}
                              className="px-2.5 py-1 rounded bg-gold/10 hover:bg-gold/25 border border-gold/30 text-gold hover:text-white transition-all text-[10px] font-bold"
                            >
                              Verify Pay & Email
                            </button>
                          )}
                          <button
                            onClick={() => handleLoadInvoiceToGenerator(inv)}
                            className="p-1 rounded border border-border-subtle hover:border-gold/30 text-cream-ghost hover:text-gold transition-colors"
                            title="Edit / Reprint"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteInvoice(inv.invoiceId)}
                            className="p-1 rounded border border-border-subtle hover:border-red-900/40 text-cream-ghost hover:text-red-400 transition-colors"
                            title="Delete Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-cream-ghost italic text-xs font-body">
                    No invoices generated yet. Select items on the left to print and record your first invoice.
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

        {!loading && activeTab === 'security' && (
          <div className="max-w-md mx-auto">
            <form onSubmit={handleUpdateCredentials} className="border border-border-subtle bg-surface-1/40 p-6 sm:p-8 rounded-2xl shadow-2xl space-y-6">
              <h3 className="font-display text-lg text-gold border-b border-border-subtle pb-2 font-semibold">Change Security Credentials</h3>
              
              <div className="space-y-4 font-body">
                <div>
                  <label className="block text-xs uppercase font-bold text-cream-ghost mb-2">Admin Username</label>
                  <input 
                    type="text" 
                    value={securityUsername} 
                    onChange={e => setSecurityUsername(e.target.value)} 
                    required 
                    placeholder="Username" 
                    className="w-full bg-surface-2 border border-border-subtle rounded-xl p-3 text-sm text-cream focus:outline-none focus:border-gold/40 placeholder-cream-ghost"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase font-bold text-cream-ghost mb-2">New Password</label>
                  <input 
                    type="password" 
                    value={securityPassword} 
                    onChange={e => setSecurityPassword(e.target.value)} 
                    required 
                    placeholder="New password" 
                    className="w-full bg-surface-2 border border-border-subtle rounded-xl p-3 text-sm text-cream focus:outline-none focus:border-gold/40 placeholder-cream-ghost"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase font-bold text-cream-ghost mb-2">Confirm New Password</label>
                  <input 
                    type="password" 
                    value={securityConfirmPassword} 
                    onChange={e => setSecurityConfirmPassword(e.target.value)} 
                    required 
                    placeholder="Confirm new password" 
                    className="w-full bg-surface-2 border border-border-subtle rounded-xl p-3 text-sm text-cream focus:outline-none focus:border-gold/40 placeholder-cream-ghost"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="bg-gold-gradient hover:bg-gold-gradient-hover text-stone-950 px-8 py-3 rounded-full text-xs font-bold tracking-wider transition-all duration-300 shadow-md shadow-gold/15"
                >
                  Update Credentials
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
