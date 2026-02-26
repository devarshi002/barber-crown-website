import React, { useEffect, useRef } from 'react';

export default function Hero() {
  const headRef = useRef(null);

  useEffect(() => {
    // Stagger in heading lines
    const lines = headRef.current?.querySelectorAll('.hero-line');
    lines?.forEach((el, i) => {
      el.style.animationDelay = `${0.2 + i * 0.15}s`;
      el.classList.add('anim-fadeup');
    });
  }, []);

  return (
    <section
      id="home"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: 72,
      }}
    >
      {/* BG Glows */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 75% 40%, rgba(139,26,26,0.18) 0%, transparent 55%), radial-gradient(ellipse at 15% 80%, rgba(201,168,76,0.07) 0%, transparent 45%)',
        pointerEvents: 'none',
      }} />

      {/* Grid bg */}
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />

      {/* Decorative vertical text */}
      <div style={{
        position: 'absolute', left: 28, top: '50%',
        transform: 'translateY(-50%) rotate(-90deg)',
        fontFamily: "'Montserrat', sans-serif",
        fontSize: '0.55rem', letterSpacing: '0.5em',
        color: 'rgba(201,168,76,0.3)',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
      }}>
        Est. 1998 — New York City
      </div>

      {/* Barber Pole */}
      <div style={{ position: 'absolute', right: '6%', top: '50%', transform: 'translateY(-50%)', opacity: 0.55 }}>
        <div className="barber-pole-wrap">
          <div className="barber-pole-inner" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="grid md:grid-cols-5 gap-10 items-center">

          {/* LEFT COPY — 3 cols */}
          <div className="md:col-span-3" ref={headRef}>
            <span
              className="hero-line section-eyebrow"
              style={{ opacity: 0, display: 'inline-block' }}
            >
              ◈ Premium Barbershop · New York
            </span>

            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(3.8rem, 9vw, 8rem)',
                lineHeight: 0.88,
                fontWeight: 900,
                marginBottom: 32,
              }}
            >
              <span className="hero-line block" style={{ opacity: 0, color: 'var(--cream)' }}>
                THE ART
              </span>
              <span className="hero-line block gold-text" style={{ opacity: 0 }}>
                OF THE
              </span>
              <span className="hero-line block" style={{ opacity: 0, color: 'var(--cream)', fontStyle: 'italic' }}>
                Perfect Cut
              </span>
            </h1>

            <p
              className="hero-line"
              style={{
                opacity: 0, color: 'var(--gray)', lineHeight: 1.9,
                maxWidth: 440, marginBottom: 44, fontSize: '0.9rem',
              }}
            >
              Where tradition meets precision. We craft more than hairstyles—we build confidence,
              one cut at a time. Walk in as a man, leave as a legend.
            </p>

            <div className="hero-line flex gap-5 flex-wrap" style={{ opacity: 0 }}>
              <a href="#booking">
                <button className="btn-gold"><span>Reserve Your Chair</span></button>
              </a>
              <a href="#services">
                <button className="btn-outline">
                  Explore Services <span style={{ color: 'var(--gold)', fontSize: '1rem' }}>→</span>
                </button>
              </a>
            </div>

            {/* Stats */}
            <div className="hero-line flex gap-14 mt-16" style={{ opacity: 0 }}>
              {[['25+', 'Years Experience'], ['5,000+', 'Happy Clients'], ['15', 'Expert Barbers']].map(([num, label]) => (
                <div key={label}>
                  <div className="font-display" style={{ fontSize: '2.8rem', color: 'var(--gold)', lineHeight: 1 }}>{num}</div>
                  <div style={{ fontSize: '0.6rem', color: 'var(--gray)', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 4 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT VISUAL — 2 cols */}
          <div className="md:col-span-2 hidden md:flex flex-col items-center gap-6">
            {/* Main card */}
            <div style={{
              width: '100%', maxWidth: 360, aspectRatio: '3/4',
              background: 'var(--dark-3)',
              border: '1px solid rgba(201,168,76,0.2)',
              position: 'relative', overflow: 'hidden',
            }}>
              {/* Inner border */}
              <div style={{ position: 'absolute', inset: 14, border: '1px solid rgba(201,168,76,0.08)' }} />
              {/* Center content */}
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 30 }}>
                <div className="anim-float" style={{ fontSize: '5rem', marginBottom: 18 }}>✂️</div>
                <div className="font-display" style={{ fontSize: '1.4rem', letterSpacing: '0.3em', color: 'var(--gold)', marginBottom: 16 }}>
                  MASTER BARBERS
                </div>
                <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, var(--gold), transparent)', width: '80%', marginBottom: 16 }} />
                <div style={{ fontSize: '0.65rem', letterSpacing: '0.2em', color: 'var(--gray)', textTransform: 'uppercase' }}>
                  Premium Grooming Studio
                </div>
              </div>
              {/* Bottom glow */}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '35%', background: 'linear-gradient(to top, rgba(139,26,26,0.25), transparent)' }} />
            </div>

            {/* Floating badge */}
            <div
              className="anim-float"
              style={{
                background: 'var(--dark-2)',
                border: '1px solid rgba(201,168,76,0.3)',
                padding: '18px 24px',
                alignSelf: 'flex-end',
                marginRight: 20,
              }}
            >
              <div style={{ fontSize: '0.55rem', color: 'var(--gray)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 6 }}>Today's Wait</div>
              <div className="font-display" style={{ fontSize: '2.2rem', color: 'var(--gold)', lineHeight: 1, marginBottom: 8 }}>~15 min</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span className="status-dot" />
                <span style={{ fontSize: '0.62rem', color: 'var(--gray)' }}>Open Now · Closes 8 PM</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
