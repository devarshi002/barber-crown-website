import React from 'react';
import { useReveal } from '../hooks/useReveal';

const works = [
  { label: 'Skin Fade', emoji: '🔱', color: '#0d1b2a', h: 280 },
  { label: 'Classic Pompadour', emoji: '⚡', color: '#1a0a1a', h: 200 },
  { label: 'Beard Artistry', emoji: '🎭', color: '#0a1a0a', h: 200 },
  { label: 'Taper Cut', emoji: '💎', color: '#1a1a0a', h: 280 },
  { label: 'Hot Shave', emoji: '🔥', color: '#1a0a0a', h: 200 },
  { label: 'Line Design', emoji: '✦', color: '#0a1a1a', h: 280 },
  { label: 'Afro Fade', emoji: '🌟', color: '#0a0a1a', h: 280 },
  { label: 'Textured Crop', emoji: '👑', color: '#1a0a12', h: 200 },
];

export default function Gallery() {
  const { ref } = useReveal();
  return (
    <section id="gallery" style={{ padding: '120px 0', background: 'var(--dark)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20 reveal" ref={ref}>
          <span className="section-eyebrow">◈ Our Work</span>
          <h2 className="font-serif" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 900 }}>
            The <span className="gold-text">Gallery</span>
          </h2>
          <div className="section-divider" />
          <p style={{ color: 'var(--gray)', maxWidth: 480, margin: '0 auto', fontSize: '0.88rem', lineHeight: 1.9 }}>
            A look at some of the art we've crafted. Every head is a canvas.
          </p>
        </div>

        {/* Masonry-style grid */}
        <div style={{ columns: 'auto 200px', gap: '16px' }}>
          {works.map((item, i) => (
            <GalleryItem key={i} item={item} delay={i * 0.06} />
          ))}
        </div>
      </div>
    </section>
  );
}

function GalleryItem({ item, delay }) {
  const { ref } = useReveal(delay);
  return (
    <div
      ref={ref}
      className="gallery-item reveal"
      style={{ marginBottom: 16, breakInside: 'avoid', height: item.h }}
    >
      <div
        className="gallery-placeholder"
        style={{
          height: '100%',
          background: `linear-gradient(145deg, ${item.color}, var(--dark-3))`,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          border: '1px solid rgba(201,168,76,0.08)',
          transition: 'transform 0.6s ease',
        }}
      >
        <div style={{ fontSize: '2.8rem', marginBottom: 10, textAlign: 'center' }}>{item.emoji}</div>
        <div style={{ fontSize: '0.62rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.6)' }}>
          {item.label}
        </div>
      </div>
      <div className="gallery-overlay">
        <span style={{ fontSize: '0.65rem', color: 'var(--gold)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          {item.label}
        </span>
      </div>
    </div>
  );
}
