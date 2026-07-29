import React, { useState, useRef, useEffect } from 'react';
import './Dropdown.css';

export interface DropdownItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  variant?: 'default' | 'danger';
}

export const DropdownItem: React.FC<DropdownItemProps> = ({
  icon,
  variant = 'default',
  children,
  className = '',
  ...props
}) => {
  const classes = [
    'dropdown-item',
    variant === 'danger' ? 'dropdown-item-danger' : '',
    className
  ].join(' ');

  return (
    <button type="button" className={classes} {...props}>
      {icon && <span style={{ display: 'inline-flex', alignItems: 'center' }}>{icon}</span>}
      <span>{children}</span>
    </button>
  );
};

export const DropdownDivider: React.FC = () => <div className="dropdown-divider" />;

export interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  children,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggle = () => setIsOpen((prev) => !prev);
  const close = () => setIsOpen(false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        close();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={`dropdown-wrapper ${className}`} ref={containerRef}>
      <div onClick={toggle} style={{ cursor: 'pointer', display: 'inline-flex' }}>
        {trigger}
      </div>

      {isOpen && (
        <>
          {/* Mobile backdrop */}
          <div className="dropdown-backdrop-mobile" onClick={close} aria-hidden="true" />
          
          <div className="dropdown-menu" role="menu" onClick={(e) => e.stopPropagation()}>
            {/* Header close option visible only on mobile via styles if needed, or simply render children */}
            {React.Children.map(children, (child) => {
              if (React.isValidElement(child)) {
                const element = child as React.ReactElement<any>;
                return React.cloneElement(element, {
                  onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
                    if (element.props.onClick) element.props.onClick(e);
                    close();
                  }
                });
              }
              return child;
            })}
          </div>
        </>
      )}
    </div>
  );
};
export default Dropdown;
