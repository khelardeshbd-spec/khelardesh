import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'homepage';

  let scriptCode = '';

  if (type === 'header') {
    scriptCode = `<script>
      atOptions = {
        'key' : '2ff25b79d8c7fb7e8bf2fe4e902d4b3e',
        'format' : 'iframe',
        'height' : 50,
        'width' : 320,
        'params' : {}
      };
    </script>
    <script src="https://www.highperformanceformat.com/2ff25b79d8c7fb7e8bf2fe4e902d4b3e/invoke.js"></script>`;
  } else if (type === 'homepage') {
    scriptCode = `<script>
      atOptions = {
        'key' : 'aa6f8a62d6b989301601dd7ce15a4d18',
        'format' : 'iframe',
        'height' : 90,
        'width' : 728,
        'params' : {}
      };
    </script>
    <script src="https://www.highperformanceformat.com/aa6f8a62d6b989301601dd7ce15a4d18/invoke.js"></script>`;
  } else if (type === 'article') {
    scriptCode = `<script>
      atOptions = {
        'key' : 'fa566dcf51c64ea3566817220c9d77f7',
        'format' : 'iframe',
        'height' : 250,
        'width' : 300,
        'params' : {}
      };
    </script>
    <script src="https://www.highperformanceformat.com/fa566dcf51c64ea3566817220c9d77f7/invoke.js"></script>`;
  }

  const html = `
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
        ${scriptCode}
      </body>
    </html>
  `;

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
