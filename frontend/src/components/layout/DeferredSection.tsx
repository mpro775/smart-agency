import { Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { tr } from "@/i18n";
import { SectionAnchorContext } from "./section-anchor";

export default function DeferredSection({
  id,
  pending,
  children,
}: {
  id: string;
  pending: boolean;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [nearby, setNearby] = useState(false);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const revealHash = () => {
      if (window.location.hash === `#${id}`) setNearby(true);
    };
    revealHash();
    window.addEventListener("hashchange", revealHash);
    if (!("IntersectionObserver" in window)) {
      setNearby(true);
      return () => window.removeEventListener("hashchange", revealHash);
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNearby(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px 0px" },
    );
    observer.observe(element);
    return () => {
      observer.disconnect();
      window.removeEventListener("hashchange", revealHash);
    };
  }, [id]);
  const placeholder = (
    <div
      role="status"
      className="min-h-screen grid place-items-center bg-slate-50 text-slate-600"
    >
      <span>{tr("جاري التحميل...")}</span>
    </div>
  );
  return (
    <div
      ref={ref}
      id={id}
      data-home-section={id}
      className="min-h-screen scroll-mt-28"
    >
      <SectionAnchorContext.Provider value={id}>
        {nearby && !pending ? (
          <Suspense fallback={placeholder}>{children}</Suspense>
        ) : (
          placeholder
        )}
      </SectionAnchorContext.Provider>
    </div>
  );
}
