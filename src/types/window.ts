export type AppType =
  | 'about'
  | 'projects'
  | 'experience'
  | 'open-source'
  | 'resume'
  | 'contact'
  | 'terminal'
  | 'spotify'
  | 'search'
  | 'help'
  | 'explorer'
  | 'text'
  | 'project'
  | 'traditional';

export interface WindowPosition {
  x: number;
  y: number;
}

export interface WindowSize {
  width: number;
  height: number;
}

export interface AppWindow {
  id: string;
  appType: AppType;
  title: string;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: WindowPosition;
  size: WindowSize;
  payload?: unknown;
}
