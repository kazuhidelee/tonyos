import type { AppType } from '../types/window';

export function getWindowIcon(appType: AppType): string {
  switch (appType) {
    case 'spotify':
      return '/CD_small.png';
    case 'terminal':
      return '/terminal.png';
    case 'artwork':
    case 'image':
      return '/Paint_small.png';
    case 'search':
      return '/Search_small.png';
    case 'help':
      return '/Help_small.png';
    case 'explorer':
    case 'projects':
    case 'experience':
      if (appType === 'explorer') {
        return '/Documents_small.png';
      }
      if (appType === 'projects') {
        return '/Tools_small.png';
      }
      return '/Folder_small.png';
    default:
      return '/Notepad_small.png';
  }
}
