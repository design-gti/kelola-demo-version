"use client";

import { useEffect, useRef, useState } from "react";

const DESIGN_WIDTH = 1440;

export default function ScaleWrapper({ children }: { children: React.ReactNode }) {
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [scaledHeight, setScaledHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    const update = () => {
      const s = window.innerWidth / DESIGN_WIDTH;
      setScale(s);
      if (innerRef.current) {
        setScaledHeight(innerRef.current.offsetHeight * s);
      }
    };

    update();
    window.addEventListener("resize", update);
    const ro = new ResizeObserver(update);
    if (innerRef.current) ro.observe(innerRef.current);
    return () => {
      window.removeEventListener("resize", update);
      ro.disconnect();
    };
  }, []);

  return (
    <div style={{ width: "100vw", height: scaledHeight, overflow: "hidden" }}>
      <div
        ref={innerRef}
        style={{
          width: DESIGN_WIDTH,
          transformOrigin: "top left",
          transform: `scale(${scale})`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
