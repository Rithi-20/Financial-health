import requests
import os
from dotenv import load_dotenv

load_dotenv()

def test_grant_type():
    client_id = os.getenv("SETU_CLIENT_ID")
    client_secret = os.getenv("SETU_CLIENT_SECRET")
    
    for url in ["https://fiu-sandbox.setu.co/auth/token", "https://bridge.setu.co/auth/token"]:
        print(f"\nTesting {url} with grant_type")
        payload = {
            "grant_type": "client_credentials",
            "client_id": client_id,
            "client_secret": client_secret
        }
        resp = requests.post(url, data=payload)
        print(f"Status: {resp.status_code}")
        print(f"Response: {resp.text}")

if __name__ == "__main__":
    test_grant_type()
