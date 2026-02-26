import { useState } from 'react';
import { motion } from 'framer-motion';

const CAMPOS = [
    {
        key: 'alias',
        emoji: '🏷️',
        label: '¿Cómo quieres que te llame?',
        placeholder: 'Tu alias o nombre preferido',
    },
    {
        key: 'ocupacion',
        emoji: '💼',
        label: '¿A qué te dedicas?',
        placeholder: 'Estudiante, diseñador, músico en secreto…',
    },
    {
        key: 'circulo',
        emoji: '🫂',
        label: '¿Cómo describes tu círculo social?',
        placeholder: 'Familia cercana, amigos del barrio, lobo solitario…',
    },
    {
        key: 'foco',
        emoji: '🎯',
        label: '¿Cuál es tu foco vital ahora mismo?',
        placeholder: 'Crecer profesionalmente, encontrar calma, crear cosas…',
    },
];

export default function QuickProfileForm({ username, onComplete }) {
    const [values, setValues] = useState({ alias: '', ocupacion: '', circulo: '', foco: '' });
    const [saving, setSaving] = useState(false);

    const handleChange = (key, val) => setValues(v => ({ ...v, [key]: val }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        // Fill blanks with defaults so profile is always stored
        const payload = {
            alias: values.alias.trim() || username || 'Viajero',
            ocupacion: values.ocupacion.trim() || 'Sin especificar',
            circulo: values.circulo.trim() || 'Sin especificar',
            foco: values.foco.trim() || 'Sin especificar',
            username: username || 'invitado',
            quickProfileComplete: true,
        };

        await fetch('/api/profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        setSaving(false);
        onComplete(payload);
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center p-6"
            style={{ background: 'linear-gradient(160deg, #fdfbf7 0%, #f5efe0 100%)' }}
        >
            <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="w-full max-w-lg"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="text-5xl mb-4">📖</div>
                    <h1
                        className="font-serif text-2xl font-medium"
                        style={{ color: '#1a1208', fontFamily: 'Playfair Display, Georgia, serif' }}
                    >
                        Antes de empezar…
                    </h1>
                    <p
                        className="font-sans text-sm mt-2"
                        style={{ color: '#9a8870' }}
                    >
                        Cuéntame un poco sobre ti. Todos los campos son opcionales.
                    </p>
                </div>

                {/* Card */}
                <form
                    onSubmit={handleSubmit}
                    className="rounded-2xl p-8 flex flex-col gap-5"
                    style={{
                        background: '#fff',
                        border: '1px solid #e8dfc6',
                        boxShadow: '2px 4px 24px rgba(0,0,0,0.08)',
                    }}
                >
                    {CAMPOS.map(campo => (
                        <div key={campo.key}>
                            <label
                                className="block font-sans text-xs font-medium mb-1.5"
                                style={{ color: '#7a6840', letterSpacing: '0.04em' }}
                            >
                                {campo.emoji} {campo.label}
                            </label>
                            <input
                                type="text"
                                value={values[campo.key]}
                                onChange={e => handleChange(campo.key, e.target.value)}
                                placeholder={campo.placeholder}
                                style={{
                                    width: '100%',
                                    fontFamily: 'Inter, sans-serif',
                                    fontSize: '0.9rem',
                                    padding: '10px 14px',
                                    borderRadius: '8px',
                                    border: '1px solid #e8dfc6',
                                    outline: 'none',
                                    color: '#1a1208',
                                    background: '#fdfbf7',
                                    boxSizing: 'border-box',
                                    transition: 'border-color 0.2s',
                                }}
                                onFocus={e => (e.target.style.borderColor = '#C8933A')}
                                onBlur={e => (e.target.style.borderColor = '#e8dfc6')}
                            />
                        </div>
                    ))}

                    <div className="flex justify-end mt-2">
                        <motion.button
                            type="submit"
                            disabled={saving}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.97 }}
                            style={{
                                background: saving ? '#e8dfc6' : 'linear-gradient(135deg, #d4a045, #c8933a)',
                                border: 'none',
                                borderRadius: '999px',
                                color: saving ? '#b8a890' : '#fff',
                                fontFamily: 'Inter, sans-serif',
                                fontSize: '0.88rem',
                                fontWeight: 600,
                                padding: '11px 28px',
                                cursor: saving ? 'not-allowed' : 'pointer',
                                boxShadow: saving ? 'none' : '0 3px 12px rgba(200,147,58,0.3)',
                                transition: 'all 0.2s',
                            }}
                        >
                            {saving ? '…' : 'Empezar mi diario →'}
                        </motion.button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
