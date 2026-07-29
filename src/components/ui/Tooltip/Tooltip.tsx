import React from 'react';
import './Tooltip.css';

export interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children
}) => {
  return (
    <div className="tooltip-wrapper">
      {children}
      <div className="tooltip-popup" role="tooltip">
        {content}
      </div>
    </div>
  );
};
export default Tooltip;
