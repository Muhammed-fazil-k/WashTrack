# WashTrack Frontend

Frontend application for WashTrack - Carwash Ledger Management System

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
# Edit .env if your backend runs on a different URL
```

3. Start the development server:
```bash
npm start
```

The app will open at http://localhost:3000

## Features (Phase 1)

### Super Admin
- Login with mobile number + OTP
- View all companies dashboard
- Add/Edit/Delete companies
- Register Company Admins and Workers
- View company statistics

## Project Structure

```
frontend/src/
├── components/
│   └── ProtectedRoute.js       # Route protection component
├── pages/
│   ├── Login.js                # OTP-based login
│   └── SuperAdmin/
│       ├── Dashboard.js        # Companies dashboard
│       └── CompanyUsers.js     # User management
├── services/
│   ├── api.js                  # Axios instance with interceptors
│   ├── auth.service.js         # Authentication methods
│   ├── company.service.js      # Company API calls
│   └── user.service.js         # User API calls
├── App.js                      # Main app with routing
└── index.js                    # Entry point
```

## Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests

## Environment Variables

- `REACT_APP_API_URL` - Backend API URL (default: http://localhost:5000/api/v1)

## Testing Phase 1

1. Start backend: `cd backend && npm run dev`
2. Start frontend: `cd frontend && npm start`
3. Login with Super Admin credentials:
   - Mobile: +919999999999
   - Request OTP (check backend console)
   - Enter OTP to login
4. Test company management and user registration
