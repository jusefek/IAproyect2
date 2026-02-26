import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── ERAS (sin arco iris, diseño sobrio) ───────────────────────────────────
const ERAS = [
    {
        id: '2010', label: 'Juventud', year: '2010',
        avatar: '🧒', avatarBg: '#1e2d3d',
        ring: '#4a7fa0', bubble: 'linear-gradient(145deg,#f2f6fa,#e8f0f7)',
        bubbleBorder: '#b0c8e0', textColor: '#0d2030',
        description: 'Tú a los 18 — curioso, sin límites',
    },
    {
        id: '2015', label: 'Ámsterdam', year: '2015',
        avatar: '🧑‍🎨', avatarBg: '#2d1e2f',
        ring: '#8a5aa0', bubble: 'linear-gradient(145deg,#f8f2fb,#f0e8f5)',
        bubbleBorder: '#c8a8d8', textColor: '#2a0d32',
        description: 'Tu etapa más creativa',
    },
    {
        id: '2020', label: 'Confinamiento', year: '2020',
        avatar: '🧘', avatarBg: '#1e2d1e',
        ring: '#5a8a5a', bubble: 'linear-gradient(145deg,#f2f8f2,#e8f5e8)',
        bubbleBorder: '#a8d0a8', textColor: '#0d200d',
        description: 'Quietud forzada, crecimiento interior',
    },
    {
        id: '2026', label: 'Ahora', year: '2026',
        avatar: '🧑‍💻', avatarBg: '#2d1e0d',
        ring: '#a07040', bubble: 'linear-gradient(145deg,#fdf8f0,#f5ecda)',
        bubbleBorder: '#d0a870', textColor: '#200d00',
        description: 'Quién eres hoy',
    },
];

// ── Animated SVG Crocodile — side profile ─────────────────────────────────
function CrocodileFace({ isTalking, size = 200 }) {
    const W = 290, H = 130;
    return (
        <motion.div
            animate={isTalking ? {} : { y: [0, -5, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{
                width: size, height: size * (H / W),
                filter: 'drop-shadow(0 10px 32px rgba(30,110,55,0.6))',
                flexShrink: 0,
            }}
        >
            <svg viewBox={`0 0 ${W} ${H}`} width={size} height={size * (H / W)} style={{ overflow: 'visible' }}>

                {/* ── Ground shadow ── */}
                <ellipse cx="145" cy="122" rx="105" ry="8" fill="rgba(0,0,0,0.35)" />

                {/* ── NECK / BODY (left side, croc faces RIGHT) ── */}
                <ellipse cx="24" cy="78" rx="24" ry="34" fill="#2d7a3a" />
                <rect x="0" y="52" width="28" height="52" rx="10" fill="#2d7a3a" />

                {/* ── BELLY (lighter) ── */}
                <path d="M 20 82 Q 100 90 200 80 Q 240 76 268 68 Q 255 78 225 82 Q 165 90 100 88 Q 60 87 20 82 Z"
                    fill="#4aaa58" opacity="0.6" />

                {/* ── UPPER JAW — main skull + snout ── */}
                {/* Skull dome */}
                <path d="M 20 56 Q 48 24 88 22 Q 128 20 165 32 Q 205 42 242 50 Q 262 54 278 60 Q 274 65 268 64 Q 248 58 215 52 Q 175 44 130 42 Q 90 42 62 48 Q 38 54 22 64 Z"
                    fill="#3d9848" />
                {/* Snout – flatter, longer bridge */}
                <path d="M 88 36 Q 160 30 230 46 Q 255 50 275 58 Q 260 55 235 54 Q 195 48 145 46 Q 105 46 88 50 Z"
                    fill="#348840" />

                {/* ── DORSAL RIDGE BUMPS ── */}
                {[0, 1, 2, 3, 4, 5].map(i => (
                    <ellipse key={i}
                        cx={100 + i * 26} cy={28 + Math.abs(i - 2) * 2.5}
                        rx="10" ry="6" fill="#2a7832" opacity="0.75"
                    />
                ))}

                {/* ── SKIN TEXTURE DIAMONDS (side of jaw) ── */}
                {[0, 1, 2, 3, 4].map(col =>
                    [0, 1].map(row => (
                        <polygon key={`${col}-${row}`}
                            points={`
                                ${55 + col * 38 + row * 16},${61 + row * 10}
                                ${63 + col * 38 + row * 16},${57 + row * 10}
                                ${71 + col * 38 + row * 16},${61 + row * 10}
                                ${63 + col * 38 + row * 16},${65 + row * 10}
                            `}
                            fill="#2d8038" opacity="0.45"
                        />
                    ))
                )}

                {/* ── NOSTRIL at snout tip ── */}
                <ellipse cx="274" cy="57" rx="6" ry="4" fill="#1a5228" />
                <ellipse cx="273" cy="56" rx="3" ry="2" fill="#091810" />

                {/* ── UPPER TEETH (static, visible at jaw line) ── */}
                {[0, 1, 2, 3, 4, 5, 6].map(i => (
                    <polygon key={i}
                        points={`
                            ${105 + i * 23},62
                            ${110 + i * 23},52
                            ${115 + i * 23},62
                        `}
                        fill="#f2f0e0"
                    />
                ))}

                {/* ── EYE — high on skull, characteristic croc position ── */}
                {/* Eye socket bump */}
                <ellipse cx="72" cy="34" rx="18" ry="15" fill="#2d8038" />
                {/* Sclera */}
                <circle cx="72" cy="34" r="12" fill="#0c120a" />
                {/* Iris — golden yellow */}
                <circle cx="72" cy="34" r="8" fill="#c8a010" />
                {/* Vertical slit pupil */}
                <ellipse cx="72" cy="34" rx="2.5" ry="6" fill="#030503" />
                {/* Eye glint */}
                <circle cx="68" cy="30" r="2.5" fill="rgba(255,255,255,0.75)" />
                {/* Eyelid blink */}
                <motion.ellipse
                    cx="72" cy="34" rx="12"
                    animate={{ ry: [0, 0, 0, 0, 0, 0, 12, 0] }}
                    transition={{ duration: 5.5, repeat: Infinity }}
                    fill="#2d8038"
                />
                {/* Brow ridge */}
                <path d="M 56 26 Q 72 20 88 26" stroke="#1a5228" strokeWidth="3" fill="none" strokeLinecap="round" />

                {/* ── LOWER JAW — pivots open from back (x≈28, y≈80) ── */}
                <motion.g
                    animate={isTalking
                        ? { rotate: [0, 18, 5, 20, 7, 16, 0] }
                        : { rotate: 2 }
                    }
                    transition={isTalking
                        ? { duration: 0.4, repeat: Infinity, ease: 'easeInOut' }
                        : { duration: 0.3 }
                    }
                    style={{ transformOrigin: '28px 80px' }}
                >
                    {/* Lower jaw body */}
                    <path d="M 22 78 Q 80 84 155 78 Q 210 74 270 64 Q 254 76 220 82 Q 170 90 105 88 Q 62 87 25 83 Z"
                        fill="#2a7030" />

                    {/* Inner mouth — red only visible when open */}
                    <path d="M 32 78 Q 130 76 260 66 Q 245 72 210 76 Q 160 82 100 82 Q 62 81 32 78 Z"
                        fill="#b02838" opacity="0.9" />

                    {/* Tongue */}
                    <motion.path
                        d="M 80 78 Q 160 80 240 70"
                        stroke="#d03848"
                        strokeWidth="10"
                        fill="none"
                        strokeLinecap="round"
                        animate={isTalking
                            ? { strokeWidth: [10, 15, 8, 15, 10], d: ['M 80 78 Q 160 84 240 72', 'M 80 78 Q 160 88 240 74', 'M 80 78 Q 160 84 240 72'] }
                            : { strokeWidth: 7, d: 'M 95 78 Q 175 80 240 70' }
                        }
                        transition={{ duration: 0.4, repeat: Infinity }}
                    />

                    {/* Lower teeth — iconic offset so they show past upper row */}
                    {[0, 1, 2, 3, 4, 5].map(i => (
                        <polygon key={i}
                            points={`
                                ${100 + i * 24},78
                                ${105 + i * 24},88
                                ${110 + i * 24},78
                            `}
                            fill="#f0eedc"
                        />
                    ))}
                    {/* The famous large 4th tooth that sticks up in crocs */}
                    <polygon points="96,78 103,92 110,78" fill="#f5f3e2" />
                </motion.g>

                {/* ── JAW SEAM LINE ── */}
                <path d="M 30 64 Q 150 60 272 62"
                    stroke="#1a5228" strokeWidth="1.5" fill="none" opacity="0.55"
                    strokeDasharray="6, 4"
                />

            </svg>
        </motion.div>
    );
}



// ── Avatar de era (Avatares section) ──────────────────────────────────────
function EraAvatar({ era, isLoading, size = 64 }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
            <motion.div
                animate={isLoading ? { scale: [1, 1.07, 0.96, 1.07, 1] } : { scale: 1 }}
                transition={isLoading ? { duration: 0.75, repeat: Infinity } : {}}
                style={{
                    width: size, height: size, borderRadius: '50%',
                    background: era.avatarBg,
                    border: `2.5px solid ${era.ring}`,
                    boxShadow: `0 0 0 2px ${era.ring}30, 0 4px 16px rgba(0,0,0,0.3)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: size > 50 ? '1.8rem' : '1.1rem', flexShrink: 0,
                }}
            >
                {era.avatar}
            </motion.div>
            {size >= 48 && (
                <span style={{
                    fontFamily: 'Inter, sans-serif', fontSize: '0.7rem', fontWeight: 600,
                    color: era.ring, letterSpacing: '0.04em', textTransform: 'uppercase',
                }}>
                    {era.label}
                </span>
            )}
        </div>
    );
}

// ── Avatar development % (based on profile fill + entries) ────────────────
function AvatarProgress({ perfil, entryCount = 0 }) {
    const fields = [
        { key: 'username', label: 'Identidad', pts: 10 },
        { key: 'alias', label: 'Alias', pts: 10 },
        { key: 'ocupacion', label: 'Ocupación', pts: 10 },
        { key: 'circulo', label: 'Círculo social', pts: 10 },
        { key: 'foco', label: 'Foco vital', pts: 10 },
        { key: 'onboardingComplete', label: 'Perfil base', pts: 20 },
    ];
    const fieldPts = fields.reduce((acc, f) => acc + (perfil?.[f.key] ? f.pts : 0), 0);
    const entryPts = Math.min(30, Math.floor(entryCount * 3)); // +3% per entry, max 30
    const total = Math.min(100, fieldPts + entryPts);

    const getColor = (pct) => {
        if (pct < 33) return '#6a8a7a';
        if (pct < 66) return '#8a7a60';
        return '#7a8a6a';
    };
    const color = getColor(total);
    const label = total < 20 ? 'Embrión' : total < 40 ? 'Boceto' : total < 60 ? 'Emergiendo' : total < 80 ? 'Formado' : total < 100 ? 'Maduro' : 'Completo';

    return (
        <div style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            padding: '14px 18px',
            marginBottom: '20px',
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', color: '#9a9a8a', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Desarrollo del avatar
                </span>
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', fontWeight: 700, color, letterSpacing: '0.05em' }}>
                    {label} · {total}%
                </span>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '999px', height: '6px', overflow: 'hidden' }}>
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${total}%` }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    style={{ height: '100%', borderRadius: '999px', background: `linear-gradient(90deg, ${color}88, ${color})` }}
                />
            </div>
            <div style={{ display: 'flex', gap: '6px', marginTop: '10px', flexWrap: 'wrap' }}>
                {fields.map(f => (
                    <span key={f.key} style={{
                        fontFamily: 'Inter, sans-serif', fontSize: '0.63rem',
                        color: perfil?.[f.key] ? color : '#4a4a3a',
                        background: perfil?.[f.key] ? `${color}18` : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${perfil?.[f.key] ? color + '40' : 'rgba(255,255,255,0.08)'}`,
                        borderRadius: '999px', padding: '2px 8px',
                    }}>
                        {perfil?.[f.key] ? '✓' : '○'} {f.label}
                    </span>
                ))}
                {entryCount > 0 && (
                    <span style={{
                        fontFamily: 'Inter, sans-serif', fontSize: '0.63rem',
                        color, background: `${color}18`,
                        border: `1px solid ${color}40`,
                        borderRadius: '999px', padding: '2px 8px',
                    }}>
                        ✓ {entryCount} {entryCount === 1 ? 'entrada' : 'entradas'} (+{entryPts}%)
                    </span>
                )}
            </div>
        </div>
    );
}

// ── Chat Bubble ────────────────────────────────────────────────────────────
function Burbuja({ msg, modoYoPasado, eraActiva }) {
    const esIA = msg.role === 'assistant';

    if (esIA && modoYoPasado) {
        return (
            <motion.div
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                style={{ display: 'flex', marginBottom: '18px', gap: '10px', alignItems: 'flex-end' }}
            >
                <div style={{
                    width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                    background: eraActiva.avatarBg,
                    border: `2px solid ${eraActiva.ring}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1rem',
                }}>
                    {eraActiva.avatar}
                </div>
                <div style={{
                    maxWidth: '72%',
                    background: eraActiva.bubble,
                    border: `1px solid ${eraActiva.bubbleBorder}`,
                    borderLeft: `3px solid ${eraActiva.ring}`,
                    borderRadius: '4px 16px 16px 4px',
                    padding: '13px 17px',
                    boxShadow: '0 2px 14px rgba(0,0,0,0.07)',
                }}>
                    <p style={{
                        fontFamily: 'Playfair Display, Georgia, serif',
                        fontStyle: 'italic', fontSize: '1rem', lineHeight: 1.65,
                        color: eraActiva.textColor, margin: 0,
                    }}>
                        {msg.content}
                    </p>
                </div>
            </motion.div>
        );
    }

    // Rocco bubble
    if (esIA && !modoYoPasado) {
        return (
            <motion.div
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                style={{ display: 'flex', marginBottom: '18px', gap: '10px', alignItems: 'flex-end' }}
            >
                <div style={{
                    width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                    background: '#1a3a22', border: '2px solid #3a8f50',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.2rem',
                }}>
                    🐊
                </div>
                <div style={{
                    maxWidth: '72%',
                    background: 'rgba(255,255,255,0.08)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(74,185,100,0.2)',
                    borderLeft: '3px solid #4daa60',
                    borderRadius: '4px 16px 16px 4px',
                    padding: '13px 17px',
                    boxShadow: '0 3px 18px rgba(0,0,0,0.2)',
                }}>
                    <p style={{
                        fontFamily: 'Caveat, cursive', fontSize: '1.2rem',
                        lineHeight: 1.5, color: '#d8f0d8', margin: 0,
                    }}>
                        {msg.content}
                    </p>
                </div>
            </motion.div>
        );
    }

    // User bubble
    return (
        <motion.div
            initial={{ opacity: 0, x: 14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', gap: '8px', marginBottom: '18px' }}
        >
            <div style={{
                maxWidth: '72%',
                background: modoYoPasado
                    ? `linear-gradient(135deg, ${eraActiva.ring}cc, ${eraActiva.ring}88)`
                    : 'linear-gradient(135deg, #3a8f50, #2a6a38)',
                borderRadius: '16px 4px 16px 16px',
                padding: '12px 17px',
                boxShadow: modoYoPasado
                    ? `0 4px 16px ${eraActiva.ring}44`
                    : '0 4px 16px rgba(40,120,60,0.4)',
            }}>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.93rem', lineHeight: 1.55, color: '#fff', margin: 0 }}>
                    {msg.content}
                </p>
            </div>
            <div style={{
                width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                background: modoYoPasado ? eraActiva.avatarBg : '#1a3a22',
                border: `2px solid ${modoYoPasado ? eraActiva.ring : '#3a8f50'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.9rem',
            }}>
                🧑
            </div>
        </motion.div>
    );
}

// ── Typing dots ────────────────────────────────────────────────────────────
function TypingIndicator({ modoYoPasado, eraActiva }) {
    const color = modoYoPasado ? eraActiva.ring : '#4daa60';
    return (
        <motion.div
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}
        >
            <div style={{
                width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                background: modoYoPasado ? eraActiva.avatarBg : '#1a3a22',
                border: `2px solid ${color}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem',
            }}>
                {modoYoPasado ? eraActiva.avatar : '🐊'}
            </div>
            <div style={{
                background: modoYoPasado ? eraActiva.bubble : 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(8px)',
                border: `1px solid ${color}33`,
                borderRadius: '20px', padding: '10px 16px',
                display: 'flex', gap: '5px', alignItems: 'center',
            }}>
                {[0, 1, 2].map(i => (
                    <motion.span key={i}
                        animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 0.65, repeat: Infinity, delay: i * 0.16 }}
                        style={{ fontSize: '0.8rem', color }}
                    >●</motion.span>
                ))}
            </div>
        </motion.div>
    );
}

// ── MAIN COMPONENT ─────────────────────────────────────────────────────────
export default function PastSelfMode({ entradaGuardada, perfil, onVolver, modoYoPasado = false }) {
    const [mensajes, setMensajes] = useState([]);
    const [input, setInput] = useState('');
    const [cargando, setCargando] = useState(false);
    const [iaEscribe, setIaEscribe] = useState(false);
    const [eraActiva, setEraActiva] = useState(ERAS[0]);
    const [error, setError] = useState('');
    const [entryCount, setEntryCount] = useState(0);
    const bottomRef = useRef(null);
    const inputRef = useRef(null);

    const hoy = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });

    // Fetch entry count for avatar progress
    useEffect(() => {
        if (modoYoPasado) {
            fetch('/api/entries').then(r => r.json()).then(e => setEntryCount(e?.length || 0)).catch(() => { });
        }
    }, [modoYoPasado]);

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
            ? `El usuario quiere hablar con su yo de la época "${eraActiva.label} (${eraActiva.year})". Habla en primera persona como ese yo de entonces. Empieza evocando ese tiempo directamente.`
            : entrada
                ? `Reacciona a esto que acabo de escribir en mi diario: "${entrada.content.slice(0, 300)}". Reacciona directamente. Sin presentarte.`
                : 'Hola. Cuéntame algo.';

        setMensajes([]); setError(''); setCargando(true); setIaEscribe(true);
        try {
            const r = await llamarApi(msgInicio, []);
            setMensajes([{ role: 'assistant', content: r }]);
        } catch (err) {
            setError(err.message === 'NO_API_KEY'
                ? '⚠️ Añade tu clave API con el botón 🔑.'
                : `⚠️ ${err.message}`);
        } finally { setCargando(false); setIaEscribe(false); inputRef.current?.focus(); }
    }, [modoYoPasado, eraActiva, llamarApi]);

    useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [mensajes, iaEscribe]);
    useEffect(() => { iniciarConversacion(entradaGuardada); }, [modoYoPasado, eraActiva]);

    const enviarMensaje = async () => {
        const texto = input.trim();
        if (!texto || cargando) return;
        setMensajes(prev => [...prev, { role: 'user', content: texto }]);
        setInput(''); setError(''); setCargando(true); setIaEscribe(true);
        try {
            const r = await llamarApi(texto, mensajes);
            setMensajes(prev => [...prev, { role: 'assistant', content: r }]);
        } catch (err) {
            setMensajes(prev => [...prev, { role: 'assistant', content: `⚠️ ${err.message}` }]);
        } finally { setCargando(false); setIaEscribe(false); inputRef.current?.focus(); }
    };

    const handleKey = e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); enviarMensaje(); } };

    // ── ROCCO LAYOUT ─────────────────────────────────────────────────────
    if (!modoYoPasado) {
        return (
            <div style={{ minHeight: 'calc(100vh - 57px)', display: 'flex', flexDirection: 'column', background: 'linear-gradient(160deg,#080f09 0%,#0d1a0f 50%,#080f09 100%)' }}>

                {/* Hero area with animated croc */}
                <div style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    padding: '28px 24px 18px',
                    borderBottom: '1px solid rgba(74,185,100,0.15)',
                    background: 'rgba(0,0,0,0.2)',
                }}>
                    <CrocodileFace isTalking={iaEscribe} size={130} />
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        style={{ textAlign: 'center', marginTop: '12px' }}
                    >
                        <h2 style={{
                            fontFamily: 'Playfair Display, Georgia, serif',
                            fontSize: '1.4rem', fontWeight: 600,
                            color: '#c8f0c8', margin: 0, letterSpacing: '-0.01em',
                        }}>
                            Rocco
                        </h2>
                        <p style={{
                            fontFamily: 'Inter, sans-serif', fontSize: '0.65rem',
                            color: '#4daa6088', textTransform: 'uppercase',
                            letterSpacing: '0.2em', margin: '4px 0 0',
                        }}>
                            {iaEscribe ? '— hablando —' : hoy}
                        </p>
                    </motion.div>
                </div>

                {/* Chat */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '24px 20px' }}>
                    <div style={{ maxWidth: '680px', margin: '0 auto' }}>
                        {entradaGuardada && (
                            <motion.div
                                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                                style={{
                                    background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(8px)',
                                    border: '1px solid rgba(74,185,100,0.18)', borderLeft: '3px solid #3a8f50',
                                    borderRadius: '4px 12px 12px 4px', padding: '13px 17px', marginBottom: '24px',
                                }}
                            >
                                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.57rem', textTransform: 'uppercase', letterSpacing: '0.16em', color: '#4daa60', marginBottom: '6px' }}>
                                    📖 Tu entrada de hoy
                                </p>
                                <p style={{
                                    fontFamily: 'Playfair Display, Georgia, serif', fontSize: '0.9rem',
                                    lineHeight: 1.65, color: '#a8c8a8', margin: 0,
                                    display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                                }}>
                                    {entradaGuardada.content}
                                </p>
                            </motion.div>
                        )}
                        {error && (
                            <div style={{ background: 'rgba(255,80,60,0.1)', border: '1px solid rgba(255,80,60,0.25)', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', color: '#ff9a8a', fontFamily: 'Inter, sans-serif', fontSize: '0.82rem' }}>
                                {error}
                            </div>
                        )}
                        <AnimatePresence>
                            {mensajes.map((msg, i) => <Burbuja key={i} msg={msg} modoYoPasado={false} eraActiva={null} />)}
                        </AnimatePresence>
                        <AnimatePresence>
                            {iaEscribe && <TypingIndicator modoYoPasado={false} eraActiva={null} />}
                        </AnimatePresence>
                        <div ref={bottomRef} />
                    </div>
                </div>

                {/* Input */}
                <div style={{ padding: '14px 20px', borderTop: '1px solid rgba(74,185,100,0.15)', background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(16px)' }}>
                    <div style={{ maxWidth: '680px', margin: '0 auto', display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                        <textarea
                            ref={inputRef} rows={1} value={input}
                            onChange={e => setInput(e.target.value)} onKeyDown={handleKey}
                            disabled={cargando}
                            placeholder="Cuéntale algo más a Rocco…"
                            style={{
                                flex: 1, fontFamily: 'Inter, sans-serif', fontSize: '0.92rem',
                                lineHeight: 1.5, padding: '12px 18px', borderRadius: '24px',
                                border: `1.5px solid ${input.trim() ? 'rgba(74,185,100,0.5)' : 'rgba(74,185,100,0.15)'}`,
                                background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(8px)',
                                outline: 'none', resize: 'none', color: '#d8f0d8',
                                maxHeight: '120px', overflowY: 'auto', transition: 'border-color 0.2s',
                            }}
                        />
                        <motion.button
                            onClick={enviarMensaje} disabled={!input.trim() || cargando}
                            whileHover={input.trim() && !cargando ? { scale: 1.1, y: -2 } : {}}
                            whileTap={input.trim() && !cargando ? { scale: 0.9 } : {}}
                            style={{
                                width: '46px', height: '46px', borderRadius: '50%', border: 'none', flexShrink: 0,
                                cursor: input.trim() && !cargando ? 'pointer' : 'not-allowed',
                                background: input.trim() && !cargando ? 'linear-gradient(135deg,#3a8f50,#2a6a38)' : 'rgba(255,255,255,0.08)',
                                color: input.trim() && !cargando ? '#fff' : '#3a6a40',
                                fontSize: '1.3rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: input.trim() && !cargando ? '0 4px 16px rgba(40,140,60,0.5)' : 'none',
                                transition: 'all 0.2s',
                            }}
                        >↑</motion.button>
                    </div>
                </div>
            </div>
        );
    }

    // ── AVATARES LAYOUT ───────────────────────────────────────────────────
    return (
        <div style={{ minHeight: 'calc(100vh - 57px)', display: 'flex', flexDirection: 'column', background: 'linear-gradient(160deg,#101010 0%,#181818 50%,#101010 100%)' }}>

            {/* Header */}
            <header style={{
                padding: '18px 24px', display: 'flex', alignItems: 'center', gap: '14px',
                borderBottom: `1px solid ${eraActiva.ring}28`,
                background: 'rgba(20,20,20,0.8)', backdropFilter: 'blur(16px)',
                position: 'sticky', top: 0, zIndex: 10,
            }}>
                <EraAvatar era={eraActiva} isLoading={iaEscribe} size={52} />
                <div style={{ flex: 1 }}>
                    <h2 style={{
                        fontFamily: 'Playfair Display, Georgia, serif',
                        fontSize: '1.15rem', fontWeight: 600,
                        color: '#e8e8e0', margin: 0,
                    }}>
                        {eraActiva.avatar} {eraActiva.label}
                        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.7rem', color: `${eraActiva.ring}aa`, marginLeft: '8px', fontWeight: 400 }}>
                            {eraActiva.year}
                        </span>
                    </h2>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.62rem', color: '#606058', textTransform: 'uppercase', letterSpacing: '0.14em', margin: '3px 0 0' }}>
                        {eraActiva.description}
                    </p>
                </div>
            </header>

            {/* Era selector — sober, dark */}
            <div style={{
                padding: '12px 24px',
                background: 'rgba(0,0,0,0.4)',
                borderBottom: `1px solid ${eraActiva.ring}20`,
                display: 'flex', gap: '8px', overflowX: 'auto', scrollbarWidth: 'none',
            }}>
                {ERAS.map(era => {
                    const active = eraActiva.id === era.id;
                    return (
                        <motion.button
                            key={era.id}
                            onClick={() => setEraActiva(era)}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.93 }}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '7px',
                                padding: '8px 14px', borderRadius: '10px',
                                border: `1.5px solid ${active ? era.ring : '#303030'}`,
                                background: active ? `${era.ring}22` : 'rgba(255,255,255,0.04)',
                                color: active ? era.ring : '#5a5a50',
                                fontFamily: 'Inter, sans-serif', fontSize: '0.77rem', fontWeight: active ? 600 : 400,
                                cursor: 'pointer', whiteSpace: 'nowrap',
                                boxShadow: active ? `0 2px 12px ${era.ring}33` : 'none',
                                transition: 'all 0.22s',
                            }}
                        >
                            <span style={{ fontSize: '1rem' }}>{era.avatar}</span>
                            <div>
                                <div style={{ lineHeight: 1.2 }}>{era.label}</div>
                                <div style={{ fontSize: '0.6rem', color: active ? `${era.ring}88` : '#383830', lineHeight: 1 }}>{era.year}</div>
                            </div>
                        </motion.button>
                    );
                })}
            </div>

            {/* Chat area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px 20px' }}>
                <div style={{ maxWidth: '680px', margin: '0 auto' }}>
                    {/* Avatar progress */}
                    <AvatarProgress perfil={perfil} entryCount={entryCount} />

                    {error && (
                        <div style={{ background: 'rgba(180,60,40,0.12)', border: '1px solid rgba(180,60,40,0.25)', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', color: '#d08070', fontFamily: 'Inter, sans-serif', fontSize: '0.82rem' }}>
                            {error}
                        </div>
                    )}
                    <AnimatePresence>
                        {mensajes.map((msg, i) => <Burbuja key={i} msg={msg} modoYoPasado={true} eraActiva={eraActiva} />)}
                    </AnimatePresence>
                    <AnimatePresence>
                        {iaEscribe && <TypingIndicator modoYoPasado={true} eraActiva={eraActiva} />}
                    </AnimatePresence>
                    <div ref={bottomRef} />
                </div>
            </div>

            {/* Input */}
            <div style={{
                padding: '14px 20px',
                borderTop: `1px solid ${eraActiva.ring}20`,
                background: 'rgba(20,20,20,0.8)', backdropFilter: 'blur(16px)',
            }}>
                <div style={{ maxWidth: '680px', margin: '0 auto', display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                    <textarea
                        ref={inputRef} rows={1} value={input}
                        onChange={e => setInput(e.target.value)} onKeyDown={handleKey}
                        disabled={cargando}
                        placeholder={`Pregúntale algo a tu yo de ${eraActiva.label}…`}
                        style={{
                            flex: 1, fontFamily: 'Inter, sans-serif', fontSize: '0.92rem',
                            lineHeight: 1.5, padding: '12px 18px', borderRadius: '12px',
                            border: `1.5px solid ${input.trim() ? eraActiva.ring + '60' : '#303030'}`,
                            background: 'rgba(255,255,255,0.05)',
                            outline: 'none', resize: 'none', color: '#d8d8c8',
                            maxHeight: '120px', overflowY: 'auto', transition: 'border-color 0.2s',
                        }}
                    />
                    <motion.button
                        onClick={enviarMensaje} disabled={!input.trim() || cargando}
                        whileHover={input.trim() && !cargando ? { scale: 1.1, y: -2 } : {}}
                        whileTap={input.trim() && !cargando ? { scale: 0.9 } : {}}
                        style={{
                            width: '46px', height: '46px', borderRadius: '12px', border: 'none', flexShrink: 0,
                            cursor: input.trim() && !cargando ? 'pointer' : 'not-allowed',
                            background: input.trim() && !cargando ? eraActiva.avatarBg : '#1a1a1a',
                            border: `1.5px solid ${input.trim() && !cargando ? eraActiva.ring : '#303030'}`,
                            color: input.trim() && !cargando ? eraActiva.ring : '#404040',
                            fontSize: '1.3rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: input.trim() && !cargando ? `0 4px 16px ${eraActiva.ring}44` : 'none',
                            transition: 'all 0.2s',
                        }}
                    >↑</motion.button>
                </div>
            </div>
        </div>
    );
}
