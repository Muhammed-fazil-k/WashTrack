# 🚀 WashTrack Startup Guide

## Every Time You Start Development

### Prerequisites Check
✅ PostgreSQL service is running
✅ Node.js is installed
✅ Dependencies are installed (if first time, run `npm install` in both folders)

---

## 3-Step Startup

### 1️⃣ Terminal 1: Backend
```bash
cd backend
npm run dev
```
✅ **Wait for:** `WashTrack Backend running on port 5000`

### 2️⃣ Terminal 2: Frontend
```bash
cd frontend
npm start
```
✅ **Wait for:** Browser opens at `http://localhost:3000`

### 3️⃣ Login
- Open: http://localhost:3000
- Use sample mobile numbers from seed data
- OTP will be shown in backend terminal (dev mode)

---

## Sample Login Credentials

| Role | Mobile Number | Description |
|------|---------------|-------------|
| **Super Admin** | `9999999999` | Full system access |
| **Company Admin** | `9111111111` | Sparkle Car Wash |
| **Company Admin** | `9222222222` | Premium Auto Spa |
| **Worker** | `9333333333` | Sparkle Car Wash |

**Note:** Enter only 10 digits. +91 is automatically added.

---

## First Time Setup Only

### 1. Install Dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### 2. Configure Environment
```bash
# Backend
cd backend
cp .env.example .env
# Edit .env and update DB_PASSWORD, JWT secrets
```

### 3. Setup Database
```bash
# Create database
createdb washtrack_db

# Run migrations
cd backend
npm run migrate

# Seed sample data
npm run seed
```

---

## Troubleshooting

### Port Already in Use?
```bash
# Kill process on port 5000 (backend)
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000 (frontend)
lsof -ti:3000 | xargs kill -9
```

### Database Connection Error?
```bash
# Check PostgreSQL is running
pg_isready

# Start PostgreSQL
brew services start postgresql  # macOS
```

### OTP Not Showing?
In development mode, OTP is printed in the **backend terminal**.
Check the console output after requesting OTP.

---

## URLs

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **Health Check:** http://localhost:5000/health

---

**💡 Tip:** Keep both terminals visible to monitor backend logs and frontend hot-reload.
