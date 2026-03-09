import type { AppType } from '../types/window';

export function getWindowIcon(appType: AppType): string {
  switch (appType) {
    case 'spotify':
      return '/CD_small.png';
    case 'terminal':
      return '/terminal.png';
    case 'search':
      return '/Search_small.png';
    case 'help':
      return '/Help_small.png';
    case 'explorer':
    case 'projects':
    case 'experience':
      return appType === 'explorer' ? '/Documents_small.png' : '/Folder_small.png';
    default:
      return '/Notepad_small.png';
  }
}
