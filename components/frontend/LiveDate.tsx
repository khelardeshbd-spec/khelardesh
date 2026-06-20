'use client';

import { useEffect, useState } from 'react';

export default function LiveDate() {
  const [date, setDate] = useState<Date | null>(null);

  useEffect(() => {
    // Set initial date on client mount
    setDate(new Date());

    // Update the date every minute so it rolls over automatically at midnight
    const interval = setInterval(() => {
      setDate(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Avoid hydration mismatch by not rendering the date until the client has mounted
  if (!date) {
    return (
      <div className="flex justify-center items-center opacity-0">
        <span className="text-[11px] font-medium tracking-widest">Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center">
      {/* Desktop version */}
      <div className="flex flex-col items-center text-center text-[10px] sm:text-[11px] text-[var(--ink-muted)] tracking-widest justify-center hidden sm:flex font-medium font-sans">
        <span>
          {new Intl.DateTimeFormat('bn-BD', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          }).format(date)}
        </span>
      </div>
      {/* Mobile version */}
      <div className="flex flex-col items-center text-center text-[9px] text-[var(--ink-muted)] tracking-widest justify-center sm:hidden font-medium font-sans">
        <span>
          {new Intl.DateTimeFormat('bn-BD', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          }).format(date)}
        </span>
      </div>
    </div>
  );
}
