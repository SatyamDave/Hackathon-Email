import React from 'react';

interface SkeletonProps {
  width?: string;
  height?: string;
  rounded?: string;
  className?: string;
}

export default function Skeleton({ width = '100%', height = '1.5rem', rounded = 'rounded', className = '' }: SkeletonProps) {
  return (
    <div
      className={`bg-dark-muted/60 animate-pulse ${rounded} ${className}`}
      style={{ width, height }}
    />
  );
} 