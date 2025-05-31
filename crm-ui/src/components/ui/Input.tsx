import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className="mb-4">
        {label && (
          <label className="block text-ios-dark-gray mb-1 text-sm font-medium">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`input-ios w-full ${error ? 'border-ios-red' : ''} ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-ios-red">{error}</p>}
        {helperText && !error && (
          <p className="mt-1 text-xs text-ios-gray">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
