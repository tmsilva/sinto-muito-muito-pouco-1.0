import React from 'react';
import './Spinner.css';

export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: 'sm' | 'md' | 'lg';
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  className = '',
  ...props
}) => {
  return (
    <span 
      className={`spinner spinner-${size} ${className}`} 
      role="status"
      aria-label="Carregando..."
      {...props}
    />
  );
};
export default Spinner;
