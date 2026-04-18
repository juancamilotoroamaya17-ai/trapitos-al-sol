import { useState, useEffect } from 'react';
import { Typography } from '../ui/Typography';
import { Button } from '../ui/Button';
import '../screens/Home.css';

const INTRO_TIMELINE = {
  wormhole: 0,
  asteroids: 1500,
  title: 2500,
  subtitle: 3200,
  buttons: 4500,
  end: 6000,
};

export const IntroSequence = ({ onComplete }) => {
  const [phaseTime, setPhaseTime] = useState(0);
  const [typingDone, setTypingDone] = useState(false);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhaseTime(INTRO_TIMELINE.wormhole), INTRO_TIMELINE.wormhole),
      setTimeout(() => setPhaseTime(INTRO_TIMELINE.asteroids), INTRO_TIMELINE.asteroids),
      setTimeout(() => setPhaseTime(INTRO_TIMELINE.title), INTRO_TIMELINE.title),
      setTimeout(() => setPhaseTime(INTRO_TIMELINE.subtitle), INTRO_TIMELINE.subtitle),
      setTimeout(() => setPhaseTime(INTRO_TIMELINE.buttons), INTRO_TIMELINE.buttons)
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (typingDone) {
      const timer = setTimeout(() => {
        if (onComplete) onComplete();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [typingDone, onComplete]);

  const showWormhole = phaseTime >= INTRO_TIMELINE.wormhole && phaseTime < INTRO_TIMELINE.title;
  const showAsteroids = phaseTime >= INTRO_TIMELINE.asteroids && phaseTime < INTRO_TIMELINE.title;
  const showTitle = phaseTime >= INTRO_TIMELINE.title;
  const showSubtitle = phaseTime >= INTRO_TIMELINE.subtitle;
  const showButtons = phaseTime >= INTRO_TIMELINE.buttons;

  const fullText = "Entre el espacio y la tierra no hay nada oculto";
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    if (!showSubtitle || typingDone) return;
    let i = 0;
    const interval = setInterval(() => {
      // Usar callback state para evitar estaleness de variables locales cerradas
      setDisplayedText(fullText.slice(0, i + 1));
      i++;
      if (i === fullText.length) {
        clearInterval(interval);
        setTypingDone(true);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [showSubtitle, typingDone]);

  return (
    <div className={`home-screen fade-in is-intro`}>
      
      {showWormhole && (
        <div className={`wormhole active`}></div>
      )}

      <div className="home-content">
        <div className="title-container">
          {showAsteroids && (
            <>
              <div className="asteroid-wrapper asteroid-left">
                 <div className="heat-trail"></div>
                 <div className="asteroid-rock"></div>
              </div>
              <div className="asteroid-wrapper asteroid-right">
                 <div className="heat-trail"></div>
                 <div className="asteroid-rock"></div>
              </div>
            </>
          )}
          
          {showTitle && (
            <>
              <div className="collision-flash"></div>
              <div className="explosion-wave"></div>
              <div className="fragments">
                 <div className="fragment f1"></div>
                 <div className="fragment f2"></div>
                 <div className="fragment f3"></div>
                 <div className="fragment f4"></div>
                 <div className="fragment f5"></div>
                 <div className="fragment f6"></div>
              </div>
              <div className="energy-clouds">
                 <div className="cloud c-fuchsia"></div>
                 <div className="cloud c-violet"></div>
                 <div className="cloud c-mix"></div>
              </div>
            </>
          )}

          {showTitle && (
            <div className={`title-text-wrap pop-in`}>
               <span className="emoji-angel">
                  <svg className="emoji-svg" viewBox="0 0 100 100" width="1em" height="1em" xmlns="http://www.w3.org/2000/svg" style={{ verticalAlign: 'middle' }}>
                    <defs>
                      <radialGradient id="angelFace" cx="35%" cy="30%" r="75%">
                        <stop offset="0%" stopColor="#fffce0" />
                        <stop offset="50%" stopColor="#ffe680" />
                        <stop offset="100%" stopColor="#f5b800" />
                      </radialGradient>
                      <linearGradient id="haloLight" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ffffff" />
                        <stop offset="100%" stopColor="#80c6ff" />
                      </linearGradient>
                    </defs>
                    <ellipse cx="50" cy="18" rx="28" ry="8" stroke="url(#haloLight)" strokeWidth="5" fill="none" filter="drop-shadow(0 0 2px rgba(255,255,255,0.8))"/>
                    <circle cx="50" cy="60" r="38" fill="url(#angelFace)" />
                    <circle cx="28" cy="65" r="7" fill="#ff7a7a" opacity="0.4" />
                    <circle cx="72" cy="65" r="7" fill="#ff7a7a" opacity="0.4" />
                    <path d="M 40 75 Q 50 82 60 75" stroke="#8a5c1d" strokeWidth="3" fill="none" strokeLinecap="round" />
                    <path d="M 26 50 Q 33 43 40 50" stroke="#8a5c1d" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                    <path d="M 60 50 Q 67 43 74 50" stroke="#8a5c1d" strokeWidth="3.5" fill="none" strokeLinecap="round" className="angel-eye-normal" />
                    <path d="M 60 48 Q 67 52 74 48" stroke="#8a5c1d" strokeWidth="3.5" fill="none" strokeLinecap="round" className="angel-eye-wink" />
                  </svg>
               </span>
               <Typography variant="h1" className="main-title">Trapitos al Sol</Typography>
               <span className="emoji-devil">
                  <svg className="emoji-svg" viewBox="0 0 100 100" width="1em" height="1em" xmlns="http://www.w3.org/2000/svg" style={{ verticalAlign: 'middle' }}>
                    <defs>
                      <radialGradient id="devilFace" cx="35%" cy="30%" r="75%">
                        <stop offset="0%" stopColor="#d26bff" />
                        <stop offset="50%" stopColor="#8a2be2" />
                        <stop offset="100%" stopColor="#4b0082" />
                      </radialGradient>
                      <linearGradient id="devilHorns" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#ff5e7e" />
                        <stop offset="50%" stopColor="#d26bff" />
                        <stop offset="100%" stopColor="#4b0082" />
                      </linearGradient>
                    </defs>
                    <path d="M 22 40 C 12 15 30 10 42 28 Z" fill="url(#devilHorns)" />
                    <path d="M 78 40 C 88 15 70 10 58 28 Z" fill="url(#devilHorns)" />
                    <circle cx="50" cy="55" r="38" fill="url(#devilFace)" />
                    <path d="M 32 50 Q 38 48 44 51" stroke="#2a001a" strokeWidth="3" strokeLinecap="round" fill="none" />
                    <circle cx="41" cy="50" r="2.5" fill="#2a001a" />
                    <path d="M 56 49 Q 62 47 68 50" stroke="#2a001a" strokeWidth="3" strokeLinecap="round" fill="none" />
                    <circle cx="65" cy="49" r="2.5" fill="#2a001a" />
                    <path d="M 28 44 Q 36 41 45 45" stroke="#2a001a" strokeWidth="3" strokeLinecap="round" fill="none" />
                    <path d="M 55 43 Q 63 36 72 40" stroke="#2a001a" strokeWidth="3" strokeLinecap="round" fill="none" />
                    <path d="M 35 66 Q 50 70 65 60" stroke="#2a001a" strokeWidth="3" strokeLinecap="round" fill="none" />
                    <path d="M 64 56 Q 67 60 63 63" stroke="#2a001a" strokeWidth="2" strokeLinecap="round" fill="none" />
                  </svg>
               </span>
            </div>
          )}
        </div>

        {showSubtitle && (
          <div className="subtitle-wrap">
             <Typography variant="subtitle">{displayedText}</Typography>
          </div>
        )}
        
        {showButtons && (
          <div className="home-actions show-buttons">
            <Button variant="mode-pairs" className="btn-pop-1">
              Modo Parejas
            </Button>
            <Button variant="mode-group" className="btn-pop-2">
              Modo Grupo
            </Button>
            <Button variant="mode-individual" className="btn-pop-3">
              Modo Exploración
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
