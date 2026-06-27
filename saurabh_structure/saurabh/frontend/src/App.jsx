import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';
import TrackOrder from './pages/TrackOrder';
import Toast from './components/Toast';
import CartSidebar from './components/CartSidebar';

/**
 * Root application component.
 * NOTE: The Ctrl+A keyboard shortcut that previously bypassed admin authentication
 * has been removed. Access /admin directly and log in with your credentials.
 */
export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/track-order" element={<TrackOrder />} />
      </Routes>
      <CartSidebar />
      <Toast />
      <div className="noise-overlay" />
    </>
  );
}
