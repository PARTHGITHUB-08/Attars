import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Marquee from '../components/Marquee';
import Legacy from '../components/Legacy';
import Process from '../components/Process';
import Collection from '../components/Collection';
import Newsletter from '../components/Newsletter';
import Footer from '../components/Footer';
import BackToTop from '../components/BackToTop';

export default function Home() {
  return (
    <>
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
