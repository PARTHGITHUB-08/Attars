import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function ProductDetail() {
  return (
    <div className="min-h-screen bg-surface-0 flex flex-col justify-between text-cream">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center py-20 px-5">
        <div className="ornament mb-4">
          <span className="text-gold text-xs">❊</span>
        </div>
        <h1 className="font-display text-display-md text-gold mb-2">Product Detail</h1>
        <p className="font-body text-sm text-cream-faint">Details page for specific attar collections coming soon.</p>
      </div>
      <Footer />
    </div>
  );
}
