import { useEffect, useRef, useState } from 'react';
import { Play, X } from 'lucide-react';

// Candidates from the project brief, kept in the local preview pending review.
const candidates: Record<string, string> = {
  cloud: 'QpAlFxXLmII', dooh: 'MqrXFe9-qHU', bus: '29KQ7XagPE8', rounds: '6dr89zh09_M',
  parking: 'dI0gMjmd65U', club: 'tgsJtg366MQ', buildings: '8ybon4hYFTQ', visits: '81NOBZGZdEc',
  events: 'cqfdBp5eZOs', nocash: 'EhMOzPofJaI', trip: '7nPfAGplrM4', 'parking-2': 'JMbaMVEIjYU',
  toll: 'D7UehwPTlAU', biopoint: 'ZZ41T1BBPHk', city: 'fbKmu1IrVVM', 'parking-3': 'BoWfreivbhM',
  'parking-4': 'gRiEJY56HV4', road: 'pQi2-XOG-N0', doorvi: 'NwekjsbAR98', 'doorvi-home': 'U7hWpAeY5w8',
  barber: '_6xU1p3FN4o', biopass: 'PWQSRtCLiu8', spaces: 'avHeTzh4r_E', pharmacy: 'nDrcB8Cpl1Q',
  hospital: 'wHfik6ZldkE', 'biopass-enterprise': 'jTZ19uQYMjw', medical: 'CCbQp0aBwkY',
  appointments: 'vqCeR9IUzHA', insurance: 'hagmPLesexE',
};

type Player = { destroy(): void };
type YouTubeApi = { Player: new (element: HTMLIFrameElement, options: {
  events: { onStateChange(event: { data: number }): void; onError(): void };
}) => Player };
type VideoWindow = Window & { YT?: YouTubeApi; onYouTubeIframeAPIReady?: () => void };
let apiRequest: Promise<YouTubeApi> | undefined;

function loadYouTube(): Promise<YouTubeApi> {
  const videoWindow = window as VideoWindow;
  if (videoWindow.YT?.Player) return Promise.resolve(videoWindow.YT);
  apiRequest ??= new Promise<YouTubeApi>((resolve, reject) => {
    const script = document.createElement('script');
    const previous = videoWindow.onYouTubeIframeAPIReady;
    const fail = () => {
      clearTimeout(timeout);
      script.remove();
      videoWindow.onYouTubeIframeAPIReady = previous;
      apiRequest = undefined;
      reject(new Error('YouTube no está disponible.'));
    };
    const timeout = window.setTimeout(fail, 8000);
    videoWindow.onYouTubeIframeAPIReady = () => {
      if (!videoWindow.YT?.Player) { fail(); return; }
      clearTimeout(timeout);
      videoWindow.onYouTubeIframeAPIReady = previous;
      previous?.();
      resolve(videoWindow.YT);
    };
    script.src = 'https://www.youtube.com/iframe_api';
    script.onerror = fail;
    document.head.appendChild(script);
  });
  return apiRequest;
}

export default function ProjectVideo({ id, name, after }: { id: string; name: string; after?: () => void }) {
  const [preview, setPreview] = useState(false);
  const [opened, setOpened] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const frame = useRef<HTMLIFrameElement>(null);
  const ended = useRef(after);
  useEffect(() => { ended.current = after; }, [after]);
  useEffect(() => { setPreview(['localhost', '127.0.0.1'].includes(window.location.hostname)); }, []);
  const candidate = candidates[id];
  useEffect(() => {
    if (!opened || !candidate) return;
    let disposed = false;
    let player: Player | undefined;
    loadYouTube().then(api => {
      if (disposed || !frame.current) return;
      player = new api.Player(frame.current, { events: {
        onStateChange: ({ data }) => {
          if (data === 1) window.speechSynthesis?.cancel();
          if (data === 0) ended.current?.();
        },
        onError: () => setUnavailable(true),
      } });
    }).catch(() => { if (!disposed) setUnavailable(true); });
    return () => { disposed = true; player?.destroy(); };
  }, [opened, candidate]);

  if (!preview || !candidate) return <p className="project-video-note">Podés recorrer esta solución en la ficha y las imágenes. El video está pendiente de revisión.</p>;
  return <div className="project-video" data-cardnet-video={opened ? 'open' : undefined}>
    {opened ? <>
      <button onClick={() => setOpened(false)}><X size={15}/> Cerrar video</button>
      <div className="project-video-frame"><iframe ref={frame} title={`Video de ${name}`}
        src={`https://www.youtube-nocookie.com/embed/${candidate}?enablejsapi=1&playsinline=1&origin=${encodeURIComponent(window.location.origin)}`}
        allow="encrypted-media; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin"/></div>
      {unavailable && <p role="status">La reproducción no pudo verificarse. Podés abrir el enlace original o seguir con la ficha.</p>}
      <a href={`https://www.youtube.com/watch?v=${candidate}`} target="_blank" rel="noopener noreferrer">Revisar enlace original</a>
      {after && <button onClick={() => { setOpened(false); after(); }}>Continuar después del video</button>}
    </> : <><button onClick={() => { window.speechSynthesis?.cancel(); setUnavailable(false); setOpened(true); }}><Play size={16}/> Probar video</button><small>Enlace del análisis pendiente de verificación.</small></>}
  </div>;
}
