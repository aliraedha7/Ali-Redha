import json

# Read data_store.json to make sure all seed data is loaded
with open('data_store.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"Loaded data with {len(data.get('assets', []))} assets, {len(data.get('hangars', []))} hangars, {len(data.get('users', []))} users")
