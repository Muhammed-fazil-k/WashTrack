-- Phase 0 Database Validation Queries
-- Run these queries to validate the database setup

-- 1. Check all tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
-- Expected: 13 tables

-- 2. Verify table structure for key tables
\d companies
\d users
\d otp_verifications
\d transactions

-- 3. Check foreign key relationships
SELECT
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
ORDER BY tc.table_name;

-- 4. Count records (if seeded)
SELECT 'companies' as table_name, COUNT(*) as count FROM companies
UNION ALL
SELECT 'users', COUNT(*) FROM users
UNION ALL
SELECT 'services', COUNT(*) FROM services
UNION ALL
SELECT 'expense_types', COUNT(*) FROM expense_types
UNION ALL
SELECT 'customers', COUNT(*) FROM customers;

-- 5. Verify user roles and multi-tenant setup
SELECT
  u.id,
  u.name,
  u.role,
  u.mobile_number,
  u.company_id,
  c.name as company_name
FROM users u
LEFT JOIN companies c ON u.company_id = c.id
ORDER BY u.role;
-- Expected: Super Admin with NULL company_id, others with valid company_id

-- 6. Check indexes
SELECT
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- 7. Verify constraints
SELECT
  tc.table_name,
  tc.constraint_name,
  tc.constraint_type,
  cc.check_clause
FROM information_schema.table_constraints tc
LEFT JOIN information_schema.check_constraints cc
  ON tc.constraint_name = cc.constraint_name
WHERE tc.table_schema = 'public'
ORDER BY tc.table_name, tc.constraint_type;

-- 8. Test updated_at trigger (update a record and check timestamp)
UPDATE companies SET name = name WHERE id = (SELECT id FROM companies LIMIT 1);
SELECT id, name, created_at, updated_at FROM companies;
-- updated_at should be newer than created_at

-- 9. Verify services for demo company
SELECT
  s.name,
  s.description,
  s.base_price,
  c.name as company_name
FROM services s
JOIN companies c ON s.company_id = c.id;

-- 10. Verify expense types for demo company
SELECT
  et.name,
  et.description,
  c.name as company_name
FROM expense_types et
JOIN companies c ON et.company_id = c.id;
