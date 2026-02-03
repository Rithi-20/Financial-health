import requests
import os
from dotenv import load_dotenv

load_dotenv()

def probe_urls():
    client_id = os.getenv("SETU_CLIENT_ID")
    client_secret = os.getenv("SETU_CLIENT_SECRET")
    
    urls = [
        "https://fiu-sandbox.setu.co/auth/token",
        "https://fiu-sandbox.setu.co/v2/auth/token",
        "https://bridge.setu.co/auth/token",
        "https://bridge.setu.co/v2/auth/token"
    ]
    
    payload = {"client_id": client_id, "client_secret": client_secret}
    
    for url in urls:
        print(f"\n--- Probing {url} ---")
        try:
            # 1. Try JSON Body
            resp = requests.post(url, json=payload, timeout=5)
            print(f"JSON Body Status: {resp.status_code}")
            if resp.status_code == 200:
                print(f"SUCCESS with JSON Body: {resp.json().keys()}")
                continue
            
            # 2. Try Form Data
            resp = requests.post(url, data=payload, timeout=5)
            print(f"Form Data Status: {resp.status_code}")
            if resp.status_code == 200:
                print("SUCCESS with Form Data")
                continue
                
            # 3. Try Basic Auth
            resp = requests.post(url, auth=(client_id, client_secret), timeout=5)
            print(f"Basic Auth Status: {resp.status_code}")
            if resp.status_code == 200:
                 print("SUCCESS with Basic Auth")
                 continue
                 
        except Exception as e:
            print(f"Error probing {url}: {e}")

if __name__ == "__main__":
    probe_urls()
