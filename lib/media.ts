export const media = (name: string) => `/images/cardnet/${name}.png`;

const moduleImages: Record<string, string> = {
  cloud:'cloud', dooh:'dooh', access:'access', bus:'mobility', works:'buildings',
  delivery:'operations', rounds:'access', parking:'mobility', club:'club', buildings:'buildings',
  school:'schools', home:'home', visits:'operations', events:'club', attendance:'access',
  smart:'ai', ai:'ai', nocash:'ai', sentinel:'operations', trip:'mobility', toll:'mobility',
  biopoint:'access', city:'hero', 'insurance-alert':'mobility', road:'mobility',
  doorvi:'buildings', 'doorvi-home':'home', bioquant:'health', barber:'barber',
  biopass:'health', spaces:'buildings', pharmacy:'health', hospital:'health', medical:'health',
  appointments:'health', insurance:'operations', maintenance:'mobility',
};

export const mediaForModule = (id: string) => media(moduleImages[id] || 'operations');

export const industries = [
  { id:'club', name:'Clubes y comunidades', label:'DOORWAY CLUB', image:'club', description:'Socios, invitados, actividades y espacios compartidos.' },
  { id:'buildings', name:'Edificios conectados', label:'DOORWAY EDIFICIOS', image:'buildings', description:'Accesos, residentes y administración en un mismo entorno.' },
  { id:'school', name:'Educación más conectada', label:'DOORWAY COLEGIOS', image:'schools', description:'Asistencia, accesos y comunicación con las familias.' },
  { id:'home', name:'El hogar inteligente', label:'DOORWAY HOME', image:'home', description:'Tu residencia, tus accesos y tu tranquilidad.' },
  { id:'parking', name:'Movilidad sin fricción', label:'DOORWAY MOVILIDAD', image:'mobility', description:'Estacionamientos, transporte y servicios en movimiento.' },
  { id:'hospital', name:'Salud y bienestar', label:'CORTEX SALUD', image:'health', description:'Una visión integrada de atención, información y gestión.' },
];
