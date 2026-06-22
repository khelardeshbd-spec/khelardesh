'use client';

import { useEffect, useState } from 'react';

const DEFAULT_SCRIPTS = {
  header: `<script>\n  atOptions = {\n    'key' : '2ff25b79d8c7fb7e8bf2fe4e902d4b3e',\n    'format' : 'iframe',\n    'height' : 50,\n    'width' : 320,\n    'params' : {}\n  };\n</script>\n<script src="https://www.highperformanceformat.com/2ff25b79d8c7fb7e8bf2fe4e902d4b3e/invoke.js"></script>`,
  homepage: `<script>\n  atOptions = {\n    'key' : 'aa6f8a62d6b989301601dd7ce15a4d18',\n    'format' : 'iframe',\n    'height' : 90,\n    'width' : 728,\n    'params' : {}\n  };\n</script>\n<script src="https://www.highperformanceformat.com/aa6f8a62d6b989301601dd7ce15a4d18/invoke.js"></script>`,
  article: `<script>\n  atOptions = {\n    'key' : 'fa566dcf51c64ea3566817220c9d77f7',\n    'format' : 'iframe',\n    'height' : 250,\n    'width' : 300,\n    'params' : {}\n  };\n</script>\n<script src="https://www.highperformanceformat.com/fa566dcf51c64ea3566817220c9d77f7/invoke.js"></script>`
};

interface AdsterraAdProps {
  htmlCode?: string | null;
  type?: 'header' | 'homepage' | 'article';
}

export default function AdsterraAd({ htmlCode, type }: AdsterraAdProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const resolvedCode = htmlCode || (type ? DEFAULT_SCRIPTS[type] : '');

  if (!mounted || !resolvedCode) return null;

  // Extract height and width from script code to style the iframe wrapper correctly
  const widthMatch = resolvedCode.match(/'width'\s*:\s*(\d+)/) || resolvedCode.match(/"width"\s*:\s*(\d+)/);
  const heightMatch = resolvedCode.match(/'height'\s*:\s*(\d+)/) || resolvedCode.match(/"height"\s*:\s*(\d+)/);
  
  const width = widthMatch ? parseInt(widthMatch[1], 10) : 728;
  const height = heightMatch ? parseInt(heightMatch[1], 10) : 90;

  // Generate the document context inside the iframe
  const srcDoc = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          html, body {
            margin: 0;
            padding: 0;
            overflow: hidden;
            background-color: transparent;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;
          }
        </style>
      </head>
      <body>
        ${resolvedCode}
      </body>
    </html>
  `;

  return (
    <div className="w-full flex justify-center items-center my-4 overflow-hidden">
      <iframe
        srcDoc={srcDoc}
        width={width}
        height={height}
        style={{ border: 'none', overflow: 'hidden', display: 'block', maxWidth: '100%' }}
        scrolling="no"
        title="Advertisement"
      />
    </div>
  );
}
