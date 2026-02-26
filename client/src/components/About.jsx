import React from 'react';
import { useReveal } from '../hooks/useReveal';

const perks = [
  { icon: '🔥', label: 'Hot Towel Service' },
  { icon: '💎', label: 'Premium Products' },
  { icon: '🚪', label: 'Walk-Ins Welcome' },
  { icon: '📱', label: 'Easy Booking' },
  { icon: '🎵', label: 'Chill Atmosphere' },
  { icon: '🍵', label: 'Complimentary Drinks' },
];

export default function About() {
  const { ref: leftRef } = useReveal(0);
  const { ref: rightRef } = useReveal(0.2);

  return (
    <section style={{ padding: '120px 0', background: 'var(--dark)', position: 'relative', overflow: 'hidden' }}>
      {/* Decorative glow */}
      <div style={{
        position: 'absolute', right: '-10%', top: '20%',
        width: '50%', height: '60%',
        background: 'radial-gradient(ellipse, rgba(201,168,76,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-20 items-center">

          {/* Left: Quote box */}
          <div ref={leftRef} className="reveal corner-box" style={{ padding: 20 }}>
            <div style={{
              background: 'var(--dark-3)',
              border: '1px solid rgba(201,168,76,0.1)',
              padding: '60px 44px',
              textAlign: 'center',
            }}>
              <div className="font-display" style={{ fontSize: '6rem', color: 'rgba(201,168,76,0.08)', lineHeight: 1, marginBottom: -20 }}>
                1998
              </div>
              <div className="font-serif" style={{ fontSize: '1.2rem', fontStyle: 'italic', color: 'var(--gold)', lineHeight: 1.6 }}>
                "A man who looks good, feels unstoppable."
              </div>
              <div style={{ height: 1, background: 'rgba(201,168,76,0.2)', margin: '28px auto', width: '60%' }} />
              <div style={{ fontSize: '0.62rem', letterSpacing: '0.32em', textTransform: 'uppercase', color: 'var(--gray)' }}>
                — Marco Vitale, Founder
              </div>

              {/* Perks grid */}
              <div className="grid grid-cols-3 gap-4 mt-10">
                {perks.map(p => (
                  <div key={p.label} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.4rem', marginBottom: 6 }}>{p.icon}</div>
                    <div style={{ fontSize: '0.6rem', color: 'var(--gray)', lineHeight: 1.4, letterSpacing: '0.05em' }}>{p.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Copy */}
          <div ref={rightRef} className="reveal">
            <span className="section-eyebrow">◈ Our Philosophy</span>
            <h2 className="font-serif" style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.8rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: 26 }}>
              More Than a<br /><span className="gold-text">Haircut</span>
            </h2>
            <p style={{ color: 'var(--gray)', lineHeight: 1.95, marginBottom: 20, fontSize: '0.88rem' }}>
              Step into Blade &amp; Crown and leave behind the noise of the world. Our barbershop is a
              sanctuary—a place where craft meets conversation, and every man leaves feeling like royalty.
            </p>
            <p style={{ color: 'var(--gray)', lineHeight: 1.95, marginBottom: 40, fontSize: '0.88rem' }}>
              We use only premium products, hand-selected tools, and time-honored techniques passed down
              through generations of master barbers from New York to Naples.
            </p>

            {/* Timeline */}
            <div style={{ borderLeft: '2px solid rgba(201,168,76,0.2)', paddingLeft: 28 }}>
              {[
                ['1998', 'Founded by Marco Vitale in Brooklyn'],
                ['2005', 'Expanded to Manhattan flagship location'],
                ['2015', 'Named NYC\'s Best Barbershop three years running'],
                ['2024', 'Serving over 5,000 loyal clients monthly'],
              ].map(([year, event]) => (
                <div key={year} style={{ marginBottom: 20, position: 'relative' }}>
                  <div style={{
                    position: 'absolute', left: -36, top: 2,
                    width: 10, height: 10, borderRadius: '50%',
                    background: 'var(--gold)', border: '2px solid var(--dark)',
                  }} />
                  <div className="font-display" style={{ fontSize: '0.9rem', color: 'var(--gold)', letterSpacing: '0.1em' }}>{year}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--gray)', marginTop: 2 }}>{event}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
