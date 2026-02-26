# ✂️ Blade & Crown — Premium Barber Shop Website

A full-stack, dark-themed barber shop website built with **React**, **Tailwind CSS**, and **Node.js/Express**.

![Dark Theme](https://img.shields.io/badge/theme-dark-black) ![React](https://img.shields.io/badge/React-18-blue) ![Node.js](https://img.shields.io/badge/Node.js-Express-green) ![Tailwind](https://img.shields.io/badge/Tailwind-CSS-teal)

---

## 🎨 Features

### Frontend (React + Tailwind CSS)
- ✅ **Custom gold cursor** with grow effect on hover
- ✅ **Scroll reveal animations** — every section fades up on scroll
- ✅ **Animated barber pole** (CSS stripe rotation)
- ✅ **Gold shimmer text** gradient animation
- ✅ **Floating ticker** with service names (auto-scrolling marquee)
- ✅ **Hero section** with stats, barber pole decoration, floating badge
- ✅ **Services section** — 6 services with hover card effects
- ✅ **About section** — quote box, timeline, perks grid
- ✅ **Team section** — 4 barbers with hover overlay + "Book Him" CTA
- ✅ **Gallery** — masonry-style grid with hover reveal
- ✅ **Testimonials** — auto-rotating carousel with dot navigation
- ✅ **Booking form** — full multi-field form with validation
- ✅ **Footer** — hours, contact, social links
- ✅ **Noise texture overlay** for premium feel
- ✅ **Responsive** — mobile menu + responsive layouts
- ✅ **Custom gold scrollbar**

### Backend (Node.js + Express)
- ✅ **POST /api/bookings** — Create and store bookings with validation
- ✅ **GET /api/bookings** — Retrieve all bookings
- ✅ **GET /api/availability** — Check available time slots for a date
- ✅ **DELETE /api/bookings/:id** — Cancel a booking
- ✅ **Email confirmations** — Auto-sends to customer + owner (via nodemailer)
- ✅ **Input validation** with express-validator
- ✅ **Security** — helmet, CORS, morgan logging

---

## 🚀 Quick Start

### Prerequisites
- Node.js v16+ 
- npm v8+

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Configure Environment (Optional — for emails)
```bash
cp server/.env.example server/.env
# Edit server/.env with your email credentials
```

### 3. Run Development Servers
```bash
npm run dev
```

This starts:
- **React client** → http://localhost:3000
- **Node server** → http://localhost:5000

---

## 📁 Project Structure

```
blade-crown/
├── client/                    # React frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx       # Sticky navbar with scroll tracking
│   │   │   ├── Hero.jsx         # Hero section with animations
│   │   │   ├── Ticker.jsx       # Scrolling marquee banner
│   │   │   ├── Services.jsx     # Services grid with cards
│   │   │   ├── About.jsx        # Philosophy + timeline
│   │   │   ├── Team.jsx         # Barber team cards
│   │   │   ├── Gallery.jsx      # Masonry gallery
│   │   │   ├── Testimonials.jsx # Auto-rotating testimonials
│   │   │   ├── Booking.jsx      # Booking form + API integration
│   │   │   └── Footer.jsx       # Footer
│   │   ├── hooks/
│   │   │   └── useReveal.js     # IntersectionObserver hook
│   │   ├── App.jsx              # Main app + cursor
│   │   ├── index.css            # Global styles + animations
│   │   └── index.js            # React entry
│   ├── tailwind.config.js
│   └── package.json
│
├── server/                    # Node.js backend
│   ├── index.js               # Express app + all routes
│   ├── .env.example
│   └── package.json
│
├── package.json               # Root — concurrently scripts
├── .gitignore
└── README.md
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/bookings` | List all bookings |
| POST | `/api/bookings` | Create new booking |
| GET | `/api/availability?date=` | Get open time slots |
| DELETE | `/api/bookings/:id` | Cancel a booking |

### POST /api/bookings — Request Body
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1 555-0000",
  "service": "Classic Cut — $35",
  "barber": "Marco Vitale",
  "date": "2024-12-20",
  "time": "2:00 PM",
  "notes": "First time client"
}
```

---

## 📧 Email Configuration

To enable booking confirmation emails:

1. Go to Google Account → Security → App Passwords
2. Generate an app password for "Mail"
3. Add to `server/.env`:
```env
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-16-char-app-password
BUSINESS_EMAIL=owner@yourshop.com
```

Without email config, the app works fine — bookings are stored in memory and confirmations are logged to console.

---

## 🏗️ Production Build

```bash
# Build React client
npm run build

# Start Node server (serves built React from /client/build)
npm start
```

---

## 🎨 Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Gold | `#C9A84C` | Primary accent, borders, text |
| Gold Light | `#E8C97A` | Shimmer highlight |
| Dark | `#0A0A0A` | Background |
| Dark 2 | `#111111` | Section alternates |
| Dark 3 | `#1A1A1A` | Cards |
| Cream | `#F5EDD6` | Primary text |
| Red | `#8B1A1A` | Atmospheric glows |

---

## 🔧 Customization

- **Colors** — Edit CSS variables in `client/src/index.css`
- **Services/Pricing** — Update `services` array in `Services.jsx`
- **Team Members** — Update `team` array in `Team.jsx`
- **Business Info** — Update address/phone in `Booking.jsx` and `Footer.jsx`
- **Database** — Replace in-memory `bookings[]` array in `server/index.js` with MongoDB/PostgreSQL

---

## 📄 License

MIT — Built with precision, just like our cuts. ✂️
