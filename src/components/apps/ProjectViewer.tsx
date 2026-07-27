import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';
import { projects } from '../../data/portfolioContent';
import { useWindowStore } from '../../store/useWindowStore';

interface ProjectViewerProps {
  path: string;
  windowId: string;
}

interface ProjectSection {
  title: string;
  body: ReactNode;
}

function normalizeForComparison(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((token) => token.length > 2);
}

function trimDuplicateIntro(summary: string, overview: string) {
  const trimmedOverview = overview.trim();
  if (!trimmedOverview) {
    return '';
  }

  const firstSentenceMatch = trimmedOverview.match(/^.*?[.!?](?:\s|$)/);
  if (!firstSentenceMatch) {
    return trimmedOverview;
  }

  const firstSentence = firstSentenceMatch[0].trim();
  const rest = trimmedOverview.slice(firstSentenceMatch[0].length).trim();
  const summaryTokens = new Set(normalizeForComparison(summary));
  const firstSentenceTokens = normalizeForComparison(firstSentence);

  if (!summaryTokens.size || !firstSentenceTokens.length) {
    return trimmedOverview;
  }

  const overlapCount = firstSentenceTokens.filter((token) => summaryTokens.has(token)).length;
  const overlapRatio = overlapCount / Math.max(firstSentenceTokens.length, 1);

  if (overlapRatio >= 0.35 && rest) {
    return rest;
  }

  return trimmedOverview;
}

function toFirstPersonBuildLine(summary: string) {
  const trimmed = summary.trim();
  if (!trimmed) {
    return '';
  }
  if (/^i\s/i.test(trimmed)) {
    return trimmed;
  }
  return `I built ${trimmed.charAt(0).toLowerCase()}${trimmed.slice(1)}`;
}

function renderExtraSlide(slide: {
  title: string;
  description?: string;
  bullets?: string[];
  image?: string;
  imageAlt?: string;
  zoomableImage?: boolean;
  images?: Array<{ src: string; alt: string }>;
}) {
  return (
    <section key={slide.title} className="space-y-3">
      <div className="font-bold">{slide.title}</div>
      <div className={slide.image || slide.images?.length ? 'grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]' : 'space-y-4'}>
        <div className="space-y-4">
          {slide.description ? <p>{slide.description}</p> : null}
          {slide.bullets?.length ? (
            <ul className="space-y-3">
              {slide.bullets.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          ) : null}
        </div>
        {slide.image ? (
          slide.zoomableImage === false ? (
            <img
              src={slide.image}
              alt={slide.imageAlt || slide.title}
              draggable={false}
              className="block w-full select-none object-contain"
            />
          ) : (
            <ZoomableImage src={slide.image} alt={slide.imageAlt || slide.title} />
          )
        ) : null}
        {!slide.image && slide.images?.length ? (
          <div className="space-y-4">
            {slide.images.map((image) => (
              <img
                key={image.src}
                src={image.src}
                alt={image.alt}
                draggable={false}
                className="block w-full select-none object-contain"
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function isResultSlide(title: string) {
  const normalized = title.toLowerCase();
  return normalized.includes('result') || normalized.includes('output') || normalized.includes('impact');
}

const projectIcons: Record<string, string> = {
  'bw-colorization': `${import.meta.env.BASE_URL}project-icon-bw-colorization.jpeg`,
  concordia: `${import.meta.env.BASE_URL}concordia-preview.png`,
  'network-file-system': `${import.meta.env.BASE_URL}network-file-system-preview.png`,
  'search-engine': `${import.meta.env.BASE_URL}project-icon-search-engine.jpeg`,
  'tamagotchi-os': `${import.meta.env.BASE_URL}project-icon-tamagotchi-os.jpeg`,
  'windrose-api': `${import.meta.env.BASE_URL}project-icon-windrose-api.jpeg`,
};

const projectIconPositions: Record<string, string> = {
  concordia: '65% center',
};

export function ProjectViewer({ path, windowId }: ProjectViewerProps) {
  const slug = path.split('/').pop()?.replace(/\.md$/, '');
  const project = projects.find((item) => item.slug === slug);
  const [activeTab, setActiveTab] = useState('General');
  const { closeWindow } = useWindowStore();

  const sections = useMemo<ProjectSection[]>(() => {
    if (!project) {
      return [];
    }

    const resultSlides = project.extraSlides.filter((slide) => isResultSlide(slide.title));
    const architectureSlides = project.extraSlides.filter((slide) => !isResultSlide(slide.title));

    return [
      {
        title: 'General',
        body: (
          <div className="grid gap-5 lg:grid-cols-[210px_1fr]">
            <div className="flex items-start justify-center">
              <div className="border border-[#808080] bg-[#c0c0c0] p-2 shadow-[inset_-1px_-1px_0_#ffffff,inset_1px_1px_0_#808080]">
                <div className="border border-[#808080] bg-[#d4d0c8] p-3 shadow-[inset_-1px_-1px_0_#808080,inset_1px_1px_0_#ffffff]">
                  <img
                    src={projectIcons[project.slug] ?? `${import.meta.env.BASE_URL}merlin-microsoft-wizard.jpeg`}
                    alt={`${project.title} icon`}
                    draggable={false}
                    className="block h-[150px] w-[150px] select-none object-contain"
                    style={{ objectPosition: projectIconPositions[project.slug] ?? 'center' }}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-5">
              <div>
                <div className="font-bold">Project Name:</div>
                <div className="ml-4 font-bold">{project.title}</div>
              </div>
              <div>
                <div className="font-bold">Project Summary:</div>
                <div className="ml-4 space-y-2">
                  <div>{project.summary}</div>
                  <div>{project.outcome}</div>
                </div>
              </div>
              <div>
                <div className="font-bold">Stack:</div>
                <div className="ml-4">{project.tech.join(', ')}</div>
              </div>
              <div>
                <div className="font-bold">Links:</div>
                <div className="ml-4 space-y-1">
                  {project.links.length ? (
                    project.links.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="block underline"
                      >
                        {link.label}
                      </a>
                    ))
                  ) : (
                    <div>No external links for this project.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ),
      },
      {
        title: 'Introduction',
        body: (
          <div className="space-y-4">
            <p>{toFirstPersonBuildLine(project.summary)}</p>
            <p>{trimDuplicateIntro(project.summary, project.overview)}</p>
          </div>
        ),
      },
      {
        title: 'Approach / Architecture',
        body: (
          <div className="space-y-4">
            <p>The way I approached it was to break the system into a few clear pieces instead of hiding everything inside one big flow.</p>
            <p>{project.approach}</p>
            {architectureSlides.length ? (
              <div className="space-y-6">
                {architectureSlides.map((slide) => renderExtraSlide(slide))}
              </div>
            ) : null}
          </div>
        ),
      },
      {
        title: 'Technical Challenges',
        body: (
          <div className="space-y-4">
            <p>The hardest part was making the project feel real and usable instead of stopping at a class-demo version.</p>
            <ul className="space-y-3">
              {project.decisions.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </div>
        ),
      },
      {
        title: 'Result',
        body: (
          <div className="space-y-4">
            <p>What I like most about the end result is that it works as a full system instead of just a prototype on paper.</p>
            <p>
              <span className="font-bold">Key outcome:</span> {project.outcome}
            </p>
            {resultSlides.length ? (
              <div className="space-y-6">
                {resultSlides.map((slide) => renderExtraSlide(slide))}
              </div>
            ) : null}
          </div>
        ),
      },
    ];
  }, [project]);

  useEffect(() => {
    setActiveTab('General');
  }, [slug]);

  if (!project) {
    return <div className="p-5 text-sm text-accent-red">Project not found.</div>;
  }

  const currentSection = sections.find((section) => section.title === activeTab) ?? sections[0];
  const currentIndex = sections.findIndex((section) => section.title === currentSection.title);
  const isFirstTab = currentIndex <= 0;
  const isLastTab = currentIndex === sections.length - 1;

  return (
    <div className="flex h-full min-h-0 flex-col border border-black bg-[#c0c0c0] p-[10px] text-[12px] text-black shadow-[inset_-1px_-1px_0_#808080,inset_1px_1px_0_#ffffff]">
      <div className="px-4 pt-3">
        <div className="flex flex-wrap items-end gap-[2px]">
          {sections.map((section) => {
            const isActive = section.title === currentSection.title;
            return (
              <button
                key={section.title}
                type="button"
                onClick={() => setActiveTab(section.title)}
                className={`border border-black px-3 py-[3px] text-[12px] leading-none ${
                  isActive
                    ? 'relative top-px z-10 border-b-[#c0c0c0] bg-[#c0c0c0] text-black shadow-[inset_-1px_0_0_#808080,inset_1px_1px_0_#ffffff]'
                    : 'bg-[#c0c0c0] text-black shadow-[inset_-1px_-1px_0_#808080,inset_1px_1px_0_#ffffff]'
                }`}
              >
                {section.title}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mx-4 mb-0 mt-0 flex-1 min-h-0 border-t border-l border-r-2 border-b-2 border-t-white border-l-white border-r-black border-b-black bg-[#c0c0c0]">
        <div className="flex h-full min-h-0 flex-col">
          <CustomScrollArea>{currentSection.body}</CustomScrollArea>
        </div>
      </div>

      <div className="mx-4 mb-4 mt-3 flex justify-end gap-2">
        {isFirstTab ? (
          <>
            <DialogButton label="Cancel" onClick={() => closeWindow(windowId)} />
            <DialogButton
              label="Next"
              onClick={() => setActiveTab(sections[Math.min(currentIndex + 1, sections.length - 1)].title)}
              disabled={isLastTab}
              primary
            />
          </>
        ) : (
          <>
            <DialogButton
              label="Prev"
              onClick={() => setActiveTab(sections[Math.max(currentIndex - 1, 0)].title)}
            />
            <DialogButton
              label="Next"
              onClick={() => setActiveTab(sections[Math.min(currentIndex + 1, sections.length - 1)].title)}
              disabled={isLastTab}
              primary
            />
          </>
        )}
      </div>
    </div>
  );
}

function DialogButton({
  label,
  onClick,
  primary = false,
  disabled = false,
}: {
  label: string;
  onClick: () => void;
  primary?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`min-w-[78px] border border-black bg-[#c0c0c0] px-3 py-[5px] text-[12px] leading-none text-black shadow-[inset_-1px_-1px_0_#808080,inset_1px_1px_0_#ffffff] active:shadow-[inset_-1px_-1px_0_#ffffff,inset_1px_1px_0_#808080] disabled:text-[#808080] disabled:active:shadow-[inset_-1px_-1px_0_#808080,inset_1px_1px_0_#ffffff] ${primary ? 'outline outline-1 outline-black outline-offset-[-4px]' : ''}`}
    >
      {label}
    </button>
  );
}

function CustomScrollArea({ children }: { children: ReactNode }) {
  const contentRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="flex flex-1 min-h-0 bg-[#c0c0c0] text-[12px] leading-5 text-black">
      <div
        ref={contentRef}
        className="classic-scroll-area flex-1 min-h-0 overflow-y-auto overflow-x-hidden bg-[#c0c0c0] px-4 py-3"
      >
        <div>{children}</div>
      </div>
    </div>
  );
}

interface ZoomableImageProps {
  src: string;
  alt: string;
}

function ZoomableImage({ src, alt }: ZoomableImageProps) {
  const [zoom, setZoom] = useState(100);
  const [naturalSize, setNaturalSize] = useState({ width: 4, height: 3 });
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const dragStateRef = useRef<{ startX: number; startY: number; left: number; top: number } | null>(null);

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    const viewport = viewportRef.current;
    if (!viewport) {
      return;
    }

    dragStateRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      left: viewport.scrollLeft,
      top: viewport.scrollTop,
    };

    viewport.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const viewport = viewportRef.current;
    const dragState = dragStateRef.current;
    if (!viewport || !dragState) {
      return;
    }

    viewport.scrollLeft = dragState.left - (event.clientX - dragState.startX);
    viewport.scrollTop = dragState.top - (event.clientY - dragState.startY);
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const viewport = viewportRef.current;
    if (viewport?.hasPointerCapture(event.pointerId)) {
      viewport.releasePointerCapture(event.pointerId);
    }
    dragStateRef.current = null;
  };

  return (
    <div className="border border-black bg-[#f3f3f3] p-2 shadow-[inset_-1px_-1px_0_#808080,inset_1px_1px_0_#ffffff]">
      <div className="mb-2 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => setZoom((value) => Math.max(50, value - 25))}
          className="min-w-[28px] border border-black bg-[#d4d0c8] px-2 py-0.5 text-[11px] text-black shadow-[inset_-1px_-1px_0_#808080,inset_1px_1px_0_#ffffff]"
        >
          -
        </button>
        <div className="min-w-[44px] text-center text-[11px] text-black">{zoom}%</div>
        <button
          type="button"
          onClick={() => setZoom((value) => Math.min(300, value + 25))}
          className="min-w-[28px] border border-black bg-[#d4d0c8] px-2 py-0.5 text-[11px] text-black shadow-[inset_-1px_-1px_0_#808080,inset_1px_1px_0_#ffffff]"
        >
          +
        </button>
      </div>
      <div
        ref={viewportRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="paint-scroll-area w-full overflow-scroll bg-[#c0c0c0] p-2 [scrollbar-gutter:stable_both-edges]"
        style={{
          aspectRatio: `${naturalSize.width} / ${naturalSize.height}`,
          minHeight: '260px',
          maxHeight: '560px',
          backgroundImage:
            'linear-gradient(45deg, #ececec 25%, transparent 25%), linear-gradient(-45deg, #ececec 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ececec 75%), linear-gradient(-45deg, transparent 75%, #ececec 75%)',
          backgroundSize: '24px 24px',
          backgroundPosition: '0 0, 0 12px, 12px -12px, -12px 0',
          cursor: dragStateRef.current ? 'grabbing' : 'grab',
        }}
      >
        <img
          src={src}
          alt={alt}
          onLoad={(event) =>
            setNaturalSize({
              width: event.currentTarget.naturalWidth || 4,
              height: event.currentTarget.naturalHeight || 3,
            })
          }
          draggable={false}
          className="block max-w-none select-none object-contain"
          style={{ width: `${zoom}%` }}
        />
      </div>
    </div>
  );
}
