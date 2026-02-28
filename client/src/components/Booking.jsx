import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useReveal } from '../hooks/useReveal';

const services = [
  { label: 'Classic Cut — $35', price: 35 },
  { label: 'Hot Shave — $45', price: 45 },
  { label: 'Beard Sculpt — $30', price: 30 },
  { label: 'Fade Master — $40', price: 40 },
  { label: 'Royal Package — $95', price: 95 },
  { label: 'Hair Design — $55', price: 55 },
];

const ALL_TIMES = [
  '9:00 AM','10:00 AM','11:00 AM','12:00 PM',
  '1:00 PM','2:00 PM','3:00 PM','4:00 PM',
  '5:00 PM','6:00 PM','7:00 PM',
];

const barbers = ['Marco Vitale','James Okafor','Diego Reyes','Kai Nakamura','No Preference'];
const todayStr = () => new Date().toISOString().slice(0,10);

export default function Booking() {
  const { ref } = useReveal();
  const [form, setForm] = useState({ name:'',email:'',phone:'',service:'',barber:'',date:'',time:'',notes:'' });
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [slotCounts, setSlotCounts] = useState({});
  const [loadingSlots, setLoadingSlots] = useState(false);

  useEffect(() => {
    if (!form.date) return;
    setLoadingSlots(true);
    setForm(f => ({ ...f, time: '' }));
    axios.get(`/api/availability?date=${form.date}`)
      .then(res => setSlotCounts(res.data.slotCounts || {}))
      .catch(() => setSlotCounts({}))
      .finally(() => setLoadingSlots(false));
  }, [form.date]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handlePhone = e => setForm({ ...form, phone: e.target.value.replace(/\D/g,'').slice(0,10) });

  const validate = () => {
    if (!form.name.trim() || form.name.trim().length < 2) return 'Please enter your full name (min 2 characters).';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Please enter a valid email address.';
    if (!form.phone || form.phone.length !== 10) return 'Mobile number must be exactly 10 digits.';
    if (!form.service) return 'Please select a service.';
    if (!form.date) return 'Please select a date.';
    if (!form.time) return 'Please select a time slot.';
    if ((slotCounts[form.time] || 0) >= 3) return 'This slot is fully booked. Please choose another time.';
    return null;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const err = validate();
    if (err) { setErrorMsg(err); setStatus('error'); setTimeout(() => setStatus('idle'), 4000); return; }
    setStatus('loading');
    try {
      await axios.post('/api/bookings', { ...form, name: form.name.trim(), email: form.email.trim(), paymentStatus: 'pending' });
      setStatus('success');
      setForm({ name:'',email:'',phone:'',service:'',barber:'',date:'',time:'',notes:'' });
      setSlotCounts({});
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.response?.data?.message || 'Something went wrong. Please try again.');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  return (
    <section id="booking" style={{ padding:'120px 0',background:'var(--dark)',position:'relative',overflow:'hidden' }}>
      <div className="grid-bg" style={{ position:'absolute',inset:0,opacity:0.5,pointerEvents:'none' }}/>
      <div style={{ position:'absolute',right:'-5%',bottom:'-10%',width:'40%',height:'60%',background:'radial-gradient(ellipse,rgba(139,26,26,0.12) 0%,transparent 70%)',pointerEvents:'none' }}/>

      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16 reveal" ref={ref}>
          <span className="section-eyebrow">◈ Reserve Your Seat</span>
          <h2 className="font-serif" style={{ fontSize:'clamp(2.5rem,5vw,4.5rem)',fontWeight:900 }}>
            Book a <span className="gold-text">Session</span>
          </h2>
          <div className="section-divider"/>
          <p style={{ color:'var(--gray)',maxWidth:460,margin:'0 auto',fontSize:'0.88rem',lineHeight:1.9 }}>
            Reserve your chair with one of our master barbers. Our team will confirm your appointment shortly.
          </p>
        </div>

        <div style={{ background:'var(--dark-3)',border:'1px solid rgba(201,168,76,0.18)',padding:'clamp(30px,5vw,60px)',position:'relative' }}>
          <div style={{ position:'absolute',top:0,left:0,width:40,height:40,borderTop:'2px solid var(--gold)',borderLeft:'2px solid var(--gold)' }}/>
          <div style={{ position:'absolute',bottom:0,right:0,width:40,height:40,borderBottom:'2px solid var(--gold)',borderRight:'2px solid var(--gold)' }}/>

          {status === 'success' ? <SuccessState/> : (
            <form onSubmit={handleSubmit}>

              {/* Name + Email */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="form-label">Full Name *</label>
                  <input className="form-input" name="name" value={form.name} onChange={handleChange} placeholder="John Doe" required/>
                </div>
                <div>
                  <label className="form-label">Email Address *</label>
                  <input className="form-input" name="email" type="email" value={form.email} onChange={handleChange} placeholder="john@example.com" required/>
                </div>
              </div>

              {/* Phone + Service */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="form-label">Mobile Number * <span style={{ color:'var(--gray)',fontWeight:400 }}>(10 digits)</span></label>
                  <div style={{ position:'relative' }}>
                    <span style={{ position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',fontSize:'0.82rem',color:'var(--gray)',zIndex:1 }}>+91</span>
                    <input className="form-input" name="phone" type="tel" value={form.phone} onChange={handlePhone} placeholder="9876543210" style={{ paddingLeft:44 }} maxLength={10} required/>
                  </div>
                  {form.phone.length > 0 && form.phone.length < 10 && (
                    <div style={{ fontSize:'0.63rem',color:'#e06060',marginTop:5 }}>⚠ {10-form.phone.length} more digits needed</div>
                  )}
                  {form.phone.length === 10 && (
                    <div style={{ fontSize:'0.63rem',color:'#2ecc71',marginTop:5 }}>✓ Valid number</div>
                  )}
                </div>
                <div>
                  <label className="form-label">Service *</label>
                  <select className="form-input" name="service" value={form.service} onChange={handleChange} required>
                    <option value="">Select a service...</option>
                    {services.map(s => <option key={s.label} value={s.label}>{s.label}</option>)}
                  </select>
                </div>
              </div>

              {/* Barber + Date */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="form-label">Preferred Barber</label>
                  <select className="form-input" name="barber" value={form.barber} onChange={handleChange}>
                    <option value="">No Preference</option>
                    {barbers.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Preferred Date *</label>
                  <input className="form-input" name="date" type="date" value={form.date} onChange={handleChange} min={todayStr()} required/>
                </div>
              </div>

              {/* Time Slots Grid */}
              <div className="mb-6">
                <label className="form-label">
                  Preferred Time * <span style={{ color:'var(--gray)',fontWeight:400,fontSize:'0.65rem' }}>(Each slot: 1 hour · Max 3 bookings)</span>
                </label>
                {!form.date ? (
                  <div style={{ background:'rgba(201,168,76,0.04)',border:'1px dashed rgba(201,168,76,0.2)',padding:'16px 18px',fontSize:'0.78rem',color:'var(--gray)',textAlign:'center' }}>
                    👆 Select a date to see available slots
                  </div>
                ) : loadingSlots ? (
                  <div style={{ background:'rgba(201,168,76,0.04)',border:'1px dashed rgba(201,168,76,0.2)',padding:'16px 18px',fontSize:'0.78rem',color:'var(--gray)',textAlign:'center' }}>
                    Loading slots...
                  </div>
                ) : (
                  <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(150px, 1fr))',gap:8,marginTop:8 }}>
                    {ALL_TIMES.map(time => {
                      const count = slotCounts[time] || 0;
                      const isFull = count >= 3;
                      const isSelected = form.time === time;
                      const remaining = 3 - count;
                      return (
                        <button key={time} type="button" disabled={isFull}
                          onClick={() => !isFull && setForm(f => ({ ...f, time }))}
                          style={{
                            padding:'10px 14px', textAlign:'left',
                            border: isSelected ? '2px solid var(--gold)' : isFull ? '1px solid rgba(139,26,26,0.25)' : '1px solid rgba(201,168,76,0.18)',
                            background: isSelected ? 'rgba(201,168,76,0.12)' : isFull ? 'rgba(139,26,26,0.06)' : 'rgba(201,168,76,0.03)',
                            color: isSelected ? 'var(--gold)' : isFull ? '#444' : 'var(--cream)',
                            cursor: isFull ? 'not-allowed' : 'none',
                            opacity: isFull ? 0.5 : 1,
                            transition: 'all 0.2s',
                            fontFamily:'Montserrat,sans-serif',
                          }}>
                          <div style={{ fontSize:'0.78rem',fontWeight:600 }}>{time}</div>
                          <div style={{ fontSize:'0.58rem',marginTop:3,letterSpacing:'0.06em',
                            color: isSelected ? 'var(--gold)' : isFull ? '#555' : remaining === 1 ? '#f39c12' : '#2ecc71' }}>
                            {isFull ? '● FULL' : `● ${remaining} slot${remaining>1?'s':''} left`}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Notes */}
              <div className="mb-8">
                <label className="form-label">Special Requests <span style={{ color:'var(--gray)',fontWeight:400 }}>(Optional)</span></label>
                <textarea className="form-input" name="notes" value={form.notes} onChange={handleChange}
                  placeholder="Any special requests or preferences for your barber..." rows={3}
                  style={{ resize:'vertical',minHeight:80 }}/>
              </div>

              {/* Enquiry notice */}
              <div style={{ background:'rgba(201,168,76,0.05)',border:'1px solid rgba(201,168,76,0.15)',padding:'14px 18px',marginBottom:20,display:'flex',gap:12,alignItems:'flex-start' }}>
                <span style={{ fontSize:'1.1rem',marginTop:1 }}>ℹ️</span>
                <div style={{ fontSize:'0.72rem',color:'var(--gray)',lineHeight:1.8 }}>
                  This is an <strong style={{ color:'var(--cream)' }}>enquiry request</strong>. Our team will confirm your appointment via email or phone. Payment will be collected at the shop.
                </div>
              </div>

              {/* Error */}
              {status === 'error' && (
                <div style={{ background:'rgba(139,26,26,0.2)',border:'1px solid rgba(139,26,26,0.5)',padding:'12px 18px',marginBottom:20,fontSize:'0.82rem',color:'#e06060' }}>
                  ⚠️ {errorMsg}
                </div>
              )}

              <button type="submit" className="btn-gold" disabled={status==='loading'} style={{ width:'100%',padding:'18px',fontSize:'0.72rem',letterSpacing:'0.28em' }}>
                <span>{status==='loading' ? 'Submitting...' : '✂️ Submit Enquiry'}</span>
              </button>
              <p style={{ textAlign:'center',fontSize:'0.7rem',color:'var(--gray)',marginTop:18 }}>
                Free cancellation 24+ hours in advance · Payment collected at shop
              </p>
            </form>
          )}
        </div>

        {/* Info strip */}
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          {[['📍','Location','42 Crown Street, New York, NY 10001'],['📞','Phone','+1 (212) 555-BLADE'],['⏰','Hours','Mon–Fri 9AM–8PM, Sat 8AM–7PM']].map(([icon,label,val])=>(
            <div key={label} style={{ background:'var(--dark-3)',border:'1px solid rgba(201,168,76,0.1)',padding:'20px 22px',display:'flex',gap:14,alignItems:'center' }}>
              <span style={{ fontSize:'1.4rem' }}>{icon}</span>
              <div>
                <div style={{ fontSize:'0.6rem',color:'var(--gold)',letterSpacing:'0.2em',textTransform:'uppercase',marginBottom:4 }}>{label}</div>
                <div style={{ fontSize:'0.78rem',color:'var(--gray)' }}>{val}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SuccessState() {
  return (
    <div style={{ textAlign:'center',padding:'40px 20px' }}>
      <div style={{ fontSize:'5rem',marginBottom:22 }}>📋</div>
      <h3 className="font-serif" style={{ fontSize:'2.2rem',fontWeight:900,color:'var(--gold)',marginBottom:14 }}>Enquiry Submitted!</h3>
      <p style={{ color:'var(--gray)',lineHeight:1.8,maxWidth:440,margin:'0 auto 28px' }}>
        We've received your booking request. Our team will confirm your appointment via <strong style={{ color:'var(--cream)' }}>email or phone</strong> within a few hours.
      </p>
      <div style={{ height:1,background:'linear-gradient(90deg,transparent,var(--gold),transparent)',margin:'24px auto',width:'60%' }}/>
      <p style={{ fontSize:'0.75rem',color:'var(--gray)' }}>Questions? Call us at <span style={{ color:'var(--gold)' }}>+1 (212) 555-BLADE</span></p>
    </div>
  );
}