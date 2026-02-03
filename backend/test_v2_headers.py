import requests
import os
from dotenv import load_dotenv
import uuid
from datetime import datetime, timedelta

load_dotenv()

def test_v2_headers():
    client_id = os.getenv("SETU_CLIENT_ID")
    client_secret = os.getenv("SETU_CLIENT_SECRET")
    product_id = os.getenv("SETU_PRODUCT_ID")
    base_url = "https://fiu-sandbox.setu.co"
    
    print(f"Testing with Product ID: {product_id}")
    
    # In V2, try using headers directly on the /consents endpoint
    consent_url = f"{base_url}/consents"
    consent_payload = {
        "Detail": {
            "consentStart": datetime.utcnow().isoformat() + "Z",
            "consentExpiry": (datetime.utcnow() + timedelta(days=365)).isoformat() + "Z",
            "customer": {"id": "9999999999@setu"},
            "FIDataRange": {
                "from": "2023-01-01T00:00:00Z",
                "to": "2024-01-01T00:00:00Z"
            },
            "consentMode": "STORE",
            "fetchType": "PERIODIC",
            "consentTypes": ["TRANSACTIONS", "PROFILE", "SUMMARY"],
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
        "x-client-id": client_id,
        "x-client-secret": client_secret,
        "x-product-instance-id": product_id, # This is the key field for V2
        "x-request-id": str(uuid.uuid4()),
        "Content-Type": "application/json"
    }
    
    try:
        print(f"Calling {consent_url} with V2 headers...")
        resp = requests.post(consent_url, json=consent_payload, headers=headers)
        print(f"Status: {resp.status_code}")
        print(f"Response: {resp.text}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_v2_headers()
