import requests
import os
from dotenv import load_dotenv
import uuid
from datetime import datetime, timedelta

load_dotenv()

def test_full_flow():
    client_id = os.getenv("SETU_CLIENT_ID")
    client_secret = os.getenv("SETU_CLIENT_SECRET")
    base_url = "https://fiu-sandbox.setu.co"
    
    print(f"Using Client ID: {client_id}")
    
    # 1. Get Token
    auth_url = f"{base_url}/auth/token"
    auth_payload = {"client_id": client_id, "client_secret": client_secret}
    
    print(f"Requesting token from {auth_url}...")
    auth_resp = requests.post(auth_url, json=auth_payload)
    print(f"Auth Response Status: {auth_resp.status_code}")
    
    if auth_resp.status_code != 200:
        print(f"Auth Failed: {auth_resp.text}")
        return

    token = auth_resp.json().get("access_token")
    print("Token obtained successfully.")

    # 2. Create Consent
    consent_url = f"{base_url}/consents"
    # Format suggested by Setu AA V2
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
                "text": "Financial Health Assessment",
                "Category": {"type": "string"}
            },
            "DataLife": {"unit": "MONTH", "value": 1},
            "Frequency": {"unit": "HOUR", "value": 1}
        }
    }
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
        "x-client-id": client_id,
        "x-request-id": str(uuid.uuid4())
    }
    
    print(f"Creating consent at {consent_url}...")
    consent_resp = requests.post(consent_url, json=consent_payload, headers=headers)
    print(f"Consent Response Status: {consent_resp.status_code}")
    print(f"Consent Response Body: {consent_resp.text}")

if __name__ == "__main__":
    test_full_flow()
