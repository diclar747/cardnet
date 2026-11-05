import { modules } from './catalog';

const routes = {
  cloud: 'cloud-cardnet', dooh: 'dooh', access: 'doorway-virtual', bus: 'doorway-bus',
  works: 'doorway-inspector-obras', delivery: 'doorway-entrega', rounds: 'doorway-ronda',
  parking: 'doorway-global', club: 'doorway-club', buildings: 'doorway-edificios',
  school: 'doorway-colegios', home: 'doorway-home', visits: 'doorway-online-control',
  events: 'doorway-qr-track', attendance: 'doorway-reloj-marcador', smart: 'smart-track',
  ai: 'inteligencia-artificial', nocash: 'nocash', sentinel: 'centinela-remota',
  trip: 'doorway-viaje-blindado', toll: 'doorway-express', biopoint: 'doorway-biopoint-pro',
  city: 'doorway-city-alert', 'insurance-alert': 'doorway-seguro-alert', road: 'doorway-ruta-alert',
  doorvi: 'doorvi-edificios', 'doorvi-home': 'doorvi-residencias', bioquant: 'doorway-bio-cuantico',
  barber: 'cortex-barberias', biopass: 'cortex-bio-pass', spaces: 'cortex-edificios',
  pharmacy: 'cortex-farmacias', hospital: 'cortex-hospital-universidad',
  medical: 'cortex-medical-center', appointments: 'cortex-reserva-consultas', insurance: 'cortex-seguros',
} as Record<string, string>;

export const siteProducts = [
  ...modules.filter(product => product.id in routes).map(product => ({ ...product, slug: routes[product.id], imageId: product.id })),
  { id: 'parking-2', name: 'Doorway Estacionamiento II', category: 'Movilidad', description: 'Estacionamiento de paso ágil, con menos puntos de detención.', features: ['Ingreso y salida sin tótems', 'Registro de sesiones', 'Conciliación de la operación'], slug: 'doorway-estacionamiento-2', imageId: 'parking' },
  { id: 'parking-3', name: 'Doorway Estacionamiento III', category: 'Movilidad', description: 'Organización del tránsito en estacionamientos mediante señalización inteligente.', features: ['Semáforo inteligente', 'Gestión de entradas y salidas', 'Evaluación del espacio'], slug: 'doorway-estacionamiento-3', imageId: 'parking' },
  { id: 'parking-4', name: 'Doorway Estacionamiento IV', category: 'Movilidad', description: 'Control de circulación para estacionamientos de uso gratuito.', features: ['Seguimiento de ocupación', 'Control de accesos', 'Reportes operativos'], slug: 'doorway-estacionamiento-4', imageId: 'parking' },
  { id: 'biopass-enterprise', name: 'Cortex Bio-Pass Empresas', category: 'Salud', description: 'Organización de información de emergencia para equipos de trabajo.', features: ['Perfiles de emergencia', 'Acceso con permisos', 'Protocolos por organización'], slug: 'cortex-bio-pass-empresas', imageId: 'biopass' },
];

export const institutionalPages = {
  'doorway-cortex': { title: 'Doorway Cortex', description: 'Soluciones conversacionales para reservas, atención y seguimiento.' },
  'como-contratamos': { title: 'Cómo contratamos', description: 'Evaluación, configuración y capacitación para incorporar la solución a tu operación.' },
  contacto: { title: 'Contacto', description: 'Contactá a CARDNET en Paraguay, Brasil, Argentina y Uruguay.' },
  empresa: { title: 'Empresa', description: 'Conocé la trayectoria y las líneas de tecnología de CARDNET.' },
  privacidad: { title: 'Privacidad', description: 'Información sobre el uso de datos en esta versión de CARDNET.' },
  terminos: { title: 'Términos', description: 'Información sobre el alcance del catálogo y las condiciones de contratación.' },
};

export const siteRoutes = [...siteProducts.map(product => product.slug), ...Object.keys(institutionalPages)];
export type SiteProduct = typeof siteProducts[number];
export const productUrl = (product: SiteProduct) => `/${product.slug}/`;
export const whatsappUrl = (message: string, phone = '595981405077') => `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
