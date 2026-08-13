# QueueIt — Real-Time Virtual Queue Management System

QueueIt is a modern, full-stack real-time virtual queue management system built with **React 19**, **Vite**, **TailwindCSS**, **Node.js**, **Express**, **MongoDB**, **Socket.io**, and **Web Push Notifications**.

It enables customers to join virtual waiting lines at restaurants, clinics, gyms, libraries, and service counters, while giving venue staff real-time controls to manage queues, call next customers, issue walk-in tickets, and analyze operational performance.

---

## 🚀 Key Features

### 👤 Customer Experience
- **Browse Venues & Categories**: Search venues by name, category, or location with real-time queue length & ETA previews.
- **Counter Queue Selection**: Choose specific counter lines (e.g., Veg, Non-Veg, Beverages, OPD).
- **Live Ticket Tracker**: Dynamic position progress bar, instant updates via Socket.io, Web Push notifications, and Web Audio API chime alerts.
- **Counter Check-in QR Code**: Digital validation QR code generator for seamless counter verification.
- **Queue Flexibility**: "I'm Late" option to move to the back of the line without losing session, or "Leave Queue" option.

### 🛡️ Admin & Control Room
- **Multi-Counter Live Monitor**: View queue depth and current serving tokens across all venue counters.
- **Staff Control Dashboard**: One-click actions to call next customer, skip, complete, pause/resume counters, or search active tickets.
- **Walk-in Guest Ticketing**: Issue walk-in tokens with customizable party sizes and printable thermal receipt previews.
- **QR Ticket Scanner**: Modal scanner to validate guest QR codes at the counter.

### 📊 Platform Management & Analytics
- **SuperAdmin Panel**: Manage venue inventory, staff role assignments, operating hours, and counter taxonomy.
- **Analytics Dashboard**: Monitor peak hour throughput, average wait times, counter efficiency, and export reporting metrics.
- **Venue Settings**: Configure operational rules, counter capacity limits, and notification preferences.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 19 + Vite 8
- **Styling**: TailwindCSS + Framer Motion (Glassmorphism & dark themes)
- **Icons**: Lucide React
- **State & Routing**: React Router v7 + React Context API
- **Real-Time & API**: Socket.io-client + Axios + React Hot Toast

### Backend
- **Server**: Node.js + Express
- **Database**: MongoDB + Mongoose Schema ODM
- **Real-Time Communication**: Socket.io (WebSocket with polling fallback)
- **Authentication**: JWT (JSON Web Tokens) + Bcryptjs
- **Push Notifications**: Web-Push VAPID Protocol

---

## 📁 Repository Structure

```
queueit-frontend/
├── public/                 # PWA icons & Web Manifest
├── server/                 # Express Backend API
│   ├── src/
│   │   ├── config/        # Database connection config
│   │   ├── controllers/   # Auth, Venue, Ticket & Analytics controllers
│   │   ├── middleware/    # JWT Authentication & role authorization
│   │   ├── models/        # Mongoose Data Models (User, Venue, Counter, Ticket)
│   │   ├── routes/        # Express API endpoints
│   │   ├── utils/         # Database seed scripts & helpers
│   │   ├── app.js         # Express app middleware & CORS setup
│   │   └── server.js      # Server entry point & Socket.io initialization
│   ├── .env               # Backend environment variables
│   └── package.json
├── src/                    # React Frontend
│   ├── components/        # Admin, Queue, Layout, Common & Auth components
│   ├── context/           # AuthContext & ThemeContext providers
│   ├── data/              # Fallback mock venue data
│   ├── pages/             # Route pages (Home, QueueJoin, LiveStatus, Admin, SuperAdmin, Analytics)
│   ├── routes/            # AppRouter & ProtectedRoute guards
│   ├── services/          # Axios API instance, Socket.io client & Notification services
│   ├── App.jsx            # Main React component
│   └── main.jsx           # Vite mounting script
├── .env                    # Frontend environment variables
├── vercel.json             # Vercel SPA routing configuration
├── vite.config.js          # Vite build & PWA plugin setup
└── package.json            # Root frontend dependencies & scripts
```

---

## ⚡ Quick Start & Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB instance (local or MongoDB Atlas cluster)

### 1. Clone Repository & Install Dependencies
```bash
git clone https://github.com/Requiem-1/queuelt-app.git
cd queuelt-app

# Install Root / Frontend dependencies
npm install

# Install Server dependencies
cd server
npm install
cd ..
```

### 2. Environment Setup
#### Root `.env` (Frontend):
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_SOCKET_URL=http://localhost:5000
```

#### Server `.env` (`server/.env`):
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/queueit?retryWrites=true&w=majority
JWT_SECRET=super_secret_jwt_key
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### 3. Seed Initial Database Data
```bash
npm run seed --prefix server
```

### 4. Start Development Servers
Run both frontend and backend concurrently:
```bash
npm run dev
```
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000/api/v1`

---

## 🔒 Demo Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin User** | `admin@queueit.app` | `admin123` |
| **Super Admin** | `superadmin@queueit.app` | `superadmin123` |
| **Guest User** | *Quick Guest button on Login page* | N/A |

---

## 🧪 Build & Code Quality Commands

```bash
# Run ESLint check
npm run lint

# Build production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 🌐 Deployment

- **Frontend Deployment (Vercel)**: Configured with `vercel.json` for single-page routing rewrite rules.
- **Backend Deployment (Render / Railway / Heroku)**: Can be deployed as a Web Service running `node server/src/server.js`.
