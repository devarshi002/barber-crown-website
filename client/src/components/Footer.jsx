import React from 'react';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer style={{ background: 'var(--dark)', borderTop: '1px solid rgba(201,168,76,0.1)', paddingTop: 70, paddingBottom: 32 }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-14 mb-14">

          {/* Brand */}
          <div className="md:col-span-2">
            <div className="font-display" style={{ fontSize: '2.6rem', letterSpacing: '0.08em', marginBottom: 18 }}>
              <span className="gold-text">BLADE</span>
              <span style={{ color: '#444', margin: '0 2px' }}>&</span>
              <span className="gold-text">CROWN</span>
            </div>
            <p style={{ color: 'var(--gray)', fontSize: '0.84rem', lineHeight: 1.9, maxWidth: 320, marginBottom: 24 }}>
              Premium grooming for the modern gentleman. Where every visit is a ritual and every cut tells a story.
            </p>
            {/* Social links */}
            <div style={{ display: 'flex', gap: 12 }}>
              {['Instagram', 'Facebook', 'Twitter', 'Yelp'].map(s => (
                <div key={s} style={{
                  width: 38, height: 38,
                  border: '1px solid rgba(201,168,76,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.6rem', color: 'var(--gold)',
                  letterSpacing: '0', cursor: 'none',
                  transition: 'border-color 0.3s, background 0.3s',
                }}>
                  {s[0]}
                </div>
              ))}
            </div>
          </div>

          {/* Hours */}
          <div>
            <h4 style={{ fontSize: '0.6rem', letterSpacing: '0.35em', color: 'var(--gold)', textTransform: 'uppercase', fontWeight: 700, marginBottom: 22 }}>
              Hours
            </h4>
            {[
              ['Monday – Friday', '9:00 AM – 8:00 PM'],
              ['Saturday', '8:00 AM – 7:00 PM'],
              ['Sunday', '10:00 AM – 5:00 PM'],
            ].map(([day, hours]) => (
              <div key={day} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, maxWidth: 220 }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--gray)' }}>{day}</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--cream)' }}>{hours}</span>
              </div>
            ))}
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontSize: '0.6rem', letterSpacing: '0.35em', color: 'var(--gold)', textTransform: 'uppercase', fontWeight: 700, marginBottom: 22 }}>
              Contact
            </h4>
            {[
              ['📍', '42 Crown Street\nNew York, NY 10001'],
              ['📞', '+1 (212) 555-BLADE'],
              ['✉️', 'hello@bladeandcrown.com'],
              ['🌐', 'www.bladeandcrown.com'],
            ].map(([icon, val]) => (
              <div key={val} style={{ display: 'flex', gap: 10, marginBottom: 14, alignItems: 'flex-start' }}>
                <span style={{ fontSize: '0.9rem', marginTop: 1 }}>{icon}</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--gray)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.3), transparent)', marginBottom: 28 }} />

        {/* Bottom bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontSize: '0.68rem', color: 'var(--gray)' }}>
            © {year} Blade & Crown. All rights reserved.
          </span>
          <div style={{ display: 'flex', gap: 22 }}>
            {['Privacy Policy', 'Terms of Service', 'Accessibility'].map(item => (
              <span key={item} style={{ fontSize: '0.65rem', color: 'var(--gray)', cursor: 'none', letterSpacing: '0.05em' }}>
                {item}
              </span>
            ))}
          </div>
          <span style={{ fontSize: '0.68rem', color: 'var(--gray)' }}>
            Built with ✂️ precision.
          </span>
        </div>
      </div>
    </footer>
  );
}
