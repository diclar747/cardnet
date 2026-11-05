import Solutions from '../app/soluciones/page';
import ThemePicker from '../app/theme-picker';
import Pwa from '../app/pwa';
import CatalogPanel from './catalog-panel';
import { Cardy, ProjectLinks, ProjectPage } from './project-pages';
import { siteRoutes } from '../lib/site-catalog';

export default function StaticApp({ path = '/' }: { path?: string }) {
  const slug = path.split('/').filter(Boolean)[0] ?? '';
  if (slug === 'instalar') return <><Pwa installationPage/><ThemePicker/></>;
  const content = slug === 'panel' ? <CatalogPanel/> : siteRoutes.includes(slug)
    ? <ProjectPage slug={slug}/>
    : <><Solutions panelHref="/panel/" staticMode/><ProjectLinks/></>;
  return <>{content}<Pwa/><ThemePicker/><Cardy/></>;
}
