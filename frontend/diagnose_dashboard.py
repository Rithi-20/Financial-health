path = r"c:/Users/admin/Desktop/financial health/frontend/src/components/Dashboard.jsx"
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

print(f"Total Length: {len(c)}")
print(f"Open <div: {c.count('<div')}")
print(f"Close </div: {c.count('</div')}")
print(f"Open (: {c.count('(')}")
print(f"Close ): {c.count(')')}")
print(f"Open {{: {c.count('{')}")
print(f"Close }}: {c.count('}')}")

# Check the end of the file
print("\n--- Last 20 lines ---")
print('\n'.join(c.splitlines()[-20:]))
