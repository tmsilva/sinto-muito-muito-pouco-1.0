import React from 'react';
import './Select.css';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  helperText?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  error,
  helperText,
  className = '',
  id,
  children,
  ...props
}) => {
  const selectId = id || React.useId();
  const selectClasses = [
    'select-field',
    error ? 'select-field-error' : '',
    className
  ].join(' ');

  return (
    <div className="select-wrapper">
      {label && (
        <label htmlFor={selectId} className="select-label">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={selectClasses}
        aria-invalid={!!error}
        aria-describedby={error ? `${selectId}-error` : undefined}
        {...props}
      >
        {children || options.map((opt) => (
          <option key={opt.value} value={opt.value} style={{ background: 'var(--color-surface)' }}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <span id={`${selectId}-error`} className="select-error-text" role="alert">
          {error}
        </span>
      )}
      {!error && helperText && (
        <span className="select-label" style={{ fontWeight: 'normal' }}>
          {helperText}
        </span>
      )}
    </div>
  );
};
export default Select;
