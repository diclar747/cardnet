'use client';
import { useState } from 'react';
import { ArrowUpRight, Search, X } from 'lucide-react';
import { categories, modules } from '../../lib/catalog';
import { mediaForModule } from '../../lib/media';

export default function SolutionCatalog() {
  const [category, setCategory] = useState('Todas');
  const [query, setQuery] = useState('');
  const search = query.trim().toLocaleLowerCase('es');
  const filtered = modules.filter(m => (category === 'Todas' || m.category === category) && `${m.name} ${m.description} ${m.category}`.toLocaleLowerCase('es').includes(search));
  return <>
    <div className="cs-catalog-tools"><div className="cs-tabs" aria-label="Filtrar soluciones por sector">{categories.map(c => <button key={c} aria-pressed={category === c} className={category === c ? 'is-active' : ''} onClick={() => setCategory(c)}>{c}</button>)}</div><div className="cs-search"><Search size={17}/><input value={query} onChange={e => setQuery(e.target.value)} aria-label="Buscar en el catálogo de soluciones" placeholder="¿Qué solución buscás?"/>{query ? <button aria-label="Limpiar búsqueda" onClick={() => setQuery('')}><X size={15}/></button> : null}</div></div>
    <p className="cs-results" aria-live="polite">{filtered.length} {filtered.length === 1 ? 'solución para explorar' : 'soluciones para explorar'}</p>
    <div className="cs-catalog-grid">{filtered.map(m => <a className="cs-product" key={m.id} href={`/?solucion=${m.id}`}><div className="cs-product-image"><img src={mediaForModule(m.id)} alt={`Imagen conceptual de ${m.name}`} width={1536} height={1024} loading="lazy" decoding="async"/><span>{m.category}</span><span className="cs-image-arrow"><ArrowUpRight size={18}/></span></div><div className="cs-product-copy"><h3>{m.name}</h3><p>{m.description}</p><div><span>Explorar solución</span><small>{m.origin === 'Ampliación propuesta' ? 'Propuesta' : 'En desarrollo'}</small></div></div></a>)}</div>
    {!filtered.length ? <div className="cs-no-results"><Search size={32}/><h3>No encontramos esa solución.</h3><p>Probá con otro nombre o elegí otra categoría.</p><button onClick={() => { setCategory('Todas'); setQuery(''); }}>Mostrar todas las soluciones</button></div> : null}
  </>;
}
