import { useState } from 'react';
import { Typography } from '../ui/Typography';
import { Button } from '../ui/Button';

export const GroupPlayersSetup = ({ onNavigate }) => {
  const [players, setPlayers] = useState([]);
  const [currentName, setCurrentName] = useState('');

  const handleAddPlayer = () => {
    const trimmed = currentName.trim();
    if (trimmed && players.length < 7) {
      setPlayers([...players, trimmed]);
      setCurrentName('');
    }
  };

  const handleRemovePlayer = (index) => {
    setPlayers(players.filter((_, i) => i !== index));
  };

  const handleStartGame = () => {
    if (players.length >= 2) {
      // Futuro: guardar arreglo de jugadores en contexto
      onNavigate('question');
    }
  };

  return (
    <div className="setup-screen fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', height: '100%', padding: '3rem 1.5rem' }}>
      <div className="glass-card fade-in" style={{ padding: '2rem 1.5rem', width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'center' }}>
        <Typography variant="h2" style={{ fontSize: '1.8rem', paddingBottom: '0.5rem' }}>¿Quiénes están jugando?</Typography>
        
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input 
            type="text" 
            placeholder="Nombre del jugador" 
            value={currentName}
            onChange={(e) => setCurrentName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddPlayer()}
            style={{
              flex: 1, padding: '0.8rem 1rem', borderRadius: '12px', 
              border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.3)', 
              color: 'white', outline: 'none', fontSize: '1rem', fontFamily: 'var(--font-family)'
            }}
            disabled={players.length >= 7}
          />
          <button 
            onClick={handleAddPlayer} 
            disabled={players.length >= 7 || !currentName.trim()}
            style={{ 
              width: '50px', background: 'var(--grad-primary)', border: 'none', 
              borderRadius: '12px', color: 'white', fontSize: '1.5rem', cursor: 'pointer',
              opacity: players.length >= 7 || !currentName.trim() ? 0.5 : 1, transition: '0.3s'
            }}
          >
            +
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minHeight: '120px', maxHeight: '220px', overflowY: 'auto', paddingRight: '0.2rem' }}>
          {players.length === 0 && <Typography variant="body" style={{ opacity: 0.5, marginTop: '2rem' }}>Añade al menos 2 jugadores...</Typography>}
          {players.map((name, index) => (
            <div key={index} className="fade-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.8rem 1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 500 }}>{name}</span>
              <button 
                onClick={() => handleRemovePlayer(index)}
                style={{ background: 'transparent', border: 'none', color: '#ff4d4d', cursor: 'pointer', fontSize: '1.2rem', padding: '0 0.5rem' }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        
        <Typography variant="body" style={{ fontSize: '0.9rem', opacity: 0.7 }}>
          {players.length} / 7 jugadores
        </Typography>

        <button 
          className="btn"
          onClick={handleStartGame} 
          style={{ 
            marginTop: '0.5rem', 
            background: 'linear-gradient(135deg, #ff7a00, #ff4c4c)', 
            boxShadow: '0 4px 15px rgba(255, 122, 0, 0.4)',
            opacity: players.length >= 2 ? 1 : 0.4, 
            pointerEvents: players.length >= 2 ? 'auto' : 'none' 
          }}
        >
          Comenzar juego
        </button>
      </div>
    </div>
  );
};
