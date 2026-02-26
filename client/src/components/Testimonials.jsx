import React, { useState, useEffect } from 'react';
import { useReveal } from '../hooks/useReveal';

const testimonials = [
  {
    name: 'Alex Morgan',
    role: 'CEO, TechVentures',
    stars: 5,
    text: 'Hands down the best barbershop in New York. Marco gave me a cut that changed how I walk into board meetings. The hot shave alone is worth the trip.',
    initials: 'AM',
  },
  {
    name: 'Chris Bennett',
    role: 'Professional Athlete',
    stars: 5,
    text: "I've been to barbers around the world. Blade & Crown is on another level. James listens, understands, and delivers every single time. My go-to for 4 years.",
    initials: 'CB',
  },
  {
    name: 'Raj Patel',
    role: 'Creative Director',
    stars: 5,
    text: 'The Royal Package is worth every penny. I walked out feeling like an entirely different man. The atmosphere, the craft, the attention to detail—unmatched.',
    initials: 'RP',
  },
  {
    name: 'Marcus Williams',
    role: 'Attorney at Law',
    stars: 5,
    text: "Diego transformed my beard from scraggly to sharp in 30 minutes. Now I won't trust anyone else with it. This place is the real deal.",
    initials: 'MW',
  },
];

export default function Testimonials() {
  const { ref } = useReveal();
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setActive(a => (a + 1) % testimonials.length), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="testimonials" style={{ padding: '120px 0', background: 'var(--dark-2)', position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', left: '50%', top: '50%',
        transform: 'translate(-50%,-50%)',
        width: '60%', height: '60%',
        background: 'radial-gradient(ellipse, rgba(201,168,76,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20 reveal" ref={ref}>
          <span className="section-eyebrow">◈ Client Love</span>
          <h2 className="font-serif" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 900 }}>
            What They <span className="gold-text">Say</span>
          </h2>
          <div className="section-divider" />
        </div>

        {/* Featured testimonial */}
        <div style={{ maxWidth: 700, margin: '0 auto 60px', textAlign: 'center' }}>
          <div className="testimonial-card" style={{ padding: '50px 44px' }}>
            <div className="stars" style={{ marginBottom: 20 }}>{'★'.repeat(testimonials[active].stars)}</div>
            <p className="font-serif" style={{ fontSize: '1.2rem', fontStyle: 'italic', lineHeight: 1.7, color: 'var(--cream)', marginBottom: 28 }}>
              "{testimonials[active].text}"
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
              <div style={{
                width: 46, height: 46, borderRadius: '50%',
                background: 'var(--red)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: "'Playfair Display', serif", fontSize: '1rem', fontWeight: 700,
                border: '2px solid rgba(201,168,76,0.3)',
              }}>
                {testimonials[active].initials}
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--cream)' }}>{testimonials[active].name}</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--gold)', letterSpacing: '0.08em' }}>{testimonials[active].role}</div>
              </div>
            </div>
          </div>

          {/* Dots */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 24 }}>
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                style={{
                  width: i === active ? 28 : 8, height: 8,
                  borderRadius: 4,
                  background: i === active ? 'var(--gold)' : 'rgba(201,168,76,0.2)',
                  border: 'none', cursor: 'none',
                  transition: 'all 0.4s ease',
                }}
              />
            ))}
          </div>
        </div>

        {/* Mini cards */}
        <div className="grid md:grid-cols-4 gap-4">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              onClick={() => setActive(i)}
              className="testimonial-card"
              style={{
                cursor: 'none', padding: '24px',
                borderColor: i === active ? 'rgba(201,168,76,0.45)' : 'rgba(201,168,76,0.12)',
                transition: 'border-color 0.3s, transform 0.3s',
                transform: i === active ? 'translateY(-4px)' : 'none',
              }}
            >
              <div className="stars" style={{ fontSize: '0.7rem', marginBottom: 10 }}>{'★'.repeat(t.stars)}</div>
              <p style={{ fontSize: '0.75rem', color: 'var(--gray)', lineHeight: 1.7, marginBottom: 12 }}>
                "{t.text.slice(0, 80)}..."
              </p>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--cream)' }}>{t.name}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
