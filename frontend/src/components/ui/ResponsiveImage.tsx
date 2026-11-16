import { useState, type ImgHTMLAttributes } from "react";
import { API_BASE_URL } from "@/config/api";

const widths = [320, 640, 960, 1280];
function variant(src: string, width: number) {
  try {
    const url = new URL(src);
    if (url.hostname === "images.unsplash.com") {
      url.searchParams.set("w", String(width));
      url.searchParams.set("auto", "format");
      url.searchParams.set("q", "80");
      return url.href;
    }
    const configured = import.meta.env.VITE_IMAGE_ORIGIN as string | undefined;
    if (
      url.protocol === "https:" &&
      (url.hostname.endsWith(".r2.dev") ||
        (configured && url.origin === new URL(configured).origin))
    ) {
      return `${API_BASE_URL}/public/images/${width}?src=${encodeURIComponent(src)}`;
    }
  } catch {
    /* Relative/local assets use their original URL. */
  }
  return null;
}

export default function ResponsiveImage({
  src,
  priority = false,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 640px",
  ...props
}: ImgHTMLAttributes<HTMLImageElement> & { priority?: boolean }) {
  const [failedSrc, setFailedSrc] = useState<string>();
  const responsive = src && failedSrc !== src && variant(src, widths[0]);
  return (
    <img
      {...props}
      src={src}
      sizes={responsive ? sizes : undefined}
      srcSet={
        responsive
          ? widths.map((width) => `${variant(src, width)} ${width}w`).join(", ")
          : undefined
      }
      loading={priority ? "eager" : (props.loading ?? "lazy")}
      fetchPriority={priority ? "high" : undefined}
      decoding={priority ? "auto" : "async"}
      onError={(event) => {
        if (responsive) setFailedSrc(src);
        else props.onError?.(event);
      }}
    />
  );
}
