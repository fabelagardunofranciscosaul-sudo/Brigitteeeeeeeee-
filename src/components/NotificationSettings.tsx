import React, { useState } from 'react';
import { 
  Bell, 
  Volume2, 
  ShieldAlert, 
  Sliders, 
  Smartphone, 
  Check, 
  Plus, 
  X, 
  Play, 
  Sparkles 
} from 'lucide-react';
import { NotificationPreferences, AssistantMode } from '../types/assistant';
import { soundFx, voiceSynth } from '../utils/audioVoice';

interface NotificationSettingsProps {
  preferences: NotificationPreferences;
  mode: AssistantMode;
  onUpdatePreferences: (updated: NotificationPreferences) => void;
}

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  preferences,
  mode,
  onUpdatePreferences,
}) => {
  const [newKeyword, setNewKeyword] = useState('');

  const handleToggleApp = (appKey: keyof NotificationPreferences['enabledApps']) => {
    soundFx.playTacticalPing();
    onUpdatePreferences({
      ...preferences,
      enabledApps: {
        ...preferences.enabledApps,
        [appKey]: !preferences.enabledApps[appKey],
      },
    });
  };

  const handleAddKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    const word = newKeyword.trim().toLowerCase();
    if (word && !preferences.emergencyKeywords.includes(word)) {
      soundFx.playTacticalPing();
      onUpdatePreferences({
        ...preferences,
        emergencyKeywords: [...preferences.emergencyKeywords, word],
      });
      setNewKeyword('');
    }
  };

  const handleRemoveKeyword = (wordToRemove: string) => {
    soundFx.playTacticalPing();
    onUpdatePreferences({
      ...preferences,
      emergencyKeywords: preferences.emergencyKeywords.filter((w) => w !== wordToRemove),
    });
  };

  const handleTestVoice = () => {
    const testPhrase = mode === 'chappie'
      ? '¡Chappie está listo, creador! Reconozco tus llamadas y mensajes al instante.'
      : 'Prueba de voz del asistente completada. Notificaciones configuradas con éxito.';
    voiceSynth.speak(testPhrase, mode, preferences.speechPitch, preferences.speechRate);
  };

  return (
    <div className="space-y-4">
      {/* Settings Header */}
      <div className="p-4 rounded-xl border border-zinc-800 bg-[#0e111a] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-tech text-base font-bold text-white tracking-wide">
              CONFIGURACIÓN DE NOTIFICACIONES & PRIORIDAD
            </h3>
            <p className="text-xs text-zinc-400">
              Personaliza qué avisos se dicen en voz alta por el asistente y qué palabras escalan a urgencia crítica.
            </p>
          </div>
        </div>

        <button
          onClick={handleTestVoice}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 font-mono text-xs transition-colors cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 text-amber-400" />
          <span>Probar Voz Actual</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* PANEL 1: MODO DE ANUNCIO POR VOZ */}
        <div className="p-4 rounded-xl border border-zinc-800 bg-[#0b0e17] space-y-3">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-amber-500" />
            <h4 className="font-tech text-sm font-bold text-white tracking-wide uppercase">
              LECTURA AUTOMÁTICA EN VOZ ALTA
            </h4>
          </div>

          <div className="space-y-2">
            {[
              {
                id: 'all',
                title: 'Leer Todo en Voz Alta',
                desc: 'Anuncia todas las llamadas con nombre y lee todos los mensajes que entran.',
              },
              {
                id: 'urgent_only',
                title: 'Solo Notificaciones Urgentes y Críticas',
                desc: 'Únicamente habla si el mensaje tiene palabras clave o es llamada VIP.',
              },
              {
                id: 'calls_only',
                title: 'Solo Anunciar Quién Llama',
                desc: 'Dice el nombre de quien te llama por altavoz; silencia mensajes.',
              },
              {
                id: 'muted',
                title: 'Silenciar Lectura de Voz',
                desc: 'Solo muestra en pantalla sin hablar.',
              },
            ].map((opt) => (
              <label
                key={opt.id}
                onClick={() => {
                  soundFx.playTacticalPing();
                  onUpdatePreferences({ ...preferences, autoVoiceReadout: opt.id as any });
                }}
                className={`p-3 rounded-lg border flex items-start gap-3 cursor-pointer transition-colors ${
                  preferences.autoVoiceReadout === opt.id
                    ? 'bg-amber-500/10 border-amber-500/50 text-white'
                    : 'bg-zinc-900/60 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                }`}
              >
                <input
                  type="radio"
                  name="voiceReadout"
                  checked={preferences.autoVoiceReadout === opt.id}
                  onChange={() => {}}
                  className="mt-1 accent-amber-500"
                />
                <div>
                  <div className="font-semibold text-xs text-white">{opt.title}</div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">{opt.desc}</div>
                </div>
              </label>
            ))}
          </div>

          {/* Voice Modulation Controls */}
          <div className="pt-2 border-t border-zinc-800 space-y-3">
            <div>
              <div className="flex justify-between text-xs font-mono text-zinc-400 mb-1">
                <span>Velocidad de Voz:</span>
                <span className="text-amber-400">{preferences.speechRate}x</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="1.4"
                step="0.05"
                value={preferences.speechRate}
                onChange={(e) =>
                  onUpdatePreferences({ ...preferences, speechRate: parseFloat(e.target.value) })
                }
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono text-zinc-400 mb-1">
                <span>Tono / Modulación:</span>
                <span className="text-amber-400">{preferences.speechPitch}</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="1.4"
                step="0.05"
                value={preferences.speechPitch}
                onChange={(e) =>
                  onUpdatePreferences({ ...preferences, speechPitch: parseFloat(e.target.value) })
                }
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* PANEL 2: PALABRAS CLAVE CRÍTICAS & APPS PERMITIDAS */}
        <div className="p-4 rounded-xl border border-zinc-800 bg-[#0b0e17] space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ShieldAlert className="w-4 h-4 text-rose-500" />
              <h4 className="font-tech text-sm font-bold text-white tracking-wide uppercase">
                DETECCIÓN DE PALABRAS CLAVE CRÍTICAS
              </h4>
            </div>
            <p className="text-xs text-zinc-400 mb-3">
              Si un mensaje contiene cualquiera de estas palabras, Chappie lo clasifica como CRITICAL y lo anuncia con sirena.
            </p>

            {/* Keyword Chips */}
            <div className="flex flex-wrap gap-1.5 mb-3 max-h-28 overflow-y-auto">
              {preferences.emergencyKeywords.map((kw) => (
                <span
                  key={kw}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-950/40 border border-rose-800/60 text-rose-300 font-mono text-xs"
                >
                  <span>{kw}</span>
                  <button
                    onClick={() => handleRemoveKeyword(kw)}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            {/* Add Keyword Form */}
            <form onSubmit={handleAddKeyword} className="flex gap-2">
              <input
                type="text"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                placeholder="Añadir palabra (ej. hospital, banco)"
                className="flex-1 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs text-white font-mono outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-mono"
              >
                + Añadir
              </button>
            </form>
          </div>

          {/* App Interception Toggles */}
          <div className="pt-3 border-t border-zinc-800">
            <div className="flex items-center gap-2 mb-2">
              <Smartphone className="w-4 h-4 text-cyan-400" />
              <h4 className="font-tech text-sm font-bold text-white tracking-wide uppercase">
                CANALES CELULARES VINCULADOS
              </h4>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              {[
                { key: 'calls', label: '📞 Llamadas' },
                { key: 'whatsapp', label: '💬 WhatsApp' },
                { key: 'sms', label: '📱 SMS Celular' },
                { key: 'telegram', label: '✈️ Telegram' },
                { key: 'slack', label: '💼 Slack' },
              ].map(({ key, label }) => {
                const isEnabled = preferences.enabledApps[key as keyof typeof preferences.enabledApps];
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleToggleApp(key as any)}
                    className={`p-2 rounded-lg border text-left flex items-center justify-between cursor-pointer transition-colors ${
                      isEnabled
                        ? 'bg-zinc-800 border-amber-500/40 text-white'
                        : 'bg-zinc-900/40 border-zinc-800 text-zinc-500'
                    }`}
                  >
                    <span>{label}</span>
                    <span className={`text-[10px] font-bold ${isEnabled ? 'text-amber-400' : 'text-zinc-600'}`}>
                      {isEnabled ? 'ACTIVO' : 'PAUSADO'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
