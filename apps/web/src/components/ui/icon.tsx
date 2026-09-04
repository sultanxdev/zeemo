import React from 'react';

interface IconProps {
  icon: any;
  size?: number | string;
  className?: string;
  color?: string;
}

export function Icon({ icon: IconComponent, size = 16, className = '', color }: IconProps) {
  if (!IconComponent) return null;

  // If it's a Hugeicon React component or function
  if (typeof IconComponent === 'function' || typeof IconComponent === 'object') {
    return <IconComponent size={size} className={className} color={color} />;
  }

  return null;
}
