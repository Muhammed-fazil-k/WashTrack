# Phase 1 Testing Checklist

## 🧪 Super Admin Features Testing

### Setup
- [ ] Database created (`washtrack_db`)
- [ ] Environment variables configured (backend/.env)
- [ ] Migrations run successfully (`npm run migrate`)
- [ ] Seed data loaded (`npm run seed`)
- [ ] Backend server running (port 5000)
- [ ] Frontend server running (port 3000)

### Authentication Flow
- [ ] Navigate to http://localhost:3000/login
- [ ] Enter Super Admin mobile: `+919999999999`
- [ ] OTP sent successfully (check terminal/logs for OTP in dev mode)
- [ ] Enter OTP and verify
- [ ] Redirects to Super Admin Dashboard
- [ ] JWT token stored in localStorage

### Company Management (CRUD)
- [ ] Dashboard shows statistics cards (companies, admins, workers, transactions)
- [ ] View existing companies in table
- [ ] Click "Add New Company" button
- [ ] Fill company form and submit
- [ ] New company appears in table
- [ ] Click Edit icon on a company
- [ ] Modify company details and save
- [ ] Changes reflected in table
- [ ] Click Delete icon
- [ ] Confirm deletion
- [ ] Company removed from table

### User Management
- [ ] Click "View Users" icon for a company
- [ ] Navigate to Company Users page
- [ ] See statistics cards (total users, admins, workers)
- [ ] View users in tabs (All/Admins/Workers)
- [ ] Click "Add User" button
- [ ] Fill registration form (name, mobile, role)
- [ ] Submit and verify user appears
- [ ] Click status chip to toggle active/inactive
- [ ] Status updates successfully
- [ ] Delete a user
- [ ] User removed from list

### Responsive Design
- [ ] Test on desktop (1920x1080)
- [ ] Test on tablet (768x1024)
- [ ] Test on mobile (375x667)
- [ ] All buttons and forms accessible
- [ ] Tables scroll horizontally on mobile
- [ ] Dialogs are fullscreen on mobile
- [ ] Navigation works on all devices

### Multi-Tenant Isolation
- [ ] Super Admin sees all companies
- [ ] Each company has separate users
- [ ] Users linked to correct company_id

### Logout
- [ ] Click Logout button
- [ ] Redirects to login page
- [ ] Cannot access dashboard without login

## ✅ Phase 1 Completion Criteria

All checkboxes above must pass before marking Phase 1 as complete.

## 🐛 Known Issues

(Document any issues found during testing)

## 📝 Notes

- For development, OTP is logged to console (check backend terminal)
- Default OTP expiry: 10 minutes
- Max OTP attempts: 5
