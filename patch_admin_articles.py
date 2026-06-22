import re

for filename in ["app/(admin)/admin/articles/new/page.tsx", "app/(admin)/admin/articles/[id]/page.tsx"]:
    with open(filename, "r") as f:
        text = f.read()

    # 1. Update parsing logic
    text = text.replace(
        r"const adsterraMatch = b.match(/^\[ADSTERRA:\s*(.+?)\]$/);",
        "const adsterraMatch = b.match(/^\\[ADSTERRA(?:\\:\\s*(.+?))?\\]$/);"
    )
    
    text = text.replace(
        r"return { id, type: 'ad', useAdsterra: true, adsterraCode: safeB64Decode(adsterraMatch[1]) };",
        "return { id, type: 'ad', useAdsterra: true, adsterraCode: adsterraMatch[1] ? safeB64Decode(adsterraMatch[1]) : '' };"
    )

    # 2. Update saving logic
    text = text.replace(
        r"return `[ADSTERRA: ${btoa(b.adsterraCode || '')}]`;",
        "return `[ADSTERRA]`;"
    )

    # 3. Update UI logic (remove textarea and update toggle)
    old_textarea_block = """                  {block.useAdsterra ? (
                    <div className="mt-4">
                      <label className="text-xs font-semibold text-[var(--ink-muted)]">Adsterra Script Code</label>
                      <textarea
                        value={block.adsterraCode || ''}
                        onChange={(e) => updateBlock(block.id, { adsterraCode: e.target.value })}
                        placeholder="Paste your <script>...</script> code from Adsterra here"
                        rows={4}
                        className="w-full mt-1 p-2 border border-[var(--ink-border)] bg-[var(--bg-surface)] rounded text-xs font-mono"
                      />
                    </div>
                  ) : ("""

    new_textarea_block = """                  {!block.useAdsterra && ("""
    
    text = text.replace(old_textarea_block, new_textarea_block)

    old_toggle = """                    <label className="flex items-center gap-2 cursor-pointer p-2 bg-amber-50/50 border border-amber-200/50 rounded-md">
                      <input
                        type="checkbox"
                        checked={block.useAdsterra || false}
                        onChange={(e) => updateBlock(block.id, { useAdsterra: e.target.checked })}
                        className="w-4 h-4 text-amber-600 focus:ring-amber-500 rounded"
                      />
                      <span className="text-xs font-bold text-amber-800">
                        Use Adsterra script instead of custom banner image
                      </span>
                    </label>"""
                    
    new_toggle = """                    <label className="flex items-center gap-2 cursor-pointer p-2 bg-amber-50/50 border border-amber-200/50 rounded-md">
                      <input
                        type="checkbox"
                        checked={block.useAdsterra || false}
                        onChange={(e) => updateBlock(block.id, { useAdsterra: e.target.checked })}
                        className="w-4 h-4 text-amber-600 focus:ring-amber-500 rounded"
                      />
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-amber-800">Use Adsterra ad</span>
                        <span className="text-[10px] text-amber-600">Automatically loads the 300x250 Adsterra banner for this block</span>
                      </div>
                    </label>"""
                    
    text = text.replace(old_toggle, new_toggle)
    
    # Also handle the one in `new/page.tsx`
    text = text.replace("Use Adsterra script instead of custom banner image", "Use Adsterra ad instead of custom banner image")
    
    with open(filename, "w") as f:
        f.write(text)

print("Admin articles patch applied")
