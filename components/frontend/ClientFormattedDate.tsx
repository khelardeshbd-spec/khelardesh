'use client';

import React, { useState, useEffect } from 'react';
import { timeAgo } from '@/lib/timeAgo';

interface ClientFormattedDateProps {
  date: Date | string;
  mode?: 'relative' | 'absolute' | 'both' | 'date-only' | 'time-only' | 'time-seconds';
  lang?: 'en' | 'bn';
  className?: string;
  style?: React.CSSProperties;
  title?: string;
  options?: Intl.DateTimeFormatOptions;
}

export default function ClientFormattedDate({
  date,
  mode = 'relative',
  lang = 'bn',
  className,
  style,
  title,
  options,
}: ClientFormattedDateProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!date) return null;
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return null;

  const formatText = (useLocal: boolean) => {
    const locale = lang === 'bn' ? 'bn-BD' : 'en-GB';
    
    // Server-side / pre-mount rendering uses UTC to ensure stability and avoid hydration mismatches
    const finalOptions: Intl.DateTimeFormatOptions = {
      ...(options || {}),
      ...(!useLocal ? { timeZone: 'UTC' } : {}),
    };

    if (mode === 'relative') {
      return timeAgo(d, lang);
    }

    if (mode === 'both') {
      const exact = d.toLocaleString(locale, {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        ...finalOptions,
      });
      const rel = timeAgo(d, lang);
      return `${exact} (${rel})`;
    }

    if (mode === 'date-only') {
      return d.toLocaleDateString(locale, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        ...finalOptions,
      });
    }

    if (mode === 'time-only') {
      return d.toLocaleTimeString(locale, {
        hour: '2-digit',
        minute: '2-digit',
        ...finalOptions,
      });
    }

    if (mode === 'time-seconds') {
      return d.toLocaleTimeString(locale, {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        ...finalOptions,
      });
    }

    // Default: absolute date + time
    return d.toLocaleString(locale, {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      ...finalOptions,
    });
  };

  const text = formatText(mounted);
  const hoverTitle = title || (mounted ? formatText(true) : undefined);

  return (
    <time 
      dateTime={d.toISOString()} 
      className={className} 
      style={style}
      title={hoverTitle}
      suppressHydrationWarning
    >
      {text}
    </time>
  );
}
