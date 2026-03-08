import type { FileSystemDirectory, FileSystemFile, FileSystemNode } from '../types/filesystem';

export function normalizePath(input: string, cwd = '/home/tony'): string {
  const raw = input.trim() || '.';
  const base = raw.startsWith('/') ? raw : `${cwd}/${raw}`;
  const parts = base.split('/').filter(Boolean);
  const normalized: string[] = [];

  parts.forEach((part) => {
    if (part === '.') {
      return;
    }
    if (part === '..') {
      normalized.pop();
      return;
    }
    normalized.push(part);
  });

  return `/${normalized.join('/')}` || '/';
}

export function findNode(root: FileSystemDirectory, path: string): FileSystemNode | null {
  if (path === '/') {
    return root;
  }

  const parts = path.split('/').filter(Boolean);
  let current: FileSystemNode = root;

  for (const part of parts) {
    if (current.kind !== 'directory') {
      return null;
    }
    const next: FileSystemNode | undefined = current.children.find((child) => child.name === part);
    if (!next) {
      return null;
    }
    current = next;
  }

  return current;
}

export function listDirectory(node: FileSystemNode): FileSystemNode[] {
  return node.kind === 'directory' ? node.children : [];
}

export function isDirectory(node: FileSystemNode | null): node is FileSystemDirectory {
  return Boolean(node && node.kind === 'directory');
}

export function isFile(node: FileSystemNode | null): node is FileSystemFile {
  return Boolean(node && node.kind === 'file');
}

export function getBreadcrumbs(path: string): string[] {
  if (path === '/') {
    return ['/'];
  }
  const parts = path.split('/').filter(Boolean);
  return parts.map((_, index) => `/${parts.slice(0, index + 1).join('/')}`);
}

export function renderTree(node: FileSystemNode, depth = 0): string {
  const prefix = depth === 0 ? '' : `${'  '.repeat(depth - 1)}|- `;
  if (node.kind === 'file') {
    return `${prefix}${node.name}`;
  }

  const lines = [depth === 0 ? node.path : `${prefix}${node.name}/`];
  node.children.forEach((child) => {
    lines.push(renderTree(child, depth + 1));
  });
  return lines.join('\n');
}
