import { useEffect, useMemo, useState } from 'react'
import { Flower2, Heart, Leaf, MessageCircle, Plus, Send, Sparkles, X } from 'lucide-react'
import { isConfigured, supabase } from './supabase'

const demoIdeas = [
  { id: 'd1', name: 'Ana', message: 'Escuchar con atención y hacer que cada persona se sienta importante.', created_at: new Date().toISOString() },
  { id: 'd2', name: 'Carlos', message: 'Explicar cada procedimiento con palabras sencillas y con paciencia.', created_at: new Date().toISOString() },
  { id: 'd3', name: 'María', message: 'Saludar con una sonrisa, llamar al paciente por su nombre y tratarlo con respeto.', created_at: new Date().toISOString() },
  { id: 'd4', name: 'Equipo Vita', message: 'Acompañar al paciente y a su familia, no solo atender una cita.', created_at: new Date().toISOString() },
  { id: 'd5', name: 'Julián', message: 'Cumplir lo que prometemos y mantener informadas a las personas.', created_at: new Date().toISOString() },
  { id: 'd6', name: 'Luisa', message: 'Tener empatía, incluso cuando el día está lleno de tareas.', created_at: new Date().toISOString() }
]

const flowerSpots = [
  { x: 18, y: 29, r: -12 }, { x: 34, y: 18, r: 8 }, { x: 51, y: 28, r: -5 },
  { x: 69, y: 19, r: 13 }, { x: 82, y: 34, r: -8 }, { x: 26, y: 43, r: 9 },
  { x: 43, y: 40, r: -14 }, { x: 62, y: 43, r: 7 }, { x: 75, y: 51, r: -4 },
  { x: 15, y: 56, r: 12 }, { x: 35, y: 57, r: -7 }, { x: 54, y: 58, r: 10 },
  { x: 68, y: 66, r: -12 }, { x: 27, y: 70, r: 5 }, { x: 46, y: 74, r: -9 },
  { x: 83, y: 71, r: 8 }, { x: 58, y: 17, r: -6 }, { x: 9, y: 39, r: 7 },
  { x: 89, y: 48, r: -11 }, { x: 39, y: 31, r: 4 }, { x: 73, y: 29, r: -7 },
  { x: 20, y: 65, r: 10 }, { x: 61, y: 35, r: -8 }, { x: 49, y: 48, r: 6 }
]

function Flower({ idea, index, onClick }) {
  const spot = flowerSpots[index % flowerSpots.length]
  return (
    <button
      className="flower-pin"
      style={{ left: `${spot.x}%`, top: `${spot.y}%`, '--tilt': `${spot.r}deg` }}
      onClick={() => onClick(idea)}
      aria-label={`Leer idea de ${idea.name || 'una persona'}`}
      title="Toca para leer esta idea"
    >
      <svg viewBox="0 0 64 64" className="flower-svg" aria-hidden="true">
        <ellipse cx="32" cy="15" rx="9" ry="13" fill="#8fcfff" />
        <ellipse cx="47" cy="25" rx="9" ry="13" transform="rotate(55 47 25)" fill="#58b5f4" />
        <ellipse cx="43" cy="43" rx="9" ry="13" transform="rotate(125 43 43)" fill="#9bd8ff" />
        <ellipse cx="21" cy="44" rx="9" ry="13" transform="rotate(45 21 44)" fill="#5eb9f7" />
        <ellipse cx="16" cy="25" rx="9" ry="13" transform="rotate(-55 16 25)" fill="#b7e4ff" />
        <circle cx="32" cy="31" r="9.5" fill="#f8d77a" stroke="#fff5c9" strokeWidth="2" />
        <circle cx="29" cy="28" r="2" fill="#fff4bf" />
      </svg>
      <span className="flower-dot" />
    </button>
  )
}

function TreeArt({ ideas, onSelect }) {
  return (
    <div className="tree-stage">
      <div className="sun-glow" />
      <svg className="tree-svg" viewBox="0 0 600 570" role="img" aria-label="Árbol azul que representa el crecimiento de nuestras ideas">
        <defs>
          <linearGradient id="trunk" x1="0" x2="1">
            <stop offset="0%" stopColor="#7b9f88" />
            <stop offset="55%" stopColor="#a7c5a5" />
            <stop offset="100%" stopColor="#6c947c" />
          </linearGradient>
          <linearGradient id="canopy" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#e2f5ff" />
            <stop offset="100%" stopColor="#b6e2fb" />
          </linearGradient>
        </defs>
        <ellipse cx="300" cy="520" rx="165" ry="19" fill="#b7d9e7" opacity=".55" />
        <path d="M279 516 C287 450 279 409 289 360 C298 320 277 285 255 256 L219 214 L233 207 L276 248 C271 211 249 179 224 160 L239 153 C274 180 292 216 300 250 C314 207 341 173 378 151 L391 161 C354 193 333 226 320 267 L364 228 L378 237 L323 294 C323 337 309 374 318 420 C324 457 324 487 329 516 Z" fill="url(#trunk)" />
        <path d="M295 394 C260 365 229 351 194 349 L198 336 C238 337 274 353 300 378 M307 343 C344 317 376 309 410 315 L408 329 C374 324 340 337 311 361" fill="none" stroke="#86ad91" strokeWidth="13" strokeLinecap="round" />
        <g fill="url(#canopy)" stroke="#c5e9fa" strokeWidth="2">
          <circle cx="227" cy="196" r="86"/><circle cx="306" cy="154" r="104"/><circle cx="391" cy="199" r="82"/>
          <circle cx="185" cy="264" r="66"/><circle cx="307" cy="251" r="100"/><circle cx="414" cy="267" r="69"/>
          <circle cx="245" cy="315" r="58"/><circle cx="365" cy="320" r="61"/>
        </g>
        <g fill="#fff" opacity=".48">
          <circle cx="198" cy="175" r="8"/><circle cx="280" cy="109" r="10"/><circle cx="369" cy="172" r="7"/>
          <circle cx="232" cy="272" r="6"/><circle cx="338" cy="223" r="8"/><circle cx="419" cy="253" r="6"/>
        </g>
        <path d="M180 520 Q300 490 420 520" fill="none" stroke="#a7c9b3" strokeWidth="3" strokeLinecap="round" />
      </svg>
      {ideas.map((idea, i) => <Flower key={idea.id} idea={idea} index={i} onClick={onSelect} />)}
      <div className="tree-caption"><span className="caption-leaf"><Leaf size={16} /></span> Cada idea hace florecer nuestra atención</div>
    </div>
  )
}

export default function App() {
  const [ideas, setIdeas] = useState(demoIdeas)
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [selected, setSelected] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isConfigured) return
    let active = true
    const load = async () => {
      const { data, error } = await supabase.from('ideas').select('*').order('created_at', { ascending: true })
      if (!active) return
      if (!error) setIdeas(data || [])
      else setStatus('No se pudieron cargar las ideas. Intenta actualizar la página.')
    }
    load()
    const channel = supabase.channel('ideas-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ideas' }, load)
      .subscribe()
    return () => { active = false; supabase.removeChannel(channel) }
  }, [])

  const flowerCount = ideas.length
  const sortedIdeas = useMemo(() => ideas, [ideas])

  async function submitIdea(e) {
    e.preventDefault()
    const cleanMessage = message.trim()
    if (cleanMessage.length < 4) {
      setStatus('Comparte una frase un poquito más larga para que pueda florecer 🌸')
      return
    }
    if (cleanMessage.length > 280) {
      setStatus('Tu idea debe tener máximo 280 caracteres.')
      return
    }
    setLoading(true)
    setStatus('')
    const newIdea = {
      id: `local-${Date.now()}`,
      name: name.trim().slice(0, 40) || 'Una persona del equipo',
      message: cleanMessage,
      created_at: new Date().toISOString()
    }
    if (isConfigured) {
      const { data, error } = await supabase.from('ideas').insert({
        name: newIdea.name,
        message: newIdea.message
      }).select().single()
      if (error) {
        setStatus('No se pudo publicar. Revisa tu conexión e inténtalo de nuevo.')
        setLoading(false)
        return
      }
      setIdeas(prev => [...prev, data])
    } else {
      setIdeas(prev => [...prev, newIdea])
      setStatus('Vista de demostración: configura Supabase para que todos vean las ideas desde sus dispositivos.')
    }
    setMessage('')
    setName('')
    setShowForm(false)
    setLoading(false)
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand-mark"><Flower2 size={23} strokeWidth={1.8} /></div>
        <div className="brand-copy"><span>CLÍNICA VITA</span><small>Cultura de servicio</small></div>
        <div className="top-pill"><span className="live-dot" /> Mural colaborativo</div>
      </header>

      <section className="hero">
        <div className="eyebrow"><Sparkles size={15} /> UNA IDEA PUEDE CAMBIARLO TODO</div>
        <h1>Hagamos florecer<br /><em>una atención diferente.</em></h1>
        <p className="intro">¿Cómo podemos diferenciarnos?</p>
        <p className="subintro">Comparte una idea para que cada persona que llegue a Vita se sienta escuchada, cuidada y especial. Tu frase será una flor en nuestro árbol.</p>
        <div className="hero-actions">
          <button className="primary-button" onClick={() => { setShowForm(true); setStatus('') }}><Plus size={18} /> Dejar mi idea</button>
          <div className="idea-counter"><span className="counter-icon"><Flower2 size={18} /></span><span><strong>{flowerCount}</strong><small>{flowerCount === 1 ? 'idea floreciendo' : 'ideas floreciendo'}</small></span></div>
        </div>
      </section>

      <section className="garden-card" aria-label="Árbol colaborativo de ideas">
        <div className="garden-heading"><div><span className="section-kicker">NUESTRO JARDÍN</span><h2>Un árbol, muchas formas de cuidar</h2></div><div className="blue-flower-mini"><Flower2 size={24} /></div></div>
        <div className="tree-wrap">
          <TreeArt ideas={sortedIdeas} onSelect={setSelected} />
        </div>
        <div className="tap-hint"><span className="hint-dot" /> Toca cualquier flor para descubrir la idea que guarda.</div>
      </section>

      <section className="bottom-note">
        <div className="note-icon"><Heart size={21} /></div>
        <div><strong>La diferencia está en cómo hacemos sentir.</strong><p>La tecnología ayuda. La empatía nos hace inolvidables.</p></div>
        <div className="note-sparkle"><Sparkles size={22} /></div>
      </section>
      <footer>Hecho con cuidado, para crecer en equipo <span>✿</span></footer>

      {showForm && <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) setShowForm(false) }}>
        <section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="form-title">
          <button className="close-button" onClick={() => setShowForm(false)} aria-label="Cerrar"><X size={20} /></button>
          <div className="modal-flower"><Flower2 size={30} /></div>
          <span className="section-kicker">TU IDEA MERECE FLORECER</span>
          <h2 id="form-title">¿Cómo podemos diferenciarnos?</h2>
          <p className="modal-description">Piensa en un gesto, una actitud o una acción que haga la atención más humana.</p>
          <form onSubmit={submitIdea}>
            <label htmlFor="person-name">Tu nombre <span>(opcional)</span></label>
            <input id="person-name" value={name} onChange={e => setName(e.target.value)} maxLength={40} placeholder="¿Quién comparte esta idea?" />
            <label htmlFor="idea-message">Mi idea para diferenciarnos <span className="required">*</span></label>
            <textarea id="idea-message" value={message} onChange={e => setMessage(e.target.value)} maxLength={280} rows={4} required placeholder="Podemos diferenciarnos cuando..." />
            <div className="character-count">{message.length}/280 caracteres</div>
            {status && <p className="status-message">{status}</p>}
            <button className="primary-button submit-button" type="submit" disabled={loading}><Send size={17} /> {loading ? 'Publicando…' : 'Hacer florecer mi idea'}</button>
          </form>
          <p className="privacy-note"><Heart size={13} /> Comparte con respeto. Cada aporte suma.</p>
        </section>
      </div>}

      {selected && <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) setSelected(null) }}>
        <section className="idea-modal" role="dialog" aria-modal="true" aria-labelledby="idea-title">
          <button className="close-button" onClick={() => setSelected(null)} aria-label="Cerrar"><X size={20} /></button>
          <div className="big-flower"><Flower2 size={42} strokeWidth={1.5} /></div>
          <span className="section-kicker">UNA FLOR DE NUESTRO ÁRBOL</span>
          <h2 id="idea-title">Una idea para diferenciarnos</h2>
          <blockquote>“{selected.message}”</blockquote>
          <div className="idea-author"><span className="author-avatar">{(selected.name || 'V').charAt(0).toUpperCase()}</span><span><small>Compartida por</small><strong>{selected.name || 'Una persona del equipo'}</strong></span></div>
          <button className="secondary-button" onClick={() => setSelected(null)}>Seguir explorando el árbol <Leaf size={16} /></button>
        </section>
      </div>}
    </main>
  )
}
