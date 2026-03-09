export type FileKind = 'directory' | 'file';
export type FileExtension = 'txt' | 'md' | 'json' | 'pdf' | 'jpg' | 'jpeg' | 'png';

export interface FileSystemBase {
  name: string;
  path: string;
  kind: FileKind;
}

export interface FileSystemDirectory extends FileSystemBase {
  kind: 'directory';
  children: FileSystemNode[];
}

export interface FileSystemFile extends FileSystemBase {
  kind: 'file';
  extension: FileExtension;
  content: string;
}

export type FileSystemNode = FileSystemDirectory | FileSystemFile;
