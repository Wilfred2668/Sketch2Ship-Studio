import React, { useState } from 'react';
import { Element } from '../types/builder';

interface DraggableElementProps {
  element: Element;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<Element>) => void;
}

export const DraggableElement: React.FC<DraggableElementProps> = ({
  element,
  isSelected,
  onSelect,
  onUpdate,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isEditing, setIsEditing] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - element.position.x,
      y: e.clientY - element.position.y,
    });
    onSelect();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    onUpdate({
      position: {
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      }
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart]);

  // Enable editing on double-click
  const handleDoubleClick = () => {
    // Enable inline editing for text/heading/button/card
    if (['text', 'heading', 'button', 'card'].includes(element.type)) {
      setIsEditing(true);
    }
  };

  // Finish editing on blur or Enter
  const handleContentChange = (newContent: string) => {
    onUpdate({ content: newContent });
    setIsEditing(false);
  };

  // Render function for types
  const renderElement = () => {
    const commonProps = {
      style: {
        ...element.styles,
        display: 'inline-block',
        minWidth: element.type === 'text' ? '100px' : 'auto',
        minHeight: element.type === 'text' ? '30px' : 'auto',
        cursor: isDragging ? 'grabbing' : element.styles.cursor || 'pointer',
      }
    };

    switch (element.type) {
      case 'text':
        return isEditing ? (
          <input
            type="text"
            value={element.content}
            onChange={e => onUpdate({ content: e.target.value })}
            onBlur={() => setIsEditing(false)}
            onKeyDown={e => e.key === 'Enter' && setIsEditing(false)}
            autoFocus
            className="border rounded px-2 py-1 w-full bg-background"
            style={element.styles}
          />
        ) : (
          <span {...commonProps}>{element.content}</span>
        );
      case 'heading':
        return isEditing ? (
          <input
            type="text"
            value={element.content}
            onChange={e => onUpdate({ content: e.target.value })}
            onBlur={() => setIsEditing(false)}
            onKeyDown={e => e.key === 'Enter' && setIsEditing(false)}
            autoFocus
            className="border rounded text-2xl font-bold px-2 py-1 w-full bg-background"
            style={element.styles}
          />
        ) : (
          <h2 {...commonProps}>{element.content}</h2>
        );
      case 'button':
        return isEditing ? (
          <input
            type="text"
            value={element.content}
            onChange={e => onUpdate({ content: e.target.value })}
            onBlur={() => setIsEditing(false)}
            onKeyDown={e => e.key === 'Enter' && setIsEditing(false)}
            autoFocus
            className="border rounded px-2 py-1 w-full bg-background"
            style={element.styles}
          />
        ) : (
          <button {...commonProps}>{element.content}</button>
        );
      case 'image':
        return (
          <div 
            {...commonProps}
            className="bg-gray-200 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-500"
          >
            {element.content ? (
              <img src={element.content} alt="Uploaded" className="w-full h-full object-cover" />
            ) : (
              <span>Image Placeholder</span>
            )}
          </div>
        );
      case 'divider':
        return (
          <div className="w-full flex flex-col items-center py-2" {...commonProps}>
            {element.content && <span className="text-xs text-muted-foreground mb-1">{element.content}</span>}
            <hr className="w-32 border-t border-gray-400" />
          </div>
        );
      case 'card':
        return isEditing ? (
          <textarea
            value={element.content}
            onChange={e => onUpdate({ content: e.target.value })}
            onBlur={() => setIsEditing(false)}
            rows={3}
            autoFocus
            className="border rounded p-2 w-full bg-background"
          />
        ) : (
          <div {...commonProps} className="bg-white/90 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-4 min-w-[160px] min-h-[80px] shadow-sm">
            {element.content}
          </div>
        );
      default:
        return <div {...commonProps}>{element.content}</div>;
    }
  };

  return (
    <div
      className={`absolute cursor-move select-none ${
        isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''
      } ${isDragging ? 'opacity-75' : ''}`}
      style={{
        left: element.position.x,
        top: element.position.y,
        zIndex: isSelected ? 10 : 1,
      }}
      onMouseDown={handleMouseDown}
      onClick={onSelect}
      onDoubleClick={handleDoubleClick}
      tabIndex={0}
    >
      {renderElement()}
      
      {isSelected && (
        <div className="absolute -top-8 left-0 bg-blue-500 text-white px-2 py-1 rounded text-xs">
          {element.type}
        </div>
      )}
    </div>
  );
};
