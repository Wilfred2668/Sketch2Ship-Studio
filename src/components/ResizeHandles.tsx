
import React from 'react';

interface ResizeHandlesProps {
  onStartResize: (direction: "right" | "bottom", e: React.MouseEvent) => void;
}

export const ResizeHandles: React.FC<ResizeHandlesProps> = ({ onStartResize }) => {
  const handleSize = 20;

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {/* Right handle */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: -handleSize / 2,
          width: handleSize,
          height: "100%",
          cursor: "ew-resize",
          zIndex: 2,
          background: "transparent",
          pointerEvents: "all",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onMouseDown={(e) => onStartResize("right", e)}
      >
        <div className="w-3 h-8 rounded bg-blue-400 opacity-70 hover:opacity-100 transition" />
      </div>
      {/* Bottom handle */}
      <div
        style={{
          position: "absolute",
          left: 0,
          bottom: -handleSize / 2,
          width: "100%",
          height: handleSize,
          cursor: "ns-resize",
          zIndex: 2,
          background: "transparent",
          pointerEvents: "all",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onMouseDown={(e) => onStartResize("bottom", e)}
      >
        <div className="h-3 w-8 rounded bg-blue-400 opacity-70 hover:opacity-100 transition" />
      </div>
    </div>
  );
};
