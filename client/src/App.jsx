import React from 'react';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Ticker from './components/Ticker';
import Services from './components/Services';
import About from './components/About';
import Team from './components/Team';
import Gallery from './components/Gallery';
import Testimonials from './components/Testimonials';
import Booking from './components/Booking';
import Footer from './components/Footer';
import AdminDashboard from './admin/AdminDashboard';

function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [grow, setGrow] = useState(false);

  useEffect(() => {
    const onMove = (e) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', onMove);
    const onEnter = () => setGrow(true);
    const onLeave = () => setGrow(false);
    const interactables = document.querySelectorAll('a, button, .service-card, .team-card, .gallery-item, .testimonial-card');
    interactables.forEach(el => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <>
      <div className={`cursor ${grow ? 'grow' : ''}`} style={{ left: pos.x, top: pos.y }} />
      <div className="cursor-dot" style={{ left: pos.x, top: pos.y }} />
    </>
  );
}

export default function App() {
  const isAdmin = window.location.pathname === '/admin';

  if (isAdmin) {
    return <AdminDashboard />;
  }

  return (
    <>
      <div className="noise-overlay" />
      <CustomCursor />
      <Navbar />
      <Hero />
      <Ticker />
      <Services />
      <About />
      <Team />
      <Gallery />
      <Testimonials />
      <Booking />
      <Footer />
    </>
  );
}