import { create } from 'zustand';

interface DesktopIconPosition {
  x: number;
  y: number;
}

interface DesktopState {
  showBoot: boolean;
  bootCompleted: boolean;
  selectedIconId: string | null;
  iconPositions: Record<string, DesktopIconPosition>;
  setBootCompleted: () => void;
  skipBoot: () => void;
  selectIcon: (id: string | null) => void;
  moveIcon: (id: string, position: DesktopIconPosition) => void;
}

export const useDesktopStore = create<DesktopState>((set) => ({
  showBoot: true,
  bootCompleted: false,
  selectedIconId: null,
  iconPositions: {},
  setBootCompleted: () => set({ bootCompleted: true, showBoot: false }),
  skipBoot: () => set({ bootCompleted: true, showBoot: false }),
  selectIcon: (id) => set({ selectedIconId: id }),
  moveIcon: (id, position) =>
    set((state) => ({
      iconPositions: {
        ...state.iconPositions,
        [id]: position,
      },
    })),
}));
