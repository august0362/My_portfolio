import { useEffect, useState } from 'react';

export type AudioStatus = 'ready' | 'playing' | 'unavailable';
type Touch = 'hover' | 'press' | 'ambient';

export default function useCelestialAudio() {
  const [status, setStatus] = useState<AudioStatus>('ready');

  useEffect(() => {
    let context: AudioContext | undefined;
    let input: GainNode;
    let breath: AudioBuffer;
    let disposed = false, voices = 0, note = 0, lastSound = -1;
    let hoverTimer = 0, ambientTimer = 0;
    const sources = new Set<AudioScheduledSourceNode>();
    const notes = [392, 440, 523.25, 329.63, 587.33];

    function play(kind: Touch) {
      if (!context || context.state !== 'running' || document.hidden || voices >= 3) return;
      const now = context.currentTime;
      if (now - lastSound < (kind === 'press' ? 0.18 : 0.5)) return;
      lastSound = now; voices++;
      const duration = kind === 'ambient' ? 1.5 : kind === 'press' ? 0.95 : 0.6;
      const peak = kind === 'press' ? 0.045 : kind === 'ambient' ? 0.018 : 0.017;
      const frequency = kind === 'ambient' ? [329.63, 392, 440][note++ % 3] : notes[note++ % notes.length];
      const oscillator = context.createOscillator(), envelope = context.createGain();
      const pan = context.createStereoPanner();
      pan.pan.value = ((note % 5) - 2) * 0.09;
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequency * 1.012, now);
      oscillator.frequency.exponentialRampToValueAtTime(frequency, now + 0.09);
      envelope.gain.setValueAtTime(0, now);
      envelope.gain.linearRampToValueAtTime(peak, now + (kind === 'ambient' ? 0.1 : 0.028));
      envelope.gain.exponentialRampToValueAtTime(0.00001, now + duration);
      oscillator.connect(envelope); envelope.connect(pan); pan.connect(input);
      oscillator.start(now); oscillator.stop(now + duration + 0.03); sources.add(oscillator);
      oscillator.onended = () => { voices--; sources.delete(oscillator); oscillator.disconnect(); envelope.disconnect(); pan.disconnect(); };
      // A tiny filtered air transient softens the pure tone without high harmonics.
      if (kind === 'press') {
        const air = context.createBufferSource(), gain = context.createGain();
        air.buffer = breath; gain.gain.value = 0.016;
        air.connect(gain); gain.connect(input); air.start(now); air.stop(now + 0.18); sources.add(air);
        air.onended = () => { sources.delete(air); air.disconnect(); gain.disconnect(); };
      }
    }

    function scheduleAmbient() {
      window.clearTimeout(ambientTimer);
      if (!context || context.state !== 'running' || document.hidden || disposed) return;
      ambientTimer = window.setTimeout(() => { play('ambient'); scheduleAmbient(); }, 11000 + Math.random() * 6000);
    }

    function createSoundscape() {
      if (context) return;
      context = new AudioContext();
      input = context.createGain();
      const dry = context.createGain(), wet = context.createGain(), reverb = context.createConvolver();
      const lowpass = context.createBiquadFilter(), highpass = context.createBiquadFilter();
      const master = context.createGain();
      dry.gain.value = 0.82; wet.gain.value = 0.16; master.gain.value = 0.65;
      highpass.type = 'highpass'; highpass.frequency.value = 180; highpass.Q.value = 0.5;
      lowpass.type = 'lowpass'; lowpass.frequency.value = 1500; lowpass.Q.value = 0.5;
      input.connect(dry); dry.connect(highpass); input.connect(reverb); reverb.connect(wet); wet.connect(highpass);
      highpass.connect(lowpass); lowpass.connect(master); master.connect(context.destination);
      // Original, finite stereo reflections; no drone, detuning or endless oscillators.
      const impulse = context.createBuffer(2, Math.floor(context.sampleRate * 1.25), context.sampleRate);
      for (let channel = 0; channel < 2; channel++) {
        const samples = impulse.getChannelData(channel); let soft = 0;
        for (let index = 0; index < samples.length; index++) {
          soft += ((Math.random() * 2 - 1) - soft) * 0.12;
          samples[index] = soft * Math.pow(1 - index / samples.length, 3) * Math.min(1, index / (context.sampleRate * 0.015));
        }
      }
      reverb.buffer = impulse;
      breath = context.createBuffer(1, Math.floor(context.sampleRate * 0.18), context.sampleRate);
      const air = breath.getChannelData(0); let soft = 0;
      for (let index = 0; index < air.length; index++) {
        soft += ((Math.random() * 2 - 1) - soft) * 0.08;
        air[index] = soft * Math.sin(index / air.length * Math.PI) ** 2;
      }
      context.onstatechange = () => {
        if (disposed) return;
        setStatus(context?.state === 'running' ? 'playing' : 'ready'); scheduleAmbient();
      };
      scheduleAmbient();
    }

    const unlock = (event: Event) => {
      if (!event.isTrusted || disposed) return;
      try {
        createSoundscape();
        if (context!.state !== 'running') void context!.resume().catch(() => { /* Retry at the next gesture. */ });
        else setStatus('playing');
      } catch { setStatus('unavailable'); }
    };
    const chime = (event: Event) => {
      if (!(event.target instanceof Element)) return;
      const target = event.target.closest('a, button');
      const related = (event as PointerEvent).relatedTarget;
      if (!target || (related instanceof Node && target.contains(related))) return;
      window.clearTimeout(hoverTimer);
      if (event.type === 'click') play('press');
      else hoverTimer = window.setTimeout(() => {
        if (target.isConnected && (target.matches(':hover') || target.matches(':focus-visible'))) play('hover');
      }, 110);
    };
    const leave = (event: PointerEvent) => {
      if (!(event.target instanceof Element)) return;
      const target = event.target.closest('a, button');
      if (target && (!(event.relatedTarget instanceof Node) || !target.contains(event.relatedTarget))) window.clearTimeout(hoverTimer);
    };
    const visibility = () => {
      window.clearTimeout(ambientTimer); window.clearTimeout(hoverTimer);
      if (!context || context.state === 'closed') return;
      if (document.hidden) void context.suspend().catch(() => {});
      else void context.resume().catch(() => {});
    };
    window.addEventListener('pointerdown', unlock, { capture: true });
    window.addEventListener('keydown', unlock, { capture: true });
    document.addEventListener('click', chime); document.addEventListener('pointerover', chime); document.addEventListener('focusin', chime);
    document.addEventListener('pointerout', leave); document.addEventListener('visibilitychange', visibility);
    return () => {
      disposed = true;
      window.clearTimeout(ambientTimer); window.clearTimeout(hoverTimer);
      window.removeEventListener('pointerdown', unlock, { capture: true }); window.removeEventListener('keydown', unlock, { capture: true });
      document.removeEventListener('click', chime); document.removeEventListener('pointerover', chime); document.removeEventListener('focusin', chime);
      document.removeEventListener('pointerout', leave); document.removeEventListener('visibilitychange', visibility);
      for (const source of sources) { try { source.stop(); } catch { /* Already ended. */ } }
      sources.clear();
      if (context) { context.onstatechange = null; void context.close().catch(() => {}); }
    };
  }, []);

  return status;
}
