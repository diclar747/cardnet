'use client';
import { useEffect, useRef, useState } from 'react';
import { Check, Download, Share, Smartphone, WifiOff, X } from 'lucide-react';
import { installedStorageKey, isCardnetInstalled } from '../lib/pwa-install';

interface InstallEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function Pwa({ installationPage = false }: { installationPage?: boolean }) {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState<InstallEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [checked, setChecked] = useState(false);
  const [status, setStatus] = useState('');
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    let active = true;
    const standalone = () => window.matchMedia('(display-mode: standalone)').matches || Boolean((navigator as Navigator & { standalone?: boolean }).standalone);
    const remember = () => { try { localStorage.setItem(installedStorageKey, 'yes'); } catch { /* Standalone detection still works. */ } };
    const sync = () => {
      if (standalone()) remember();
      let saved = false;
      try { saved = localStorage.getItem(installedStorageKey) === 'yes'; } catch { /* Storage may be unavailable. */ }
      setInstalled(isCardnetInstalled(standalone(), saved));
      setChecked(true);
    };
    const capture = (event: Event) => {
      event.preventDefault();
      if (standalone()) return;
      // A fresh native offer also handles reinstalling after an uninstall.
      try { localStorage.removeItem(installedStorageKey); } catch { /* Session only. */ }
      setInstalled(false); setChecked(true); setPrompt(event as InstallEvent);
    };
    const done = () => { remember(); setInstalled(true); setPrompt(null); setOpen(false); setStatus('CARDNET ya está instalada.'); };
    sync();
    const display = window.matchMedia('(display-mode: standalone)');
    display.addEventListener('change', sync);
    window.addEventListener('beforeinstallprompt', capture);
    window.addEventListener('appinstalled', done);
    window.addEventListener('storage', sync);
    const relatedNavigator = navigator as Navigator & { getInstalledRelatedApps?: () => Promise<{ platform?: string; url?: string; id?: string }[]> };
    relatedNavigator.getInstalledRelatedApps?.().then(apps => {
      if (active && isCardnetInstalled(false, false, apps, window.location.origin)) { remember(); setInstalled(true); setPrompt(null); }
    }).catch(() => { /* Not supported by every browser. */ });
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js', { scope: '/', updateViaCache: 'none' }).catch(() => setStatus('La instalación sin conexión no pudo prepararse. Volvé a intentar con conexión.'));
    return () => { active = false; display.removeEventListener('change', sync); window.removeEventListener('beforeinstallprompt', capture); window.removeEventListener('appinstalled', done); window.removeEventListener('storage', sync); };
  }, []);
  useEffect(() => { if (open) dialog.current?.showModal(); else dialog.current?.close(); }, [open]);
  function acknowledgeInstalled() {
    try { localStorage.setItem(installedStorageKey, 'yes'); } catch { /* Hide for this session. */ }
    setInstalled(true); setPrompt(null); setOpen(false);
    setStatus('Instalación de CARDNET registrada.');
  }
  async function install() {
    if (!prompt) { setOpen(true); return; }
    try {
      await prompt.prompt();
      const result = await prompt.userChoice;
      setPrompt(null);
      setStatus(result.outcome === 'accepted' ? 'Instalación solicitada. Confirmá el resultado en tu dispositivo.' : 'Podés volver a instalar CARDNET cuando quieras.');
    } catch { setPrompt(null); setOpen(true); }
  }
  const content = <><img className="pwa-cover" src="/pwa/cover.webp" alt="Infraestructura tecnológica y arquitectura corporativa CARDNET" width="1200" height="675"/><div className="pwa-body"><div className="pwa-identity"><img src="/pwa/icon-192-blue.png" alt="Logo CARDNET" width="64" height="64"/><div><span className="cs-eyebrow">TECNOLOGÍA QUE CONECTA</span><h2 id="pwa-title">CARDNET, siempre cerca.</h2></div></div><p>Instalá el ecosistema CARDNET en tu teléfono. Tu catálogo de tecnología, con acceso directo desde la pantalla de inicio.</p><div className="pwa-benefits"><span><Smartphone size={17}/>Tu propio ícono de CARDNET</span><span><Check size={17}/>Imágenes y catálogo de soluciones</span><span><WifiOff size={17}/>Contenido disponible sin conexión después de cargarlo</span></div>{installed ? <p className="pwa-success"><Check size={18}/>Ya tenés CARDNET instalada.</p> : prompt ? <button className="cs-button pwa-install" onClick={() => void install()}><Download size={18}/>Instalar CARDNET</button> : <div className="pwa-instructions"><h3>Cómo instalar</h3><p><strong>Android:</strong> abrí esta página en Chrome, tocá el menú ⋮ y elegí «Instalar aplicación» o «Agregar a la pantalla principal».</p><p><strong>iPhone:</strong> abrí esta página en Safari, tocá <Share size={14} aria-label="Compartir"/> Compartir y elegí «Agregar a pantalla de inicio». Activá «Abrir como app web» si aparece.</p><p><strong>Computadora:</strong> buscá el ícono de instalación en la barra de direcciones de Chrome o Edge.</p></div>}{!installed && <button className="pwa-already-installed" onClick={acknowledgeInstalled}>Ya la tengo instalada</button>}<p className="pwa-status" role="status">{status}</p><small>La instalación depende del navegador. WhatsApp y el contenido nuevo necesitan conexión. Los módulos conservan su estado de desarrollo.</small></div></>;
  return <>
    {installationPage ? <div className="corporate-site pwa-page"><header className="cs-header"><div className="cs-container cs-nav"><a className="cs-brand" href="/">CARDNET</a><a className="cs-nav-cta" href="/">Volver al sitio</a></div></header><main className="cs-main"><section className="pwa-page-card">{content}</section></main></div> : <>{checked && !installed && <button className="pwa-launcher" onClick={() => void install()} aria-label="Instalar CARDNET" title="Instalar CARDNET"><Download size={21}/><span>Instalar app</span></button>}<dialog ref={dialog} className="pwa-dialog" aria-labelledby="pwa-title" onCancel={e => { e.preventDefault(); setOpen(false); }} onClick={e => { if(e.target === e.currentTarget) setOpen(false); }}><button className="pwa-close" aria-label="Cerrar instalación" onClick={() => setOpen(false)}><X size={20}/></button>{content}</dialog></>}
  </>;
}




