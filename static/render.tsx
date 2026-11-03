import { renderToString } from 'react-dom/server';
import StaticApp from './app';
export function render(path: string) { return renderToString(<StaticApp path={path}/>); }
