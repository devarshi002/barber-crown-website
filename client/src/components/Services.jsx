import React from 'react';
import { useReveal } from '../hooks/useReveal';

const services = [
  {
    icon: '✂️', name: 'Classic Cut', price: '$35',
    desc: 'Precision scissors and clipper work delivering the timeless gentleman\'s cut every man deserves.',
    duration: '45 min',
  },
  {
    icon: '🪒', name: 'Hot Shave', price: '$45',
    desc: 'Traditional straight razor shave with hot towel therapy, pre-shave oil and soothing aftershave balm.',
    duration: '40 min',
  },
  {
    icon: '🧔', name: 'Beard Sculpt', price: '$30',
    desc: 'Expert beard shaping, detail trimming, line definition and deep conditioning treatment.',
    duration: '30 min',
  },
  {
    icon: '💈', name: 'Fade Master', price: '$40',
    desc: 'Seamless gradient fades from skin to full length, customized to your head shape and preference.',
    duration: '50 min',
  },
  {
    icon: '👑', name: 'Royal Package', price: '$95',
    desc: 'Full cut + hot shave + beard sculpt + scalp massage + styling—the complete regal experience.',
    duration: '2 hrs',
    featured: true,
  },
  {
    icon: '🎨', name: 'Hair Design', price: '$55',
    desc: 'Custom artistic patterns, geometric lines and signature designs etched with expert precision.',
    duration: '60 min',
  },
];

export default function Services() {
  const { ref } = useReveal();
  return (
    <section id="services" style={{ padding: '120px 0', background: 'var(--dark-2)' }}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20 reveal" ref={ref}>
          <span className="section-eyebrow">◈ What We Offer</span>
          <h2 className="font-serif" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 900 }}>
            Our <span className="gold-text">Services</span>
          </h2>
          <div className="section-divider" />
          <p style={{ color: 'var(--gray)', maxWidth: 480, margin: '0 auto', fontSize: '0.88rem', lineHeight: 1.9 }}>
            Every service is a ritual of precision, care, and decades of mastered craft.
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <ServiceCard key={s.name} service={s} delay={i * 0.08} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ service, delay }) {
  const { ref } = useReveal(delay);
  return (
    <div
      ref={ref}
      className={`service-card reveal ${service.featured ? 'featured' : ''}`}
      style={service.featured ? { borderColor: 'rgba(201,168,76,0.35)', background: '#160e0e' } : {}}
    >
      {service.featured && (
        <div style={{
          position: 'absolute', top: 16, right: 16,
          background: 'var(--gold)', color: 'var(--dark)',
          fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase',
          padding: '4px 10px', fontWeight: 700,
        }}>
          Best Value
        </div>
      )}

      <div style={{ fontSize: '2.2rem', marginBottom: 18 }}>{service.icon}</div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <h3 className="font-serif" style={{ fontSize: '1.25rem', fontWeight: 700 }}>{service.name}</h3>
        <div>
          <div className="font-display" style={{ fontSize: '1.6rem', color: 'var(--gold)', lineHeight: 1 }}>{service.price}</div>
          <div style={{ fontSize: '0.6rem', color: 'var(--gray)', textAlign: 'right' }}>{service.duration}</div>
        </div>
      </div>

      <p style={{ color: 'var(--gray)', fontSize: '0.82rem', lineHeight: 1.8, marginBottom: 20 }}>{service.desc}</p>

      <div style={{ height: 1, background: 'linear-gradient(90deg, var(--gold), transparent)', opacity: 0.3 }} />

      <div style={{ marginTop: 18 }}>
        <a href="#booking">
          <button className="btn-outline" style={{ fontSize: '0.62rem', letterSpacing: '0.15em' }}>
            Book This <span style={{ color: 'var(--gold)' }}>→</span>
          </button>
        </a>
      </div>
    </div>
  );
}
