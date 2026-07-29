import React from 'react';
import './Chip.css';

export interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

export const Chip: React.FC<ChipProps> = ({
  active = false,
  children,
  className = '',
  ...props
}) => {
  const classes = [
    'chip',
    active ? 'chip-active' : '',
    'press-scale',
    className
  ].filter(Boolean).join(' ');

  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  );
};
export default Chip;
