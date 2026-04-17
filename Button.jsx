import { useState } from 'react';
// FUTURO (no usar aún)
import { playSound } from '../audio';
import { triggerEffect } from '../effects';
import './Button.css';

export const Button = ({ 
  children, 
  variant = 'primary', // "primary" | "secondary"
  onClick,
  className = ''
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = (e) => {
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 150);

    // NO llamar estas funciones todavía
    // playSound('tap');
    // triggerEffect('click');

    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button 
      className={`btn btn-${variant} ${isPressed ? 'btn-pressed' : ''} ${className}`}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};
