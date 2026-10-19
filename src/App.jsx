import { useEffect, useState } from 'react'
import { Flower2, Heart, Leaf, Send, Sparkles, X } from 'lucide-react'
import { isConfigured, supabase } from './supabase'

const flowerTypes = [
  { id: 'orquidea', name: 'Orquídea', symbol: '🌸', color: '#ef8fd2', note: 'Flor nacional de Colombia' },
  { id: 'cayena', name: 'Cayena', symbol: '🌺', color: '#f16c6c', note: 'Tropical y luminosa' },
  { id: 'rosa', name: 'Rosa', symbol: '🌹', color: '#e76b84', note: 'Delicada y especial' },
  { id: 'heliconia', name: 'Heliconia', symbol: '🌼', color: '#f5b94b', note: 'Inspirada en nuestros trópicos' },
  { id: 'buganvilia', name: 'Buganvilia', symbol: '💮', color: '#cf78dd', note: 'Llena de color' },
  { id: 'pasionaria', name: 'Flor de la pasión', symbol: '🏵️', color: '#8c7bd6', note: 'Sorprendente y única' },
]
const spots = [
  [31,27],[56,18],[74,33],[24,44],[45,38],[65,49],[36,57],[77,59],[52,64],[17,62],
  [84,44],[48,23],[30,72],[62,75],[17,32],[72,19],[40,47],[57,55],[25,19],[81,72],
  [42,14],[15,51],[70,65],[52,32]
]
const flowerFor = (idea, index) => flowerTypes.find(f => f.id === idea.flower_type) || flowerTypes[index % flowerTypes.length]

function Tree({ ideas, onSelect }) {
  return <div className="tree-scene" aria-label="Jardín colombiano de ideas">
    <div className="tree-light" />
    {ideas.map((idea,index) => {
      const flower = flowerFor(idea,index)
      const [x,y] = spots[index % spots.length]
      const ring = Math.floor(index / spots.length)
      return <button key={idea.id} className="bloom" style={{left:`${Math.min(88,Math.max(12,x + ring*3 - ring%2*7))}%`,top:`${Math.min(80,Math.max(13,y + ring*4 - ring%2*8))}%`, '--flower-glow':flower.color,animationDelay:`${(index%8)*0.1}s`}} title={`Leer idea de ${idea.name}`} aria-label={`Flor ${flower.name}: idea de ${idea.name}`} onClick={()=>onSelect(idea)}>
        <span aria-hidden="true">{flower.symbol}</span>
      </button>
    })}
    <div className="scene-caption"><Leaf size={16}/> Cada idea es una flor que hace crecer nuestro árbol</div>
  </div>
}

export default function App() {
  const [ideas,setIdeas] = useState([])
  const [name,setName] = useState('')
  const [message,setMessage] = useState('')
  const [flowerType,setFlowerType] = useState('orquidea')
  const [selected,setSelected] = useState(null)
  const [showForm,setShowForm] = useState(false)
  const [loading,setLoading] = useState(false)
  const [status,setStatus] = useState('')
  const [supportsFlower,setSupportsFlower] = useState(true)

  useEffect(()=>{
    if (!isConfigured) { setStatus('Modo demostración: configura Supabase para compartir ideas.'); return }
    let active=true
    const load = async()=>{
      const {data,error}=await supabase.from('ideas').select('*').order('created_at',{ascending:true})
      if (!active) return
      if(error) setStatus('No se pudieron cargar las ideas. Comprueba la conexión con Supabase.')
      else {setIdeas(data||[]);setSupportsFlower(data?.length ? Object.prototype.hasOwnProperty.call(data[0],'flower_type') : true)}
    }
    load()
    const channel=supabase.channel('ideas-jardin-live').on('postgres_changes',{event:'*',schema:'public',table:'ideas'},load).subscribe()
    return ()=>{active=false;supabase.removeChannel(channel)}
  },[])

  async function submitIdea(event){
    event.preventDefault()
    const clean=message.trim()
    if(clean.length<4){setStatus('Escribe una idea de al menos 4 caracteres.');return}
    setLoading(true);setStatus('')
    const payload={name:name.trim().slice(0,40)||'Una persona del equipo',message:clean}
    if(isConfigured){
      // If the SQL migration has not been run, preserve the ability to post ideas.
      let result=await supabase.from('ideas').insert(supportsFlower?{...payload,flower_type:flowerType}:payload).select().single()
      if(result.error && (result.error.code==='PGRST204'||result.error.code==='42703')){
        setSupportsFlower(false)
        result=await supabase.from('ideas').insert(payload).select().single()
        if(!result.error)setStatus('Idea guardada. Para conservar la especie elegida, ejecuta la migración SQL incluida.')
      }
      if(result.error){setStatus('No se pudo guardar. Revisa la conexión o las políticas de Supabase.');setLoading(false);return}
      setIdeas(prev=>prev.some(item=>item.id===result.data.id)?prev:[...prev,result.data])
    } else {
      setIdeas(prev=>[...prev,{...payload,flower_type:flowerType,id:`demo-${Date.now()}`,created_at:new Date().toISOString()}])
      setStatus('Idea de demostración: no se guardó en la nube.')
    }
    setName('');setMessage('');setShowForm(false);setLoading(false)
  }
  const selectedFlower=selected ? flowerFor(selected,ideas.findIndex(i=>i.id===selected.id)) : null
  return <main className="app-shell">
    <header className="topbar"><div className="brand-mark"><Leaf size={24}/></div><div className="brand-copy"><strong>ÁRBOL DE IDEAS</strong><small>Juntos florecemos en el servicio</small></div><span className="top-pill"><span className="live-dot"/> Jardín colaborativo</span></header>
    <section className="hero"><span className="eyebrow"><Sparkles size={15}/> FLORECEMOS CON GRANDES IDEAS</span><h1>Un árbol de ideas,<br/><em>mil maneras de cuidar.</em></h1><p className="subintro">¿Cómo podemos diferenciarnos? Comparte una propuesta para hacer que cada persona se sienta escuchada, cuidada y especial.</p><div className="hero-actions"><button className="primary-button" onClick={()=>{setStatus('');setShowForm(true)}}><Leaf size={18}/> Sembrar mi idea</button><div className="idea-counter"><strong>{ideas.length}</strong><span>{ideas.length===1?'idea sembrada':'ideas sembradas'}</span></div></div></section>
    <section className="garden-card"><div className="garden-heading"><div><span className="section-kicker">NUESTRO JARDÍN COLOMBIANO</span><h2>Cada flor guarda una historia</h2></div><span className="garden-decoration">🦋</span></div><Tree ideas={ideas} onSelect={setSelected}/><p className="tap-hint">🌺 Toca una flor para descubrir la idea que guarda.</p></section>
    <section className="bottom-note"><Heart size={23}/><div><strong>La diferencia está en cómo hacemos sentir.</strong><p>Una idea, una flor, una oportunidad para mejorar juntos.</p></div></section>
    <footer>Hecho con cariño para florecer en equipo 🌿</footer>
    {showForm&&<div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setShowForm(false)}}><section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="form-title"><button className="close-button" onClick={()=>setShowForm(false)} aria-label="Cerrar"><X size={20}/></button><div className="modal-flower">🌸</div><span className="section-kicker">SIEMBRA TU IDEA</span><h2 id="form-title">¿Cómo podemos diferenciarnos?</h2><p className="modal-description">Elige una flor colombiana y escribe una idea que ayude a nuestro equipo a crecer.</p><form onSubmit={submitIdea}><label htmlFor="person-name">Tu nombre (opcional)</label><input id="person-name" value={name} onChange={e=>setName(e.target.value)} maxLength={40} placeholder="¿Quién comparte esta idea?"/><label>Escoge tu flor favorita</label><div className="flower-choices">{flowerTypes.map(f=><button type="button" key={f.id} className={`flower-choice ${flowerType===f.id?'active':''}`} onClick={()=>setFlowerType(f.id)} aria-pressed={flowerType===f.id}><span>{f.symbol}</span><small>{f.name}</small></button>)}</div><label htmlFor="idea-message">Mi idea para diferenciarnos *</label><textarea id="idea-message" value={message} onChange={e=>setMessage(e.target.value)} maxLength={280} rows={4} required placeholder="Podemos diferenciarnos cuando..."/><div className="character-count">{message.length}/280 caracteres</div>{status&&<p className="status-message">{status}</p>}<button type="submit" className="primary-button submit-button" disabled={loading}><Send size={17}/>{loading?'Sembrando…':'Sembrar mi flor'}</button></form></section></div>}
    {selected&&<div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setSelected(null)}}><section className="idea-modal" role="dialog" aria-modal="true" aria-labelledby="idea-title"><button className="close-button" onClick={()=>setSelected(null)} aria-label="Cerrar"><X size={20}/></button><div className="big-flower">{selectedFlower.symbol}</div><span className="section-kicker">{selectedFlower.name.toUpperCase()} · UNA IDEA PARA CRECER</span><h2 id="idea-title">Una flor de nuestro jardín</h2><blockquote>“{selected.message}”</blockquote><div className="idea-author"><span className="author-avatar">{(selected.name||'A')[0].toUpperCase()}</span><span><small>Compartida por</small><strong>{selected.name||'Una persona del equipo'}</strong></span></div><button className="secondary-button" onClick={()=>setSelected(null)}>Seguir explorando <Leaf size={16}/></button></section></div>}
  </main>
}
