import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// Production API URL
if (process.env.NODE_ENV === 'production') {
  axios.defaults.baseURL = 'https://barber-crown-apii.onrender.com';
}

// ─── Auth Token Helpers ───────────────────────────────────────────────────────
const getToken = () => localStorage.getItem('adminToken');
const setToken = (t) => localStorage.setItem('adminToken', t);
const clearToken = () => localStorage.removeItem('adminToken');

if (getToken()) axios.defaults.headers.common['Authorization'] = `Bearer ${getToken()}`;

// ─── Admin Login Page ─────────────────────────────────────────────────────────
function AdminLogin({ onLogin }) {
  const [step, setStep] = React.useState('credentials'); // credentials | otp
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [otp, setOtp] = React.useState('');
  const [status, setStatus] = React.useState('idle'); // idle | loading | error | success
  const [errorMsg, setErrorMsg] = React.useState('');
  const [showPass, setShowPass] = React.useState(false);
  const [timer, setTimer] = React.useState(300); // 5 min countdown

  React.useEffect(() => {
    if (step !== 'otp') return;
    const interval = setInterval(() => {
      setTimer(t => {
        if (t <= 1) { clearInterval(interval); setStep('credentials'); setErrorMsg('OTP expired. Please login again.'); setStatus('error'); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [step]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) { setErrorMsg('Please enter username and password'); setStatus('error'); return; }
    setStatus('loading');
    try {
      await axios.post('/api/auth/login', { username, password });
      setStep('otp');
      setTimer(300);
      setStatus('idle');
      setErrorMsg('');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.response?.data?.message || 'Login failed');
    }
  };

  const handleOTP = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) { setErrorMsg('Enter 6-digit OTP'); setStatus('error'); return; }
    setStatus('loading');
    try {
      const res = await axios.post('/api/auth/verify-otp', { otp });
      setToken(res.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      setStatus('success');
      setTimeout(() => onLogin(), 800);
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.response?.data?.message || 'Invalid OTP');
    }
  };

  const fmt = (s) => `${Math.floor(s/60)}:${(s%60).toString().padStart(2,'0')}`;

  return (
    <div style={{ minHeight:'100vh', background:'#080808', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Montserrat,sans-serif', position:'relative', overflow:'hidden' }}>
      {/* Background */}
      <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at 20% 50%, rgba(201,168,76,0.04) 0%, transparent 60%), radial-gradient(ellipse at 80% 50%, rgba(139,26,26,0.06) 0%, transparent 60%)' }}/>
      <div style={{ position:'absolute', top:'10%', left:'5%', width:300, height:300, border:'1px solid rgba(201,168,76,0.04)', borderRadius:'50%' }}/>
      <div style={{ position:'absolute', bottom:'10%', right:'5%', width:200, height:200, border:'1px solid rgba(201,168,76,0.04)', borderRadius:'50%' }}/>

      <div style={{ width:'100%', maxWidth:420, padding:'0 24px', position:'relative', zIndex:1 }}>
        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:40 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:16, marginBottom:12 }}>
            <div style={{ height:1, width:40, background:'linear-gradient(90deg,transparent,rgba(201,168,76,0.5))' }}/>
            <span style={{ fontSize:'1.8rem' }}>💈</span>
            <div style={{ height:1, width:40, background:'linear-gradient(90deg,rgba(201,168,76,0.5),transparent)' }}/>
          </div>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.8rem', fontWeight:900, letterSpacing:'0.1em', color:'#F5EDD6', margin:'0 0 4px' }}>BLADE & CROWN</h1>
          <p style={{ fontSize:'0.6rem', letterSpacing:'0.3em', color:'#555', margin:0 }}>ADMIN PORTAL</p>
        </div>

        {/* Card */}
        <div style={{ background:'#0d0d0d', border:'1px solid rgba(201,168,76,0.15)', padding:'40px 36px', position:'relative' }}>
          <div style={{ position:'absolute', top:0, left:0, width:30, height:30, borderTop:'2px solid #C9A84C', borderLeft:'2px solid #C9A84C' }}/>
          <div style={{ position:'absolute', bottom:0, right:0, width:30, height:30, borderBottom:'2px solid #C9A84C', borderRight:'2px solid #C9A84C' }}/>

          {/* Step indicators */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, marginBottom:28 }}>
            {['credentials','otp'].map((s,i) => (
              <React.Fragment key={s}>
                <div style={{ width:28, height:28, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.65rem', fontWeight:700,
                  background: step === s ? '#C9A84C' : (step === 'otp' && s === 'credentials') ? 'rgba(201,168,76,0.2)' : 'rgba(255,255,255,0.05)',
                  color: step === s ? '#000' : '#555', border: step === s ? 'none' : '1px solid rgba(201,168,76,0.2)' }}>
                  {step === 'otp' && s === 'credentials' ? '✓' : i+1}
                </div>
                {i === 0 && <div style={{ height:1, width:40, background: step === 'otp' ? '#C9A84C' : 'rgba(201,168,76,0.2)' }}/>}
              </React.Fragment>
            ))}
          </div>

          {step === 'credentials' ? (
            <form onSubmit={handleLogin}>
              <h2 style={{ fontSize:'1rem', fontWeight:700, letterSpacing:'0.1em', color:'#F5EDD6', margin:'0 0 6px', textAlign:'center' }}>SIGN IN</h2>
              <p style={{ fontSize:'0.68rem', color:'#555', textAlign:'center', marginBottom:24 }}>Enter your admin credentials</p>

              <div style={{ marginBottom:16 }}>
                <label style={{ display:'block', fontSize:'0.58rem', letterSpacing:'0.2em', color:'#C9A84C', marginBottom:8, textTransform:'uppercase' }}>Username</label>
                <input value={username} onChange={e => setUsername(e.target.value)}
                  placeholder="admin username"
                  style={{ width:'100%', background:'#080808', border:'1px solid rgba(201,168,76,0.2)', color:'#F5EDD6', padding:'12px 14px', fontFamily:'Montserrat,sans-serif', fontSize:'0.82rem', outline:'none', boxSizing:'border-box', transition:'border 0.2s' }}
                  onFocus={e => e.target.style.borderColor='rgba(201,168,76,0.6)'}
                  onBlur={e => e.target.style.borderColor='rgba(201,168,76,0.2)'}
                />
              </div>

              <div style={{ marginBottom:20 }}>
                <label style={{ display:'block', fontSize:'0.58rem', letterSpacing:'0.2em', color:'#C9A84C', marginBottom:8, textTransform:'uppercase' }}>Password</label>
                <div style={{ position:'relative' }}>
                  <input value={password} onChange={e => setPassword(e.target.value)}
                    type={showPass ? 'text' : 'password'} placeholder="••••••••••"
                    style={{ width:'100%', background:'#080808', border:'1px solid rgba(201,168,76,0.2)', color:'#F5EDD6', padding:'12px 40px 12px 14px', fontFamily:'Montserrat,sans-serif', fontSize:'0.82rem', outline:'none', boxSizing:'border-box' }}
                    onFocus={e => e.target.style.borderColor='rgba(201,168,76,0.6)'}
                    onBlur={e => e.target.style.borderColor='rgba(201,168,76,0.2)'}
                  />
                  <button type="button" onClick={() => setShowPass(s=>!s)}
                    style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'#555', cursor:'pointer', fontSize:'0.8rem' }}>
                    {showPass ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {status === 'error' && <div style={{ background:'rgba(139,26,26,0.2)', border:'1px solid rgba(139,26,26,0.4)', padding:'10px 14px', marginBottom:16, fontSize:'0.72rem', color:'#e06060' }}>⚠️ {errorMsg}</div>}

              <button type="submit" disabled={status==='loading'}
                style={{ width:'100%', padding:'14px', background:'linear-gradient(135deg,#C9A84C,#a8873d)', color:'#000', fontFamily:'Montserrat,sans-serif', fontWeight:700, fontSize:'0.7rem', letterSpacing:'0.2em', border:'none', cursor:'pointer', opacity: status==='loading' ? 0.7 : 1 }}>
                {status === 'loading' ? 'SENDING OTP...' : 'CONTINUE →'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleOTP}>
              <h2 style={{ fontSize:'1rem', fontWeight:700, letterSpacing:'0.1em', color:'#F5EDD6', margin:'0 0 6px', textAlign:'center' }}>VERIFY OTP</h2>
              <p style={{ fontSize:'0.68rem', color:'#555', textAlign:'center', marginBottom:6 }}>6-digit OTP sent to your registered email</p>
              <p style={{ fontSize:'0.72rem', color: timer < 60 ? '#e06060' : '#C9A84C', textAlign:'center', marginBottom:24, fontWeight:700 }}>
                ⏱ Expires in {fmt(timer)}
              </p>

              <div style={{ marginBottom:20 }}>
                <label style={{ display:'block', fontSize:'0.58rem', letterSpacing:'0.2em', color:'#C9A84C', marginBottom:8, textTransform:'uppercase' }}>Enter OTP</label>
                <input value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g,'').slice(0,6))}
                  placeholder="000000" maxLength={6}
                  style={{ width:'100%', background:'#080808', border:'1px solid rgba(201,168,76,0.3)', color:'#C9A84C', padding:'16px 14px', fontFamily:'Montserrat,sans-serif', fontSize:'1.6rem', letterSpacing:'0.4em', outline:'none', boxSizing:'border-box', textAlign:'center' }}
                  onFocus={e => e.target.style.borderColor='#C9A84C'}
                  onBlur={e => e.target.style.borderColor='rgba(201,168,76,0.3)'}
                />
              </div>

              {status === 'error' && <div style={{ background:'rgba(139,26,26,0.2)', border:'1px solid rgba(139,26,26,0.4)', padding:'10px 14px', marginBottom:16, fontSize:'0.72rem', color:'#e06060' }}>⚠️ {errorMsg}</div>}
              {status === 'success' && <div style={{ background:'rgba(46,204,113,0.1)', border:'1px solid rgba(46,204,113,0.3)', padding:'10px 14px', marginBottom:16, fontSize:'0.72rem', color:'#2ecc71', textAlign:'center' }}>✅ Login successful! Redirecting...</div>}

              <button type="submit" disabled={status==='loading'||status==='success'}
                style={{ width:'100%', padding:'14px', background:'linear-gradient(135deg,#C9A84C,#a8873d)', color:'#000', fontFamily:'Montserrat,sans-serif', fontWeight:700, fontSize:'0.7rem', letterSpacing:'0.2em', border:'none', cursor:'pointer', marginBottom:12, opacity: status==='loading' ? 0.7 : 1 }}>
                {status === 'loading' ? 'VERIFYING...' : '✓ VERIFY & LOGIN'}
              </button>

              <button type="button" onClick={() => { setStep('credentials'); setOtp(''); setStatus('idle'); setErrorMsg(''); }}
                style={{ width:'100%', padding:'10px', background:'transparent', color:'#555', fontFamily:'Montserrat,sans-serif', fontSize:'0.65rem', letterSpacing:'0.15em', border:'1px solid rgba(255,255,255,0.06)', cursor:'pointer' }}>
                ← BACK TO LOGIN
              </button>
            </form>
          )}
        </div>

        <p style={{ textAlign:'center', fontSize:'0.6rem', color:'#333', marginTop:20, letterSpacing:'0.1em' }}>
          © {new Date().getFullYear()} BLADE & CROWN · SECURE ADMIN ACCESS
        </p>
      </div>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const adminStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Bebas+Neue&family=Montserrat:wght@300;400;500;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; cursor: none; }
  body { background: #080808; color: #F5EDD6; font-family: 'Montserrat', sans-serif; cursor: none; }

  .admin-cursor {
    position: fixed;
    width: 22px; height: 22px;
    border: 2px solid #C9A84C;
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%, -50%);
    transition: width 0.3s, height 0.3s, background 0.3s;
  }
  .admin-cursor.grow { width: 48px; height: 48px; background: rgba(201,168,76,0.1); }
  .admin-cursor-dot {
    position: fixed;
    width: 5px; height: 5px;
    background: #C9A84C;
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%, -50%);
  }
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: #111; }
  ::-webkit-scrollbar-thumb { background: #C9A84C; border-radius: 3px; }

  @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
  @keyframes shimmer { 0%{background-position:0% center} 100%{background-position:200% center} }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
  @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes slideIn { from{opacity:0;transform:translateX(-20px)} to{opacity:1;transform:translateX(0)} }

  .gold-text {
    background: linear-gradient(135deg, #C9A84C, #E8C97A, #C9A84C);
    background-size: 200%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shimmer 3s linear infinite;
  }
  .admin-card {
    background: #111;
    border: 1px solid rgba(201,168,76,0.15);
    transition: border-color 0.3s;
  }
  .admin-card:hover { border-color: rgba(201,168,76,0.35); }

  .stat-card {
    background: #111;
    border: 1px solid rgba(201,168,76,0.15);
    padding: 24px;
    position: relative;
    overflow: hidden;
    animation: fadeUp 0.6s ease forwards;
  }
  .stat-card::before {
    content:'';
    position:absolute; top:0; left:0; right:0; height:2px;
    background: linear-gradient(90deg, transparent, #C9A84C, transparent);
  }

  .booking-row {
    border-bottom: 1px solid rgba(201,168,76,0.06);
    transition: background 0.2s;
    animation: slideIn 0.4s ease forwards;
  }
  .booking-row:hover { background: rgba(201,168,76,0.04); }

  .badge {
    display: inline-flex; align-items: center;
    padding: 4px 10px;
    font-size: 0.6rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    font-weight: 600;
    border-radius: 2px;
  }
  .badge-paid { background: rgba(46,204,113,0.12); color: #2ecc71; border: 1px solid rgba(46,204,113,0.25); }
  .badge-pending { background: rgba(201,168,76,0.12); color: #C9A84C; border: 1px solid rgba(201,168,76,0.25); }
  .badge-cancelled { background: rgba(139,26,26,0.15); color: #e06060; border: 1px solid rgba(139,26,26,0.3); }

  .search-input {
    background: #0a0a0a;
    border: 1px solid rgba(201,168,76,0.2);
    color: #F5EDD6;
    padding: 10px 16px;
    font-family: 'Montserrat', sans-serif;
    font-size: 0.82rem;
    outline: none;
    transition: border-color 0.3s;
    width: 100%;
  }
  .search-input:focus { border-color: #C9A84C; }
  .search-input::placeholder { color: #555; }

  .btn-sm {
    padding: 7px 16px;
    font-family: 'Montserrat', sans-serif;
    font-size: 0.62rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    cursor: pointer;
    border: none;
    font-weight: 600;
    transition: all 0.3s;
  }
  .btn-danger { background: rgba(139,26,26,0.3); color: #e06060; border: 1px solid rgba(139,26,26,0.4); }
  .btn-danger:hover { background: rgba(139,26,26,0.6); }
  .btn-success { background: rgba(46,204,113,0.12); color: #2ecc71; border: 1px solid rgba(46,204,113,0.3); }
  .btn-success:hover { background: rgba(46,204,113,0.25); }
  .btn-success:disabled { opacity: 0.4; cursor: not-allowed; }
  .btn-gold-sm { background: transparent; color: #C9A84C; border: 1px solid rgba(201,168,76,0.4); }
  .btn-gold-sm:hover { background: rgba(201,168,76,0.1); }

  .tab { 
    padding: 10px 20px; font-size: 0.68rem; letter-spacing: 0.15em; 
    text-transform: uppercase; cursor: pointer; border: none;
    font-family: 'Montserrat', sans-serif; font-weight: 600;
    transition: all 0.3s; background: transparent;
    border-bottom: 2px solid transparent;
  }
  .tab.active { color: #C9A84C; border-bottom-color: #C9A84C; }
  .tab:not(.active) { color: #555; }
  .tab:not(.active):hover { color: #888; }

  .chart-bar {
    transition: height 1s cubic-bezier(0.34, 1.56, 0.64, 1);
    position: relative;
  }
  .chart-bar:hover { filter: brightness(1.3); }

  .sidebar-link {
    display: flex; align-items: center; gap: 12px;
    padding: 12px 20px;
    font-size: 0.72rem; letter-spacing: 0.1em; text-transform: uppercase;
    color: #555; cursor: pointer;
    transition: all 0.3s;
    border-left: 2px solid transparent;
    text-decoration: none;
  }
  .sidebar-link:hover { color: #C9A84C; background: rgba(201,168,76,0.04); border-left-color: rgba(201,168,76,0.3); }
  .sidebar-link.active { color: #C9A84C; background: rgba(201,168,76,0.07); border-left-color: #C9A84C; }

  .hamburger {
    display: none;
    background: none;
    border: 1px solid rgba(201,168,76,0.3);
    color: #C9A84C;
    padding: 8px 10px;
    cursor: none;
    font-size: 1.1rem;
    line-height: 1;
    transition: background 0.2s;
  }
  .hamburger:hover { background: rgba(201,168,76,0.1); }
  .sidebar-overlay {
    display: none;
    position: fixed; inset: 0; z-index: 9;
    background: rgba(0,0,0,0.7);
    backdrop-filter: blur(4px);
  }

  @media (max-width: 768px) {
    .hamburger { display: block; }
    .sidebar-overlay.open { display: block; }
    .admin-sidebar {
      transform: translateX(-100%);
      transition: transform 0.3s ease;
    }
    .admin-sidebar.open {
      transform: translateX(0);
    }
    .admin-main {
      margin-left: 0 !important;
    }
    .admin-topbar-title h1 { font-size: 1rem !important; }
    .stats-grid { grid-template-columns: 1fr 1fr !important; }
  }

  .modal-overlay {
    position: fixed; inset: 0; z-index: 999;
    background: rgba(0,0,0,0.85); backdrop-filter: blur(8px);
    display: flex; align-items: center; justify-content: center; padding: 20px;
  }
`;

// ─── Mini Bar Chart ───────────────────────────────────────────────────────────
function BarChart({ data, label }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 120, padding: '0 4px' }}>
        {data.map((d, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%', justifyContent: 'flex-end' }}>
            <div style={{ fontSize: '0.55rem', color: '#C9A84C', fontWeight: 600 }}>{d.value > 0 ? d.value : ''}</div>
            <div
              className="chart-bar"
              style={{
                width: '100%',
                height: `${Math.max((d.value / max) * 90, d.value > 0 ? 8 : 0)}px`,
                background: 'linear-gradient(to top, #C9A84C, #E8C97A)',
                borderRadius: '2px 2px 0 0',
                minHeight: d.value > 0 ? 4 : 0,
              }}
              title={`${d.label}: ${d.value}`}
            />
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 8, padding: '0 4px' }}>
        {data.map((d, i) => (
          <div key={i} style={{ flex: 1, textAlign: 'center', fontSize: '0.52rem', color: '#555', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {d.label}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Donut Chart ─────────────────────────────────────────────────────────────
function DonutChart({ data, size = 120 }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  let offset = 0;
  const r = 45, cx = 60, cy = 60, circumference = 2 * Math.PI * r;
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 120 120">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1a1a1a" strokeWidth={14} />
        {total === 0 ? (
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="#222" strokeWidth={14} />
        ) : data.map((d, i) => {
          const pct = d.value / total;
          const dash = pct * circumference;
          const gap = circumference - dash;
          const el = (
            <circle
              key={i}
              cx={cx} cy={cy} r={r}
              fill="none"
              stroke={d.color}
              strokeWidth={14}
              strokeDasharray={`${dash} ${gap}`}
              strokeDashoffset={-offset * circumference}
              transform={`rotate(-90 ${cx} ${cy})`}
              style={{ transition: 'stroke-dasharray 1s ease' }}
            />
          );
          offset += pct;
          return el;
        })}
        <text x={cx} y={cy - 6} textAnchor="middle" fill="#C9A84C" fontSize="16" fontFamily="'Bebas Neue'" fontWeight="700">{total}</text>
        <text x={cx} y={cy + 10} textAnchor="middle" fill="#555" fontSize="7" fontFamily="Montserrat">TOTAL</text>
      </svg>
    </div>
  );
}

// ─── Confirm Modal ────────────────────────────────────────────────────────────
function ConfirmModal({ booking, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay">
      <div style={{ background: '#111', border: '1px solid rgba(139,26,26,0.5)', maxWidth: 400, width: '100%', padding: '36px' }}>
        <div style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: 16 }}>🗑️</div>
        <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.3rem', textAlign: 'center', marginBottom: 10 }}>Cancel Booking?</h3>
        <p style={{ color: '#888', fontSize: '0.82rem', textAlign: 'center', lineHeight: 1.7, marginBottom: 24 }}>
          Are you sure you want to cancel <strong style={{ color: '#F5EDD6' }}>{booking?.name}'s</strong> booking for <strong style={{ color: '#C9A84C' }}>{booking?.service}</strong>?
        </p>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn-sm btn-gold-sm" onClick={onCancel} style={{ flex: 1, padding: '12px' }}>Keep It</button>
          <button className="btn-sm btn-danger" onClick={onConfirm} style={{ flex: 1, padding: '12px' }}>Yes, Cancel</button>
        </div>
      </div>
    </div>
  );
}


// ─── Admin Cursor ─────────────────────────────────────────────────────────────
function AdminCursor() {
  const [pos, setPos] = React.useState({ x: -100, y: -100 });
  const [grow, setGrow] = React.useState(false);

  React.useEffect(() => {
    const onMove = (e) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', onMove);

    const onEnter = () => setGrow(true);
    const onLeave = () => setGrow(false);

    const els = document.querySelectorAll('button, a, .admin-card, .stat-card, .booking-row, .sidebar-link, select, input');
    els.forEach(el => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });

    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <>
      <div className={`admin-cursor ${grow ? 'grow' : ''}`} style={{ left: pos.x, top: pos.y }} />
      <div className="admin-cursor-dot" style={{ left: pos.x, top: pos.y }} />
    </>
  );
}


// ─── Amount + Paid Modal ──────────────────────────────────────────────────────
function MarkPaidModal({ booking, onConfirm, onCancel }) {
  const [amount, setAmount] = React.useState(booking?.amount || '');

  const servicePrices = {
    'Classic Cut': 35, 'Hot Shave': 45, 'Beard Sculpt': 30,
    'Fade Master': 40, 'Royal Package': 95, 'Hair Design': 55,
  };

  React.useEffect(() => {
    if (booking) {
      const svcName = booking.service?.split(' —')[0];
      const price = servicePrices[svcName] || '';
      setAmount(booking.amount || price || '');
    }
  }, [booking]);

  if (!booking) return null;

  return (
    <div className="modal-overlay">
      <div style={{ background: '#111', border: '1px solid rgba(46,204,113,0.4)', maxWidth: 400, width: '100%', padding: '36px', position: 'relative' }}>
        <div style={{ height: 3, background: 'linear-gradient(90deg, #1a8b1a, #2ecc71)', position: 'absolute', top: 0, left: 0, right: 0 }} />
        <div style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: 16 }}>💰</div>
        <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.3rem', textAlign: 'center', marginBottom: 6 }}>Mark as Paid</h3>
        <p style={{ color: '#888', fontSize: '0.78rem', textAlign: 'center', marginBottom: 24 }}>
          <strong style={{ color: '#F5EDD6' }}>{booking.name}</strong> · {booking.service?.split(' —')[0]}
        </p>
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: 8 }}>
            Amount Received ($)
          </label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#2ecc71', fontWeight: 700, fontSize: '1rem' }}>$</span>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="0"
              min="0"
              style={{
                width: '100%', background: '#0a0a0a',
                border: '1px solid rgba(46,204,113,0.3)',
                color: '#F5EDD6', padding: '12px 14px 12px 32px',
                fontFamily: 'Montserrat,sans-serif', fontSize: '1.1rem',
                outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>
          <p style={{ fontSize: '0.62rem', color: '#555', marginTop: 6 }}>
            Auto-filled from service price. Edit if needed.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn-sm btn-gold-sm" onClick={onCancel} style={{ flex: 1, padding: '12px' }}>Cancel</button>
          <button
            className="btn-sm"
            onClick={() => onConfirm(Number(amount) || 0)}
            style={{ flex: 1, padding: '12px', background: 'rgba(46,204,113,0.15)', color: '#2ecc71', border: '1px solid rgba(46,204,113,0.4)' }}
          >
            ✓ Confirm Payment
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Admin Dashboard Wrapper (with Auth) ────────────────────────────────
export default function AdminApp() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [checking, setChecking] = React.useState(true);

  React.useEffect(() => {
    const token = getToken();
    if (!token) { setChecking(false); return; }
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    axios.get('/api/auth/verify')
      .then(() => setIsLoggedIn(true))
      .catch(() => { clearToken(); setIsLoggedIn(false); })
      .finally(() => setChecking(false));
  }, []);

  if (checking) return (
    <div style={{ minHeight:'100vh', background:'#080808', display:'flex', alignItems:'center', justifyContent:'center', color:'#C9A84C', fontFamily:'Montserrat,sans-serif', fontSize:'0.8rem', letterSpacing:'0.2em' }}>
      LOADING...
    </div>
  );

  if (!isLoggedIn) return <AdminLogin onLogin={() => setIsLoggedIn(true)} />;
  return <AdminDashboard onLogout={() => { clearToken(); delete axios.defaults.headers.common['Authorization']; setIsLoggedIn(false); }} />;
}

// ─── Main Admin Dashboard ─────────────────────────────────────────────────────
function AdminDashboard({ onLogout }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterService, setFilterService] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [activeTab, setActiveTab] = useState('overview');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [markPaidTarget, setMarkPaidTarget] = useState(null);
  const [markingPaid, setMarkingPaid] = useState(null);
  const [notification, setNotification] = useState(null);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const showNotif = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleMarkPaid = (booking) => {
    setMarkPaidTarget(booking);
  };

  const confirmMarkPaid = async (amount) => {
    const booking = markPaidTarget;
    setMarkPaidTarget(null);
    setMarkingPaid(booking.id);
    try {
      await axios.patch(`/api/bookings/${booking.id}/pay`, { amount }).catch(() => {});
      setBookings(prev => prev.map(b =>
        b.id === booking.id ? { ...b, paymentStatus: 'paid', amount } : b
      ));
      showNotif(`✅ ${booking.name}'s payment of $${amount} marked as paid!`);
    } catch {
      setBookings(prev => prev.map(b =>
        b.id === booking.id ? { ...b, paymentStatus: 'paid', amount } : b
      ));
      showNotif(`✅ ${booking.name}'s payment of $${amount} confirmed!`);
    } finally {
      setMarkingPaid(null);
    }
  };

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/bookings');
      // Add mock data for demo if empty
      if (res.data.bookings.length === 0) {
        const mock = [
          { id: 'a1b2c3d4', name: 'Rahul Sharma', email: 'rahul@gmail.com', service: 'Royal Package — $95', barber: 'Marco Vitale', date: '2026-02-27', time: '10:00 AM', paymentStatus: 'paid', amount: 95, status: 'confirmed', createdAt: new Date().toISOString() },
          { id: 'e5f6g7h8', name: 'Priya Patel', email: 'priya@gmail.com', service: 'Classic Cut — $35', barber: 'James Okafor', date: '2026-02-27', time: '11:30 AM', paymentStatus: 'paid', amount: 35, status: 'confirmed', createdAt: new Date(Date.now()-3600000).toISOString() },
          { id: 'i9j0k1l2', name: 'Arjun Singh', email: 'arjun@gmail.com', service: 'Fade Master — $40', barber: 'Diego Reyes', date: '2026-02-28', time: '2:00 PM', paymentStatus: 'pending', amount: 40, status: 'confirmed', createdAt: new Date(Date.now()-7200000).toISOString() },
          { id: 'm3n4o5p6', name: 'Vikram Mehta', email: 'vikram@gmail.com', service: 'Hot Shave — $45', barber: 'Marco Vitale', date: '2026-02-28', time: '3:30 PM', paymentStatus: 'paid', amount: 45, status: 'confirmed', createdAt: new Date(Date.now()-10800000).toISOString() },
          { id: 'q7r8s9t0', name: 'Sneha Gupta', email: 'sneha@gmail.com', service: 'Beard Sculpt — $30', barber: 'Kai Nakamura', date: '2026-03-01', time: '9:00 AM', paymentStatus: 'paid', amount: 30, status: 'confirmed', createdAt: new Date(Date.now()-14400000).toISOString() },
        ];
        setBookings(mock);
      } else {
        setBookings(res.data.bookings);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/bookings/${deleteTarget.id}`);
      setBookings(prev => prev.filter(b => b.id !== deleteTarget.id));
      showNotif(`Booking for ${deleteTarget.name} cancelled successfully`);
    } catch {
      setBookings(prev => prev.filter(b => b.id !== deleteTarget.id));
      showNotif(`Booking cancelled`);
    }
    setDeleteTarget(null);
  };

  // ─── Stats ─────────────────────────────────────────────────────────────────
  const totalRevenue = bookings.filter(b => b.paymentStatus === 'paid').reduce((s, b) => s + (b.amount || 0), 0);
  const paidCount = bookings.filter(b => b.paymentStatus === 'paid').length;
  const pendingCount = bookings.filter(b => !b.paymentStatus || b.paymentStatus === 'pending').length;
  const todayCount = bookings.filter(b => b.date === new Date().toISOString().slice(0, 10)).length;

  // Service breakdown
  const serviceNames = ['Classic Cut', 'Hot Shave', 'Beard Sculpt', 'Fade Master', 'Royal Package', 'Hair Design'];
  const serviceData = serviceNames.map(name => ({
    label: name.split(' ')[0],
    value: bookings.filter(b => b.service?.includes(name)).length,
  }));

  // Barber breakdown
  const barberNames = ['Marco Vitale', 'James Okafor', 'Diego Reyes', 'Kai Nakamura'];
  const barberData = barberNames.map((name, i) => ({
    label: name.split(' ')[0],
    value: bookings.filter(b => b.barber === name).length,
    color: ['#C9A84C', '#2471a3', '#2ecc71', '#8B1A1A'][i],
  }));

  // Revenue by day (last 7 days)
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    const key = d.toISOString().slice(0, 10);
    const label = d.toLocaleDateString('en', { weekday: 'short' });
    const value = bookings.filter(b => b.date === key && b.paymentStatus === 'paid').reduce((s, b) => s + (b.amount || 0), 0);
    return { label, value };
  });

  // ─── Filtered Bookings ─────────────────────────────────────────────────────
  const filtered = bookings
    .filter(b => {
      const q = search.toLowerCase();
      return !q || b.name?.toLowerCase().includes(q) || b.email?.toLowerCase().includes(q) || b.service?.toLowerCase().includes(q);
    })
    .filter(b => filterService === 'all' || b.service?.includes(filterService))
    .filter(b => filterStatus === 'all' || (b.paymentStatus || 'pending') === filterStatus)
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === 'amount') return (b.amount || 0) - (a.amount || 0);
      if (sortBy === 'name') return a.name?.localeCompare(b.name);
      return 0;
    });

  const uniqueServices = [...new Set(bookings.map(b => b.service?.split(' — ')[0]).filter(Boolean))];

  return (
    <>
      <style>{adminStyles}</style>

      {/* Notification Toast */}
      {notification && (
        <div style={{
          position: 'fixed', top: 20, right: 20, zIndex: 2000,
          background: notification.type === 'success' ? 'rgba(46,204,113,0.15)' : 'rgba(139,26,26,0.15)',
          border: `1px solid ${notification.type === 'success' ? 'rgba(46,204,113,0.4)' : 'rgba(139,26,26,0.4)'}`,
          color: notification.type === 'success' ? '#2ecc71' : '#e06060',
          padding: '14px 22px', fontSize: '0.8rem', fontWeight: 600,
          animation: 'fadeUp 0.3s ease',
          backdropFilter: 'blur(10px)',
        }}>
          {notification.type === 'success' ? '✅' : '❌'} {notification.msg}
        </div>
      )}

      <AdminCursor />
      {deleteTarget && <ConfirmModal booking={deleteTarget} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />}
      {markPaidTarget && <MarkPaidModal booking={markPaidTarget} onConfirm={confirmMarkPaid} onCancel={() => setMarkPaidTarget(null)} />}

      <div style={{ display: 'flex', minHeight: '100vh', background: '#080808' }}>

        {/* ─── SIDEBAR ─────────────────────────────────────────────────────── */}
        {/* Mobile overlay */}
        <div className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)} />

        <div className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`} style={{ width: 220, background: '#0d0d0d', borderRight: '1px solid rgba(201,168,76,0.1)', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, bottom: 0, left: 0, zIndex: 10 }}>
          {/* Logo */}
          <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(201,168,76,0.1)' }}>
            <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '1.4rem', letterSpacing: '0.1em', lineHeight: 1.1 }}>
              <span className="gold-text">BLADE</span>
              <span style={{ color: '#333' }}>&</span>
              <span className="gold-text">CROWN</span>
            </div>
            <div style={{ fontSize: '0.55rem', color: '#444', letterSpacing: '0.3em', textTransform: 'uppercase', marginTop: 4 }}>Admin Panel</div>
          </div>

          {/* Nav */}
          <nav style={{ flex: 1, paddingTop: 16 }}>
            {[
              { id: 'dashboard', icon: '📊', label: 'Dashboard' },
              { id: 'bookings', icon: '📋', label: 'All Bookings' },
              { id: 'revenue', icon: '💰', label: 'Revenue' },
              { id: 'barbers', icon: '✂️', label: 'Barbers' },
            ].map(item => (
              <div
                key={item.id}
                className={`sidebar-link ${activeSection === item.id ? 'active' : ''}`}
                onClick={() => { setActiveSection(item.id); setSidebarOpen(false); }}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </nav>

          {/* Back to website */}
          <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(201,168,76,0.1)' }}>
            <a href="/" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.68rem', color: '#555', textDecoration: 'none', transition: 'color 0.3s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#C9A84C'}
              onMouseLeave={e => e.currentTarget.style.color = '#555'}
            >
              <span>🌐</span> View Website
            </a>
            <div style={{ marginTop: 16, fontSize: '0.58rem', color: '#333', letterSpacing: '0.1em' }}>
              <span style={{ color: '#2ecc71' }}>●</span> System Online
            </div>
          </div>
        </div>

        {/* ─── MAIN CONTENT ─────────────────────────────────────────────── */}
        <div className="admin-main" style={{ marginLeft: 220, flex: 1, overflow: 'auto' }}>

          {/* Top bar */}
          <div style={{ background: '#0d0d0d', borderBottom: '1px solid rgba(201,168,76,0.1)', padding: '0 32px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 5 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button className="hamburger" onClick={() => setSidebarOpen(s => !s)}>☰</button>
              <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.3rem', fontWeight: 900 }}>
                {activeSection === 'dashboard' && 'Dashboard Overview'}
                {activeSection === 'bookings' && 'All Bookings'}
                {activeSection === 'revenue' && 'Revenue Analytics'}
                {activeSection === 'barbers' && 'Barber Performance'}
              </h1>
              <p style={{ fontSize: '0.62rem', color: '#555', marginTop: 2 }}>
                {new Date().toLocaleDateString('en', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <button className="btn-sm btn-gold-sm" onClick={fetchBookings} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                🔄 Refresh
              </button>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #8B1A1A, #C9A84C)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700 }}>
                A
              </div>
            </div>
          </div>

          <div style={{ padding: 32 }}>

            {/* ─── DASHBOARD OVERVIEW ─────────────────────────────────────── */}
            {activeSection === 'dashboard' && (
              <>
                {/* Stat Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
                  {[
                    { label: 'Total Bookings', value: bookings.length, icon: '📋', color: '#C9A84C', sub: `${todayCount} today` },
                    { label: 'Total Revenue', value: `$${totalRevenue}`, icon: '💰', color: '#2ecc71', sub: `${paidCount} paid` },
                    { label: 'Paid', value: paidCount, icon: '✅', color: '#2ecc71', sub: `${bookings.length > 0 ? Math.round(paidCount / bookings.length * 100) : 0}% rate` },
                    { label: 'Pending', value: pendingCount, icon: '⏳', color: '#f39c12', sub: 'Awaiting payment' },
                  ].map((s, i) => (
                    <div key={s.label} className="stat-card" style={{ animationDelay: `${i * 0.1}s`, opacity: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                        <div style={{ fontSize: '1.6rem' }}>{s.icon}</div>
                        <div style={{ fontSize: '0.58rem', color: s.color, background: `${s.color}15`, padding: '3px 8px', border: `1px solid ${s.color}30`, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                          {s.sub}
                        </div>
                      </div>
                      <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '2.4rem', color: s.color, lineHeight: 1, marginBottom: 6 }}>{s.value}</div>
                      <div style={{ fontSize: '0.65rem', color: '#555', letterSpacing: '0.15em', textTransform: 'uppercase' }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Charts Row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 28 }}>
                  {/* Revenue chart */}
                  <div className="admin-card" style={{ padding: 24, gridColumn: 'span 2' }}>
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ fontSize: '0.62rem', color: '#C9A84C', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 6 }}>◈ Revenue</div>
                      <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.1rem', fontWeight: 700 }}>Last 7 Days</div>
                    </div>
                    <BarChart data={last7} label="Revenue" />
                    <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.68rem', color: '#555' }}>Total: <span style={{ color: '#2ecc71', fontWeight: 600 }}>${last7.reduce((s, d) => s + d.value, 0)}</span></span>
                      <span style={{ fontSize: '0.68rem', color: '#555' }}>Avg/day: <span style={{ color: '#C9A84C', fontWeight: 600 }}>${Math.round(last7.reduce((s, d) => s + d.value, 0) / 7)}</span></span>
                    </div>
                  </div>

                  {/* Donut */}
                  <div className="admin-card" style={{ padding: 24 }}>
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ fontSize: '0.62rem', color: '#C9A84C', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 6 }}>◈ By Barber</div>
                      <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.1rem', fontWeight: 700 }}>Bookings Split</div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
                      <DonutChart data={barberData} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {barberData.map(b => (
                        <div key={b.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: b.color }} />
                            <span style={{ fontSize: '0.7rem', color: '#888' }}>{b.label}</span>
                          </div>
                          <span style={{ fontSize: '0.7rem', color: '#F5EDD6', fontWeight: 600 }}>{b.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Service breakdown */}
                <div className="admin-card" style={{ padding: 24, marginBottom: 28 }}>
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: '0.62rem', color: '#C9A84C', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 6 }}>◈ Services</div>
                    <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.1rem', fontWeight: 700 }}>Bookings by Service</div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
                    {serviceNames.map(name => {
                      const count = bookings.filter(b => b.service?.includes(name)).length;
                      const pct = bookings.length > 0 ? (count / bookings.length) * 100 : 0;
                      return (
                        <div key={name} style={{ background: '#0a0a0a', border: '1px solid rgba(201,168,76,0.1)', padding: '16px' }}>
                          <div style={{ fontSize: '0.62rem', color: '#555', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>{name}</div>
                          <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '1.8rem', color: '#C9A84C', lineHeight: 1, marginBottom: 8 }}>{count}</div>
                          <div style={{ height: 3, background: '#1a1a1a', borderRadius: 2 }}>
                            <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, #C9A84C, #E8C97A)', borderRadius: 2, transition: 'width 1s ease' }} />
                          </div>
                          <div style={{ fontSize: '0.58rem', color: '#444', marginTop: 4 }}>{Math.round(pct)}% of total</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Recent Bookings */}
                <div className="admin-card" style={{ padding: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <div>
                      <div style={{ fontSize: '0.62rem', color: '#C9A84C', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 6 }}>◈ Recent</div>
                      <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.1rem', fontWeight: 700 }}>Latest Bookings</div>
                    </div>
                    <button className="btn-sm btn-gold-sm" onClick={() => setActiveSection('bookings')}>View All →</button>
                  </div>
                  <BookingsTable bookings={bookings.slice(0, 5)} onDelete={setDeleteTarget} onMarkPaid={handleMarkPaid} markingPaid={markingPaid} compact />
                </div>
              </>
            )}

            {/* ─── ALL BOOKINGS ────────────────────────────────────────────── */}
            {activeSection === 'bookings' && (
              <>
                {/* Filters */}
                <div className="admin-card" style={{ padding: 20, marginBottom: 20 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto auto', gap: 12, alignItems: 'center' }}>
                    <input
                      className="search-input"
                      placeholder="🔍  Search by name, email or service..."
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                    />
                    <select className="search-input" style={{ width: 'auto' }} value={filterService} onChange={e => setFilterService(e.target.value)}>
                      <option value="all">All Services</option>
                      {uniqueServices.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <select className="search-input" style={{ width: 'auto' }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                      <option value="all">All Status</option>
                      <option value="paid">Paid</option>
                      <option value="pending">Pending</option>
                    </select>
                    <select className="search-input" style={{ width: 'auto' }} value={sortBy} onChange={e => setSortBy(e.target.value)}>
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="amount">Highest Amount</option>
                      <option value="name">Name A-Z</option>
                    </select>
                  </div>
                  <div style={{ marginTop: 12, fontSize: '0.68rem', color: '#555' }}>
                    Showing <span style={{ color: '#C9A84C', fontWeight: 600 }}>{filtered.length}</span> of {bookings.length} bookings
                    {search && <span> · filtered by "<span style={{ color: '#C9A84C' }}>{search}</span>"</span>}
                  </div>
                </div>

                <div className="admin-card" style={{ padding: 24 }}>
                  {loading ? (
                    <div style={{ textAlign: 'center', padding: '60px 0' }}>
                      <div style={{ width: 40, height: 40, border: '3px solid rgba(201,168,76,0.2)', borderTop: '3px solid #C9A84C', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 0.8s linear infinite' }} />
                      <p style={{ color: '#555', fontSize: '0.8rem' }}>Loading bookings...</p>
                    </div>
                  ) : filtered.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px 0' }}>
                      <div style={{ fontSize: '3rem', marginBottom: 16 }}>📭</div>
                      <p style={{ color: '#555' }}>No bookings found</p>
                    </div>
                  ) : (
                    <BookingsTable bookings={filtered} onDelete={setDeleteTarget} onMarkPaid={handleMarkPaid} markingPaid={markingPaid} />
                  )}
                </div>
              </>
            )}

            {/* ─── REVENUE ─────────────────────────────────────────────────── */}
            {activeSection === 'revenue' && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
                  {[
                    { label: 'Total Revenue', value: `$${totalRevenue}`, icon: '💰', color: '#2ecc71' },
                    { label: 'Avg per Booking', value: `$${bookings.length > 0 ? Math.round(totalRevenue / bookings.length) : 0}`, icon: '📈', color: '#C9A84C' },
                    { label: 'Highest Service', value: 'Royal Package', icon: '👑', color: '#E8C97A' },
                  ].map(s => (
                    <div key={s.label} className="stat-card">
                      <div style={{ fontSize: '1.5rem', marginBottom: 14 }}>{s.icon}</div>
                      <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '2.2rem', color: s.color, lineHeight: 1, marginBottom: 6 }}>{s.value}</div>
                      <div style={{ fontSize: '0.62rem', color: '#555', letterSpacing: '0.15em', textTransform: 'uppercase' }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                <div className="admin-card" style={{ padding: 24, marginBottom: 20 }}>
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: '0.62rem', color: '#C9A84C', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 6 }}>◈ Revenue Trend</div>
                    <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.2rem', fontWeight: 700 }}>Last 7 Days Revenue</div>
                  </div>
                  <BarChart data={last7} />
                </div>

                <div className="admin-card" style={{ padding: 24 }}>
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: '0.62rem', color: '#C9A84C', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 6 }}>◈ Breakdown</div>
                    <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.2rem', fontWeight: 700 }}>Revenue by Service</div>
                  </div>
                  {serviceNames.map(name => {
                    const rev = bookings.filter(b => b.service?.includes(name) && b.paymentStatus === 'paid').reduce((s, b) => s + (b.amount || 0), 0);
                    const maxRev = Math.max(...serviceNames.map(n => bookings.filter(b => b.service?.includes(n) && b.paymentStatus === 'paid').reduce((s, b) => s + (b.amount || 0), 0)), 1);
                    return (
                      <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14 }}>
                        <div style={{ width: 120, fontSize: '0.72rem', color: '#888', whiteSpace: 'nowrap' }}>{name}</div>
                        <div style={{ flex: 1, height: 8, background: '#1a1a1a', borderRadius: 4 }}>
                          <div style={{ height: '100%', width: `${(rev / maxRev) * 100}%`, background: 'linear-gradient(90deg, #C9A84C, #E8C97A)', borderRadius: 4, transition: 'width 1s ease' }} />
                        </div>
                        <div style={{ width: 60, textAlign: 'right', fontSize: '0.75rem', color: '#2ecc71', fontWeight: 600 }}>${rev}</div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* ─── BARBERS ─────────────────────────────────────────────────── */}
            {activeSection === 'barbers' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
                {barberNames.map((name, i) => {
                  const barberBookings = bookings.filter(b => b.barber === name);
                  const revenue = barberBookings.filter(b => b.paymentStatus === 'paid').reduce((s, b) => s + (b.amount || 0), 0);
                  const colors = ['#8B1A1A', '#1A3A8B', '#1A5C2A', '#5C2A1A'];
                  const initials = name.split(' ').map(n => n[0]).join('');
                  return (
                    <div key={name} className="admin-card" style={{ padding: 28 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                        <div style={{ width: 60, height: 60, borderRadius: '50%', background: `linear-gradient(135deg, ${colors[i]}, ${colors[i]}80)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Playfair Display',serif", fontSize: '1.3rem', fontWeight: 900, border: '2px solid rgba(201,168,76,0.3)' }}>
                          {initials}
                        </div>
                        <div>
                          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '1rem', fontWeight: 700 }}>{name}</div>
                          <div style={{ fontSize: '0.62rem', color: '#C9A84C', letterSpacing: '0.1em' }}>Master Barber</div>
                        </div>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                        {[
                          { label: 'Bookings', value: barberBookings.length, color: '#C9A84C' },
                          { label: 'Revenue', value: `$${revenue}`, color: '#2ecc71' },
                        ].map(stat => (
                          <div key={stat.label} style={{ background: '#0a0a0a', border: '1px solid rgba(201,168,76,0.08)', padding: '14px' }}>
                            <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '1.8rem', color: stat.color, lineHeight: 1 }}>{stat.value}</div>
                            <div style={{ fontSize: '0.58rem', color: '#444', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 4 }}>{stat.label}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{ height: 4, background: '#1a1a1a', borderRadius: 2 }}>
                        <div style={{ height: '100%', width: `${bookings.length > 0 ? (barberBookings.length / bookings.length) * 100 : 0}%`, background: `linear-gradient(90deg, ${colors[i]}, #C9A84C)`, borderRadius: 2, transition: 'width 1s ease' }} />
                      </div>
                      <div style={{ fontSize: '0.6rem', color: '#444', marginTop: 6 }}>
                        {bookings.length > 0 ? Math.round((barberBookings.length / bookings.length) * 100) : 0}% of total bookings
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}

// ─── Bookings Table Component ─────────────────────────────────────────────────
function BookingsTable({ bookings, onDelete, onMarkPaid, markingPaid, compact = false }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(201,168,76,0.15)' }}>
            {['Client', 'Service', 'Barber', 'Date & Time', 'Amount', 'Status', ''].map(h => (
              <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#555', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bookings.map((b, i) => (
            <tr key={b.id} className="booking-row" style={{ animationDelay: `${i * 0.05}s`, opacity: 0 }}>
              <td style={{ padding: '14px 14px' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#F5EDD6' }}>{b.name}</div>
                {!compact && <div style={{ fontSize: '0.68rem', color: '#555', marginTop: 2 }}>{b.email}</div>}
              </td>
              <td style={{ padding: '14px 14px' }}>
                <div style={{ fontSize: '0.75rem', color: '#C9A84C' }}>{b.service?.split(' — ')[0]}</div>
              </td>
              <td style={{ padding: '14px 14px' }}>
                <div style={{ fontSize: '0.72rem', color: '#888' }}>{b.barber || '—'}</div>
              </td>
              <td style={{ padding: '14px 14px', whiteSpace: 'nowrap' }}>
                <div style={{ fontSize: '0.75rem', color: '#F5EDD6' }}>{b.date}</div>
                <div style={{ fontSize: '0.65rem', color: '#555' }}>{b.time}</div>
              </td>
              <td style={{ padding: '14px 14px' }}>
                <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '1.1rem', color: '#2ecc71' }}>${b.amount || '—'}</div>
              </td>
              <td style={{ padding: '14px 14px' }}>
                <span className={`badge ${b.paymentStatus === 'paid' ? 'badge-paid' : b.paymentStatus === 'cancelled' ? 'badge-cancelled' : 'badge-pending'}`}>
                  {b.paymentStatus === 'paid' ? '✓ Paid' : b.paymentStatus === 'cancelled' ? '✕ Cancelled' : '⏳ Pending'}
                </span>
              </td>
              <td style={{ padding: '14px 14px' }}>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  {b.paymentStatus !== 'paid' && b.paymentStatus !== 'cancelled' && (
                    <button
                      className="btn-sm btn-success"
                      onClick={() => onMarkPaid(b)}
                      disabled={markingPaid === b.id}
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      {markingPaid === b.id ? '...' : '💰 Paid'}
                    </button>
                  )}
                  {b.paymentStatus !== 'cancelled' && (
                    b.paymentStatus === 'paid'
                      ? <span title="Cannot cancel a paid booking" style={{ fontSize:'0.6rem', color:'#444', letterSpacing:'0.08em', border:'1px solid #2a2a2a', padding:'4px 8px', cursor:'not-allowed' }}>🔒 PAID</span>
                      : <button className="btn-sm btn-danger" onClick={() => onDelete(b)}>✕ Cancel</button>
                  )}
                  {b.paymentStatus === 'cancelled' && (
                    <span style={{ fontSize: '0.62rem', color: '#444', letterSpacing: '0.1em' }}>—</span>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}