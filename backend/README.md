# WashTrack Backend

Backend API for WashTrack - Carwash Ledger Management System

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your database and Twilio credentials
```

3. Set up PostgreSQL database:
```bash
# Create database
createdb washtrack_db

# Run migrations
npm run migrate

# (Optional) Seed sample data
npm run seed
```

4. Start the server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/request-otp` - Request OTP for mobile number
- `POST /api/v1/auth/verify-otp` - Verify OTP and login
- `POST /api/v1/auth/refresh-token` - Refresh access token

## Environment Variables

See `.env.example` for all required environment variables.

## Testing

```bash
npm test
```

## Project Structure

```
backend/
├── src/
│   ├── controllers/    # Request handlers
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── middleware/     # Express middleware
│   ├── services/       # Business logic
│   └── utils/          # Helper utilities
├── config/             # Configuration files
└── tests/              # Test files
```
