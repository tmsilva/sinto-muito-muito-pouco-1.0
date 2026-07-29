import React from 'react';
import Spinner from '../Spinner/Spinner';
import './LoadingState.css';

export interface LoadingStateProps extends React.HTMLAttributes<HTMLDivElement> {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Carregando...',
  className = '',
  ...props
}) => {
  return (
    <div className={`loading-state ${className}`} {...props}>
      <Spinner size="lg" />
      <span>{message}</span>
    </div>
  );
};
export default LoadingState;
