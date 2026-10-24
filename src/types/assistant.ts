export type AssistantMode = 'jarvis' | 'tars' | 'chappie' | 'alexa';

export type PriorityLevel = 'CRITICAL' | 'HIGH' | 'NORMAL' | 'LOW';

export type NotificationType = 'call' | 'message' | 'alert';

export interface ParticipantProfile {
  id: string;
  name: string;
  role: 'user' | 'partner' | 'family' | 'friend' | 'colleague';
  nickname?: string;
  photoUrl: string;
  phone?: string;
  birthday?: string;
  notes?: string;
  favoriteThings?: string[];
  lastInteracted?: string;
}

export interface CoupleProfile {
  userName: string;
  userNickname: string;
  userPhoto: string;
  partnerName: string;
  partnerNickname: string;
  partnerPhoto: string;
  anniversaryDate: string;
  relationshipStatus: string;
  sharedNotes: string;
}

export interface PhoneContact {
  id: string;
  name: string;
  number: string;
  relation: string;
  isVip: boolean;
  avatar?: string;
}

export interface IncomingCall {
  id: string;
  callerName: string;
  callerNumber: string;
  relation: string;
  avatar?: string;
  timestamp: string;
  priority: PriorityLevel;
  status: 'ringing' | 'connected' | 'ended' | 'missed';
  notes?: string;
  aiSummary?: string;
}

export interface IncomingMessage {
  id: string;
  app: 'whatsapp' | 'sms' | 'telegram' | 'slack' | 'signal';
  sender: string;
  senderNumber?: string;
  text: string;
  timestamp: string;
  priority: PriorityLevel;
  isRead: boolean;
  aiSummary?: string;
  suggestedAction?: string;
}

export interface NotificationPreferences {
  autoVoiceReadout: 'all' | 'urgent_only' | 'calls_only' | 'muted';
  voiceEngine: 'chappie' | 'alexa' | 'default';
  speechRate: number;
  speechPitch: number;
  tacticalSoundEffects: boolean;
  emergencyKeywords: string[];
  vipOnlyInDoNotDisturb: boolean;
  doNotDisturb: boolean;
  enabledApps: {
    calls: boolean;
    whatsapp: boolean;
    sms: boolean;
    telegram: boolean;
    slack: boolean;
  };
}

export interface KnowledgeItem {
  id: string;
  title: string;
  category: 'Familia' | 'Trabajo' | 'Salud' | 'Finanzas' | 'Claves' | 'Rutina' | 'General';
  content: string;
  summary?: string;
  keyEntities?: string[];
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  emotion?: 'speaking' | 'happy' | 'alert' | 'tactical' | 'curious';
  spokenAudio?: boolean;
  simplifiedSummary?: string;
  groundingSources?: Array<{ title: string; url: string }>;
  searchQueries?: string[];
}

export interface CellularState {
  battery: number;
  isCharging: boolean;
  carrier: string;
  networkType: '5G' | '4G LTE' | 'WiFi 6';
  signalStrength: number;
  phoneModel: string;
  bluetoothConnected: boolean;
  unreadCount: number;
  activeCall: IncomingCall | null;
  recentMessages: IncomingMessage[];
}

export interface EnvironmentStatus {
  ambientTemp: number; // Celsius
  noiseLevelDb: number;
  activeLocation: string;
  wifiLatencyMs: number;
  homeDevicesOnline: number;
  smartSensorsActive: boolean;
}
