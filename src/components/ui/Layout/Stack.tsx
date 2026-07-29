import React from 'react';

interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'vertical' | 'horizontal';
  gap?: number;
  align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
  justify?: 'start' | 'end' | 'center' | 'between';
}

export const Stack: React.FC<StackProps> = ({
  direction = 'vertical',
  gap = 4,
  align = 'stretch',
  justify = 'start',
  children,
  style,
  ...props
}) => {
  const alignMap = {
    start: 'flex-start',
    end: 'flex-end',
    center: 'center',
    baseline: 'baseline',
    stretch: 'stretch'
  };

  const justifyMap = {
    start: 'flex-start',
    end: 'flex-end',
    center: 'center',
    between: 'space-between'
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: direction === 'vertical' ? 'column' : 'row',
        gap: `var(--spacing-${gap})`,
        alignItems: alignMap[align],
        justifyContent: justifyMap[justify],
        ...style
      }}
      {...props}
    >
      {children}
    </div>
  );
};
export default Stack;
