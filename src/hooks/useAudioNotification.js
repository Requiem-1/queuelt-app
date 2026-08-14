import { useRef, useCallback, useEffect, useState } from 'react';

/**
 * Custom Hook for managing synthesized web audio alerts safely.
 * Manages AudioContext lifecycle to prevent browser context exhaustion.
 */
export const useAudioNotification = (initialEnabled = true) => {
  const [audioEnabled, setAudioEnabled] = useState(() => {
    if (typeof window === 'undefined') return initialEnabled;
    const stored = localStorage.getItem('queueit_audio_enabled');
    return stored !== null ? stored === 'true' : initialEnabled;
  });

  const audioCtxRef = useRef(null);

  const getAudioContext = useCallback(() => {
    if (typeof window === 'undefined') return null;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;

    if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
      audioCtxRef.current = new AudioCtx();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume().catch(() => {});
    }
    return audioCtxRef.current;
  }, []);

  const playChime = useCallback(() => {
    if (!audioEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      gain1.gain.setValueAtTime(0.15, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(ctx.currentTime);
      osc1.stop(ctx.currentTime + 0.5);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(659.25, ctx.currentTime + 0.12); // E5
      gain2.gain.setValueAtTime(0.12, ctx.currentTime + 0.12);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.65);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(ctx.currentTime + 0.12);
      osc2.stop(ctx.currentTime + 0.65);
    } catch (err) {
      console.warn('[useAudioNotification]: Failed to play chime:', err.message);
    }
  }, [audioEnabled, getAudioContext]);

  const toggleAudio = useCallback(() => {
    setAudioEnabled((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('queueit_audio_enabled', String(next));
      }
      return next;
    });
  }, []);

  useEffect(() => {
    return () => {
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  return {
    audioEnabled,
    playChime,
    toggleAudio,
  };
};

export default useAudioNotification;
