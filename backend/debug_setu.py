import requests
import os
from dotenv import load_dotenv
import uuid
from datetime import datetime, timedelta

load_dotenv()

def test_setu_auth():
    client_id = os.getenv("SETU_CLIENT_ID")
    client_secret = os.getenv("SETU_CLIENT_SECRET")
    base_url = "https://fiu-sandbox.setu.co"
    
    print(f"Testing with ID: {client_id}")
    
    # 1. Test Auth
    auth_url = f"{base_url}/auth/token"
    payload = {
        "client_id": client_id,
        "client_secret": client_secret
    }
    
    try:
        resp = requests.post(auth_url, json=payload)
        print(f"Auth Status: {resp.status_code}")
        if resp.status_code != 200:
            print(f"Auth Error: {resp.text}")
            return
            
        token = resp.json().get("access_token")
        
        # 2. Test Consent
        consent_url = f"{base_url}/consents"
        consent_payload = {
            "Detail": {
                "consentStart": datetime.utcnow().isoformat() + "Z",
                "consentExpiry": (datetime.utcnow() + timedelta(days=365)).isoformat() + "Z",
                "customer": {"id": "9999999999@setu"},
                "FIDataRange": {
                    "from": "2023-04-01T00:00:00Z",
                    "to": "2024-04-01T00:00:00Z"
                },
                "consentMode": "STORE",
                "fetchType": "PERIODIC",
                "consentTypes": ["TRANSACTIONS"],
                "fiTypes": ["DEPOSIT"],
                "DataConsumer": {"id": client_id},
                "Purpose": {
                    "code": "101",
                    "refUri": "https://api.rebit.org.in/purpose/101.xml",
                    "text": "Analysis",
                    "Category": {"type": "string"}
                },
                "DataLife": {"unit": "MONTH", "value": 1},
                "Frequency": {"unit": "HOUR", "value": 1}
            }
        }
        
        headers = {
            "Authorization": f"Bearer {token}",
            "x-client-id": client_id,
            "x-request-id": str(uuid.uuid4())
        }
        
        resp_cons = requests.post(consent_url, json=consent_payload, headers=headers)
        print(f"Consent Status: {resp_cons.status_code}")
        print(f"Consent Response: {resp_cons.text}")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_setu_auth()
