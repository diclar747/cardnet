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
export const themeInitialization = `(()=>{try{const v=localStorage.getItem('${themeStorageKey}');if(${JSON.stringify(themes.map(t=>t.id))}.includes(v))document.documentElement.dataset.theme=v;document.documentElement.dataset.mode=localStorage.getItem('${modeStorageKey}')==='dark'?'dark':'light'}catch{}})();`;
