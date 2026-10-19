import { useEffect, useState } from 'react'
import { Flower2, Heart, Leaf, Send, Sparkles, X } from 'lucide-react'
import { isConfigured, supabase } from './supabase'

const asset = (file) => `${import.meta.env.BASE_URL}${file}`

const flowerTypes = [
  { id: 'orquidea_rosada', name: 'Orquídea rosada', image: asset('01_orquidea_rosada.png') },
  { id: 'orquidea_blanca', name: 'Orquídea blanca', image: asset('02_orquidea_blanca.png') },
  { id: 'orquidea_morada', name: 'Orquídea morada', image: asset('03_orquidea_morada.png') },
  { id: 'cayena_amarilla', name: 'Cayena amarilla', image: asset('04_cayena_amarilla.png') },
  { id: 'cayena_roja', name: 'Cayena roja', image: asset('05_cayena_roja.png') },
  { id: 'buganvilia_rosada', name: 'Buganvilia rosada', image: asset('06_buganvilia_rosada.png') },
  { id: 'heliconia', name: 'Heliconia', image: asset('07_heliconia.png') },
  { id: 'ave_del_paraiso', name: 'Ave del paraíso', image: asset('08_ave_del_paraiso.png') },
  { id: 'flor_amarilla', name: 'Flor amarilla', image: asset('09_flor_amarilla.png') },
  { id: 'flor_rosada', name: 'Flor rosada', image: asset('10_flor_rosada.png') },
  { id: 'flor_morada', name: 'Flor morada', image: asset('11_flor_morada.png') },
  { id: 'gardenia', name: 'Gardenia', image: asset('12_gardenia.png') },
  { id: 'girasol', name: 'Girasol', image: asset('13_girasol.png') },
  { id: 'jengibre_rojo', name: 'Jengibre rojo', image: asset('14_jengibre_rojo.png') },
  { id: 'hortensia', name: 'Hortensia', image: asset('15_hortensia.png') },
  { id: 'anturio', name: 'Anturio', image: asset('16_anturio.png') },
  { id: 'lirio_naranja', name: 'Lirio naranja', image: asset('17_lirio_naranja.png') },
  { id: 'lirio_blanco', name: 'Lirio blanco', image: asset('18_lirio_blanco.png') },
  { id: 'plumeria', name: 'Plumeria', image: asset('19_plumeria.png') },
  { id: 'pasionaria', name: 'Pasionaria', image: asset('20_pasionaria.png') },
]

// Puntos repartidos sobre la copa; cada idea mantiene su lugar al recargar.
const spots = [
  [27,29],[43,20],[61,24],[76,35],[19,43],[36,39],[53,36],[69,48],
  [83,51],[27,57],[43,51],[58,60],[73,64],[18,60],[35,69],[51,72],
  [64,18],[33,18],[78,23],[48,30],[23,35],[62,43],[40,63],[81,69]
]
const legacyFlowers = { orquidea:'orquidea_rosada', cayena:'cayena_roja', rosa:'flor_rosada', buganvilia:'buganvilia_rosada' }
const flowerFor = (idea, index) => {
  const id = legacyFlowers[idea.flower_type] || idea.flower_type
  return flowerTypes.find(f => f.id === id) || flowerTypes[index % flowerTypes.length]
}
function flowerPosition(index) {
  const [x,y] = spots[index % spots.length]
  const layer = Math.floor(index / spots.length)
  // Variación suave y determinista para que no cambien de posición al actualizar.
  return { left:`${Math.max(14,Math.min(86,x + Math.sin(layer*2.7 + index)*Math.min(layer*3,8)))}%`, top:`${Math.max(14,Math.min(75,y + Math.cos(layer*1.9 + index)*Math.min(layer*2,7)))}%` }
}
function Tree({ ideas, onSelect }) {
  return <div className="tree-scene" style={{backgroundImage:`url("${asset('arbol-base.png')}")`}} aria-label="Árbol de ideas colombiano">
    <div className="tree-light" />
    {ideas.map((idea,index) => {
      const flower = flowerFor(idea,index)
      return <button key={idea.id} type="button" className="bloom" style={{...flowerPosition(index), animationDelay:`${(index%8)*0.08}s`}} title={`Leer idea de ${idea.name}`} aria-label={`${flower.name}: idea de ${idea.name}`} onClick={()=>onSelect(idea)}>
        <img src={flower.image} alt="" loading="lazy" />
      </button>
    })}
    <div className="scene-caption"><Leaf size={16}/> Cada idea hace florecer nuestro árbol</div>
  </div>
}

export default function App() {
  const [ideas,setIdeas] = useState([])
  const [name,setName] = useState('')
  const [message,setMessage] = useState('')
  const [flowerType,setFlowerType] = useState('orquidea_rosada')
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
        if(!result.error)console.info('La columna flower_type no existe; la idea se guardó sin especie. Ejecuta la migración SQL para conservarla.')
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
    <section className="garden-card"><div className="garden-heading"><div><span className="section-kicker">NUESTRO JARDÍN COLOMBIANO</span><h2>Cada flor guarda una historia</h2></div><span className="garden-decoration"><Flower2 size={29}/></span></div><Tree ideas={ideas} onSelect={setSelected}/><p className="tap-hint">Toca una flor para descubrir la idea que guarda.</p></section>
    <section className="bottom-note"><Heart size={23}/><div><strong>La diferencia está en cómo hacemos sentir.</strong><p>Una idea, una flor, una oportunidad para mejorar juntos.</p></div></section>
    <footer>Hecho con cariño para florecer en equipo 🌿</footer>
    {showForm&&<div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setShowForm(false)}}><section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="form-title"><button className="close-button" onClick={()=>setShowForm(false)} aria-label="Cerrar"><X size={20}/></button><div className="modal-flower"><img src={flowerTypes[0].image} alt="Orquídea rosada" /></div><span className="section-kicker">SIEMBRA TU IDEA</span><h2 id="form-title">¿Cómo podemos diferenciarnos?</h2><p className="modal-description">Elige una flor colombiana y escribe una idea que ayude a nuestro equipo a crecer.</p><form onSubmit={submitIdea}><label htmlFor="person-name">Tu nombre (opcional)</label><input id="person-name" value={name} onChange={e=>setName(e.target.value)} maxLength={40} placeholder="¿Quién comparte esta idea?"/><label>Escoge tu flor favorita</label><div className="flower-choices">{flowerTypes.map(f=><button type="button" key={f.id} className={`flower-choice ${flowerType===f.id?'active':''}`} onClick={()=>setFlowerType(f.id)} aria-pressed={flowerType===f.id}><img src={f.image} alt="" loading="lazy" /><small>{f.name}</small></button>)}</div><label htmlFor="idea-message">Mi idea para diferenciarnos *</label><textarea id="idea-message" value={message} onChange={e=>setMessage(e.target.value)} maxLength={280} rows={4} required placeholder="Podemos diferenciarnos cuando..."/><div className="character-count">{message.length}/280 caracteres</div>{status&&<p className="status-message">{status}</p>}<button type="submit" className="primary-button submit-button" disabled={loading}><Send size={17}/>{loading?'Sembrando…':'Sembrar mi flor'}</button></form></section></div>}
    {selected&&<div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setSelected(null)}}><section className="idea-modal" role="dialog" aria-modal="true" aria-labelledby="idea-title"><button className="close-button" onClick={()=>setSelected(null)} aria-label="Cerrar"><X size={20}/></button><div className="big-flower"><img src={selectedFlower.image} alt={selectedFlower.name}/></div><span className="section-kicker">{selectedFlower.name.toUpperCase()} · UNA IDEA PARA CRECER</span><h2 id="idea-title">Una flor de nuestro jardín</h2><blockquote>“{selected.message}”</blockquote><div className="idea-author"><span className="author-avatar">{(selected.name||'A')[0].toUpperCase()}</span><span><small>Compartida por</small><strong>{selected.name||'Una persona del equipo'}</strong></span></div><button className="secondary-button" onClick={()=>setSelected(null)}>Seguir explorando <Leaf size={16}/></button></section></div>}
  </main>
}
