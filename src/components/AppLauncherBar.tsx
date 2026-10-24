import React from 'react';
import { 
  Camera, 
  Youtube, 
  Clock, 
  MapPin, 
  Flashlight, 
  Radio, 
  Calculator, 
  Globe, 
  Sparkles 
} from 'lucide-react';
import { soundFx } from '../utils/audioVoice';
import { TacticalToolType } from './TacticalToolsModal';

interface AppLauncherBarProps {
  onOpenTool: (tool: TacticalToolType) => void;
  onOpenYouTube: () => void;
  onOpenCamera: () => void;
  onOpenGooglePrompt: () => void;
}

export const AppLauncherBar: React.FC<AppLauncherBarProps> = ({
  onOpenTool,
  onOpenYouTube,
  onOpenCamera,
  onOpenGooglePrompt,
}) => {
  return (
    <div className="p-3 rounded-xl border border-zinc-800 bg-[#0c0f17] flex flex-wrap items-center justify-between gap-2 shadow-lg">
      <div className="flex items-center gap-2 text-xs font-tech text-zinc-400">
        <Sparkles className="w-4 h-4 text-cyan-400" />
        <span className="uppercase tracking-wider font-bold text-white">
          ACCIONES RÁPIDAS & HERRAMIENTAS:
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
        <button
          onClick={() => {
            soundFx.playTacticalPing();
            onOpenCamera();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 transition-colors cursor-pointer"
        >
          <Camera className="w-3.5 h-3.5 text-cyan-400" />
          <span>Cámara</span>
        </button>

        <button
          onClick={() => {
            soundFx.playTacticalPing();
            onOpenYouTube();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800 transition-colors cursor-pointer"
        >
          <Youtube className="w-3.5 h-3.5 text-rose-500" />
          <span>YouTube</span>
        </button>

        <button
          onClick={() => {
            soundFx.playTacticalPing();
            onOpenTool('timer');
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-colors cursor-pointer"
        >
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span>Temporizador</span>
        </button>

        <button
          onClick={() => {
            soundFx.playTacticalPing();
            onOpenTool('map');
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-colors cursor-pointer"
        >
          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
          <span>Mapa GPS</span>
        </button>

        <button
          onClick={() => {
            soundFx.playTacticalPing();
            onOpenTool('flashlight');
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-colors cursor-pointer"
        >
          <Flashlight className="w-3.5 h-3.5 text-amber-400" />
          <span>Linterna</span>
        </button>

        <button
          onClick={() => {
            soundFx.playTacticalPing();
            onOpenTool('music');
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-colors cursor-pointer"
        >
          <Radio className="w-3.5 h-3.5 text-purple-400" />
          <span>Música Synth</span>
        </button>

        <button
          onClick={() => {
            soundFx.playTacticalPing();
            onOpenTool('calc');
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-colors cursor-pointer"
        >
          <Calculator className="w-3.5 h-3.5 text-zinc-300" />
          <span>Calculadora</span>
        </button>

        <button
          onClick={() => {
            soundFx.playTacticalPing();
            onOpenGooglePrompt();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold border border-amber-400 transition-colors cursor-pointer"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Google Live</span>
        </button>
      </div>
    </div>
  );
};
