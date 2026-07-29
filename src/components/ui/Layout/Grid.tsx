import React from 'react';

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: number;
  gap?: number;
  smCols?: number;
  mdCols?: number;
  lgCols?: number;
}

export const Grid: React.FC<GridProps> = ({ 
  cols = 1, 
  gap = 4, 
  smCols, 
  mdCols, 
  lgCols, 
  children, 
  style, 
  className = '', 
  ...props 
}) => {
  const responsiveClasses = [
    'ui-grid',
    smCols ? `ui-grid-sm-${smCols}` : '',
    mdCols ? `ui-grid-md-${mdCols}` : '',
    lgCols ? `ui-grid-lg-${lgCols}` : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div 
      style={{
        display: 'grid',
        gap: `var(--spacing-${gap})`,
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        ...style
      }} 
      className={responsiveClasses}
      {...props}
    >
      {children}
    </div>
  );
};
export default Grid;
