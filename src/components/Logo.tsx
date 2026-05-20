interface LogoProps {
  collapsed?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function Logo({ collapsed = false, size = 'md' }: LogoProps) {
  const s = size === 'sm' ? 24 : size === 'md' ? 32 : 40;
  const fontSize = size === 'sm' ? 16 : size === 'md' ? 18 : 24;

  return (
    <div className="flex items-center gap-2.5">
      <svg width={s} height={s} viewBox="0 0 40 40" fill="none" className="flex-shrink-0">
        <path
          d="M12 8L20 32L24 20L32 16L12 8Z"
          stroke="hsl(164, 64%, 43%)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M20 32L16 20"
          stroke="hsl(164, 64%, 43%)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
      {!collapsed && (
        <span
          className="font-bold tracking-tight text-foreground"
          style={{ fontSize }}
        >
          voltwise
        </span>
      )}
    </div>
  );
}
