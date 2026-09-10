# -*- coding: utf-8 -*-
import json
import sys

# Verify data_store.json has our full dataset
with open('data_store.json', 'r', encoding='utf-8') as f:
    store = json.load(f)

print(f"Data verified: {len(store.get('assets', []))} assets, {len(store.get('hangars', []))} hangars, {len(store.get('users', []))} users, {len(store.get('shift_logs', []))} shift logs")
