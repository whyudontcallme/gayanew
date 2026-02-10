
filename = r'c:\Users\zxc\Desktop\gaya\gaya-frontend\catalog.html'

try:
    with open(filename, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    # Keep lines 1-1700 (index 0-1699) -> slice [:1700]
    # Skip lines 1701-2222 (index 1700-2221)
    # Keep lines 2223-End (index 2222-) -> slice [2222:]
    
    new_lines = lines[:1700] + lines[2222:]
    
    with open(filename, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
        
    print("Successfully processed file.")
    
except Exception as e:
    print(f"Error: {e}")
