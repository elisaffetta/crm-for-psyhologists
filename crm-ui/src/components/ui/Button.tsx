import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: ReactNode;
}

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false, 
  icon, 
  className = '', 
  ...props 
}: ButtonProps) => {
  
  // Base classes
  let buttonClasses = 'btn-ios flex items-center justify-center';
  
  // Variant classes
  switch (variant) {
    case 'primary':
      buttonClasses += ' btn-ios-primary';
      break;
    case 'secondary':
      buttonClasses += ' btn-ios-secondary';
      break;
    case 'danger':
      buttonClasses += ' bg-ios-red text-white hover:bg-opacity-90';
      break;
    case 'success':
      buttonClasses += ' bg-ios-green text-white hover:bg-opacity-90';
      break;
    default:
      buttonClasses += ' btn-ios-primary';
  }
  
  // Size classes
  switch (size) {
    case 'sm':
      buttonClasses += ' text-sm px-3 py-1';
      break;
    case 'md':
      buttonClasses += ' text-base px-5 py-2';
      break;
    case 'lg':
      buttonClasses += ' text-lg px-6 py-3';
      break;
    default:
      buttonClasses += ' text-base px-5 py-2';
  }
  
  // Width classes
  if (fullWidth) {
    buttonClasses += ' w-full';
  }
  
  return (
    <button className={`${buttonClasses} ${className}`} {...props}>
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
