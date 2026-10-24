import React, { useState } from 'react';
import { Users, UserPlus, Sparkles, Brain, Award, Star, Lightbulb, Check } from 'lucide-react';
import { ParticipantProfile, AssistantMode } from '../types/assistant';
import { soundFx, voiceSynth } from '../utils/audioVoice';

interface ParticipantsLearnerProps {
  participants: ParticipantProfile[];
  mode: AssistantMode;
  onAddParticipant: (p: ParticipantProfile) => void;
  onUpdateParticipantNotes: (id: string, notes: string) => void;
}

export const ParticipantsLearner: React.FC<ParticipantsLearnerProps> = ({
  participants,
  mode,
  onAddParticipant,
  onUpdateParticipantNotes,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<ParticipantProfile | null>(null);
  const [newNote, setNewNote] = useState('');
  
  // New participant form
  const [name, setName] = useState('');
  const [role, setRole] = useState<'partner' | 'family' | 'friend' | 'colleague'>('family');
  const [nickname, setNickname] = useState('');
  const [phone, setPhone] = useState('');
  const [initialNotes, setInitialNotes] = useState('');

  // Autonomous Innovation Generator State
  const [innovations, setInnovations] = useState<string[]>([
    'Patrón detectado: Tu pareja suele enviar mensaje al salir del trabajo a las 6:15 PM. Chappie estará atento para leerlo de inmediato.',
    'Sincronización táctica: Mamá tiene etiqueta VIP permanente. Sus llamadas interrumpirán cualquier modo silencio.',
    'Optimización de entorno: Detectadas 4 llamadas desconocidas en la última semana. Chappie sugiere activar el filtro de respuesta previa con IA.',
    'Innovación proactiva: El aniversario se acerca en el calendario. Chappie guardó recordatorio de reservas para tu cena especial.',
  ]);
  const [isInnovating, setIsInnovating] = useState(false);

  const handleGenerateInnovation = async () => {
    setIsInnovating(true);
    soundFx.playTacticalPing();
    try {
      const res = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Genera una idea de innovación súper inteligente y proactiva para mí y mi entorno (mi pareja, mi familia, mi rutina diaria y llamadas). Que sea 1 sola idea concreta y futurista.',
          mode,
          history: [],
        }),
      });
      const data = await res.json();
      if (data.reply) {
        setInnovations(prev => [data.reply, ...prev.slice(0, 5)]);
        voiceSynth.speak(data.reply, mode);
      }
    } catch {
      const fallback = 'Innovación activa: Chappie ha ajustado la sensibilidad de intercepción para priorizar llamadas de alta urgencia.';
      setInnovations(prev => [fallback, ...prev]);
    } finally {
      setIsInnovating(false);
    }
  };

  const handleCreateParticipant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    soundFx.playTacticalPing();
    const newP: ParticipantProfile = {
      id: `part_${Date.now()}`,
      name: name.trim(),
      role,
      nickname: nickname.trim() || undefined,
      phone: phone.trim() || undefined,
      notes: initialNotes.trim() || undefined,
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces',
      lastInteracted: 'Hoy',
    };
    onAddParticipant(newP);
    setName('');
    setNickname('');
    setPhone('');
    setInitialNotes('');
    setShowAddModal(false);
  };

  const handleSaveNote = () => {
    if (!selectedParticipant || !newNote.trim()) return;
    soundFx.playMemoryIndexing();
    const existing = selectedParticipant.notes ? `${selectedParticipant.notes} | ${newNote}` : newNote;
    onUpdateParticipantNotes(selectedParticipant.id, existing);
    setNewNote('');
    setSelectedParticipant(null);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner: Environment & Participants Intelligence */}
      <div className="p-4 rounded-xl border border-zinc-800 bg-[#0e111a] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-tech text-base font-bold text-white tracking-wide">
              RECONOCIMIENTO DEL ENTORNO & PARTICIPANTES
            </h3>
            <p className="text-xs text-zinc-400">
              Chappie aprende quiénes son las personas clave en tu vida para identificarlas por voz al instante.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleGenerateInnovation}
            disabled={isInnovating}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-tech font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isInnovating ? 'Innovando...' : 'Generar Innovación'}</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 font-mono text-xs transition-colors cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5 text-cyan-400" />
            <span>+ Registrar Persona</span>
          </button>
        </div>
      </div>

      {/* PARTICIPANTS CARD GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {participants.map((p) => (
          <div
            key={p.id}
            className="p-3.5 rounded-xl border border-zinc-800 bg-[#0b0e17] hover:border-zinc-700 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start gap-3">
                <img
                  src={p.photoUrl}
                  alt={p.name}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-full object-cover border border-zinc-700 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-white truncate">{p.name}</h4>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700 uppercase">
                      {p.role}
                    </span>
                  </div>
                  {p.nickname && (
                    <span className="text-xs text-amber-400 font-mono block">
                      "{p.nickname}"
                    </span>
                  )}
                  {p.phone && (
                    <span className="text-[11px] text-zinc-500 font-mono block">
                      {p.phone}
                    </span>
                  )}
                </div>
              </div>

              {p.notes && (
                <div className="mt-2.5 p-2 rounded bg-zinc-900/60 border border-zinc-800 text-xs text-zinc-300 font-mono">
                  <span className="text-cyan-400 font-bold">Aprendizaje Chappie: </span>
                  {p.notes}
                </div>
              )}
            </div>

            <div className="mt-3 pt-2.5 border-t border-zinc-800/80 flex items-center justify-between text-xs">
              <span className="text-[10px] font-mono text-zinc-500">
                Último contacto: {p.lastInteracted || 'Reciente'}
              </span>
              <button
                onClick={() => {
                  setSelectedParticipant(p);
                  setNewNote('');
                }}
                className="text-[11px] font-tech text-amber-400 hover:text-amber-300 uppercase tracking-wider cursor-pointer"
              >
                + Enseñar dato
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CONTINUOUS INNOVATION FEED */}
      <div className="p-4 rounded-xl border border-zinc-800 bg-[#0c0f17]">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <h4 className="font-tech text-sm font-bold text-white tracking-wider uppercase">
            MOTOR DE INNOVACIÓN CONTINUA & SUGERENCIAS PROACTIVAS
          </h4>
        </div>
        <div className="space-y-2">
          {innovations.map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded-lg bg-zinc-950 border border-zinc-800/80 text-xs font-mono text-zinc-300 flex items-start gap-2.5"
            >
              <Award className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="flex-1 leading-relaxed">{item}</p>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL: TEACH NEW NOTE TO CHAPPIE */}
      {selectedParticipant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-zinc-700 bg-[#111420] p-5 shadow-2xl space-y-3">
            <h4 className="font-tech text-base font-bold text-white tracking-wide">
              ENSEÑAR DATO SOBRE: {selectedParticipant.name}
            </h4>
            <p className="text-xs text-zinc-400">
              ¿Qué debe recordar Chappie sobre esta persona cuando llame o mande un mensaje?
            </p>
            <textarea
              rows={3}
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Ej. Cumpleaños el 20 de mayo, le gusta el café sin azúcar, prefiere llamadas por la tarde..."
              className="w-full p-2.5 rounded-lg bg-zinc-900 border border-zinc-700 text-sm text-white font-mono focus:border-amber-500 outline-none resize-none"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedParticipant(null)}
                className="px-3 py-1.5 text-xs font-mono text-zinc-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveNote}
                className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-tech font-bold text-xs uppercase"
              >
                Guardar en Memoria
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD PARTICIPANT */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <form onSubmit={handleCreateParticipant} className="w-full max-w-md rounded-2xl border border-zinc-700 bg-[#111420] p-5 shadow-2xl space-y-3">
            <h4 className="font-tech text-base font-bold text-white tracking-wide">
              REGISTRAR NUEVO PARTICIPANTE DEL ENTORNO
            </h4>

            <div>
              <label className="text-xs font-mono text-zinc-400 block mb-1">Nombre completo:</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Laura Gómez"
                className="w-full p-2 rounded bg-zinc-900 border border-zinc-700 text-sm text-white font-mono outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-mono text-zinc-400 block mb-1">Rol / Vínculo:</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full p-2 rounded bg-zinc-900 border border-zinc-700 text-xs text-white font-mono outline-none"
                >
                  <option value="partner">Pareja</option>
                  <option value="family">Familia</option>
                  <option value="friend">Amigo</option>
                  <option value="colleague">Colega de trabajo</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-mono text-zinc-400 block mb-1">Apodo o Alias:</label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="Ej. Hermana, Mi amor"
                  className="w-full p-2 rounded bg-zinc-900 border border-zinc-700 text-xs text-white font-mono outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-mono text-zinc-400 block mb-1">Número telefónico:</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+52 55..."
                className="w-full p-2 rounded bg-zinc-900 border border-zinc-700 text-sm text-white font-mono outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-zinc-400 block mb-1">Notas clave / Hábitos:</label>
              <textarea
                rows={2}
                value={initialNotes}
                onChange={(e) => setInitialNotes(e.target.value)}
                placeholder="Datos que Chappie debe saber al anunciarla..."
                className="w-full p-2 rounded bg-zinc-900 border border-zinc-700 text-xs text-white font-mono outline-none resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-3 py-1.5 text-xs font-mono text-zinc-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-tech font-bold text-xs uppercase"
              >
                Registrar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
