import { useState } from 'react';
import { Typography } from '../ui/Typography';
import { Button } from '../ui/Button';

export const GroupSetup = ({ onNavigate }) => {
  const [numPlayers, setNumPlayers] = useState(null);

  const handleSelect = (players) => {
    setNumPlayers(players);
    // A futuro este parámetro afectará la agresividad/tipo de preguntas grupales
    onNavigate('question');
  };

  return (
    <div className="setup-screen fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '2rem' }}>
      <div className="glass-card fade-in" style={{ padding: '3rem 2rem', width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '2.5rem', textAlign: 'center' }}>
        <Typography variant="h2">¿Cuántas personas van a jugar?</Typography>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Button variant="secondary" onClick={() => handleSelect('2-3')}>2-3 Personas</Button>
          <Button variant="secondary" onClick={() => handleSelect('4-6')}>4-6 Personas</Button>
          <Button variant="secondary" onClick={() => handleSelect('7+')}>7+ Personas</Button>
        </div>
      </div>
    </div>
  );
};
