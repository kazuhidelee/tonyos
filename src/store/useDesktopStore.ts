import { create } from 'zustand';

interface DesktopIconPosition {
  x: number;
  y: number;
}

const BOOT_SEEN_KEY = 'tonyos.bootSeen';

function hasSeenBoot(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  return window.localStorage.getItem(BOOT_SEEN_KEY) === 'true';
}

function markBootSeen() {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.setItem(BOOT_SEEN_KEY, 'true');
}

interface DesktopState {
  showBoot: boolean;
  bootCompleted: boolean;
  bootStarted: boolean;
  selectedIconId: string | null;
  iconPositions: Record<string, DesktopIconPosition>;
  setBootCompleted: () => void;
  startBoot: () => void;
  skipBoot: () => void;
  restartSession: () => void;
  selectIcon: (id: string | null) => void;
  moveIcon: (id: string, position: DesktopIconPosition) => void;
}

export const useDesktopStore = create<DesktopState>((set) => ({
  showBoot: !hasSeenBoot(),
  bootCompleted: hasSeenBoot(),
  bootStarted: hasSeenBoot(),
  selectedIconId: null,
  iconPositions: {},
  setBootCompleted: () => {
    markBootSeen();
    set({ bootCompleted: true, showBoot: false, bootStarted: true });
  },
  startBoot: () => set({ bootStarted: true }),
  skipBoot: () => {
    markBootSeen();
    set({ bootCompleted: true, showBoot: false, bootStarted: true });
  },
  restartSession: () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(BOOT_SEEN_KEY);
    }
    set({
      showBoot: true,
      bootCompleted: false,
      bootStarted: false,
      selectedIconId: null,
    });
  },
  selectIcon: (id) => set({ selectedIconId: id }),
  moveIcon: (id, position) =>
    set((state) => ({
      iconPositions: {
        ...state.iconPositions,
        [id]: position,
      },
    })),
}));
