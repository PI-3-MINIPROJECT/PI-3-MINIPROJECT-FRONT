import { Link } from 'react-router-dom';
import './Button.scss';

interface ButtonProps {
  variant?: 'primary' | 'secondary';
  to?: string;
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
}

/**
 * Reusable Button component
 * Supports both Link (React Router) and anchor tags, or regular button
 */
export default function Button({
  variant = 'primary',
  to,
  href,
  onClick,
  children,
  type = 'button',
  disabled = false,
  className = '',
}: ButtonProps) {
  const baseClassName = `button button--${variant} ${className}`.trim();

  // If 'to' prop is provided, render as React Router Link
  if (to) {
    return (
      <Link to={to} className={baseClassName} onClick={onClick}>
        {children}
      </Link>
    );
  }

  // If 'href' prop is provided, render as anchor tag
  if (href) {
    return (
      <a href={href} className={baseClassName} onClick={onClick}>
        {children}
      </a>
    );
  }

  // Otherwise, render as button
  return (
    <button
      type={type}
      className={baseClassName}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

