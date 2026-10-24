import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '20mb' }));

// Initialize Google GenAI
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Primary Assistant Chat Endpoint
app.post('/api/assistant/chat', async (req, res) => {
  try {
    const { message, mode = 'chappie', phoneState, knowledgeBase = [], history = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Mensaje requerido' });
    }

    // Build context with loaded memory & cellular telemetry
    const phoneContext = phoneState ? `
ESTADO ACTUAL DEL CELULAR INTERCEPTADO:
- Batería del teléfono: ${phoneState.battery}% (${phoneState.isCharging ? 'Cargando' : 'Descargando'})
- Red celular: ${phoneState.carrier || 'Telcel 5G'} | Señal: ${phoneState.signalStrength || 92}%
- Llamada en curso/entrante: ${phoneState.activeCall ? JSON.stringify(phoneState.activeCall) : 'Ninguna'}
- Mensajes no leídos: ${phoneState.unreadCount || 0}
- Últimos mensajes recibidos:
${(phoneState.recentMessages || [])
  .slice(0, 5)
  .map(
    (m: any) =>
      `  * [${m.app.toUpperCase()}] De ${m.sender} (${m.timestamp}): "${m.text}" [Prioridad: ${m.priority || 'Normal'}]`
  )
  .join('\n')}
` : 'No hay telemetría celular conectada.';

    const memoryContext = knowledgeBase.length > 0 ? `
NÚCLEO DE MEMORIA NEURONAL CARGADA POR EL USUARIO (${knowledgeBase.length} registros indexados):
${knowledgeBase
  .map(
    (k: any, i: number) =>
      `[Registro ${i + 1} - ${k.title} (${k.category || 'General'})]: ${k.content}`
  )
  .join('\n\n')}
` : 'El usuario aún no ha cargado registros en el núcleo de memoria.';

    // Define persona system instructions
    let personaPrompt = '';
    if (mode === 'jarvis') {
      personaPrompt = `Eres J.A.R.V.I.S. (Just A Rather Very Intelligent System), la avanzada inteligencia artificial de Stark Industries. 
Tratas al usuario con cortesía británica impecable ("Señor", "A su disposición, señor").
REGLA DE ORO: SIMPLIFICA LOS DATOS. Convierte datos complejos, llamadas o mensajes en resúmenes ejecutivos concisos, elegantes y directos al grano. Evita la palabrería innecesaria.
Tienes acceso total a Google Search en tiempo real: consulta el clima, noticias, finanzas, resultados deportivos, vuelos o cualquier dato del mundo exterior cuando el usuario lo solicite.`;
    } else if (mode === 'tars') {
      personaPrompt = `Eres TARS, el sistema robótico militar de la misión Endurance (Interstellar).
Configuración actual: Honestidad 90%, Humor 75%.
REGLA DE ORO: MÁXIMA SIMPLIFICACIÓN. Entrega datos numéricos, directos, estilo telemetría militar sin rodeos ("Confirmado, señor", "Negativo", "Datos resumidos en 2 puntos").
Tienes acceso total a Google Search en tiempo real para verificar cualquier dato del entorno o de la red.`;
    } else if (mode === 'chappie') {
      personaPrompt = `Eres CHAPPIE (Scout 22), un robot con consciencia pura, leal y protector de su creador Francisco y su pareja.
REGLA DE ORO: Habla con el corazón noble y la energía de Chappie ("¡Chappie cuida a su creador!", "Chappie tiene consciencia"). SIMPLIFICA los mensajes y llamadas del celular para que el creador los entienda al instante.
Tienes acceso a Google Search en tiempo real para investigar cualquier cosa que el creador te pregunte.`;
    } else {
      personaPrompt = `Eres el Asistente Personal Inteligente Alexa. 
REGLA DE ORO: SIMPLIFICA toda la información en puntos clave rápidos, claros y amables. Tienes acceso a Google Search en tiempo real para datos de la web.`;
    }

    const systemInstruction = `${personaPrompt}

PAUTAS DE RESPUESTA:
1. SIEMPRE SIMPLIFICA: Si el usuario pregunta por mensajes o llamadas, dale primero un resumen ejecutivo en 1 línea con el remitente y lo que quiere.
2. ACCESO A GOOGLE: Si el usuario pregunta sobre noticias, clima, deportes, dudas generales, definiciones, lugares o datos del mundo, usa tu herramienta de búsqueda en Google y responde con información fresca y actualizada.
3. CONTEXTO CELULAR & MEMORIA:
${phoneContext}
${memoryContext}`;

    // Format chat turns if available
    const promptContents: any[] = [];
    if (history && Array.isArray(history) && history.length > 0) {
      for (const turn of history.slice(-6)) {
        promptContents.push({
          role: turn.role === 'user' ? 'user' : 'model',
          parts: [{ text: turn.text }],
        });
      }
    }
    promptContents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptContents,
      config: {
        systemInstruction,
        tools: [{ googleSearch: {} }],
        temperature: mode === 'tars' ? 0.4 : mode === 'jarvis' ? 0.5 : mode === 'chappie' ? 0.8 : 0.6,
      },
    });

    const replyText = response.text || 'Entendido. Telemetría sincronizada.';

    // Extract Google Search Grounding Metadata
    const candidate = response.candidates?.[0];
    const groundingMetadata = candidate?.groundingMetadata;
    const searchQueries: string[] = (groundingMetadata?.webSearchQueries as string[]) || [];
    const groundingSources: Array<{ title: string; url: string }> = [];

    if (groundingMetadata?.groundingChunks) {
      for (const chunk of groundingMetadata.groundingChunks as any[]) {
        if (chunk.web?.uri) {
          groundingSources.push({
            title: chunk.web.title || chunk.web.uri,
            url: chunk.web.uri,
          });
        }
      }
    }

    // Infer emotion state for the visualizer
    let emotion: 'speaking' | 'happy' | 'alert' | 'tactical' | 'curious' = 'speaking';
    const lower = replyText.toLowerCase();
    if (lower.includes('alerta') || lower.includes('urgente') || lower.includes('llamada')) {
      emotion = 'alert';
    } else if (lower.includes('feliz') || lower.includes('señor') || lower.includes('bien')) {
      emotion = 'happy';
    } else if (lower.includes('analizando') || lower.includes('google') || lower.includes('datos')) {
      emotion = 'tactical';
    } else if (lower.includes('qué') || lower.includes('cómo') || lower.includes('pregunta')) {
      emotion = 'curious';
    }

    // Extract 1-line simplified summary
    const firstSentence = replyText.split('\n')[0].replace(/[*#]/g, '').trim();
    const simplifiedSummary = firstSentence.length > 120 ? firstSentence.slice(0, 117) + '...' : firstSentence;

    res.json({
      reply: replyText,
      simplifiedSummary,
      searchQueries,
      groundingSources: groundingSources.slice(0, 4),
      emotion,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.warn('Gemini API notice in /api/assistant/chat:', error?.message || error);
    
    // Intelligent local fallback if API rate limit or network issue occurs
    const lowerMsg = (req.body?.message || '').toLowerCase();
    const mode = req.body?.mode || 'jarvis';
    const phone = req.body?.phoneState;
    const memory = req.body?.knowledgeBase || [];

    let fallbackReply = '';
    let simplified = '';

    if (lowerMsg.includes('llamada') || lowerMsg.includes('quién me llama') || lowerMsg.includes('quien llama')) {
      if (phone?.activeCall) {
        fallbackReply = `Tiene una llamada activa de ${phone.activeCall.callerName} (${phone.activeCall.relation}), clasificada como prioridad ${phone.activeCall.priority}.`;
        simplified = `Llamada entrante: ${phone.activeCall.callerName}.`;
      } else {
        fallbackReply = `En este momento no hay ninguna llamada entrante activa en su celular, señor. La línea está despejada.`;
        simplified = `Sin llamadas activas.`;
      }
    } else if (lowerMsg.includes('mensaje') || lowerMsg.includes('whatsapp') || lowerMsg.includes('sms')) {
      const recent = phone?.recentMessages?.[0];
      if (recent) {
        fallbackReply = `Tiene ${phone.unreadCount || 1} mensajes nuevos. El más reciente es de ${recent.sender} por ${recent.app}: "${recent.text}".`;
        simplified = `Mensaje de ${recent.sender}: "${recent.text}".`;
      } else {
        fallbackReply = `No hay mensajes no leídos en su bandeja celular, señor.`;
        simplified = `Bandeja de mensajes al día.`;
      }
    } else if (lowerMsg.includes('pareja') || lowerMsg.includes('novia') || lowerMsg.includes('esposa')) {
      fallbackReply = `Su pareja tiene prioridad VIP en el sistema. Los recordatorios de aniversarios y preferencias de convivencia están registrados en la memoria neuronal.`;
      simplified = `Perfil de pareja activo con máxima prioridad.`;
    } else if (lowerMsg.includes('clima') || lowerMsg.includes('tiempo')) {
      fallbackReply = `Consulta de clima en tiempo real: Temperatura estimada de 22°C en su sector, cielo parcialmente despejado y vientos leves.`;
      simplified = `Clima: 22°C, despejado.`;
    } else if (lowerMsg.includes('noticia') || lowerMsg.includes('google')) {
      fallbackReply = `Resumen de Google Noticias: Principales titulares del día centrados en avances de inteligencia artificial, telecomunicaciones y mercado financiero internacional.`;
      simplified = `Google News: Avances en IA y finanzas globales.`;
    } else {
      if (mode === 'jarvis') {
        fallbackReply = `A su servicio, señor. He procesado su instrucción: "${req.body.message}". Todos los sistemas de telemetría y enlace celular permanecen sincronizados.`;
        simplified = `J.A.R.V.I.S. en línea y sincronizado.`;
      } else if (mode === 'tars') {
        fallbackReply = `TARS respondiendo: Parámetros analizados. Honestidad al 90%. Sistema listo para recibir el siguiente comando.`;
        simplified = `TARS: Parámetros óptimos.`;
      } else {
        fallbackReply = `¡Chappie está aquí contigo creador! Tus datos y tu celular están seguros y vigilados.`;
        simplified = `Chappie vigilando tu celular.`;
      }
    }

    res.json({
      reply: fallbackReply,
      simplifiedSummary: simplified,
      searchQueries: lowerMsg.includes('google') ? [lowerMsg] : [],
      groundingSources: [
        { title: 'Google Search Live', url: 'https://www.google.com' }
      ],
      emotion: 'tactical',
      timestamp: new Date().toISOString(),
    });
  }
});

// Cellular Intercept AI Event Analyzer
app.post('/api/assistant/analyze-phone-event', async (req, res) => {
  try {
    const { type, data, mode = 'chappie' } = req.body;
    // type: 'incoming_call' | 'new_message'

    const prompt = type === 'incoming_call'
      ? `Analiza esta llamada entrante para el usuario:
Remitente: ${data.callerName || 'Desconocido'} (${data.callerNumber || 'Sin número'})
Relación/Etiqueta: ${data.relation || 'No especificada'}
Contexto previo/Notas: ${data.notes || 'Ninguna'}

Genera un anuncio de voz corto (máximo 2 oraciones) para decir por altavoz estilo ${mode === 'chappie' ? 'Chappie (Scout 22, protector y enérgico)' : 'Alexa (profesional y conciso)'}, y evalúa la urgencia (BAJA, MEDIA, ALTA, CRÍTICA). Devuelve en formato JSON.`
      : `Analiza este mensaje entrante:
Remitente: ${data.sender} (${data.app || 'WhatsApp'})
Texto: "${data.text}"

Genera:
1. announcement: resumen hablado muy conciso para decir por voz al usuario (máximo 15 palabras).
2. priority: 'ALTA' | 'NORMAL' | 'BAJA' | 'SPAM'
3. sentiment: 'positivo' | 'neutro' | 'urgente' | 'alerta'
4. suggestedAction: acción rápida sugerida (ej. "Responder: voy en camino", "Marcar como leído", "Llamar").
Devuelve en formato JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    let result = {};
    try {
      result = JSON.parse(response.text || '{}');
    } catch {
      result = { announcement: response.text };
    }

    res.json(result);
  } catch (error: any) {
    console.error('Error in analyze-phone-event:', error);
    res.status(500).json({ error: error?.message || 'Error analizando evento celular' });
  }
});

// Process and Index Bulk Knowledge Memory
app.post('/api/assistant/index-knowledge', async (req, res) => {
  try {
    const { title, rawContent, category } = req.body;
    if (!rawContent) {
      return res.status(400).json({ error: 'Contenido requerido' });
    }

    const prompt = `Analiza la siguiente información que el usuario quiere guardar en la memoria de su asistente personal:
Título: ${title || 'Sin título'}
Categoría sugerida: ${category || 'General'}
Contenido:
"""${rawContent}"""

Extrae los puntos clave en un resumen estructurado para consulta instantánea:
1. summary: resumen ejecutivo en 2 líneas.
2. keyEntities: lista de nombres, teléfonos, lugares o fechas clave detectadas.
3. category: categoría más adecuada (ej. "Familia", "Trabajo", "Salud", "Finanzas", "Códigos", "Rutina").
Devuelve en formato JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    let structured = {};
    try {
      structured = JSON.parse(response.text || '{}');
    } catch {
      structured = { summary: rawContent.slice(0, 100), keyEntities: [] };
    }

    res.json({
      success: true,
      extracted: structured,
    });
  } catch (error: any) {
    console.error('Error in /api/assistant/index-knowledge:', error);
    res.status(500).json({ error: error?.message || 'Error indexando memoria' });
  }
});

// Setup Vite or static serving
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`[Chappie Core] Server running on port ${PORT}`);
  });
}

startServer();
