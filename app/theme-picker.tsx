'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, Moon, Sun, Palette, RotateCcw, X } from 'lucide-react';

import { themes, themeStorageKey as storageKey, modeStorageKey } from '../lib/themes';

export default function ThemePicker() {
  const [selected, setSelected] = useState('cardnet');
  const [mode, setMode] = useState('light');
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = 'cardnet-theme-title';

  useEffect(() => {
    const sync = () => {
      let saved = document.documentElement.dataset.theme;
      try { saved = localStorage.getItem(storageKey) || 'cardnet'; } catch { /* Keep the session preference. */ }
      const id = themes.some(t => t.id === saved) ? saved! : 'cardnet';
      document.documentElement.dataset.theme = id;
      setSelected(id);
      let savedMode = document.documentElement.dataset.mode || 'light';
      try { savedMode = localStorage.getItem(modeStorageKey) || 'light'; } catch { /* Keep session preference. */ }
      const nextMode = savedMode === 'dark' ? 'dark' : 'light';
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
      <div className="theme-dialog-actions"><button className="secondary" onClick={() => { choose('cardnet'); chooseMode('light'); }}><RotateCcw size={14} />Restablecer</button><button className="primary" onClick={() => setOpen(false)}>Listo <Check size={16} /></button></div>
    </dialog>
  </>;
}

