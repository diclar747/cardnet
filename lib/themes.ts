export const themes = [
  { id: 'cardnet', name: 'Naranja CARDNET', color: '#c95012', description: 'La identidad original' },
  { id: 'ocean', name: 'Azul océano', color: '#2463c5', description: 'Claro y profesional' },
  { id: 'emerald', name: 'Verde esmeralda', color: '#16714e', description: 'Natural y equilibrado' },
  { id: 'violet', name: 'Violeta', color: '#7440be', description: 'Creativo y tecnológico' },
  { id: 'ruby', name: 'Rojo rubí', color: '#b83149', description: 'Energía y carácter' },
  { id: 'teal', name: 'Turquesa', color: '#087b83', description: 'Fresco y contemporáneo' },
];
export const themeStorageKey = 'cardnet.theme.v1';
export const modeStorageKey = 'cardnet.mode.v1';
export const defaultTheme = 'ocean';
export const defaultMode = 'dark';
export const themeInitialization = `(()=>{const d=document.documentElement;d.dataset.theme='${defaultTheme}';d.dataset.mode='${defaultMode}';try{const v=localStorage.getItem('${themeStorageKey}');if(${JSON.stringify(themes.map(t=>t.id))}.includes(v))d.dataset.theme=v;const m=localStorage.getItem('${modeStorageKey}');if(m==='dark'||m==='light')d.dataset.mode=m}catch{}})();`;
