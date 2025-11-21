import { Link } from 'react-router-dom';
import './Button.scss';

/**
 * Button component props interface
 */
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
 * Reusable Button component that can render as a button, link, or external link
 * @param {ButtonProps} props - Component props
 * @param {'primary' | 'secondary'} [props.variant='primary'] - Button style variant
 * @param {string} [props.to] - Internal route path (renders as React Router Link)
 * @param {string} [props.href] - External URL (renders as anchor tag)
 * @param {() => void} [props.onClick] - Click handler function
 * @param {React.ReactNode} props.children - Button content
 * @param {'button' | 'submit' | 'reset'} [props.type='button'] - Button type attribute
 * @param {boolean} [props.disabled=false] - Whether the button is disabled
 * @param {string} [props.className=''] - Additional CSS classes
 * @returns {JSX.Element} Button component rendered as button, Link, or anchor
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

