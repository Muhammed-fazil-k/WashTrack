# 🆔 Company Code System

## Overview

WashTrack uses **unique, readable company codes** instead of random numbers for better business operations and user experience.

---

## Format Specification

### Pattern
```
WC####
```

- **Prefix:** `WC` (WashTrack Company)
- **Digits:** 4 digits (0001-9999)
- **Examples:** `WC0001`, `WC0002`, `WC0045`, `WC1234`

### Capacity
- **Maximum:** 10,000 companies (WC0001 to WC9999)
- **Format:** Zero-padded for consistent length

---

## Auto-Generation Logic

### How It Works

1. **First Company:**
   - Code: `WC0001`
   - Generated automatically on creation

2. **Subsequent Companies:**
   - Queries last company code
   - Extracts number: `WC0045` → `45`
   - Increments: `45 + 1 = 46`
   - Pads: `46` → `0046`
   - Generates: `WC0046`

### Code Example
```javascript
// Get last company code
const lastCode = 'WC0045';
const lastNumber = parseInt(lastCode.substring(2)); // 45
const nextNumber = lastNumber + 1; // 46
const companyCode = `WC${String(nextNumber).padStart(4, '0')}`; // WC0046
```

---

## Database Schema

```sql
CREATE TABLE companies (
  id SERIAL PRIMARY KEY,              -- Internal numeric ID
  company_code VARCHAR(20) UNIQUE,    -- Public-facing code (WC0001)
  name VARCHAR(255),
  -- ... other fields
);

CREATE INDEX idx_companies_code ON companies(company_code);
```

### Key Points
- **`company_code`** is UNIQUE and indexed
- **`id`** still exists for foreign key relationships
- Both can be used for lookups

---

## Routing Implementation

### URL Structure

**Before:**
```
/super-admin/companies/123/users     ❌ Hard to remember
```

**After:**
```
/super-admin/companies/WC0001/users  ✅ Readable and memorable
```

### Backend Routes

All endpoints accept **both** numeric ID and company_code:

```javascript
// Works with numeric ID
GET /api/v1/companies/1

// Works with company code
GET /api/v1/companies/WC0001

// User endpoints also support company code
GET /api/v1/users/company/WC0001
```

### Detection Logic
```javascript
const isCode = /^WC\d{4}$/.test(id);
// If matches WC#### pattern, query by company_code
// Otherwise, query by numeric id
```

---

## Frontend Usage

### Navigation
```javascript
// Click company row → navigate with company_code
navigate(`/super-admin/companies/${company.company_code}/users`);

// URL becomes: /super-admin/companies/WC0001/users
```

### URL Parameter
```javascript
// Extract from route
const { companyCode } = useParams();

// Use in API calls
CompanyService.getCompanyById(companyCode);  // Accepts WC0001
UserService.getUsersByCompany(companyCode);  // Accepts WC0001
```

---

## UI Display

### Dashboard Table
- **New Column:** "Company ID" (first column)
- **Display:** Blue chip badge with monospace font
- **Example:** `WC0001`

### Company Users Page
- **Header:** Shows company code next to name
- **Format:** `[WC0001] Sparkle Car Wash`

---

## Benefits

### 1. **Readable URLs**
```
✅ localhost:3000/super-admin/companies/WC0001/users
❌ localhost:3000/super-admin/companies/123/users
```

### 2. **Easy Reference**
- Customer support: "Check company WC0001"
- Reports: "Company WC0045 revenue"
- Communication: Clear company identification

### 3. **Professional**
- Looks like a real business identifier
- Easy to communicate verbally
- Memorable for users

### 4. **Scalable**
- Supports 10,000 companies
- Can extend to 5+ digits if needed
- Consistent format

---

## Future Extensibility

### If More Scale Needed

**5 Digits (100,000 companies):**
```javascript
companyCode = `WC${String(nextNumber).padStart(5, '0')}`; // WC00001
```

**Custom Prefixes:**
```javascript
// Different regions
'WCN0001' // North
'WCS0001' // South
'WCE0001' // East
'WCW0001' // West
```

**Year-Based:**
```javascript
`WC${year}-${String(num).padStart(4, '0')}`; // WC2026-0001
```

---

## Migration Guide

### For Existing Database

```sql
-- Add column
ALTER TABLE companies ADD COLUMN company_code VARCHAR(20);

-- Generate codes for existing companies
UPDATE companies
SET company_code = 'WC' || LPAD(id::text, 4, '0');

-- Make it required and unique
ALTER TABLE companies ALTER COLUMN company_code SET NOT NULL;
ALTER TABLE companies ADD CONSTRAINT companies_code_unique UNIQUE (company_code);

-- Add index
CREATE INDEX idx_companies_code ON companies(company_code);
```

### For Fresh Setup

Just run:
```bash
npm run migrate
npm run seed
```

---

## Testing

### Verify Company Code Generation
1. Create first company → should get `WC0001`
2. Create second company → should get `WC0002`
3. Delete company 2, create new → should get `WC0003` (no reuse)
4. Create 10th company → should get `WC0010`

### Verify Routing
1. Click company WC0001 → URL shows `/companies/WC0001/users`
2. Refresh page → data loads correctly
3. Backend accepts both `WC0001` and numeric `1`

---

## Code Validation

### Valid Formats
- ✅ `WC0001`
- ✅ `WC0999`
- ✅ `WC9999`

### Invalid Formats
- ❌ `WC1` (too short)
- ❌ `WC001` (wrong padding)
- ❌ `wc0001` (lowercase)
- ❌ `WC00001` (too long for current spec)

### Regex Pattern
```javascript
/^WC\d{4}$/
```

---

## Summary

✅ **Auto-generated** - No manual entry needed
✅ **Unique** - Database constraint ensures no duplicates
✅ **Readable** - WC0001 vs 1234567890
✅ **Routable** - Used in URLs for clean navigation
✅ **Scalable** - Supports 10,000 companies
✅ **Professional** - Looks like a real business system
