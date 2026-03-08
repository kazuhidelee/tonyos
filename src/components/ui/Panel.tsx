import type { PropsWithChildren, ReactNode } from 'react';
import { cn } from '../../utils/ui';

interface PanelProps extends PropsWithChildren {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  className?: string;
}

export function Panel({ title, subtitle, actions, className, children }: PanelProps) {
  return (
    <section
      className={cn(
        'border border-black bg-[#c0c0c0] p-3 shadow-[-1px_-1px_0_#ffffff,inset_-1px_-1px_0_#808080,inset_1px_1px_0_#dfdfdf,1px_1px_0_#000000]',
        className,
      )}
    >
      {(title || subtitle || actions) && (
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            {title && <h2 className="text-sm font-bold text-black">{title}</h2>}
            {subtitle && <p className="mt-1 text-sm text-black/75">{subtitle}</p>}
          </div>
          {actions}
        </div>
      )}
      {children}
    </section>
  );
}
