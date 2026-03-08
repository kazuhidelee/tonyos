export interface TerminalHistoryEntry {
  id: string;
  type: 'input' | 'output' | 'error';
  content: string;
}

export interface TerminalState {
  cwd: string;
  history: TerminalHistoryEntry[];
}
