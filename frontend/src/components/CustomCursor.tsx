import { useEffect, useRef } from "react";
import "../styles/custom-cursor.css";

/**
 * Ultra-Premium Custom Cursor Component
 * Tech-style animated cursor with smooth tracking and professional effects
 */
const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const mousePosition = useRef({ x: 0, y: 0 });
  const cursorPosition = useRef({ x: 0, y: 0 });
  const followerPosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Check if device supports hover (not touch device)
    const isTouchDevice = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
    if (isTouchDevice) return;

    const cursor = cursorRef.current;
    const follower = followerRef.current;
    if (!cursor || !follower) return;

    // Track mouse position
    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current = { x: e.clientX, y: e.clientY };
    };

    // Detect interactive elements with improved logic
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Check if hovering over interactive elements
      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.onclick ||
        target.closest("button") !== null ||
        target.closest("a") !== null ||
        target.classList.contains("cursor-pointer") ||
        window.getComputedStyle(target).cursor === "pointer"
      ) {
        document.body.classList.add("cursor-hover");
      }
      
      // Check for text inputs
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        document.body.classList.add("cursor-text");
      }
      
      // Check for draggable elements
      if (target.draggable) {
        document.body.classList.add("cursor-grab");
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.onclick ||
        target.closest("button") !== null ||
        target.closest("a") !== null ||
        target.classList.contains("cursor-pointer") ||
        window.getComputedStyle(target).cursor === "pointer"
      ) {
        document.body.classList.remove("cursor-hover");
      }
      
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        document.body.classList.remove("cursor-text");
      }
      
      if (target.draggable) {
        document.body.classList.remove("cursor-grab");
      }
    };

    // Handle click animation
    const handleMouseDown = () => {
      document.body.classList.add("cursor-click");
    };

    const handleMouseUp = () => {
      document.body.classList.remove("cursor-click");
    };

    // Smooth cursor animation with requestAnimationFrame
    let animationFrameId: number;
    
    const animateCursor = () => {
      // Cursor follows mouse with high precision
      const cursorSpeed = 0.95; // Very responsive
      cursorPosition.current.x += (mousePosition.current.x - cursorPosition.current.x) * cursorSpeed;
      cursorPosition.current.y += (mousePosition.current.y - cursorPosition.current.y) * cursorSpeed;
      
      // Follower lags behind for smooth trailing effect
      const followerSpeed = 0.12; // Smooth lag
      followerPosition.current.x += (mousePosition.current.x - followerPosition.current.x) * followerSpeed;
      followerPosition.current.y += (mousePosition.current.y - followerPosition.current.y) * followerSpeed;

      cursor.style.transform = `translate(${cursorPosition.current.x}px, ${cursorPosition.current.y}px) translate(-50%, -50%)`;
      follower.style.transform = `translate(${followerPosition.current.x}px, ${followerPosition.current.y}px) translate(-50%, -50%)`;

      animationFrameId = requestAnimationFrame(animateCursor);
    };

    // Add event listeners
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
    
    // Start animation loop
    animationFrameId = requestAnimationFrame(animateCursor);

    // Cleanup
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
      cancelAnimationFrame(animationFrameId);
      
      // Remove all cursor classes
      document.body.classList.remove("cursor-hover", "cursor-text", "cursor-grab", "cursor-click");
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className="custom-cursor" />
      <div ref={followerRef} className="custom-cursor-follower" />
    </>
  );
};

export default CustomCursor;
