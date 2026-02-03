class IndustryAnalyzer:
    # Expanded Benchmark data for 15 industries
    BENCHMARKS = {
        "Manufacturing": {
            "quick_ratio": 1.2,
            "net_margin": 0.10,
            "dscr": 1.5,
            "inventory_turnover": 6.0,
            "description": "Capital intensive, high inventory requirements."
        },
        "Services/IT": {
            "quick_ratio": 2.0,
            "net_margin": 0.25,
            "dscr": 2.5,
            "inventory_turnover": 0,
            "description": "High margins, low physical assets, talent focused."
        },
        "Retail": {
            "quick_ratio": 0.8,
            "net_margin": 0.05,
            "dscr": 1.2,
            "inventory_turnover": 12.0,
            "description": "High volume, low margin, fast inventory movement."
        },
        "Healthcare": {
            "quick_ratio": 1.5,
            "net_margin": 0.18,
            "dscr": 2.0,
            "inventory_turnover": 8.0,
            "description": "Regulated sector, high compliance costs, stable margins."
        },
        "Food & Beverage": {
            "quick_ratio": 1.0,
            "net_margin": 0.08,
            "dscr": 1.4,
            "inventory_turnover": 15.0,
            "description": "Perishable inventory, fast turnover, low margins."
        },
        "Construction": {
            "quick_ratio": 0.9,
            "net_margin": 0.06,
            "dscr": 1.3,
            "inventory_turnover": 4.0,
            "description": "Project-based, high receivables, cyclical demand."
        },
        "E-commerce": {
            "quick_ratio": 1.3,
            "net_margin": 0.03,
            "dscr": 1.1,
            "inventory_turnover": 20.0,
            "description": "High volume, ultra-low margins, tech-enabled."
        },
        "Hospitality": {
            "quick_ratio": 0.7,
            "net_margin": 0.12,
            "dscr": 1.4,
            "inventory_turnover": 25.0,
            "description": "Asset-heavy, seasonal demand, service-focused."
        },
        "Education": {
            "quick_ratio": 1.8,
            "net_margin": 0.15,
            "dscr": 2.2,
            "inventory_turnover": 1.0,
            "description": "Recurring revenue, low inventory, relationship-driven."
        },
        "Agriculture": {
            "quick_ratio": 0.6,
            "net_margin": 0.04,
            "dscr": 1.0,
            "inventory_turnover": 3.0,
            "description": "Seasonal, weather-dependent, government-subsidized."
        },
        "Real Estate": {
            "quick_ratio": 0.5,
            "net_margin": 0.20,
            "dscr": 1.2,
            "inventory_turnover": 0.5,
            "description": "Capital intensive, long holding periods, high margins."
        },
        "Logistics": {
            "quick_ratio": 1.1,
            "net_margin": 0.07,
            "dscr": 1.6,
            "inventory_turnover": 30.0,
            "description": "Asset-heavy, volume-driven, tight margins."
        },
        "Automotive": {
            "quick_ratio": 1.0,
            "net_margin": 0.08,
            "dscr": 1.4,
            "inventory_turnover": 8.0,
            "description": "Dealer-based, high inventory, financing-dependent."
        },
        "Textiles": {
            "quick_ratio": 0.9,
            "net_margin": 0.06,
            "dscr": 1.3,
            "inventory_turnover": 6.0,
            "description": "Labor-intensive, seasonal demand, export-oriented."
        },
        "Pharma": {
            "quick_ratio": 1.6,
            "net_margin": 0.22,
            "dscr": 2.3,
            "inventory_turnover": 5.0,
            "description": "Regulated, R&D intensive, high margins."
        },
        "Default": {
            "quick_ratio": 1.5,
            "net_margin": 0.15,
            "dscr": 1.8,
            "inventory_turnover": 4.0,
            "description": "Standard business growth profile."
        }
    }

    @staticmethod
    def identify_industry(company_name: str, transactions: list) -> str:
        name = company_name.lower()
        
        # Tech/IT/Services
        if any(k in name for k in ['tech', 'soft', 'solution', 'digital', 'IT', 'cyber', 'cloud']):
            return "Services/IT"
        
        # Manufacturing
        if any(k in name for k in ['steel', 'cloth', 'factory', 'industries', 'engineering', 'chemicals']):
            return "Manufacturing"
        
        # Retail
        if any(k in name for k in ['mart', 'store', 'retail', 'shop', 'bazaar', 'kirana']):
            return "Retail"
        
        # Healthcare
        if any(k in name for k in ['hospital', 'clinic', 'medical', 'diagnostic', 'pharma', 'health']):
            # Check if pharma specific
            if any(k in name for k in ['pharma', 'drug', 'medicine']):
                return "Pharma"
            return "Healthcare"
        
        # Food & Beverage
        if any(k in name for k in ['food', 'restaurant', 'cafe', 'catering', 'bakery', 'hotel']):
            # Check if hospitality
            if any(k in name for k in ['hotel', 'resort', 'guest']):
                return "Hospitality"
            return "Food & Beverage"
        
        # Construction
        if any(k in name for k in ['construction', 'builder', 'infra', 'contractor']):
            return "Construction"
        
        # E-commerce
        if any(k in name for k in ['ecommerce', 'online', 'marketplace', 'e-com']):
            return "E-commerce"
        
        # Education
        if any(k in name for k in ['school', 'college', 'education', 'academy', 'coaching', 'institute']):
            return "Education"
        
        # Agriculture
        if any(k in name for k in ['agri', 'farm', 'crop', 'dairy', 'poultry']):
            return "Agriculture"
        
        # Real Estate
        if any(k in name for k in ['real estate', 'property', 'realty', 'developer']):
            return "Real Estate"
        
        # Logistics
        if any(k in name for k in ['logistics', 'transport', 'courier', 'shipping', 'freight']):
            return "Logistics"
        
        # Automotive
        if any(k in name for k in ['auto', 'motor', 'vehicle', 'garage', 'cars']):
            return "Automotive"
        
        # Textiles
        if any(k in name for k in ['textile', 'garment', 'fashion', 'apparel', 'fabric']):
            return "Textiles"
        
        # Check transaction descriptions
        all_desc = " ".join([str(t.get('description', '')).lower() for t in transactions])
        if 'server' in all_desc or 'saas' in all_desc: return "Services/IT"
        if 'raw material' in all_desc or 'machinery' in all_desc: return "Manufacturing"
        if 'medicine' in all_desc or 'drug' in all_desc: return "Pharma"
        if 'transport' in all_desc or 'delivery' in all_desc: return "Logistics"
        
        return "Default"

    @classmethod
    def get_comparison(cls, industry: str, user_metrics: dict):
        base = cls.BENCHMARKS.get(industry, cls.BENCHMARKS["Default"])
        
        return {
            "industry": industry,
            "description": base["description"],
            "comparisons": [
                {"metric": "Net Margin", "user": round(user_metrics.get('net_margin', 0) * 100, 1), "industry": base["net_margin"] * 100},
                {"metric": "DSCR", "user": round(user_metrics.get('dscr', 0), 2), "industry": base["dscr"]},
                {"metric": "Quick Ratio", "user": round(user_metrics.get('quick_ratio', 1.0), 2), "industry": base["quick_ratio"]},
            ]
        }
