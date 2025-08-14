import { cn } from "@/lib/utils"

interface RiyalLogoProps {
  className?: string;
  size?: number;
}

export function RiyalLogo({ className, size = 20 }: RiyalLogoProps) {
  return (
    <img
      src="/sr.svg"
      alt="ريال سعودي"
      width={size}
      height={size}
      className={cn("inline-block", className)}
    />
  );
}

// مكون مبسط باستخدام iframe للـ SVG
export function SimpleRiyalLogo({ className, size = 16 }: RiyalLogoProps) {
  return (
    <div 
      className={cn("inline-block overflow-hidden", className)}
      style={{ width: size, height: size }}
    >
      <iframe
        src="/sr.svg"
        width={size}
        height={size}
        style={{ 
          border: 'none',
          display: 'block',
          width: size,
          height: size
        }}
        title="ريال سعودي"
      />
    </div>
  );
}
