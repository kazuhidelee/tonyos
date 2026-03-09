import type { AppType, AppWindow } from '../types/window';

let windowCount = 0;

const defaultTitles: Record<AppType, string> = {
  about: 'about.txt',
  projects: 'projects/',
  experience: 'experience/',
  'open-source': 'open-source.md',
  resume: 'resume.pdf',
  contact: 'contact.txt',
  terminal: 'terminal',
  spotify: 'spotify playlists',
  explorer: 'files',
  text: 'viewer',
  project: 'project',
  traditional: 'portfolio',
};

const defaultSizes: Record<AppType, { width: number; height: number }> = {
  about: { width: 640, height: 480 },
  projects: { width: 800, height: 560 },
  experience: { width: 760, height: 520 },
  'open-source': { width: 680, height: 460 },
  resume: { width: 760, height: 560 },
  contact: { width: 520, height: 420 },
  terminal: { width: 760, height: 500 },
  spotify: { width: 860, height: 580 },
  explorer: { width: 820, height: 540 },
  text: { width: 680, height: 460 },
  project: { width: 780, height: 560 },
  traditional: { width: 1024, height: 680 },
};

export function createWindow(appType: AppType, payload?: unknown, overrides?: Partial<AppWindow>): AppWindow {
  windowCount += 1;
  const size = defaultSizes[appType];
  const payloadTitle =
    typeof payload === 'object' && payload && 'title' in (payload as Record<string, unknown>)
      ? String((payload as Record<string, unknown>).title)
      : undefined;

  return {
    id: `${appType}-${windowCount}`,
    appType,
    title: overrides?.title ?? payloadTitle ?? defaultTitles[appType],
    isMinimized: false,
    isMaximized: false,
    zIndex: windowCount,
    position: {
      x: 80 + (windowCount % 4) * 28,
      y: 72 + (windowCount % 3) * 24,
    },
    size,
    payload,
    ...(overrides ?? {}),
  };
}
