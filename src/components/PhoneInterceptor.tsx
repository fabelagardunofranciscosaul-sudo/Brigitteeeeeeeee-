import React, { useState } from 'react';
import { 
  Phone, 
  PhoneCall, 
  PhoneOff, 
  Volume2, 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle2, 
  Radio, 
  Battery, 
  Wifi, 
  Send, 
  PlusCircle, 
  Play, 
  Sparkles,
  Bot
} from 'lucide-react';
import { 
  IncomingCall, 
  IncomingMessage, 
  CellularState, 
  PriorityLevel, 
  AssistantMode 
} from '../types/assistant';
import { soundFx, voiceSynth } from '../utils/audioVoice';

interface PhoneInterceptorProps {
  cellularState: CellularState;
  mode: AssistantMode;
  onIncomingCall: (call: IncomingCall) => void;
  onIncomingMessage: (msg: IncomingMessage) => void;
  onDismissCall: () => void;
  onAnswerCall: () => void;
  onMarkMessageRead: (id: string) => void;
  onAnnounceMessage: (msg: IncomingMessage) => void;
}

export const PhoneInterceptor: React.FC<PhoneInterceptorProps> = ({
  cellularState,
  mode,
  onIncomingCall,
  onIncomingMessage,
  onDismissCall,
  onAnswerCall,
  onMarkMessageRead,
  onAnnounceMessage,
}) => {
  const [filterApp, setFilterApp] = useState<string>('all');
  const [showCustomModal, setShowCustomModal] = useState<boolean>(false);
  
  // Custom injector form state
  const [customType, setCustomType] = useState<'call' | 'message'>('call');
  const [customSender, setCustomSender] = useState('Dra. Elena Ramos');
  const [customNumber, setCustomNumber] = useState('+52 55 4192 8831');
  const [customRelation, setCustomRelation] = useState('Médico de cabecera');
  const [customText, setCustomText] = useState('Los resultados de tus análisis están listos, por favor llámame.');
  const [customPriority, setCustomPriority] = useState<PriorityLevel>('HIGH');
  const [customApp, setCustomApp] = useState<'whatsapp' | 'sms' | 'telegram' | 'slack'>('whatsapp');
  const [isAnalyzing, setIsAnalyzing] = useState<string | null>(null);

  // Quick preset test triggers
  const handleTriggerPresetCall = (preset: 'mama' | 'banco' | 'jefe') => {
    soundFx.playCallChime();
    let call: IncomingCall;
    if (preset === 'mama') {
      call = {
        id: `call_${Date.now()}`,
        callerName: 'Mamá',
        callerNumber: '+52 55 1234 5678',
        relation: 'Familia (Contacto VIP)',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        priority: 'HIGH',
        status: 'ringing',
        notes: 'Llamando desde celular personal',
        aiSummary: 'Llamada familiar prioritaria. Ha llamado 2 veces en 10 minutos.',
      };
    } else if (preset === 'banco') {
      call = {
        id: `call_${Date.now()}`,
        callerName: 'Banco BBVA - Seguridad',
        callerNumber: '800 226 2663',
        relation: 'Entidad Financiera',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        priority: 'CRITICAL',
        status: 'ringing',
        notes: 'Línea de prevención de fraudes',
        aiSummary: 'ALERTA CRÍTICA: Posible intento de cargo sospechoso en tarjeta de crédito.',
      };
    } else {
      call = {
        id: `call_${Date.now()}`,
        callerName: 'Ing. Carlos Mendoza',
        callerNumber: '+52 55 9876 5432',
        relation: 'Director de Operaciones',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        priority: 'NORMAL',
        status: 'ringing',
        notes: 'Oficina Central',
        aiSummary: 'Consulta sobre el informe de entregas semanal.',
      };
    }
    onIncomingCall(call);
  };

  const handleTriggerPresetMessage = (preset: 'urgent_code' | 'whatsapp_amigo' | 'slack_work') => {
    soundFx.playIncomingMessageSound();
    let msg: IncomingMessage;
    if (preset === 'urgent_code') {
      msg = {
        id: `msg_${Date.now()}`,
        app: 'sms',
        sender: 'SAT / Clave Única',
        senderNumber: '24890',
        text: 'Tu código de seguridad temporal es 749-302. Válido por 5 minutos. No lo compartas con nadie.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        priority: 'CRITICAL',
        isRead: false,
        aiSummary: 'Código de verificación de seguridad 749-302, expira pronto.',
        suggestedAction: 'Copiar código',
      };
    } else if (preset === 'whatsapp_amigo') {
      msg = {
        id: `msg_${Date.now()}`,
        app: 'whatsapp',
        sender: 'Andrea Vega',
        senderNumber: '+52 55 6543 2198',
        text: '¡Hola! Ya llegamos al restaurante. ¿Vienes en camino o pasamos por ti?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        priority: 'NORMAL',
        isRead: false,
        aiSummary: 'Pregunta si vas en camino al restaurante.',
        suggestedAction: 'Responder: "Voy en camino"',
      };
    } else {
      msg = {
        id: `msg_${Date.now()}`,
        app: 'slack',
        sender: 'Proyecto Tetravaal Core',
        senderNumber: '#general',
        text: 'Despliegue a producción completado con éxito. Métricas de latencia estables en 18ms.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        priority: 'LOW',
        isRead: false,
        aiSummary: 'Despliegue finalizado exitosamente.',
      };
    }
    onIncomingMessage(msg);
  };

  const handleInjectCustomEvent = () => {
    if (customType === 'call') {
      soundFx.playCallChime();
      const newCall: IncomingCall = {
        id: `call_${Date.now()}`,
        callerName: customSender.trim() || 'Desconocido',
        callerNumber: customNumber.trim() || 'Sin número',
        relation: customRelation.trim() || 'Contacto externo',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        priority: customPriority,
        status: 'ringing',
        notes: customText.trim() || undefined,
        aiSummary: `Llamada entrante de ${customSender} (${customRelation}).`,
      };
      onIncomingCall(newCall);
    } else {
      soundFx.playIncomingMessageSound();
      const newMsg: IncomingMessage = {
        id: `msg_${Date.now()}`,
        app: customApp,
        sender: customSender.trim() || 'Remitente',
        senderNumber: customNumber.trim() || undefined,
        text: customText.trim() || 'Mensaje de prueba',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        priority: customPriority,
        isRead: false,
      };
      onIncomingMessage(newMsg);
    }
    setShowCustomModal(false);
  };

  // Analyze message on demand via server Gemini endpoint
  const handleAnalyzeWithAI = async (msg: IncomingMessage) => {
    setIsAnalyzing(msg.id);
    try {
      const res = await fetch('/api/assistant/analyze-phone-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'new_message',
          data: msg,
          mode,
        }),
      });
      const data = await res.json();
      if (data.announcement) {
        voiceSynth.speak(data.announcement, mode);
      }
    } catch (err) {
      console.error('Error analyzing message:', err);
    } finally {
      setIsAnalyzing(null);
    }
  };

  const filteredMessages = cellularState.recentMessages.filter(m => {
    if (filterApp === 'all') return true;
    if (filterApp === 'urgent') return m.priority === 'CRITICAL' || m.priority === 'HIGH';
    return m.app === filterApp;
  });

  return (
    <div className="space-y-4">
      {/* Cellular Telemetry Bar */}
      <div className="p-4 rounded-xl border border-zinc-800 bg-[#0e111a] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-tech text-sm tracking-wider text-white font-semibold">
                {cellularState.phoneModel}
              </span>
              <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-amber-400 border border-zinc-700">
                {cellularState.carrier} {cellularState.networkType}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-zinc-400 mt-0.5">
              <span>Señal {cellularState.signalStrength}%</span>
              <span>·</span>
              <span>Bluetooth Conectado</span>
            </div>
          </div>
        </div>

        {/* Device Battery & State */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800">
            <Battery className={`w-4 h-4 ${cellularState.battery > 20 ? 'text-emerald-400' : 'text-rose-400'}`} />
            <span className="text-zinc-200 tabular-nums">{cellularState.battery}%</span>
            {cellularState.isCharging && <span className="text-amber-400 text-[10px] ml-1">CARGANDO</span>}
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800">
            <MessageSquare className="w-4 h-4 text-amber-400" />
            <span className="text-zinc-200 tabular-nums">{cellularState.unreadCount} sin leer</span>
          </div>

          <button
            onClick={() => setShowCustomModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-tech tracking-wider uppercase bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg transition-colors cursor-pointer shadow-sm"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Inyectar Prueba
          </button>
        </div>
      </div>

      {/* ACTIVE INCOMING CALL HERO BANNER */}
      {cellularState.activeCall && (
        <div className="relative p-5 rounded-xl border-2 border-amber-500 bg-gradient-to-r from-amber-950/40 via-zinc-900 to-zinc-950 shadow-2xl animate-in fade-in duration-200">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="relative">
                <div className="w-14 h-14 rounded-full bg-amber-500 flex items-center justify-center text-black shadow-lg shadow-amber-500/30 animate-bounce">
                  <PhoneCall className="w-7 h-7" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 ring-2 ring-black animate-ping" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
                    [LLAMADA ENTRANTE EN TIEMPO REAL]
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                    cellularState.activeCall.priority === 'CRITICAL'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}>
                    {cellularState.activeCall.priority}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white mt-0.5">
                  {cellularState.activeCall.callerName}
                </h3>
                <div className="flex items-center gap-2 text-sm text-zinc-300 font-mono mt-0.5">
                  <span>{cellularState.activeCall.callerNumber}</span>
                  <span>·</span>
                  <span className="text-amber-400">{cellularState.activeCall.relation}</span>
                </div>
                {cellularState.activeCall.aiSummary && (
                  <p className="text-xs text-zinc-400 mt-2 max-w-xl bg-black/40 p-2 rounded border border-zinc-800">
                    <span className="text-amber-400 font-semibold font-tech">ANÁLISIS IA: </span>
                    {cellularState.activeCall.aiSummary}
                  </p>
                )}
              </div>
            </div>

            {/* Call Action Controls */}
            <div className="flex items-center gap-2 self-end md:self-center w-full md:w-auto">
              <button
                onClick={() => {
                  const call = cellularState.activeCall;
                  if (!call) return;
                  const announcement = mode === 'chappie'
                    ? `¡Alerta creador! Te está llamando ${call.callerName}, de ${call.relation}. Prioridad ${call.priority}. ¿Quieres que conteste?`
                    : `Llamada entrante de ${call.callerName}. Teléfono ${call.callerNumber}. Clasificación ${call.priority}.`;
                  voiceSynth.speak(announcement, mode);
                }}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-mono bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg border border-zinc-700 transition-colors"
                title="Repetir anuncio por voz"
              >
                <Volume2 className="w-4 h-4 text-amber-400" />
                Voz
              </button>
              <button
                onClick={onAnswerCall}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-lg shadow-lg shadow-emerald-900/40 transition-colors cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                Contestar
              </button>
              <button
                onClick={onDismissCall}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm rounded-lg shadow-lg shadow-rose-900/40 transition-colors cursor-pointer"
              >
                <PhoneOff className="w-4 h-4" />
                Colgar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QUICK PRESET GENERATOR CHIPS */}
      <div className="p-3.5 rounded-xl border border-zinc-800 bg-[#0c0f17] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-zinc-400 font-tech">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>PROBAR INTERCEPTOR CELULAR:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleTriggerPresetCall('mama')}
            className="px-2.5 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 font-mono transition-colors"
          >
            📞 Llamada: Mamá
          </button>
          <button
            onClick={() => handleTriggerPresetCall('banco')}
            className="px-2.5 py-1.5 rounded-md bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800 font-mono transition-colors"
          >
            🚨 Llamada: Banco (Fraude)
          </button>
          <button
            onClick={() => handleTriggerPresetMessage('urgent_code')}
            className="px-2.5 py-1.5 rounded-md bg-amber-950/60 hover:bg-amber-900 text-amber-300 border border-amber-800 font-mono transition-colors"
          >
            💬 SMS: Código Urgente
          </button>
          <button
            onClick={() => handleTriggerPresetMessage('whatsapp_amigo')}
            className="px-2.5 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 font-mono transition-colors"
          >
            💬 WhatsApp: Amigo
          </button>
        </div>
      </div>

      {/* MESSAGES & NOTIFICATIONS STREAM */}
      <div className="rounded-xl border border-zinc-800 bg-[#0b0e17] overflow-hidden">
        {/* Stream Header & Filters */}
        <div className="p-4 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-amber-500" />
            <h3 className="font-tech text-base font-bold text-white tracking-wide">
              MENSAJES INTERCEPTADOS DEL CELULAR
            </h3>
            <span className="text-xs font-mono text-zinc-500">
              ({cellularState.recentMessages.length} registrados)
            </span>
          </div>

          {/* Segmented Filter Controls */}
          <div className="flex items-center gap-1 p-1 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono">
            <button
              onClick={() => setFilterApp('all')}
              className={`px-3 py-1 rounded transition-colors ${
                filterApp === 'all' ? 'bg-amber-500 text-black font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilterApp('urgent')}
              className={`px-3 py-1 rounded transition-colors ${
                filterApp === 'urgent' ? 'bg-rose-500 text-white font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Urgentes
            </button>
            <button
              onClick={() => setFilterApp('whatsapp')}
              className={`px-3 py-1 rounded transition-colors ${
                filterApp === 'whatsapp' ? 'bg-emerald-600 text-white font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              WhatsApp
            </button>
            <button
              onClick={() => setFilterApp('sms')}
              className={`px-3 py-1 rounded transition-colors ${
                filterApp === 'sms' ? 'bg-sky-600 text-white font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              SMS
            </button>
          </div>
        </div>

        {/* Message Feed List */}
        <div className="divide-y divide-zinc-800/80 max-h-[460px] overflow-y-auto">
          {filteredMessages.length === 0 ? (
            <div className="p-8 text-center text-zinc-500 font-mono text-sm">
              No hay mensajes con los filtros seleccionados. Presiona un botón de prueba arriba.
            </div>
          ) : (
            filteredMessages.map((msg) => (
              <div
                key={msg.id}
                className={`p-4 transition-colors hover:bg-zinc-900/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                  !msg.isRead ? 'bg-zinc-900/30' : ''
                }`}
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  {/* App Icon */}
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-white font-bold text-xs ${
                    msg.app === 'whatsapp'
                      ? 'bg-emerald-600'
                      : msg.app === 'sms'
                      ? 'bg-sky-600'
                      : msg.app === 'slack'
                      ? 'bg-purple-600'
                      : 'bg-zinc-700'
                  }`}>
                    {msg.app === 'whatsapp' ? 'WA' : msg.app === 'sms' ? 'SMS' : 'APP'}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-white text-sm truncate">
                        {msg.sender}
                      </span>
                      <span className="text-[11px] font-mono text-zinc-500">
                        {msg.timestamp}
                      </span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                        msg.priority === 'CRITICAL'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : msg.priority === 'HIGH'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}>
                        {msg.priority}
                      </span>
                      {!msg.isRead && (
                        <span className="text-[10px] font-tech text-amber-400 font-bold tracking-wider">
                          NUEVO
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-zinc-300 mt-1 leading-relaxed break-words">
                      {msg.text}
                    </p>

                    {msg.aiSummary && (
                      <div className="mt-2 text-xs text-amber-300/90 font-mono bg-amber-950/20 border border-amber-800/30 p-2 rounded">
                        <span className="text-amber-500 font-bold">Resumen IA: </span>
                        {msg.aiSummary}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions per message */}
                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  <button
                    onClick={() => {
                      onMarkMessageRead(msg.id);
                      onAnnounceMessage(msg);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-mono transition-colors cursor-pointer"
                    title="Escuchar por voz con el asistente"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    Escuchar
                  </button>

                  <button
                    onClick={() => handleAnalyzeWithAI(msg)}
                    disabled={isAnalyzing === msg.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 text-xs font-mono transition-colors cursor-pointer"
                    title="Analizar con Gemini y sugerir respuesta"
                  >
                    <Bot className="w-3.5 h-3.5 text-cyan-400" />
                    {isAnalyzing === msg.id ? 'Analizando...' : 'Resumir'}
                  </button>

                  {!msg.isRead && (
                    <button
                      onClick={() => onMarkMessageRead(msg.id)}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                      title="Marcar leído"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* CUSTOM INJECTOR MODAL */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-zinc-700 bg-[#111420] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Radio className="w-5 h-5 text-amber-500" />
                <h4 className="font-tech text-lg text-white font-bold tracking-wide">
                  INYECTAR TELEMETRÍA CELULAR
                </h4>
              </div>
              <button
                onClick={() => setShowCustomModal(false)}
                className="text-zinc-400 hover:text-white text-sm font-mono"
              >
                [CERRAR]
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-mono text-zinc-400 block mb-1">
                  Tipo de evento entrante:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCustomType('call')}
                    className={`py-2 px-3 text-xs font-tech rounded-lg border transition-colors ${
                      customType === 'call'
                        ? 'bg-amber-500 text-black font-bold border-amber-400'
                        : 'bg-zinc-900 text-zinc-300 border-zinc-700'
                    }`}
                  >
                    📞 Llamada Telefónica
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomType('message')}
                    className={`py-2 px-3 text-xs font-tech rounded-lg border transition-colors ${
                      customType === 'message'
                        ? 'bg-amber-500 text-black font-bold border-amber-400'
                        : 'bg-zinc-900 text-zinc-300 border-zinc-700'
                    }`}
                  >
                    💬 Mensaje de Texto / Chat
                  </button>
                </div>
              </div>

              {customType === 'message' && (
                <div>
                  <label className="text-xs font-mono text-zinc-400 block mb-1">
                    Aplicación de origen:
                  </label>
                  <select
                    value={customApp}
                    onChange={(e) => setCustomApp(e.target.value as any)}
                    className="w-full p-2 rounded-lg bg-zinc-900 border border-zinc-700 text-sm text-white font-mono focus:border-amber-500 outline-none"
                  >
                    <option value="whatsapp">WhatsApp</option>
                    <option value="sms">SMS Celular</option>
                    <option value="telegram">Telegram</option>
                    <option value="slack">Slack Trabajo</option>
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono text-zinc-400 block mb-1">
                    Nombre del Remitente:
                  </label>
                  <input
                    type="text"
                    value={customSender}
                    onChange={(e) => setCustomSender(e.target.value)}
                    placeholder="Ej. Sofia Mendoza"
                    className="w-full p-2 rounded-lg bg-zinc-900 border border-zinc-700 text-sm text-white font-mono focus:border-amber-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-zinc-400 block mb-1">
                    Número Telefónico:
                  </label>
                  <input
                    type="text"
                    value={customNumber}
                    onChange={(e) => setCustomNumber(e.target.value)}
                    placeholder="+52 55..."
                    className="w-full p-2 rounded-lg bg-zinc-900 border border-zinc-700 text-sm text-white font-mono focus:border-amber-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono text-zinc-400 block mb-1">
                    Relación / Etiqueta:
                  </label>
                  <input
                    type="text"
                    value={customRelation}
                    onChange={(e) => setCustomRelation(e.target.value)}
                    placeholder="Ej. Familia, Trabajo, Banco"
                    className="w-full p-2 rounded-lg bg-zinc-900 border border-zinc-700 text-sm text-white font-mono focus:border-amber-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-zinc-400 block mb-1">
                    Nivel de Prioridad:
                  </label>
                  <select
                    value={customPriority}
                    onChange={(e) => setCustomPriority(e.target.value as PriorityLevel)}
                    className="w-full p-2 rounded-lg bg-zinc-900 border border-zinc-700 text-sm text-white font-mono focus:border-amber-500 outline-none"
                  >
                    <option value="CRITICAL">CRITICAL (Urgencia Máxima)</option>
                    <option value="HIGH">HIGH (Importante)</option>
                    <option value="NORMAL">NORMAL (Estándar)</option>
                    <option value="LOW">LOW (Baja / Spam)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-zinc-400 block mb-1">
                  {customType === 'call' ? 'Notas / Contexto de la llamada:' : 'Texto del mensaje recibido:'}
                </label>
                <textarea
                  rows={3}
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="Escribe lo que dice el mensaje..."
                  className="w-full p-2.5 rounded-lg bg-zinc-900 border border-zinc-700 text-sm text-white font-mono focus:border-amber-500 outline-none resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setShowCustomModal(false)}
                className="px-4 py-2 text-xs font-mono text-zinc-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleInjectCustomEvent}
                className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-tech font-bold text-xs uppercase tracking-wider"
              >
                Inyectar y Anunciar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
