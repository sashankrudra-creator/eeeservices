import { Suspense, lazy } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/layout/ScrollToTop';
import ScrollProgress from './components/layout/ScrollProgress';
import FloatingCTA from './components/layout/FloatingCTA';
import { BoltMark } from './components/layout/Logo';
import PopupAd from './components/ads/PopupAd';
import AdScroller from './components/ads/AdScroller';

const AdminApp = lazy(() => import('./pages/admin/AdminApp'));
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const OandM = lazy(() => import('./pages/OandM'));
const Resources = lazy(() => import('./pages/Resources'));
const Projects = lazy(() => import('./pages/Projects'));
const Manpower = lazy(() => import('./pages/Manpower'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Clients = lazy(() => import('./pages/Clients'));
const Contact = lazy(() => import('./pages/Contact'));
const NotFound = lazy(() => import('./pages/NotFound'));

function Loader() {
  return (
    <div className="loader" role="status" aria-label="Loading">
      <span className="loader__bolt"><BoltMark size={56} /></span>
    </div>
  );
}

export default function App() {
  const location = useLocation();

  // The advertisement admin lives on its own screen, without the public site chrome.
  if (location.pathname === '/admin' || location.pathname.startsWith('/admin/')) {
    return (
      <Suspense fallback={<Loader />}>
        <AdminApp />
      </Suspense>
    );
  }

  return (
    <>
      <a href="#main" className="skip">Skip to content</a>
      <ScrollProgress />
      <ScrollToTop />
      <Navbar />
      <main id="main">
        <Suspense fallback={<Loader />}>
          <AnimatePresence mode="wait">
            <motion.div key={location.pathname} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }}>
              <Routes location={location}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/operations-maintenance" element={<OandM />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/manpower" element={<Manpower />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/clients" element={<Clients />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </Suspense>
      </main>
      {location.pathname !== '/' && <AdScroller />}
      <Footer />
      <FloatingCTA />
      <PopupAd />
    </>
  );
}
