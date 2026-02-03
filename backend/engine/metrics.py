import pandas as pd

class FinancialMetrics:
    @staticmethod
    def calculate_altman_z_score(working_capital, retained_earnings, ebit, market_cap, total_liabilities, total_assets):
        """
        Calculates Altman Z-Score for private firms (Z' Score model).
        Z' = 0.717X1 + 0.847X2 + 3.107X3 + 0.420X4 + 0.998X5
        """
        if total_assets == 0:
            return 0
        
        x1 = working_capital / total_assets
        x2 = retained_earnings / total_assets
        x3 = ebit / total_assets
        x4 = market_cap / total_liabilities # Book value of equity for private firms
        x5 = 0 # Sales/Total Assets (often omitted for private service firms or calibrated differently)
        
        # Using the re-estimated coefficients for private firms (Altman 1983)
        # Z'' = 6.56X1 + 3.26X2 + 6.72X3 + 1.05X4
        # Where X1 = (Current Assets - Current Liabilities) / Total Assets
        # X2 = Retained Earnings / Total Assets
        # X3 = EBIT / Total Assets
        # X4 = Book Value of Equity / Total Liabilities
        
        z_score = (6.56 * x1) + (3.26 * x2) + (6.72 * x3) + (1.05 * x4)
        return round(z_score, 2)

    @staticmethod
    def calculate_dscr(net_operating_income, total_debt_service):
        """
        Debt Service Coverage Ratio = Net Operating Income / Total Debt Service
        """
        if total_debt_service == 0:
            return 999.0 # No debt
        return round(net_operating_income / total_debt_service, 2)
