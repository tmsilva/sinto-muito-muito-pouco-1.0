import React from 'react';
import './Divider.css';

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
}

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  className = '',
  ...props
}) => {
  return (
    <div 
      className={`divider divider-${orientation} ${className}`} 
      role="separator"
      {...props}
    />
  );
};
export default Divider;
