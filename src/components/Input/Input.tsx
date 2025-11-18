import React, { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import './Input.scss';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

/**
 * Reusable Input component with label and error handling
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
