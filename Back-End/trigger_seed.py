import requests
try:
    r = requests.post("http://localhost:8000/api/admin/seed-archive")
    print(r.status_code)
    print(r.json())
except Exception as e:
    print(f"Error: {e}")
