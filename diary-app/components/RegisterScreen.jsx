import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Shared field style ─────────────────────────────────────────────────────
const fieldStyle = {
    width: '100%',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '12px',
    color: '#f0e8d5',
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.95rem',
    padding: '14px 18px',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s, box-shadow 0.2s',
};

function Field({ type = 'text', placeholder, value, onChange, icon }) {
    const [focused, setFocused] = useState(false);
    return (
        <div style={{ position: 'relative' }}>
            <span style={{
                position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)',
                fontSize: '1rem', pointerEvents: 'none', opacity: 0.5,
            }}>{icon}</span>
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                style={{
                    ...fieldStyle,
                    paddingLeft: '44px',
                    borderColor: focused ? 'rgba(212,160,69,0.7)' : 'rgba(255,255,255,0.12)',
                    boxShadow: focused ? '0 0 0 3px rgba(200,147,58,0.15)' : 'none',
                }}
            />
        </div>
    );
}

// ── Main component ─────────────────────────────────────────────────────────
export default function RegisterScreen({ onRegister }) {
    const [tab, setTab] = useState('login'); // 'login' | 'register'
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [leaving, setLeaving] = useState(false);

    const reset = () => { setError(''); setSuccess(''); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); setSuccess('');
        setLeaving(true);
        // DEV MODE: skip auth validation, enter with any credentials
        await new Promise(r => setTimeout(r, 500));
        onRegister(username.trim() || 'invitado');
    };

    return (
        <motion.div
            className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
            style={{ background: 'linear-gradient(145deg, #0a0806 0%, #16100a 60%, #0e0c07 100%)' }}
            animate={leaving ? { opacity: 0, scale: 0.97 } : {}}
            transition={{ duration: 0.6 }}
        >
            {/* Background texture */}
            <div className="absolute inset-0 pointer-events-none" style={{
                backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E\")",
                opacity: 0.6,
            }} />

            {/* Glow accent */}
            <div className="absolute pointer-events-none" style={{
                width: '500px', height: '500px', borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(200,147,58,0.06) 0%, transparent 70%)',
                top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            }} />

            {/* Book spine left */}
            <div className="absolute left-0 top-0 bottom-0 w-6 opacity-30"
                style={{ background: 'linear-gradient(to right, #3a2a10, transparent)' }} />

            <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-sm px-6 z-10"
            >
                {/* Logo + brand */}
                <div className="text-center mb-10">
                    <motion.div
                        animate={{ rotate: [0, -2, 2, -1, 0] }}
                        transition={{ delay: 1.5, duration: 0.7, repeat: Infinity, repeatDelay: 6 }}
                        style={{ fontSize: '3.5rem', marginBottom: '12px' }}
                    >
                        📖
                    </motion.div>
                    <h1 style={{
                        fontFamily: 'Playfair Display, Georgia, serif',
                        fontSize: '2.6rem',
                        fontWeight: 700,
                        color: '#f0e2b0',
                        letterSpacing: '-0.01em',
                        lineHeight: 1,
                        marginBottom: '6px',
                    }}>
                        KROMO
                    </h1>
                    <p style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.78rem',
                        color: '#6a5530',
                        letterSpacing: '0.18em',
                        textTransform: 'uppercase',
                    }}>
                        Tu memoria viva
                    </p>
                </div>

                {/* Tab switcher */}
                <div style={{
                    display: 'flex',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '12px',
                    padding: '4px',
                    marginBottom: '24px',
                }}>
                    {[['login', 'Iniciar sesión'], ['register', 'Crear cuenta']].map(([t, label]) => (
                        <button
                            key={t}
                            onClick={() => { setTab(t); reset(); }}
                            style={{
                                flex: 1,
                                padding: '10px',
                                borderRadius: '9px',
                                border: 'none',
                                background: tab === t
                                    ? 'linear-gradient(135deg, #c8933a, #d4a045)'
                                    : 'transparent',
                                color: tab === t ? '#fff' : '#7a6840',
                                fontFamily: 'Inter, sans-serif',
                                fontSize: '0.82rem',
                                fontWeight: tab === t ? 600 : 400,
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                boxShadow: tab === t ? '0 2px 10px rgba(200,147,58,0.35)' : 'none',
                            }}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <Field
                        icon="👤"
                        placeholder="Nombre de usuario"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                    />
                    <Field
                        type="password"
                        icon="🔒"
                        placeholder="Contraseña"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <AnimatePresence>
                        {tab === 'register' && (
                            <motion.div
                                key="confirm"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.22 }}
                                style={{ overflow: 'hidden' }}
                            >
                                <Field
                                    type="password"
                                    icon="✅"
                                    placeholder="Confirmar contraseña"
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Error / success */}
                    <AnimatePresence>
                        {error && (
                            <motion.p
                                key="err"
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                style={{
                                    fontFamily: 'Inter, sans-serif', fontSize: '0.82rem',
                                    color: '#d97a6a', textAlign: 'center', margin: '2px 0',
                                }}
                            >
                                {error}
                            </motion.p>
                        )}
                        {success && (
                            <motion.p
                                key="ok"
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{
                                    fontFamily: 'Inter, sans-serif', fontSize: '0.82rem',
                                    color: '#7ab87a', textAlign: 'center', margin: '2px 0',
                                }}
                            >
                                {success}
                            </motion.p>
                        )}
                    </AnimatePresence>

                    <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={!loading ? { scale: 1.02 } : {}}
                        whileTap={!loading ? { scale: 0.97 } : {}}
                        style={{
                            marginTop: '4px',
                            width: '100%',
                            padding: '14px',
                            borderRadius: '12px',
                            border: 'none',
                            background: loading
                                ? 'rgba(255,255,255,0.08)'
                                : 'linear-gradient(135deg, #c8933a, #d4a045)',
                            color: loading ? '#6a5530' : '#fff',
                            fontFamily: 'Inter, sans-serif',
                            fontSize: '0.95rem',
                            fontWeight: 600,
                            cursor: loading ? 'not-allowed' : 'pointer',
                            boxShadow: loading ? 'none' : '0 4px 20px rgba(200,147,58,0.4)',
                            transition: 'all 0.2s',
                            letterSpacing: '0.02em',
                        }}
                    >
                        {loading ? '…' : tab === 'login' ? 'Entrar' : 'Crear cuenta'}
                    </motion.button>
                </form>

                <p style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.72rem',
                    color: '#3a2c14',
                    textAlign: 'center',
                    marginTop: '28px',
                    lineHeight: 1.7,
                }}>
                    Sin servidores externos. Sin rastreo.<br />
                    Tus memorias son solo tuyas.
                </p>
            </motion.div>
        </motion.div>
    );
}
