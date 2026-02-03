-- Users table for authentication
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS companies (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    legal_name VARCHAR(255) NOT NULL,
    tax_id VARCHAR(50) UNIQUE,
    industry VARCHAR(100),
    preferred_language VARCHAR(10) DEFAULT 'en',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS financial_statements (
    id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES companies(id),
    statement_type VARCHAR(50), -- 'ProfitLoss', 'BalanceSheet', 'CashFlow'
    period_start DATE,
    period_end DATE,
    raw_file_path TEXT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES companies(id),
    transaction_date DATE NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    description TEXT,
    raw_category VARCHAR(255),
    normalized_category VARCHAR(255), -- 'Travel', 'Meals', 'Rent'
    source VARCHAR(50), -- 'BankAPI', 'StatementUpload'
    verification_status VARCHAR(50) DEFAULT 'Unverified' -- 'Verified', 'Flagged'
);

CREATE TABLE IF NOT EXISTS financial_metrics (
    id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES companies(id),
    calculation_date DATE DEFAULT CURRENT_DATE,
    metric_name VARCHAR(100), -- 'Z-Score', 'CurrentRatio'
    metric_value DECIMAL(10, 4),
    narrative TEXT
);
