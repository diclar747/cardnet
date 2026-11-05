import { hydrateRoot } from 'react-dom/client';
import StaticApp from './app';
import '../app/theme.css';
import '../app/palettes.css';
import '../app/corporate.css';
import '../app/appearance.css';
import './static.css';
import '../app/pwa.css';
import './app-shell.css';

hydrateRoot(document.getElementById('root')!, <StaticApp path={window.location.pathname}/>);
