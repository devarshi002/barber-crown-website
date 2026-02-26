require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { body, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── DATA STORE ──────────────────────────────────────────────────────────────
const bookings = [];

// ─── MIDDLEWARE ──────────────────────────────────────────────────────────────
app.use(helmet());
app.use(morgan('dev'));
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── EMAIL CONFIGURATION ─────────────────────────────────────────────────────
// Create transporter once to reuse the connection pool
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 10000, // 10 seconds before failing
  socketTimeout: 10000,
});

// Verify email connection on startup
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  transporter.verify((error) => {
    if (error) console.error('❌ Email Config Error:', error.message);
    else console.log('📧 Email server is ready');
  });
}

async function sendEmail(to, subject, html) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('📧 Email not configured — skipping delivery');
    return;
  }

  try {
    await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME || 'Blade & Crown'}" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`✅ Email sent to ${to}`);
  } catch (err) {
    console.error('❌ Email error:', err.message);
  }
}

// ─── EMAIL TEMPLATES ──────────────────────────────────────────────────────────
const customerEmailHTML = (booking) => `
<div style="font-family:'Segoe UI',sans-serif;background:#0A0A0A;color:#F5EDD6;padding:40px;max-width:600px;margin:0 auto;">
  <div style="text-align:center;border-bottom:1px solid rgba(201,168,76,0.3);padding-bottom:30px;margin-bottom:30px;">
    <h1 style="font-size:2rem;letter-spacing:0.15em;color:#C9A84C;margin:0;">BLADE <span style="color:#555">&</span> CROWN</h1>
    <p style="color:#888;font-size:0.8rem;letter-spacing:0.2em;margin-top:8px;">PREMIUM BARBERSHOP</p>
  </div>
  <h2 style="color:#C9A84C;font-size:1.4rem;margin-bottom:8px;">You're Booked! 🎉</h2>
  <div style="background:#1A1A1A;border:1px solid rgba(201,168,76,0.2);padding:24px;margin-bottom:24px;">
    <table style="width:100%;border-collapse:collapse;">
      ${[['Booking ID', `#${booking.id.slice(0, 8).toUpperCase()}`], ['Name', booking.name], ['Service', booking.service], ['Barber', booking.barber || 'No Preference'], ['Date', booking.date], ['Time', booking.time], ['Amount', `$${booking.amount || '—'}`]].map(([k, v]) => `
        <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
          <td style="padding:10px 0;color:#888;font-size:0.82rem;width:40%;">${k}</td>
          <td style="padding:10px 0;color:#F5EDD6;font-size:0.88rem;font-weight:600;">${v}</td>
        </tr>`).join('')}
    </table>
  </div>
  <p style="color:#666;font-size:0.76rem;text-align:center;">📍 42 Crown Street, NY | 📞 +1 (212) 555-BLADE</p>
</div>`;

const ownerEmailHTML = (booking) => `
<div style="font-family:'Segoe UI',sans-serif;padding:30px;max-width:500px;">
  <h2 style="color:#C9A84C;">🗓️ New Booking Alert</h2>
  <p><strong>Client:</strong> ${booking.name} (${booking.email})</p>
  <p><strong>Service:</strong> ${booking.service}</p>
  <p><strong>Time:</strong> ${booking.date} at ${booking.time}</p>
</div>`;

const paymentConfirmEmailHTML = (booking) => `
<div style="font-family:'Segoe UI',sans-serif;background:#0A0A0A;color:#F5EDD6;padding:40px;max-width:600px;margin:0 auto;text-align:center;">
  <h1 style="color:#C9A84C;">Payment Confirmed</h1>
  <p>We received your payment of $${booking.amount}. See you soon!</p>
</div>`;

// ─── ROUTES ───────────────────────────────────────────────────────────────────

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', totalBookings: bookings.length });
});

app.get('/api/bookings', (req, res) => {
  res.json({ count: bookings.length, bookings });
});

app.post('/api/bookings',
  [
    body('name').trim().notEmpty(),
    body('email').isEmail().normalizeEmail(),
    body('service').notEmpty(),
    body('date').notEmpty(),
    body('time').notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    const { name, email, phone, service, barber, date, time, notes, amount, paymentStatus } = req.body;

    const booking = {
      id: uuidv4(),
      name, email, phone: phone || null,
      service, barber: barber || null,
      date, time, notes: notes || null,
      amount: amount ? Number(amount) : null,
      paymentStatus: paymentStatus || 'pending',
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    bookings.push(booking);

    // Run emails in background
    Promise.all([
      sendEmail(email, `✅ Booking Confirmed — Blade & Crown`, customerEmailHTML(booking)),
      process.env.BUSINESS_EMAIL ? sendEmail(process.env.BUSINESS_EMAIL, `🗓️ New Booking: ${name}`, ownerEmailHTML(booking)) : null
    ]).catch(err => console.error('Background Email Error:', err));

    res.status(201).json({ success: true, booking });
  }
);

app.patch('/api/bookings/:id/pay', (req, res) => {
  const booking = bookings.find(b => b.id === req.params.id);
  if (!booking) return res.status(404).json({ success: false, message: 'Not found' });

  booking.paymentStatus = 'paid';
  booking.paidAt = new Date().toISOString();

  sendEmail(booking.email, `💰 Payment Confirmed — Blade & Crown`, paymentConfirmEmailHTML(booking));

  res.json({ success: true, booking });
});

app.delete('/api/bookings/:id', (req, res) => {
  const idx = bookings.findIndex(b => b.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false });
  bookings.splice(idx, 1);
  res.json({ success: true });
});

app.get('/api/revenue', (req, res) => {
  const paid = bookings.filter(b => b.paymentStatus === 'paid');
  const total = paid.reduce((s, b) => s + (b.amount || 0), 0);
  res.json({ total, paidCount: paid.length });
});

app.get('/api/availability', (req, res) => {
  const { date } = req.query;
  const allSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];
  const bookedSlots = bookings.filter(b => b.date === date).map(b => b.time);
  res.json({ available: allSlots.filter(s => !bookedSlots.includes(s)) });
});

// Start Server
app.listen(PORT, () => {
  console.log(`\n🪒 Blade & Crown API → http://localhost:${PORT}\n`);
});