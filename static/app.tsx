import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowUpRight, X } from 'lucide-react';
import Solutions from '../app/soluciones/page';
import SolutionCatalog from '../app/soluciones/catalog';
import ThemePicker from '../app/theme-picker';
import { modules, type Module } from '../lib/catalog';
import { mediaForModule } from '../lib/media';

const panelHref = '/panel/';

function CatalogPanel() {
  const [selected, setSelected] = useState<Module>();
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('solucion');
    setSelected(modules.find(m => m.id === id));
  }, []);
  return <div className="corporate-site static-panel">
    <header className="cs-header"><div className="cs-container cs-nav"><a className="cs-brand" href="/">CARDNET</a><a className="cs-nav-cta" href="/"><ArrowLeft size={16}/>Volver a la presentación</a></div></header>
    <main className="cs-main"><section className="cs-container cs-section">
      <span className="cs-eyebrow">ECOSISTEMA CARDNET</span><h1>Explorá nuestras soluciones.</h1>
      <p className="static-notice">Versión de presentación. El catálogo y la personalización están disponibles. La gestión de empresas, solicitudes y cuentas requiere conectar un servidor y no está habilitada en esta publicación.</p>
      {selected && <article className="static-detail" aria-labelledby="solution-title"><img src={mediaForModule(selected.id)} alt={`Imagen conceptual de ${selected.name}`}/><div><span className="cs-eyebrow">{selected.category} · En desarrollo</span><h2 id="solution-title">{selected.name}</h2><p>{selected.description}</p><h3>Alcance previsto</h3><ul>{selected.features.map(f => <li key={f}>{f}</li>)}</ul><p>Este módulo está planificado. Su operación e integraciones se desarrollarán por etapas.</p><button className="secondary" onClick={() => { setSelected(undefined); history.replaceState(null, '', panelHref); }}><X size={15}/>Cerrar detalle</button></div></article>}
      <SolutionCatalog panelHref={panelHref}/>
      <a className="cs-button" href="/">Conocer CARDNET <ArrowUpRight size={16}/></a>
    </section></main>
  </div>;
}

export default function StaticApp({ path = '/' }: { path?: string }) {
  return <>{path.startsWith('/panel') ? <CatalogPanel/> : <Solutions panelHref={panelHref} staticMode/>}<ThemePicker/></>;
}
