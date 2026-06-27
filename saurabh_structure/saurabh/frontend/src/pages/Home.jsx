import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Marquee from '../components/Marquee';
import Legacy from '../components/Legacy';
import Process from '../components/Process';
import Collection from '../components/Collection';
import Testimonials from '../components/Testimonials';
import Footer from '../components/Footer';
import BackToTop from '../components/BackToTop';
import Preloader from '../components/Preloader';

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // 2 seconds
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <Preloader key="loader" />
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <Navbar />
          <Hero />
          <Marquee />
          <Legacy />
          <Process />
          <Collection />
          <Testimonials />
          <Footer />
          <BackToTop />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
