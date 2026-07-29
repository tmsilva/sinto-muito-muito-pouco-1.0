import React from 'react';
import { AlertCircleIcon } from '../../icons';
import './Alert.css';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'success' | 'warning' | 'danger' | 'info';
  title?: string;
}

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  children,
  className = '',
  ...props
}) => {
  const classes = [
    'alert',
    `alert-${variant}`,
    className
  ].join(' ');

  return (
    <div className={classes} role="alert" {...props}>
      <span className="alert-icon">
        <AlertCircleIcon size={18} />
      </span>
      <div className="alert-content">
        {title && <div className="alert-title">{title}</div>}
        <div>{children}</div>
      </div>
    </div>
  );
};
export default Alert;
