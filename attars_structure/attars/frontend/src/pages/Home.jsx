import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Marquee from '../components/Marquee';
import Legacy from '../components/Legacy';
import Process from '../components/Process';
import Collection from '../components/Collection';
import Newsletter from '../components/Newsletter';
import Footer from '../components/Footer';
import BackToTop from '../components/BackToTop';
import Preloader from '../components/Preloader';

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hasLoaded = sessionStorage.getItem('attars_loaded');
    if (hasLoaded) {
      setLoading(false);
    } else {
      const timer = setTimeout(() => {
        setLoading(false);
        sessionStorage.setItem('attars_loaded', 'true');
      }, 2200);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && <Preloader key="loader" />}
      </AnimatePresence>
      <Navbar />
      <Hero />
      <Marquee />
      <Legacy />
      <Process />
      <Collection />
      <Newsletter />
      <Footer />
      <BackToTop />
    </>
  );
}
