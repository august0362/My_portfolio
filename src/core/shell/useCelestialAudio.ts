import { useEffect, useState } from 'react';

export type AudioStatus = 'ready' | 'playing' | 'unavailable';

export default function useCelestialAudio() {
  const [status, setStatus] = useState<AudioStatus>('ready');

  useEffect(() => {
    let context: AudioContext | undefined;
    let master: GainNode;
    let disposed = false;
    let lastChime = 0;
    let note = 0;
    const notes = [523.25, 587.33, 659.25, 783.99, 880];

    function createSoundscape() {
      if (context) return;
      context = new AudioContext();
      master = context.createGain();
      master.gain.setValueAtTime(0, context.currentTime);
      master.gain.linearRampToValueAtTime(0.18, context.currentTime + 1.5);
      master.connect(context.destination);
      const filter = context.createBiquadFilter();
      filter.type = 'lowpass'; filter.frequency.value = 1100;
      filter.connect(master);
      // Original synthesized harmony: no remote audio, loops or sample licenses.
      [130.81, 196, 261.63].forEach((frequency, index) => {
        const oscillator = context!.createOscillator();
        const voice = context!.createGain();
        oscillator.type = 'sine'; oscillator.frequency.value = frequency;
        oscillator.detune.value = [-3, 2, 4][index];
        voice.gain.value = [0.065, 0.04, 0.025][index];
        oscillator.connect(voice); voice.connect(filter); oscillator.start();
        const breath = context!.createOscillator();
        const depth = context!.createGain();
        breath.frequency.value = 0.07 + index * 0.017; depth.gain.value = 0.012;
        breath.connect(depth); depth.connect(voice.gain); breath.start();
      });
      context.onstatechange = () => {
        if (!disposed) setStatus(context?.state === 'running' ? 'playing' : 'ready');
      };
    }

    const unlock = (event: Event) => {
      if (!event.isTrusted || disposed) return;
      try {
        createSoundscape();
        if (context!.state !== 'running') void context!.resume().catch(() => { /* Retry at the next user gesture. */ });
        else setStatus('playing');
      } catch { setStatus('unavailable'); }
    };

    const chime = (event: Event) => {
      if (!context || context.state !== 'running' || document.hidden) return;
      const target = event.target instanceof Element ? event.target.closest('a, button') : null;
      const related = (event as PointerEvent).relatedTarget;
      if (!target || (event.type === 'pointerover' && related instanceof Node && target.contains(related))) return;
      const now = context.currentTime;
      if (now - lastChime < 0.13) return;
      lastChime = now;
      const frequency = notes[note++ % notes.length];
      [1, 2].forEach((harmonic) => {
        const oscillator = context!.createOscillator();
        const envelope = context!.createGain();
        oscillator.type = 'sine'; oscillator.frequency.value = frequency * harmonic;
        envelope.gain.setValueAtTime(0, now);
        envelope.gain.linearRampToValueAtTime((event.type === 'click' ? 0.16 : 0.08) / harmonic, now + 0.015);
        envelope.gain.exponentialRampToValueAtTime(0.0001, now + 0.85);
        oscillator.connect(envelope); envelope.connect(master);
        oscillator.start(now); oscillator.stop(now + 0.9);
        oscillator.onended = () => { oscillator.disconnect(); envelope.disconnect(); };
      });
    };

    const visibility = () => {
      if (!context || context.state === 'closed') return;
      if (document.hidden) void context.suspend().catch(() => {});
      else void context.resume().catch(() => {});
    };
    window.addEventListener('pointerdown', unlock, { capture: true });
    window.addEventListener('keydown', unlock, { capture: true });
    document.addEventListener('click', chime);
    document.addEventListener('pointerover', chime);
    document.addEventListener('focusin', chime);
    document.addEventListener('visibilitychange', visibility);
    return () => {
      disposed = true;
      window.removeEventListener('pointerdown', unlock, { capture: true });
      window.removeEventListener('keydown', unlock, { capture: true });
      document.removeEventListener('click', chime);
      document.removeEventListener('pointerover', chime);
      document.removeEventListener('focusin', chime);
      document.removeEventListener('visibilitychange', visibility);
      if (context) { context.onstatechange = null; void context.close().catch(() => {}); }
    };
  }, []);

  return status;
}
