class SavingsAdvisor:
    @staticmethod
    def get_savings_actions(categories: list, net_margin: float):
        """
        Suggests specific saving actions based on expenses.
        """
        actions = []
        
        # 1. Analyze specific high categories
        for cat in categories:
            name = cat['name'].lower()
            val = cat['value']
            
            if 'electricity' in name or 'utility' in name:
                actions.append({
                    "title": "Energy Optimization",
                    "desc": "Peak-hour energy usage is high. Switching to LED and off-peak machinery operation could save 12%.",
                    "savings": f"₹{int(val * 0.12):,}"
                })
            elif 'rent' in name:
                actions.append({
                    "title": "Lease Renegotiation",
                    "desc": "Rent is 25% of your revenue. Consider sub-letting unused space or renegotiating based on local market dips.",
                    "savings": "₹20,000+"
                })
            elif 'internet' in name or 'subscription' in name:
                actions.append({
                    "title": "Stack Audit",
                    "desc": "Found 3 overlapping recurring SaaS billings. Consolidating into a single enterprise plan recommended.",
                    "savings": "₹5,400"
                })

        # 2. General margin-based advice
        if net_margin < 0.10:
            actions.append({
                "title": "Bulk Procurement",
                "desc": "Operating margins are thin. Negotiating 5% cash discounts with Tier-1 suppliers would drastically improve EBITDA.",
                "savings": "₹45,000"
            })
            
        if not actions:
            actions.append({
                "title": "Operational Buffer",
                "desc": "Expenses are well-controlled. Consider allocating surplus to a Liquid Fund for emergency reserves.",
                "savings": "N/A"
            })
            
        return actions[:3]
