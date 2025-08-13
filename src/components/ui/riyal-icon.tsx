import { cn } from "@/lib/utils"

interface RiyalIconProps {
  className?: string;
  size?: number;
}

export function RiyalIcon({ className, size = 20 }: RiyalIconProps) {
  return (
    <span
      className={cn("inline-block", className)}
      style={{
        width: size,
        height: size,
        display: 'inline-block',
        backgroundImage: 'url(/sr.svg)',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center'
      }}
      role="img"
      aria-label="ريال سعودي"
    />
  );
}

// مكون مبسط للريال - يستخدم نفس الشعار
export function SimpleRiyalIcon({ className, size = 16 }: RiyalIconProps) {
  return (
    <span
      className={cn("inline-block", className)}
      style={{
        width: size,
        height: size,
        display: 'inline-block',
        backgroundImage: 'url(/sr.svg)',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center'
      }}
      role="img"
      aria-label="ريال سعودي"
    />
  );
}
