'use client';

import Link from 'next/link';

interface PhotoCardProps {
  title: string;
  imageUrl: string;
  href: string;
}

export default function PhotoCardWidget({ title, imageUrl, href }: PhotoCardProps) {
  return (
    <Link href={href} className="group block relative w-full overflow-hidden rounded-[2px]" style={{ aspectRatio: '16/9' }}>
      <img
        src={imageUrl}
        alt={title}
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div 
        className="absolute inset-0 bg-gradient-to-t from-[var(--ink)] to-transparent opacity-80"
      />
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <h3
          style={{
            fontFamily: "'Kalpurush', 'Hind Siliguri', sans-serif",
            fontWeight: 600,
            fontSize: 16,
            color: 'var(--bg-page)',
            textShadow: '0 1px 2px rgba(0,0,0,0.5)'
          }}
        >
          {title}
        </h3>
      </div>
    </Link>
  );
}
