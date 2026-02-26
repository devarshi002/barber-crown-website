import React from 'react';

const items = [
  'Classic Cuts', 'Hot Shaves', 'Beard Sculpting', 'Skin Fades',
  'Hair Design', 'Scalp Treatment', 'Royal Package', 'Pompadours',
];

export default function Ticker() {
  const repeated = [...items, ...items];
  return (
    <div className="ticker-wrap">
      <div className="ticker-track">
        {repeated.map((item, i) => (
          <span
            key={i}
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '1rem',
              letterSpacing: '0.22em',
              color: 'var(--dark)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '1.2rem',
              paddingRight: '1.2rem',
            }}
          >
            {item}
            <span style={{ opacity: 0.35, fontSize: '0.6rem' }}>◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
