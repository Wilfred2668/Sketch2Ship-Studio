
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

  const handleDoubleClick = () => {
    if (element.type !== 'image') {
      setIsEditing(true);
    }
  };

  const handleContentChange = (newContent: string) => {
    onUpdate({ content: newContent });
    setIsEditing(false);
  };

  const renderElement = () => {
    const commonProps = {
      style: {
        ...element.styles,
        display: 'inline-block',
        minWidth: element.type === 'text' ? '100px' : 'auto',
        minHeight: element.type === 'text' ? '30px' : 'auto',
      }
    };

    switch (element.type) {
      case 'text':
        return isEditing ? (
          <input
            type="text"
            value={element.content}
            onChange={(e) => handleContentChange(e.target.value)}
            onBlur={() => setIsEditing(false)}
            onKeyPress={(e) => e.key === 'Enter' && setIsEditing(false)}
            autoFocus
            className="border-none outline-none bg-transparent"
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
            onChange={(e) => handleContentChange(e.target.value)}
            onBlur={() => setIsEditing(false)}
            onKeyPress={(e) => e.key === 'Enter' && setIsEditing(false)}
            autoFocus
            className="border-none outline-none bg-transparent text-2xl font-bold"
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
            onChange={(e) => handleContentChange(e.target.value)}
            onBlur={() => setIsEditing(false)}
            onKeyPress={(e) => e.key === 'Enter' && setIsEditing(false)}
            autoFocus
            className="border-none outline-none bg-transparent"
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
