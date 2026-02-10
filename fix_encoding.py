
import codecs
import sys

filename = r'c:\Users\zxc\Desktop\gaya\gaya-frontend\catalog.html'

try:
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if content.startswith('\ufeff'):
        content = content[1:]
        
    # Attempt to recover original bytes
    # Use replace to handle unmapped chars
    recovered_bytes = content.encode('cp1251', errors='replace')
    fixed_content = recovered_bytes.decode('utf-8')
    
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(fixed_content)
        
    print("Successfully fixed encoding.")
except Exception as e:
    # Print error safely (encode to ascii with backslashreplace to avoid console encoding issues)
    print(f"Error: {str(e).encode('ascii', 'backslashreplace').decode('ascii')}")
