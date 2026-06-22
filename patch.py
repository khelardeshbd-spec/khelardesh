import sys

with open("app/(admin)/admin/sponsors/SponsorsClient.tsx", "r") as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    line = line.replace('useAdsterra: boolean, adsterraCode: string', 'useAdsterra: boolean')
    line = line.replace('useAdsterra: boolean = false, adsterraCode: string = \'\'', 'useAdsterra: boolean = false')
    line = line.replace('adsterraCode: string = \'\'', '')
    line = line.replace('adsterraCode: existing?.adsterraCode || \'\'', '')
    line = line.replace('initialAdsterraCode: string;', '')
    line = line.replace('initialAdsterraCode,', '')
    line = line.replace('useAdsterra, adsterraCode', 'useAdsterra')
    line = line.replace('const [adsterraCode, setAdsterraCode] = useState(initialAdsterraCode);', '')
    line = line.replace('setAdsterraCode(initialAdsterraCode);', '')
    line = line.replace('useAdsterra ? \'Save Adsterra script\' : ', '')
    new_lines.append(line)

content = "".join(new_lines)

# Remove the textarea blocks
# BannerCropper
block1 = """
      {useAdsterra ? (
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
      ) : (
        <>
"""

content = content.replace(block1, "\n      {!useAdsterra && (\n        <>\n")

# BannerCropper Handle Upload
content = content.replace("""
  const handleUploadAndSave = async () => {
    if (useAdsterra) {
      if (!adsterraCode || !adsterraCode.trim()) {
        alert('Adsterra script code is required.');
        return;
      }
      await onSave('', '', true);
      return;
    }
""", """
  const handleUploadAndSave = async () => {
    if (useAdsterra) {
      await onSave('', '', true);
      return;
    }
""")

content = content.replace("""
  const handleSave = async () => {
    if (useAdsterra) {
      if (!adsterraCode || !adsterraCode.trim()) {
        alert('Adsterra script code is required.');
        return;
      }
      await onSave('', '', isActive, true);
      return;
    }
""", """
  const handleSave = async () => {
    if (useAdsterra) {
      await onSave('', '', isActive, true);
      return;
    }
""")

content = content.replace('      await onSave(uploadData.url, ctaUrl, false, \'\');', '      await onSave(uploadData.url, ctaUrl, false);')

content = content.replace('(!useAdsterra && (!ctaUrl || !ctaUrl.trim())) || (useAdsterra && (!adsterraCode || !adsterraCode.trim()));', '(!useAdsterra && (!ctaUrl || !ctaUrl.trim()));')


# Also update the checkboxes to be auto-saving switches.
old_checkbox1 = """
      <div className="mb-6 flex items-center justify-between p-3 bg-amber-50/50 border border-amber-200/50 rounded-md">
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
      </div>
"""

new_switch1 = """
      <div className="mb-6 flex items-center justify-between p-3 bg-amber-50/50 border border-amber-200/50 rounded-md">
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
      </div>
"""

new_switch2 = """
      <div className="mb-6 flex items-center justify-between p-3 bg-amber-50/50 border border-amber-200/50 rounded-md">
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
      </div>
"""

content = content.replace(old_checkbox1, new_switch1, 1) # First occurrence BannerCropper
content = content.replace(old_checkbox1, new_switch2, 1) # Second occurrence HomepageBannerManager


with open("app/(admin)/admin/sponsors/SponsorsClient.tsx", "w") as f:
    f.write(content)
print('Patched successfully')
