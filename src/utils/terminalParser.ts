import { portfolioFileSystem } from '../data/filesystem';
import { projects, profile } from '../data/portfolioContent';
import type { TerminalHistoryEntry } from '../types/terminal';
import type { FileSystemDirectory } from '../types/filesystem';
import { findNode, isDirectory, isFile, listDirectory, normalizePath, renderTree } from './filesystemHelpers';

interface TerminalContext {
  cwd: string;
  root: FileSystemDirectory;
  openPath: (path: string) => void;
}

export interface TerminalResult {
  nextCwd: string;
  clear?: boolean;
  entries: TerminalHistoryEntry[];
}

function entry(type: TerminalHistoryEntry['type'], content: string): TerminalHistoryEntry {
  return {
    id: `${type}-${Math.random().toString(36).slice(2, 9)}`,
    type,
    content,
  };
}

export function executeTerminalCommand(rawInput: string, context: TerminalContext): TerminalResult {
  const trimmed = rawInput.trim();

  if (!trimmed) {
    return { nextCwd: context.cwd, entries: [] };
  }

  const [command, ...args] = trimmed.split(/\s+/);
  const entries: TerminalHistoryEntry[] = [entry('input', `${profile.name.toLowerCase().replace(/\s+/g, '')}@tonyos:${context.cwd}$ ${trimmed}`)];

  const respond = (content: string, type: TerminalHistoryEntry['type'] = 'output', nextCwd = context.cwd): TerminalResult => ({
    nextCwd,
    entries: [...entries, entry(type, content)],
  });

  switch (command) {
    case 'help':
      return respond(
        'Commands: help, ls, cd, pwd, cat, open, clear, whoami, uname, neofetch, tree, echo, projects, resume, contact, sudo',
      );
    case 'ls': {
      const targetPath = normalizePath(args[0] ?? '.', context.cwd);
      const node = findNode(context.root, targetPath);
      if (!isDirectory(node)) {
        return respond(`ls: cannot access '${args[0] ?? '.'}': No such directory`, 'error');
      }
      const content = listDirectory(node)
        .map((child) => (child.kind === 'directory' ? `${child.name}/` : child.name))
        .join('    ');
      return respond(content || '(empty)');
    }
    case 'cd': {
      const targetPath = normalizePath(args[0] ?? '/home/tony', context.cwd);
      const node = findNode(context.root, targetPath);
      if (!isDirectory(node)) {
        return respond(`cd: no such directory: ${args[0] ?? ''}`, 'error');
      }
      return {
        nextCwd: targetPath,
        entries,
      };
    }
    case 'pwd':
      return respond(context.cwd);
    case 'cat': {
      const targetPath = normalizePath(args[0] ?? '', context.cwd);
      const node = findNode(context.root, targetPath);
      if (!isFile(node)) {
        return respond(`cat: ${args[0] ?? ''}: No such file`, 'error');
      }
      return respond(node.content);
    }
    case 'open': {
      const targetPath = normalizePath(args[0] ?? '', context.cwd);
      const node = findNode(context.root, targetPath);
      if (!node) {
        return respond(`open: ${args[0] ?? ''}: No such file or directory`, 'error');
      }
      context.openPath(targetPath);
      return respond(`Opening ${targetPath}...`);
    }
    case 'clear':
      return { nextCwd: context.cwd, clear: true, entries };
    case 'whoami':
      return respond('tony');
    case 'uname':
      return respond('TonyOS 1.0.0 browser-x86_64');
    case 'neofetch':
      return respond(
        [
          'TonyOS',
          '-------',
          `User: tony`,
          `Role: ${profile.role}`,
          'Focus: systems, infrastructure, distributed systems',
          'Shell: zsh',
          'Window Manager: ZustandWM',
        ].join('\n'),
      );
    case 'tree': {
      const targetPath = normalizePath(args[0] ?? '.', context.cwd);
      const node = findNode(context.root, targetPath);
      if (!node) {
        return respond(`tree: ${args[0] ?? ''}: No such file or directory`, 'error');
      }
      return respond(renderTree(node));
    }
    case 'echo':
      return respond(args.join(' '));
    case 'projects':
      return respond(projects.map((project) => `- ${project.title}`).join('\n'));
    case 'resume':
      context.openPath('/home/tony/resume.pdf');
      return respond('Opening resume.pdf...');
    case 'contact':
      context.openPath('/home/tony/contact.txt');
      return respond(profile.contact.email);
    case 'sudo':
      if (args.join(' ') === 'hire tony') {
        return respond('Permission granted. Recruiter mode enabled.');
      }
      return respond('sudo: command not found in secure recruiter shell', 'error');
    default:
      return respond(`${command}: command not found`, 'error');
  }
}

export const defaultTerminalState = {
  cwd: '/home/tony',
  history: [
    entry('output', 'Welcome to TonyOS. Type `help` to inspect the portfolio filesystem.'),
    entry('output', renderTree(portfolioFileSystem)),
  ],
};
