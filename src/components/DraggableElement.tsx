import React, { useState, useRef, useEffect } from 'react';
import { Element } from '../types/builder';
import { NavigationEditor } from './NavigationEditor';
import { AccordionEditor } from './AccordionEditor';
import { SlideshowEditor } from './SlideshowEditor';

interface DraggableElementProps {
  element: Element;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<Element>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

export const DraggableElement: React.FC<DraggableElementProps> = ({
  element,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  onDuplicate
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isEditing, setIsEditing] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isEditing) return;
    
    const rect = elementRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
    setIsDragging(true);
    onSelect();
  };

  const handleDoubleClick = () => {
    // Only enable editing for simple text elements
    if (['text', 'heading', 'button', 'card'].includes(element.type)) {
      setIsEditing(true);
    }
  };

  // Finish editing on blur or Enter
  const handleContentChange = (newContent: string) => {
    onUpdate({ content: newContent });
    setIsEditing(false);
  };

  // Helper function to convert YouTube URL to embed URL
  const getYouTubeEmbedUrl = (url: string) => {
    const videoIdMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
    if (videoIdMatch) {
      return `https://www.youtube.com/embed/${videoIdMatch[1]}`;
    }
    return url;
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const canvas = document.querySelector('.canvas-area');
      if (!canvas) return;
      
      const canvasRect = canvas.getBoundingClientRect();
      const newX = e.clientX - canvasRect.left - dragOffset.x;
      const newY = e.clientY - canvasRect.top - dragOffset.y;
      
      onUpdate({
        position: {
          x: Math.max(0, newX),
          y: Math.max(0, newY)
        }
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
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

  // Render function for types
  const renderElement = () => {
    const commonProps = {
      style: {
        ...element.styles,
        left: element.position.x,
        top: element.position.y,
        position: 'absolute' as const,
        cursor: isDragging ? 'grabbing' : 'grab',
        border: isSelected ? '2px solid #3b82f6' : '1px solid transparent',
        minWidth: '50px',
        minHeight: '30px'
      }
    };

    switch (element.type) {
      case 'text':
        return (
          <div {...commonProps}>
            {isEditing ? (
              <input
                ref={inputRef}
                value={element.content}
                onChange={(e) => handleContentChange(e.target.value)}
                onBlur={() => setIsEditing(false)}
                onKeyDown={(e) => e.key === 'Enter' && setIsEditing(false)}
                className="border-none outline-none bg-transparent w-full"
              />
            ) : (
              <span>{element.content}</span>
            )}
          </div>
        );

      case 'heading':
        return (
          <h1 {...commonProps}>
            {isEditing ? (
              <input
                ref={inputRef}
                value={element.content}
                onChange={(e) => handleContentChange(e.target.value)}
                onBlur={() => setIsEditing(false)}
                onKeyDown={(e) => e.key === 'Enter' && setIsEditing(false)}
                className="border-none outline-none bg-transparent w-full text-inherit font-inherit"
              />
            ) : (
              element.content
            )}
          </h1>
        );

      case 'button':
        return (
          <button {...commonProps} style={{ ...commonProps.style, cursor: 'pointer' }}>
            {isEditing ? (
              <input
                ref={inputRef}
                value={element.content}
                onChange={(e) => handleContentChange(e.target.value)}
                onBlur={() => setIsEditing(false)}
                onKeyDown={(e) => e.key === 'Enter' && setIsEditing(false)}
                className="border-none outline-none bg-transparent text-inherit font-inherit"
              />
            ) : (
              element.content
            )}
          </button>
        );

      case 'link':
        return (
          <a {...commonProps} href="#" style={{ ...commonProps.style, cursor: 'pointer' }}>
            {element.content}
          </a>
        );

      case 'image':
        return (
          <div {...commonProps} className="border-2 border-dashed border-gray-300 flex items-center justify-center">
            {element.content ? (
              <img src={element.content} alt="" className="max-w-full max-h-full object-contain" />
            ) : (
              <span className="text-gray-500">Image Placeholder</span>
            )}
          </div>
        );

      case 'video':
        const isYouTube = element.content.includes('youtube.com') || element.content.includes('youtu.be');
        
        return (
          <div 
            {...commonProps}
            className="bg-black border-2 border-dashed border-gray-300 flex items-center justify-center text-white"
          >
            {element.content ? (
              isYouTube ? (
                <iframe
                  src={getYouTubeEmbedUrl(element.content)}
                  className="w-full h-full"
                  frameBorder="0"
                  allowFullScreen
                  title="YouTube video"
                />
              ) : (
                <video src={element.content} controls className="w-full h-full" />
              )
            ) : (
              <span>Video Placeholder</span>
            )}
          </div>
        );

      case 'icon':
        return (
          <div {...commonProps} className="flex items-center justify-center">
            <span style={{ fontSize: element.styles.fontSize || '24px' }}>
              {element.content || '⭐'}
            </span>
          </div>
        );

      case 'divider':
        return (
          <hr 
            {...commonProps} 
            style={{ 
              ...commonProps.style, 
              width: element.styles.width || '200px', 
              height: '2px',
              backgroundColor: element.styles.backgroundColor || '#ddd',
              border: 'none'
            }} 
          />
        );

      case 'spacer':
        return (
          <div 
            {...commonProps} 
            style={{ 
              ...commonProps.style, 
              backgroundColor: 'transparent',
              border: isSelected ? '2px dashed #3b82f6' : '1px dashed #ccc'
            }}
          >
            <span className="text-gray-400 text-xs">Spacer</span>
          </div>
        );

      case 'card':
        return (
          <div {...commonProps} className="shadow-lg">
            {isEditing ? (
              <div className="p-4">
                <textarea
                  value={element.content}
                  onChange={(e) => handleContentChange(e.target.value)}
                  onBlur={() => setIsEditing(false)}
                  className="w-full h-20 border-none outline-none bg-transparent resize-none"
                  autoFocus
                />
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4">{element.content}</div>
            )}
          </div>
        );

      case 'list':
        const listItems = element.content.split('\n').filter(Boolean);
        return (
          <ul {...commonProps} className="list-disc list-inside space-y-1">
            {listItems.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        );

      case 'quote':
        return (
          <blockquote {...commonProps} className="italic border-l-4 border-blue-500 pl-4">
            "{element.content}"
          </blockquote>
        );

      case 'slideshow':
        const images = element.content ? element.content.split('\n').filter(Boolean) : [];
        const [currentImageIndex, setCurrentImageIndex] = useState(0);
        
        useEffect(() => {
          if (images.length > 1) {
            const interval = setInterval(() => {
              setCurrentImageIndex((prev) => (prev + 1) % images.length);
            }, 3000);
            return () => clearInterval(interval);
          }
        }, [images.length]);

        return (
          <div {...commonProps} className="relative overflow-hidden bg-gray-100 border border-gray-300">
            {images.length > 0 ? (
              <>
                <img 
                  src={images[currentImageIndex]} 
                  alt={`Slide ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />
                {images.length > 1 && (
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                    {images.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full ${
                          index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <span>Slideshow Placeholder</span>
              </div>
            )}
          </div>
        );

      case 'accordion':
        const sections = element.content ? element.content.split('\n').filter(Boolean) : [];
        const [openSections, setOpenSections] = useState<number[]>([]);

        const toggleSection = (index: number) => {
          setOpenSections(prev => 
            prev.includes(index) 
              ? prev.filter(i => i !== index)
              : [...prev, index]
          );
        };

        return (
          <div {...commonProps} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            {sections.length > 0 ? (
              sections.map((section, index) => {
                const [title, content] = section.split('|');
                const isOpen = openSections.includes(index);
                
                return (
                  <div key={index} className="border-b border-gray-200 last:border-b-0">
                    <button
                      className="w-full px-4 py-3 text-left bg-gray-50 hover:bg-gray-100 font-medium text-sm"
                      onClick={() => toggleSection(index)}
                    >
                      <div className="flex justify-between items-center">
                        <span>{title || `Section ${index + 1}`}</span>
                        <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                          ▼
                        </span>
                      </div>
                    </button>
                    {isOpen && (
                      <div className="px-4 py-3 text-sm text-gray-700">
                        {content || 'Content here...'}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 p-4">
                <span>Accordion Placeholder</span>
              </div>
            )}
          </div>
        );

      case 'navigation':
        const navItems = element.content ? element.content.split('\n').filter(Boolean) : [];
        
        return (
          <nav {...commonProps} className="bg-white border border-gray-200">
            {navItems.length > 0 ? (
              <ul className="flex space-x-0">
                {navItems.map((item, index) => {
                  const [label, url] = item.split('|');
                  return (
                    <li key={index}>
                      <a 
                        href={url || '#'} 
                        className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 border-r border-gray-200 last:border-r-0"
                      >
                        {label || `Link ${index + 1}`}
                      </a>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 p-4">
                <span>Navigation Placeholder</span>
              </div>
            )}
          </nav>
        );

      default:
        return (
          <div {...commonProps}>
            <span>{element.content || element.type}</span>
          </div>
        );
    }
  };

  return (
    <div
      ref={elementRef}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
      className={`element ${isSelected ? 'selected' : ''}`}
    >
      {renderElement()}
      
      {isSelected && (
        <div 
          className="absolute -top-8 left-0 flex gap-1 bg-blue-500 text-white text-xs px-2 py-1 rounded z-10"
          style={{ fontSize: '10px' }}
        >
          <button onClick={onDuplicate} className="hover:bg-blue-600 px-1 rounded">Copy</button>
          <button onClick={onDelete} className="hover:bg-red-600 px-1 rounded">Delete</button>
        </div>
      )}
    </div>
  );
};
