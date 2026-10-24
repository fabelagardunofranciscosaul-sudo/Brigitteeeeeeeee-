import React, { useState, useRef } from 'react';
import { Database, Upload, Plus, Trash2, Search, Brain, FileText, CheckCircle2, Sparkles } from 'lucide-react';
import { KnowledgeItem, AssistantMode } from '../types/assistant';
import { soundFx, voiceSynth } from '../utils/audioVoice';

interface NeuralMemoryBankProps {
  knowledge: KnowledgeItem[];
  mode: AssistantMode;
  onAddKnowledge: (item: KnowledgeItem) => void;
  onDeleteKnowledge: (id: string) => void;
  onAskAboutKnowledge: (query: string) => void;
}

export const NeuralMemoryBank: React.FC<NeuralMemoryBankProps> = ({
  knowledge,
  mode,
  onAddKnowledge,
  onDeleteKnowledge,
  onAskAboutKnowledge,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<KnowledgeItem['category']>('Familia');
  const [content, setContent] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // File Upload Reader (Text, JSON, MD)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const text = event.target?.result as string;
        if (text) {
          await processAndSaveKnowledge(file.name.replace(/\.[^/.]+$/, ''), text, 'General');
        }
      };
      reader.readAsText(file);
    }
  };

  const processAndSaveKnowledge = async (itemTitle: string, rawContent: string, cat: KnowledgeItem['category']) => {
    setIsProcessing(true);
    soundFx.playMemoryIndexing();

    try {
      // Send to server to extract key entities and generate an executive summary
      const res = await fetch('/api/assistant/index-knowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: itemTitle,
          rawContent,
          category: cat,
        }),
      });

      const data = await res.json();
      const extracted = data.extracted || {};

      const newItem: KnowledgeItem = {
        id: `mem_${Date.now()}`,
        title: itemTitle,
        category: (extracted.category as any) || cat,
        content: rawContent,
        summary: extracted.summary || rawContent.slice(0, 120),
        keyEntities: extracted.keyEntities || [],
        createdAt: new Date().toLocaleDateString(),
      };

      onAddKnowledge(newItem);
      soundFx.playTacticalPing();
    } catch (err) {
      console.error('Error indexing memory:', err);
      // Fallback
      const newItem: KnowledgeItem = {
        id: `mem_${Date.now()}`,
        title: itemTitle,
        category: cat,
        content: rawContent,
        summary: rawContent.slice(0, 120),
        createdAt: new Date().toLocaleDateString(),
      };
      onAddKnowledge(newItem);
    } finally {
      setIsProcessing(false);
      setShowAddModal(false);
      setTitle('');
      setContent('');
    }
  };

  // Quick Preset Memory Packs
  const handleLoadPresetPack = (pack: 'family' | 'work' | 'medical') => {
    if (pack === 'family') {
      processAndSaveKnowledge(
        'Datos Clave de Familia y Pareja',
        'Mi pareja y yo vivimos en la colonia Condesa. Nuestro aniversario es el 14 de febrero. A mi pareja le encanta el sushi, el chocolate amargo y las flores amarillas. Nuestra perrita se llama Luna y es alérgica al pollo. Clave del portón de la casa: #4590. WiFi casa: "CyberChappie_5G" (clave: Chappie2026!).',
        'Familia'
      );
    } else if (pack === 'work') {
      processAndSaveKnowledge(
        'Proyecto y Operaciones de Trabajo',
        'Empresa: Tetravaal Robotics Systems. Jefa de operaciones: Sofia Mendoza. Horario de entregas: Viernes a las 3:00 PM. Servidor de pruebas: 192.168.1.100 puerto 8080. Si llama Carlos Mendoza es urgente sobre entregas a clientes.',
        'Trabajo'
      );
    } else {
      processAndSaveKnowledge(
        'Perfil Médico y Emergencias',
        'Tipo de sangre: O positivo. Alergia a la penicilina y sulfas. Médico de cabecera: Dr. Roberto Torres (+52 55 4433 2211). Seguro de gastos médicos mayores: AXA Póliza #9921-344. Hospital de preferencia: Hospital Ángeles México.',
        'Salud'
      );
    }
  };

  const filtered = knowledge.filter((item) => {
    const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.content.toLowerCase().includes(search.toLowerCase()) ||
      (item.summary && item.summary.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-4">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,.json,.md,.csv"
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* Header & Memory Metrics */}
      <div className="p-4 rounded-xl border border-zinc-800 bg-[#0e111a] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-tech text-base font-bold text-white tracking-wide flex items-center gap-2">
              NÚCLEO DE MEMORIA NEURONAL
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-amber-400 border border-zinc-700">
                {knowledge.length} Registros Cargados
              </span>
            </h3>
            <p className="text-xs text-zinc-400">
              Cárgale toda la información que quieras a tu asistente: datos personales, pareja, claves, trabajo y rutinas.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 font-mono text-xs transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-amber-400" />
            <span>Subir Archivo (.txt, .json)</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-tech font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Cargar Texto</span>
          </button>
        </div>
      </div>

      {/* QUICK PRESET KNOWLEDGE PACKS */}
      <div className="p-3.5 rounded-xl border border-zinc-800 bg-[#0c0f17] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-zinc-400 font-tech">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>CARGAR PAQUETES DE INFORMACIÓN RÁPIDOS:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleLoadPresetPack('family')}
            className="px-2.5 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 font-mono transition-colors cursor-pointer"
          >
            ❤️ Pack Familia & Pareja
          </button>
          <button
            onClick={() => handleLoadPresetPack('work')}
            className="px-2.5 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 font-mono transition-colors cursor-pointer"
          >
            💼 Pack Trabajo & Servidores
          </button>
          <button
            onClick={() => handleLoadPresetPack('medical')}
            className="px-2.5 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 font-mono transition-colors cursor-pointer"
          >
            🏥 Pack Médico & Emergencias
          </button>
        </div>
      </div>

      {/* SEARCH & CATEGORY FILTER BAR */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar en la memoria cargada..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white font-mono focus:border-amber-500 outline-none"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1 p-1 bg-zinc-900 border border-zinc-800 rounded-lg overflow-x-auto text-xs font-mono">
          {['all', 'Familia', 'Trabajo', 'Salud', 'Finanzas', 'Claves'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded whitespace-nowrap transition-colors ${
                selectedCategory === cat ? 'bg-amber-500 text-black font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              {cat === 'all' ? 'Todos' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* KNOWLEDGE CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-2 p-8 text-center text-zinc-500 font-mono text-sm border border-zinc-800/80 rounded-xl bg-zinc-950/40">
            No hay información con ese criterio de búsqueda. Carga datos arriba.
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl border border-zinc-800 bg-[#0b0e17] hover:border-zinc-700 transition-all flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-amber-400 border border-zinc-700 uppercase">
                      {item.category}
                    </span>
                    <h4 className="font-bold text-white text-base mt-1.5">{item.title}</h4>
                  </div>
                  <button
                    onClick={() => onDeleteKnowledge(item.id)}
                    className="p-1 rounded text-zinc-500 hover:text-rose-400 hover:bg-zinc-800 transition-colors cursor-pointer"
                    title="Eliminar de la memoria"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {item.summary && (
                  <div className="p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800/80 text-xs font-mono text-zinc-300 mt-2">
                    <span className="text-amber-500 font-bold">Resumen Indexado: </span>
                    {item.summary}
                  </div>
                )}

                <p className="text-xs text-zinc-400 font-mono line-clamp-3 mt-2 leading-relaxed">
                  {item.content}
                </p>

                {item.keyEntities && item.keyEntities.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {item.keyEntities.map((ent, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400"
                      >
                        {ent}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80 text-xs font-mono">
                <span className="text-[10px] text-zinc-500">Cargado: {item.createdAt}</span>
                <button
                  onClick={() => onAskAboutKnowledge(`Dime todo lo que sabes sobre ${item.title}`)}
                  className="text-amber-400 hover:text-amber-300 flex items-center gap-1 font-tech uppercase tracking-wider cursor-pointer"
                >
                  <Brain className="w-3.5 h-3.5" />
                  <span>Consultar</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL: ADD CUSTOM BULK KNOWLEDGE */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-zinc-700 bg-[#111420] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-amber-500" />
                <h4 className="font-tech text-lg text-white font-bold tracking-wide">
                  CARGAR INFORMACIÓN AL ASISTENTE
                </h4>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-zinc-400 hover:text-white text-xs font-mono"
              >
                [CERRAR]
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-mono text-zinc-400 block mb-1">Título del registro:</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej. Instrucciones del departamento y clave de alarma"
                  className="w-full p-2 rounded bg-zinc-900 border border-zinc-700 text-sm text-white font-mono focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-zinc-400 block mb-1">Categoría:</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full p-2 rounded bg-zinc-900 border border-zinc-700 text-sm text-white font-mono focus:border-amber-500 outline-none"
                >
                  <option value="Familia">Familia & Pareja</option>
                  <option value="Trabajo">Trabajo & Proyectos</option>
                  <option value="Salud">Salud & Médico</option>
                  <option value="Finanzas">Finanzas & Banco</option>
                  <option value="Claves">Claves & Códigos</option>
                  <option value="Rutina">Rutina Diaria</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-mono text-zinc-400 block mb-1">
                  Contenido extenso (pega aquí todo el texto):
                </label>
                <textarea
                  rows={6}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Pega notas, listas, contraseñas, horarios, gustos de tu pareja, instrucciones..."
                  className="w-full p-2.5 rounded bg-zinc-900 border border-zinc-700 text-sm text-white font-mono focus:border-amber-500 outline-none resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-xs font-mono text-zinc-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={isProcessing || !content.trim()}
                onClick={() => processAndSaveKnowledge(title || 'Memoria Personal', content, category)}
                className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-tech font-bold text-xs uppercase tracking-wider disabled:opacity-50"
              >
                {isProcessing ? 'Indexando con IA...' : 'Indexar en Memoria'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
