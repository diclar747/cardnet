export const installedStorageKey = 'cardnet.pwa.installed.v1';

export function isCardnetInstalled(standalone: boolean, remembered: boolean, related: { platform?: string; url?: string; id?: string }[] = [], origin = '') {
  return standalone || remembered || related.some(app => app.platform === 'webapp' && (app.url === `${origin}/manifest.webmanifest` || app.id === `${origin}/`));
}
