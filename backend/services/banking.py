import random
from datetime import datetime, timedelta

class MockBankingAdapter:
    @staticmethod
    def connect_account(bank_name: str, credentials: dict):
        """
        Simulates connecting to a bank. Returns a mock session token.
        """
        if not bank_name:
            raise ValueError("Bank name required")
        return {"status": "connected", "connection_id": f"mock_{bank_name}_{random.randint(1000,9999)}"}

    @staticmethod
    def fetch_transactions(connection_id: str, days: int = 90):
        """
        Returns a list of synthetic transactions.
        """
        transactions = []
        today = datetime.now()
        
        # categories for random generation
        descriptions = [
            ("Uber Ride", "Travel", -15.50),
            ("Starbucks", "Meals", -5.75),
            ("Client Payment - ACME", "Revenue", 1200.00),
            ("AWS Web Services", "Software", -45.00),
            ("Office Depot", "Supplies", -23.10),
            ("Salary Run", "Payroll", -3500.00),
            ("Rent Payment", "Rent", -1000.00)
        ]
        
        for i in range(days):
            date = today - timedelta(days=i)
            # 1-3 transactions per day
            for _ in range(random.randint(1, 3)):
                desc, cat, base_amount = random.choice(descriptions)
                noise = random.uniform(-0.1, 0.1) * base_amount # +/- 10% variance
                amount = round(base_amount + noise, 2)
                
                transactions.append({
                    "date": date.strftime("%Y-%m-%d"),
                    "description": desc,
                    "amount": amount,
                    "normalized_category": cat,
                    "source": "MockBankAPI"
                })
                
        return transactions
