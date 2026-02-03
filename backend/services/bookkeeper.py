from openai import AsyncOpenAI
import os
import time
from typing import List, Dict

class BookkeeperAgent:
    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY")
        self.client = AsyncOpenAI(api_key=self.api_key) if self.api_key else None
        self._cache = {} # Simple in-memory cache

    async def generate_business_alerts(self, metrics: dict) -> list:
        """
        Generates dynamic business alerts using LLM. Includes caching to avoid long loading times.
        """
        # 1. Check Cache
        cache_key = str(metrics)
        if cache_key in self._cache:
            entry = self._cache[cache_key]
            if time.time() - entry['timestamp'] < 300: # 5 min cache
                return entry['data']

        # 2. Check Client
        if not self.client:
            self.api_key = os.getenv("OPENAI_API_KEY")
            if self.api_key:
                self.client = AsyncOpenAI(api_key=self.api_key)
        
        if not self.client:
            return ["Alert: Cash runway is healthy.", "Optimization: Review overhead."]
        
        try:
            import asyncio
            prompt = f"Act as a CFO. Give 3 short, actionable alerts for an SME owner with these metrics: {metrics}. Format: one per line."
            
            # 3. Bulletproof Async call with hard timeout
            response = await asyncio.wait_for(
                self.client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=[{"role": "user", "content": prompt}],
                    max_tokens=150
                ),
                timeout=5.0
            )
            
            content = response.choices[0].message.content
            alerts = [a.strip('• -1234. ') for a in content.split('\n') if a.strip()]
            
            # 4. Store in Cache
            self._cache[cache_key] = {
                'data': alerts[:4],
                'timestamp': time.time()
            }
            return alerts[:4]
        except Exception as e:
            print(f"LLM Error: {e}")
            return ["Review operational overhead for potential savings."]

    def _mock_categorization(self, transactions: List[Dict]) -> List[Dict]:
        """
        Simple rule-based categorization for demo/free mode.
        """
        results = []
        rules = {
            "uber": "Travel",
            "starbucks": "Meals & Entertainment",
            "amazon": "Office Supplies",
            "salary": "Payroll",
            "rent": "Rent_Expense"
        }
        
        for tx in transactions:
            desc = str(tx.get("description", "")).lower()
            category = "Uncategorized"
            confidence = 0.5
            
            for key, val in rules.items():
                if key in desc:
                    category = val
                    confidence = 0.95
                    break
            
            results.append({
                **tx,
                "normalized_category": category,
                "confidence": confidence
            })
        return results
