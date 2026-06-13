const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'app', '(frontend)', 'page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Replace the lower section with InfiniteArticleFeed
const lowerSectionPattern = /\{\/\* LOWER SECTION \*\/\}[\s\S]*?<div className="grid grid-cols-3 gap-0">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*\);\s*\}/;

const replacement = `{/* LOWER SECTION */}
        <div className="mt-8">
          <InfiniteArticleFeed skipIds={[leads[0]?.id, ...articles.slice(0, 5).map(a => a.id)]} />
        </div>
      </div>
    </div>
  );
}`;

if (content.match(lowerSectionPattern)) {
  content = content.replace(lowerSectionPattern, replacement);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log("Successfully replaced lower section in page.tsx");
} else {
  console.log("Failed to match lower section pattern");
}
