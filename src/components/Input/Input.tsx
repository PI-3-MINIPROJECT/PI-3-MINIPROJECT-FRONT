import React, { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import './Input.scss';

/**
 * Input component props interface
 */
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

/**
 * Reusable Input component with label, error message, and optional icon support
 * @param {InputProps} props - Component props extending HTML input attributes
 * @param {string} [props.label] - Label text displayed above the input
 * @param {string} [props.error] - Error message displayed below the input
 * @param {React.ReactNode} [props.icon] - Optional icon displayed inside the input
 * @param {string} [props.className=''] - Additional CSS classes
 * @param {React.Ref<HTMLInputElement>} ref - Forwarded ref to the input element
 * @returns {JSX.Element} Input component with label, error message, and optional icon
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = '', ...props }, ref) => {
    return (
      <div className={`input-wrapper ${className}`}>
        {label && (
          <label className="input-label" htmlFor={props.id}>
            {label}
          </label>
        )}
        <div className="input-container">
          <input
            ref={ref}
            className={`input-field ${error ? 'input-error' : ''} ${icon ? 'input-with-icon' : ''}`}
            {...props}
          />
          {icon && <div className="input-icon">{icon}</div>}
        </div>
        {error && <span className="input-error-message">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
