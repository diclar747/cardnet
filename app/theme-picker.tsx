'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, Moon, Sun, Palette, RotateCcw, X } from 'lucide-react';

import { themes, themeStorageKey as storageKey, modeStorageKey, defaultTheme, defaultMode } from '../lib/themes';

export default function ThemePicker() {
  const [selected, setSelected] = useState(defaultTheme);
  const [mode, setMode] = useState(defaultMode);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = 'cardnet-theme-title';

  useEffect(() => {
    const sync = () => {
      let saved = document.documentElement.dataset.theme;
      try { saved = localStorage.getItem(storageKey) || defaultTheme; } catch { /* Keep the session preference. */ }
      const id = themes.some(t => t.id === saved) ? saved! : defaultTheme;
      document.documentElement.dataset.theme = id;
      setSelected(id);
      let savedMode = document.documentElement.dataset.mode || defaultMode;
      try { savedMode = localStorage.getItem(modeStorageKey) || defaultMode; } catch { /* Keep session preference. */ }
      const nextMode = savedMode === 'light' ? 'light' : defaultMode;
      document.documentElement.dataset.mode = nextMode;
      setMode(nextMode);
    };
    sync();
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  useEffect(() => {
    if (open) dialog.current?.showModal();
    else dialog.current?.close();
  }, [open]);

  function choose(id: string) {
    document.documentElement.dataset.theme = id;
    setSelected(id);
    try {
      localStorage.setItem(storageKey, id);
      setMessage('Tema guardado en este navegador.');
    } catch {
      setMessage('Tema aplicado para esta sesión.');
    }
  }

  function chooseMode(value: string) {
    document.documentElement.dataset.mode = value;
    setMode(value);
    try { localStorage.setItem(modeStorageKey, value); setMessage('Apariencia guardada en este navegador.'); }
    catch { setMessage('Apariencia aplicada para esta sesión.'); }
  }

  return <>
    <a className="whatsapp-launcher" href="https://wa.me/595981405077" target="_blank" rel="noopener noreferrer" aria-label="Contactar por WhatsApp" title="Contactar por WhatsApp">
      <svg viewBox="0 0 24 24" width="25" height="25" fill="currentColor" aria-hidden="true"><path d="M20.52 3.48A11.87 11.87 0 0 0 12.05 0C5.47 0 .11 5.35.1 11.94c0 2.1.55 4.15 1.6 5.96L0 24l6.27-1.64a11.94 11.94 0 0 0 5.77 1.47h.01c6.59 0 11.94-5.35 11.95-11.94a11.87 11.87 0 0 0-3.48-8.41ZM12.05 21.8a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.72.97.99-3.63-.24-.37a9.88 9.88 0 0 1-1.51-5.24c0-5.47 4.45-9.92 9.93-9.92a9.86 9.86 0 0 1 7.02 2.91 9.86 9.86 0 0 1 2.9 7.03c0 5.47-4.45 9.92-9.97 9.84Zm5.44-7.43c-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.68.15s-.77.97-.95 1.17c-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.8-1.49-1.78-1.66-2.08-.18-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.68-1.62-.93-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.53.07-.8.37-.28.3-1.05 1.03-1.05 2.5s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.09 4.49.71.31 1.27.49 1.7.63.71.23 1.36.2 1.87.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.18-1.42-.08-.13-.28-.2-.58-.35Z"/></svg>
    </a>
    <button className="theme-launcher" aria-haspopup="dialog" aria-expanded={open} onClick={() => { setMessage(''); setOpen(true); }}>
      <Palette size={18} /><span>Temas</span><span className="theme-current-dot" aria-hidden="true" />
    </button>
    <dialog ref={dialog} className="theme-dialog" aria-labelledby={titleId} onCancel={e => { e.preventDefault(); setOpen(false); }} onClick={e => { if (e.target === e.currentTarget) setOpen(false); }}>
      <div className="theme-dialog-heading"><div><span className="eyebrow">PERSONALIZÁ TU ESPACIO</span><h2 id={titleId}>Elegí tu color.</h2></div><button className="icon-button" aria-label="Cerrar selector de temas" onClick={() => setOpen(false)}><X size={20} /></button></div>
      <p className="theme-intro">Una misma plataforma, seis estilos. El color se aplica al panel y a la presentación.</p>
      <fieldset className="mode-options"><legend>Apariencia</legend>
        <label className={mode === 'light' ? 'is-selected' : ''}><input type="radio" name="cardnet-mode" checked={mode === 'light'} onChange={() => chooseMode('light')} /><Sun size={18} />Modo claro{mode === 'light' && <Check size={16} />}</label>
        <label className={mode === 'dark' ? 'is-selected' : ''}><input type="radio" name="cardnet-mode" checked={mode === 'dark'} onChange={() => chooseMode('dark')} /><Moon size={18} />Modo oscuro{mode === 'dark' && <Check size={16} />}</label>
      </fieldset>
      <fieldset className="theme-options"><legend>Color de la plantilla</legend>{themes.map(theme => <label key={theme.id} className={`theme-choice ${selected === theme.id ? 'is-selected' : ''}`}>
        <input type="radio" name="cardnet-theme" value={theme.id} checked={selected === theme.id} onChange={() => choose(theme.id)} />
        <span className="theme-swatch" style={{ backgroundColor: theme.color }}>{selected === theme.id ? <Check size={21} /> : <Palette size={21} />}</span>
        <strong>{theme.name}</strong><small>{theme.description}</small>
      </label>)}</fieldset>
      <p className="theme-save-status" role="status">{message || 'Tu elección se recuerda al volver a abrir el sistema.'}</p>
      <div className="theme-dialog-actions"><button className="secondary" onClick={() => { choose(defaultTheme); chooseMode(defaultMode); }}><RotateCcw size={14} />Restablecer</button><button className="primary" onClick={() => setOpen(false)}>Listo <Check size={16} /></button></div>
    </dialog>
  </>;
}


