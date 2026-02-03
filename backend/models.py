from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    companies = relationship("Company", back_populates="owner")

class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    legal_name = Column(String, nullable=False)
    tax_id = Column(String, unique=True)
    industry = Column(String)
    preferred_language = Column(String, default="en")
    setu_consent_id = Column(String, nullable=True)
    setu_consent_status = Column(String, default="NONE")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    owner = relationship("User", back_populates="companies")
    bank_transactions = relationship("BankTransaction", back_populates="company")
    accounting_records = relationship("AccountingRecord", back_populates="company")
    gst_returns = relationship("GSTReturn", back_populates="company")

class BankTransaction(Base):
    __tablename__ = "bank_transactions"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id", ondelete="CASCADE"))
    date = Column(DateTime)
    description = Column(String)
    debit = Column(Integer, default=0)
    credit = Column(Integer, default=0)
    balance = Column(Integer, default=0)

    company = relationship("Company", back_populates="bank_transactions")

class AccountingRecord(Base):
    __tablename__ = "accounting_records"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id", ondelete="CASCADE"))
    type = Column(String) # SALE, EXPENSE, INVENTORY
    invoice_no = Column(String)
    date = Column(DateTime)
    name = Column(String)
    item_category = Column(String)
    qty = Column(Integer)
    unit_cost = Column(Integer)
    amount = Column(Integer)
    status = Column(String)
    due_date = Column(DateTime)

    company = relationship("Company", back_populates="accounting_records")

class GSTReturn(Base):
    __tablename__ = "gst_returns"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id", ondelete="CASCADE"))
    return_period = Column(String) # e.g., "Jan 2025"
    total_sales = Column(Integer, default=0)
    total_tax_paid = Column(Integer, default=0)
    status = Column(String) # "Filed", "Pending"
    filing_date = Column(DateTime)

    company = relationship("Company", back_populates="gst_returns")
