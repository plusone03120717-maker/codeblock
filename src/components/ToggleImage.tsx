'use client';

import { useState, useEffect } from 'react';

interface ToggleImageProps {
  image1: string;
  image2: string;
  alt1: string;
  alt2: string;
  interval?: number; // ミリ秒
  className?: string;
}

export default function ToggleImage({
  image1,
  image2,
  alt1,
  alt2,
  interval = 2000, // デフォルト2秒
  className = '',
}: ToggleImageProps) {
  const [showFirst, setShowFirst] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setShowFirst((prev) => !prev);
    }, interval);

    return () => clearInterval(timer);
  }, [interval]);

  return (
    <div className={`relative ${className}`}>
      <img
        src={image1}
        alt={alt1}
        className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-500 ${
          showFirst ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <img
        src={image2}
        alt={alt2}
        className={`w-full h-full object-contain transition-opacity duration-500 ${
          showFirst ? 'opacity-0' : 'opacity-100'
        }`}
      />
    </div>
  );
}

