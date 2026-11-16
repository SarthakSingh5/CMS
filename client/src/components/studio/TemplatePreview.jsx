import { useRef, useState, useEffect } from "react";

export function TemplatePreview({ children, contentWidth = 1280 }) {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(0.28);
  const [containerHeight, setContainerHeight] = useState(0);
  const [isNearViewport, setIsNearViewport] = useState(false);

  // ResizeObserver for dynamic scaling
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      const h = entry.contentRect.height;
      if (w > 0) {
        setScale(w / contentWidth);
      }
      setContainerHeight(h);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [contentWidth]);

  // IntersectionObserver to avoid rendering off-screen previews
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setIsNearViewport(entry.isIntersecting);
      },
      { rootMargin: "250px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none select-none"
      style={{ contain: "strict" }}
    >
      {isNearViewport && (
        <div
          style={{
            width: `${contentWidth}px`,
            height: scale > 0 ? `${containerHeight / scale}px` : undefined,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            overflow: "hidden",
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
