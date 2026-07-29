import React from 'react';
import './Radio.css';

export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Radio: React.FC<RadioProps> = ({
  label,
  checked,
  disabled,
  className = '',
  id,
  ...props
}) => {
  const radioId = id || React.useId();

  return (
    <label htmlFor={radioId} className={`radio-container ${disabled ? 'radio-container-disabled' : ''} ${className}`}>
      <input
        type="radio"
        id={radioId}
        checked={checked}
        disabled={disabled}
        className="radio-input"
        {...props}
      />
      <span className="radio-circle" aria-hidden="true">
        <span className="radio-inner" />
      </span>
      {label && <span>{label}</span>}
    </label>
  );
};
export default Radio;
