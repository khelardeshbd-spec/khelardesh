import re

with open("app/(admin)/admin/sponsors/SponsorsClient.tsx", "r") as f:
    text = f.read()

# Remove initialAdsterraCode props from BannerCropper and HomepageBannerManager calls
text = re.sub(r"\s*initialAdsterraCode=\{[^\}]+\}", "", text)

# Remove adsterraCode references in handleSave
text = re.sub(r"if \(\!adsterraCode \|\| \!adsterraCode\.trim\(\)\) \{\n\s*alert\('Adsterra script code is required\.'\);\n\s*return;\n\s*\}\n\s*await onSave\('', '', true, adsterraCode\);", "await onSave('', '', true);", text)
text = re.sub(r"if \(\!adsterraCode \|\| \!adsterraCode\.trim\(\)\) \{\n\s*alert\('Adsterra script code is required\.'\);\n\s*return;\n\s*\}\n\s*await onSave\('', '', isActive, true, adsterraCode\);", "await onSave('', '', isActive, true);", text)
text = re.sub(r"await onSave\('', '', true, adsterraCode\);", "await onSave('', '', true);", text)
text = re.sub(r"await onSave\('', '', isActive, true, adsterraCode\);", "await onSave('', '', isActive, true);", text)
text = re.sub(r"await onSave\(uploadData\.url, ctaUrl, false, ''\);", "await onSave(uploadData.url, ctaUrl, false);", text)

text = re.sub(r"await onSave\(initialImageUrl, initialCtaUrl, isActive, next, ''\);", "await onSave(initialImageUrl, initialCtaUrl, isActive, next);", text)

# Fix onSave error 
text = text.replace("await onSave(uploadData.url, ctaUrl, false, '');", "await onSave(uploadData.url, ctaUrl, false);")
text = text.replace("await onSave(initialImageUrl, initialCtaUrl, next, '');", "await onSave(initialImageUrl, initialCtaUrl, next);")

text = text.replace("(initialImageUrl || (initialUseAdsterra && initialAdsterraCode))", "(initialImageUrl || initialUseAdsterra)")

with open("app/(admin)/admin/sponsors/SponsorsClient.tsx", "w") as f:
    f.write(text)
print("Patch applied")
