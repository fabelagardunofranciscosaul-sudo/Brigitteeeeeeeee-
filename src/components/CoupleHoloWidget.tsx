import React, { useState, useRef } from 'react';
import { Heart, Camera, Phone, MessageCircle, Edit3, Calendar, Sparkles, Upload } from 'lucide-react';
import { CoupleProfile, AssistantMode } from '../types/assistant';
import { voiceSynth, soundFx } from '../utils/audioVoice';

interface CoupleHoloWidgetProps {
  couple: CoupleProfile;
  mode: AssistantMode;
  onUpdateCouple: (updated: CoupleProfile) => void;
  onTriggerPartnerCall: () => void;
  onTriggerPartnerMessage: () => void;
}

export const CoupleHoloWidget: React.FC<CoupleHoloWidgetProps> = ({
  couple,
  mode,
  onUpdateCouple,
  onTriggerPartnerCall,
  onTriggerPartnerMessage,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<CoupleProfile>(couple);
  const [loveNote, setLoveNote] = useState<string | null>(null);

  const userInputRef = useRef<HTMLInputElement>(null);
  const partnerInputRef = useRef<HTMLInputElement>(null);

  // Calculate days together
  const calculateDays = (dateStr: string) => {
    try {
      const start = new Date(dateStr);
      const now = new Date();
      const diff = now.getTime() - start.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      return isNaN(days) || days < 0 ? 365 : days;
    } catch {
      return 365;
    }
  };

  const daysTogether = calculateDays(couple.anniversaryDate);

  // File upload handlers for real user & partner photos
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'user' | 'partner') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          soundFx.playTacticalPing();
          const updated = {
            ...couple,
            [target === 'user' ? 'userPhoto' : 'partnerPhoto']: reader.result,
          };
          onUpdateCouple(updated);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateLoveNote = () => {
    soundFx.playTacticalPing();
    const notes = [
      `¡Chappie recuerda que ${couple.partnerNickname || couple.partnerName} es la persona más especial de tu vida! Hoy es un gran día para recordarle cuánto la amas.`,
      `Telemetría del corazón: ${daysTogether} días juntos y la frecuencia de amor sigue al 100%. ¡Mándale un besito por WhatsApp!`,
      `Recordatorio de Chappie: Cuidar a ${couple.partnerName} es la misión prioritaria número uno. ¡Están hechos el uno para el otro!`,
      `Análisis sentimental completado: Su vínculo tiene índice de afinidad máxima. ¡Que tengan un día maravilloso juntos!`,
    ];
    const picked = notes[Math.floor(Math.random() * notes.length)];
    setLoveNote(picked);
    voiceSynth.speak(picked, mode);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateCouple(editForm);
    setIsEditing(false);
    soundFx.playTacticalPing();
  };

  return (
    <div className="rounded-xl border border-zinc-800 bg-[#0e111a] p-5 shadow-xl relative overflow-hidden">
      {/* Background Decorative Tech Rings */}
      <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full border border-rose-500/10 pointer-events-none" />
      <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full border border-amber-500/10 pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500">
            <Heart className="w-4 h-4 fill-rose-500" />
          </div>
          <div>
            <h3 className="font-tech text-base font-bold text-white tracking-wide flex items-center gap-2">
              VÍNCULO SENTIMENTAL & PAREJA
            </h3>
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <span className="text-rose-400 font-mono">{daysTogether} días juntos</span>
              <span>·</span>
              <span className="text-zinc-400">{couple.relationshipStatus}</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            setEditForm(couple);
            setIsEditing(!isEditing);
          }}
          className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer text-xs flex items-center gap-1 font-mono"
        >
          <Edit3 className="w-3.5 h-3.5 text-amber-500" />
          <span>{isEditing ? 'Cancelar' : 'Editar'}</span>
        </button>
      </div>

      {/* Hidden File Inputs */}
      <input
        ref={userInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handlePhotoUpload(e, 'user')}
      />
      <input
        ref={partnerInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handlePhotoUpload(e, 'partner')}
      />

      {/* PHOTO DUAL HOLOGRAM DISPLAY */}
      <div className="grid grid-cols-2 gap-4 py-4">
        {/* User Photo Frame */}
        <div className="relative group rounded-xl border border-zinc-800 bg-zinc-950/60 p-3 flex flex-col items-center text-center transition-all hover:border-amber-500/50">
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-amber-500/80 shadow-lg shadow-amber-500/10 mb-2.5">
            <img
              src={couple.userPhoto}
              alt={couple.userName}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {/* Upload Overlay Button */}
            <button
              onClick={() => userInputRef.current?.click()}
              className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-mono cursor-pointer"
              title="Cambiar mi foto"
            >
              <Camera className="w-5 h-5 text-amber-400 mb-1" />
              <span>Mi Foto</span>
            </button>
          </div>

          <span className="font-tech text-sm font-bold text-white tracking-wide">
            {couple.userName}
          </span>
          <span className="text-xs text-amber-400 font-mono">
            {couple.userNickname ? `"${couple.userNickname}"` : 'Tú'}
          </span>
          <button
            onClick={() => userInputRef.current?.click()}
            className="mt-2 text-[11px] font-mono text-zinc-400 hover:text-amber-400 flex items-center gap-1 cursor-pointer"
          >
            <Upload className="w-3 h-3" />
            <span>Subir foto</span>
          </button>
        </div>

        {/* Partner Photo Frame */}
        <div className="relative group rounded-xl border border-zinc-800 bg-zinc-950/60 p-3 flex flex-col items-center text-center transition-all hover:border-rose-500/50">
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-rose-500/80 shadow-lg shadow-rose-500/10 mb-2.5">
            <img
              src={couple.partnerPhoto}
              alt={couple.partnerName}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {/* Upload Overlay Button */}
            <button
              onClick={() => partnerInputRef.current?.click()}
              className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-mono cursor-pointer"
              title="Cambiar foto de mi pareja"
            >
              <Camera className="w-5 h-5 text-rose-400 mb-1" />
              <span>Foto Pareja</span>
            </button>
          </div>

          <span className="font-tech text-sm font-bold text-white tracking-wide">
            {couple.partnerName}
          </span>
          <span className="text-xs text-rose-400 font-mono">
            {couple.partnerNickname ? `"${couple.partnerNickname}"` : 'Mi Amor'}
          </span>
          <button
            onClick={() => partnerInputRef.current?.click()}
            className="mt-2 text-[11px] font-mono text-zinc-400 hover:text-rose-400 flex items-center gap-1 cursor-pointer"
          >
            <Upload className="w-3 h-3" />
            <span>Subir foto</span>
          </button>
        </div>
      </div>

      {/* Love Note Banner if active */}
      {loveNote && (
        <div className="p-3 mb-3 rounded-lg bg-rose-950/30 border border-rose-500/40 text-xs font-mono text-rose-200 flex items-start gap-2 animate-in fade-in">
          <Heart className="w-4 h-4 fill-rose-500 text-rose-500 shrink-0 mt-0.5" />
          <p className="flex-1 leading-relaxed">{loveNote}</p>
        </div>
      )}

      {/* Quick Action Intercom */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-zinc-800 text-xs">
        <button
          onClick={onTriggerPartnerCall}
          className="flex-1 py-2 px-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 flex items-center justify-center gap-2 font-mono transition-colors cursor-pointer"
        >
          <Phone className="w-3.5 h-3.5 text-emerald-400" />
          <span>Simular llamada de {couple.partnerName}</span>
        </button>

        <button
          onClick={onTriggerPartnerMessage}
          className="flex-1 py-2 px-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 flex items-center justify-center gap-2 font-mono transition-colors cursor-pointer"
        >
          <MessageCircle className="w-3.5 h-3.5 text-rose-400" />
          <span>WhatsApp de {couple.partnerNickname || couple.partnerName}</span>
        </button>

        <button
          onClick={handleGenerateLoveNote}
          className="py-2 px-3 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 flex items-center justify-center gap-1.5 font-tech uppercase tracking-wider cursor-pointer"
          title="Chappie genera un mensaje afectuoso"
        >
          <Sparkles className="w-3.5 h-3.5 text-rose-400" />
          <span>Voz Chappie</span>
        </button>
      </div>

      {/* EDIT MODAL / FORM */}
      {isEditing && (
        <form onSubmit={handleSaveEdit} className="mt-4 p-4 rounded-xl border border-zinc-700 bg-zinc-950 space-y-3">
          <h4 className="font-tech text-xs uppercase tracking-wider text-amber-400 font-bold">
            EDITAR IDENTIDADES Y FECHA CLAVE
          </h4>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-zinc-400 font-mono block mb-1">Mi Nombre:</label>
              <input
                type="text"
                value={editForm.userName}
                onChange={(e) => setEditForm({ ...editForm, userName: e.target.value })}
                className="w-full p-2 rounded bg-zinc-900 border border-zinc-700 text-white font-mono outline-none"
              />
            </div>
            <div>
              <label className="text-zinc-400 font-mono block mb-1">Mi Apodo / Alias:</label>
              <input
                type="text"
                value={editForm.userNickname}
                onChange={(e) => setEditForm({ ...editForm, userNickname: e.target.value })}
                className="w-full p-2 rounded bg-zinc-900 border border-zinc-700 text-white font-mono outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-zinc-400 font-mono block mb-1">Nombre Pareja:</label>
              <input
                type="text"
                value={editForm.partnerName}
                onChange={(e) => setEditForm({ ...editForm, partnerName: e.target.value })}
                className="w-full p-2 rounded bg-zinc-900 border border-zinc-700 text-white font-mono outline-none"
              />
            </div>
            <div>
              <label className="text-zinc-400 font-mono block mb-1">Apodo Pareja:</label>
              <input
                type="text"
                value={editForm.partnerNickname}
                onChange={(e) => setEditForm({ ...editForm, partnerNickname: e.target.value })}
                className="w-full p-2 rounded bg-zinc-900 border border-zinc-700 text-white font-mono outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-zinc-400 font-mono block mb-1">Fecha Aniversario / Inicio:</label>
              <input
                type="date"
                value={editForm.anniversaryDate}
                onChange={(e) => setEditForm({ ...editForm, anniversaryDate: e.target.value })}
                className="w-full p-2 rounded bg-zinc-900 border border-zinc-700 text-white font-mono outline-none"
              />
            </div>
            <div>
              <label className="text-zinc-400 font-mono block mb-1">Estado de la Relación:</label>
              <input
                type="text"
                value={editForm.relationshipStatus}
                onChange={(e) => setEditForm({ ...editForm, relationshipStatus: e.target.value })}
                placeholder="Ej. Comprometidos, Casados, Novios"
                className="w-full p-2 rounded bg-zinc-900 border border-zinc-700 text-white font-mono outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-zinc-400 font-mono block mb-1">Notas compartidas para Chappie:</label>
            <input
              type="text"
              value={editForm.sharedNotes}
              onChange={(e) => setEditForm({ ...editForm, sharedNotes: e.target.value })}
              placeholder="Ej. Nos gusta viajar, restaurantes italianos, aniversario el 14"
              className="w-full p-2 rounded bg-zinc-900 border border-zinc-700 text-white font-mono outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-3 py-1.5 rounded text-zinc-400 font-mono text-xs"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded bg-rose-600 hover:bg-rose-500 text-white font-tech text-xs font-bold uppercase tracking-wider"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
