import re

with open("app/(admin)/admin/sponsors/SponsorsClient.tsx", "r") as f:
    text = f.read()

text = text.replace("await onSave('', '', isActive, true);", "await onSave('', '', true);")
text = text.replace("await onSave(initialImageUrl, initialCtaUrl, isActive, next);", "await onSave(initialImageUrl, initialCtaUrl, next);")
# Let me just check the types:
# BannerCropper onSave: (imageUrl: string, ctaUrl: string, useAdsterra: boolean) => Promise<void>;
# HomepageBannerManager onSave: (imageUrl: string, ctaUrl: string, isActive: boolean, useAdsterra: boolean) => Promise<void>;

with open("app/(admin)/admin/sponsors/SponsorsClient.tsx", "w") as f:
    f.write(text)
print("Patch applied")
