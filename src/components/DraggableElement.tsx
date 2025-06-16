
import React, { useState, useRef, useEffect } from 'react';
import { Element } from '../types/builder';
import { ElementRenderer } from './ElementRenderer';
import { ElementControls } from './ElementControls';
import { ResizeHandles } from './ResizeHandles';
import { useDragAndDrop } from '../hooks/useDragAndDrop';
import { useElementResize } from '../hooks/useElementResize';

interface DraggableElementProps {
  element: Element;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<Element>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onNavigation?: (linkTo?: { type: 'page' | 'url'; value: string }) => void;
}

export const DraggableElement: React.FC<DraggableElementProps> = ({
  element,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  onDuplicate,
  onNavigation
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { isDragging, handleMouseDown } = useDragAndDrop({
    onUpdate,
    onSelect,
    isEditing
  });

  const { startResize } = useElementResize({
    element,
    onUpdate,
    elementRef
  });

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    if (['text', 'heading', 'button', 'card'].includes(element.type)) {
      setIsEditing(true);
    }
  };

  // Handle element click for navigation
  const handleElementClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Only trigger navigation if not in editing mode and element has linkTo
    if (!isEditing && element.linkTo && onNavigation) {
      if (element.type === 'button' || element.type === 'link') {
        onNavigation(element.linkTo);
      }
    }
  };

  const handleContentChange = (newContent: string) => {
    onUpdate({ content: newContent });
    setIsEditing(false);
  };

  const isResizableType = ['image', 'video', 'card', 'slideshow', 'divider', 'spacer', 'list', 'quote'].includes(element.type);

  const wrapIfResizable = (node: React.ReactNode) => {
    if (isResizableType) {
      return (
        <div
          className="relative w-full"
          style={{
            width: element.styles.width || "200px",
            height: element.styles.height || "150px",
            minWidth: "50px",
            minHeight: "30px",
          }}
        >
          {node}
          {isSelected && <ResizeHandles onStartResize={startResize} />}
        </div>
      );
    }
    return node;
  };

  return (
    <div
      ref={elementRef}
      onMouseDown={(e) => handleMouseDown(e, elementRef)}
      onDoubleClick={handleDoubleClick}
      className={`element ${isSelected ? 'selected' : ''}`}
      style={{ 
        zIndex: isSelected ? 10 : 1,
        cursor: isDragging ? 'grabbing' : 'grab',
        border: isSelected ? '2px solid #3b82f6' : '1px solid transparent'
      }}
    >
      {wrapIfResizable(
        <ElementRenderer
          element={element}
          isEditing={isEditing}
          onContentChange={handleContentChange}
          onElementClick={handleElementClick}
          inputRef={inputRef}
        />
      )}

      {isSelected && (
        <ElementControls
          onDuplicate={onDuplicate}
          onDelete={onDelete}
        />
      )}
    </div>
  );
};
