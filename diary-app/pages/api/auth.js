/**
 * api/auth.js
 * Simple local authentication for KROMO.
 * Users are stored in data/users.json as { username, passwordHash }.
 * Uses a basic SHA-256 hash (sufficient for this local-only app).
 */
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

function ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function hashPassword(password) {
    return crypto.createHash('sha256').update(password + 'kromo_salt_2026').digest('hex');
}

function readUsers() {
    ensureDataDir();
    if (!fs.existsSync(USERS_FILE)) return [];
    try { return JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8')); }
    catch { return []; }
}

function writeUsers(users) {
    ensureDataDir();
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

export default function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();

    const { action, username, password } = req.body || {};

    if (!username?.trim() || !password?.trim()) {
        return res.status(400).json({ error: 'Usuario y contraseña son obligatorios.' });
    }

    const users = readUsers();
    const uname = username.trim().toLowerCase();
    const hash = hashPassword(password);

    // ── REGISTER ────────────────────────────────────────────────────────────
    if (action === 'register') {
        if (users.find(u => u.username === uname)) {
            return res.status(409).json({ error: 'Ese nombre de usuario ya existe.' });
        }
        users.push({ username: uname, passwordHash: hash, createdAt: new Date().toISOString() });
        writeUsers(users);
        return res.status(200).json({ ok: true, username: uname });
    }

    // ── LOGIN ────────────────────────────────────────────────────────────────
    if (action === 'login') {
        const user = users.find(u => u.username === uname);
        if (!user) {
            return res.status(401).json({ error: 'Usuario no encontrado.' });
        }
        if (user.passwordHash !== hash) {
            return res.status(401).json({ error: 'Contraseña incorrecta.' });
        }
        return res.status(200).json({ ok: true, username: uname });
    }

    return res.status(400).json({ error: 'Acción no válida.' });
}
