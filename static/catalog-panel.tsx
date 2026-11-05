import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowUpRight, Bookmark, Check, ChevronRight, Grid2X2, House, Layers3, Search, Wifi, WifiOff, X } from 'lucide-react';
import { categories } from '../lib/catalog';
import { productUrl, siteProducts as modules, type SiteProduct as Module } from '../lib/site-catalog';
import { media, mediaForModule } from '../lib/media';

const savedKey = 'cardnet.saved-solutions.v1';
export default function CatalogPanel() {
  const [selected, setSelected] = useState<Module>();
  const [saved, setSaved] = useState<string[]>([]);
  const [view, setView] = useState<'catalog' | 'saved'>('catalog');
  const [category, setCategory] = useState('Todas');
  const [query, setQuery] = useState('');
  const [online, setOnline] = useState(true);
  const [message, setMessage] = useState('');
  useEffect(() => {
    const syncRoute = () => setSelected(modules.find(m => m.id === new URLSearchParams(window.location.search).get('solucion')));
    const syncSaved = () => {
      try { const value = JSON.parse(localStorage.getItem(savedKey) || '[]'); setSaved(Array.isArray(value) ? value.filter(id => typeof id === 'string' && modules.some(m => m.id === id)) : []); } catch { setSaved([]); }
    };
    const syncNetwork = () => setOnline(navigator.onLine);
    syncRoute(); syncSaved(); syncNetwork();
    window.addEventListener('popstate', syncRoute); window.addEventListener('storage', syncSaved);
    window.addEventListener('online', syncNetwork); window.addEventListener('offline', syncNetwork);
    return () => { window.removeEventListener('popstate', syncRoute); window.removeEventListener('storage', syncSaved); window.removeEventListener('online', syncNetwork); window.removeEventListener('offline', syncNetwork); };
  }, []);
  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(() => setMessage(''), 3200);
    return () => clearTimeout(timer);
  }, [message]);
  function toggleSaved(id: string) {
    const next = saved.includes(id) ? saved.filter(value => value !== id) : [...saved, id];
    setSaved(next);
    try { localStorage.setItem(savedKey, JSON.stringify(next)); setMessage(next.includes(id) ? 'Solución guardada.' : 'Solución retirada de guardadas.'); }
    catch { setMessage('Tu selección se conserva durante esta sesión.'); }
  }
  function navigate(next: 'catalog' | 'saved') {
    setSelected(undefined); setView(next); setQuery(''); setCategory('Todas');
    history.pushState(null, '', '/panel/'); window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  const search = query.trim().toLocaleLowerCase('es');
  const filtered = modules.filter(m => (view !== 'saved' || saved.includes(m.id)) && (category === 'Todas' || category === m.category) && `${m.name} ${m.description} ${m.category}`.toLocaleLowerCase('es').includes(search));
  const contact = `https://wa.me/595981405077?text=${encodeURIComponent(`Deseo más información sobre ${selected?.name || 'los servicios'} de CARDNET`)}`;
  return <div className="corporate-site cn-app">
    <aside className="cn-rail"><a className="cn-rail-logo" href="/panel/" aria-label="CARDNET inicio"><img src="/pwa/icon-192-blue.png" alt=""/></a><nav aria-label="Navegación del catálogo"><button className={view === 'catalog' ? 'active' : ''} onClick={() => navigate('catalog')} aria-label="Ver catálogo" title="Catálogo"><Grid2X2 size={21}/></button><button className={view === 'saved' ? 'active' : ''} onClick={() => navigate('saved')} aria-label="Ver soluciones guardadas" title="Guardadas"><Bookmark size={21}/></button><a href="/?presentacion=1" aria-label="Presentación de CARDNET" title="Presentación"><House size={21}/></a></nav><span>CN</span></aside>
    <div className="cn-app-content"><header className="cn-app-header"><a className="cn-app-brand" href="/panel/"><img src="/pwa/icon-192-blue.png" alt=""/><span>CARDNET<small>CONNECTED TECHNOLOGY</small></span></a><div className="cn-header-location">Ecosistema <ChevronRight size={13}/><strong>{selected?.name || (view === 'saved' ? 'Guardadas' : 'Soluciones')}</strong></div><span className={`cn-connection ${online ? '' : 'is-offline'}`}>{online ? <Wifi size={14}/> : <WifiOff size={14}/>}<span>{online ? 'Conectado' : 'Sin conexión'}</span></span></header>
      <main className="cn-app-main">
        {selected ? <>
          <button className="cn-back" onClick={() => navigate(view)}><ArrowLeft size={16}/>Volver al catálogo</button>
          <section className="cn-detail-hero"><img src={mediaForModule(selected.imageId)} alt={`Imagen conceptual de ${selected.name}`}/><div className="cn-detail-overlay"><span className="cn-kicker">{selected.category}</span><h1 id="solution-title">{selected.name}</h1><p>{selected.description}</p><div className="cn-detail-actions"><a href={contact} target="_blank" rel="noopener noreferrer" className="cn-primary">Conversemos <ArrowUpRight size={17}/></a><a className="cn-glass-button" href={productUrl(selected)}>Ver ficha completa</a><button className="cn-glass-button" onClick={() => toggleSaved(selected.id)} aria-pressed={saved.includes(selected.id)}><Bookmark size={17} fill={saved.includes(selected.id) ? 'currentColor' : 'none'}/>{saved.includes(selected.id) ? 'Guardada' : 'Guardar solución'}</button></div></div><span className="cn-development">En desarrollo</span></section>
          <section className="cn-detail-scope"><div><span className="cn-kicker">UNA VISIÓN CONECTADA</span><h2>Pensada para tu operación.</h2><p>Conocé los ejes previstos para esta solución y conversemos sobre lo que necesitás implementar.</p></div><div className="cn-feature-list">{selected.features.map((feature, index) => <div key={feature}><span>0{index + 1}</span><strong>{feature}</strong><Check size={18}/></div>)}</div></section>
          <div className="cn-scope-note"><Layers3 size={18}/><p><strong>Una plataforma que evoluciona.</strong> Este módulo está planificado. Su operación e integraciones se desarrollarán por etapas.</p></div>
        </> : <>
          {view === 'catalog' ? <section className="cn-app-hero"><img src={media('hero')} alt="Campus tecnológico CARDNET al anochecer"/><div><span className="cn-kicker">TU PRÓXIMA CONEXIÓN EMPIEZA ACÁ</span><h1>La tecnología.<br/><em>Más cerca de vos.</em></h1><p>Cloud, inteligencia artificial y espacios conectados.<br/>Descubrí el ecosistema CARDNET.</p><a href="#catalogo" className="cn-primary">Explorar soluciones <ArrowUpRight size={17}/></a></div><span className="cn-hero-stamp"><Layers3 size={22}/><span><strong>{modules.length} soluciones</strong><small>Una visión conectada</small></span></span></section> : <section className="cn-saved-heading"><span className="cn-kicker">TU SELECCIÓN</span><h1>Ideas para tu próximo paso.</h1><p>Las soluciones que guardaste, siempre a mano en este dispositivo.</p></section>}
          <section id="catalogo" className="cn-catalog"><div className="cn-catalog-title"><div><span className="cn-kicker">{view === 'saved' ? 'INSPIRACIÓN GUARDADA' : 'EXPLORÁ EL ECOSISTEMA'}</span><h2>{view === 'saved' ? 'Tus soluciones guardadas' : 'Encontrá lo que te conecta.'}</h2></div><span>{view === 'saved' ? saved.length : modules.length}<small>soluciones</small></span></div>
            <div className="cn-catalog-tools"><label className="cn-search"><Search size={19}/><input aria-label="Buscar en el catálogo de soluciones" placeholder="Buscar una solución, un sector, una idea…" value={query} onChange={e => setQuery(e.target.value)}/>{query && <button aria-label="Limpiar búsqueda" onClick={() => setQuery('')}><X size={16}/></button>}</label><div className="cn-category-tabs" aria-label="Sectores">{categories.map(c => <button key={c} aria-pressed={category === c} className={category === c ? 'active' : ''} onClick={() => setCategory(c)}>{c}</button>)}</div></div>
            <p className="cn-result-count" aria-live="polite">{filtered.length} {filtered.length === 1 ? 'solución para explorar' : 'soluciones para explorar'}</p>
            <div className="cn-product-grid">{filtered.map(m => <article className="cn-product" key={m.id}><a href={`/panel/?solucion=${m.id}`} className="cn-product-photo"><img src={mediaForModule(m.imageId)} alt={`Imagen conceptual de ${m.name}`} loading="lazy" width="800" height="450"/><span>{m.category}</span></a><button className="cn-save" aria-label={`${saved.includes(m.id) ? 'Quitar de guardadas' : 'Guardar'} ${m.name}`} aria-pressed={saved.includes(m.id)} onClick={() => toggleSaved(m.id)}><Bookmark size={17} fill={saved.includes(m.id) ? 'currentColor' : 'none'}/></button><a href={`/panel/?solucion=${m.id}`} className="cn-product-copy"><h3>{m.name}<ArrowUpRight size={17}/></h3><p>{m.description}</p><small>{'Consultar alcance'}<span>Descubrir</span></small></a></article>)}</div>
            {!filtered.length && <div className="cn-empty"><Bookmark size={31}/><h3>{view === 'saved' && !saved.length ? 'Tu próxima idea empieza explorando.' : 'Probemos otra búsqueda.'}</h3><p>{view === 'saved' && !saved.length ? 'Tocá el marcador de una solución para tenerla siempre a mano.' : 'Elegí otro sector o buscá por nombre.'}</p><button onClick={() => navigate('catalog')}>Explorar el catálogo <ArrowUpRight size={16}/></button></div>}
          </section>
          <details className="cn-about"><summary>Una plataforma en evolución <Layers3 size={16}/></summary><p>Este catálogo presenta las líneas de CARDNET y su alcance previsto. Los módulos se desarrollan por etapas. La gestión de empresas, solicitudes y cuentas todavía no está disponible en esta publicación.</p></details>
        </>}
        <footer className="cn-app-footer"><span>CARDNET · Tecnología que conecta</span><a href="/instalar/">Llevá CARDNET con vos <ArrowUpRight size={13}/></a></footer>
      </main>
    </div>
    <nav className="cn-mobile-nav" aria-label="Navegación de la aplicación"><button aria-current={view === 'catalog' ? 'page' : undefined} onClick={() => navigate('catalog')}><Grid2X2 size={20}/><span>Explorar</span></button><button aria-current={view === 'saved' ? 'page' : undefined} onClick={() => navigate('saved')}><Bookmark size={20}/><span>Guardadas</span>{saved.length > 0 && <i>{saved.length}</i>}</button><a href="/?presentacion=1"><House size={20}/><span>CARDNET</span></a></nav>
    <div className="cn-save-status" role="status">{message}</div>
  </div>;
}
