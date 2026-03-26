# PostgreSQL Setup Guide for macOS

## Installation Options

### Option 1: Homebrew (Recommended - Command Line)

```bash
# Install PostgreSQL
brew install postgresql@16

# Start PostgreSQL service
brew services start postgresql@16

# Add to PATH (add this to your ~/.zshrc)
echo 'export PATH="/opt/homebrew/opt/postgresql@16/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# Verify installation
psql --version

# Create database
createdb washtrack_db

# Access database
psql washtrack_db
```

### Option 2: Postgres.app (GUI - Easiest)

1. **Download**: https://postgresapp.com/
2. **Install**: Drag Postgres.app to Applications folder
3. **Open**: Launch Postgres.app
4. **Initialize**: Click "Initialize" to create a new server
5. **Add to PATH**:
   ```bash
   echo 'export PATH="/Applications/Postgres.app/Contents/Versions/latest/bin:$PATH"' >> ~/.zshrc
   source ~/.zshrc
   ```
6. **Create Database**: Click "+" button or use terminal:
   ```bash
   createdb washtrack_db
   ```

### Option 3: Manual psql (If you have PostgreSQL installed elsewhere)

If PostgreSQL is installed but not in PATH, find the installation:

```bash
# Search for PostgreSQL
mdfind -name psql

# Or check common locations
ls /usr/local/bin/psql
ls /Library/PostgreSQL/*/bin/psql
ls /Applications/Postgres.app/Contents/Versions/*/bin/psql
```

Then create database using full path:
```bash
/full/path/to/psql -c "CREATE DATABASE washtrack_db;"
```

### Option 4: Use GUI Database Client

Use any PostgreSQL GUI client:
- **pgAdmin** (https://www.pgadmin.org/)
- **TablePlus** (https://tableplus.com/)
- **DBeaver** (https://dbeaver.io/)
- **DataGrip** (https://www.jetbrains.com/datagrip/)

Steps:
1. Download and install GUI client
2. Connect to localhost:5432
3. Create new database named `washtrack_db`
4. Run migration SQL manually

---

## Quick Setup (Recommended)

### Step 1: Install Postgres.app (Easiest for macOS)

```bash
# Download and install Postgres.app
open https://postgresapp.com/

# After installing, add to PATH
echo 'export PATH="/Applications/Postgres.app/Contents/Versions/latest/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# Verify
psql --version
```

### Step 2: Create Database

```bash
# Method 1: Using createdb command
createdb washtrack_db

# Method 2: Using psql
psql postgres -c "CREATE DATABASE washtrack_db;"

# Method 3: Using psql interactive
psql postgres
CREATE DATABASE washtrack_db;
\q
```

### Step 3: Run Migrations

```bash
cd /Users/I761913/Library/CloudStorage/OneDrive-SAPSE/Desktop/Project/WashTrack/database
node migrate.js
```

### Step 4: (Optional) Seed Sample Data

```bash
psql washtrack_db < seeds/001_initial_data.sql
```

### Step 5: Update .env File

Edit `backend/.env`:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=washtrack_db
DB_USER=postgres  # or your username
DB_PASSWORD=      # leave empty if no password set
```

---

## Alternative: Use Docker PostgreSQL

If you don't want to install PostgreSQL locally:

```bash
# Run PostgreSQL in Docker
docker run --name washtrack-postgres \
  -e POSTGRES_DB=washtrack_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  -d postgres:16

# Check if running
docker ps

# Connect to database
docker exec -it washtrack-postgres psql -U postgres -d washtrack_db
```

Update `.env`:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=washtrack_db
DB_USER=postgres
DB_PASSWORD=postgres
```

---

## Troubleshooting

### Issue: "command not found: psql"
**Solution**: PostgreSQL is not installed or not in PATH. Use one of the installation methods above.

### Issue: "could not connect to server"
**Solution**: PostgreSQL service is not running.
```bash
# If using Homebrew
brew services start postgresql@16

# If using Postgres.app
# Open Postgres.app and click "Start"

# If using Docker
docker start washtrack-postgres
```

### Issue: "password authentication failed"
**Solution**: Check your credentials in `.env` file match your PostgreSQL setup.

### Issue: "database already exists"
**Solution**: Database already created, skip to migration step.

---

## Verification

After setup, verify everything works:

```bash
# Test connection
psql washtrack_db -c "SELECT version();"

# List databases
psql -l | grep washtrack

# Run migration
cd database
node migrate.js

# Verify tables created
psql washtrack_db -c "\dt"
```

---

## Quick Commands Reference

```bash
# List all databases
psql -l

# Connect to database
psql washtrack_db

# Inside psql:
\dt              # List tables
\d table_name    # Describe table
\q               # Quit

# Run SQL file
psql washtrack_db < file.sql

# Export database
pg_dump washtrack_db > backup.sql

# Drop database (CAUTION)
dropdb washtrack_db
```
