import { useState } from 'react';
import { AgeGate } from '../components/AgeGate';
import { Home } from '../screens/Home';
import { Question } from '../screens/Question';
import { PairsSetup } from '../screens/PairsSetup';
import { GroupPlayersSetup } from '../screens/GroupPlayersSetup';
import { IntroSequence } from '../components/IntroSequence';
import { Verdict } from '../screens/Verdict';

export const App = () => {
  const [ageVerified, setAgeVerified] = useState(
    localStorage.getItem("ageVerified") === "true"
  );
  const [screen, setScreen] = useState('home');
  const [screenData, setScreenData] = useState(null);
  const [hasSeenIntro, setHasSeenIntro] = useState(false);
  const [phase, setPhase] = useState(hasSeenIntro ? 'home' : 'intro');

  const handleNavigate = (newScreen, data = null) => {
    setScreenData(data);
    setScreen(newScreen);
  };

  const handleIntroComplete = () => {
    setHasSeenIntro(true);
    setPhase('home');
  };

  const handleAgeAccept = () => {
    localStorage.setItem("ageVerified", "true");
    setAgeVerified(true);
  };

  return (
    <>
      {!ageVerified && <AgeGate onAccept={handleAgeAccept} />}
      {phase === 'intro' && <IntroSequence onComplete={handleIntroComplete} />}
      {phase === 'home' && screen === 'home' && <Home onNavigate={handleNavigate} />}
      {phase === 'home' && screen === 'pairsSetup' && <PairsSetup onNavigate={handleNavigate} />}
      {phase === 'home' && screen === 'groupSetup' && <GroupPlayersSetup onNavigate={handleNavigate} />}
      {phase === 'home' && screen === 'question' && <Question onNavigate={handleNavigate} />}
      {phase === 'home' && screen === 'verdict' && <Verdict onNavigate={handleNavigate} stats={screenData} />}
    </>
  );
};
