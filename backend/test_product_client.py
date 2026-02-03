import requests
import os
from dotenv import load_dotenv

load_dotenv()

def test_product_as_client():
    client_id = os.getenv("SETU_PRODUCT_ID") # Using Product ID as Client ID
    client_secret = os.getenv("SETU_CLIENT_SECRET")
    base_url = "https://fiu-sandbox.setu.co"
    
    url = f"{base_url}/auth/token"
    payload = {
        "client_id": client_id,
        "client_secret": client_secret
    }
    
    print(f"Testing Product ID as Client ID on {url}")
    resp = requests.post(url, json=payload)
    print(f"Status: {resp.status_code}")
    print(f"Response: {resp.text}")

if __name__ == "__main__":
    test_product_as_client()
