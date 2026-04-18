import React, { useEffect } from 'react';
import { Typography } from '../ui/Typography';
import { Button } from '../ui/Button';
import { GlassCard } from '../ui/GlassCard';
import './AgeGate.css';

export const AgeGate = ({ onAccept }) => {
  // Bloquear scroll mientras el overlay esté activo
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleDecline = () => {
    window.location.href = 'https://google.com';
  };

  return (
    <div className="age-gate-overlay fade-in">
      <GlassCard className="age-gate-card scale-in-subtle delay-1">
        <Typography variant="h1" className="age-gate-title">
          🔞 Acceso restringido
        </Typography>
        <Typography variant="body" className="age-gate-text delay-2">
          Esta experiencia contiene situaciones emocionales intensas y está diseñada para mayores de 18 años.
        </Typography>
        <div className="age-gate-actions delay-3">
          <Button variant="primary" onClick={onAccept}>
            Sí, soy mayor de edad
          </Button>
          <Button variant="secondary" onClick={handleDecline}>
            No, salir
          </Button>
        </div>
        <p className="age-gate-legal delay-4">
          Al continuar confirmas que eres mayor de 18 años.
        </p>
      </GlassCard>
    </div>
  );
};
