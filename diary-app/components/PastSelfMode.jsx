import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Config por era: cada época tiene su propio avatar y paleta ─────────────
const ERAS = [
    {
        id: 'all', label: 'Toda mi vida', start: null, end: null,
        icon: '🌈', avatar: '🧑', avatarBg: 'linear-gradient(135deg,#7b5ea7,#4a3570)',
        ring: '#9b7fd4', bubble: 'linear-gradient(145deg,#f5f0ff,#ede6ff)',
        bubbleBorder: '#c5b3f0', textColor: '#2d1d5a',
        description: 'Todos tus recuerdos',
    },
    {
        id: '2010', label: 'Juventud (2010)', start: 2010, end: 2010,
        icon: '🎓', avatar: '🧒', avatarBg: 'linear-gradient(135deg,#3a8fd4,#1a5fa0)',
        ring: '#6ab3e8', bubble: 'linear-gradient(145deg,#f0f7ff,#e3f0ff)',
        bubbleBorder: '#aacdf0', textColor: '#0d2d50',
        description: 'Tú, joven y curioso',
    },
    {
        id: '2015', label: 'Ámsterdam (2015)', start: 2015, end: 2015,
        icon: '🌷', avatar: '🧑‍🎨', avatarBg: 'linear-gradient(135deg,#d44a8a,#9c2060)',
        ring: '#f08abd', bubble: 'linear-gradient(145deg,#fff0f8,#fce3f0)',
        bubbleBorder: '#f0aad0', textColor: '#4a0a28',
        description: 'Tu era más creativa',
    },
    {
        id: '2020', label: 'Confinamiento (2020)', start: 2020, end: 2020,
        icon: '🏠', avatar: '🧘', avatarBg: 'linear-gradient(135deg,#5a8a6a,#2d5a3a)',
        ring: '#8abf9a', bubble: 'linear-gradient(145deg,#f0f8f2,#e3f2e8)',
        bubbleBorder: '#aad0b8', textColor: '#102818',
        description: 'Quietud y reflexión',
    },
    {
        id: '2026', label: 'Valencia Hoy (2026)', start: 2026, end: 2026,
        icon: '☀️', avatar: '🧑‍💻', avatarBg: 'linear-gradient(135deg,#d4842a,#a05010)',
        ring: '#e8a860', bubble: 'linear-gradient(145deg,#fff8f0,#fdf0e0)',
        bubbleBorder: '#e8c890', textColor: '#3a1a00',
        description: 'Quién eres ahora',
    },
];

// ── Animate breathe for Rocco ──────────────────────────────────────────────
const breatheVariants = {
    idle: { scale: [1, 1.05, 1], transition: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' } },
    loading: {
        scale: [1, 1.15, 0.92, 1.1, 1],
        y: [0, -8, 0, -5, 0],
        rotate: [0, -3, 3, -2, 0],
        transition: { duration: 0.65, repeat: Infinity },
    },
};

// ── Rocco Avatar ───────────────────────────────────────────────────────────
function RoccoAvatar({ isLoading, size = 64 }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            <motion.div
                variants={breatheVariants}
                animate={isLoading ? 'loading' : 'idle'}
                style={{
                    width: size, height: size, borderRadius: '50%',
                    overflow: 'hidden',
                    border: `3px solid ${isLoading ? '#4daa60' : '#3a8f50'}`,
                    boxShadow: `0 0 0 3px rgba(74,185,100,0.2), 0 6px 24px rgba(40,120,60,0.4)`,
                    background: '#1a3a22',
                    flexShrink: 0,
                    position: 'relative',
                }}
            >
                <img src="/rocco.png" alt="Rocco" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={e => { e.target.style.display = 'none'; e.target.parentNode.innerHTML = '<span style="font-size:2rem;display:flex;align-items:center;justify-content:center;width:100%;height:100%">🐊</span>'; }}
                />
            </motion.div>
            {size >= 48 && (
                <span style={{ fontFamily: 'Caveat, cursive', fontSize: '0.8rem', color: '#4daa60', fontWeight: 700, letterSpacing: '0.05em' }}>
                    Rocco
                </span>
            )}
        </div>
    );
}

// ── Era Avatar (Mi Yo Pasado) ──────────────────────────────────────────────
function EraAvatar({ era, isLoading, size = 64 }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            <motion.div
                animate={isLoading
                    ? { scale: [1, 1.1, 0.95, 1.08, 1], rotate: [0, -2, 2, -1, 0] }
                    : { scale: 1 }
                }
                transition={isLoading ? { duration: 0.8, repeat: Infinity } : {}}
                style={{
                    width: size, height: size, borderRadius: '50%',
                    background: era.avatarBg,
                    boxShadow: `0 0 0 3px ${era.ring}55, 0 6px 24px ${era.ring}44`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                    fontSize: size > 50 ? '2rem' : '1.2rem',
                    border: `3px solid ${era.ring}`,
                }}
            >
                {era.avatar}
            </motion.div>
            {size >= 48 && (
                <span style={{ fontFamily: 'Caveat, cursive', fontSize: '0.75rem', color: era.ring, fontWeight: 700, textAlign: 'center', maxWidth: '80px', lineHeight: 1.2 }}>
                    {era.icon} {era.label.split('(')[0].trim()}
                </span>
            )}
        </div>
    );
}

// ── Chat Bubble ────────────────────────────────────────────────────────────
function Burbuja({ msg, modoYoPasado, eraActiva }) {
    const esIA = msg.role === 'assistant';

    if (esIA && modoYoPasado) {
        return (
            <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '20px', gap: '10px', alignItems: 'flex-end' }}
            >
                <div style={{
                    width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                    background: eraActiva.avatarBg,
                    border: `2px solid ${eraActiva.ring}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.1rem',
                    boxShadow: `0 2px 10px ${eraActiva.ring}44`,
                }}>
                    {eraActiva.avatar}
                </div>
                <div style={{
                    maxWidth: '72%',
                    background: eraActiva.bubble,
                    border: `1px solid ${eraActiva.bubbleBorder}`,
                    borderLeft: `3px solid ${eraActiva.ring}`,
                    borderRadius: '4px 18px 18px 4px',
                    padding: '14px 18px',
                    boxShadow: `0 3px 16px rgba(0,0,0,0.07)`,
                }}>
                    <p style={{
                        fontFamily: 'Playfair Display, Georgia, serif',
                        fontStyle: 'italic',
                        fontSize: '1.05rem',
                        lineHeight: 1.65,
                        color: eraActiva.textColor,
                        margin: 0,
                    }}>
                        {msg.content}
                    </p>
                </div>
            </motion.div>
        );
    }

    if (esIA && !modoYoPasado) {
        return (
            <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '20px', gap: '10px', alignItems: 'flex-end' }}
            >
                <div style={{
                    width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                    overflow: 'hidden', border: '2px solid #3a8f50',
                    background: '#1a3a22',
                    boxShadow: '0 2px 10px rgba(40,120,60,0.35)',
                }}>
                    <img src="/rocco.png" alt="Rocco" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={e => { e.target.style.display = 'none'; e.target.parentNode.innerHTML = '<span style="font-size:1.2rem;display:flex;align-items:center;justify-content:center;width:100%;height:100%">🐊</span>'; }}
                    />
                </div>
                <div style={{
                    maxWidth: '72%',
                    background: 'linear-gradient(145deg, rgba(255,255,255,0.15), rgba(255,255,255,0.08))',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(74,185,100,0.25)',
                    borderLeft: '3px solid #4daa60',
                    borderRadius: '4px 18px 18px 4px',
                    padding: '14px 18px',
                    boxShadow: '0 3px 20px rgba(0,0,0,0.2)',
                }}>
                    <p style={{
                        fontFamily: 'Caveat, cursive',
                        fontSize: '1.2rem',
                        lineHeight: 1.55,
                        color: '#e8f5e8',
                        margin: 0,
                    }}>
                        {msg.content}
                    </p>
                </div>
            </motion.div>
        );
    }

    // Usuario
    return (
        <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', gap: '10px', marginBottom: '20px' }}
        >
            <div style={{
                maxWidth: '72%',
                background: modoYoPasado
                    ? `${eraActiva.avatarBg}`
                    : 'linear-gradient(135deg, #d4a045, #c8701a)',
                borderRadius: '18px 4px 18px 18px',
                padding: '12px 18px',
                boxShadow: modoYoPasado
                    ? `0 4px 18px ${eraActiva.ring}55`
                    : '0 4px 18px rgba(200,113,26,0.4)',
            }}>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.95rem', lineHeight: 1.55, color: '#fff', margin: 0 }}>
                    {msg.content}
                </p>
            </div>
            <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: modoYoPasado ? eraActiva.avatarBg : 'linear-gradient(135deg,#d4a045,#8a5e1a)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1rem', flexShrink: 0,
                border: `2px solid ${modoYoPasado ? eraActiva.ring : '#d4a045'}`,
                boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
            }}>
                🧑
            </div>
        </motion.div>
    );
}

// ── Typing indicator ───────────────────────────────────────────────────────
function TypingIndicator({ modoYoPasado, eraActiva }) {
    const color = modoYoPasado ? eraActiva.ring : '#4daa60';
    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}
        >
            <div style={{
                width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                background: modoYoPasado ? eraActiva.avatarBg : '#1a3a22',
                border: `2px solid ${color}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1rem',
                overflow: modoYoPasado ? 'visible' : 'hidden',
            }}>
                {modoYoPasado ? eraActiva.avatar : (
                    <img src="/rocco.png" alt="Rocco" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={e => { e.target.style.display = 'none'; e.target.parentNode.innerHTML = '🐊'; }}
                    />
                )}
            </div>
            <div style={{
                background: modoYoPasado
                    ? `${eraActiva.bubble}`
                    : 'rgba(255,255,255,0.12)',
                backdropFilter: 'blur(8px)',
                border: `1px solid ${color}33`,
                borderRadius: '20px',
                padding: '10px 18px',
                display: 'flex', gap: '6px', alignItems: 'center',
            }}>
                {[0, 1, 2].map(i => (
                    <motion.span
                        key={i}
                        animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.18 }}
                        style={{ fontSize: '0.85rem', color }}
                    >●</motion.span>
                ))}
            </div>
        </motion.div>
    );
}

// ── Main component ─────────────────────────────────────────────────────────
export default function PastSelfMode({ entradaGuardada, perfil, onVolver, modoYoPasado = false }) {
    const [mensajes, setMensajes] = useState([]);
    const [input, setInput] = useState('');
    const [cargando, setCargando] = useState(false);
    const [iaEscribe, setIaEscribe] = useState(false);
    const [eraActiva, setEraActiva] = useState(ERAS[0]);
    const [error, setError] = useState('');
    const bottomRef = useRef(null);
    const inputRef = useRef(null);

    const hoy = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });

    // ── Theming ──────────────────────────────────────────────────────────
    const roccoTheme = {
        bg: 'linear-gradient(160deg, #0d1a0f 0%, #132218 40%, #0a1a0e 100%)',
        headerBg: 'rgba(10,30,14,0.75)',
        headerBorder: 'rgba(74,185,100,0.2)',
        inputBg: 'rgba(255,255,255,0.07)',
        inputBorder: 'rgba(74,185,100,0.25)',
        accentColor: '#4daa60',
        sendBg: 'linear-gradient(135deg,#3a8f50,#2a6a38)',
    };
    const pastTheme = {
        bg: 'linear-gradient(160deg, #fdf8f0 0%, #f5ecda 50%, #ede0c4 100%)',
        headerBg: 'rgba(255,252,245,0.8)',
        headerBorder: eraActiva.bubbleBorder,
        inputBg: 'rgba(255,255,255,0.75)',
        inputBorder: eraActiva.bubbleBorder,
        accentColor: eraActiva.ring,
        sendBg: eraActiva.avatarBg,
    };
    const theme = modoYoPasado ? pastTheme : roccoTheme;

    const llamarApi = useCallback(async (message, history) => {
        const apiKey = localStorage.getItem('gemini_api_key') || '';
        if (!apiKey) throw new Error('NO_API_KEY');
        const res = await fetch('/api/past-self', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, history, apiKey, modoYoPasado, eraYearStart: eraActiva.start, eraYearEnd: eraActiva.end, eraLabel: eraActiva.label }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Error del servidor');
        return data.response || '…';
    }, [modoYoPasado, eraActiva]);

    const iniciarConversacion = useCallback(async (entrada) => {
        const msgInicio = modoYoPasado
            ? `El usuario quiere hablar con su yo pasado de la época ${eraActiva.label}. Habla en primera persona, como si fueras ese yo de entonces. Sin presentaciones formales, simplemente empieza a recordar algo de esa época y pregunta qué quiere explorar.`
            : entrada
                ? `Reacciona a esto que acabo de escribir en mi diario: "${entrada.content.slice(0, 300)}". Reacciona directamente. Sin presentarte. Sin formalismos.`
                : 'Hola. Aquí estoy. Cuéntame algo.';

        setMensajes([]); setError(''); setCargando(true); setIaEscribe(true);
        try {
            const respuesta = await llamarApi(msgInicio, []);
            setMensajes([{ role: 'assistant', content: respuesta }]);
        } catch (err) {
            setError(err.message === 'NO_API_KEY'
                ? '⚠️ Añade tu clave API de Gemini con el botón 🔑 (abajo a la derecha).'
                : `⚠️ ${err.message || 'Error al conectar.'}`);
        } finally { setCargando(false); setIaEscribe(false); inputRef.current?.focus(); }
    }, [modoYoPasado, eraActiva, llamarApi]);

    useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [mensajes, iaEscribe]);
    useEffect(() => { iniciarConversacion(entradaGuardada); }, [modoYoPasado, eraActiva]);

    const enviarMensaje = async () => {
        const texto = input.trim();
        if (!texto || cargando) return;
        const nuevosMensajes = [...mensajes, { role: 'user', content: texto }];
        setMensajes(nuevosMensajes); setInput(''); setError('');
        setCargando(true); setIaEscribe(true);
        try {
            const respuesta = await llamarApi(texto, mensajes);
            setMensajes(prev => [...prev, { role: 'assistant', content: respuesta }]);
        } catch (err) {
            setMensajes(prev => [...prev, { role: 'assistant', content: err.message === 'NO_API_KEY' ? '⚠️ Clave API no configurada.' : `⚠️ ${err.message}` }]);
        } finally { setCargando(false); setIaEscribe(false); inputRef.current?.focus(); }
    };

    const handleKey = e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); enviarMensaje(); } };

    return (
        <div style={{ minHeight: 'calc(100vh - 57px)', display: 'flex', flexDirection: 'column', background: theme.bg, transition: 'background 0.5s' }}>

            {/* ── HERO HEADER ──────────────────────────────────────────── */}
            <header style={{
                padding: modoYoPasado ? '18px 24px' : '20px 24px',
                display: 'flex', alignItems: 'center', gap: '16px',
                borderBottom: `1px solid ${theme.headerBorder}`,
                background: theme.headerBg,
                backdropFilter: 'blur(16px)',
                position: 'sticky', top: 0, zIndex: 10,
            }}>
                {modoYoPasado
                    ? <EraAvatar era={eraActiva} isLoading={iaEscribe} size={56} />
                    : <RoccoAvatar isLoading={iaEscribe} size={56} />
                }
                <div style={{ flex: 1 }}>
                    <h2 style={{
                        fontFamily: 'Playfair Display, Georgia, serif',
                        fontSize: '1.2rem', fontWeight: 600,
                        color: modoYoPasado ? '#1a1208' : '#d4f0d4',
                        margin: 0, lineHeight: 1.2,
                    }}>
                        {modoYoPasado ? `${eraActiva.icon} ${eraActiva.label}` : '🐊 Charla con Rocco'}
                    </h2>
                    <p style={{
                        fontFamily: 'Inter, sans-serif', fontSize: '0.65rem',
                        color: modoYoPasado ? '#9a8060' : '#4daa6080',
                        textTransform: 'uppercase', letterSpacing: '0.14em',
                        margin: '3px 0 0',
                    }}>
                        {modoYoPasado ? eraActiva.description : hoy}
                    </p>
                </div>
                {/* Status chip */}
                <div style={{
                    fontFamily: 'Inter, sans-serif', fontSize: '0.68rem',
                    color: theme.accentColor,
                    background: `${theme.accentColor}18`,
                    border: `1px solid ${theme.accentColor}30`,
                    padding: '5px 12px', borderRadius: '999px',
                    letterSpacing: '0.03em',
                }}>
                    {modoYoPasado ? 'Voz de tu pasado' : 'IA · Charla libre'}
                </div>
            </header>

            {/* ── ERA SELECTOR (Mi Yo Pasado only) ─────────────────────── */}
            {modoYoPasado && (
                <div style={{
                    padding: '12px 24px',
                    background: 'rgba(255,255,255,0.5)',
                    backdropFilter: 'blur(8px)',
                    borderBottom: `1px solid ${eraActiva.bubbleBorder}`,
                    display: 'flex', gap: '10px', overflowX: 'auto',
                    scrollbarWidth: 'none',
                }}>
                    {ERAS.map(era => {
                        const active = eraActiva.id === era.id;
                        return (
                            <motion.button
                                key={era.id}
                                onClick={() => setEraActiva(era)}
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.94 }}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '8px',
                                    padding: '8px 14px', borderRadius: '999px',
                                    border: `1.5px solid ${active ? era.ring : '#d0c5ae'}`,
                                    background: active ? era.avatarBg : 'rgba(255,255,255,0.7)',
                                    color: active ? '#fff' : '#7a6840',
                                    fontFamily: 'Inter, sans-serif', fontSize: '0.78rem',
                                    cursor: 'pointer', whiteSpace: 'nowrap',
                                    boxShadow: active ? `0 3px 12px ${era.ring}55` : 'none',
                                    transition: 'all 0.22s',
                                }}
                            >
                                <span style={{ fontSize: '1.1rem' }}>{era.avatar}</span>
                                <span>{era.label}</span>
                            </motion.button>
                        );
                    })}
                </div>
            )}

            {/* ── CHAT AREA ────────────────────────────────────────────── */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '28px 20px' }}>
                <div style={{ maxWidth: '700px', margin: '0 auto' }}>

                    {/* Diary card for Rocco */}
                    {!modoYoPasado && entradaGuardada && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{
                                background: 'rgba(255,255,255,0.07)',
                                backdropFilter: 'blur(12px)',
                                border: '1px solid rgba(74,185,100,0.2)',
                                borderLeft: '3px solid #4daa60',
                                borderRadius: '4px 12px 12px 4px',
                                padding: '14px 18px', marginBottom: '28px',
                            }}
                        >
                            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.58rem', textTransform: 'uppercase', letterSpacing: '0.16em', color: '#4daa60', marginBottom: '6px' }}>
                                📖 Tu entrada de hoy
                            </p>
                            <p style={{
                                fontFamily: 'Playfair Display, Georgia, serif',
                                fontSize: '0.9rem', lineHeight: 1.65, color: '#c8e8c8', margin: 0,
                                display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                            }}>
                                {entradaGuardada.content}
                            </p>
                        </motion.div>
                    )}

                    {/* Error */}
                    {error && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            style={{
                                fontFamily: 'Inter, sans-serif', fontSize: '0.82rem',
                                color: modoYoPasado ? '#9a3a2a' : '#ff9a8a',
                                background: modoYoPasado ? '#fdf0ec' : 'rgba(255,80,60,0.1)',
                                border: `1px solid ${modoYoPasado ? '#f0c0b0' : 'rgba(255,80,60,0.25)'}`,
                                borderRadius: '10px', padding: '12px 16px', marginBottom: '16px',
                            }}>
                            {error}
                        </motion.div>
                    )}

                    {/* Messages */}
                    <AnimatePresence>
                        {mensajes.map((msg, i) => (
                            <Burbuja key={i} msg={msg} modoYoPasado={modoYoPasado} eraActiva={eraActiva} />
                        ))}
                    </AnimatePresence>

                    <AnimatePresence>
                        {iaEscribe && <TypingIndicator modoYoPasado={modoYoPasado} eraActiva={eraActiva} />}
                    </AnimatePresence>

                    <div ref={bottomRef} />
                </div>
            </div>

            {/* ── INPUT BAR ────────────────────────────────────────────── */}
            <div style={{
                padding: '14px 20px',
                borderTop: `1px solid ${theme.headerBorder}`,
                background: theme.headerBg,
                backdropFilter: 'blur(16px)',
            }}>
                <div style={{ maxWidth: '700px', margin: '0 auto', display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                    <textarea
                        ref={inputRef}
                        rows={1}
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={handleKey}
                        disabled={cargando}
                        placeholder={modoYoPasado ? `Pregúntale algo a tu yo de ${eraActiva.label.split('(')[0].trim()}…` : 'Cuéntale algo más a Rocco…'}
                        style={{
                            flex: 1,
                            fontFamily: 'Inter, sans-serif', fontSize: '0.92rem',
                            lineHeight: 1.5, padding: '12px 18px',
                            borderRadius: '24px',
                            border: `1.5px solid ${input.trim() ? theme.accentColor + '60' : theme.inputBorder}`,
                            background: theme.inputBg,
                            backdropFilter: 'blur(8px)',
                            outline: 'none', resize: 'none',
                            color: modoYoPasado ? '#1a1208' : '#e8f5e8',
                            maxHeight: '120px', overflowY: 'auto',
                            transition: 'border-color 0.2s',
                        }}
                    />
                    <motion.button
                        onClick={enviarMensaje}
                        disabled={!input.trim() || cargando}
                        whileHover={input.trim() && !cargando ? { scale: 1.08, y: -2 } : {}}
                        whileTap={input.trim() && !cargando ? { scale: 0.9 } : {}}
                        style={{
                            width: '46px', height: '46px', borderRadius: '50%',
                            border: 'none',
                            cursor: input.trim() && !cargando ? 'pointer' : 'not-allowed',
                            background: input.trim() && !cargando ? theme.sendBg : (modoYoPasado ? '#e8dfc6' : 'rgba(255,255,255,0.1)'),
                            color: input.trim() && !cargando ? '#fff' : (modoYoPasado ? '#b8a890' : '#3a6a40'),
                            fontSize: '1.3rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0,
                            boxShadow: input.trim() && !cargando ? `0 4px 16px ${theme.accentColor}55` : 'none',
                            transition: 'all 0.2s',
                        }}
                    >
                        ↑
                    </motion.button>
                </div>
            </div>
        </div>
    );
}
