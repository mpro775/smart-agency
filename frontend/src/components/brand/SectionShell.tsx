import type { ReactNode } from "react";
import { cn } from "../../lib/utils";
import BrandPattern from "./BrandPattern";

type SectionTone = "light" | "dark";
type PatternVariant = "grid" | "dots" | "mesh" | "none";

interface SectionShellProps {
  id?: string;
  children: ReactNode;
  tone?: SectionTone;
  pattern?: PatternVariant;
  patternIntensity?: "subtle" | "medium";
  className?: string;
  containerClassName?: string;
  withContainer?: boolean;
  bleed?: boolean;
}

export default function SectionShell({
  id,
  children,
  tone = "light",
  pattern = "grid",
  patternIntensity = "subtle",
  className,
  containerClassName,
  withContainer = true,
  bleed = false,
}: SectionShellProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative isolate overflow-hidden min-h-screen flex items-center py-20 lg:py-24",
        tone === "dark" ? "smart-section-dark" : "smart-section-light",
        bleed && "py-0",
        className
      )}
      data-section-tone={tone}
      dir="rtl"
    >
      <BrandPattern tone={tone} variant={pattern} intensity={patternIntensity} />

      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -top-24 end-[-8%] h-72 w-72 rounded-full blur-3xl",
          tone === "dark" ? "bg-[#00b3b3]/15" : "bg-[#008080]/10"
        )}
      />

      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -bottom-32 start-[-10%] h-80 w-80 rounded-full blur-3xl",
          tone === "dark" ? "bg-[#008080]/14" : "bg-[#00b3b3]/8"
        )}
      />

      {withContainer ? (
        <div className={cn("smart-container relative z-10", containerClassName)}>
          {children}
        </div>
      ) : (
        <div className={cn("relative z-10 w-full", containerClassName)}>
          {children}
        </div>
      )}
    </section>
  );
}
