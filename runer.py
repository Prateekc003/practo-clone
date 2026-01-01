import requests

url = "https://doctor-finding.onrender.com/predict"

data = {
    "symptoms": "Heart problem,BP",
    "address": "Harihar, Karnataka"
}

response = requests.post(url, json=data)

print("Status code:", response.status_code)
print("Raw response text:")
print(response.text)
