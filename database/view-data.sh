#!/bin/bash

# WashTrack Database Quick View Script
# Run this to view data in terminal with nice formatting

DB_NAME="washtrack_db"

echo "================================"
echo "  WashTrack Database Viewer"
echo "================================"
echo ""

# List all tables
echo "📋 All Tables:"
psql $DB_NAME -c "\dt" -x

echo ""
echo "================================"
echo ""

# View companies
echo "🏢 Companies:"
psql $DB_NAME -c "SELECT id, name, contact_number, city, subscription_status FROM companies;" -x

echo ""
echo "================================"
echo ""

# View users
echo "👥 Users:"
psql $DB_NAME -c "SELECT id, name, mobile_number, role, company_id, is_active FROM users ORDER BY role;" -x

echo ""
echo "================================"
echo ""

# View services
echo "🧼 Services:"
psql $DB_NAME -c "SELECT s.name, s.base_price, s.is_active, c.name as company_name FROM services s JOIN companies c ON s.company_id = c.id;" -x

echo ""
echo "================================"
echo ""

# View expense types
echo "💰 Expense Types:"
psql $DB_NAME -c "SELECT et.name, et.description, c.name as company_name FROM expense_types et JOIN companies c ON et.company_id = c.id;" -x

echo ""
echo "================================"
echo ""

# View customers
echo "👤 Customers:"
psql $DB_NAME -c "SELECT name, mobile_number, vehicle_number, vehicle_type FROM customers;" -x

echo ""
echo "================================"
echo ""

# Count records
echo "📊 Record Counts:"
psql $DB_NAME -c "
SELECT 'companies' as table_name, COUNT(*) as count FROM companies
UNION ALL SELECT 'users', COUNT(*) FROM users
UNION ALL SELECT 'services', COUNT(*) FROM services
UNION ALL SELECT 'expense_types', COUNT(*) FROM expense_types
UNION ALL SELECT 'customers', COUNT(*) FROM customers
UNION ALL SELECT 'transactions', COUNT(*) FROM transactions
UNION ALL SELECT 'expenses', COUNT(*) FROM expenses
ORDER BY table_name;"

echo ""
echo "================================"
echo "✅ Done! Install TablePlus for better viewing."
