import re

with open("app/(admin)/admin/sponsors/SponsorsClient.tsx", "r") as f:
    text = f.read()

# 1. Update onSave types
text = text.replace("onSave: (imageUrl: string, ctaUrl: string, useAdsterra: boolean, adsterraCode: string) => Promise<void>;", "onSave: (imageUrl: string, ctaUrl: string, useAdsterra: boolean) => Promise<void>;")
text = text.replace("onSave: (imageUrl: string, ctaUrl: string, isActive: boolean, useAdsterra: boolean, adsterraCode: string) => Promise<void>;", "onSave: (imageUrl: string, ctaUrl: string, isActive: boolean, useAdsterra: boolean) => Promise<void>;")

# 2. Update function signatures
text = re.sub(
    r"async function handleSaveBanner\([\s\S]*?\)",
    "async function handleSaveBanner(\n    placement: 'header-left' | 'header-right' | 'homepage-banner-1' | 'homepage-banner-2' | 'homepage-banner-3' | 'homepage-banner-4' | 'homepage-banner-5' | 'homepage-banner-6',\n    newImageUrl: string,\n    newCtaUrl: string,\n    newIsActive: boolean = true,\n    useAdsterra: boolean = false\n  )",
    text,
    count=1
)

text = re.sub(
    r"function BannerCropper\([^)]+\)",
    "function BannerCropper({ label, placement, initialImageUrl, initialCtaUrl, initialUseAdsterra, onSave, onDelete, saving }: BannerCropperProps)",
    text,
    count=1
)

text = re.sub(
    r"function HomepageBannerManager\([^)]+\)",
    "function HomepageBannerManager({ label, placement, initialImageUrl, initialCtaUrl, initialIsActive, initialUseAdsterra, onSave, onToggle, onDelete, saving }: HomepageBannerManagerProps)",
    text,
    count=1
)

text = text.replace("initialAdsterraCode: string;\n", "")

# 3. Remove adsterraCode from handleSaveBanner calls
text = re.sub(r"onSave=\{\(img, link, useAdsterra, adsterraCode\) => handleSaveBanner\('header-left', img, link, true, useAdsterra, adsterraCode\)\}", "onSave={(img, link, useAdsterra) => handleSaveBanner('header-left', img, link, true, useAdsterra)}", text)
text = re.sub(r"onSave=\{\(img, link, useAdsterra, adsterraCode\) => handleSaveBanner\('header-right', img, link, true, useAdsterra, adsterraCode\)\}", "onSave={(img, link, useAdsterra) => handleSaveBanner('header-right', img, link, true, useAdsterra)}", text)

for i in range(1, 7):
    text = re.sub(
        rf"onSave=\{{\(img, link, active, useAdsterra, adsterraCode\) => handleSaveBanner\('homepage-banner-{i}', img, link, active, useAdsterra, adsterraCode\)\}}",
        f"onSave={{(img, link, active, useAdsterra) => handleSaveBanner('homepage-banner-{i}', img, link, active, useAdsterra)}}",
        text
    )

# 4. Remove useAdsterra error check in handleSaveBanner
text = re.sub(
    r"    if \(useAdsterra && \(!adsterraCode \|\| !adsterraCode\.trim\(\)\)\) \{\n      setError\('Adsterra script code is required when Use Adsterra is active\.'\);\n      return;\n    \}\n",
    "",
    text
)

# 5. Fix the JSON payload
text = text.replace("adsterraCode\n        })", "adsterraCode: ''\n        })")
text = text.replace("adsterraCode: existing?.adsterraCode || ''\n        })", "adsterraCode: ''\n        })")

# 6. Remove initialAdsterraCode from dependency arrays and states
text = text.replace(", initialAdsterraCode", "")
text = text.replace("const [adsterraCode, setAdsterraCode] = useState(initialAdsterraCode);\n", "")
text = text.replace("setAdsterraCode(initialAdsterraCode);\n", "")

# 7. Update handleSave functions
text = re.sub(
    r"  const handleSave = async \(\) => \{\n    if \(useAdsterra\) \{\n      if \(!adsterraCode \|\| !adsterraCode\.trim\(\)\) \{\n        alert\('Adsterra script code is required\.'\);\n        return;\n      \}\n      await onSave\('', '', true, adsterraCode\);\n      return;\n    \}",
    "  const handleSave = async () => {\n    if (useAdsterra) {\n      await onSave('', '', true);\n      return;\n    }",
    text
)

text = re.sub(
    r"  const handleSave = async \(\) => \{\n    if \(useAdsterra\) \{\n      if \(!adsterraCode \|\| !adsterraCode\.trim\(\)\) \{\n        alert\('Adsterra script code is required\.'\);\n        return;\n      \}\n      await onSave\('', '', isActive, true, adsterraCode\);\n      return;\n    \}",
    "  const handleSave = async () => {\n    if (useAdsterra) {\n      await onSave('', '', isActive, true);\n      return;\n    }",
    text
)

text = text.replace("await onSave(uploadData.url, ctaUrl, false, '');", "await onSave(uploadData.url, ctaUrl, false);")

# 8. Remove textarea blocks
textarea_block1 = """      {useAdsterra ? (
        <div style={{ marginBottom: 20 }}>
          <span style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: 'var(--ink-muted)', display: 'block', marginBottom: 6 }}>
            Adsterra Script Code
          </span>
          <textarea
            value={adsterraCode}
            onChange={(e) => setAdsterraCode(e.target.value)}
            placeholder="Paste your <script>...</script> code from Adsterra here"
            rows={6}
            style={{ 
              width: '100%', 
              padding: '10px 12px', 
              border: '1px solid var(--ink-border)', 
              background: 'var(--bg-surface)', 
              color: 'var(--ink)', 
              fontFamily: 'monospace', 
              fontSize: 12, 
              borderRadius: 4
            }}
            required
          />
        </div>
      ) : ("""

text = text.replace(textarea_block1, "      {!useAdsterra && (")

# 9. Update UseAdsterra toggle
old_toggle1 = """      <div className="mb-6 flex items-center justify-between p-3 bg-amber-50/50 border border-amber-200/50 rounded-md">
        <div>
          <span className="block text-xs font-bold text-amber-800">Use Adsterra script</span>
          <span className="block text-[10px] text-amber-600">Loads third-party banner code instead of local image</span>
        </div>
        <input 
          type="checkbox" 
          checked={useAdsterra} 
          onChange={(e) => setUseAdsterra(e.target.checked)} 
          className="w-4 h-4 text-amber-600 border-amber-300 rounded focus:ring-amber-500 cursor-pointer"
        />
      </div>"""

new_toggle1 = """      <div className="mb-6 flex items-center justify-between p-3 bg-amber-50/50 border border-amber-200/50 rounded-md">
        <div>
          <span className="block text-xs font-bold text-amber-800">Use Adsterra ad</span>
          <span className="block text-[10px] text-amber-600">Automatically loads the Adsterra banner for this slot</span>
        </div>
        <div
          role="switch"
          aria-checked={useAdsterra}
          onClick={async () => {
            if (saving) return;
            const next = !useAdsterra;
            setUseAdsterra(next);
            await onSave(initialImageUrl, initialCtaUrl, next);
          }}
          style={{
            width: 42, height: 24, borderRadius: 12,
            backgroundColor: useAdsterra ? '#f59e0b' : '#ccc',
            position: 'relative', cursor: saving ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s',
            flexShrink: 0
          }}
        >
          <div style={{
            width: 18, height: 18, borderRadius: '50%', backgroundColor: '#fff',
            position: 'absolute', top: 3,
            left: useAdsterra ? 21 : 3,
            transition: 'left 0.2s',
            boxShadow: '0 1px 3px rgba(0,0,0,0.25)'
          }} />
        </div>
      </div>"""

new_toggle2 = """      <div className="mb-6 flex items-center justify-between p-3 bg-amber-50/50 border border-amber-200/50 rounded-md">
        <div>
          <span className="block text-xs font-bold text-amber-800">Use Adsterra ad</span>
          <span className="block text-[10px] text-amber-600">Automatically loads the Adsterra banner for this slot</span>
        </div>
        <div
          role="switch"
          aria-checked={useAdsterra}
          onClick={async () => {
            if (saving) return;
            const next = !useAdsterra;
            setUseAdsterra(next);
            await onSave(initialImageUrl, initialCtaUrl, isActive, next);
          }}
          style={{
            width: 42, height: 24, borderRadius: 12,
            backgroundColor: useAdsterra ? '#f59e0b' : '#ccc',
            position: 'relative', cursor: saving ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s',
            flexShrink: 0
          }}
        >
          <div style={{
            width: 18, height: 18, borderRadius: '50%', backgroundColor: '#fff',
            position: 'absolute', top: 3,
            left: useAdsterra ? 21 : 3,
            transition: 'left 0.2s',
            boxShadow: '0 1px 3px rgba(0,0,0,0.25)'
          }} />
        </div>
      </div>"""

text = text.replace(old_toggle1, new_toggle1, 1)
text = text.replace(old_toggle1, new_toggle2, 1)

text = text.replace("useAdsterra ? 'Save Adsterra script' : ", "")
text = text.replace("|| (useAdsterra && (!adsterraCode || !adsterraCode.trim()))", "")

with open("app/(admin)/admin/sponsors/SponsorsClient.tsx", "w") as f:
    f.write(text)
print("Patch applied")
