import { create } from 'zustand';
import { portfolioFileSystem } from '../data/filesystem';
import { defaultTerminalState, executeTerminalCommand } from '../utils/terminalParser';
import type { TerminalHistoryEntry } from '../types/terminal';

interface TerminalStoreState {
  cwd: string;
  history: TerminalHistoryEntry[];
  runCommand: (input: string, openPath: (path: string) => void) => void;
}

export const useTerminalStore = create<TerminalStoreState>((set) => ({
  cwd: defaultTerminalState.cwd,
  history: defaultTerminalState.history,
  runCommand: (input, openPath) =>
    set((state) => {
      const result = executeTerminalCommand(input, {
        cwd: state.cwd,
        root: portfolioFileSystem,
        openPath,
      });

      if (result.clear) {
        return { cwd: result.nextCwd, history: [] };
      }

      return {
        cwd: result.nextCwd,
        history: [...state.history, ...result.entries],
      };
    }),
}));
