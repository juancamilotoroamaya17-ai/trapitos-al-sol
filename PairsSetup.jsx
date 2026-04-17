import { useState } from 'react';
import { Typography } from '../ui/Typography';
import { Button } from '../ui/Button';

export const PairsSetup = ({ onNavigate }) => {
  const [step, setStep] = useState(1);
  const [setupData, setSetupData] = useState({ connection: null, knowEachOther: null });

  const handleConnectionSelect = (type) => {
    setSetupData(prev => ({ ...prev, connection: type }));
    setStep(2);
  };

  const handleKnowEachOtherSelect = (knows) => {
    setSetupData(prev => ({ ...prev, knowEachOther: knows }));
    // A futuro esta configuración afectará las preguntas, por ahora navegamos
    onNavigate('question');
  };

  return (
    <div className="setup-screen fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '2rem' }}>
      
      {step === 1 && (
        <div className="fade-in glass-card" style={{ padding: '3rem 2rem', width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '2.5rem', textAlign: 'center' }}>
          <Typography variant="h2">¿Qué tipo de conexión es?</Typography>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Button variant="secondary" onClick={() => handleConnectionSelect('romantico')}>Romántico</Button>
            <Button variant="secondary" onClick={() => handleConnectionSelect('amistad')}>Amistad</Button>
            <Button variant="secondary" onClick={() => handleConnectionSelect('profesional')}>Profesional</Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="fade-in glass-card" style={{ padding: '3rem 2rem', width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '2.5rem', textAlign: 'center' }}>
          <Typography variant="h2">¿Se conocen?</Typography>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Button variant="secondary" onClick={() => handleKnowEachOtherSelect('si')}>Sí</Button>
            <Button variant="secondary" onClick={() => handleKnowEachOtherSelect('no')}>No</Button>
          </div>
        </div>
      )}
    </div>
  );
};
