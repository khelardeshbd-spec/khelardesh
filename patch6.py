import re

with open("app/(admin)/admin/sponsors/SponsorsClient.tsx", "r") as f:
    lines = f.readlines()

lines[814] = lines[814].replace("await onSave('', '', true);", "await onSave('', '', isActive, true);")
lines[939] = lines[939].replace("await onSave(initialImageUrl, initialCtaUrl, next);", "await onSave(initialImageUrl, initialCtaUrl, isActive, next);")

with open("app/(admin)/admin/sponsors/SponsorsClient.tsx", "w") as f:
    f.writelines(lines)
print("Patch applied")
