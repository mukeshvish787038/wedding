import { useSyncExternalStore } from 'react';
import { sound } from '../lib/audio';
import { Icon } from './Icon';

export function SoundToggle() {
  const muted = useSyncExternalStore(
    (cb) => sound.subscribe(cb),
    () => sound.isMuted(),
    () => false,
  );
  return (
    <button
      type="button"
      className="sound-toggle"
      onClick={() => sound.toggle()}
      aria-pressed={!muted}
      aria-label={muted ? 'ध्वनि चालू करें' : 'ध्वनि बंद करें'}
      title={muted ? 'ध्वनि चालू करें' : 'ध्वनि बंद करें'}
    >
      <Icon name={muted ? 'mute' : 'volume'} size={22} />
    </button>
  );
}
