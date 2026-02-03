import requests
import os
from dotenv import load_dotenv

load_dotenv()

def test_headers_on_token():
    client_id = os.getenv("SETU_CLIENT_ID")
    client_secret = os.getenv("SETU_CLIENT_SECRET")
    base_url = "https://fiu-sandbox.setu.co"
    
    url = f"{base_url}/auth/token"
    headers = {
        "x-client-id": client_id,
        "x-client-secret": client_secret
    }
    
    print(f"Testing Headers on {url}")
    resp = requests.post(url, headers=headers)
    print(f"Status: {resp.status_code}")
    print(f"Response: {resp.text}")

if __name__ == "__main__":
    test_headers_on_token()
