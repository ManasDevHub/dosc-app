import sys
import os

path = os.path.join("C:\\Users\\patil\\.gemini\\antigravity\\scratch\\dosc-app\\js", "app.js")

with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace \${ with ${
content = content.replace('\\${', '${')

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print("Fixed template literals in app.js")
