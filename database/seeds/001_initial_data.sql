-- Seed Data for WashTrack
-- Creates initial Super Admin and sample data

-- Insert Super Admin (will need to be created first)
INSERT INTO users (id, mobile_number, name, email, role, company_id, is_active)
VALUES
  ('11111111-1111-1111-1111-111111111111', '+919999999999', 'Super Admin', 'superadmin@washtrack.com', 'super_admin', NULL, true);

-- Sample Company (for testing)
INSERT INTO companies (id, name, contact_number, email, address, city, state, pincode, subscription_status)
VALUES
  ('22222222-2222-2222-2222-222222222222', 'SparkleWash Demo', '+919876543210', 'demo@sparklewash.com', '123 Main Street', 'Mumbai', 'Maharashtra', '400001', 'active');

-- Sample Company Admin
INSERT INTO users (id, mobile_number, name, email, role, company_id, is_active)
VALUES
  ('33333333-3333-3333-3333-333333333333', '+919876543211', 'Demo Admin', 'admin@sparklewash.com', 'company_admin', '22222222-2222-2222-2222-222222222222', true);

-- Sample Worker
INSERT INTO users (id, mobile_number, name, email, role, company_id, is_active)
VALUES
  ('44444444-4444-4444-4444-444444444444', '+919876543212', 'Demo Worker', 'worker@sparklewash.com', 'worker', '22222222-2222-2222-2222-222222222222', true);

-- Sample Services for Demo Company
INSERT INTO services (company_id, name, description, base_price)
VALUES
  ('22222222-2222-2222-2222-222222222222', 'Basic Wash', 'Exterior wash with foam', 200.00),
  ('22222222-2222-2222-2222-222222222222', 'Premium Wash', 'Exterior + Interior cleaning', 400.00),
  ('22222222-2222-2222-2222-222222222222', 'Full Detailing', 'Complete car detailing with wax', 1500.00),
  ('22222222-2222-2222-2222-222222222222', 'Bike Wash', 'Two-wheeler wash', 100.00);

-- Sample Expense Types for Demo Company
INSERT INTO expense_types (company_id, name, description)
VALUES
  ('22222222-2222-2222-2222-222222222222', 'Cleaning Supplies', 'Soaps, shampoos, waxes, etc.'),
  ('22222222-2222-2222-2222-222222222222', 'Utilities', 'Water, electricity bills'),
  ('22222222-2222-2222-2222-222222222222', 'Staff Salaries', 'Employee wages and benefits'),
  ('22222222-2222-2222-2222-222222222222', 'Equipment Maintenance', 'Repairs and maintenance'),
  ('22222222-2222-2222-2222-222222222222', 'Rent', 'Property rent');

-- Sample Customer
INSERT INTO customers (company_id, name, mobile_number, vehicle_number, vehicle_type)
VALUES
  ('22222222-2222-2222-2222-222222222222', 'John Doe', '+919876543220', 'MH01AB1234', 'car');
