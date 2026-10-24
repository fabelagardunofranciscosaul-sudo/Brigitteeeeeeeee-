import React from 'react';
import { Volume2, VolumeX, Sparkles, Globe } from 'lucide-react';
import { AssistantMode } from '../types/assistant';

interface TopNavProps {
  activeTab: 'interceptor' | 'voice' | 'couple' | 'memory' | 'settings';
  setActiveTab: (tab: 'interceptor' | 'voice' | 'couple' | 'memory' | 'settings') => void;
  mode: AssistantMode;
  onSetMode: (mode: AssistantMode) => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeTab,
  setActiveTab,
  mode,
  onSetMode,
  isMuted,
  onToggleMute,
}) => {
  const getBadgeStyle = () => {
    switch (mode) {
      case 'jarvis':
        return { text: 'J.A.R.V.I.S.', color: 'bg-cyan-500 text-black shadow-cyan-500/20' };
      case 'tars':
        return { text: 'T.A.R.S.', color: 'bg-emerald-500 text-black shadow-emerald-500/20' };
      case 'chappie':
        return { text: 'CHAPPIE', color: 'bg-amber-500 text-black shadow-amber-500/20' };
      default:
        return { text: 'ALEXA', color: 'bg-sky-500 text-black shadow-sky-500/20' };
    }
  };

  const badge = getBadgeStyle();

  return (
    <header className="sticky top-0 z-40 bg-[#08090d]/90 backdrop-blur-md border-b border-zinc-800/80 px-4 sm:px-6 py-3.5 flex items-center justify-between gap-8">
      {/* Zone 1: Single Wordmark */}
      <div className="flex items-center gap-2.5 whitespace-nowrap shrink-0">
        <div className={`px-2.5 py-1 rounded-lg font-bold font-tech text-xs tracking-wider shadow-sm uppercase ${badge.color}`}>
          {badge.text}
        </div>
        <span className="font-tech text-lg font-bold tracking-wider text-white">
          NEURAL <span className="text-amber-500">ASSISTANT</span>
        </span>
      </div>

      {/* Zone 2: Clean Navigation Links (Top Bar Contract) */}
      <nav className="hidden md:flex items-center gap-6 text-xs font-mono font-medium text-zinc-400">
        <button
          onClick={() => setActiveTab('interceptor')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'interceptor' ? 'text-amber-400 font-bold border-b-2 border-amber-500 pb-1' : ''
          }`}
        >
          Celular & Interceptor
        </button>
        <button
          onClick={() => setActiveTab('voice')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'voice' ? 'text-amber-400 font-bold border-b-2 border-amber-500 pb-1' : ''
          }`}
        >
          Consola & Google Live
        </button>
        <button
          onClick={() => setActiveTab('couple')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'couple' ? 'text-amber-400 font-bold border-b-2 border-amber-500 pb-1' : ''
          }`}
        >
          Vínculo & Pareja
        </button>
        <button
          onClick={() => setActiveTab('memory')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'memory' ? 'text-amber-400 font-bold border-b-2 border-amber-500 pb-1' : ''
          }`}
        >
          Memoria Neuronal
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'settings' ? 'text-amber-400 font-bold border-b-2 border-amber-500 pb-1' : ''
          }`}
        >
          Notificaciones & Entorno
        </button>
      </nav>

      {/* Zone 3: 1 Primary Action */}
      <div className="flex items-center gap-2.5 shrink-0">
        <button
          onClick={onToggleMute}
          className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors cursor-pointer"
          title={isMuted ? 'Activar voz' : 'Silenciar voz'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
        </button>

        {/* Persona Selector Segment */}
        <div className="flex items-center p-1 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono">
          {(['jarvis', 'tars', 'chappie', 'alexa'] as AssistantMode[]).map((m) => (
            <button
              key={m}
              onClick={() => onSetMode(m)}
              className={`px-2 py-1 rounded uppercase tracking-wider text-[11px] font-bold transition-all cursor-pointer ${
                mode === m
                  ? m === 'jarvis'
                    ? 'bg-cyan-500 text-black shadow-sm'
                    : m === 'tars'
                    ? 'bg-emerald-500 text-black shadow-sm'
                    : m === 'chappie'
                    ? 'bg-amber-500 text-black shadow-sm'
                    : 'bg-sky-500 text-black shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
