import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Send, 
  Volume2, 
  Globe, 
  ExternalLink, 
  Bot, 
  User, 
  Trash2, 
  Zap, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { ChatMessage, AssistantMode, CellularState, KnowledgeItem } from '../types/assistant';
import { voiceSynth, soundFx } from '../utils/audioVoice';

interface VoiceAssistantChatProps {
  messages: ChatMessage[];
  mode: AssistantMode;
  cellularState: CellularState;
  knowledge: KnowledgeItem[];
  isSpeaking: boolean;
  onSendMessage: (text: string) => void;
  onClearHistory: () => void;
}

export const VoiceAssistantChat: React.FC<VoiceAssistantChatProps> = ({
  messages,
  mode,
  cellularState,
  knowledge,
  isSpeaking,
  onSendMessage,
  onClearHistory,
}) => {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [simplifyOnly, setSimplifyOnly] = useState(true); // Default to simplified data as requested!
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      setSpeechSupported(true);
      const recog = new SpeechRecognition();
      recog.continuous = false;
      recog.interimResults = false;
      recog.lang = 'es-ES';

      recog.onstart = () => {
        setIsListening(true);
        soundFx.playTacticalPing();
      };

      recog.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInput(transcript);
          onSendMessage(transcript);
        }
      };

      recog.onerror = () => setIsListening(false);
      recog.onend = () => setIsListening(false);

      recognitionRef.current = recog;
    }
  }, [onSendMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleMic = () => {
    if (!speechSupported) {
      alert('Tu navegador no soporta reconocimiento de voz nativo. Escribe tu consulta en el campo.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      voiceSynth.stop();
      try {
        recognitionRef.current?.start();
      } catch (err) {
        console.warn('Recognition start error:', err);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input.trim());
    setInput('');
  };

  // Google Search & Telemetry Presets
  const quickPrompts = [
    '🔍 Google: ¿Cuáles son las noticias más importantes de hoy?',
    '🔍 Google: ¿Cómo está el clima y pronóstico hoy?',
    'Simplifica: ¿Quién me llamó o escribió y qué es lo más urgente?',
    '¿Qué datos tienes guardados sobre mi pareja y mi casa?',
  ];

  const getPersonaBadge = () => {
    if (mode === 'jarvis') return { label: 'J.A.R.V.I.S. (STARK OS)', color: 'text-cyan-400 border-cyan-500/40 bg-cyan-950/40' };
    if (mode === 'tars') return { label: 'TARS (HONESTIDAD 90%)', color: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/40' };
    if (mode === 'chappie') return { label: 'CHAPPIE (SCOUT 22)', color: 'text-amber-400 border-amber-500/40 bg-amber-950/40' };
    return { label: 'ALEXA OS', color: 'text-sky-400 border-sky-500/40 bg-sky-950/40' };
  };

  const persona = getPersonaBadge();

  return (
    <div className="rounded-xl border border-zinc-800 bg-[#0b0e17] flex flex-col h-[580px] overflow-hidden shadow-2xl">
      {/* Console Header */}
      <div className="p-3.5 border-b border-zinc-800 flex items-center justify-between bg-[#0e111a]">
        <div className="flex items-center gap-2">
          <Bot className={`w-5 h-5 ${
            mode === 'jarvis' ? 'text-cyan-400' : mode === 'tars' ? 'text-emerald-400' : 'text-amber-400'
          }`} />
          <span className={`font-tech text-xs px-2 py-0.5 rounded border font-bold ${persona.color}`}>
            {persona.label}
          </span>
          <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
            <Globe className="w-3 h-3 text-cyan-400" />
            <span>Google Live</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Executive Simplifier Toggle */}
          <button
            onClick={() => setSimplifyOnly(!simplifyOnly)}
            className={`px-2 py-1 rounded text-[10px] font-mono border transition-colors flex items-center gap-1 ${
              simplifyOnly 
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold' 
                : 'bg-zinc-800 text-zinc-400 border-zinc-700'
            }`}
            title="Activar o desactivar vista simplificada de datos"
          >
            <Zap className="w-3 h-3 text-amber-400" />
            <span>{simplifyOnly ? 'Datos Simplificados' : 'Modo Extenso'}</span>
          </button>

          {messages.length > 0 && (
            <button
              onClick={onClearHistory}
              className="p-1 text-zinc-500 hover:text-rose-400 transition-colors"
              title="Limpiar chat"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-500">
            <Bot className="w-12 h-12 mb-3 text-zinc-700" />
            <p className="font-tech text-base text-zinc-300 font-semibold mb-1">
              {mode === 'jarvis'
                ? 'J.A.R.V.I.S. en línea. ¿Qué desea consultar, señor?'
                : mode === 'tars'
                ? 'TARS listo. Honestidad al 90%. Pida datos.'
                : 'Asistente conectado y listo.'}
            </p>
            <p className="text-xs font-mono max-w-sm text-zinc-400">
              Conectado a tu celular para llamadas y mensajes, a la memoria de tu pareja, y a <strong className="text-cyan-400">Google en tiempo real</strong> para cualquier dato del mundo.
            </p>
          </div>
        ) : (
          messages.map((m) => {
            const isUser = m.role === 'user';
            return (
              <div
                key={m.id}
                className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div
                  className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold ${
                    isUser
                      ? 'bg-zinc-800 text-zinc-200 border border-zinc-700'
                      : mode === 'jarvis'
                      ? 'bg-cyan-500 text-black font-tech'
                      : mode === 'tars'
                      ? 'bg-emerald-500 text-black font-tech'
                      : 'bg-amber-500 text-black font-tech'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-[85%] p-3.5 rounded-xl text-sm leading-relaxed ${
                    isUser
                      ? 'bg-zinc-800 text-white rounded-tr-none'
                      : 'bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-tl-none'
                  }`}
                >
                  {/* SIMPLIFIED EXECUTIVE CALLOUT IF APPLICABLE */}
                  {!isUser && m.simplifiedSummary && simplifyOnly && (
                    <div className="mb-2 p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs font-mono text-amber-300 flex items-start gap-2">
                      <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-amber-400 uppercase tracking-wide">
                          Resumen Ejecutivo:
                        </span>{' '}
                        {m.simplifiedSummary}
                      </div>
                    </div>
                  )}

                  {/* Main Response Text */}
                  <p className="whitespace-pre-wrap">{m.text}</p>

                  {/* REAL GOOGLE GROUNDING SOURCES */}
                  {!isUser && m.groundingSources && m.groundingSources.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-zinc-800 text-xs font-mono">
                      <div className="flex items-center gap-1.5 text-cyan-400 mb-1">
                        <Globe className="w-3.5 h-3.5" />
                        <span className="font-semibold uppercase text-[10px]">
                          Fuentes en Vivo desde Google:
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {m.groundingSources.map((source, idx) => (
                          <a
                            key={idx}
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 text-[11px] border border-zinc-700 transition-colors"
                          >
                            <span className="truncate max-w-[180px]">{source.title}</span>
                            <ExternalLink className="w-2.5 h-2.5 text-cyan-400 shrink-0" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-zinc-500 pt-1 border-t border-zinc-800/60">
                    <span>{m.timestamp}</span>
                    {!isUser && (
                      <button
                        onClick={() => voiceSynth.speak(m.simplifiedSummary || m.text, mode)}
                        className="text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                        title="Escuchar por voz"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>Escuchar</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Google & Telemetry Prompt Chips */}
      <div className="p-2 border-t border-zinc-800 bg-[#090c13] flex gap-1.5 overflow-x-auto text-[11px] font-mono">
        {quickPrompts.map((q, idx) => (
          <button
            key={idx}
            onClick={() => onSendMessage(q)}
            className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 whitespace-nowrap transition-colors cursor-pointer"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Input & Mic Bar */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-zinc-800 bg-[#0e111a] flex items-center gap-2">
        <button
          type="button"
          onClick={toggleMic}
          className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
            isListening
              ? 'bg-rose-500 border-rose-400 text-white animate-pulse shadow-lg shadow-rose-500/40'
              : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-600'
          }`}
          title={isListening ? 'Detener micrófono' : 'Hablar por micrófono'}
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-amber-400" />}
        </button>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            isListening
              ? 'Escuchando tu voz...'
              : mode === 'jarvis'
              ? 'Pregunte a J.A.R.V.I.S. (o busque en Google)...'
              : mode === 'tars'
              ? 'TARS: Ingrese comando o consulta...'
              : 'Pregúntame algo o busca en Google...'
          }
          className="flex-1 p-2 rounded-lg bg-zinc-900 border border-zinc-700 text-sm text-white font-mono outline-none focus:border-amber-500"
        />

        <button
          type="submit"
          disabled={!input.trim()}
          className="p-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold disabled:opacity-40 transition-colors cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
