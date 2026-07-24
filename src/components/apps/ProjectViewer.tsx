import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';
import { projects } from '../../data/portfolioContent';

interface ProjectViewerProps {
  path: string;
}

interface ProjectSlide {
  title: string;
  body: ReactNode;
}

export function ProjectViewer({ path }: ProjectViewerProps) {
  const slug = path.split('/').pop()?.replace(/\.md$/, '');
  const project = projects.find((item) => item.slug === slug);
  const [slideIndex, setSlideIndex] = useState(0);

  const slides = useMemo<ProjectSlide[]>(() => {
    if (!project) {
      return [];
    }

    return [
      {
        title: 'Overview',
        body: (
          <div className="space-y-4">
            <p className="text-lg font-bold">{project.title}</p>
            <p>{project.summary}</p>
            <p>{project.overview}</p>
          </div>
        ),
      },
      {
        title: 'Approach / Architecture',
        body: (
          <div className="space-y-4">
            <p>{project.approach}</p>
          </div>
        ),
      },
      ...project.extraSlides.map((slide) => ({
        title: slide.title,
        body: (
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
              <ZoomableImage src={slide.image} alt={slide.imageAlt || slide.title} />
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
        ),
      })),
      {
        title: 'Technical Challenges',
        body: (
          <ul className="space-y-3">
            {project.decisions.map((item) => (
              <li key={item}>- {item}</li>
            ))}
          </ul>
        ),
      },
      {
        title: 'Results / Impact',
        body: (
          <div className="space-y-4">
            <p>
              <span className="font-bold">Key outcome:</span> {project.outcome}
            </p>
          </div>
        ),
      },
      {
        title: 'Tech Stack',
        body: (
          <div className="flex flex-wrap gap-2">
            {project.tech.map((item) => (
              <span
                key={item}
                className="border border-black bg-[#f5f5f5] px-2 py-1 text-xs shadow-[inset_-1px_-1px_0_#ffffff,inset_1px_1px_0_#808080]"
              >
                {item}
              </span>
            ))}
          </div>
        ),
      },
      {
        title: 'Links',
        body: project.links.length ? (
          <div className="space-y-3">
            {project.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="block underline"
              >
                {link.label}
              </a>
            ))}
          </div>
        ) : (
          <p>No external links for this project.</p>
        ),
      },
    ];
  }, [project]);

  useEffect(() => {
    setSlideIndex(0);
  }, [slug]);

  if (!project) {
    return <div className="p-5 text-sm text-accent-red">Project not found.</div>;
  }

  const currentSlide = slides[slideIndex];
  const isFirst = slideIndex === 0;
  const isLast = slideIndex === slides.length - 1;

  return (
    <div className="h-full min-h-0 bg-[#c0c0c0] p-2">
      <div className="flex h-full min-h-0 flex-col border border-black bg-[#d4d0c8] shadow-[inset_-1px_-1px_0_#808080,inset_1px_1px_0_#ffffff]">
        <div className="flex items-center justify-between border-b border-black bg-[#ece9d8] px-3 py-1 text-[11px] text-black">
          <div className="flex items-center gap-3">
            <span>File</span>
            <span>View</span>
            <span>Play</span>
            <span>Tools</span>
            <span>Help</span>
          </div>
          <div className="text-[10px] text-black/70">
            {slideIndex + 1}/{slides.length}
          </div>
        </div>

        <div className="mx-2 mt-2 flex-1 min-h-0 border border-black bg-white shadow-[inset_-1px_-1px_0_#808080,inset_1px_1px_0_#ffffff]">
          <div className="flex h-full min-h-0 flex-col">
            <div className="border-b border-black bg-[#f3f3f3] px-3 py-2 text-sm font-bold text-black">
              {currentSlide.title}
            </div>
            <CustomScrollArea>{currentSlide.body}</CustomScrollArea>
          </div>
        </div>

        <div className="mx-2 mt-2 border border-black bg-[#d4d0c8] px-3 py-2 shadow-[inset_-1px_-1px_0_#808080,inset_1px_1px_0_#ffffff]">
          <div className="mb-2 h-[6px] border border-black bg-[#efefef] shadow-[inset_-1px_-1px_0_#ffffff,inset_1px_1px_0_#808080]">
            <div
              className="h-full bg-[#4d5ca8]"
              style={{ width: `${((slideIndex + 1) / slides.length) * 100}%` }}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ControlButton label="|<" onClick={() => setSlideIndex(0)} disabled={isFirst} />
              <ControlButton label="<<" onClick={() => setSlideIndex((index) => Math.max(0, index - 1))} disabled={isFirst} />
              <ControlButton label=">>" onClick={() => setSlideIndex((index) => Math.min(slides.length - 1, index + 1))} disabled={isLast} />
              <ControlButton label=">|" onClick={() => setSlideIndex(slides.length - 1)} disabled={isLast} />
            </div>
            <div className="text-[11px] text-black">{currentSlide.title}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ControlButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

function ControlButton({ label, onClick, disabled = false }: ControlButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="min-w-[42px] border border-black bg-[#d4d0c8] px-2 py-1 text-[11px] text-black shadow-[inset_-1px_-1px_0_#808080,inset_1px_1px_0_#ffffff] disabled:text-black/40"
    >
      {label}
    </button>
  );
}

function CustomScrollArea({ children }: { children: ReactNode }) {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<{ startY: number; startScrollTop: number } | null>(null);
  const [metrics, setMetrics] = useState({ clientHeight: 1, scrollHeight: 1, scrollTop: 0 });
  const buttonHeight = 16;
  const minThumbHeight = 18;
  const maxThumbHeight = 56;

  const syncMetrics = () => {
    const node = contentRef.current;
    if (!node) {
      return;
    }
    setMetrics({
      clientHeight: node.clientHeight || 1,
      scrollHeight: node.scrollHeight || 1,
      scrollTop: node.scrollTop || 0,
    });
  };

  useEffect(() => {
    syncMetrics();
    const node = contentRef.current;
    if (!node) {
      return;
    }

    const resizeObserver = new ResizeObserver(() => syncMetrics());
    resizeObserver.observe(node);
    return () => resizeObserver.disconnect();
  }, [children]);

  const scrollable = Math.max(0, metrics.scrollHeight - metrics.clientHeight);
  const trackHeight = Math.max(1, metrics.clientHeight - buttonHeight * 2);
  const thumbHeight =
    scrollable === 0
      ? trackHeight
      : Math.min(
          maxThumbHeight,
          Math.max(minThumbHeight, (metrics.clientHeight / metrics.scrollHeight) * trackHeight),
        );
  const maxThumbTravel = Math.max(0, trackHeight - thumbHeight);
  const thumbTop = scrollable === 0 ? 0 : (metrics.scrollTop / scrollable) * maxThumbTravel;

  const scrollByAmount = (amount: number) => {
    const node = contentRef.current;
    if (!node) {
      return;
    }
    node.scrollTop += amount;
    syncMetrics();
  };

  const scrollToTrackPosition = (clientY: number, trackRect: DOMRect) => {
    const node = contentRef.current;
    if (!node || scrollable === 0) {
      return;
    }
    const offset = clientY - trackRect.top - thumbHeight / 2;
    const clampedOffset = Math.min(Math.max(0, offset), maxThumbTravel);
    node.scrollTop = (clampedOffset / Math.max(1, maxThumbTravel)) * scrollable;
    syncMetrics();
  };

  const handleThumbPointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const node = contentRef.current;
    if (!node) {
      return;
    }
    dragRef.current = { startY: event.clientY, startScrollTop: node.scrollTop };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleThumbPointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const node = contentRef.current;
    const drag = dragRef.current;
    if (!node || !drag || scrollable === 0) {
      return;
    }
    const deltaY = event.clientY - drag.startY;
    const scrollDelta = (deltaY / Math.max(1, maxThumbTravel)) * scrollable;
    node.scrollTop = drag.startScrollTop + scrollDelta;
    syncMetrics();
  };

  const handleThumbPointerUp = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    dragRef.current = null;
  };

  return (
    <div className="flex flex-1 min-h-0 bg-white text-sm leading-6 text-black">
      <div
        ref={contentRef}
        onScroll={syncMetrics}
        className="flex-1 min-h-0 overflow-y-scroll overflow-x-hidden px-4 py-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style>{`.hide-native-scrollbar::-webkit-scrollbar{display:none}`}</style>
        <div className="hide-native-scrollbar">{children}</div>
      </div>

      <div className="w-[16px] shrink-0 border-l border-black bg-[#d4d0c8]">
        <button
          type="button"
          aria-label="Scroll up"
          onClick={() => scrollByAmount(-80)}
          className="block h-[16px] w-[16px] bg-[url('/scroll-up-button.png')] bg-cover bg-center"
        />
        <div
          className="relative w-[16px] bg-[url('/scroll-track.png')] bg-repeat-y bg-top"
          style={{ height: trackHeight }}
          onPointerDown={(event) => {
            const target = event.currentTarget;
            if (event.target !== target) {
              return;
            }
            scrollToTrackPosition(event.clientY, target.getBoundingClientRect());
          }}
        >
          <button
            type="button"
            aria-label="Scroll thumb"
            onPointerDown={handleThumbPointerDown}
            onPointerMove={handleThumbPointerMove}
            onPointerUp={handleThumbPointerUp}
            onPointerCancel={handleThumbPointerUp}
            className="absolute left-0 w-[16px] cursor-grab bg-[url('/scroll-thumb.png')] bg-cover bg-center active:cursor-grabbing"
            style={{ top: thumbTop, height: thumbHeight }}
          />
        </div>
        <button
          type="button"
          aria-label="Scroll down"
          onClick={() => scrollByAmount(80)}
          className="block h-[16px] w-[16px] bg-[url('/scroll-down-button.png')] bg-cover bg-center"
        />
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
        className="paint-scroll-area h-[460px] overflow-scroll bg-[#c0c0c0] p-2 [scrollbar-gutter:stable_both-edges]"
        style={{
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
          draggable={false}
          className="block max-w-none select-none object-contain"
          style={{ width: `${zoom}%` }}
        />
      </div>
    </div>
  );
}
