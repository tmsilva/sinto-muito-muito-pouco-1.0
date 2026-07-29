import React from 'react';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Container: React.FC<ContainerProps> = ({ size = 'lg', children, style, ...props }) => {
  const maxWidth = `var(--container-${size})`;
  
  return (
    <div 
      style={{ 
        maxWidth, 
        width: '100%', 
        marginLeft: 'auto', 
        marginRight: 'auto', 
        paddingLeft: 'var(--spacing-4)', 
        paddingRight: 'var(--spacing-4)', 
        ...style 
      }} 
      {...props}
    >
      {children}
    </div>
  );
};
export default Container;
