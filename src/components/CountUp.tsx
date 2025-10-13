'use client';

import { useEffect, useRef, useState } from 'react';

interface CountUpProps {
  value: number;
  durationMs?: number;
  format?: (n: number) => string;
  className?: string;
}

export default function CountUp({ value, durationMs = 800, format, className = '' }: CountUpProps) {
  const [display, setDisplay] = useState(0);
  const startRef = useRef<number | null>(null);
  const fromRef = useRef(0);
  const toRef = useRef(value);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    fromRef.current = display;
    toRef.current = value;
    startRef.current = null;

    const step = (ts: number) => {
      if (startRef.current === null) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const t = Math.min(1, elapsed / durationMs);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      const next = fromRef.current + (toRef.current - fromRef.current) * eased;
      setDisplay(next);
      if (t < 1) rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value, durationMs]);

  const formatted = format ? format(display) : Math.round(display).toLocaleString();
  return <span className={className}>{formatted}</span>;
}


