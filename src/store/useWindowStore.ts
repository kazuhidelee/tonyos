import { create } from 'zustand';
import { portfolioFileSystem } from '../data/filesystem';
import type { AppType, AppWindow, WindowPosition, WindowSize } from '../types/window';
import { createWindow } from '../utils/windowHelpers';
import { findNode, isDirectory } from '../utils/filesystemHelpers';

interface OpenWindowOptions {
  payload?: unknown;
  singleton?: boolean;
  title?: string;
}

interface WindowState {
  windows: AppWindow[];
  focusedWindowId: string | null;
  zCounter: number;
  openWindow: (appType: AppType, options?: OpenWindowOptions) => void;
  focusWindow: (id: string) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  moveWindow: (id: string, position: WindowPosition) => void;
  resizeWindow: (id: string, size: WindowSize) => void;
  openPathWindow: (path: string) => void;
  resetWindows: () => void;
}

function getPathLabel(path: string): string {
  const normalized = path.replace(/\/$/, '');
  if (!normalized || normalized === '/') {
    return '/';
  }
  return normalized.split('/').pop() ?? normalized;
}

function resolvePathToApp(path: string): { appType: AppType; title: string; payload?: unknown } {
  const node = findNode(portfolioFileSystem, path.replace(/\/$/, '') || '/');
  if (path.endsWith('/') || isDirectory(node)) {
    return { appType: 'explorer', title: getPathLabel(path), payload: { path } };
  }

  if (path.endsWith('resume.pdf')) {
    return { appType: 'resume', title: 'resume.pdf', payload: { path } };
  }

  if (path.endsWith('.md')) {
    if (path.includes('/projects/')) {
      return { appType: 'project', title: getPathLabel(path), payload: { path } };
    }
    return { appType: 'text', title: getPathLabel(path), payload: { path } };
  }

  if (path.endsWith('.txt') || path.endsWith('.json')) {
    return { appType: 'text', title: getPathLabel(path), payload: { path } };
  }

  return { appType: 'explorer', title: getPathLabel(path), payload: { path } };
}

export const useWindowStore = create<WindowState>((set, get) => ({
  windows: [],
  focusedWindowId: null,
  zCounter: 1,
  openWindow: (appType, options) =>
    set((state) => {
      if (options?.singleton) {
        const existing = state.windows.find((window) => window.appType === appType);
        if (existing) {
          const nextZ = state.zCounter + 1;
          return {
            windows: state.windows.map((window) =>
              window.id === existing.id ? { ...window, isMinimized: false, zIndex: nextZ } : window,
            ),
            focusedWindowId: existing.id,
            zCounter: nextZ,
          };
        }
      }

      const nextZ = state.zCounter + 1;
      const window = createWindow(appType, options?.payload, {
        title: options?.title ?? undefined,
        zIndex: nextZ,
      });

      return {
        windows: [...state.windows, window],
        focusedWindowId: window.id,
        zCounter: nextZ,
      };
    }),
  focusWindow: (id) =>
    set((state) => {
      const nextZ = state.zCounter + 1;
      return {
        windows: state.windows.map((window) =>
          window.id === id ? { ...window, zIndex: nextZ, isMinimized: false } : window,
        ),
        focusedWindowId: id,
        zCounter: nextZ,
      };
    }),
  closeWindow: (id) =>
    set((state) => ({
      windows: state.windows.filter((window) => window.id !== id),
      focusedWindowId: state.focusedWindowId === id ? null : state.focusedWindowId,
    })),
  minimizeWindow: (id) =>
    set((state) => ({
      windows: state.windows.map((window) => (window.id === id ? { ...window, isMinimized: true } : window)),
      focusedWindowId: state.focusedWindowId === id ? null : state.focusedWindowId,
    })),
  maximizeWindow: (id) =>
    set((state) => ({
      windows: state.windows.map((window) =>
        window.id === id ? { ...window, isMaximized: !window.isMaximized, isMinimized: false } : window,
      ),
      focusedWindowId: id,
    })),
  restoreWindow: (id) =>
    set((state) => ({
      windows: state.windows.map((window) => (window.id === id ? { ...window, isMinimized: false } : window)),
      focusedWindowId: id,
    })),
  moveWindow: (id, position) =>
    set((state) => ({
      windows: state.windows.map((window) => (window.id === id ? { ...window, position } : window)),
    })),
  resizeWindow: (id, size) =>
    set((state) => ({
      windows: state.windows.map((window) => (window.id === id ? { ...window, size } : window)),
    })),
  openPathWindow: (path) => {
    const normalizedPath = path;
    const target = resolvePathToApp(normalizedPath);
    get().openWindow(target.appType, { payload: target.payload, title: target.title });
  },
  resetWindows: () =>
    set({
      windows: [],
      focusedWindowId: null,
      zCounter: 1,
    }),
}));
