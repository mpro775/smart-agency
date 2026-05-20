import { useEffect, useState } from "react";

export default function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const scrollTop = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(height > 0 ? Math.min(100, (scrollTop / height) * 100) : 0);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-50 h-1.5 bg-slate-200/30 backdrop-blur-sm">
      <div
        className="h-full bg-gradient-to-l from-primary to-primary-dark transition-[width] duration-150 ease-out shadow-[0_0_10px_rgba(0,128,128,0.5)]"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
