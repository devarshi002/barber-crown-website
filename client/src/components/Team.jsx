import React from 'react';
import { useReveal } from '../hooks/useReveal';

const team = [
  {
    name: 'Marco Vitale',
    role: 'Founder & Master Barber',
    exp: '25 Years',
    specialty: 'Classic Cuts & Hot Shaves',
    initials: 'MV',
    accent: '#8B1A1A',
    emoji: '✂️',
  },
  {
    name: 'James Okafor',
    role: 'Senior Style Director',
    exp: '12 Years',
    specialty: 'Fades & Hair Design',
    initials: 'JO',
    accent: '#1A3A8B',
    emoji: '💈',
  },
  {
    name: 'Diego Reyes',
    role: 'Beard & Shave Specialist',
    exp: '9 Years',
    specialty: 'Beard Sculpting & Shaping',
    initials: 'DR',
    accent: '#1A5C2A',
    emoji: '🪒',
  },
  {
    name: 'Kai Nakamura',
    role: 'Creative Style Artist',
    exp: '7 Years',
    specialty: 'Textured Cuts & Coloring',
    initials: 'KN',
    accent: '#5C2A1A',
    emoji: '🎨',
  },
];

export default function Team() {
  const { ref } = useReveal();
  return (
    <section id="team" style={{ padding: '120px 0', background: 'var(--dark-2)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20 reveal" ref={ref}>
          <span className="section-eyebrow">◈ The Craftsmen</span>
          <h2 className="font-serif" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 900 }}>
            Meet The <span className="gold-text">Team</span>
          </h2>
          <div className="section-divider" />
          <p style={{ color: 'var(--gray)', maxWidth: 480, margin: '0 auto', fontSize: '0.88rem', lineHeight: 1.9 }}>
            Each barber is a master of their craft, dedicated to making you look and feel exceptional.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, i) => (
            <TeamCard key={member.name} member={member} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TeamCard({ member, delay }) {
  const { ref } = useReveal(delay);
  return (
    <div ref={ref} className="team-card reveal">
      {/* Avatar area */}
      <div style={{
        height: 340,
        background: `linear-gradient(145deg, ${member.accent}30, var(--dark-3) 60%)`,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        position: 'relative',
      }}>
        {/* Big emoji bg */}
        <div style={{ fontSize: '5rem', opacity: 0.08, position: 'absolute', top: 20, right: 20 }}>
          {member.emoji}
        </div>

        {/* Avatar circle */}
        <div style={{
          width: 110, height: 110, borderRadius: '50%',
          background: `linear-gradient(145deg, ${member.accent}, ${member.accent}80)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "'Playfair Display', serif",
          fontSize: '2.2rem', fontWeight: 900, color: 'var(--cream)',
          border: '3px solid rgba(201,168,76,0.35)',
          marginBottom: 18,
          boxShadow: `0 0 30px ${member.accent}40`,
        }}>
          {member.initials}
        </div>

        {/* Experience badge */}
        <div style={{
          background: 'rgba(201,168,76,0.12)',
          border: '1px solid rgba(201,168,76,0.25)',
          padding: '5px 14px',
          fontSize: '0.6rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--gold)',
        }}>
          {member.exp}
        </div>

        {/* Hover overlay */}
        <div className="team-overlay">
          <h3 className="font-serif" style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 4 }}>
            {member.name}
          </h3>
          <p style={{ fontSize: '0.65rem', color: 'var(--gold)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>
            {member.role}
          </p>
          <p style={{ fontSize: '0.75rem', color: 'var(--gray)', marginBottom: 16 }}>
            Specialty: {member.specialty}
          </p>
          <a href="#booking">
            <button className="btn-gold" style={{ padding: '9px 22px', fontSize: '0.6rem', letterSpacing: '0.2em' }}>
              <span>Book Him</span>
            </button>
          </a>
        </div>
      </div>

      {/* Card footer */}
      <div style={{ padding: '20px 22px', borderTop: '1px solid rgba(201,168,76,0.1)' }}>
        <h3 className="font-serif" style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 4 }}>{member.name}</h3>
        <p style={{ fontSize: '0.68rem', color: 'var(--gold)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{member.role}</p>
      </div>
    </div>
  );
}
