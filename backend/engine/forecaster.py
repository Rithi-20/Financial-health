import numpy as np
# from statsmodels.tsa.api import SimpleExpSmoothing (Uncomment when ready)

class Forecaster:
    @staticmethod
    def project_cash_flow(historical_cash: list, months_ahead: int = 3):
        """
        Calculates projection with confidence intervals (Best Case / Worst Case).
        """
        if not historical_cash:
            return {"mid": [], "upper": [], "lower": []}
        
        if len(historical_cash) < 2:
            val = historical_cash[-1]
            return {
                "mid": [val] * months_ahead,
                "upper": [round(val * 1.1, 2)] * months_ahead,
                "lower": [round(val * 0.9, 2)] * months_ahead
            }

        x = np.array(range(len(historical_cash)))
        y = np.array(historical_cash)
        
        # Linear Regression: y = mx + c
        A = np.vstack([x, np.ones(len(x))]).T
        m, c = np.linalg.lstsq(A, y, rcond=None)[0]
        
        # Estimate volatility for confidence intervals
        std_dev = np.std(y) if len(y) > 0 else 0
        
        mid = []
        upper = []
        lower = []
        
        for i in range(1, months_ahead + 1):
            next_x = len(historical_cash) + i - 1
            projected_value = (m * next_x) + c
            
            # Confidence spreads over time
            spread = std_dev * (i ** 0.5)
            
            mid.append(round(projected_value, 2))
            upper.append(round(projected_value + spread, 2))
            lower.append(round(projected_value - spread, 2))
            
        return {
            "mid": mid,
            "upper": upper,
            "lower": lower
        }
