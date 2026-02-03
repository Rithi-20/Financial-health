import requests
import os
from dotenv import load_dotenv

load_dotenv()

def test_product_id_on_token():
    client_id = os.getenv("SETU_CLIENT_ID")
    client_secret = os.getenv("SETU_CLIENT_SECRET")
    product_id = os.getenv("SETU_PRODUCT_ID")
    base_url = "https://fiu-sandbox.setu.co"
    
    url = f"{base_url}/auth/token"
    payload = {
        "client_id": client_id,
        "client_secret": client_secret
    }
    headers = {
        "x-product-instance-id": product_id
    }
    
    print(f"Testing Product ID header on {url}")
    resp = requests.post(url, json=payload, headers=headers)
    print(f"Status: {resp.status_code}")
    print(f"Response: {resp.text}")

if __name__ == "__main__":
    test_product_id_on_token()
