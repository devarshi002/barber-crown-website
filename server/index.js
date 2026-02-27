require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { body, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;

const bookings = [];

app.use(helmet());
app.use(morgan('dev'));
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Send Email via Brevo HTTP API (No SMTP — works on Render free plan) ──────
async function sendEmail(to, subject, html) {
  if (!process.env.BREVO_API_KEY) {
    console.log('📧 Brevo API key not configured — skipping email');
    console.log(`   To: ${to} | Subject: ${subject}`);
    return;
  }
  try {
    const https = require('https');
    const payload = JSON.stringify({
      sender: { name: 'Blade & Crown', email: process.env.SENDER_EMAIL },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    });
    await new Promise((resolve, reject) => {
      const req = https.request({
        hostname: 'api.brevo.com',
        path: '/v3/smtp/email',
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': process.env.BREVO_API_KEY,
          'content-type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
        },
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            console.log(`✅ Email sent to ${to}`);
            resolve(data);
          } else {
            console.error(`❌ Brevo error ${res.statusCode}:`, data);
            reject(new Error(data));
          }
        });
      });
      req.on('error', reject);
      req.write(payload);
      req.end();
    });
  } catch (err) {
    console.error('❌ Email error:', err.message);
  }
}

// ─── Email Templates ──────────────────────────────────────────────────────────
function customerEmailHTML(booking) {
  return `<div style="font-family:'Segoe UI',sans-serif;background:#0A0A0A;color:#F5EDD6;padding:40px;max-width:600px;margin:0 auto;">
    <div style="text-align:center;border-bottom:1px solid rgba(201,168,76,0.3);padding-bottom:30px;margin-bottom:30px;">
      <h1 style="font-size:2rem;letter-spacing:0.15em;color:#C9A84C;margin:0;">BLADE <span style="color:#555">&</span> CROWN</h1>
      <p style="color:#888;font-size:0.8rem;letter-spacing:0.2em;margin-top:8px;">PREMIUM BARBERSHOP</p>
    </div>
    <h2 style="color:#C9A84C;font-size:1.4rem;margin-bottom:8px;">You're Booked! 🎉</h2>
    <p style="color:#aaa;margin-bottom:28px;">Here's a summary of your upcoming appointment:</p>
    <div style="background:#1A1A1A;border:1px solid rgba(201,168,76,0.2);padding:24px;margin-bottom:24px;">
      <table style="width:100%;border-collapse:collapse;">
        ${[['Booking ID',`#${booking.id.slice(0,8).toUpperCase()}`],['Name',booking.name],['Service',booking.service],['Barber',booking.barber||'No Preference'],['Date',booking.date],['Time',booking.time],['Amount',`$${booking.amount||'—'}`]].map(([k,v])=>`<tr style="border-bottom:1px solid rgba(255,255,255,0.05);"><td style="padding:10px 0;color:#888;font-size:0.82rem;width:40%;">${k}</td><td style="padding:10px 0;color:#F5EDD6;font-size:0.88rem;font-weight:600;">${v}</td></tr>`).join('')}
      </table>
    </div>
    ${booking.notes?`<div style="background:#160e0e;border:1px solid rgba(139,26,26,0.3);padding:16px 20px;margin-bottom:24px;"><strong style="color:#C9A84C;font-size:0.8rem;">Your Notes:</strong><p style="color:#aaa;margin:6px 0 0;font-size:0.84rem;">${booking.notes}</p></div>`:''}
    <div style="background:#1A1A1A;border:1px solid rgba(201,168,76,0.1);padding:20px;text-align:center;margin-bottom:28px;">
      <p style="color:#888;font-size:0.8rem;margin:0 0 8px;">📍 42 Crown Street, New York, NY 10001</p>
      <p style="color:#888;font-size:0.8rem;margin:0;">📞 +1 (212) 555-BLADE</p>
    </div>
    <p style="color:#666;font-size:0.76rem;text-align:center;line-height:1.7;">Free cancellation up to 24 hours before your appointment.</p>
    <div style="text-align:center;margin-top:30px;padding-top:24px;border-top:1px solid rgba(201,168,76,0.1);">
      <p style="color:#444;font-size:0.7rem;letter-spacing:0.15em;">© ${new Date().getFullYear()} BLADE & CROWN · EST. 1998</p>
    </div>
  </div>`;
}

function ownerEmailHTML(booking) {
  return `<div style="font-family:'Segoe UI',sans-serif;padding:30px;max-width:500px;">
    <h2 style="color:#C9A84C;">🗓️ New Booking — #${booking.id.slice(0,8).toUpperCase()}</h2>
    <table style="width:100%;border-collapse:collapse;margin-top:16px;">
      ${Object.entries({'Client':booking.name,'Email':booking.email,'Phone':booking.phone||'—','Service':booking.service,'Barber':booking.barber||'No Preference','Date':booking.date,'Time':booking.time,'Amount':`$${booking.amount||'—'}`,'Payment':booking.paymentStatus||'pending','Notes':booking.notes||'—','Booked At':new Date(booking.createdAt).toLocaleString()}).map(([k,v])=>`<tr style="border-bottom:1px solid #eee;"><td style="padding:8px 0;color:#888;font-size:0.82rem;width:40%;"><b>${k}</b></td><td style="padding:8px 0;font-size:0.88rem;">${v}</td></tr>`).join('')}
    </table>
  </div>`;
}

function paymentConfirmEmailHTML(booking) {
  return `<div style="font-family:'Segoe UI',sans-serif;background:#0A0A0A;color:#F5EDD6;padding:40px;max-width:600px;margin:0 auto;">
    <div style="text-align:center;border-bottom:1px solid rgba(201,168,76,0.3);padding-bottom:30px;margin-bottom:30px;">
      <h1 style="font-size:2rem;letter-spacing:0.15em;color:#C9A84C;margin:0;">BLADE <span style="color:#555">&</span> CROWN</h1>
      <p style="color:#888;font-size:0.8rem;letter-spacing:0.2em;margin-top:8px;">PREMIUM BARBERSHOP</p>
    </div>
    <div style="text-align:center;margin-bottom:28px;">
      <div style="font-size:3rem;margin-bottom:12px;">💰</div>
      <h2 style="color:#2ecc71;font-size:1.5rem;margin-bottom:8px;">Payment Confirmed!</h2>
      <p style="color:#aaa;font-size:0.88rem;">Your payment of <strong style="color:#C9A84C;">$${booking.amount}</strong> has been received by our team.</p>
    </div>
    <div style="background:#1A1A1A;border:1px solid rgba(46,204,113,0.2);padding:24px;margin-bottom:24px;">
      <table style="width:100%;border-collapse:collapse;">
        ${[['Booking ID',`#${booking.id.slice(0,8).toUpperCase()}`],['Name',booking.name],['Service',booking.service],['Barber',booking.barber||'No Preference'],['Date',booking.date],['Time',booking.time],['Amount Paid',`$${booking.amount}`],['Status','✅ Payment Confirmed']].map(([k,v])=>`<tr style="border-bottom:1px solid rgba(255,255,255,0.05);"><td style="padding:10px 0;color:#888;font-size:0.82rem;width:40%;">${k}</td><td style="padding:10px 0;color:#F5EDD6;font-size:0.88rem;font-weight:600;">${v}</td></tr>`).join('')}
      </table>
    </div>
    <div style="background:#1A1A1A;border:1px solid rgba(201,168,76,0.1);padding:20px;text-align:center;margin-bottom:28px;">
      <p style="color:#888;font-size:0.8rem;margin:0 0 8px;">📍 42 Crown Street, New York, NY 10001</p>
      <p style="color:#888;font-size:0.8rem;margin:0;">📞 +1 (212) 555-BLADE</p>
    </div>
    <div style="text-align:center;margin-top:30px;padding-top:24px;border-top:1px solid rgba(201,168,76,0.1);">
      <p style="color:#444;font-size:0.7rem;letter-spacing:0.15em;">© ${new Date().getFullYear()} BLADE & CROWN · EST. 1998</p>
    </div>
  </div>`;
}

// ─── ROUTES ───────────────────────────────────────────────────────────────────

// Health check
app.get('/api/health', (req, res) => {
  const totalRevenue = bookings.filter(b=>b.paymentStatus==='paid').reduce((s,b)=>s+(b.amount||0),0);
  res.json({ status:'ok', service:'Blade & Crown API', timestamp:new Date().toISOString(), totalBookings:bookings.length, totalRevenue });
});

// Get all bookings
app.get('/api/bookings', (req, res) => {
  res.json({ count: bookings.length, bookings });
});

// Create booking
app.post('/api/bookings',
  [
    body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
    body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('service').trim().notEmpty().withMessage('Please select a service'),
    body('date').notEmpty().withMessage('Please select a date'),
    body('time').notEmpty().withMessage('Please select a time'),
    body('phone').optional().trim(),
    body('notes').optional().trim().isLength({ max: 500 }),
    body('barber').optional().trim(),
    body('amount').optional().isNumeric(),
    body('paymentStatus').optional().trim(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success:false, message:errors.array()[0].msg, errors:errors.array() });
    }

    const { name, email, phone, service, barber, date, time, notes, amount, paymentStatus } = req.body;

    const bookingDate = new Date(date);
    const today = new Date(); today.setHours(0,0,0,0);
    if (bookingDate < today) {
      return res.status(400).json({ success:false, message:'Booking date cannot be in the past.' });
    }

    const booking = {
      id: uuidv4(),
      name, email,
      phone: phone || null,
      service,
      barber: barber || null,
      date, time,
      notes: notes || null,
      amount: amount ? Number(amount) : null,
      paymentStatus: paymentStatus || 'pending',
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    bookings.push(booking);

    console.log(`\n📋 New Booking: ${booking.id}`);
    console.log(`   Client  : ${name} <${email}>`);
    console.log(`   Service : ${service} | ${date} at ${time}`);
    console.log(`   Barber  : ${barber || 'No Preference'}`);
    console.log(`   Amount  : $${amount||'—'} | Payment: ${booking.paymentStatus}\n`);

    Promise.all([
      sendEmail(email, `✅ Booking Confirmed — Blade & Crown`, customerEmailHTML(booking)),
      process.env.BUSINESS_EMAIL
        ? sendEmail(process.env.BUSINESS_EMAIL, `🗓️ New Booking: ${name} — ${service}`, ownerEmailHTML(booking))
        : Promise.resolve(),
    ]).catch(console.error);

    res.status(201).json({
      success: true,
      message: 'Booking confirmed successfully!',
      booking: { id:booking.id, name, service, date, time, amount:booking.amount, paymentStatus:booking.paymentStatus, status:booking.status, createdAt:booking.createdAt },
    });
  }
);

// ─── Mark booking as PAID ─────────────────────────────────────────────────────
app.patch('/api/bookings/:id/pay', (req, res) => {
  const booking = bookings.find(b => b.id === req.params.id);
  if (!booking) return res.status(404).json({ success:false, message:'Booking not found' });
  if (booking.paymentStatus === 'paid') return res.status(400).json({ success:false, message:'Already marked as paid' });

  booking.paymentStatus = 'paid';
  booking.paidAt = new Date().toISOString();

  console.log(`\n💰 Payment Marked!`);
  console.log(`   Client  : ${booking.name}`);
  console.log(`   Service : ${booking.service}`);
  console.log(`   Barber  : ${booking.barber || 'No Preference'}`);
  console.log(`   Amount  : $${booking.amount}`);
  console.log(`   Paid At : ${booking.paidAt}\n`);

  // Send payment confirmation email to customer
  if (booking.email && booking.email !== '***') {
    sendEmail(booking.email, `💰 Payment Confirmed — Blade & Crown`, paymentConfirmEmailHTML(booking)).catch(console.error);
  }

  res.json({ success:true, message:`Payment of $${booking.amount} confirmed for ${booking.name}`, booking });
});

// ─── Cancel / delete booking ──────────────────────────────────────────────────
app.delete('/api/bookings/:id', (req, res) => {
  const idx = bookings.findIndex(b => b.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success:false, message:'Booking not found' });
  const cancelled = bookings.splice(idx, 1)[0];
  console.log(`\n🗑️  Cancelled: ${cancelled.name} — ${cancelled.service}\n`);
  res.json({ success:true, message:'Booking cancelled', id:cancelled.id });
});

// ─── Revenue summary ──────────────────────────────────────────────────────────
app.get('/api/revenue', (req, res) => {
  const paid = bookings.filter(b => b.paymentStatus === 'paid');
  const total = paid.reduce((s,b) => s+(b.amount||0), 0);
  const byBarber = {};
  const byService = {};
  paid.forEach(b => {
    const barber = b.barber || 'No Preference';
    byBarber[barber] = (byBarber[barber]||0) + (b.amount||0);
    const svc = b.service?.split(' — ')[0] || b.service;
    byService[svc] = (byService[svc]||0) + (b.amount||0);
  });
  res.json({ total, paidCount:paid.length, pendingCount:bookings.filter(b=>b.paymentStatus!=='paid').length, byBarber, byService });
});

// ─── Availability ─────────────────────────────────────────────────────────────
app.get('/api/availability', (req, res) => {
  const { date } = req.query;
  if (!date) return res.status(400).json({ message:'Date is required' });
  const allSlots = ['9:00 AM','9:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM','12:00 PM','1:00 PM','1:30 PM','2:00 PM','2:30 PM','3:00 PM','3:30 PM','4:00 PM','4:30 PM','5:00 PM','5:30 PM','6:00 PM','6:30 PM','7:00 PM'];
  const bookedSlots = bookings.filter(b => b.date === date).map(b => b.time);
  res.json({ date, available:allSlots.filter(s=>!bookedSlots.includes(s)), booked:bookedSlots });
});

// 404
app.use((req, res) => res.status(404).json({ message:'Route not found' }));

// Error
app.use((err, req, res, next) => { console.error(err.stack); res.status(500).json({ message:'Internal server error' }); });

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🪒  Blade & Crown API → http://localhost:${PORT}`);
  console.log(`\n📋  Endpoints:`);
  console.log(`    GET    /api/health`);
  console.log(`    GET    /api/bookings`);
  console.log(`    POST   /api/bookings`);
  console.log(`    PATCH  /api/bookings/:id/pay   ← NEW: Mark as Paid`);
  console.log(`    DELETE /api/bookings/:id`);
  console.log(`    GET    /api/revenue             ← NEW: Revenue Summary`);
  console.log(`    GET    /api/availability?date=YYYY-MM-DD\n`);
});