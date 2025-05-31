import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

const Card = ({ children, className = '', onClick, hoverable = false }: CardProps) => {
  const cardClasses = `card-ios ${hoverable ? 'transition-all duration-200 hover:shadow-ios-strong' : ''} ${onClick ? 'cursor-pointer' : ''} ${className}`;
  
  return (
    <div className={cardClasses} onClick={onClick}>
      {children}
    </div>
  );
};

export default Card;
