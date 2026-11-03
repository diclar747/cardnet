'use client';
import { useEffect, useRef, useState } from 'react';
import { Check, Download, Share, Smartphone, WifiOff, X } from 'lucide-react';

interface InstallEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function Pwa({ installationPage = false }: { installationPage?: boolean }) {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState<InstallEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState('');
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const sync = () => setInstalled(window.matchMedia('(display-mode: standalone)').matches || Boolean((navigator as Navigator & { standalone?: boolean }).standalone));
    const capture = (event: Event) => { event.preventDefault(); setPrompt(event as InstallEvent); };
    const done = () => { setInstalled(true); setPrompt(null); setStatus('CARDNET ya está instalada.'); };
    sync();
    const display = window.matchMedia('(display-mode: standalone)');
    display.addEventListener('change', sync);
    window.addEventListener('beforeinstallprompt', capture);
    window.addEventListener('appinstalled', done);
    const timer = window.setTimeout(() => setReady(true), 1100);
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js', { scope: '/', updateViaCache: 'none' }).catch(() => setStatus('La instalación sin conexión no pudo prepararse. Volvé a intentar con conexión.'));
    return () => { clearTimeout(timer); display.removeEventListener('change', sync); window.removeEventListener('beforeinstallprompt', capture); window.removeEventListener('appinstalled', done); };
  }, []);
  useEffect(() => { if (open) dialog.current?.showModal(); else dialog.current?.close(); }, [open]);
  async function install() {
    if (!prompt) { setOpen(true); return; }
    try {
      await prompt.prompt();
      const result = await prompt.userChoice;
      setPrompt(null);
      setStatus(result.outcome === 'accepted' ? 'Instalación solicitada. Confirmá el resultado en tu dispositivo.' : 'Podés volver a instalar CARDNET cuando quieras.');
    } catch { setPrompt(null); setOpen(true); }
  }
  const content = <><img className="pwa-cover" src="/pwa/cover.webp" alt="Infraestructura tecnológica y arquitectura corporativa CARDNET" width="1200" height="675"/><div className="pwa-body"><div className="pwa-identity"><img src="/pwa/icon-192.png" alt="Logo CARDNET" width="64" height="64"/><div><span className="cs-eyebrow">TECNOLOGÍA QUE CONECTA</span><h2 id="pwa-title">CARDNET, siempre cerca.</h2></div></div><p>Instalá el ecosistema CARDNET en tu teléfono. Tu catálogo de tecnología, con acceso directo desde la pantalla de inicio.</p><div className="pwa-benefits"><span><Smartphone size={17}/>Tu propio ícono de CARDNET</span><span><Check size={17}/>Imágenes y catálogo de soluciones</span><span><WifiOff size={17}/>Contenido disponible sin conexión después de cargarlo</span></div>{installed ? <p className="pwa-success"><Check size={18}/>Estás usando CARDNET como aplicación.</p> : prompt ? <button className="cs-button pwa-install" onClick={() => void install()}><Download size={18}/>Instalar CARDNET</button> : <div className="pwa-instructions"><h3>Cómo instalar</h3><p><strong>Android:</strong> abrí esta página en Chrome, tocá el menú ⋮ y elegí «Instalar aplicación» o «Agregar a la pantalla principal».</p><p><strong>iPhone:</strong> abrí esta página en Safari, tocá <Share size={14} aria-label="Compartir"/> Compartir y elegí «Agregar a pantalla de inicio». Activá «Abrir como app web» si aparece.</p><p><strong>Computadora:</strong> buscá el ícono de instalación en la barra de direcciones de Chrome o Edge.</p></div>}<p className="pwa-status" role="status">{status}</p><small>La instalación depende del navegador. WhatsApp y el contenido nuevo necesitan conexión. Los módulos conservan su estado de desarrollo.</small></div></>;
  return <>
    <div className={`pwa-splash ${ready ? 'is-ready' : ''}`} aria-hidden="true"><img src="/pwa/cover.webp" alt=""/><div><img src="/pwa/icon-192.png" alt=""/><strong>CARDNET</strong><span>TECNOLOGÍA QUE CONECTA</span><i/></div></div>
    {installationPage ? <div className="corporate-site pwa-page"><header className="cs-header"><div className="cs-container cs-nav"><a className="cs-brand" href="/">CARDNET</a><a className="cs-nav-cta" href="/">Volver al sitio</a></div></header><main className="cs-main"><section className="pwa-page-card">{content}</section></main></div> : <><button className="pwa-launcher" onClick={() => void install()} aria-label={installed ? 'Ver aplicación CARDNET' : 'Instalar CARDNET'}><Download size={16}/><span>{installed ? 'App CARDNET' : 'Instalar app'}</span></button><dialog ref={dialog} className="pwa-dialog" aria-labelledby="pwa-title" onCancel={e => { e.preventDefault(); setOpen(false); }} onClick={e => { if(e.target === e.currentTarget) setOpen(false); }}><button className="pwa-close" aria-label="Cerrar instalación" onClick={() => setOpen(false)}><X size={20}/></button>{content}</dialog></>}
  </>;
}
