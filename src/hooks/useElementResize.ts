
import { useState, useEffect } from 'react';
import { Element } from '../types/builder';

interface ResizeState {
  direction: "right" | "bottom" | null;
}

interface UseElementResizeProps {
  element: Element;
  onUpdate: (updates: Partial<Element>) => void;
  elementRef: React.RefObject<HTMLDivElement>;
}

export const useElementResize = ({ element, onUpdate, elementRef }: UseElementResizeProps) => {
  const [resizing, setResizing] = useState<ResizeState>({ direction: null });
  const [resizeStart, setResizeStart] = useState<{ x: number; y: number; width: number; height: number } | null>(null);

  useEffect(() => {
    if (!resizing.direction) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!elementRef.current || !resizeStart) return;

      let newWidth = resizeStart.width;
      let newHeight = resizeStart.height;
      
      if (resizing.direction === "right") {
        newWidth = Math.max(50, resizeStart.width + (e.clientX - resizeStart.x));
      }
      if (resizing.direction === "bottom") {
        newHeight = Math.max(30, resizeStart.height + (e.clientY - resizeStart.y));
      }
      
      onUpdate({
        styles: {
          ...element.styles,
          width: newWidth + 'px',
          height: newHeight + 'px'
        }
      });
    };

    const handleMouseUp = () => {
      setResizing({ direction: null });
      setResizeStart(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [resizing, resizeStart, onUpdate, element.styles, elementRef]);

  const startResize = (direction: "right" | "bottom", e: React.MouseEvent) => {
    e.stopPropagation();
    setResizing({ direction });
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: parseInt(element.styles.width as any, 10) || elementRef.current?.offsetWidth || 100,
      height: parseInt(element.styles.height as any, 10) || elementRef.current?.offsetHeight || 50,
    });
  };

  return {
    startResize,
    isResizing: !!resizing.direction
  };
};
