import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import "../styles/custom-cursor.css";

const INTERACTIVE_SELECTOR =
  "a, button, [role='button'], .cursor-pointer, [data-cursor='hover']";
const TEXT_INPUT_SELECTOR =
  "input, textarea, [contenteditable='true']";

const ADMIN_PATHS = ["/admin", "/dashboard", "/cms"];

const CustomCursor = () => {
  const location = useLocation();
  const [isEnabled, setIsEnabled] = useState(false);

  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const cursorPos = useRef({ x: 0, y: 0 });
  const followerPos = useRef({ x: 0, y: 0 });
  const isHovering = useRef(false);

  useEffect(() => {
    const pathname = location.pathname;
    const isAdmin = ADMIN_PATHS.some(
      (p) => pathname === p || pathname.startsWith(p + "/")
    );
    if (isAdmin) {
      setIsEnabled(false);
      return;
    }

    const isTouch =
      window.matchMedia("(hover: none) and (pointer: coarse)").matches;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (isTouch || prefersReduced) {
      setIsEnabled(false);
      return;
    }

    setIsEnabled(true);
  }, [location.pathname]);

  useEffect(() => {
    if (!isEnabled) return;

    const cursor = cursorRef.current;
    const follower = followerRef.current;
    if (!cursor || !follower) return;

    cursor.classList.add("is-visible");
    follower.classList.add("is-visible");

    const onPointerMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };

      const target = e.target as HTMLElement | null;
      const interactiveEl = target?.closest(INTERACTIVE_SELECTOR);
      const textEl = target?.closest(TEXT_INPUT_SELECTOR);

      if (interactiveEl && !isHovering.current) {
        isHovering.current = true;
        document.body.classList.add("cursor-hover");
        document.body.classList.remove("cursor-text");
      } else if (textEl) {
        if (isHovering.current) {
          isHovering.current = false;
          document.body.classList.remove("cursor-hover");
        }
        document.body.classList.add("cursor-text");
      } else if (isHovering.current) {
        isHovering.current = false;
        document.body.classList.remove("cursor-hover");
        document.body.classList.remove("cursor-text");
      }
    };

    const onMouseDown = () => {
      document.body.classList.add("cursor-click");
    };

    const onMouseUp = () => {
      document.body.classList.remove("cursor-click");
    };

    let rafId: number;
    const animate = () => {
      const ds = 0.92;
      cursorPos.current.x +=
        (mousePos.current.x - cursorPos.current.x) * ds;
      cursorPos.current.y +=
        (mousePos.current.y - cursorPos.current.y) * ds;

      const fs = 0.1;
      followerPos.current.x +=
        (mousePos.current.x - followerPos.current.x) * fs;
      followerPos.current.y +=
        (mousePos.current.y - followerPos.current.y) * fs;

      cursor.style.transform = `translate(${cursorPos.current.x}px, ${cursorPos.current.y}px) translate(-50%, -50%)`;
      follower.style.transform = `translate(${followerPos.current.x}px, ${followerPos.current.y}px) translate(-50%, -50%)`;

      rafId = requestAnimationFrame(animate);
    };

    document.addEventListener("pointermove", onPointerMove);
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);
    rafId = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
      cancelAnimationFrame(rafId);
      document.body.classList.remove(
        "cursor-hover",
        "cursor-text",
        "cursor-click"
      );
      cursor.classList.remove("is-visible");
      follower.classList.remove("is-visible");
    };
  }, [isEnabled]);

  if (!isEnabled) return null;

  return (
    <>
      <div ref={cursorRef} className="custom-cursor" />
      <div ref={followerRef} className="custom-cursor-follower" />
    </>
  );
};

export default CustomCursor;
