from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from services.parser import DocumentParser
from services.bookkeeper import BookkeeperAgent
from services.banking import MockBankingAdapter
from engine.metrics import FinancialMetrics
from engine.forecaster import Forecaster
from engine.anomaly import AnomalyDetector
from engine.lender import LendingEngine
from engine.industry import IndustryAnalyzer
from engine.advisor import SavingsAdvisor
from services.setu import SetuAA
import models, auth, database
import pandas as pd
from pydantic import BaseModel
from typing import Optional

# Create tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(
    title="Financial Health Platform API",
    description="API for SME Financial Health Assessment, Bookkeeping, and Forecasting",
    version="0.1.0",
    debug=True
)

# Initialize Services
bookkeeper = BookkeeperAgent()

# Origins for CORS - Allow all localhost ports for development
origins = [
    "http://localhost",
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "http://127.0.0.1:5175",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Financial Health Platform API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# --- Auth Schemas ---
class UserSignup(BaseModel):
    email: str
    password: str
    full_name: str
    company_name: str

class UserLogin(BaseModel):
    email: str
    password: str

# --- Auth Routes ---
@app.post("/api/auth/signup")
async def signup(user_data: UserSignup, db: Session = Depends(database.get_db)):
    if not user_data.password:
        raise HTTPException(status_code=400, detail="Password cannot be empty")

    # Check if user exists
    db_user = db.query(models.User).filter(models.User.email == user_data.email).first()
    if db_user:
        return JSONResponse(status_code=400, content={"detail": "Email already registered"})
    
    # Create User
    hashed_pwd = auth.get_password_hash(user_data.password)
    
    new_user = models.User(
        email=user_data.email,
        hashed_password=hashed_pwd,
        full_name=user_data.full_name
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Create Company
    new_company = models.Company(
        user_id=new_user.id,
        legal_name=user_data.company_name
    )
    db.add(new_company)
    db.commit()
    
    return {"message": "User created successfully"}

@app.post("/api/auth/login")
async def login(login_data: UserLogin, db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.email == login_data.email).first()
    if not user or not auth.verify_password(login_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Fetch user's company
    company = db.query(models.Company).filter(models.Company.user_id == user.id).first()
    company_name = company.legal_name if company else "N/A"
    
    access_token = auth.create_access_token(data={"sub": user.email})
    return {
        "access_token": access_token, 
        "token_type": "bearer", 
        "user": {
            "email": user.email, 
            "full_name": user.full_name,
            "company_name": company_name
        }
    }

# --- Live Banking (Setu AA) ---
# setu = SetuAA() # Moved inside functions as per instruction

from fastapi import Request

@app.post("/api/banking/setu/initiate")
async def initiate_setu_consent(
    payload: dict, 
    request: Request,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    vua = payload.get("vua")
    if not vua:
        raise HTTPException(status_code=400, detail="VUA is required")
    
    auth_header = request.headers.get("Authorization")
    
    try:
        # Get User's Company
        company = db.query(models.Company).filter(models.Company.user_id == current_user.id).first()
        company_name = company.legal_name if company else "Your Company"

        setu = SetuAA()
        result = setu.create_consent_request(vua, company_name, auth_token=auth_header)
        
        if company:
            company.setu_consent_id = result.get("id")
            company.setu_consent_status = "PENDING"
            db.commit()
            
        return {
            "consent_id": result.get("id"),
            "url": result.get("url"), # Redirect user to this URL
            "status": "PENDING"
        }
    except Exception as e:
        print(f"Setu Initiation Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/banking/setu/approve")
async def approve_setu_consent(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    company = db.query(models.Company).filter(models.Company.user_id == current_user.id).first()
    if company:
        company.setu_consent_status = "ACTIVE"
        db.commit()
    return {"status": "SUCCESS"}

@app.post("/api/banking/setu/reset")
async def reset_setu_consent(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    company = db.query(models.Company).filter(models.Company.user_id == current_user.id).first()
    if company:
        company.setu_consent_id = None
        company.setu_consent_status = "NONE"
        db.commit()
    return {"status": "SUCCESS"}

@app.get("/api/banking/setu/status")
async def check_setu_status(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    company = db.query(models.Company).filter(models.Company.user_id == current_user.id).first()
    if not company or not company.setu_consent_id:
        return {"status": "NONE"}
    
    # If already active in DB, return ACTIVE
    if company.setu_consent_status == "ACTIVE":
        return {"status": "ACTIVE"}
    
    # Provide URL for pending state
    url = None
    if company.setu_consent_id:
        if company.setu_consent_id.startswith("demo_"):
            url = "http://localhost:5173/setu_mock.html"
        else:
            url = f"https://bridge.setu.co/v2/account-aggregator/consent/{company.setu_consent_id}"

    try:
        setu = SetuAA()
        result = setu.check_consent_status(company.setu_consent_id)
        return {"status": result.get("status"), "url": url}
    except Exception as e:
        return {"status": "PENDING", "url": url}

# --- Data Ingestion ---

@app.post("/api/upload")
async def upload_financial_statement(
    type: str, 
    file: UploadFile = File(...), 
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """
    Uploads a document, parses it, and stores raw data in the DB.
    """
    try:
        content = await file.read()
        filename = file.filename
        
        # 1. Parse File
        df = await DocumentParser.parse_file(content, filename)
        
        # Replace all NaN with None for DB compatibility
        df = df.where(pd.notnull(df), None)
        
        # 2. Get User's Company
        company = db.query(models.Company).filter(models.Company.user_id == current_user.id).first()
        if not company:
            raise HTTPException(status_code=400, detail="No company found for this user")

        # 3. Save to DB
        records_saved = 0
        
        def safe_int(val):
            try:
                if val is None or (isinstance(val, float) and pd.isna(val)):
                    return 0
                return int(float(val))
            except:
                return 0

        def safe_date(val):
            try:
                if val is None or (isinstance(val, float) and pd.isna(val)) or str(val).lower() == 'nan':
                    return None
                dt = pd.to_datetime(val)
                if pd.isna(dt):
                    return None
                return dt
            except:
                return None

        def safe_str(val):
            if val is None or (isinstance(val, float) and pd.isna(val)) or str(val).lower() == 'nan':
                return ''
            return str(val)

        def guess_type(row):
            t = safe_str(row.get('type')).upper()
            if t in ["SALE", "EXPENSE", "INVENTORY"]:
                return t
            cat = safe_str(row.get('item/category')).lower()
            name = safe_str(row.get('name')).lower()
            expense_keywords = ['electricity', 'salary', 'rent', 'internet', 'plumbing', 'fittings', 'bill', 'tax', 'payment']
            if any(k in cat for k in expense_keywords) or any(k in name for k in expense_keywords):
                return "EXPENSE"
            return "SALE"

        if type == "bank":
            for _, row in df.iterrows():
                debit = safe_int(row.get('debit'))
                credit = safe_int(row.get('credit'))
                # If both are 0 but amount exists, try to map it
                amt = safe_int(row.get('amount'))
                if debit == 0 and credit == 0 and amt != 0:
                    if amt < 0: debit = abs(amt)
                    else: credit = amt
                
                txn = models.BankTransaction(
                    company_id=company.id,
                    date=safe_date(row.get('date')),
                    description=safe_str(row.get('description')),
                    debit=debit,
                    credit=credit,
                    balance=safe_int(row.get('balance'))
                )
                db.add(txn)
                records_saved += 1
        
        elif type == "accounting":
            for _, row in df.iterrows():
                rec = models.AccountingRecord(
                    company_id=company.id,
                    type=guess_type(row),
                    invoice_no=safe_str(row.get('invoiceno')),
                    date=safe_date(row.get('date')),
                    name=safe_str(row.get('name')),
                    item_category=safe_str(row.get('item/category')),
                    qty=safe_int(row.get('qty')),
                    unit_cost=safe_int(row.get('unitcost')),
                    amount=safe_int(row.get('amount')),
                    status=safe_str(row.get('status')),
                    due_date=safe_date(row.get('duedate'))
                )
                db.add(rec)
                records_saved += 1
        
        elif type == "gst":
            for _, row in df.iterrows():
                gst = models.GSTReturn(
                    company_id=company.id,
                    return_period=safe_str(row.get('period')),
                    total_sales=safe_int(row.get('total_sales')),
                    total_tax_paid=safe_int(row.get('total_tax_paid')),
                    status=safe_str(row.get('status', 'Filed')),
                    filing_date=safe_date(row.get('date'))
                )
                db.add(gst)
                records_saved += 1
        
        db.commit()
        
        return {
            "status": "success",
            "filename": filename,
            "total_rows": records_saved,
            "type": type
        }
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/bank/connect")
async def connect_bank(
    payload: dict,
    current_user: models.User = Depends(auth.get_current_user)
):
    # payload expected: { "bank_name": "Chase" }
    try:
        return MockBankingAdapter.connect_account(payload.get("bank_name"), {})
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/dashboard/metrics")
async def get_dashboard_metrics(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """
    Returns calculated financial health metrics from real DB data.
    """
    company = db.query(models.Company).filter(models.Company.user_id == current_user.id).first()
    if not company:
        return {
            "health_score": {"value": 0, "label": "No Data", "color": "gray"},
            "ratios": {"z_score": 0, "dscr": 0, "net_margin": 0},
            "forecast": {"months": [], "values": []},
            "insights": ["Complete your onboarding to see analytics."]
        }

    # 1. Aggregate Accounting Data
    from sqlalchemy import func
    sales = db.query(func.sum(models.AccountingRecord.amount)).filter(
        models.AccountingRecord.company_id == company.id,
        models.AccountingRecord.type == "SALE"
    ).scalar() or 0
    
    expenses = db.query(func.sum(models.AccountingRecord.amount)).filter(
        models.AccountingRecord.company_id == company.id,
        models.AccountingRecord.type == "EXPENSE"
    ).scalar() or 0
    
    inventory = db.query(func.sum(models.AccountingRecord.amount)).filter(
        models.AccountingRecord.company_id == company.id,
        models.AccountingRecord.type == "INVENTORY"
    ).scalar() or 0

    # 2. Get Bank Data
    latest_balance = db.query(models.BankTransaction.balance).filter(
        models.BankTransaction.company_id == company.id
    ).order_by(models.BankTransaction.date.desc()).first()
    balance = latest_balance[0] if latest_balance else 0

    # 3. Calculate Ratios
    total_assets = inventory + balance + 1000 # Adding a buffer for fixed assets
    total_liabilities = expenses * 0.5 # Simplified ratio for demo
    ebit = sales - expenses
    
    z_score = FinancialMetrics.calculate_altman_z_score(
        working_capital=(balance + inventory - total_liabilities),
        retained_earnings=(sales - expenses), # Approximation
        ebit=ebit,
        market_cap=(total_assets - total_liabilities), # Book value
        total_liabilities=max(total_liabilities, 1),
        total_assets=max(total_assets, 1)
    )
    
    dscr = FinancialMetrics.calculate_dscr(net_operating_income=ebit, total_debt_service=expenses * 0.1)

    # 4. Forecast from Bank History
    historical = db.query(models.BankTransaction.balance).filter(
        models.BankTransaction.company_id == company.id
    ).order_by(models.BankTransaction.date.asc()).all()
    historical_values = [h[0] for h in historical] if historical else [0]
    
    forecast_vals = Forecaster.project_cash_flow(historical_values, months_ahead=3)
    
    # 5. Generate Dynamic AI Insights (LLM)
    metrics_summary = {
        "sales": int(sales),
        "expenses": int(expenses),
        "bank_balance": int(balance),
        "z_score": round(z_score, 2),
        "ebit": int(ebit),
        "dscr": round(dscr, 2)
    }
    insights = await bookkeeper.generate_business_alerts(metrics_summary)

    # 6. Anomaly Detection (New)
    txns = db.query(models.BankTransaction).filter(models.BankTransaction.company_id == company.id).all()
    tx_list = [{"id": t.id, "amount": t.debit if t.debit > 0 else t.credit, "description": t.description} for t in txns]
    anomalies = AnomalyDetector.detect_transaction_anomalies(tx_list)

    inflow_total = sales

    # Calculate Cash Flow Intelligence
    category_sums = db.query(
        models.AccountingRecord.item_category, 
        func.sum(models.AccountingRecord.amount)
    ).filter(
        models.AccountingRecord.company_id == company.id,
        models.AccountingRecord.type == "EXPENSE"
    ).group_by(models.AccountingRecord.item_category).all()

    colors = ["#3b82f6", "#6366f1", "#8b5cf6", "#a855f7", "#d946ef", "#ec4899", "#f43f5e"]
    outflow_categories = []
    for i, (cat, val) in enumerate(category_sums):
        if cat:
            outflow_categories.append({
                "name": cat,
                "value": int(val),
                "color": colors[i % len(colors)]
            })
    
    # If no categories, add a placeholder
    if not outflow_categories:
        outflow_categories = [{"name": "Operational", "value": int(expenses), "color": "#3b82f6"}]

    total_outflow = sum(c['value'] for c in outflow_categories)
    net_cash_flow = inflow_total - total_outflow
    
    # Burn Rate (Average monthly outflow - for demo assuming this is the monthly data)
    burn_rate = total_outflow
    survival_months = round(balance / burn_rate, 1) if burn_rate > 0 else 99
    
    # Calculate if we have any data to show
    has_bank = db.query(models.BankTransaction).filter(models.BankTransaction.company_id == company.id).first() is not None
    has_accounting = db.query(models.AccountingRecord).filter(models.AccountingRecord.company_id == company.id).first() is not None
    has_gst = db.query(models.GSTReturn).filter(models.GSTReturn.company_id == company.id).first() is not None
    has_any_data = has_bank or has_accounting or has_gst

    # Calculate Score
    z_val = z_score
    if z_val >= 3:
        display_score = 90 + min(z_val, 10)
    elif z_val >= 1.8:
        display_score = 60 + (z_val - 1.8) * 20
    else:
        display_score = max(z_val * 30, 10)
    display_score = min(int(display_score), 100)

    working_capital = (balance + inventory - total_liabilities)
    retained_earnings = (sales - expenses)

    # 7. Lending & Credit (New)
    lending_score = LendingEngine.calculate_credit_score({
        "dscr": dscr,
        "z_score": z_score,
        "net_margin": (ebit / sales) if sales > 0 else 0
    })
    eligible_loans = LendingEngine.get_eligible_loans(lending_score, sales, ebit)
    roadmap = LendingEngine.get_roadmap(lending_score)

    # 8. Industry & Savings (New)
    industry_type = IndustryAnalyzer.identify_industry(company.legal_name, tx_list)
    comparison = IndustryAnalyzer.get_comparison(industry_type, {
        "net_margin": (ebit / sales) if sales > 0 else 0,
        "dscr": dscr,
        "quick_ratio": balance / max(expenses * 0.5, 1)
    })
    saving_actions = SavingsAdvisor.get_savings_actions(outflow_categories, (ebit / sales) if sales > 0 else 0)

    # 9. Working Capital Cycle Metrics
    estimated_receivables = sales * 0.15
    dso = round((estimated_receivables / sales) * 365, 1) if sales > 0 else 0
    estimated_payables = expenses * 0.10
    dpo = round((estimated_payables / expenses) * 365, 1) if expenses > 0 else 0
    dio = round((inventory / expenses) * 365, 1) if expenses > 0 else 0
    ccc = round(dso + dio - dpo, 1)
    
    working_capital_metrics = {
        "dso": dso,
        "dpo": dpo,
        "dio": dio,
        "ccc": ccc,
        "inventory_turnover": round(expenses / inventory, 2) if inventory > 0 else 0,
        "working_capital_ratio": round(working_capital / expenses, 2) if expenses > 0 else 0
    }

    return {
        "has_any_data": has_any_data,
        "health_score": {
            "value": display_score, 
            "label": "Strong" if display_score > 80 else "Good" if display_score > 50 else "Weak",
            "color": "green" if display_score > 80 else "yellow" if display_score > 50 else "red"
        },
        "lending": {
            "score": lending_score,
            "loans": eligible_loans,
            "roadmap": roadmap
        },
        "benchmarks": comparison,
        "savings": saving_actions,
        "working_capital": working_capital_metrics,
        "cash_flow": {
            "inflow": int(inflow_total),
            "outflow": int(total_outflow),
            "net": int(net_cash_flow),
            "categories": outflow_categories,
            "survival_months": survival_months,
            "burn_rate": int(burn_rate)
        },
        "ratios": {
            "z_score": round(z_score, 2),
            "dscr": round(dscr, 2),
            "net_margin": round(ebit / sales, 2) if sales > 0 else 0
        },
        "components": {
            "working_capital": int(working_capital),
            "ebit": int(ebit),
            "sales": int(sales),
            "total_assets": int(total_assets),
            "total_liabilities": int(total_liabilities),
            "retained_earnings": int(retained_earnings)
        },
        "forecast": {
            "months": ["Next Month", "+2 Months", "+3 Months"],
            "values": forecast_vals
        },
        "insights": insights,
        "anomalies": anomalies
    }

@app.get("/api/report/download")
async def download_report(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """
    Generates and returns a professional PDF financial health report.
    """
    try:
        from reportlab.lib.pagesizes import letter
        from reportlab.pdfgen import canvas
        from io import BytesIO
        from fastapi.responses import StreamingResponse
        
        # 1. Get real data
        metrics = await get_dashboard_metrics(db, current_user)
        user = current_user
        company = db.query(models.Company).filter(models.Company.user_id == user.id).first()
        
        buffer = BytesIO()
        p = canvas.Canvas(buffer, pagesize=letter)
        width, height = letter

        # Header
        p.setFont("Helvetica-Bold", 24)
        p.setStrokeColorRGB(0.2, 0.4, 0.6)
        p.drawString(50, height - 80, f"Financial Health Report: {company.legal_name if company else 'Analysis'}")
        
        p.setFont("Helvetica", 12)
        p.drawString(50, height - 100, f"Generated for: {user.full_name if user else 'Client'}")
        p.line(50, height - 110, width - 50, height - 110)

        # Health Score
        p.setFont("Helvetica-Bold", 16)
        p.drawString(50, height - 150, "1. Overall Business Health")
        p.setFont("Helvetica", 12)
        p.drawString(70, height - 175, f"Health Score: {metrics['health_score']['value']}/100 ({metrics['health_score']['label']})")
        
        # Key Metrics
        p.setFont("Helvetica-Bold", 16)
        p.drawString(50, height - 210, "2. Key Financial Indicators")
        p.setFont("Helvetica", 12)
        p.drawString(70, height - 235, f"Financial Stability: {metrics['ratios']['z_score']}")
        p.drawString(70, height - 255, f"Cash Coverage: {metrics['ratios']['dscr']}")
        p.drawString(70, height - 275, f"Profit Margin: {int(metrics['ratios']['net_margin'] * 100)}%")

        # Insights
        p.setFont("Helvetica-Bold", 16)
        p.drawString(50, height - 310, "3. AI Business Insights")
        y_pos = height - 335
        p.setFont("Helvetica", 11)
        for insight in metrics['insights']:
            p.drawString(70, y_pos, f"• {insight}")
            y_pos -= 20

        # Footer
        p.setFont("Helvetica-Oblique", 10)
        p.drawString(50, 50, "Confidential - Financial Health AI Analysis Engine")
        
        p.showPage()
        p.save()
        
        buffer.seek(0)
        return StreamingResponse(
            buffer, 
            media_type="application/pdf", 
            headers={"Content-Disposition": f"attachment; filename=Financial_Report_{company.legal_name if company else 'SME'}.pdf"}
        )
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"PDF Generation Error: {str(e)}")

@app.get("/api/notifications")
async def get_notifications(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """
    Returns tax and compliance reminders + dynamic risks.
    """
    # Get anomalies for the user's company
    company = db.query(models.Company).filter(models.Company.user_id == current_user.id).first()
    dynamic_notifs = []
    if company:
        txns = db.query(models.BankTransaction).filter(models.BankTransaction.company_id == company.id).all()
        tx_list = [{"id": t.id, "amount": t.debit if t.debit > 0 else t.credit, "description": t.description} for t in txns]
        anomalies = AnomalyDetector.detect_transaction_anomalies(tx_list)
        for a in anomalies:
            dynamic_notifs.append({
                "id": f"anomaly-{a['id']}",
                "title": "Financial Risk Detected",
                "date": "Today",
                "priority": "high",
                "message": f"Unusual spend of ₹{a['amount']:,} on '{a['description']}'. This differs from your usual patterns."
            })

    static_notifs = [
        {"id": 1, "title": "GST Filing Due", "date": "10th Feb 2025", "priority": "high", "message": "Your GSTR-1 filing is due in 8 days."},
        {"id": 2, "title": "TDS Payment", "date": "15th Feb 2025", "priority": "medium", "message": "Remember to deposit TDS for January salary payments."},
        {"id": 3, "title": "Audit Prep", "date": "1st March 2025", "priority": "low", "message": "Begin reconciling accounts for quarterly audit."}
    ]
    return dynamic_notifs + static_notifs
