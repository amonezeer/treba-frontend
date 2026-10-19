import type { ReactNode } from "react";
import type { SellIconName } from "../../types/sellLanding";

// Иконки лендинга продавца: обводка currentColor, чтобы красить через CSS
type IconProps = {
  size?: number;
  className?: string;
};

type SvgProps = IconProps & {
  children: ReactNode;
  filled?: boolean;
};

function Svg({ size = 20, className, children, filled = false }: SvgProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke={filled ? "none" : "currentColor"}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

export function IconArrowRight(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </Svg>
  );
}

export function IconCheck(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </Svg>
  );
}

export function IconBag(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M6 8h12l-1 12H7L6 8z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </Svg>
  );
}

export function IconStar(props: IconProps) {
  return (
    <Svg {...props} filled>
      <path d="M12 3l2.8 5.8 6.2.8-4.5 4.4 1.1 6.3L12 17.3l-5.6 3 1.1-6.3L3 9.6l6.2-.8L12 3z" />
    </Svg>
  );
}

export function IconUsers(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      <path d="M16 4.5a3.5 3.5 0 0 1 0 7" />
      <path d="M21 20c0-2.6-1.6-4.8-4-5.6" />
    </Svg>
  );
}

export function IconWallet(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3" y="6" width="18" height="14" rx="3" />
      <path d="M3 10h18" />
      <path d="M16 15h.01" />
    </Svg>
  );
}

export function IconTruck(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M3 6h11v10H3z" />
      <path d="M14 9h4l3 3v4h-7" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
    </Svg>
  );
}

export function IconChart(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 20h16" />
      <path d="M7 16v-4" />
      <path d="M12 16V7" />
      <path d="M17 16v-7" />
    </Svg>
  );
}

export function IconMegaphone(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M3 11v2a1 1 0 0 0 1 1h3l6 4V6L7 10H4a1 1 0 0 0-1 1z" />
      <path d="M17 9a4 4 0 0 1 0 6" />
    </Svg>
  );
}

export function IconHeadset(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 15v-3a8 8 0 0 1 16 0v3" />
      <rect x="3" y="14" width="4" height="6" rx="1.5" />
      <rect x="17" y="14" width="4" height="6" rx="1.5" />
    </Svg>
  );
}

// Иконка по имени из контента (src/data/sellLanding.ts)
export function SellIcon({ name, ...props }: IconProps & { name: SellIconName }) {
  switch (name) {
    case "users":
      return <IconUsers {...props} />;
    case "wallet":
      return <IconWallet {...props} />;
    case "truck":
      return <IconTruck {...props} />;
    case "chart":
      return <IconChart {...props} />;
    case "megaphone":
      return <IconMegaphone {...props} />;
    case "headset":
      return <IconHeadset {...props} />;
  }
}