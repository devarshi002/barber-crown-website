import React, { useState, useEffect } from 'react';

const navItems = ['home', 'services', 'team', 'gallery', 'testimonials', 'booking'];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState('home');

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      const sections = navItems.map(id => document.getElementById(id)).filter(Boolean);
      const current = sections.find(s => {
        const rect = s.getBoundingClientRect();
        return rect.top <= 100 && rect.bottom >= 100;
      });
      if (current) setActive(current.id);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className="navbar" style={{ boxShadow: scrolled ? '0 4px 40px rgba(0,0,0,0.5)' : 'none' }}>
      <div className="w-full max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <a href="#home" style={{ textDecoration: 'none' }}>
          <div className="font-display" style={{ fontSize: '1.9rem', letterSpacing: '0.08em', lineHeight: 1 }}>
            <span className="gold-text">BLADE</span>
            <span style={{ color: '#555', margin: '0 2px' }}>&</span>
            <span className="gold-text">CROWN</span>
          </div>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          {navItems.map(item => (
            <a
              key={item}
              href={`#${item}`}
              className={`nav-link ${active === item ? 'active' : ''}`}
              onClick={() => setActive(item)}
            >
              {item}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:block">
          <a href="#booking">
            <button className="btn-gold">
              <span>Book Now</span>
            </button>
          </a>
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: 'none', border: 'none', color: 'var(--gold)', fontSize: '1.6rem', cursor: 'none', lineHeight: 1 }}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mobile-menu md:hidden">
          {navItems.map(item => (
            <a
              key={item}
              href={`#${item}`}
              className="nav-link block py-4 border-b"
              style={{ borderColor: 'rgba(201,168,76,0.08)' }}
              onClick={() => setMenuOpen(false)}
            >
              {item}
            </a>
          ))}
          <a href="#booking" className="block mt-4">
            <button className="btn-gold w-full"><span>Book Now</span></button>
          </a>
        </div>
      )}
    </nav>
  );
}
