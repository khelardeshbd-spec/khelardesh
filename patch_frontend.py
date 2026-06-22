import re

with open("app/(frontend)/article/[slug]/page.tsx", "r") as f:
    text = f.read()

text = text.replace(
    r"const adsterraMatch = para.match(/^\[ADSTERRA:\s*(.+?)\]$/);",
    "const adsterraMatch = para.match(/^\\[ADSTERRA(?:\\:\\s*(.+?))?\\]$/);"
)

text = text.replace(
    "<AdsterraAd htmlCode={safeB64Decode(adsterraMatch[1])} />",
    "<AdsterraAd htmlCode={adsterraMatch[1] ? safeB64Decode(adsterraMatch[1]) : ''} type=\"article\" />"
)

with open("app/(frontend)/article/[slug]/page.tsx", "w") as f:
    f.write(text)
print("Frontend patch applied")
