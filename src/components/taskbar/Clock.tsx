import { useEffect, useState } from 'react';

function formatNow(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

export function Clock() {
  const [now, setNow] = useState(() => formatNow(new Date()));

  useEffect(() => {
    const interval = window.setInterval(() => setNow(formatNow(new Date())), 1000 * 30);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <div
      className="flex h-[22px] w-[81px] items-center justify-center bg-contain bg-center bg-no-repeat px-2 text-[12px] text-black"
      style={{ backgroundImage: "url('/Time.png')" }}
    >
      <span className="mt-[1px]">{now}</span>
    </div>
  );
}
