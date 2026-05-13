import { cn } from "../../lib/utils";

type BrandPatternVariant = "grid" | "dots" | "mesh" | "none";
type BrandPatternTone = "light" | "dark";

interface BrandPatternProps {
  tone?: BrandPatternTone;
  variant?: BrandPatternVariant;
  intensity?: "subtle" | "medium";
  className?: string;
}

export default function BrandPattern({
  tone = "light",
  variant = "grid",
  intensity = "subtle",
  className,
}: BrandPatternProps) {
  if (variant === "none") return null;

  const opacity = intensity === "medium" ? "opacity-100" : "opacity-70";
  const stroke = tone === "dark" ? "rgba(255,255,255,0.07)" : "rgba(0,128,128,0.075)";
  const dot = tone === "dark" ? "rgba(255,255,255,0.09)" : "rgba(0,128,128,0.10)";

  if (variant === "dots") {
    return (
      <div
        aria-hidden="true"
        className={cn("pointer-events-none absolute inset-0", opacity, className)}
        style={{
          backgroundImage: `radial-gradient(${dot} 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
          maskImage: "linear-gradient(to bottom, transparent, black 16%, black 84%, transparent)",
        }}
      />
    );
  }

  if (variant === "mesh") {
    return (
      <div
        aria-hidden="true"
        className={cn("pointer-events-none absolute inset-0", opacity, className)}
        style={{
          backgroundImage: `
            linear-gradient(${stroke} 1px, transparent 1px),
            linear-gradient(90deg, ${stroke} 1px, transparent 1px),
            radial-gradient(circle at 50% 50%, ${dot}, transparent 38%)
          `,
          backgroundSize: "56px 56px, 56px 56px, 520px 520px",
          maskImage: "radial-gradient(circle at center, black, transparent 76%)",
        }}
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0", opacity, className)}
      style={{
        backgroundImage: `
          linear-gradient(${stroke} 1px, transparent 1px),
          linear-gradient(90deg, ${stroke} 1px, transparent 1px)
        `,
        backgroundSize: "44px 44px",
        maskImage: "linear-gradient(to bottom, transparent, black 14%, black 86%, transparent)",
      }}
    />
  );
}
