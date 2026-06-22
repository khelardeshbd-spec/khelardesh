'use client';

import { useEffect, useState } from 'react';

interface AdsterraAdProps {
  htmlCode: string;
}

export default function AdsterraAd({ htmlCode }: AdsterraAdProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !htmlCode) return null;

  // Extract height and width from script code to style the iframe wrapper correctly
  const widthMatch = htmlCode.match(/'width'\s*:\s*(\d+)/) || htmlCode.match(/"width"\s*:\s*(\d+)/);
  const heightMatch = htmlCode.match(/'height'\s*:\s*(\d+)/) || htmlCode.match(/"height"\s*:\s*(\d+)/);
  
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
        ${htmlCode}
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
