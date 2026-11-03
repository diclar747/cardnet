import { ArrowRight, ArrowUpRight, Blocks, BrainCircuit, Building2, Cloud, Globe2, Layers3, ShieldCheck } from 'lucide-react';
import { modules } from '../../lib/catalog';
import { industries, media } from '../../lib/media';
import SolutionCatalog from './catalog';

const featured = [
  { id:'cloud', name:'Cloud Cardnet', label:'INFRAESTRUCTURA CLOUD', image:'cloud', description:'El espacio donde tus aplicaciones, tus datos y tus proyectos pueden crecer.', icon:Cloud },
  { id:'ai', name:'Inteligencia Artificial', label:'INTELIGENCIA APLICADA', image:'ai', description:'Una nueva forma de interpretar información y conectar posibilidades.', icon:BrainCircuit },
  { id:'access', name:'Doorway Virtual', label:'ACCESOS INTELIGENTES', image:'access', description:'Tecnología para conectar personas, accesos y espacios cotidianos.', icon:ShieldCheck },
];

function Brand() {
  return <a className="cs-brand" href="/soluciones" aria-label="CARDNET · Inicio"><span className="cs-brand-mark">C<i>✦</i></span><span>CARDNET<small>TECNOLOGÍA QUE CONECTA</small></span></a>;
}

export default function Solutions({ panelHref = '/', staticMode = false }: { panelHref?: string; staticMode?: boolean }) {
  return <div className="corporate-site">
    <header className="cs-header"><div className="cs-container cs-nav"><Brand/><nav aria-label="Navegación de CARDNET"><a href="#soluciones">Soluciones</a><a href="#sectores">Sectores</a><a href="#plataforma">La plataforma</a><a className="cs-nav-cta" href={panelHref}>Acceder al panel <ArrowUpRight size={15}/></a></nav></div></header>

    <main className="cs-main"><section className="cs-hero" aria-labelledby="cs-hero-title">
      <img className="cs-hero-photo" src={media('hero')} alt="Arquitectura tecnológica y ciudad conectada al anochecer, imagen conceptual de CARDNET" width={1536} height={1024} fetchPriority="high" decoding="async"/>
      <div className="cs-container cs-hero-inner"><div className="cs-hero-copy"><span className="cs-overline">ECOSISTEMA TECNOLÓGICO CARDNET</span><h1 id="cs-hero-title">Tu mundo,<br/><em>mejor conectado.</em></h1><p>Cloud, inteligencia artificial y soluciones inteligentes para personas, espacios y empresas.</p><div className="cs-hero-actions"><a className="cs-button" href="#soluciones">Explorar soluciones <ArrowRight size={17}/></a><a className="cs-link-light" href="#plataforma">Conocer la plataforma <ArrowUpRight size={16}/></a></div></div>
        <div className="cs-hero-bottom"><span className="cs-region"><Globe2 size={14}/> Paraguay · Brasil · Argentina · Uruguay</span><div className="cs-glass"><span><Layers3 size={21}/></span><div><strong>Un ecosistema. Una visión conectada.</strong><small>Cloud &nbsp; / &nbsp; IoT &nbsp; / &nbsp; Inteligencia Artificial</small></div><ArrowUpRight size={18}/></div></div>
      </div>
    </section>

    <section className="cs-capabilities" aria-label="Líneas de tecnología"><div className="cs-container cs-capability-grid">{[{title:'Infraestructura conectada',detail:'Cloud y almacenamiento',icon:Cloud},{title:'Espacios más inteligentes',detail:'Doorway y control de accesos',icon:ShieldCheck},{title:'Gestión que evoluciona',detail:'Cortex e inteligencia artificial',icon:BrainCircuit}].map(c => <div className="cs-capability" key={c.title}><span><c.icon size={23}/></span><div><strong>{c.title}</strong><small>{c.detail}</small></div></div>)}</div></section>

    <section className="cs-container cs-section" id="destacadas"><div className="cs-section-head"><div><span className="cs-eyebrow">TECNOLOGÍA CON PROPÓSITO</span><h2>Infraestructura, inteligencia<br/>y acceso.</h2></div><p>Desde la nube hasta la puerta de tu edificio. Un ecosistema pensado para que cada parte de tu operación esté mejor conectada.</p></div><div className="cs-featured">{featured.map(f => <a className="cs-feature" key={f.id} href={`${panelHref}?solucion=${f.id}`}><img src={media(f.image)} alt={`Imagen conceptual de ${f.name}`} width={1536} height={1024} loading="lazy" decoding="async"/><span className="cs-photo-icon"><f.icon size={21}/></span><div className="cs-feature-copy"><span>{f.label}</span><h3>{f.name}</h3><p>{f.description}</p><div><span>Descubrir solución</span><ArrowUpRight size={18}/></div></div></a>)}</div></section>

    <section className="cs-soft-section" id="sectores"><div className="cs-container cs-section"><div className="cs-section-head"><div><span className="cs-eyebrow">SOLUCIONES PARA CADA ENTORNO</span><h2>Cada espacio tiene<br/>su propia solución.</h2></div><p>Residencias, comunidades, educación y movilidad. Explorá la tecnología diseñada para los lugares donde sucede tu día a día.</p></div><div className="cs-industry-grid">{industries.map(industry => <a className="cs-industry" key={industry.id} href={`${panelHref}?solucion=${industry.id}`}><div className="cs-industry-photo"><img src={media(industry.image)} alt={`Imagen conceptual: ${industry.name}`} width={1536} height={1024} loading="lazy" decoding="async"/><span>{industry.label}</span></div><div className="cs-industry-copy"><div><h3>{industry.name}</h3><ArrowUpRight size={18}/></div><p>{industry.description}</p></div></a>)}</div></div></section>

    <section className="cs-platform" id="plataforma"><div className="cs-container cs-platform-inner"><div className="cs-platform-copy"><span className="cs-eyebrow">CARDNET WORKSPACE</span><h2>La visión completa,<br/>en un solo lugar.</h2><p>Una base de trabajo para organizar empresas, conocer las soluciones y dar seguimiento a lo que tu operación necesita.</p><div className="cs-platform-list">{[{title:'Tu espacio de gestión',detail:'Empresas, solicitudes y actividad registrada.',icon:Building2},{title:'Todo el catálogo conectado',detail:'Explorá las líneas y el alcance de cada producto.',icon:Blocks},{title:'Una evolución por etapas',detail:'Módulos e integraciones con su propio desarrollo.',icon:Layers3}].map(item => <div key={item.title}><item.icon size={18}/><div><strong>{item.title}</strong><small>{item.detail}</small></div></div>)}</div><a className="cs-button" href={panelHref}>Conocer el panel <ArrowUpRight size={17}/></a></div><div className="cs-platform-visual"><img src={media('operations')} alt="Imagen conceptual de un centro de operaciones tecnológicas" width={1536} height={1024} loading="lazy" decoding="async"/><div className="cs-platform-caption"><div><span>ECOSISTEMA CARDNET</span><strong>Una operación más conectada.</strong></div><ShieldCheck size={29}/></div></div></div></section>

    <section className="cs-container cs-section" id="soluciones"><div className="cs-catalog-head"><div><span className="cs-eyebrow">EXPLORÁ EL ECOSISTEMA</span><h2>Encontrá tu próxima<br/>solución tecnológica.</h2></div><div className="cs-catalog-count">{modules.length}<small>soluciones</small></div></div><SolutionCatalog panelHref={panelHref}/></section>

    <section className="cs-contact"><img src={media('buildings')} alt="Arquitectura contemporánea al anochecer" width={1536} height={1024} loading="lazy" decoding="async"/><div className="cs-container cs-contact-inner"><div><span className="cs-eyebrow">CONECTEMOS TU PRÓXIMO PROYECTO</span><h2>El siguiente paso<br/>empieza con tu visión.</h2><p>{staticMode ? 'Explorá las soluciones y el alcance de cada módulo.' : 'Registrá tu empresa y contanos qué necesitás implementar.'}</p></div><a className="cs-button" href={panelHref}>Entrar a mi espacio <ArrowUpRight size={18}/></a></div></section>

    </main><div className="cs-site-footer" role="contentinfo"><div className="cs-container"><div className="cs-footer-top"><div><Brand/><p>Un ecosistema de tecnología para personas, espacios y empresas.</p></div><nav aria-label="Enlaces de pie de página"><a href="#soluciones">Soluciones</a><a href="#sectores">Sectores</a><a href={panelHref}>Centro de operaciones</a></nav></div><div className="cs-footer-bottom"><span>© {new Date().getFullYear()} CARDNET · Servicios electrónicos.</span><span>Imágenes conceptuales generadas para esta presentación.<br/>Soluciones e integraciones en desarrollo por etapas.</span></div></div></div>
  </div>;
}
