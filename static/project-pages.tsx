import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowUpRight, Bot, VolumeX, X } from 'lucide-react';
import { institutionalPages, productUrl, siteProducts, whatsappUrl, type SiteProduct } from '../lib/site-catalog';
import { mediaForModule } from '../lib/media';
import ProjectVideo from './project-video';

const contacts = [
  ['Paraguay', 'Asunción · EE. UU. 936', '595981405077'],
  ['Brasil', 'Balneário Camboriú', '5547999755875'],
  ['Argentina', 'Buenos Aires', '5491165467431'],
  ['Uruguay', 'Montevideo', '59898508383'],
];

export function ProjectPage({ slug }: { slug: string }) {
  const product = siteProducts.find(item => item.slug === slug);
  const page = institutionalPages[slug as keyof typeof institutionalPages];
  const title = product?.name ?? page?.title;
  const description = product?.description ?? page?.description;
  const [priceOpen, setPriceOpen] = useState(false);
  const contact = whatsappUrl(product ? `Deseo más información sobre ${product.name} de CARDNET` : 'Deseo más información sobre los servicios de CARDNET');
  return <div className="corporate-site cn-app"><header className="cn-app-header"><a className="cn-app-brand" href="/"><img src="/pwa/icon-192-blue.png" alt=""/>CARDNET</a><a className="cn-back project-back" href="/panel/"><ArrowLeft size={16}/> Catálogo</a></header>
    <main className="cn-app-main">
      {product ? <><section className="cn-detail-hero"><img src={mediaForModule(product.imageId)} alt={`Imagen conceptual de ${product.name}`}/><div><span className="cn-kicker">{product.category}</span><h1>{title}</h1><p>{description}</p><div className="cn-detail-actions"><button className="cn-primary" onClick={() => setPriceOpen(!priceOpen)} aria-expanded={priceOpen}>Quiero un precio</button><a className="cn-glass-button" href={contact} target="_blank" rel="noopener noreferrer">WhatsApp <ArrowUpRight size={16}/></a></div></div></section>
      {priceOpen && <div className="cn-scope-note" role="status"><p>El precio depende del alcance de la operación. Podés pedir una cotización por WhatsApp. <a href={contact} target="_blank" rel="noopener noreferrer">Consultar por {product.name}</a></p></div>}
      <ProjectVideo id={product.id} name={product.name}/>
      <section className="cn-detail-scope"><div><h2>Qué podés resolver</h2><p>{description} Conocé las áreas de aplicación y consultá las opciones para tu operación.</p></div><div className="cn-feature-list">{product.features.map(feature => <div key={feature}><strong>{feature}</strong></div>)}</div></section>
      <p className="cn-scope-note">{product.id === 'bioquant' ? 'Herramienta informativa de bienestar. No sustituye una consulta profesional ni realiza diagnósticos.' : 'Las funciones y condiciones se confirman según el alcance contratado.'}</p></> :
      <section className="cn-saved-heading"><h1>{title}</h1><p>{description}</p>
      {slug === 'contacto' && <div className="cn-product-grid">{contacts.map(([country, city, phone]) => <article className="cn-product cn-product-copy" key={country}><h3>{country}</h3><p>{city}</p><a className="cn-primary" href={whatsappUrl('Deseo más información sobre los servicios de CARDNET', phone)} target="_blank" rel="noopener noreferrer">WhatsApp <ArrowUpRight size={16}/></a></article>)}</div>}
      {slug === 'como-contratamos' && <div className="cn-feature-list">{['Evaluación de la operación', 'Configuración e instalación', 'Capacitación y prueba'].map(item => <div key={item}><strong>{item}</strong></div>)}<p>El plazo y las condiciones se confirman según el servicio. Los datos de transferencia se entregan al confirmar el pedido.</p></div>}
      {slug === 'empresa' && <p>CARDNET desarrolla soluciones de nube, publicidad digital, accesos, inteligencia artificial, pagos y supervisión. Cuenta con presencia comercial en Paraguay, Brasil, Argentina y Uruguay.</p>}
      {slug === 'privacidad' && <p>Esta versión guarda preferencias y soluciones en tu dispositivo. Si abrís WhatsApp, continuás en un servicio externo. El aviso completo está pendiente de revisión.</p>}
      {slug === 'terminos' && <p>El catálogo informa el alcance previsto de los servicios. Las condiciones finales se acuerdan al contratar. Los términos completos están pendientes de revisión.</p>}
      {slug === 'doorway-cortex' && <ul>{siteProducts.filter(item => item.slug.startsWith('cortex-')).map(item => <li key={item.id}><a href={productUrl(item)}>{item.name}</a></li>)}</ul>}</section>}
      <ProjectLinks/>
    </main>
  </div>;
}

export function ProjectLinks() {
  return <nav className="project-links" aria-label="Información de CARDNET">
    <a href="/panel/">Catálogo</a><a href="/como-contratamos/">Cómo contratamos</a><a href="/contacto/">Contacto</a><a href="/empresa/">Empresa</a><a href="/privacidad/">Privacidad</a><a href="/terminos/">Términos</a>
  </nav>;
}

const needs = ['Infraestructura', 'Accesos e IoT', 'Movilidad', 'Operaciones', 'Cortex', 'Salud'];

export function Cardy() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'text' | 'voice'>();
  const [need, setNeed] = useState('');
  const [product, setProduct] = useState<SiteProduct>();
  const [answer, setAnswer] = useState('');
  const speak = (message: string) => {
    if (mode !== 'voice' || !('speechSynthesis' in window) || document.querySelector('[data-cardnet-video=open]')) return;
    window.speechSynthesis.cancel();
    const voice = new SpeechSynthesisUtterance(message);
    voice.lang = 'es-PY';
    window.speechSynthesis.speak(voice);
  };
  useEffect(() => () => { if ('speechSynthesis' in window) window.speechSynthesis.cancel(); }, []);
  function close() {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setOpen(false);
  }
  return <>
    <button className="cardy-launch" onClick={() => setOpen(true)} aria-expanded={open}><Bot size={20}/> Cardy</button>
    {open && <section className="cardy-panel" aria-label="Asistente Cardy">
      <header><Bot size={23}/><div><strong>Cardy</strong><small>Guía de soluciones CARDNET</small></div><button onClick={close} aria-label="Cerrar Cardy"><X size={18}/></button></header>
      <div className="cardy-content">
        {!mode ? <><p>¡Hola! Soy Cardy. ¿Cómo preferís recorrer el catálogo?</p><button onClick={() => setMode('text')}>Guía escrita</button><button onClick={() => setMode('voice')}>Guía con voz</button><a href="/panel/">Explorar por mi cuenta</a></> :
          <>{mode === 'voice' && <button onClick={() => { window.speechSynthesis?.cancel(); setMode('text'); }}><VolumeX size={15}/> Silenciar</button>}
          {!need ? <><p>¿Qué te interesa resolver?</p>{needs.map(item => <button key={item} onClick={() => setNeed(item)}>{item}</button>)}</> :
          !product ? <><p>Elegí una solución de {need}.</p>{siteProducts.filter(item => item.category === need).map(item => <button key={item.id} onClick={() => { setProduct(item); speak(`${item.name}. ${item.description} ${item.features.join('. ')}`); }}>{item.name}</button>)}<button onClick={() => setNeed('')}>Otros sectores</button></> :
          <><strong>{product.name}</strong><p>{product.description}</p><ul>{product.features.map(item => <li key={item}>{item}</li>)}</ul>
            <ProjectVideo key={product.id} id={product.id} name={product.name} after={() => setAnswer('¿Qué te gustaría consultar ahora? Podés pedir un precio, revisar la implementación o elegir otra solución.')}/>
            <a href={productUrl(product)}>Ver ficha</a><button onClick={() => { const reply = 'La cotización depende del alcance. Podés consultar por WhatsApp.'; setAnswer(reply); speak(reply); }}>Quiero un precio</button>
            <a href="/como-contratamos/">Cómo se implementa</a><a href={whatsappUrl(`Deseo más información sobre ${product.name}`)} target="_blank" rel="noopener noreferrer">Hablar por WhatsApp</a>
            <button onClick={() => { window.speechSynthesis?.cancel(); setProduct(undefined); setAnswer(''); }}>Ver otra solución</button>{answer && <p role="status">{answer}</p>}</>}</>}
      </div>
    </section>}
  </>;
}
