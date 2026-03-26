# WashTrack - Carwash Ledger Software

## Project Overview

WashTrack is a comprehensive ledger management system designed specifically for carwash companies. It handles financial transactions, customer management, service tracking, employee management, and business analytics and it will be responsive


**Multi-Tenant Architecture**: The system supports multiple carwash companies with a Super Admin managing all companies. Each company operates independently with its own data and admin.

## Core Features

### 1. Financial Management
- Record daily income and expenses
- Track cash flow and payment methods (cash, card, upi)
- Track the pending amount
- Generate financial reports (daily, weekly, monthly, yearly)
- Profit and loss statements

### 2. Customer Management
- Customer database with contact information
- Service history tracking
- Loyalty programs and membership plans
- Customer notifications and reminders

### 3. Service Management
- Service catalog (basic wash, premium wash, detailing, etc.) - configurable by Company Admin
- Pricing management - editable by Company Admin
- Auto-populate service amount when selected, with option to edit
- Appointment scheduling - will implement later
- Queue management - will implement later

### 4. Employee Management
- Employee records and roles
- Attendance tracking
- Advance salary requests and tracking
- Overtime hours tracking
- Leave management (requests and approvals)
- Salary calculations including advances and overtime

### 5. Inventory Management
- Cleaning supplies and materials tracking
- Low stock alerts
- Supplier management
- Purchase order tracking

### 6. Analytics & Reporting
- Business performance dashboards
- Revenue trends and forecasts
- Customer retention metrics
- Service popularity analysis
- Employee performance reports

## Technology Stack

### Backend
- **Framework**: Node.js with Express.js (or specify your preference)
- **Database**: PostgreSQL for relational data
- **Authentication**: Mobile number + OTP based authentication with JWT tokens
- **OTP Service**: Integration with SMS provider (Twilio, AWS SNS, or similar)
- **API**: RESTful API design

### Frontend
- **Framework**: React.js (or specify: Vue.js, Angular, etc.)
- **UI Library**: Material-UI or Tailwind CSS
- **State Management**: Redux or Context API
- **Forms**: React Hook Form with validation

### Mobile (Optional)
- React Native for cross-platform mobile app
- Or Progressive Web App (PWA)

## Project Structure

```
WashTrack/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── services/
│   │   └── utils/
│   ├── config/
│   ├── tests/
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   └── App.js
│   ├── public/
│   └── package.json
├── database/
│   ├── migrations/
│   └── seeds/
├── docs/
└── CLAUDE.md
```

## Database Schema (Preliminary)

### Core Tables

#### Multi-Tenant Structure
- **companies**: Carwash company details (name, location, contact, subscription info)
- **users**: All system users (Super Admin, Company Admins, Workers)
  - Links to company_id for multi-tenant isolation
  - Mobile number as primary authentication identifier
  - Role field (super_admin, company_admin, worker)

#### Business Operations
- **customers**: Customer information with company_id for isolation
- **services**: Available wash services per company (configurable by Company Admin)
- **expense_types**: Configurable expense categories per company
- **transactions**: Financial transactions for services
  - Links to customer, service, company
  - Payment method (cash, card, UPI)
  - Amount paid and pending amount
  - Created by (worker who recorded it)
- **expenses**: Business expense records
  - Links to expense_type and company
  - Amount, date, description
- **inventory**: Supplies and materials per company
- **purchase_orders**: Supplier purchase tracking

#### Employee Management
- **employee_attendance**: Daily attendance records
- **employee_advances**: Advance salary requests and approvals
- **employee_overtime**: Overtime hours tracking
- **employee_leaves**: Leave requests and approvals

## Development Guidelines

### Code Standards
- Use ES6+ features and async/await for asynchronous operations
- Follow RESTful API conventions
- Implement proper error handling with meaningful error messages
- Write descriptive variable and function names
- Add comments for complex business logic

### Security Requirements
- Validate all user inputs
- Use parameterized queries to prevent SQL injection
- Implement rate limiting on API endpoints (especially OTP generation)
- Secure OTP storage and validation
- Use HTTPS in production
- Implement role-based access control (RBAC)
- Multi-tenant data isolation (ensure users only access their company's data)

### Testing
- Write unit tests for business logic
- Integration tests for API endpoints
- End-to-end tests for critical user flows
- Target minimum 70% code coverage

### Git Workflow
- Use feature branches (feature/feature-name)
- Write clear, descriptive commit messages
- Create pull requests for code review
- Keep commits atomic and focused

## API Design Principles

- Use consistent naming conventions
- Version your API (e.g., `/api/v1/`)
- Return appropriate HTTP status codes
- Include pagination for list endpoints
- Implement filtering and sorting capabilities
- Use proper HTTP methods (GET, POST, PUT, DELETE, PATCH)

## User Roles

### 1. Super Admin (System Level)
- **Access**: Full system access across all companies
- **Capabilities**:
  - Onboard new carwash companies
  - Register company admins (mobile number)
  - Register workers for each company (mobile number)
  - View complete information for all companies
  - System-wide analytics and monitoring
  - Manage subscriptions and billing

### 2. Company Admin (Company Level)
- **Access**: Full access to their company's data only
- **Capabilities**:
  - Configure services (name, description, pricing)
  - Configure expense types
  - Manage workers for their company
  - View all transactions and financial reports
  - Manage customers
  - Approve employee advances, overtime, and leaves
  - View company analytics and reports
  - Manage inventory

### 3. Worker (Entry Level)
- **Access**: Limited to data entry for their company
- **Capabilities**:
  - Add service transactions (select service, amount auto-populates but is editable)
  - Record customer payments (cash, card, UPI)
  - Track pending amounts for customers
  - Add expense entries
  - Request advance salary
  - Record overtime hours
  - Submit leave requests
  - View their own performance data

## Authentication System

### Mobile Number + OTP Authentication
- Primary authentication method: Mobile number with OTP verification
- No traditional username/password system
- OTP generation and validation with expiry (5-10 minutes)
- JWT tokens issued after successful OTP verification
- Session management with refresh tokens

### OTP Flow
1. User enters mobile number
2. System generates and sends OTP via SMS
3. User enters OTP
4. System validates OTP and issues JWT token
5. Token used for subsequent API requests

### Security Considerations
- Rate limiting on OTP requests to prevent abuse
- OTP attempt limits (max 3-5 attempts)
- Block mobile numbers after repeated failed attempts
- Secure OTP storage (hashed in database)
- Token expiration and refresh mechanism

## Deployment Considerations

- Use environment variables for configuration
- Implement logging for debugging and monitoring
- Set up automated backups for database
- Configure CI/CD pipeline
- Use Docker for containerization

## Next Steps

1. Set up project structure (backend and frontend folders)
2. Initialize package.json and install dependencies
3. Set up database and create initial schema
4. Implement authentication system
5. Build core API endpoints
6. Develop frontend interface
7. Integrate frontend with backend
8. Add testing suite
9. Deploy to staging environment

## Development Tracking

**IMPORTANT**: Use `DEVELOPMENT_ROADMAP.md` to track development progress through all phases.
- Follow the phased approach: Phase 0 (Foundation) → Phase 1 (Super Admin) → Phase 2 (Company Admin) → Phase 3 (Worker) → Phase 4 (Analytics)
- Complete each phase's checkpoint before moving to the next
- Update the roadmap file as features are completed

## Notes for AI Assistant

- **Multi-Tenant Architecture**: Every query must filter by company_id (except Super Admin viewing all)
- **Data Isolation**: Critical security requirement - workers and admins can only access their company's data
- **Authentication**: Mobile + OTP only, no passwords
- **Transaction Entry**: Service selection auto-populates amount, but worker can edit if needed
- **Payment Tracking**: Support partial payments with pending amount tracking
- **Employee Salary**: Track advances, overtime, and leaves for accurate salary calculation
- Always prioritize data security and validation
- Keep the UI simple and intuitive for non-technical users
- Focus on fast transaction processing as this is time-sensitive
- Consider receipt printing integration
- Plan for mobile responsiveness from the start
- Worker interface should be extremely simple (optimized for quick data entry)
