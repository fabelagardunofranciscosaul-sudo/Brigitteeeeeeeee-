import { AssistantMode } from '../types/assistant';

class SoundEffectsController {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Tactical HUD chirp
  playTacticalPing(volume = 0.15) {
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch {
      // Audio not permitted yet
    }
  }

  // Incoming message electronic chirp
  playIncomingMessageSound(volume = 0.2) {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'triangle';
      osc2.type = 'sine';

      osc1.frequency.setValueAtTime(659.25, now); // E5
      osc1.frequency.setValueAtTime(987.77, now + 0.07); // B5

      osc2.frequency.setValueAtTime(1318.51, now + 0.07); // E6

      gain.gain.setValueAtTime(volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc1.stop(now + 0.22);
      osc2.start(now + 0.07);
      osc2.stop(now + 0.22);
    } catch {}
  }

  // Incoming Call Ringtone
  playCallChime(volume = 0.25) {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      
      const freqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);

        gain.gain.setValueAtTime(volume * 0.7, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.25);
      });
    } catch {}
  }

  // Critical Emergency Siren pulse
  playCriticalAlarm(volume = 0.3) {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.linearRampToValueAtTime(880, now + 0.15);
      osc.frequency.linearRampToValueAtTime(440, now + 0.3);

      gain.gain.setValueAtTime(volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch {}
  }

  // Memory Synapse Crunch
  playMemoryIndexing(volume = 0.15) {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(1400, now + 0.15);

      gain.gain.setValueAtTime(volume * 0.6, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.18);
    } catch {}
  }
}

export const soundFx = new SoundEffectsController();

export class VoiceSynthesizer {
  private static instance: VoiceSynthesizer;
  private isSpeaking = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private onStateChangeListeners: Array<(speaking: boolean) => void> = [];

  private constructor() {}

  public static getInstance(): VoiceSynthesizer {
    if (!VoiceSynthesizer.instance) {
      VoiceSynthesizer.instance = new VoiceSynthesizer();
    }
    return VoiceSynthesizer.instance;
  }

  public subscribe(listener: (speaking: boolean) => void) {
    this.onStateChangeListeners.push(listener);
    return () => {
      this.onStateChangeListeners = this.onStateChangeListeners.filter(l => l !== listener);
    };
  }

  private notify(speaking: boolean) {
    this.isSpeaking = speaking;
    this.onStateChangeListeners.forEach(listener => listener(speaking));
  }

  public stop() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.notify(false);
    }
  }

  public getIsSpeaking(): boolean {
    return this.isSpeaking;
  }

  public speak(
    text: string, 
    mode: AssistantMode = 'chappie', 
    customPitch?: number, 
    customRate?: number
  ): Promise<void> {
    return new Promise((resolve) => {
      if (!('speechSynthesis' in window)) {
        console.warn('Speech synthesis not supported in this browser');
        resolve();
        return;
      }

      this.stop();

      const utterance = new SpeechSynthesisUtterance(text);
      this.currentUtterance = utterance;

      const voices = window.speechSynthesis.getVoices();
      // Try to find a Spanish voice, or fallback to first available
      const esVoice = voices.find(v => v.lang.startsWith('es')) || voices[0];
      if (esVoice) {
        utterance.voice = esVoice;
      }

      // Voice persona parameter customization
      if (mode === 'chappie') {
        utterance.pitch = customPitch !== undefined ? customPitch : 1.15; // Slightly expressive & energetic
        utterance.rate = customRate !== undefined ? customRate : 1.08;
      } else {
        // Alexa style: warm, steady, calm
        utterance.pitch = customPitch !== undefined ? customPitch : 1.0;
        utterance.rate = customRate !== undefined ? customRate : 1.0;
      }

      utterance.onstart = () => {
        this.notify(true);
      };

      utterance.onend = () => {
        this.notify(false);
        resolve();
      };

      utterance.onerror = () => {
        this.notify(false);
        resolve();
      };

      window.speechSynthesis.speak(utterance);
    });
  }
}

export const voiceSynth = VoiceSynthesizer.getInstance();
