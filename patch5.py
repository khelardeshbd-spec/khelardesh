import re

with open("app/(admin)/admin/sponsors/SponsorsClient.tsx", "r") as f:
    text = f.read()

text = text.replace("await onSave(imageUrl, ctaUrl, false, '');", "await onSave(imageUrl, ctaUrl, false);")
text = text.replace("await onSave(imageUrl, ctaUrl, isActive, false, '');", "await onSave(imageUrl, ctaUrl, isActive, false);")
text = text.replace("await onSave(data.url, ctaUrl, isActive, false, '');", "await onSave(data.url, ctaUrl, isActive, false);")

with open("app/(admin)/admin/sponsors/SponsorsClient.tsx", "w") as f:
    f.write(text)
print("Patch applied")
