import React from 'react';
import { CheckIcon } from '../../icons';
import './Checkbox.css';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked,
  disabled,
  className = '',
  id,
  ...props
}) => {
  const checkboxId = id || React.useId();

  return (
    <label htmlFor={checkboxId} className={`checkbox-container ${disabled ? 'checkbox-container-disabled' : ''} ${className}`}>
      <input
        type="checkbox"
        id={checkboxId}
        checked={checked}
        disabled={disabled}
        className="checkbox-input"
        {...props}
      />
      <span className="checkbox-box" aria-hidden="true">
        <CheckIcon size={12} strokeWidth={3} />
      </span>
      {label && <span>{label}</span>}
    </label>
  );
};
export default Checkbox;
