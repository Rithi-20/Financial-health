import numpy as np
# from statsmodels.tsa.api import SimpleExpSmoothing (Uncomment when ready)

class Forecaster:
    @staticmethod
    def project_cash_flow(historical_cash: list, months_ahead: int = 3):
        """
        Simple linear projection for now. 
        TODO: Upgrade to ARIMA or Holt-Winters.
        """
        if len(historical_cash) < 2:
            return [historical_cash[-1]] * months_ahead if historical_cash else []

        x = np.array(range(len(historical_cash)))
        y = np.array(historical_cash)
        
        # Linear Regression: y = mx + c
        A = np.vstack([x, np.ones(len(x))]).T
        m, c = np.linalg.lstsq(A, y, rcond=None)[0]
        
        projections = []
        for i in range(1, months_ahead + 1):
            next_x = len(historical_cash) + i - 1
            projected_value = (m * next_x) + c
            projections.append(round(projected_value, 2))
            
        return projections
