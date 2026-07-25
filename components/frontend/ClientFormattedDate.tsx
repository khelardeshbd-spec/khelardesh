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
  let d = typeof date === 'string' ? new Date(date) : date;
  
  if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?$/.test(date)) {
    d = new Date(date + 'Z');
  }

  if (isNaN(d.getTime())) return null;

  const formatText = (useLocal: boolean) => {
    const locale = lang === 'bn' ? 'bn-BD' : 'en-GB';
    
    // Server-side / pre-mount rendering uses UTC to ensure stability and avoid hydration mismatches
    const finalOptions: Intl.DateTimeFormatOptions = {
      ...(options || {}),
      ...(!useLocal ? { timeZone: 'UTC' } : {}),
    };

    const hasStyleOptions = 'dateStyle' in finalOptions || 'timeStyle' in finalOptions;

    if (mode === 'relative') {
      return timeAgo(d, lang);
    }

    if (mode === 'both') {
      const defaultOpts: Intl.DateTimeFormatOptions = hasStyleOptions ? {} : {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      };
      const exact = d.toLocaleString(locale, {
        ...defaultOpts,
        ...finalOptions,
      });
      const rel = timeAgo(d, lang);
      return `${exact} (${rel})`;
    }

    if (mode === 'date-only') {
      const defaultOpts: Intl.DateTimeFormatOptions = hasStyleOptions ? {} : {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      };
      return d.toLocaleDateString(locale, {
        ...defaultOpts,
        ...finalOptions,
      });
    }

    if (mode === 'time-only') {
      const defaultOpts: Intl.DateTimeFormatOptions = hasStyleOptions ? {} : {
        hour: '2-digit',
        minute: '2-digit',
      };
      return d.toLocaleTimeString(locale, {
        ...defaultOpts,
        ...finalOptions,
      });
    }

    if (mode === 'time-seconds') {
      const defaultOpts: Intl.DateTimeFormatOptions = hasStyleOptions ? {} : {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      };
      return d.toLocaleTimeString(locale, {
        ...defaultOpts,
        ...finalOptions,
      });
    }

    // Default: absolute date + time
    const defaultOpts: Intl.DateTimeFormatOptions = hasStyleOptions ? {} : {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return d.toLocaleString(locale, {
      ...defaultOpts,
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
