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

  if (to) {
    return (
      <Link to={to} className={baseClassName} onClick={onClick}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={baseClassName} onClick={onClick}>
        {children}
      </a>
    );
  }

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

