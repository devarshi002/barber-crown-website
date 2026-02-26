import React, { useState } from 'react';
import axios from 'axios';

axios.defaults.baseURL = 'https://barber-crown-apii.onrender.com';
import { useReveal } from '../hooks/useReveal';

const services = [
  { label: 'Classic Cut — $35', price: 35 },
  { label: 'Hot Shave — $45', price: 45 },
  { label: 'Beard Sculpt — $30', price: 30 },
  { label: 'Fade Master — $40', price: 40 },
  { label: 'Royal Package — $95', price: 95 },
  { label: 'Hair Design — $55', price: 55 },
];

const times = [
  '9:00 AM','9:30 AM','10:00 AM','10:30 AM','11:00 AM',
  '11:30 AM','12:00 PM','1:00 PM','1:30 PM','2:00 PM',
  '2:30 PM','3:00 PM','3:30 PM','4:00 PM','4:30 PM',
  '5:00 PM','5:30 PM','6:00 PM','6:30 PM','7:00 PM',
];

const barbers = ['Marco Vitale','James Okafor','Diego Reyes','Kai Nakamura','No Preference'];

function PaymentModal({ amount, onSuccess, onClose }) {
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [payStatus, setPayStatus] = useState('idle');

  const formatCard = (val) => val.replace(/\D/g,'').slice(0,16).replace(/(.{4})/g,'$1 ').trim();
  const formatExpiry = (val) => {
    const d = val.replace(/\D/g,'').slice(0,4);
    return d.length >= 3 ? d.slice(0,2)+'/'+d.slice(2) : d;
  };

  const cardType = () => {
    const n = card.number.replace(/\s/g,'');
    if(n.startsWith('4')) return 'VISA';
    if(n.startsWith('5')) return 'Mastercard';
    if(n.startsWith('3')) return 'Amex';
    return 'CARD';
  };

  const handlePay = async () => {
    if(!card.number||!card.expiry||!card.cvv||!card.name){ alert('Please fill all card details!'); return; }
    if(card.number.replace(/\s/g,'').length<16){ alert('Enter valid 16-digit card number!'); return; }
    setPayStatus('processing');
    await new Promise(r=>setTimeout(r,2500));
    setPayStatus('success');
    await new Promise(r=>setTimeout(r,1500));
    onSuccess();
  };

  return (
    <div style={{position:'fixed',inset:0,zIndex:1000,background:'rgba(0,0,0,0.88)',backdropFilter:'blur(10px)',display:'flex',alignItems:'center',justifyContent:'center',padding:'20px'}}>
      <style>{`
        @keyframes modalIn{from{opacity:0;transform:scale(0.93) translateY(20px)}to{opacity:1;transform:scale(1) translateY(0)}}
        @keyframes spin360{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes checkBounce{0%{transform:scale(0)}70%{transform:scale(1.25)}100%{transform:scale(1)}}
      `}</style>
      <div style={{background:'#111',border:'1px solid rgba(201,168,76,0.35)',width:'100%',maxWidth:430,position:'relative',overflow:'hidden',animation:'modalIn 0.35s ease'}}>
        <div style={{height:3,background:'linear-gradient(90deg,#C9A84C,#E8C97A,#C9A84C)'}}/>
        <div style={{position:'absolute',top:3,left:0,width:28,height:28,borderTop:'1px solid #C9A84C',borderLeft:'1px solid #C9A84C'}}/>
        <div style={{position:'absolute',bottom:0,right:0,width:28,height:28,borderBottom:'1px solid #C9A84C',borderRight:'1px solid #C9A84C'}}/>
        <div style={{padding:'30px 34px'}}>

          {payStatus==='processing' && (
            <div style={{textAlign:'center',padding:'44px 0'}}>
              <div style={{width:56,height:56,borderRadius:'50%',border:'3px solid rgba(201,168,76,0.15)',borderTop:'3px solid #C9A84C',margin:'0 auto 22px',animation:'spin360 0.8s linear infinite'}}/>
              <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:'1.35rem',color:'#C9A84C',marginBottom:10}}>Processing Payment...</h3>
              <p style={{color:'#888',fontSize:'0.8rem',marginBottom:20}}>Please wait, do not close this window</p>
              <div style={{display:'flex',justifyContent:'center',gap:8}}>
                {['🔒 Secure','🛡️ Encrypted','✅ Safe'].map(t=>(
                  <span key={t} style={{fontSize:'0.6rem',color:'#888',background:'rgba(201,168,76,0.07)',padding:'4px 10px',border:'1px solid rgba(201,168,76,0.1)'}}>{t}</span>
                ))}
              </div>
            </div>
          )}

          {payStatus==='success' && (
            <div style={{textAlign:'center',padding:'44px 0'}}>
              <div style={{width:68,height:68,borderRadius:'50%',background:'linear-gradient(135deg,#1a8b1a,#2ecc71)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 18px',fontSize:'2rem',animation:'checkBounce 0.5s ease',boxShadow:'0 0 30px rgba(46,204,113,0.35)'}}>✓</div>
              <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:'1.5rem',color:'#2ecc71',marginBottom:8}}>Payment Successful!</h3>
              <p style={{color:'#888',fontSize:'0.82rem'}}>${amount} paid · Confirming your booking...</p>
            </div>
          )}

          {payStatus==='idle' && (
            <>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}>
                <div>
                  <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:'1.3rem',fontWeight:700,color:'#F5EDD6',marginBottom:4}}>Secure Payment</h3>
                  <p style={{fontSize:'0.68rem',color:'#888'}}>🔒 256-bit SSL Encrypted</p>
                </div>
                <div style={{textAlign:'right'}}>
                  <div style={{fontSize:'0.58rem',color:'#888',letterSpacing:'0.15em',textTransform:'uppercase'}}>Total</div>
                  <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:'2.2rem',color:'#C9A84C',lineHeight:1}}>${amount}</div>
                </div>
              </div>

              {/* Card visual */}
              <div style={{background:'linear-gradient(135deg,#0d1b2a,#1a1a3e)',border:'1px solid rgba(201,168,76,0.18)',borderRadius:8,padding:'18px 22px',marginBottom:20,position:'relative',overflow:'hidden'}}>
                <div style={{position:'absolute',top:-15,right:-15,width:80,height:80,borderRadius:'50%',background:'rgba(201,168,76,0.05)'}}/>
                <div style={{fontSize:'0.6rem',color:'rgba(201,168,76,0.55)',letterSpacing:'0.2em',marginBottom:12}}>BLADE & CROWN</div>
                <div style={{fontFamily:'monospace',fontSize:'0.95rem',letterSpacing:'0.18em',color:'#F5EDD6',marginBottom:14}}>{card.number||'•••• •••• •••• ••••'}</div>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end'}}>
                  <div>
                    <div style={{fontSize:'0.52rem',color:'rgba(201,168,76,0.45)',marginBottom:2}}>CARD HOLDER</div>
                    <div style={{fontSize:'0.72rem',color:'#F5EDD6',textTransform:'uppercase'}}>{card.name||'YOUR NAME'}</div>
                  </div>
                  <div>
                    <div style={{fontSize:'0.52rem',color:'rgba(201,168,76,0.45)',marginBottom:2}}>EXPIRES</div>
                    <div style={{fontSize:'0.72rem',color:'#F5EDD6'}}>{card.expiry||'MM/YY'}</div>
                  </div>
                  <div style={{fontSize:'0.85rem',color:'#C9A84C',fontWeight:700}}>{cardType()}</div>
                </div>
              </div>

              <div style={{marginBottom:14}}>
                <label style={{display:'block',fontSize:'0.6rem',letterSpacing:'0.25em',textTransform:'uppercase',color:'#C9A84C',marginBottom:7,fontWeight:600}}>Card Number</label>
                <input className="form-input" placeholder="1234 5678 9012 3456" value={card.number} onChange={e=>setCard({...card,number:formatCard(e.target.value)})} maxLength={19}/>
              </div>

              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:14}}>
                <div>
                  <label style={{display:'block',fontSize:'0.6rem',letterSpacing:'0.25em',textTransform:'uppercase',color:'#C9A84C',marginBottom:7,fontWeight:600}}>Expiry</label>
                  <input className="form-input" placeholder="MM/YY" value={card.expiry} onChange={e=>setCard({...card,expiry:formatExpiry(e.target.value)})} maxLength={5}/>
                </div>
                <div>
                  <label style={{display:'block',fontSize:'0.6rem',letterSpacing:'0.25em',textTransform:'uppercase',color:'#C9A84C',marginBottom:7,fontWeight:600}}>CVV</label>
                  <input className="form-input" placeholder="•••" type="password" value={card.cvv} onChange={e=>setCard({...card,cvv:e.target.value.replace(/\D/g,'').slice(0,4)})} maxLength={4}/>
                </div>
              </div>

              <div style={{marginBottom:20}}>
                <label style={{display:'block',fontSize:'0.6rem',letterSpacing:'0.25em',textTransform:'uppercase',color:'#C9A84C',marginBottom:7,fontWeight:600}}>Name on Card</label>
                <input className="form-input" placeholder="John Doe" value={card.name} onChange={e=>setCard({...card,name:e.target.value})}/>
              </div>

              <div style={{background:'rgba(201,168,76,0.06)',border:'1px solid rgba(201,168,76,0.14)',padding:'10px 14px',marginBottom:18,fontSize:'0.7rem',color:'#888',lineHeight:1.6}}>
                💡 <strong style={{color:'#C9A84C'}}>Test Mode:</strong> Use card <code style={{color:'#C9A84C'}}>4111 1111 1111 1111</code>, any future date, any CVV
              </div>

              <button onClick={handlePay} className="btn-gold" style={{width:'100%',padding:'15px',fontSize:'0.72rem',letterSpacing:'0.25em'}}>
                <span>🔒 Pay ${amount} Now</span>
              </button>
              <button onClick={onClose} style={{width:'100%',marginTop:10,background:'none',border:'none',color:'#888',fontSize:'0.7rem',cursor:'none',padding:'8px',letterSpacing:'0.1em'}}>
                ← Go Back
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Booking() {
  const { ref } = useReveal();
  const [form, setForm] = useState({name:'',email:'',phone:'',service:'',barber:'',date:'',time:'',notes:''});
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [showPayment, setShowPayment] = useState(false);

  const handleChange = e => setForm({...form,[e.target.name]:e.target.value});
  const getPrice = () => { const f=services.find(s=>s.label===form.service); return f?f.price:0; };

  const handleSubmit = e => { e.preventDefault(); setShowPayment(true); };

  const handlePaymentSuccess = async () => {
    setShowPayment(false);
    setStatus('loading');
    try {
      await axios.post('/api/bookings',{...form,paymentStatus:'paid',amount:getPrice()});
      setStatus('success');
      setForm({name:'',email:'',phone:'',service:'',barber:'',date:'',time:'',notes:''});
    } catch(err) {
      setStatus('error');
      setErrorMsg(err.response?.data?.message||'Booking failed. Please try again.');
      setTimeout(()=>setStatus('idle'),4000);
    }
  };

  return (
    <section id="booking" style={{padding:'120px 0',background:'var(--dark)',position:'relative',overflow:'hidden'}}>
      {showPayment && <PaymentModal amount={getPrice()} onSuccess={handlePaymentSuccess} onClose={()=>setShowPayment(false)}/>}
      <div className="grid-bg" style={{position:'absolute',inset:0,opacity:0.5,pointerEvents:'none'}}/>
      <div style={{position:'absolute',right:'-5%',bottom:'-10%',width:'40%',height:'60%',background:'radial-gradient(ellipse,rgba(139,26,26,0.12) 0%,transparent 70%)',pointerEvents:'none'}}/>

      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16 reveal" ref={ref}>
          <span className="section-eyebrow">◈ Reserve Your Seat</span>
          <h2 className="font-serif" style={{fontSize:'clamp(2.5rem,5vw,4.5rem)',fontWeight:900}}>
            Book a <span className="gold-text">Session</span>
          </h2>
          <div className="section-divider"/>
          <p style={{color:'var(--gray)',maxWidth:460,margin:'0 auto',fontSize:'0.88rem',lineHeight:1.9}}>
            Secure your chair with one of our master barbers. Pay online and confirm your slot instantly.
          </p>
        </div>

        <div style={{background:'var(--dark-3)',border:'1px solid rgba(201,168,76,0.18)',padding:'clamp(30px,5vw,60px)',position:'relative'}}>
          <div style={{position:'absolute',top:0,left:0,width:40,height:40,borderTop:'2px solid var(--gold)',borderLeft:'2px solid var(--gold)'}}/>
          <div style={{position:'absolute',bottom:0,right:0,width:40,height:40,borderBottom:'2px solid var(--gold)',borderRight:'2px solid var(--gold)'}}/>

          {status==='success' ? <SuccessState/> : (
            <form onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <Field label="Full Name" name="name" value={form.name} onChange={handleChange} placeholder="John Doe" required/>
                <Field label="Email Address" name="email" type="email" value={form.email} onChange={handleChange} placeholder="john@example.com" required/>
              </div>
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <Field label="Phone Number" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210"/>
                <SelectField label="Service" name="service" value={form.service} onChange={handleChange} options={services.map(s=>s.label)} required/>
              </div>
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <SelectField label="Preferred Barber" name="barber" value={form.barber} onChange={handleChange} options={barbers}/>
                <Field label="Preferred Date" name="date" type="date" value={form.date} onChange={handleChange} required/>
                <SelectField label="Preferred Time" name="time" value={form.time} onChange={handleChange} options={times} required/>
              </div>
              <div className="mb-8">
                <label className="form-label">Special Requests (Optional)</label>
                <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Any special requests..." rows={3} className="form-input" style={{resize:'vertical',minHeight:80}}/>
              </div>

              {form.service && (
                <div style={{background:'rgba(201,168,76,0.06)',border:'1px solid rgba(201,168,76,0.2)',padding:'16px 20px',marginBottom:20,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div>
                    <div style={{fontSize:'0.65rem',color:'var(--gray)',letterSpacing:'0.15em',textTransform:'uppercase',marginBottom:4}}>Service Selected</div>
                    <div style={{fontSize:'0.85rem',color:'var(--cream)'}}>{form.service}</div>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <div style={{fontSize:'0.65rem',color:'var(--gray)',letterSpacing:'0.15em',textTransform:'uppercase',marginBottom:4}}>Total Amount</div>
                    <div className="font-display" style={{fontSize:'2.2rem',color:'var(--gold)',lineHeight:1}}>${getPrice()}</div>
                  </div>
                </div>
              )}

              {status==='error' && (
                <div style={{background:'rgba(139,26,26,0.2)',border:'1px solid rgba(139,26,26,0.5)',padding:'12px 18px',marginBottom:20,fontSize:'0.82rem',color:'#e06060'}}>
                  ⚠️ {errorMsg}
                </div>
              )}

              <button type="submit" className="btn-gold" disabled={status==='loading'} style={{width:'100%',padding:'18px',fontSize:'0.72rem',letterSpacing:'0.28em'}}>
                <span>{status==='loading'?'Confirming...':`💳 Proceed to Payment${form.service?` — $${getPrice()}`:''}`}</span>
              </button>
              <p style={{textAlign:'center',fontSize:'0.7rem',color:'var(--gray)',marginTop:18}}>
                🔒 Secure payment · Free cancellation 24+ hours in advance
              </p>
            </form>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-4 mt-8">
          {[['📍','Location','42 Crown Street, New York, NY 10001'],['📞','Phone','+1 (212) 555-BLADE'],['⏰','Hours','Mon–Fri 9AM–8PM, Sat 8AM–7PM']].map(([icon,label,val])=>(
            <div key={label} style={{background:'var(--dark-3)',border:'1px solid rgba(201,168,76,0.1)',padding:'20px 22px',display:'flex',gap:14,alignItems:'center'}}>
              <span style={{fontSize:'1.4rem'}}>{icon}</span>
              <div>
                <div style={{fontSize:'0.6rem',color:'var(--gold)',letterSpacing:'0.2em',textTransform:'uppercase',marginBottom:4}}>{label}</div>
                <div style={{fontSize:'0.78rem',color:'var(--gray)'}}>{val}</div>
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
    <div style={{textAlign:'center',padding:'40px 20px'}}>
      <div style={{fontSize:'5rem',marginBottom:22}}>🎉</div>
      <h3 className="font-serif" style={{fontSize:'2.2rem',fontWeight:900,color:'var(--gold)',marginBottom:14}}>Booked & Paid, Legend!</h3>
      <p style={{color:'var(--gray)',lineHeight:1.8,maxWidth:400,margin:'0 auto 28px'}}>Your appointment is confirmed and payment received. Check your email for the booking confirmation!</p>
      <div style={{height:1,background:'linear-gradient(90deg,transparent,var(--gold),transparent)',margin:'24px auto',width:'60%'}}/>
      <p style={{fontSize:'0.75rem',color:'var(--gray)'}}>Questions? Call us at <span style={{color:'var(--gold)'}}>+1 (212) 555-BLADE</span></p>
    </div>
  );
}

function Field({label,name,type='text',value,onChange,placeholder,required}) {
  return (
    <div>
      <label className="form-label">{label}</label>
      <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} required={required} className="form-input"/>
    </div>
  );
}

function SelectField({label,name,value,onChange,options,required}) {
  return (
    <div>
      <label className="form-label">{label}</label>
      <select name={name} value={value} onChange={onChange} required={required} className="form-input">
        <option value="">Select...</option>
        {options.map(o=><option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}