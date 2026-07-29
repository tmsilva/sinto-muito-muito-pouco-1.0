import React from 'react';
import './Skeleton.css';

export interface SkeletonProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'text' | 'circle' | 'rect';
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  className = '',
  style,
  ...props
}) => {
  const classes = [
    'skeleton',
    'animate-shimmer',
    variant === 'circle' ? 'skeleton-circle' : '',
    className
  ].filter(Boolean).join(' ');

  const inlineStyle: React.CSSProperties = {
    width: width !== undefined ? width : undefined,
    height: height !== undefined ? height : undefined,
    ...style
  };

  return (
    <span 
      className={classes} 
      style={inlineStyle}
      {...props}
    />
  );
};
export default Skeleton;
