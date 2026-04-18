import { useState, useEffect } from 'react';
import { Typography } from '../ui/Typography';
import { Button } from '../ui/Button';
import { GlassCard } from '../ui/GlassCard';
import './Question.css';

// Arquitectura de Memoria Profunda: Pools Cíclicos
const POOLS = {
  question: [
    { text: "¿Sueles decir lo que piensas de inmediato cuando algo te molesta?", format: "boolean" },
    { text: "¿Alguna vez has revisado el celular ajeno sin permiso?", format: "boolean" },
    { text: "¿Qué pequeña mentira le sigues sosteniendo a tu pareja?", format: "text", placeholder: "Ej: 'Digo que me gusta algo que hace cuando no...'" },
    { text: "¿Consideras la fidelidad emocional tan estricta como la física?", format: "boolean" },
    { text: "Si pudieras borrar un solo recuerdo de tu historial romántico, ¿qué evitarías revivir?", format: "text" }
  ],
  challenge: [
    { text: "Mírense a los ojos en silencio y sin reírse. El primero en reír pierde su honor.", duration: 15 },
    { text: "Busca en tu Instagram tu última actividad reciente y muéstrala.", duration: 10 },
    { text: "Confiesa en voz alta la última vez que sentiste celos sin ningún puto motivo.", duration: 20 }
  ],
  never: [
    { text: "Yo nunca nunca he dicho 'te amo' a alguien sin sentirlo de verdad." },
    { text: "Yo nunca nunca me he planteado ser infiel, aunque fuera por pura curiosidad." },
    { text: "Yo nunca nunca he simulado disfrutar algo en el terreno sexual solo por complacer." }
  ]
};

const SEQUENCE = ['question', 'challenge', 'never'];
const TOTAL_TURNS = 6; // 2 ciclos completos (pregunta + reto + nunca) para el veredicto

const PLAYERS = ['Jugador 1', 'Jugador 2'];

export const Question = ({ onNavigate }) => {
  const [turn, setTurn] = useState(0);
  const [indices, setIndices] = useState({ question: 0, challenge: 0, never: 0 });
  
  // Estado local Jugador
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [roundAnswers, setRoundAnswers] = useState([]);
  
  const [textAnswer, setTextAnswer] = useState('');
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [feedbackOverlay, setFeedbackOverlay] = useState(null);
  
  // Estado de análisis para Veredicto Final
  const [gameStats, setGameStats] = useState({ matches: 0, differences: 0, openTexts: 0 });

  // Estados Timer Retos Físicos
  const [challengeState, setChallengeState] = useState('idle'); // 'idle' | 'running' | 'finished'
  const [timeLeft, setTimeLeft] = useState(0);

  // Derivación determinista del Turno Actual
  const currentCategory = SEQUENCE[turn % SEQUENCE.length];
  const pool = POOLS[currentCategory];
  const currentIndex = indices[currentCategory] % pool.length;
  const currentQ = pool[currentIndex];

  useEffect(() => {
    let interval = null;
    if (challengeState === 'running' && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (challengeState === 'running' && timeLeft <= 0) {
      setChallengeState('finished');
      clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [challengeState, timeLeft]);

  const advanceTurn = () => {
    setIsAnimatingOut(true);
    setTimeout(() => {
      if (turn + 1 < TOTAL_TURNS) {
        setIndices(prev => ({ ...prev, [currentCategory]: prev[currentCategory] + 1 }));
        setTurn(turn + 1);
        
        // Reset sub-estado multi-jugador y temporizadores
        setCurrentPlayerIndex(0);
        setRoundAnswers([]);
        setTextAnswer('');
        setChallengeState('idle');
        setTimeLeft(0);
        
        setIsAnimatingOut(false);
        setFeedbackOverlay(null);
      } else {
        onNavigate('verdict', gameStats); // Veredicto al terminar ciclos
      }
    }, 450);
  };

  const processQuestionAnswer = (answerValue) => {
    const newAnswers = [...roundAnswers, { player: PLAYERS[currentPlayerIndex], answer: answerValue }];
    
    if (newAnswers.length < PLAYERS.length) {
      // Siguiente jugador local
      setIsAnimatingOut(true);
      setTimeout(() => {
        setRoundAnswers(newAnswers);
        setCurrentPlayerIndex(currentPlayerIndex + 1);
        setTextAnswer('');
        setIsAnimatingOut(false);
      }, 400);
    } else {
      // Detener flujo para colisión visual (ambos respondieron)
      setRoundAnswers(newAnswers);
      setTextAnswer('');

      // Calcular match o diferencias
      let m = 0;
      let d = 0;
      let ot = 0;

      if (currentQ.format === 'boolean') {
        if (newAnswers[0].answer === newAnswers[1].answer) {
          m = 1;
        } else {
          d = 1;
        }
      } else if (currentQ.format === 'text') {
        const textLen = newAnswers[0].answer.length + newAnswers[1].answer.length;
        ot = textLen; // intensity points
        m = 1; // compartir un texto suma como match
      }

      setGameStats(prev => ({
        matches: prev.matches + m,
        differences: prev.differences + d,
        openTexts: prev.openTexts + ot
      }));
    }
  };

  const handleAction = (feedbackMsg = null, statModifier = null) => {
    if (statModifier) {
      setGameStats(prev => ({ ...prev, [statModifier]: prev[statModifier] + 1 }));
    }
    
    if (feedbackMsg) {
      setFeedbackOverlay(feedbackMsg);
      // Brinda un instante emocional para procesar el feedback
      setTimeout(() => advanceTurn(), 2200); 
    } else {
      advanceTurn();
    }
  };

  const renderInteractions = () => {
    if (currentCategory === 'challenge') {
      if (challengeState === 'idle') {
        return (
          <div className="question-actions type-challenge fade-in">
             <Button variant="primary" onClick={() => {
                setTimeLeft(currentQ.duration || 15);
                setChallengeState('running');
             }}>
               🔥 Empezar Reto
             </Button>
          </div>
        );
      }

      if (challengeState === 'running') {
        return (
          <div className="question-actions type-challenge-running fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
             <Typography variant="h1" className="challenge-timer" style={{ fontSize: '4rem', color: '#ff5e7e', textShadow: '0 0 20px rgba(255, 94, 126, 0.6)', margin: '1rem 0' }}>
               {timeLeft}s
             </Typography>
             <Button variant="secondary" onClick={() => handleAction("👀 Bueno, es difícil sostener la tensión. Punto menos...", "differences")} style={{ marginTop: '0.5rem', padding: '0.6rem 1.2rem', fontSize: '0.9rem', opacity: 0.8 }}>
               Me rindo tan pronto
             </Button>
          </div>
        );
      }

      if (challengeState === 'finished') {
        return (
          <div className="question-actions type-challenge fade-in">
            <Button variant="mode-group" onClick={() => handleAction("¡Esa es la actitud, sin miedo al éxito! 🔥", "matches")}>
              Reto Superado
            </Button>
            <Button variant="secondary" onClick={() => handleAction("👀 Bueno, algunos nacieron para obedecer y otros para mirar...", "differences")}>
              No lo logramos
            </Button>
          </div>
        );
      }
    }

    if (currentCategory === 'never') {
      return (
        <div className="question-actions type-never fade-in">
          <Button variant="mode-pairs" onClick={() => handleAction("🍷 Uuuf... par de pecadores, brinden.", "matches")}>
            Ambos Sí 🍷
          </Button>
          <Button variant="secondary" onClick={() => handleAction("👀 Okey, sabemos que alguien está mintiendo o bebiendo.", "differences")}>
            Solo uno 👀
          </Button>
          <Button variant="secondary" onClick={() => handleAction("😇 Mucha inocencia en esta habitación...", "matches")}>
            Ninguno 😇
          </Button>
        </div>
      );
    }

    if (currentQ.format === 'text') {
       const isTextValid = textAnswer.trim().length >= 2;
       return (
         <div className="question-actions type-text fade-in">
           <textarea
             className="question-text-input"
             placeholder={currentQ.placeholder || "Escupe lo que realmente piensas..."}
             value={textAnswer}
             onChange={(e) => setTextAnswer(e.target.value)}
             rows={3}
           />
           <Button variant="primary" onClick={() => processQuestionAnswer(textAnswer)} className={!isTextValid ? 'btn-disabled' : ''}>
             Confesar
           </Button>
         </div>
       );
    }

    return (
       <div className="question-actions type-boolean fade-in">
          <Button variant="secondary" onClick={() => processQuestionAnswer(true)}>Sí</Button>
          <Button variant="secondary" onClick={() => processQuestionAnswer(false)}>No</Button>
       </div>
    );
  };

  const progressPercent = (turn / TOTAL_TURNS) * 100;
  
  // Flag condicional que pausa el juego para reflejar discrepancias
  const showClashScreen = currentCategory === 'question' && roundAnswers.length === PLAYERS.length;

  const getClashFeedback = () => {
    if (!showClashScreen) return "";
    
    if (currentQ.format === 'text') {
      const texts = [
        "🔥 Ufff... esto va a dejar secuelas.",
        "👀 Interesantes declaraciones. Muy fuertes.",
        "💣 Acaban de soltar una bomba en la mesa.",
        "😏 Mucha honestidad por aquí... a ver cuánto dura."
      ];
      return texts[turn % texts.length];
    }
    
    if (roundAnswers[0].answer === roundAnswers[1].answer) {
      const matches = [
        "😈 Compartiendo pecados de la misma talla... me gusta.",
        "🤝 Están tan conectados que asusta un poco.",
        "✨ O son tal para cual, o los dos mienten igual de bien.",
        "🔥 Cuidado, las mentes iguales arden juntas."
      ];
      return matches[turn % matches.length];
    } else {
      const diffs = [
        "👀 Aquí alguien no dice todo… y el otro sí. Esto se va a poner interesante.",
        "😏 Uno habla sin filtro… el otro se guarda cosas. Mala combinación… o muy buena.",
        "😂 Aquí uno explota y el otro se lo traga todo.",
        "🔥 Esto puede generar chispas… y no de las buenas."
      ];
      return diffs[turn % diffs.length];
    }
  };

  return (
    <div className={`question-screen fade-in context-${currentCategory}`}>
      
      {/* Barra Evolutiva Emocional */}
      <div className="progress-container">
         <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}>
           <div className={`progress-glow glow-${currentCategory}`}></div>
         </div>
      </div>

      <div className={`question-transition-wrapper ${isAnimatingOut ? 'slide-out' : 'slide-in'}`}>
         
         {showClashScreen ? (
          <GlassCard className="clash-card pop-in">
             <Typography variant="h2" className="clash-title">La Verdad Expuesta</Typography>
             
             <div className="answers-comparison">
                {roundAnswers.map((ans, idx) => (
                  <div key={idx} className={`player-answer-block delay-${idx}`}>
                    <span className="player-name">{ans.player}</span>
                    <span className="player-response">
                      {currentQ.format === 'boolean' ? (ans.answer ? 'Sí' : 'No') : `"${ans.answer}"`}
                    </span>
                  </div>
                ))}
             </div>
             
             <Typography variant="subtitle" className="clash-emotion">
                {getClashFeedback()}
             </Typography>
             
             <Button variant="mode-pairs" onClick={() => advanceTurn()} className="clash-continue-btn">
               Afrontar Consecuencias
             </Button>
          </GlassCard>
        ) : feedbackOverlay ? (
          <GlassCard className="feedback-card pop-in">
            <Typography variant="h2" className="feedback-text">{feedbackOverlay}</Typography>
          </GlassCard>
        ) : (
          <GlassCard>
             <div className={`category-badge badge-${currentCategory} ${currentCategory === 'question' ? 'turn-pulse' : ''}`}>
               {currentCategory === 'challenge' && "🔥 RETO FÍSICO"}
               {currentCategory === 'never' && "🍷 YO NUNCA PENSÉ"}
               {currentCategory === 'question' && `💭 TURNO: ${PLAYERS[currentPlayerIndex].toUpperCase()}`}
             </div>
            
            <Typography variant="question">
               {currentQ.text}
            </Typography>
            
            {renderInteractions()}
          </GlassCard>
        )}
      </div>
    </div>
  );
};
