import { useCallback, useEffect, useRef, useState } from 'react';
import { Temple, type TempleStage } from './components/Temple';
import { Envelope } from './components/Envelope';
import { InvitationCard, FamilyCard } from './components/Card';
import { Countdown } from './components/Countdown';
import { Events } from './components/Events';
import { Venue } from './components/Venue';
import { Gallery } from './components/Gallery';
import { Rsvp } from './components/Rsvp';
import { Footer } from './components/Footer';
import { SoundToggle } from './components/SoundToggle';
import { sound } from './lib/audio';
import { useReducedMotion } from './lib/hooks';

type Scene = 'temple' | 'envelope' | 'invitation';

export default function App() {
  const reduced = useReducedMotion();
  const [scene, setScene] = useState<Scene>('temple');
  const [leaving, setLeaving] = useState(false);
  const [templeStage, setTempleStage] = useState<TempleStage>('idle');
  const timers = useRef<number[]>([]);

  const t = useCallback(
    (fn: () => void, ms: number) => {
      timers.current.push(window.setTimeout(fn, reduced ? Math.min(ms, 500) : ms));
    },
    [reduced],
  );
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // lock page scroll during the cinematic scenes
  useEffect(() => {
    document.body.classList.toggle('locked', scene !== 'invitation');
    if (scene === 'invitation') window.scrollTo(0, 0);
  }, [scene]);

  const goTo = useCallback((next: Scene) => {
    setLeaving(true);
    window.setTimeout(() => {
      setScene(next);
      setLeaving(false);
    }, 520);
  }, []);

  const lightDiya = () => {
    if (templeStage !== 'idle') return;
    sound.unlock(); // allowed: we are inside a tap handler
    sound.bell();
    setTempleStage('lit');
    t(() => {
      setTempleStage('opening');
      sound.conch();
    }, 1700);
    t(() => setTempleStage('sanctum'), 3600);
    t(() => sound.startBackground(), 4200);
    t(() => goTo('envelope'), 9200);
  };

  const skip = () => {
    sound.unlock();
    sound.startBackground();
    timers.current.forEach(clearTimeout);
    timers.current = [];
    goTo('envelope');
  };

  return (
    <div className={`app scene-${scene} ${leaving ? 'leaving' : ''}`}>
      <SoundToggle />

      {scene === 'temple' && <Temple stage={templeStage} onLight={lightDiya} onSkip={skip} reduced={reduced} />}

      {scene === 'envelope' && <Envelope reduced={reduced} onDone={() => goTo('invitation')} />}

      {scene === 'invitation' && (
        <main className="invitation">
          <div className="inv-bg" aria-hidden="true" />
          <div className="inv-col">
            <InvitationCard />
            <FamilyCard />
            <Countdown />
            <Events />
            <Venue />
            <Gallery />
            <Rsvp />
            <Footer />
          </div>
        </main>
      )}
    </div>
  );
}
