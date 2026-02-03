class LendingEngine:
    @staticmethod
    def calculate_credit_score(metrics: dict) -> int:
        """
        Calculates a proprietary credit score (300-900) based on financial health.
        """
        dscr = metrics.get('dscr', 0)
        z_score = metrics.get('z_score', 0)
        net_margin = metrics.get('net_margin', 0)
        
        # Scoring logic
        score = 300 # Base
        
        # DSCR factor (Max 300 points)
        if dscr > 2.0: score += 300
        elif dscr > 1.25: score += 200
        elif dscr > 1.0: score += 100
        
        # Z-Score factor (Max 200 points)
        if z_score > 3.0: score += 200
        elif z_score > 1.8: score += 100
        
        # Net Margin factor (Max 100 points)
        if net_margin > 0.2: score += 100
        elif net_margin > 0.1: score += 50
        
        return min(score, 900)

    @staticmethod
    def get_eligible_loans(score: int, sales: float, ebit: float):
        """
        Returns a list of curated loans based on eligibility.
        """
        all_loans = [
            {
                "id": "msme-exp",
                "bank": "SBI / HDFC",
                "name": "MSME Expansion Loan",
                "min_score": 650,
                "amount": "₹10L - ₹50L",
                "rate": "8.5% - 11%",
                "type": "Term Loan",
                "purpose": "Business scaling and infrastructure.",
                "apply_url": "https://pmsvanidhi.mohua.gov.in/"
            },
            {
                "id": "wc-bridge",
                "bank": "ICICI / Axis",
                "name": "Working Capital Bridge",
                "min_score": 500,
                "amount": "₹5L - ₹20L",
                "rate": "12% - 15%",
                "type": "Credit Line",
                "purpose": "Day-to-day operations and inventory.",
                "apply_url": "https://www.psbloansin59minutes.com/"
            },
            {
                "id": "quick-overdraft",
                "bank": "Fintech / NBFC",
                "name": "Quick Overdraft",
                "min_score": 400,
                "amount": "₹1L - ₹5L",
                "rate": "18% - 24%",
                "type": "Overdraft",
                "purpose": "Emergency liquidity.",
                "apply_url": "https://www.lendingkart.com/"
            },
            {
                "id": "sidbi-make-india",
                "bank": "SIDBI",
                "name": "Make in India Fund",
                "min_score": 750,
                "amount": "Up to ₹1Cr",
                "rate": "7% - 9%",
                "type": "Soft Loan",
                "purpose": "Manufacturing and indigenous production.",
                "apply_url": "https://www.sidbi.in/en/products/direct-lending"
            }
        ]
        
        eligible = []
        for loan in all_loans:
            is_eligible = score >= loan["min_score"]
            # Add sales check for larger loans
            if loan["id"] == "msme-exp" and sales < 500000: is_eligible = False
            
            eligible.append({
                **loan,
                "is_eligible": is_eligible,
                "match_reason": "High credit score" if is_eligible else f"Requires score of {loan['min_score']}+"
            })
            
        return eligible

    @staticmethod
    def get_roadmap(score: int) -> list:
        if score < 500:
            return [
                {"step": 1, "task": "Consolidate High-Interest Debt", "impact": "High", "desc": "Move your overdraft balances to a lower interest term loan to save interest."},
                {"step": 2, "task": "Improve GST Hygiene", "desc": "Ensure all GSTR filings are on time for 3 consecutive months to build bank trust."},
                {"step": 3, "task": "Reduce Personal Withdrawals", "desc": "Focus on keeping more cash in the business account to improve the DSCR ratio."}
            ]
        elif score < 750:
            return [
                {"step": 1, "task": "Negotiate Vendor Terms", "impact": "Medium", "desc": "Extend payment terms with current suppliers to keep cash in hand longer."},
                {"step": 2, "task": "Diversify Revenue Streams", "desc": "Ensure no single customer accounts for more than 40% of total sales."},
                {"step": 3, "task": "Build Fixed Asset History", "desc": "Start reporting asset depreciation correctly to show long-term business stability."}
            ]
        else:
            return [
                {"step": 1, "task": "Apply for Priority Sector Lending", "impact": "High", "desc": "Leverage your high score to get interest rates below 9% through SIDBI."},
                {"step": 2, "task": "Prepare for Equity Round", "desc": "Your debt-to-equity ratio is perfect for attracting angel or institutional investors."},
                {"step": 3, "task": "Establish International Credit", "desc": "Look into LoCs for export-import to scale your business globally."}
            ]
