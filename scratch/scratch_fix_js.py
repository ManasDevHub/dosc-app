import os

path = "C:\\Users\\patil\\.gemini\\antigravity\\scratch\\dosc-app\\js\\app.js"
with open(path, "r", encoding="utf-8") as f:
    text = f.read()

# Replace \` with `
text = text.replace('\\`', '`')

# Replace \${ with ${
text = text.replace('\\${', '${')

with open(path, "w", encoding="utf-8") as f:
    f.write(text)

print("Fixed literal escapes in js")
