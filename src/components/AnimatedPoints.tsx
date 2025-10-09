'use client';

import { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface AnimatedPointsProps {
  value: number;
  duration?: number;
  className?: string;
}

export function AnimatedPoints({ value, duration = 1000, className = '' }: AnimatedPointsProps) {
  const [displayValue, setDisplayValue] = useState(0);
  
  const spring = useSpring(0, {
    stiffness: 50,
    damping: 20,
    mass: 1
  });

  const display = useTransform(spring, (latest) => Math.floor(latest).toLocaleString());

  useEffect(() => {
    spring.set(value);
    
    // Fallback for display value
    const timeout = setTimeout(() => {
      setDisplayValue(value);
    }, duration);
    
    return () => clearTimeout(timeout);
  }, [value, spring, duration]);

  useEffect(() => {
    const unsubscribe = spring.on('change', (latest) => {
      setDisplayValue(Math.floor(latest));
    });
    
    return unsubscribe;
  }, [spring]);

  return (
    <motion.span 
      className={className}
      initial={{ scale: 1 }}
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ duration: 0.3, times: [0, 0.5, 1] }}
      key={value}
    >
      {displayValue.toLocaleString()}
    </motion.span>
  );
}

