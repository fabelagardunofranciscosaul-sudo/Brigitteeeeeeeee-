import React, { useState } from 'react';
import { Youtube, Search, X, Play, Music, Radio, Film, Sparkles } from 'lucide-react';
import { soundFx } from '../utils/audioVoice';

interface YouTubeHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

export const YouTubeHubModal: React.FC<YouTubeHubModalProps> = ({
  isOpen,
  onClose,
  initialQuery = 'musica cyberpunk lofi',
}) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [activeVideoId, setActiveVideoId] = useState('jfKfPfyJRdk'); // Default relaxing lofi stream
  const [videoTitle, setVideoTitle] = useState('Cyberpunk Lofi Synthwave Radio');

  if (!isOpen) return null;

  const presetVideos = [
    {
      id: 'jfKfPfyJRdk',
      title: 'Lofi Girl - Relaxing Beats to Study/Chill',
      category: 'Música',
    },
    {
      id: '7L_qC4zM1V4',
      title: 'Cyberpunk 2077 - Night City Ambient Synth',
      category: 'Ambiente',
    },
    {
      id: 'l6rS8Dv5fc8',
      title: 'Chappie Official Trailer - Neill Blomkamp',
      category: 'Cine',
    },
    {
      id: 'fJ9rUzIMcZQ',
      title: 'Queen - Bohemian Rhapsody (Official Video)',
      category: 'Clásico',
    },
    {
      id: '21X5lGlDOfg',
      title: 'NASA Live: Earth from the Space Station (ISS)',
      category: 'Ciencia',
    },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    soundFx.playTacticalPing();
    // Search query to youtube embed or search view
    // Many queries can be viewed or we change title
    setVideoTitle(`Búsqueda: ${searchQuery}`);
  };

  const handleSelectPreset = (video: typeof presetVideos[0]) => {
    soundFx.playTacticalPing();
    setActiveVideoId(video.id);
    setVideoTitle(video.title);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-4xl rounded-2xl border-2 border-rose-500/50 bg-[#090b13] p-4 sm:p-5 shadow-2xl relative flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center text-white shadow-lg shadow-rose-600/30">
              <Youtube className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-tech text-base font-bold text-white tracking-wider uppercase">
                YOUTUBE STREAM & MEDIA HUB
              </h3>
              <p className="text-[11px] font-mono text-zinc-400">
                Reproductor multimedia integrado con comando por voz
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2 my-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar cualquier video o música en YouTube..."
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white font-mono focus:border-rose-500 outline-none"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-tech font-bold text-xs uppercase cursor-pointer"
          >
            Buscar
          </button>
        </form>

        {/* Active Player Viewport */}
        <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black border border-zinc-800 shadow-inner">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${activeVideoId}?autoplay=1`}
            title={videoTitle}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Video Presets Strip */}
        <div className="mt-3 pt-3 border-t border-zinc-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-tech text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-rose-500" />
              Canales Recomendados:
            </span>
            <span className="text-[11px] font-mono text-zinc-500 truncate max-w-xs">
              {videoTitle}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {presetVideos.map((vid) => (
              <button
                key={vid.id}
                onClick={() => handleSelectPreset(vid)}
                className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                  activeVideoId === vid.id
                    ? 'bg-rose-600/20 border-rose-500 text-white font-bold'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                }`}
              >
                <div className="text-[10px] text-rose-400 font-mono uppercase">{vid.category}</div>
                <div className="text-xs truncate mt-0.5">{vid.title}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
