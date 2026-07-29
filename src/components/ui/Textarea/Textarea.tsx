import React from 'react';
import './Textarea.css';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  helperText,
  className = '',
  id,
  ...props
}) => {
  const textareaId = id || React.useId();
  const textareaClasses = [
    'textarea-field',
    error ? 'textarea-field-error' : '',
    className
  ].join(' ');

  return (
    <div className="textarea-wrapper">
      {label && (
        <label htmlFor={textareaId} className="textarea-label">
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={textareaClasses}
        aria-invalid={!!error}
        aria-describedby={error ? `${textareaId}-error` : undefined}
        {...props}
      />
      {error && (
        <span id={`${textareaId}-error`} className="textarea-error-text" role="alert">
          {error}
        </span>
      )}
      {!error && helperText && (
        <span className="textarea-label" style={{ fontWeight: 'normal' }}>
          {helperText}
        </span>
      )}
    </div>
  );
};
export default Textarea;
