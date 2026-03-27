-- Migration: Add company_code to existing companies table
-- Run this if you want to preserve existing data

BEGIN;

-- 1. Add the company_code column (nullable first)
ALTER TABLE companies ADD COLUMN IF NOT EXISTS company_code VARCHAR(20);

-- 2. Generate codes for existing companies
UPDATE companies
SET company_code = 'WC' || LPAD(id::text, 4, '0')
WHERE company_code IS NULL;

-- 3. Make it required and unique
ALTER TABLE companies ALTER COLUMN company_code SET NOT NULL;
ALTER TABLE companies ADD CONSTRAINT companies_code_unique UNIQUE (company_code);

-- 4. Add index for performance
CREATE INDEX IF NOT EXISTS idx_companies_code ON companies(company_code);

COMMIT;

-- Verify
SELECT id, company_code, name FROM companies ORDER BY id;
