import { cn } from "@/lib/utils"
import { RiyalLogo } from "./riyal-logo"

export function SaudiRiyalSymbol({ className }: { className?: string }) {
  return (
    <RiyalLogo className={cn("font-bold", className)} size={16} />
  );
}
