
import { useState, useEffect } from 'react';

interface DragState {
  isDragging: boolean;
  dragOffset: { x: number; y: number };
}

interface UseDragAndDropProps {
  onUpdate: (updates: { position: { x: number; y: number } }) => void;
  onSelect: () => void;
  isEditing: boolean;
}

export const useDragAndDrop = ({ onUpdate, onSelect, isEditing }: UseDragAndDropProps) => {
  const [{ isDragging, dragOffset }, setState] = useState<DragState>({
    isDragging: false,
    dragOffset: { x: 0, y: 0 }
  });

  const handleMouseDown = (e: React.MouseEvent, elementRef: React.RefObject<HTMLDivElement>) => {
    if (isEditing) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const rect = elementRef.current?.getBoundingClientRect();
    if (rect) {
      setState({
        isDragging: true,
        dragOffset: {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        }
      });
    }
    onSelect();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      // Find the canvas container - look for the fixed-size canvas
      const canvasContainer = document.querySelector('.canvas-area > div');
      if (!canvasContainer) return;
      
      const canvasRect = canvasContainer.getBoundingClientRect();
      
      // Calculate new position relative to the canvas
      const newX = e.clientX - canvasRect.left - dragOffset.x;
      const newY = e.clientY - canvasRect.top - dragOffset.y;
      
      // Constrain to canvas boundaries (800x600)
      const constrainedX = Math.max(0, Math.min(newX, 800 - 100)); // Leave some margin
      const constrainedY = Math.max(0, Math.min(newY, 600 - 50));  // Leave some margin
      
      onUpdate({ 
        position: { 
          x: constrainedX, 
          y: constrainedY 
        } 
      });
    };

    const handleMouseUp = () => {
      setState(prev => ({ ...prev, isDragging: false }));
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, onUpdate]);

  return {
    isDragging,
    handleMouseDown
  };
};
