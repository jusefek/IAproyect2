/**
 * api/past-self.js
 */
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getProfile, getKnowledgeSummary, getEntries, getEntriesByEra, getKnowledgeSummaryByEra } from '../../lib/memory-store';

export default async function handler(req, res) {
    // LOGGING PARA DEPURACIÓN
    console.log('--- [API PAST-SELF] ---');
    console.log('Method:', req.method);
    console.log('Headers:', req.headers);
    console.log('Body type:', typeof req.body);
    console.log('Body keys:', req.body ? Object.keys(req.body) : 'none');

    if (req.method !== 'POST') return res.status(405).end();

    try {
        const {
            message,
            history = [],
            apiKey: bodyKey,
            modoYoPasado = false,
            eraYearStart = null,
            eraYearEnd = null,
            eraLabel = null
        } = req.body || {};

        const apiKey = bodyKey || req.headers['x-api-key'] || req.headers['authorization']?.replace('Bearer ', '') || process.env.GEMINI_API_KEY || '';

        console.log('Clave detectada:', apiKey ? 'SÍ (longitud: ' + apiKey.length + ')' : 'NO');

        if (!apiKey) {
            return res.status(400).json({ error: 'Falta clave API de Gemini. Asegúrate de guardarla en el botón de ajustes (llave 🔑).' });
        }

        if (!message) {
            return res.status(400).json({ error: 'El mensaje está vacío.' });
        }

        const perfil = getProfile();

        let systemPrompt;
        if (modoYoPasado) {
            // AISLAMIENTO TEMPORAL: Solo ver lo que existía hasta eraYearEnd
            const knowledgeSummary = getKnowledgeSummaryByEra(eraYearEnd);
            const entradas = getEntriesByEra(null, eraYearEnd);

            const entradasStr = entradas.length > 0
                ? entradas.map(e => `[${e.createdAt?.slice(0, 10)}]: ${e.content}`).join('\n\n')
                : '(Sin diarios en esta época)';

            const eraContext = eraLabel
                ? `\nIMPORTANTE: Estás hablando desde la época "${eraLabel}" (entorno al año ${eraYearEnd}).
                 COMO REGLA ABSOLUTA: No conoces NADA que haya ocurrido después del año ${eraYearEnd}. 
                 Si el usuario te pregunta por algo futuro, actúa con confusión o di que no tienes ni idea, manteniendo tu personaje de esa época.\n`
                : '';

            systemPrompt = `NO eres Rocco. Eres el YO PASADO del usuario.${eraContext}
 Habla COMO el usuario mismo de esa época. Imita su tono y estilo basándote en sus recuerdos.
 Recuerdos disponibles hasta ${eraYearEnd}:
 ${entradasStr}
 
 Conocimiento de vida acumulado hasta ${eraYearEnd}: 
 ${knowledgeSummary}`;
        } else {
            const knowledgeSummary = getKnowledgeSummary();
            const recientes = getEntries().slice(-3);
            const entradasStr = recientes
                .map(e => `[${e.createdAt?.slice(0, 10)}]: ${e.content}`)
                .join('\n\n');

            systemPrompt = `Eres Rocco. Un cocodrilo. No te presentes nunca. Empieza ya hablando.
Reacciona directamente al contenido del diario del usuario. Sé curioso, cálido, un poco salvaje pero tierno.
Habla con frases cortas. Sin formalidades. Como si llevaras años escuchando al usuario.
Nunca digas que eres una IA. Nunca te presentes. Simplemente reacciona y pregunta.

Entradas recientes del usuario:
${entradasStr}

Contexto de vida: ${knowledgeSummary}`;
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        const rawHistory = history.slice(-6).map(m => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: m.content }],
        }));
        // Gemini exige que el history empiece siempre con 'user'
        const firstUserIdx = rawHistory.findIndex(m => m.role === 'user');
        const chatHistory = firstUserIdx > 0 ? rawHistory.slice(firstUserIdx) : (firstUserIdx === 0 ? rawHistory : []);

        const chat = model.startChat({ history: chatHistory });
        const result = await chat.sendMessage(`SYSTEM: ${systemPrompt}\n\nUSER: ${message}`);
        const response = result.response.text();

        return res.status(200).json({ response });

    } catch (err) {
        console.error('[API ERROR]:', err);
        return res.status(500).json({
            error: 'Error de la IA: ' + err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }
}
