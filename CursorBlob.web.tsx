import { useEffect, useRef } from "react";

export default function CursorBlob() {
  const blobRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const blob = blobRef.current;
    if (!blob) return;

    const move = (e: MouseEvent) => {
      blob.animate(
        {
          left: `${e.clientX}px`,
          top: `${e.clientY}px`,
        },
        { duration: 300, fill: "forwards" },
      );
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div
      ref={blobRef}
      style={{
        position: "fixed",
        width: "140px",
        height: "140px",
        borderRadius: "50%",
        background:
          "radial-gradient(circle, rgba(216,180,254,0.4), rgba(186,230,253,0.25))",
        pointerEvents: "none",
        transform: "translate(-50%, -50%)",
        filter: "blur(20px)",
        zIndex: 0,
      }}
    />
  );
}
