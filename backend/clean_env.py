with open('.env', 'r') as f:
    lines = f.readlines()

with open('.env', 'w') as f:
    for line in lines:
        if '=' in line:
            key, val = line.split('=', 1)
            f.write(f"{key.strip()}={val.strip()}\n")
        else:
            f.write(line)
print("Cleaned .env file")
