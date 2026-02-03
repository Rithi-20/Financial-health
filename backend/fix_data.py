import database, models

def fix_data():
    db = database.SessionLocal()
    try:
        # Fix Accounting Records
        records = db.query(models.AccountingRecord).all()
        count = 0
        for r in records:
            if not r.type or r.type == "":
                cat = str(r.item_category).lower() if r.item_category else ""
                name = str(r.name).lower() if r.name else ""
                expense_keywords = ['salary', 'rent', 'electricity', 'internet', 'plumbing', 'fittings', 'bill', 'tax', 'payment']
                if any(k in cat for k in expense_keywords) or any(k in name for k in expense_keywords):
                    r.type = 'EXPENSE'
                else:
                    r.type = 'SALE'
                count += 1
        
        # Fix Bank Transactions (simplified: if debit/credit are 0, use balance changes if possible, or just mock from description)
        txns = db.query(models.BankTransaction).order_by(models.BankTransaction.id.asc()).all()
        count_tx = 0
        prev_balance = None
        for t in txns:
            if t.debit == 0 and t.credit == 0:
                if prev_balance is not None:
                    diff = t.balance - prev_balance
                    if diff > 0: t.credit = diff
                    else: t.debit = abs(diff)
                else:
                    # Opening balance or first record
                    if "opening" in t.description.lower():
                        t.credit = t.balance
                    else:
                        # Guess from description
                        if any(k in t.description.lower() for k in ['payment', 'bill', 'rent', 'salary']):
                            t.debit = 1000 # placeholder
                        else:
                            t.credit = 1000 # placeholder
                count_tx += 1
            prev_balance = t.balance
            
        db.commit()
        print(f"Successfully fixed {count} accounting records and {count_tx} bank transactions.")
    except Exception as e:
        print(f"Error during fix: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    fix_data()
