import requests
import os
from dotenv import load_dotenv

load_dotenv()

def test_setu_bridge():
    client_id = os.getenv("SETU_CLIENT_ID")
    client_secret = os.getenv("SETU_CLIENT_SECRET")
    
    # Try Bridge URL
    url = "https://bridge.setu.co/auth/token"
    payload = {
        "client_id": client_id,
        "client_secret": client_secret
    }
    
    try:
        print(f"Testing Bridge URL: {url}")
        resp = requests.post(url, json=payload)
        print(f"Status: {resp.status_code}")
        print(f"Response: {resp.text}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_setu_bridge()
