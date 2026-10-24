/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Smartphone, 
  Heart, 
  Database, 
  Sliders, 
  Radio, 
  Volume2, 
  VolumeX, 
  PhoneCall, 
  Sparkles,
  Users,
  Activity,
  Layers,
  Globe
} from 'lucide-react';
import { 
  AssistantMode, 
  CellularState, 
  CoupleProfile, 
  ParticipantProfile, 
  KnowledgeItem, 
  ChatMessage, 
  NotificationPreferences, 
  EnvironmentStatus, 
  IncomingCall, 
  IncomingMessage 
} from './types/assistant';
import { soundFx, voiceSynth } from './utils/audioVoice';
import { TopNav } from './components/TopNav';
import { ChappieVisor } from './components/ChappieVisor';
import { PhoneInterceptor } from './components/PhoneInterceptor';
import { CoupleHoloWidget } from './components/CoupleHoloWidget';
import { NeuralMemoryBank } from './components/NeuralMemoryBank';
import { ParticipantsLearner } from './components/ParticipantsLearner';
import { NotificationSettings } from './components/NotificationSettings';
import { VoiceAssistantChat } from './components/VoiceAssistantChat';
import { EnvironmentRadarWidget } from './components/EnvironmentRadarWidget';
import { TacticalCameraModal } from './components/TacticalCameraModal';
import { YouTubeHubModal } from './components/YouTubeHubModal';
import { TacticalToolsModal, TacticalToolType } from './components/TacticalToolsModal';
import { AppLauncherBar } from './components/AppLauncherBar';

export default function App() {
  const [mode, setMode] = useState<AssistantMode>('jarvis');
  const [activeTab, setActiveTab] = useState<'interceptor' | 'voice' | 'couple' | 'memory' | 'settings'>('interceptor');
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [emotion, setEmotion] = useState<'speaking' | 'happy' | 'alert' | 'tactical' | 'curious' | 'idle'>('idle');

  // Interactive Tools & Modals State
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isYouTubeOpen, setIsYouTubeOpen] = useState(false);
  const [activeTool, setActiveTool] = useState<TacticalToolType>(null);

  // Couple Profile State (with real user & partner photos)
  const [couple, setCouple] = useState<CoupleProfile>({
    userName: 'Francisco',
    userNickname: 'Papi',
    userPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=faces',
    partnerName: 'Mi Pareja',
    partnerNickname: 'Mi Amor',
    partnerPhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&crop=faces',
    anniversaryDate: '2023-04-18',
    relationshipStatus: 'Juntos & Muy Enamorados',
    sharedNotes: 'Amo sus abrazos, le encanta el café por las mañanas y viajar juntos.',
  });

  // Cellular Telemetry State
  const [cellularState, setCellularState] = useState<CellularState>({
    battery: 94,
    isCharging: true,
    carrier: 'Telcel 5G Ultra',
    networkType: '5G',
    signalStrength: 98,
    phoneModel: 'Galaxy S24 Ultra & Stark Link',
    bluetoothConnected: true,
    unreadCount: 3,
    activeCall: null,
    recentMessages: [
      {
        id: 'msg_init_1',
        app: 'whatsapp',
        sender: 'Mi Pareja ❤️',
        senderNumber: '+52 55 8899 1122',
        text: '¡Hola mi amor! Ya casi termino en la oficina. ¿Qué vamos a cenar hoy? Te amo.',
        timestamp: '15:20',
        priority: 'HIGH',
        isRead: false,
        aiSummary: 'Avisa que casi termina y pregunta qué cenarán.',
        suggestedAction: 'Responder con amor',
      },
      {
        id: 'msg_init_2',
        app: 'sms',
        sender: 'Banco BBVA Alertas',
        senderNumber: '2663',
        text: 'Retiro en cajero automático por $2,500.00 MXN en Sucursal Reforma. Si no reconoce esta operación llame de inmediato.',
        timestamp: '14:45',
        priority: 'CRITICAL',
        isRead: false,
        aiSummary: 'Alerta de retiro bancario en Reforma.',
        suggestedAction: 'Llamar al banco',
      },
      {
        id: 'msg_init_3',
        app: 'whatsapp',
        sender: 'Mamá',
        senderNumber: '+52 55 1234 5678',
        text: 'Hijo, recuerda tomarte tus vitaminas y avisarme cuando llegues a casa.',
        timestamp: '13:10',
        priority: 'NORMAL',
        isRead: true,
        aiSummary: 'Recordatorio familiar cariñoso.',
      },
    ],
  });

  // Environment & Participants Matrix
  const [participants, setParticipants] = useState<ParticipantProfile[]>([
    {
      id: 'part_user',
      name: 'Francisco',
      role: 'user',
      nickname: 'Creador',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces',
      phone: '+52 55 1122 3344',
      notes: 'Dueño del sistema, prioridad de seguridad absoluta.',
    },
    {
      id: 'part_partner',
      name: 'Mi Pareja',
      role: 'partner',
      nickname: 'Mi Amor',
      photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=faces',
      phone: '+52 55 8899 1122',
      notes: 'Pareja sentimental. Siempre anunciarla con alegría y prioridad máxima.',
    },
    {
      id: 'part_mom',
      name: 'Mamá',
      role: 'family',
      nickname: 'Mamá',
      photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=faces',
      phone: '+52 55 1234 5678',
      notes: 'Contacto VIP familiar. Interrumpe cualquier modo silencio.',
    },
    {
      id: 'part_boss',
      name: 'Sofia Mendoza',
      role: 'colleague',
      nickname: 'Jefa de Proyectos',
      photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=faces',
      phone: '+52 55 4455 6677',
      notes: 'Jefa de ingeniería en robótica. Llamadas suelen ser sobre entregas.',
    },
  ]);

  // Bulk Neural Memory State
  const [knowledge, setKnowledge] = useState<KnowledgeItem[]>([
    {
      id: 'k_1',
      title: 'Datos de Casa y Convivencia en Pareja',
      category: 'Familia',
      content: 'Vivimos en la colonia Condesa. Clave del portón: #4590. Red WiFi: "CyberChappie_5G" (contraseña: Chappie2026!). Las compras de despensa se hacen los sábados. El platillo favorito de mi pareja es el sushi de salmón y la pasta cuatro quesos.',
      summary: 'Acceso a la casa, claves wifi, rutina de pareja y comidas favoritas.',
      createdAt: '24/10/2026',
    },
    {
      id: 'k_2',
      title: 'Directorio Médico de Emergencia',
      category: 'Salud',
      content: 'Médico familiar: Dr. Roberto Torres (+52 55 4433 2211). Tipo de sangre de Francisco: O+. Alergia a la penicilina. Hospital de cobertura: Hospital Ángeles.',
      summary: 'Datos médicos de urgencia y alergias.',
      createdAt: '24/10/2026',
    },
    {
      id: 'k_3',
      title: 'Entregables de Trabajo y Servidores',
      category: 'Trabajo',
      content: 'Proyecto principal: Scout Neural Network Core. Reunión semanal los lunes 10:00 AM. Servidor de base de datos en nube con IP 10.0.4.12.',
      summary: 'Cronograma laboral y servidores principales.',
      createdAt: '24/10/2026',
    },
  ]);

  // Notification Preferences
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    autoVoiceReadout: 'all',
    voiceEngine: 'chappie',
    speechRate: 1.02,
    speechPitch: 1.0,
    tacticalSoundEffects: true,
    emergencyKeywords: ['urgente', 'hospital', 'fraude', 'banco', 'código', 'accidente', 'alerta', 'dinero'],
    vipOnlyInDoNotDisturb: true,
    doNotDisturb: false,
    enabledApps: {
      calls: true,
      whatsapp: true,
      sms: true,
      telegram: true,
      slack: true,
    },
  });

  // Environment Telemetry
  const [envStatus, setEnvStatus] = useState<EnvironmentStatus>({
    ambientTemp: 23.2,
    noiseLevelDb: 32,
    activeLocation: 'CDMX // Sector Residencial',
    wifiLatencyMs: 12,
    homeDevicesOnline: 11,
    smartSensorsActive: true,
  });

  // Assistant Chat Messages
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: 'J.A.R.V.I.S. en línea, señor. He simplificado la telemetría de su celular, tengo enlace satelital con Google en tiempo real y puedo abrir la cámara, YouTube o ejecutar cualquier protocolo a su orden.',
      simplifiedSummary: 'J.A.R.V.I.S. listo. Celular conectado y búsqueda de Google activa.',
      timestamp: 'Ahora',
      emotion: 'tactical',
    },
  ]);

  // Subscribe to speech synthesis state
  useEffect(() => {
    const unsubscribe = voiceSynth.subscribe((speaking) => {
      setIsSpeaking(speaking);
      if (speaking) {
        setEmotion('speaking');
      } else {
        setEmotion('idle');
      }
    });
    return unsubscribe;
  }, []);

  // Announce incoming call
  const handleAnnounceCall = (call: IncomingCall) => {
    if (isMuted) return;
    if (preferences.autoVoiceReadout === 'muted') return;

    soundFx.playCallChime();
    setEmotion('alert');

    let announcement = '';
    if (mode === 'jarvis') {
      announcement = `Llamada entrante, señor: de ${call.callerName}, clasificada como ${call.priority}. ¿Desea que atienda?`;
    } else if (mode === 'tars') {
      announcement = `Alerta: Llamada de ${call.callerName}. Urgencia: ${call.priority}.`;
    } else if (mode === 'chappie') {
      announcement = `¡Atención Francisco! Te está llamando ${call.callerName}, de ${call.relation}. ${call.priority === 'CRITICAL' ? '¡Es una alerta crítica!' : '¿Quieres que conteste por ti?'}`;
    } else {
      announcement = `Llamada entrante de ${call.callerName}. Número: ${call.callerNumber}. Relación: ${call.relation}. Prioridad: ${call.priority}.`;
    }

    voiceSynth.speak(announcement, mode, preferences.speechPitch, preferences.speechRate);
  };

  // Announce incoming message
  const handleAnnounceMessage = (msg: IncomingMessage) => {
    if (isMuted) return;
    if (preferences.autoVoiceReadout === 'muted') return;
    if (preferences.autoVoiceReadout === 'calls_only') return;
    if (preferences.autoVoiceReadout === 'urgent_only' && msg.priority !== 'CRITICAL' && msg.priority !== 'HIGH') return;

    if (msg.priority === 'CRITICAL') {
      soundFx.playCriticalAlarm();
      setEmotion('alert');
    } else {
      soundFx.playIncomingMessageSound();
      setEmotion('curious');
    }

    const appName = msg.app === 'whatsapp' ? 'WhatsApp' : msg.app === 'sms' ? 'SMS' : msg.app;
    let announcement = '';
    if (mode === 'jarvis') {
      announcement = `Mensaje de ${msg.sender} por ${appName}: "${msg.text}"`;
    } else if (mode === 'tars') {
      announcement = `[${appName}] ${msg.sender}: "${msg.text}"`;
    } else if (mode === 'chappie') {
      announcement = `Mensaje nuevo de ${msg.sender} por ${appName}: "${msg.text}"`;
    } else {
      announcement = `Nuevo mensaje en ${appName} de ${msg.sender}: "${msg.text}"`;
    }

    voiceSynth.speak(announcement, mode, preferences.speechPitch, preferences.speechRate);
  };

  const handleIncomingCall = (call: IncomingCall) => {
    setCellularState((prev) => ({
      ...prev,
      activeCall: call,
    }));
    handleAnnounceCall(call);
  };

  const handleIncomingMessage = (msg: IncomingMessage) => {
    const lower = msg.text.toLowerCase();
    const isCritical = preferences.emergencyKeywords.some((kw) => lower.includes(kw));
    const effectivePriority = isCritical ? 'CRITICAL' : msg.priority;

    const enrichedMsg = { ...msg, priority: effectivePriority };

    setCellularState((prev) => ({
      ...prev,
      unreadCount: prev.unreadCount + 1,
      recentMessages: [enrichedMsg, ...prev.recentMessages.slice(0, 19)],
    }));

    handleAnnounceMessage(enrichedMsg);
  };

  const handleAnswerCall = () => {
    soundFx.playTacticalPing();
    if (cellularState.activeCall) {
      const response = mode === 'jarvis'
        ? `Llamada conectada en altavoz, señor.`
        : mode === 'tars'
        ? `Enlace de voz activo.`
        : `Llamada conectada con ${cellularState.activeCall.callerName}.`;
      voiceSynth.speak(response, mode);
    }
  };

  const handleDismissCall = () => {
    soundFx.playTacticalPing();
    setCellularState((prev) => ({
      ...prev,
      activeCall: null,
    }));
    voiceSynth.stop();
  };

  const handleMarkMessageRead = (id: string) => {
    setCellularState((prev) => ({
      ...prev,
      unreadCount: Math.max(0, prev.unreadCount - 1),
      recentMessages: prev.recentMessages.map((m) =>
        m.id === id ? { ...m, isRead: true } : m
      ),
    }));
  };

  // Send message to Gemini assistant backend (with Google Search Grounding and Device Command Interception)
  const handleSendChatMessage = async (userText: string) => {
    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      role: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    soundFx.playTacticalPing();

    const lower = userText.toLowerCase().trim();

    // 1. Direct Device Command Interception
    if (lower.includes('abre la camara') || lower.includes('abrir camara') || lower.includes('abre camara') || lower.includes('activa camara')) {
      setIsCameraOpen(true);
      const conf = mode === 'jarvis'
        ? 'Abriendo sensores ópticos en vivo, señor.'
        : mode === 'tars'
        ? 'Cámara óptica desplegada.'
        : '¡Abriendo cámara táctica, creador!';
      setChatMessages((prev) => [
        ...prev,
        {
          id: `a_${Date.now()}`,
          role: 'assistant',
          text: conf,
          simplifiedSummary: 'Cámara en vivo activada.',
          timestamp: 'Ahora',
          emotion: 'tactical',
        },
      ]);
      if (!isMuted) voiceSynth.speak(conf, mode);
      return;
    }

    if (lower.includes('abre youtube') || lower.includes('abrir youtube') || lower.includes('youtube') || lower.includes('pon un video')) {
      setIsYouTubeOpen(true);
      const conf = mode === 'jarvis'
        ? 'Abriendo módulo de YouTube en vivo, señor.'
        : mode === 'tars'
        ? 'Canal YouTube inicializado.'
        : '¡Abriendo YouTube para ti!';
      setChatMessages((prev) => [
        ...prev,
        {
          id: `a_${Date.now()}`,
          role: 'assistant',
          text: conf,
          simplifiedSummary: 'YouTube Hub abierto.',
          timestamp: 'Ahora',
          emotion: 'happy',
        },
      ]);
      if (!isMuted) voiceSynth.speak(conf, mode);
      return;
    }

    if (lower.includes('temporizador') || lower.includes('alarma') || lower.includes('pon tiempo')) {
      setActiveTool('timer');
      const conf = 'Temporizador táctico activado.';
      setChatMessages((prev) => [
        ...prev,
        {
          id: `a_${Date.now()}`,
          role: 'assistant',
          text: conf,
          simplifiedSummary: 'Temporizador en pantalla.',
          timestamp: 'Ahora',
        },
      ]);
      if (!isMuted) voiceSynth.speak(conf, mode);
      return;
    }

    if (lower.includes('mapa') || lower.includes('gps') || lower.includes('donde estoy') || lower.includes('ubicacion')) {
      setActiveTool('map');
      const conf = 'Radar GPS y telemetría satelital en pantalla.';
      setChatMessages((prev) => [
        ...prev,
        {
          id: `a_${Date.now()}`,
          role: 'assistant',
          text: conf,
          simplifiedSummary: 'Radar satelital en línea.',
          timestamp: 'Ahora',
        },
      ]);
      if (!isMuted) voiceSynth.speak(conf, mode);
      return;
    }

    if (lower.includes('linterna') || lower.includes('luz') || lower.includes('estroboscopio')) {
      setActiveTool('flashlight');
      const conf = 'Linterna táctica encendida.';
      setChatMessages((prev) => [
        ...prev,
        {
          id: `a_${Date.now()}`,
          role: 'assistant',
          text: conf,
          simplifiedSummary: 'Linterna activa.',
          timestamp: 'Ahora',
        },
      ]);
      if (!isMuted) voiceSynth.speak(conf, mode);
      return;
    }

    if (lower.includes('musica') || lower.includes('synth') || lower.includes('cancion')) {
      setActiveTool('music');
      const conf = 'Iniciando oscilador de audio cyberpunk.';
      setChatMessages((prev) => [
        ...prev,
        {
          id: `a_${Date.now()}`,
          role: 'assistant',
          text: conf,
          simplifiedSummary: 'Audio Synth activo.',
          timestamp: 'Ahora',
        },
      ]);
      if (!isMuted) voiceSynth.speak(conf, mode);
      return;
    }

    if (lower.includes('calculadora') || lower.includes('calcula')) {
      setActiveTool('calc');
      const conf = 'Calculadora táctica abierta.';
      setChatMessages((prev) => [
        ...prev,
        {
          id: `a_${Date.now()}`,
          role: 'assistant',
          text: conf,
          simplifiedSummary: 'Calculadora activa.',
          timestamp: 'Ahora',
        },
      ]);
      if (!isMuted) voiceSynth.speak(conf, mode);
      return;
    }

    // 2. Query Gemini with Google Search Grounding and Data Simplification
    try {
      const res = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          mode,
          phoneState: cellularState,
          knowledgeBase: knowledge,
          history: chatMessages.slice(-6),
        }),
      });

      const data = await res.json();
      const replyText = data.reply || 'Entendido. Datos actualizados.';
      const newEmotion = data.emotion || 'speaking';

      setEmotion(newEmotion);

      const assistantMsg: ChatMessage = {
        id: `a_${Date.now()}`,
        role: 'assistant',
        text: replyText,
        simplifiedSummary: data.simplifiedSummary,
        groundingSources: data.groundingSources,
        searchQueries: data.searchQueries,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        emotion: newEmotion,
      };

      setChatMessages((prev) => [...prev, assistantMsg]);

      if (!isMuted) {
        // Speak simplified summary or full text
        const textToSpeak = data.simplifiedSummary || replyText;
        voiceSynth.speak(textToSpeak, mode, preferences.speechPitch, preferences.speechRate);
      }
    } catch (err) {
      console.error('Error communicating with assistant:', err);
      const fallback = mode === 'jarvis'
        ? 'Disculpe, señor: ocurrió una breve interferencia de red al consultar Google.'
        : mode === 'tars'
        ? 'Error de conexión. Red no disponible.'
        : '¡Chappie tuvo un pequeño parpadeo de red!';
      setChatMessages((prev) => [
        ...prev,
        {
          id: `a_err_${Date.now()}`,
          role: 'assistant',
          text: fallback,
          timestamp: 'Ahora',
        },
      ]);
      if (!isMuted) voiceSynth.speak(fallback, mode);
    }
  };

  const handleSetMode = (newMode: AssistantMode) => {
    soundFx.playTacticalPing();
    setMode(newMode);
    let greet = '';
    if (newMode === 'jarvis') {
      greet = 'J.A.R.V.I.S. activado. A su servicio, señor. Acceso a Google en tiempo real y simplificación de datos listos.';
    } else if (newMode === 'tars') {
      greet = 'TARS activado. Honestidad al 90%, humor al 75%. Parámetros simplificados.';
    } else if (newMode === 'chappie') {
      greet = '¡Modo Chappie activado! Scout 22 con consciencia pura listo.';
    } else {
      greet = 'Modo Alexa activado. Asistente personal en línea.';
    }
    voiceSynth.speak(greet, newMode);
  };

  return (
    <div className="min-h-screen bg-[#08090d] text-slate-100 tactical-grid flex flex-col selection:bg-cyan-500 selection:text-black">
      {/* Subtle Scanline Overlay */}
      <div className="chappie-scanlines fixed inset-0 z-30 pointer-events-none opacity-40" />

      {/* Top Nav Bar */}
      <TopNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mode={mode}
        onSetMode={handleSetMode}
        isMuted={isMuted}
        onToggleMute={() => {
          setIsMuted(!isMuted);
          if (!isMuted) voiceSynth.stop();
        }}
      />

      {/* TACTICAL HERO STATUS STRIP */}
      <div className="border-b border-zinc-800/80 bg-zinc-950/70 backdrop-blur-sm px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Reactive HUD Visualizer (Jarvis Arc Reactor / Tars Monolith / Chappie Visor) */}
          <div className="md:col-span-4">
            <ChappieVisor
              mode={mode}
              emotion={emotion}
              isSpeaking={isSpeaking}
              isListening={false}
              batteryLevel={cellularState.battery}
            />
          </div>

          {/* Central Status & Google Live Telemetry */}
          <div className="md:col-span-5 flex flex-col justify-center space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="font-tech text-xs tracking-widest text-cyan-400 font-bold uppercase">
                {mode === 'jarvis'
                  ? 'MARK-L // J.A.R.V.I.S. PROTOCOL'
                  : mode === 'tars'
                  ? 'TARS TACTICAL CORE // USMC'
                  : mode === 'chappie'
                  ? 'SCOUT-22 // CONSCIENCIA VIVA'
                  : 'ALEXA OS // SISTEMA ACTIVO'}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-emerald-400 border border-zinc-700 flex items-center gap-1">
                <Globe className="w-3 h-3 text-cyan-400" />
                GOOGLE GROUNDING ON
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-tech tracking-wide text-white">
              {mode === 'jarvis'
                ? 'J.A.R.V.I.S. Asistente Ejecutivo'
                : mode === 'tars'
                ? 'TARS Computadora Táctica Militar'
                : mode === 'chappie'
                ? 'Chappie Asistente Consciente'
                : 'Alexa Asistente Móvil'}
            </h1>
            <p className="text-xs text-zinc-400 font-mono">
              Intercepción celular en tiempo real, simplificación ejecutiva de datos, y acceso completo a Google.
            </p>
          </div>

          {/* Quick Couple / Intercept Telemetry Mini-Card */}
          <div className="md:col-span-3 p-3 rounded-xl border border-zinc-800 bg-[#0c0f17] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <img
                  src={couple.partnerPhoto}
                  alt={couple.partnerName}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover border border-rose-500/80"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-black" />
              </div>
              <div>
                <div className="text-xs font-bold text-white truncate">{couple.partnerName}</div>
                <div className="text-[10px] text-rose-400 font-mono">Pareja Conectada</div>
              </div>
            </div>

            <button
              onClick={() => {
                setActiveTab('couple');
                soundFx.playTacticalPing();
              }}
              className="text-[11px] font-tech text-amber-400 hover:text-amber-300 font-semibold uppercase tracking-wider cursor-pointer"
            >
              Ver Vínculo
            </button>
          </div>
        </div>
      </div>

      {/* QUICK APPS & TOOLS LAUNCHER DOCK */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 pt-3">
        <AppLauncherBar
          onOpenTool={(tool) => setActiveTool(tool)}
          onOpenYouTube={() => setIsYouTubeOpen(true)}
          onOpenCamera={() => setIsCameraOpen(true)}
          onOpenGooglePrompt={() => {
            setActiveTab('voice');
            handleSendChatMessage('¿Cuáles son las noticias más importantes de hoy en Google?');
          }}
        />
      </div>

      {/* MAIN COCKPIT VIEWPORT */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: ACTIVE INTERACTIVE WORKSPACE */}
        <div className="lg:col-span-7 space-y-6">
          {/* Mobile Tab Switcher */}
          <div className="flex md:hidden items-center gap-1 p-1 bg-zinc-900 border border-zinc-800 rounded-lg overflow-x-auto text-xs font-mono">
            {[
              { id: 'interceptor', label: '📱 Celular' },
              { id: 'couple', label: '❤️ Pareja' },
              { id: 'memory', label: '🧠 Memoria' },
              { id: 'settings', label: '⚙️ Ajustes' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded whitespace-nowrap transition-colors ${
                  activeTab === tab.id ? 'bg-cyan-500 text-black font-bold' : 'text-zinc-400'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: CELLULAR INTERCEPTOR & CALL NOTIFICATIONS */}
          {activeTab === 'interceptor' && (
            <div className="space-y-6">
              <PhoneInterceptor
                cellularState={cellularState}
                mode={mode}
                onIncomingCall={handleIncomingCall}
                onIncomingMessage={handleIncomingMessage}
                onAnswerCall={handleAnswerCall}
                onDismissCall={handleDismissCall}
                onMarkMessageRead={handleMarkMessageRead}
                onAnnounceMessage={handleAnnounceMessage}
              />

              {/* Couple Quick Hologram inside Interceptor */}
              <CoupleHoloWidget
                couple={couple}
                mode={mode}
                onUpdateCouple={setCouple}
                onTriggerPartnerCall={() => {
                  handleIncomingCall({
                    id: `call_partner_${Date.now()}`,
                    callerName: couple.partnerName,
                    callerNumber: '+52 55 8899 1122',
                    relation: 'Pareja Sentimental (Prioridad Amor)',
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    priority: 'HIGH',
                    status: 'ringing',
                    notes: 'Llamando para saber si ya saliste de casa',
                    aiSummary: `Llamada cariñosa de ${couple.partnerNickname || couple.partnerName}.`,
                  });
                }}
                onTriggerPartnerMessage={() => {
                  handleIncomingMessage({
                    id: `msg_partner_${Date.now()}`,
                    app: 'whatsapp',
                    sender: `${couple.partnerName} (${couple.partnerNickname || 'Mi Amor'})`,
                    senderNumber: '+52 55 8899 1122',
                    text: '¡Hola amor! Te amo mucho, ¿ya estás listo para vernos al rato?',
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    priority: 'HIGH',
                    isRead: false,
                    aiSummary: 'Mensaje de amor y coordinación para verse.',
                  });
                }}
              />
            </div>
          )}

          {/* TAB 2: COUPLE & ENVIRONMENT PARTICIPANTS */}
          {activeTab === 'couple' && (
            <div className="space-y-6">
              <CoupleHoloWidget
                couple={couple}
                mode={mode}
                onUpdateCouple={setCouple}
                onTriggerPartnerCall={() => {
                  handleIncomingCall({
                    id: `call_partner_${Date.now()}`,
                    callerName: couple.partnerName,
                    callerNumber: '+52 55 8899 1122',
                    relation: 'Pareja Sentimental',
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    priority: 'HIGH',
                    status: 'ringing',
                    aiSummary: `Llamada entrante de ${couple.partnerName}.`,
                  });
                }}
                onTriggerPartnerMessage={() => {
                  handleIncomingMessage({
                    id: `msg_partner_${Date.now()}`,
                    app: 'whatsapp',
                    sender: couple.partnerName,
                    text: '¡Amor! Te mandé una foto deliciosa de lo que cociné hoy.',
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    priority: 'NORMAL',
                    isRead: false,
                  });
                }}
              />

              <ParticipantsLearner
                participants={participants}
                mode={mode}
                onAddParticipant={(p) => setParticipants((prev) => [...prev, p])}
                onUpdateParticipantNotes={(id, notes) =>
                  setParticipants((prev) =>
                    prev.map((p) => (p.id === id ? { ...p, notes } : p))
                  )
                }
              />
            </div>
          )}

          {/* TAB 3: BULK NEURAL MEMORY CORE */}
          {activeTab === 'memory' && (
            <NeuralMemoryBank
              knowledge={knowledge}
              mode={mode}
              onAddKnowledge={(item) => setKnowledge((prev) => [item, ...prev])}
              onDeleteKnowledge={(id) => setKnowledge((prev) => prev.filter((k) => k.id !== id))}
              onAskAboutKnowledge={(query) => {
                setActiveTab('voice');
                handleSendChatMessage(query);
              }}
            />
          )}

          {/* TAB 4: SETTINGS & INNOVATION */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <NotificationSettings
                preferences={preferences}
                mode={mode}
                onUpdatePreferences={setPreferences}
              />

              <ParticipantsLearner
                participants={participants}
                mode={mode}
                onAddParticipant={(p) => setParticipants((prev) => [...prev, p])}
                onUpdateParticipantNotes={(id, notes) =>
                  setParticipants((prev) =>
                    prev.map((p) => (p.id === id ? { ...p, notes } : p))
                  )
                }
              />
            </div>
          )}

          {/* Environmental Radar Widget */}
          <EnvironmentRadarWidget
            envStatus={envStatus}
            mode={mode}
            onTriggerEmergencyTone={() => {
              soundFx.playCriticalAlarm();
              setEmotion('alert');
              voiceSynth.speak(
                '¡Alerta táctica activada! Frecuencia de emergencia transmitida al celular.',
                mode
              );
            }}
          />
        </div>

        {/* RIGHT COLUMN: PERMANENT INTELLIGENT VOICE CONSOLE WITH GOOGLE LIVE */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-20">
          <VoiceAssistantChat
            messages={chatMessages}
            mode={mode}
            cellularState={cellularState}
            knowledge={knowledge}
            isSpeaking={isSpeaking}
            onSendMessage={handleSendChatMessage}
            onClearHistory={() => setChatMessages([])}
          />

          {/* Tactical Decal Info Box */}
          <div className="p-3.5 rounded-xl border border-zinc-800 bg-[#0c0f17] flex items-center justify-between text-xs font-mono text-zinc-400">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-cyan-400" />
              <span>MOTOR: GEMINI 3.8 FLASH + GOOGLE GROUNDING</span>
            </div>
            <span className="text-emerald-400 font-bold">LATENCIA: 11ms</span>
          </div>
        </div>
      </main>

      {/* MODAL 1: REAL TACTICAL WEBCAM */}
      <TacticalCameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onSaveSnapshot={(dataUrl) => {
          setCouple((prev) => ({ ...prev, userPhoto: dataUrl }));
        }}
      />

      {/* MODAL 2: YOUTUBE HUB PLAYER */}
      <YouTubeHubModal
        isOpen={isYouTubeOpen}
        onClose={() => setIsYouTubeOpen(false)}
      />

      {/* MODAL 3: TACTICAL TOOLS (TIMER, FLASHLIGHT, MAP, MUSIC, CALC) */}
      <TacticalToolsModal
        tool={activeTool}
        onClose={() => setActiveTool(null)}
      />
    </div>
  );
}
