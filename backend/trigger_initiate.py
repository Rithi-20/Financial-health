import requests
resp = requests.post("http://127.0.0.1:8000/api/banking/setu/initiate", json={"vua": "9999999999@setu"})
print(f"Status: {resp.status_code}")
print(f"Body: {resp.text}")
