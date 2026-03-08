import { useState } from 'react';
import { cn } from '../../utils/ui';

interface Win95ButtonProps {
  label: string;
  href?: string;
  download?: string;
  disabled?: boolean;
  className?: string;
}

function getButtonAsset({
  disabled,
  pressed,
  focused,
}: {
  disabled?: boolean;
  pressed: boolean;
  focused: boolean;
}) {
  if (disabled) {
    return '/State=Disabled.png';
  }
  if (pressed) {
    return '/State=Pressed.png';
  }
  if (focused) {
    return '/State=Focus.png';
  }
  return '/State=Preferred.png';
}

export function Win95Button({
  label,
  href,
  download,
  disabled = false,
  className,
}: Win95ButtonProps) {
  const [pressed, setPressed] = useState(false);
  const [focused, setFocused] = useState(false);
  const asset = getButtonAsset({ disabled, pressed, focused });

  const content = (
    <>
      <img src={asset} alt="" aria-hidden="true" className="h-[24px] w-[60px]" />
      <span
        className={cn(
          'absolute inset-0 flex items-center justify-center text-[11px] text-black',
          pressed ? 'translate-x-px translate-y-px' : '',
          disabled ? 'text-black/40' : '',
        )}
      >
        {label}
      </span>
    </>
  );

  const sharedProps = {
    className: cn('relative block h-[24px] w-[60px] shrink-0 select-none outline-none', className),
    onMouseDown: () => !disabled && setPressed(true),
    onMouseUp: () => setPressed(false),
    onMouseLeave: () => setPressed(false),
    onFocus: () => setFocused(true),
    onBlur: () => {
      setFocused(false);
      setPressed(false);
    },
  };

  if (href && !disabled) {
    return (
      <a href={href} download={download} {...sharedProps}>
        {content}
      </a>
    );
  }

  return (
    <button type="button" disabled={disabled} {...sharedProps}>
      {content}
    </button>
  );
}
