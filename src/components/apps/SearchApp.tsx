import { useMemo, useState } from 'react';
import { portfolioFileSystem } from '../../data/filesystem';
import { profile, projects, experience } from '../../data/portfolioContent';
import { findNode, isDirectory } from '../../utils/filesystemHelpers';
import { useWindowStore } from '../../store/useWindowStore';
import { Panel } from '../ui/Panel';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  targetPath?: string;
  appType?: 'about' | 'contact' | 'experience' | 'spotify';
}

const searchIndex: SearchResult[] = [
  {
    id: 'about',
    title: 'About Tony',
    description: profile.tagline,
    appType: 'about',
  },
  {
    id: 'contact',
    title: 'Contact',
    description: `${profile.contact.email} · GitHub · LinkedIn`,
    appType: 'contact',
  },
  {
    id: 'experience',
    title: 'Experience',
    description: 'Professional experience and internships.',
    appType: 'experience',
  },
  {
    id: 'spotify',
    title: 'Spotify Playlists',
    description: 'Public playlist explorer for Tony’s music taste.',
    appType: 'spotify',
  },
  ...projects.map((project) => ({
    id: `project-${project.slug}`,
    title: project.title,
    description: project.summary,
    targetPath: `/home/tony/projects/${project.slug}.md`,
  })),
  ...experience.map((entry) => ({
    id: `experience-${entry.company}`,
    title: `${entry.company} (${entry.role})`,
    description: entry.highlights[0] ?? entry.period,
    targetPath: `/home/tony/experience/${entry.company.toLowerCase().replace(/\s+/g, '-')}.md`,
  })),
];

const rootDocs = findNode(portfolioFileSystem, '/home/tony');
if (isDirectory(rootDocs)) {
  rootDocs.children.forEach((node) => {
    searchIndex.push({
      id: `file-${node.path}`,
      title: node.name,
      description: node.kind === 'directory' ? 'Folder' : `File · ${node.extension}`,
      targetPath: node.kind === 'directory' ? `${node.path}/` : node.path,
    });
  });
}

export function SearchApp() {
  const [query, setQuery] = useState('');
  const { openWindow, openPathWindow } = useWindowStore();

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return searchIndex.slice(0, 8);
    }

    return searchIndex.filter((entry) =>
      `${entry.title} ${entry.description}`.toLowerCase().includes(normalized),
    );
  }, [query]);

  const openResult = (result: SearchResult) => {
    if (result.targetPath) {
      openPathWindow(result.targetPath);
      return;
    }

    if (result.appType) {
      openWindow(result.appType, {
        title: result.title,
        payload: result.appType === 'spotify' ? { view: 'home' } : undefined,
      });
    }
  };

  return (
    <div className="space-y-5 p-5">
      <Panel title="Search" subtitle="Search TonyOS content">
        <div className="space-y-4">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search files, projects, playlists, and content..."
            className="w-full border border-black bg-white px-3 py-2 text-sm text-black shadow-[inset_-1px_-1px_0_#808080,inset_1px_1px_0_#ffffff] outline-none"
          />
          <div className="border border-[#808080] bg-white shadow-[inset_-1px_-1px_0_#dfdfdf,inset_1px_1px_0_#808080]">
            {results.length === 0 ? (
              <div className="p-4 text-sm text-black">No matching results.</div>
            ) : (
              results.map((result) => (
                <button
                  key={result.id}
                  type="button"
                  onClick={() => openResult(result)}
                  className="flex w-full flex-col gap-1 border-b border-[#d0d0d0] px-4 py-3 text-left text-black hover:bg-[#000080] hover:text-white"
                >
                  <span className="text-sm font-bold">{result.title}</span>
                  <span className="text-xs">{result.description}</span>
                </button>
              ))
            )}
          </div>
        </div>
      </Panel>
    </div>
  );
}
