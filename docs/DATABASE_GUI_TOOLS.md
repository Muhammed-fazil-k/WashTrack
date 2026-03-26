# WashTrack Database GUI Tools Setup

## Recommended GUI Tools for Viewing Database

### 🏆 TablePlus (Best for macOS)
- **Download**: https://tableplus.com/
- **Free tier**: Yes (2 tabs, 2 connections)
- **Interface**: Native macOS, beautiful and fast
- **Features**: Browse tables, run queries, export data

**Installation:**
```bash
# Via Homebrew
brew install --cask tableplus

# Or download from website
open https://tableplus.com/
```

**Connect to WashTrack:**
1. Open TablePlus
2. Click "+ Create a new connection"
3. Select "PostgreSQL"
4. Enter:
   - **Name**: WashTrack
   - **Host**: localhost
   - **Port**: 5432
   - **User**: postgres
   - **Password**: (leave empty if none)
   - **Database**: washtrack_db
5. Click "Test" then "Connect"

---

### 🔷 Postico 2 (Mac-Only)
- **Download**: https://eggerapps.at/postico/
- **Free trial**: 14 days, then $49
- **Interface**: Very Mac-like, simple and clean
- **Best for**: Browsing and editing data visually

---

### 🐘 pgAdmin (Official & Free)
- **Download**: https://www.pgadmin.org/download/pgadmin-4-macos/
- **Free**: Yes, completely free
- **Interface**: Web-based (runs in browser)
- **Best for**: Full PostgreSQL management

**Installation:**
```bash
brew install --cask pgadmin4
```

---

### 🦫 DBeaver (Free & Open Source)
- **Download**: https://dbeaver.io/download/
- **Free**: Yes, community edition
- **Interface**: Java-based, cross-platform
- **Best for**: Power users, supports many databases

**Installation:**
```bash
brew install --cask dbeaver-community
```

---

## Quick Comparison

| Tool | Price | Best For | Install |
|------|-------|----------|---------|
| **TablePlus** | Free/Paid | Beautiful UI, fast | `brew install --cask tableplus` |
| **Postico** | $49 | Mac native experience | Download from website |
| **pgAdmin** | Free | Full features | `brew install --cask pgadmin4` |
| **DBeaver** | Free | Power users | `brew install --cask dbeaver-community` |

---

## My Recommendation

**For WashTrack development, use TablePlus:**
- Fast and lightweight
- Free tier is sufficient for development
- Native Mac app (no browser needed)
- Easy to browse tables and run queries
- Great for viewing seed data and testing

---

## Alternative: VSCode Extension

If you prefer staying in VSCode:

**PostgreSQL Extension**
1. Install "PostgreSQL" extension by Chris Kolkman
2. Add connection in VSCode
3. Browse tables directly in sidebar

---

## Using TablePlus with WashTrack

Once connected, you can:

1. **Browse Tables**: Click on any table to view data
2. **Run Queries**: Press ⌘+E to open query tab
3. **Export Data**: Right-click → Export
4. **Edit Data**: Double-click cell to edit (careful in production!)
5. **View Structure**: Right-click table → Structure

### Useful Queries in TablePlus

```sql
-- View all users with company names
SELECT u.name, u.role, u.mobile_number, c.name as company
FROM users u
LEFT JOIN companies c ON u.company_id = c.id;

-- View all services with prices
SELECT c.name as company, s.name as service, s.base_price
FROM services s
JOIN companies c ON s.company_id = c.id;

-- Check if data is properly isolated
SELECT
  (SELECT COUNT(*) FROM companies) as companies,
  (SELECT COUNT(*) FROM users) as users,
  (SELECT COUNT(*) FROM services) as services,
  (SELECT COUNT(*) FROM expense_types) as expense_types;
```

---

## Terminal Quick View (No GUI Needed)

While you install a GUI tool, view data in terminal:

```bash
cd database
./view-data.sh
```

Or manual commands:

```bash
# List tables
psql washtrack_db -c "\dt"

# View users
psql washtrack_db -c "SELECT * FROM users;"

# View with nice formatting
psql washtrack_db -c "SELECT * FROM users;" -x

# Count records
psql washtrack_db -c "SELECT 'companies' as table, COUNT(*) FROM companies UNION ALL SELECT 'users', COUNT(*) FROM users;"
```

---

## After Installing GUI Tool

1. Connect to `washtrack_db`
2. Verify these tables exist (13 total):
   - companies
   - users
   - otp_verifications
   - customers
   - services
   - expense_types
   - transactions
   - expenses
   - employee_advances
   - employee_overtime
   - employee_leaves
   - employee_attendance
   - inventory
   - purchase_orders

3. Check seed data:
   - 1 company (SparkleWash Demo)
   - 3 users (super_admin, company_admin, worker)
   - 4 services
   - 5 expense_types
   - 1 customer

---

**Next Step**: Install TablePlus (quickest option) and the server should now start without Twilio errors!
