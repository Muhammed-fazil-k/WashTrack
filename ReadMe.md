# WashTrack - Carwash Ledger Management System

A comprehensive multi-tenant ledger management system designed for carwash companies with financial tracking, customer management, service tracking, and business analytics.

## 📖 Quick Links

- **[🚀 Startup Guide](STARTUP_GUIDE.md)** - Quick 3-step guide to start the app every time
- **[📋 Phase 1 Testing](PHASE1_TESTING.md)** - Complete testing checklist
- **[🎉 Phase 1 Summary](PHASE1_SUMMARY.md)** - What's been built in Phase 1
- **[📚 Development Roadmap](DEVELOPMENT_ROADMAP.md)** - Development phases and progress
- **[📝 Project Guidelines](CLAUDE.md)** - Complete project documentation

---

## 🚀 Quick Start Guide

### Prerequisites

Before running the application, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v13 or higher) - [Download](https://www.postgresql.org/download/)
- **npm** or **yarn** package manager

---

## 📦 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd WashTrack
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Edit .env file with your configuration
# REQUIRED: Update DB_PASSWORD, JWT_SECRET, JWT_REFRESH_SECRET
# OPTIONAL: Configure Twilio for SMS (if testing OTP features)
```

**Important Environment Variables:**
- `DB_PASSWORD` - Your PostgreSQL password
- `JWT_SECRET` - Strong secret key for JWT tokens
- `JWT_REFRESH_SECRET` - Strong secret key for refresh tokens
- `TWILIO_*` - Twilio credentials (optional for development)

### 3. Database Setup

```bash
# Create the database (run in PostgreSQL)
createdb washtrack_db

# Or using psql
psql -U postgres -c "CREATE DATABASE washtrack_db;"

# Run migrations (from backend directory)
npm run migrate

# (Optional) Seed database with sample data
npm run seed
```

### 4. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# The default configuration should work if backend runs on port 5000
```

---

## ▶️ Running the Application

### Complete Startup Sequence (Every Time)

Follow these steps each time you want to start the application:

#### **Step 1: Ensure PostgreSQL is Running**
```bash
# Check if PostgreSQL is running
pg_isready

# If not running, start PostgreSQL service
# macOS (Homebrew):
brew services start postgresql

# Linux (systemd):
sudo systemctl start postgresql

# Windows: Start PostgreSQL service from Services app
```

#### **Step 2: Start Backend Server**
Open Terminal 1:
```bash
# Navigate to backend directory
cd backend

# Start backend in development mode (with auto-reload)
npm run dev

# Wait for: "WashTrack Backend running on port 5000"
```

#### **Step 3: Start Frontend Application**
Open Terminal 2 (new terminal window):
```bash
# Navigate to frontend directory
cd frontend

# Start React development server
npm start

# Browser will automatically open at http://localhost:3000
```

### Quick Commands Reference

| Command | Description |
|---------|-------------|
| `cd backend && npm run dev` | Start backend server |
| `cd frontend && npm start` | Start frontend app |
| `cd backend && npm run migrate` | Run database migrations |
| `cd backend && npm run seed` | Seed sample data |

**Backend will run on:** `http://localhost:5000`
**Frontend will run on:** `http://localhost:3000`

---

## 👤 Default Login Credentials

After running the seed script, you can use:

**Super Admin:**
- Mobile: (Check seed.js for default mobile number)
- Role: super_admin

**Company Admin:**
- Mobile: (Check seed.js for default mobile number)
- Role: company_admin

**Worker:**
- Mobile: (Check seed.js for default mobile number)
- Role: worker

---

## 🏗️ Project Architecture

```
WashTrack/
├── backend/              # Node.js + Express API
│   ├── src/
│   │   ├── controllers/  # Request handlers
│   │   ├── models/       # Database models
│   │   ├── routes/       # API routes
│   │   ├── middleware/   # Auth, validation, etc.
│   │   ├── services/     # Business logic
│   │   └── utils/        # Helper functions
│   └── database/         # Migrations and seeds
│
├── frontend/             # React application
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API service layer
│   │   └── utils/        # Helper functions
│   └── public/           # Static assets
│
└── docs/                 # Documentation
```

---

## 🛠️ Tech Stack

**Backend:**
- Node.js + Express.js
- PostgreSQL
- JWT Authentication
- Twilio (OTP/SMS)

**Frontend:**
- React.js 18
- Material-UI (MUI)
- React Router v6
- Axios
- React Hook Form

---

## 📚 Development

### Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Database Commands

```bash
# Run migrations
cd backend
npm run migrate

# Seed database
npm run seed
```

---

## 🐛 Troubleshooting

### Port Already in Use

**Backend (Port 5000):**
```bash
# Find process using port 5000
lsof -ti:5000

# Kill the process
kill -9 $(lsof -ti:5000)
```

**Frontend (Port 3000):**
```bash
# Find process using port 3000
lsof -ti:3000

# Kill the process
kill -9 $(lsof -ti:3000)
```

### Database Connection Issues

- Verify PostgreSQL is running: `pg_isready`
- Check database exists: `psql -U postgres -l`
- Verify credentials in `backend/.env`

### Module Not Found Errors

```bash
# Reinstall dependencies
cd backend && npm install
cd frontend && npm install
```

---

## 📖 Documentation

- [CLAUDE.md](./CLAUDE.md) - Project overview and guidelines
- [DEVELOPMENT_ROADMAP.md](./DEVELOPMENT_ROADMAP.md) - Development phases and progress

---

## 🔒 Security Notes

- Never commit `.env` files to version control
- Update `JWT_SECRET` and `JWT_REFRESH_SECRET` with strong random strings
- Configure Twilio credentials for OTP in production
- Use HTTPS in production environment

---

## 📝 License

ISC

---

## 👥 User Roles

- **Super Admin** - System-wide access, manages all companies
- **Company Admin** - Full access to their company data
- **Worker** - Limited access for daily transaction entry

---

## 🤝 Contributing

See [CLAUDE.md](./CLAUDE.md) for development guidelines and code standards.
