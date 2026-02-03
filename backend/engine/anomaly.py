import numpy as np
from sklearn.ensemble import IsolationForest
import pandas as pd

class AnomalyDetector:
    @staticmethod
    def detect_transaction_anomalies(transactions: list):
        """
        Uses Isolation Forest to detect unusual spending patterns.
        Input: List of dicts with 'amount' or 'debit'/'credit'
        """
        if len(transactions) < 5:
            return []

        # Prepare features: Amount and weekday
        data = []
        for tx in transactions:
            amt = tx.get('amount') or tx.get('debit') or tx.get('credit') or 0
            # For demo, assume we have a date or just use amount
            data.append([float(amt)])

        X = np.array(data)
        
        # Contamination = expected proportion of outliers (e.g. 5%)
        model = IsolationForest(contamination=0.05, random_state=42)
        preds = model.fit_predict(X)
        
        anomalies = []
        for i, pred in enumerate(preds):
            if pred == -1: # Anomaly
                tx = transactions[i]
                amt = tx.get('amount') or tx.get('debit') or tx.get('credit') or 0
                anomalies.append({
                    "id": tx.get('id'),
                    "date": tx.get('date'),
                    "description": tx.get('description'),
                    "amount": amt,
                    "reason": "Unusual amount detected for this business pattern.",
                    "severity": "high" if amt > 50000 else "medium"
                })
        
        return anomalies
