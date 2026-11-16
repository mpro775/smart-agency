import { lazy, Suspense, useEffect, useRef, useState } from "react";

const HeroDashboard = lazy(() => import("./HeroDashboard"));

export default function DeferredHeroDashboard() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (!("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // Measured card geometry: 655px; narrow English labels add two lines (32px).
  // Keeping that space also prevents the page moving when this demo mounts.
  const placeholder = (
    <div
      aria-hidden="true"
      className="absolute inset-0 rounded-[1.75rem] border border-white/10 bg-[#0c1929] shadow-[0_30px_80px_rgba(0,0,0,0.4)]"
    />
  );
  return (
    <div
      ref={ref}
      className="relative w-full max-w-[540px] min-h-[655px] ltr:min-h-[687px] sm:ltr:min-h-[655px]"
    >
      {visible ? (
        <Suspense fallback={placeholder}>
          <HeroDashboard />
        </Suspense>
      ) : (
        placeholder
      )}
    </div>
  );
}
