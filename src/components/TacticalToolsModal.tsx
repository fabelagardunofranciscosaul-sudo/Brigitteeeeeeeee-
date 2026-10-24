import React, { useState, useEffect } from 'react';
import { 
  X, 
  Clock, 
  MapPin, 
  Radio, 
  Flashlight, 
  Calculator, 
  Play, 
  Pause, 
  RotateCcw, 
  Compass, 
  Volume2, 
  ShieldAlert 
} from 'lucide-react';
import { soundFx } from '../utils/audioVoice';

export type TacticalToolType = 'timer' | 'flashlight' | 'map' | 'music' | 'calc' | null;

interface TacticalToolsModalProps {
  tool: TacticalToolType;
  onClose: () => void;
}

export const TacticalToolsModal: React.FC<TacticalToolsModalProps> = ({ tool, onClose }) => {
  if (!tool) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-xl rounded-2xl border-2 border-amber-500/50 bg-[#090b13] p-5 shadow-2xl relative flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            {tool === 'timer' && <Clock className="w-5 h-5 text-amber-400" />}
            {tool === 'flashlight' && <Flashlight className="w-5 h-5 text-amber-400" />}
            {tool === 'map' && <MapPin className="w-5 h-5 text-cyan-400" />}
            {tool === 'music' && <Radio className="w-5 h-5 text-purple-400" />}
            {tool === 'calc' && <Calculator className="w-5 h-5 text-emerald-400" />}

            <h3 className="font-tech text-base font-bold text-white tracking-wider uppercase">
              {tool === 'timer' && 'TEMPORIZADOR & ALARMA TÁCTICA'}
              {tool === 'flashlight' && 'LINTERNA & ESTROBOSCOPIO TÁCTICO'}
              {tool === 'map' && 'RADAR GPS & NAVEGACIÓN SATELITAL'}
              {tool === 'music' && 'AUDIO SYNTH CYBERPUNK EN VIVO'}
              {tool === 'calc' && 'CALCULADORA & TELEMETRÍA MATEMÁTICA'}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content based on tool */}
        <div className="py-4 flex-1 overflow-y-auto">
          {tool === 'timer' && <TimerTool />}
          {tool === 'flashlight' && <FlashlightTool />}
          {tool === 'map' && <MapRadarTool />}
          {tool === 'music' && <MusicSynthTool />}
          {tool === 'calc' && <CalculatorTool />}
        </div>
      </div>
    </div>
  );
};

// 1. TIMER & ALARM TOOL
function TimerTool() {
  const [secondsLeft, setSecondsLeft] = useState(300); // 5 minutes default
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((s) => s - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isRunning) {
      setIsRunning(false);
      soundFx.playCriticalAlarm();
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsLeft]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleAddMinutes = (min: number) => {
    soundFx.playTacticalPing();
    setSecondsLeft((s) => s + min * 60);
  };

  return (
    <div className="text-center space-y-4">
      <div className="font-mono text-5xl sm:text-6xl font-bold text-amber-400 tracking-wider p-6 rounded-xl bg-zinc-950 border border-zinc-800 tabular-nums">
        {formatTime(secondsLeft)}
      </div>

      <div className="flex justify-center gap-2">
        <button
          onClick={() => handleAddMinutes(1)}
          className="px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-zinc-200"
        >
          +1 Min
        </button>
        <button
          onClick={() => handleAddMinutes(5)}
          className="px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-zinc-200"
        >
          +5 Min
        </button>
        <button
          onClick={() => handleAddMinutes(15)}
          className="px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-zinc-200"
        >
          +15 Min
        </button>
        <button
          onClick={() => {
            soundFx.playTacticalPing();
            setSecondsLeft(300);
            setIsRunning(false);
          }}
          className="px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-400"
        >
          Reiniciar
        </button>
      </div>

      <div className="flex justify-center gap-3 pt-2">
        <button
          onClick={() => {
            soundFx.playTacticalPing();
            setIsRunning(!isRunning);
          }}
          className={`px-8 py-3 rounded-xl font-tech font-bold text-sm uppercase tracking-wider flex items-center gap-2 cursor-pointer ${
            isRunning
              ? 'bg-rose-600 hover:bg-rose-500 text-white'
              : 'bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-500/20'
          }`}
        >
          {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          <span>{isRunning ? 'Pausar' : 'Iniciar Temporizador'}</span>
        </button>
      </div>
    </div>
  );
}

// 2. FLASHLIGHT TOOL
function FlashlightTool() {
  const [isOn, setIsOn] = useState(true);
  const [strobe, setStrobe] = useState(false);

  return (
    <div className="space-y-4">
      <div
        className={`w-full h-48 rounded-xl transition-all duration-200 border flex flex-col items-center justify-center ${
          isOn
            ? strobe
              ? 'bg-amber-400 border-amber-300 animate-ping'
              : 'bg-white text-black border-white shadow-[0_0_50px_rgba(255,255,255,0.8)]'
            : 'bg-zinc-950 text-zinc-600 border-zinc-800'
        }`}
      >
        <Flashlight className={`w-14 h-14 ${isOn ? 'text-amber-500' : 'text-zinc-700'}`} />
        <span className="font-tech text-sm font-bold uppercase mt-2">
          {isOn ? (strobe ? 'MODO ESTROBOSCOPIO ACTIVO' : 'LINTERNA PANTALLA MÁXIMA') : 'LINTERNA APAGADA'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-2">
        <button
          onClick={() => {
            soundFx.playTacticalPing();
            setIsOn(!isOn);
          }}
          className={`py-3 rounded-lg font-tech font-bold text-xs uppercase cursor-pointer ${
            isOn ? 'bg-zinc-800 text-white' : 'bg-amber-500 text-black'
          }`}
        >
          {isOn ? 'Apagar Linterna' : 'Encender Linterna'}
        </button>

        <button
          onClick={() => {
            soundFx.playTacticalPing();
            setStrobe(!strobe);
            if (!isOn) setIsOn(true);
          }}
          className={`py-3 rounded-lg font-tech font-bold text-xs uppercase border cursor-pointer ${
            strobe ? 'bg-rose-600 border-rose-500 text-white' : 'bg-zinc-900 border-zinc-700 text-zinc-300'
          }`}
        >
          {strobe ? 'Desactivar SOS' : 'Modo Estroboscópico SOS'}
        </button>
      </div>
    </div>
  );
}

// 3. MAP RADAR TOOL
function MapRadarTool() {
  const [coords, setCoords] = useState({ lat: 19.4326, lng: -99.1332, city: 'Ciudad de México' });

  return (
    <div className="space-y-3">
      <div className="relative h-64 rounded-xl overflow-hidden border border-zinc-800 bg-[#070b14] flex flex-col justify-between p-4">
        {/* Radar Concentric Rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
          <div className="w-56 h-56 rounded-full border border-cyan-500/40" />
          <div className="w-36 h-36 rounded-full border border-cyan-500/60" />
          <div className="w-16 h-16 rounded-full border border-cyan-400" />
          <div className="absolute w-full h-[1px] bg-cyan-500/30" />
          <div className="absolute h-full w-[1px] bg-cyan-500/30" />
        </div>

        {/* Dynamic target marker */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <div className="w-4 h-4 rounded-full bg-cyan-400 ring-4 ring-cyan-500/40 animate-pulse" />
          <span className="text-[10px] font-mono text-cyan-300 bg-black/80 px-1.5 py-0.5 rounded mt-1 border border-cyan-500/30">
            COORD: FIX
          </span>
        </div>

        <div className="flex justify-between items-start text-xs font-mono text-cyan-400 z-10">
          <div className="bg-black/70 px-2 py-1 rounded border border-cyan-500/30">
            SATÉLITE: GPS / GLONASS
          </div>
          <div className="bg-black/70 px-2 py-1 rounded border border-cyan-500/30">
            PRECISIÓN: 1.2 METROS
          </div>
        </div>

        <div className="flex justify-between items-end text-xs font-mono text-zinc-300 z-10">
          <div className="bg-black/70 p-2 rounded border border-zinc-800">
            <div>UBICACIÓN: {coords.city}</div>
            <div className="text-[11px] text-zinc-400">LAT: {coords.lat} | LNG: {coords.lng}</div>
          </div>
          <div className="bg-cyan-500/20 text-cyan-300 px-2.5 py-1 rounded border border-cyan-500/40 font-tech uppercase text-[10px]">
            SEÑAL ÓPTIMA
          </div>
        </div>
      </div>

      <p className="text-xs font-mono text-zinc-400 text-center">
        Radar satelital enlazado al smartphone para geolocalización y asistencia de ruta.
      </p>
    </div>
  );
}

// 4. MUSIC SYNTH CYBERPUNK TOOL
function MusicSynthTool() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = React.useRef<AudioContext | null>(null);
  const oscRef = React.useRef<OscillatorNode | null>(null);

  const toggleSynth = () => {
    soundFx.playTacticalPing();
    if (!isPlaying) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(110, ctx.currentTime); // Low A

      gain.gain.setValueAtTime(0.08, ctx.currentTime);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      oscRef.current = osc;
      setIsPlaying(true);
    } else {
      if (oscRef.current) {
        oscRef.current.stop();
      }
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    return () => {
      if (oscRef.current) oscRef.current.stop();
    };
  }, []);

  return (
    <div className="text-center space-y-4">
      <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
        <Radio className="w-10 h-10 text-purple-400 mx-auto animate-pulse" />
        <h4 className="font-tech text-sm font-bold text-white uppercase">
          CYBERPUNK AMBIENT OSCILLATOR (432Hz HARMONIC)
        </h4>
        <p className="text-xs text-zinc-400 font-mono">
          Frecuencia binaural para máxima concentración mental y atmósfera sci-fi.
        </p>
      </div>

      <button
        onClick={toggleSynth}
        className={`px-8 py-3 rounded-xl font-tech font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 mx-auto cursor-pointer ${
          isPlaying ? 'bg-rose-600 text-white' : 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30'
        }`}
      >
        <Volume2 className="w-4 h-4" />
        <span>{isPlaying ? 'Detener Frecuencia' : 'Activar Frecuencia Cyberpunk'}</span>
      </button>
    </div>
  );
}

// 5. CALCULATOR TOOL
function CalculatorTool() {
  const [calcInput, setCalcInput] = useState('');
  const [calcResult, setCalcResult] = useState('');

  const handlePress = (val: string) => {
    soundFx.playTacticalPing();
    if (val === 'C') {
      setCalcInput('');
      setCalcResult('');
    } else if (val === '=') {
      try {
        // Safe evaluation of basic math
        const sanitized = calcInput.replace(/[^0-9+\-*/.]/g, '');
        // eslint-disable-next-line no-eval
        const res = Function(`'use strict'; return (${sanitized})`)();
        setCalcResult(String(res));
      } catch {
        setCalcResult('Error');
      }
    } else {
      setCalcInput((prev) => prev + val);
    }
  };

  return (
    <div className="max-w-xs mx-auto space-y-3">
      <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-right font-mono">
        <div className="text-xs text-zinc-500 min-h-[16px]">{calcInput || '0'}</div>
        <div className="text-2xl font-bold text-white">{calcResult || calcInput || '0'}</div>
      </div>

      <div className="grid grid-cols-4 gap-2 font-mono text-sm">
        {['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', 'C', '0', '=', '+'].map((k) => (
          <button
            key={k}
            onClick={() => handlePress(k)}
            className={`p-3 rounded-lg border font-bold transition-colors cursor-pointer ${
              k === '='
                ? 'bg-amber-500 text-black border-amber-400'
                : k === 'C'
                ? 'bg-rose-950 text-rose-300 border-rose-800'
                : ['+', '-', '*', '/'].includes(k)
                ? 'bg-zinc-800 text-amber-400 border-zinc-700'
                : 'bg-zinc-900 text-white border-zinc-800 hover:bg-zinc-800'
            }`}
          >
            {k}
          </button>
        ))}
      </div>
    </div>
  );
}
