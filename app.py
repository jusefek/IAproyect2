"""
app.py
------
AI of Memories — Digital Time Capsule
A transparent, consent-first personal journaling app powered by Gemini.

Run with:  streamlit run app.py
"""

import streamlit as st
import os
from datetime import datetime
from dotenv import load_dotenv

import memories_db as db
import ai_engine as ai

load_dotenv()

# ── Page config ───────────────────────────────────────────────────────────────

st.set_page_config(
    page_title="AI of Memories",
    page_icon="📖",
    layout="centered",
    initial_sidebar_state="expanded",
)

# ── Custom CSS ────────────────────────────────────────────────────────────────

st.markdown("""
<style>
  @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,300;0,400;1,300;1,400&family=Inter:wght@300;400;500&display=swap');

  html, body, [class*="css"] {
    font-family: 'Crimson Pro', Georgia, serif;
    background-color: #1a1610;
    color: #e8dfc6;
  }
  .stApp { background-color: #1a1610; }

  /* Notebook paper texture */
  .main .block-container {
    background: linear-gradient(135deg, #1e1a12 0%, #221e14 50%, #1e1a12 100%);
    border: 1px solid #3d3420;
    border-radius: 4px;
    padding: 2rem 3rem;
    box-shadow: 4px 4px 20px rgba(0,0,0,0.6), inset 0 0 60px rgba(255,200,100,0.03);
    max-width: 780px;
  }

  h1, h2, h3 { font-family: 'Crimson Pro', serif; color: #f0e2b0; letter-spacing: 0.5px; }

  /* Chat bubbles */
  .user-bubble {
    background: #2a2416;
    border-left: 3px solid #8b6914;
    border-radius: 0 8px 8px 0;
    padding: 0.8rem 1.2rem;
    margin: 0.5rem 0;
    font-size: 1.05rem;
    color: #e8dfc6;
    font-style: italic;
  }
  .ai-bubble {
    background: #1a1e14;
    border-left: 3px solid #4a6e3a;
    border-radius: 0 8px 8px 0;
    padding: 0.8rem 1.2rem;
    margin: 0.5rem 0;
    font-size: 0.97rem;
    color: #b8d4a0;
  }
  .past-self-bubble {
    background: #141a24;
    border-left: 3px solid #4a6a9e;
    border-radius: 0 8px 8px 0;
    padding: 0.8rem 1.2rem;
    margin: 0.5rem 0;
    font-size: 0.97rem;
    color: #a0b8d4;
  }

  /* Login card */
  .login-card {
    background: linear-gradient(145deg, #1e1a12, #261f12);
    border: 1px solid #4a3a18;
    border-radius: 12px;
    padding: 2.5rem 2rem;
    margin: 1.5rem 0;
    box-shadow: 0 8px 32px rgba(0,0,0,0.5);
  }

  /* Quick profile card */
  .profile-card {
    background: linear-gradient(145deg, #141c14, #1a221a);
    border: 1px solid #3a5a3a;
    border-radius: 12px;
    padding: 2rem 1.8rem;
    margin: 1rem 0;
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
  }

  /* Divider line inside cards */
  .card-divider {
    border: none;
    border-top: 1px solid #3d3420;
    margin: 1.2rem 0;
  }

  /* Past self mode banner */
  .past-self-banner {
    background: linear-gradient(90deg, #141a24, #1a2030);
    border: 1px solid #4a6a9e;
    border-radius: 8px;
    padding: 0.9rem 1.2rem;
    text-align: center;
    color: #7ab0d8;
    font-size: 0.9rem;
    margin-bottom: 1rem;
  }

  /* Sidebar */
  [data-testid="stSidebar"] {
    background: #120f0a;
    border-right: 1px solid #3d3420;
  }
  [data-testid="stSidebar"] * { color: #c8b888 !important; }

  /* Input */
  [data-testid="stTextArea"] textarea {
    background: #16130d !important;
    color: #e8dfc6 !important;
    border: 1px solid #3d3420 !important;
    border-radius: 4px !important;
    font-family: 'Crimson Pro', serif !important;
    font-size: 1.05rem !important;
  }
  [data-testid="stTextArea"] textarea:focus {
    border-color: #8b6914 !important;
    box-shadow: 0 0 8px rgba(139,105,20,0.3) !important;
  }
  [data-testid="stTextInput"] input {
    background: #16130d !important;
    color: #e8dfc6 !important;
    border: 1px solid #3d3420 !important;
    border-radius: 4px !important;
    font-family: 'Crimson Pro', serif !important;
    font-size: 1.05rem !important;
  }

  /* Buttons */
  .stButton > button {
    background: #2a200a;
    color: #c8a84a;
    border: 1px solid #6b5010;
    border-radius: 4px;
    font-family: 'Crimson Pro', serif;
    font-size: 1rem;
    transition: all 0.2s;
  }
  .stButton > button:hover {
    background: #3a2c0e;
    border-color: #c8a84a;
    color: #f0d878;
  }

  .stButton.past-self-btn > button {
    background: #0e1520;
    color: #7ab0d8;
    border: 1px solid #3a5a88;
  }

  /* Guest button */
  .guest-btn > button {
    background: #161614 !important;
    color: #8a8a7a !important;
    border: 1px dashed #4a4a38 !important;
  }
  .guest-btn > button:hover {
    background: #1e1e18 !important;
    color: #b0b098 !important;
  }

  /* Divider */
  hr { border-color: #3d3420; }

  /* Tag pills in sidebar */
  .tag-pill {
    display: inline-block;
    background: #2a2416;
    border: 1px solid #4a3a18;
    border-radius: 12px;
    padding: 0.1rem 0.6rem;
    font-size: 0.78rem;
    margin: 2px;
    color: #b89858;
  }
</style>
""", unsafe_allow_html=True)

# ── Init ──────────────────────────────────────────────────────────────────────

db.init_db()

# Session state defaults
if "phase" not in st.session_state:
    st.session_state.phase = "login"
if "current_user" not in st.session_state:
    st.session_state.current_user = None
if "onboarding_step" not in st.session_state:
    st.session_state.onboarding_step = 0
if "chat_history" not in st.session_state:
    st.session_state.chat_history = []
if "past_self_history" not in st.session_state:
    st.session_state.past_self_history = []
if "consent_given" not in st.session_state:
    st.session_state.consent_given = False


def _advance_after_login(username: str):
    """Decide which phase to go to after successful login."""
    st.session_state.current_user = username
    st.session_state.consent_given = db.profile_is_complete()

    if not db.user_has_quick_profile(username):
        st.session_state.phase = "quick_profile"
    elif db.profile_is_complete():
        st.session_state.phase = "journaling"
    else:
        st.session_state.phase = "onboarding"
        st.session_state.onboarding_step = 0


# ── Sidebar ───────────────────────────────────────────────────────────────────

with st.sidebar:
    st.markdown("## 📖 AI of Memories")
    st.markdown("---")

    # API Key
    api_key = st.text_input(
        "Gemini API Key",
        value=os.getenv("GEMINI_API_KEY", ""),
        type="password",
        help="Tu clave se queda en local y nunca se comparte.",
        key="api_key_input"
    )

    st.markdown("---")

    entry_count = db.get_entry_count()
    st.markdown(f"**📝 Entradas:** {entry_count}")

    if st.session_state.current_user:
        username = st.session_state.current_user
        qp = db.get_quick_profile(username)
        alias = qp.get("alias") or username
        st.markdown(f"**👤 «{alias}»**")

    if st.session_state.phase not in ("login", "quick_profile", "onboarding"):
        st.markdown("---")

        # Mode toggle
        if st.session_state.phase == "journaling":
            if st.button("🕰️ Modo Yo Pasado", use_container_width=True):
                if entry_count == 0:
                    st.warning("Escribe al menos una entrada primero.")
                else:
                    st.session_state.phase = "past_self"
                    st.session_state.past_self_history = []
                    st.rerun()

        elif st.session_state.phase == "past_self":
            if st.button("📖 Volver al Diario", use_container_width=True):
                st.session_state.phase = "journaling"
                st.rerun()

        # Knowledge graph summary
        if entry_count > 0:
            st.markdown("---")
            st.markdown("**🧠 Memoria**")
            tags = db.get_all_tags()
            tag_types = list(set(t["tag_type"] for t in tags))
            for tt in tag_types:
                vals = [t["tag_value"] for t in tags if t["tag_type"] == tt][:3]
                preview = ", ".join(vals)
                st.markdown(
                    f'<span class="tag-pill">{tt}</span> <small style="color:#8a7a58">{preview[:50]}</small>',
                    unsafe_allow_html=True
                )

    if st.session_state.current_user:
        st.markdown("---")
        if st.button("🚪 Cerrar sesión", use_container_width=True):
            for key in list(st.session_state.keys()):
                del st.session_state[key]
            st.rerun()

    st.markdown("---")
    st.markdown(
        '<small style="color:#5a4a2a">Todos los datos se guardan en tu dispositivo.<br>'
        'Tus memorias te pertenecen.</small>',
        unsafe_allow_html=True
    )


# ── PHASE 0: Login / Register ─────────────────────────────────────────────────

def render_login():
    st.markdown("# 📖 AI of Memories")
    st.markdown("*Tu cápsula del tiempo personal.*")
    st.markdown("---")

    st.markdown('<div class="login-card">', unsafe_allow_html=True)
    st.markdown("### Accede a tu diario")
    st.markdown(
        "<small style='color:#8a7a58'>Escribe un nombre de usuario para crear tu espacio "
        "o recuperar el existente. También puedes entrar directamente como invitado.</small>",
        unsafe_allow_html=True
    )
    st.markdown("<hr class='card-divider'>", unsafe_allow_html=True)

    with st.form("login_form"):
        username_input = st.text_input(
            "Nombre de usuario (opcional)",
            placeholder="p. ej. jose, viajero_23, mi_yo_secreto…",
            key="login_username"
        )
        col1, col2 = st.columns(2)
        with col1:
            submit_named = st.form_submit_button("✨ Crear / Entrar", use_container_width=True)
        with col2:
            submit_guest = st.form_submit_button("👤 Entrar como invitado", use_container_width=True)

    st.markdown("</div>", unsafe_allow_html=True)

    if submit_named:
        raw = username_input.strip()
        uname = raw if raw else "invitado"
        db.create_user(uname)
        _advance_after_login(uname)
        st.rerun()

    if submit_guest:
        db.create_user("invitado")
        _advance_after_login("invitado")
        st.rerun()

    st.markdown(
        "<small style='color:#5a4a2a; display:block; text-align:center; margin-top:1.5rem'>"
        "No hay contraseñas. No hay servidores externos.<br>"
        "Todo queda en tu máquina.</small>",
        unsafe_allow_html=True
    )


# ── PHASE 0.5: Quick Profile (first time only) ────────────────────────────────

def render_quick_profile():
    username = st.session_state.current_user or "invitado"
    st.markdown("# 📖 Antes de empezar…")
    st.markdown("*Cuéntame un poco sobre ti para que el diario te conozca desde el primer día.*")
    st.markdown("---")

    st.markdown('<div class="profile-card">', unsafe_allow_html=True)
    st.markdown(
        "<small style='color:#8a7a58'>Todos los campos son opcionales — "
        "puedes dejarlos en blanco y continuar.</small>",
        unsafe_allow_html=True
    )
    st.markdown("")

    with st.form("quick_profile_form"):
        alias = st.text_input(
            "🏷️ ¿Cómo quieres que te llame?",
            placeholder="Tu alias o nombre preferido"
        )
        ocupacion = st.text_input(
            "💼 ¿A qué te dedicas?",
            placeholder="Estudiante, diseñador, músico en secreto…"
        )
        circulo = st.text_input(
            "🫂 ¿Cómo describes tu círculo social?",
            placeholder="Familia cercana, amigos del barrio, lobos solitarios…"
        )
        foco = st.text_input(
            "🎯 ¿Cuál es tu foco vital ahora mismo?",
            placeholder="Crecer profesionalmente, encontrar calma, crear cosas…"
        )
        submitted = st.form_submit_button("Empezar mi diario →", use_container_width=True)

    st.markdown("</div>", unsafe_allow_html=True)

    if submitted:
        db.set_quick_profile(
            username=username,
            alias=alias.strip() or username,
            ocupacion=ocupacion.strip() or "Sin respuesta",
            circulo=circulo.strip() or "Sin respuesta",
            foco=foco.strip() or "Sin respuesta",
        )
        # Advance to onboarding or journaling
        if db.profile_is_complete():
            st.session_state.phase = "journaling"
        else:
            st.session_state.phase = "onboarding"
            st.session_state.onboarding_step = 0
        st.rerun()


# ── PHASE 1: Onboarding ───────────────────────────────────────────────────────

def render_onboarding():
    st.markdown("# 📖 AI of Memories")
    st.markdown("*Tu cápsula del tiempo personal.*")
    st.markdown("---")

    if not st.session_state.consent_given:
        st.markdown("""
        ### Bienvenido.

        Este es un diario privado que hace algo especial: **te recuerda**.

        Cada entrada que escribas será clasificada suavemente — personas que mencionas,
        emociones que sientes, creencias que tienes — para que algún día tu **yo futuro**
        pueda mirar atrás y conversar con quien eres *ahora mismo*.

        **Esto es completamente transparente. Aquí está exactamente qué ocurre:**
        - 📝 Tus entradas se guardan localmente en este equipo.
        - 🏷️ Una IA lee cada entrada para extraer etiquetas de memoria estructuradas.
        - 🕰️ Puedes activar el "Modo Yo Pasado" para hablar con una simulación de ti mismo.
        - 🔒 Ningún dato sale de tu dispositivo salvo que tú lo elijas explícitamente.
        """)

        consent = st.checkbox(
            "Entiendo cómo se usarán mis entradas y consiento en construir mi perfil de Yo Pasado."
        )
        if consent:
            st.session_state.consent_given = True
            db.set_profile("consent", "true")
            st.rerun()
        return

    # Multi-step onboarding Q&A
    questions = ai.ONBOARDING_QUESTIONS
    step = st.session_state.onboarding_step

    if step >= len(questions):
        db.set_profile("onboarding_complete", "true")
        st.session_state.phase = "journaling"
        st.session_state.chat_history = []
        st.rerun()
        return

    q = questions[step]

    # Show all previous answers as read-only
    for i in range(step):
        prev_q = questions[i]
        st.markdown(f'<div class="ai-bubble">{prev_q["prompt"]}</div>', unsafe_allow_html=True)
        stored = db.get_profile().get(prev_q["store_key"], "")
        if stored:
            st.markdown(f'<div class="user-bubble">{stored}</div>', unsafe_allow_html=True)

    # Current question
    st.markdown(f'<div class="ai-bubble">{q["prompt"]}</div>', unsafe_allow_html=True)

    with st.form(key=f"onboarding_form_{step}"):
        answer = st.text_area("Tu respuesta:", height=120, placeholder="Escribe libremente…", key=f"ob_input_{step}")
        submitted = st.form_submit_button("Continuar →")

    if submitted and answer.strip():
        db.set_profile(q["store_key"], answer.strip())
        st.session_state.onboarding_step += 1
        st.rerun()


# ── PHASE 2: Daily Journaling ─────────────────────────────────────────────────

def render_journaling():
    st.markdown("# 📖 Entrada de hoy")

    api_key = st.session_state.get("api_key_input", "")
    if not api_key:
        st.warning("⚠️ Introduce tu clave API de Gemini en el panel lateral para continuar.", icon="🔑")
        return

    st.markdown("---")

    # Render existing chat history
    for msg in st.session_state.chat_history:
        css_class = "user-bubble" if msg["role"] == "user" else "ai-bubble"
        st.markdown(f'<div class="{css_class}">{msg["content"]}</div>', unsafe_allow_html=True)

    st.markdown("")

    # Entry form
    with st.form(key="journal_form", clear_on_submit=True):
        entry = st.text_area(
            "Escribe tu entrada…",
            height=160,
            placeholder="¿Qué pasó hoy? ¿Cómo te sientes? No te contengas.",
            label_visibility="collapsed"
        )
        submitted = st.form_submit_button("✍️ Añadir al Diario")

    if submitted and entry.strip():
        profile = db.get_profile()
        knowledge_summary = db.get_knowledge_summary()

        # Enrich profile with quick profile data
        username = st.session_state.current_user or "invitado"
        qp = db.get_quick_profile(username)
        if qp:
            profile["alias"] = qp.get("alias", "")
            profile["ocupacion"] = qp.get("ocupacion", "")
            profile["circulo_social"] = qp.get("circulo", "")
            profile["foco_vital"] = qp.get("foco", "")

        history_for_ai = [
            {"role": "user" if m["role"] == "user" else "model", "content": m["content"]}
            for m in st.session_state.chat_history
        ]

        with st.spinner("📝 Escribiendo nota al margen…"):
            try:
                response = ai.get_journaling_response(
                    api_key=api_key,
                    user_entry=entry,
                    profile=profile,
                    conversation_history=history_for_ai,
                    knowledge_summary=knowledge_summary,
                )
            except Exception as e:
                response = f"*(Algo salió mal: {e})*"

        entry_id = db.save_entry(content=entry, ai_response=response)

        try:
            tags = ai.extract_knowledge_tags(api_key=api_key, entry=entry)
            if tags:
                db.save_tags(entry_id=entry_id, tags=tags)
        except Exception:
            pass

        st.session_state.chat_history.append({"role": "user", "content": entry})
        st.session_state.chat_history.append({"role": "assistant", "content": response})

        st.rerun()


# ── PHASE 3: Past Self Mode ───────────────────────────────────────────────────

def render_past_self():
    profile = db.get_profile()
    all_entries = db.get_all_entries()
    knowledge_summary = db.get_knowledge_summary()

    if all_entries:
        first_date = all_entries[0]["created_at"][:10]
        last_date = all_entries[-1]["created_at"][:10]
        date_range = f"{first_date} – {last_date}"
    else:
        date_range = "sin entradas aún"

    st.markdown(
        f'<div class="past-self-banner">'
        f'🕰️ <strong>Modo Yo Pasado Activo</strong><br>'
        f'<small>Estás hablando con tu yo pasado de <em>{date_range}</em>. '
        f'Las respuestas se basan estrictamente en lo que escribiste en tu diario.</small>'
        f'</div>',
        unsafe_allow_html=True
    )

    api_key = st.session_state.get("api_key_input", "")
    if not api_key:
        st.warning("⚠️ Introduce tu clave API de Gemini en el panel lateral.", icon="🔑")
        return

    for msg in st.session_state.past_self_history:
        if msg["role"] == "user":
            st.markdown(f'<div class="user-bubble">{msg["content"]}</div>', unsafe_allow_html=True)
        else:
            st.markdown(f'<div class="past-self-bubble">{msg["content"]}</div>', unsafe_allow_html=True)

    st.markdown("")

    with st.form(key="past_self_form", clear_on_submit=True):
        message = st.text_area(
            "Pregunta a tu yo pasado…",
            height=120,
            placeholder="¿Qué te preocupaba entonces? ¿Qué te hacía feliz?",
            label_visibility="collapsed"
        )
        submitted = st.form_submit_button("💬 Enviar")

    if submitted and message.strip():
        history_for_ai = [
            {"role": "user" if m["role"] == "user" else "model", "content": m["content"]}
            for m in st.session_state.past_self_history
        ]

        with st.spinner("🕰️ Buscando en el pasado…"):
            try:
                response = ai.get_past_self_response(
                    api_key=api_key,
                    user_message=message,
                    profile=profile,
                    knowledge_summary=knowledge_summary,
                    all_entries=all_entries,
                    conversation_history=history_for_ai,
                )
            except Exception as e:
                response = f"*(Algo salió mal: {e})*"

        st.session_state.past_self_history.append({"role": "user", "content": message})
        st.session_state.past_self_history.append({"role": "assistant", "content": response})
        st.rerun()


# ── Router ────────────────────────────────────────────────────────────────────

phase = st.session_state.phase

if phase == "login":
    render_login()
elif phase == "quick_profile":
    render_quick_profile()
elif phase == "onboarding":
    render_onboarding()
elif phase == "journaling":
    render_journaling()
elif phase == "past_self":
    render_past_self()
