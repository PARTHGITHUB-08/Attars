import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const CartContext = createContext();

const CART_KEY = 'attars_cart';

function loadCart() {
  try {
    const stored = localStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart);
  const [cartOpen, setCartOpen] = useState(false);

  // Persist cart to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch {
      // storage quota exceeded - ignore
    }
  }, [items]);

  const addItem = useCallback((product) => {
    setItems(prev => {
      const exists = prev.find(i => i._id === product._id);
      if (exists) return prev.map(i => i._id === product._id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
    setCartOpen(true);
  }, []);

  const removeItem = useCallback((id) => {
    setItems(prev => prev.filter(i => i._id !== id));
  }, []);

  const updateQuantity = useCallback((id, qty) => {
    setItems(prev => {
      if (qty <= 0) return prev.filter(i => i._id !== id);
      return prev.map(i => i._id === id ? { ...i, qty } : i);
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    localStorage.removeItem(CART_KEY);
  }, []);

  const count = items.reduce((sum, i) => sum + i.qty, 0);
  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, count, total, cartOpen, setCartOpen }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
