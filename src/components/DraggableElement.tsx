import React, { useState, useRef, useEffect } from 'react';
import { Element } from '../types/builder';
import { DynamicNavigation } from './DynamicNavigation';
import { DynamicAccordion } from './DynamicAccordion';

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
    console.log('Mouse down on element:', element.type, element.id);
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
    console.log('Started dragging element:', element.id);
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
      
      console.log('Mouse moving while dragging');
      const canvas = document.querySelector('.canvas-area');
      if (!canvas) {
        console.log('Canvas not found!');
        return;
      }
      
      const canvasRect = canvas.getBoundingClientRect();
      const newX = e.clientX - canvasRect.left - dragOffset.x;
      const newY = e.clientY - canvasRect.top - dragOffset.y;
      
      const newPosition = {
        x: Math.max(0, newX),
        y: Math.max(0, newY)
      };
      
      console.log('Updating position to:', newPosition);
      onUpdate({
        position: newPosition
      });
    };

    const handleMouseUp = () => {
      if (isDragging) {
        console.log('Stopped dragging element:', element.id);
      }
      setIsDragging(false);
    };

    if (isDragging) {
      console.log('Adding mouse event listeners');
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, onUpdate, element.id]);

  // Helper to check if element is resizable
  const isResizableType = ['image', 'video', 'card', 'slideshow', 'divider', 'spacer', 'list', 'quote'].includes(element.type);

  // Handle resizing
  const [resizing, setResizing] = useState<{ direction: "right" | "bottom" | null }>({ direction: null });
  const [resizeStart, setResizeStart] = useState<{ x: number; y: number; width: number; height: number } | null>(null);

  useEffect(() => {
    if (!resizing.direction) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!elementRef.current || !resizeStart) return;

      let newWidth = parseInt(resizeStart.width as any, 10) || elementRef.current.offsetWidth;
      let newHeight = parseInt(resizeStart.height as any, 10) || elementRef.current.offsetHeight;
      if (resizing.direction === "right") {
        newWidth = Math.max(30, resizeStart.width + (e.clientX - resizeStart.x));
      }
      if (resizing.direction === "bottom") {
        newHeight = Math.max(30, resizeStart.height + (e.clientY - resizeStart.y));
      }
      // Update instantly for feel, but throttle updates if needed
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
  }, [resizing, resizeStart, onUpdate, element.styles]);

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
        const accordionSections = sections.map((section, index) => {
          const [title, content] = section.split('|');
          return {
            id: `section-${index}`,
            title: title || `Section ${index + 1}`,
            content: content || 'Content here...',
            isOpen: false
          };
        });

        return (
          <div {...commonProps}>
            <DynamicAccordion
              sections={accordionSections}
              onUpdate={(newSections) => {
                const newContent = newSections.map(s => `${s.title}|${s.content}`).join('\n');
                onUpdate({ content: newContent });
              }}
              style={{ position: 'relative', cursor: 'default' }}
              className="min-w-[300px]"
            />
          </div>
        );

      case 'navigation':
        const navItems = element.content ? element.content.split('\n').filter(Boolean) : [];
        const navigationItems = navItems.map((item, index) => {
          const [label, url] = item.split('|');
          return {
            id: `nav-${index}`,
            label: label || `Link ${index + 1}`,
            url: url || '#'
          };
        });

        return (
          <div {...commonProps}>
            <DynamicNavigation
              items={navigationItems}
              onUpdate={(newItems) => {
                const newContent = newItems.map(item => `${item.label}|${item.url}`).join('\n');
                onUpdate({ content: newContent });
              }}
              style={{ position: 'relative', cursor: 'default' }}
              className="min-w-[400px]"
            />
          </div>
        );

      default:
        return (
          <div {...commonProps}>
            <span>{element.content || element.type}</span>
          </div>
        );
    }
  };

  // Replace the "withResizeHandles" helper to use better responsiveness and bigger handle areas:
  const withResizeHandles = (children: React.ReactNode) => {
    if (!isResizableType || !isSelected) return children;

    // Responsive handle size
    const handleSize = 24;

    return (
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {children}
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
            touchAction: "none",
          }}
          className="max-sm:w-8"
          onMouseDown={(e) => {
            e.stopPropagation();
            setResizing({ direction: "right" });
            setResizeStart({
              x: e.clientX,
              y: e.clientY,
              width:
                parseInt(element.styles.width as any, 10) ||
                elementRef.current?.offsetWidth ||
                100,
              height:
                parseInt(element.styles.height as any, 10) ||
                elementRef.current?.offsetHeight ||
                50,
            });
          }}
          onTouchStart={(e) => {
            e.stopPropagation();
            setResizing({ direction: "right" });
            setResizeStart({
              x: e.touches[0].clientX,
              y: e.touches[0].clientY,
              width:
                parseInt(element.styles.width as any, 10) ||
                elementRef.current?.offsetWidth ||
                100,
              height:
                parseInt(element.styles.height as any, 10) ||
                elementRef.current?.offsetHeight ||
                50,
            });
          }}
        >
          <div className="w-4 h-10 max-sm:h-8 rounded bg-blue-400 opacity-70 hover:opacity-100 transition" />
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
            touchAction: "none"
          }}
          className="max-sm:h-8"
          onMouseDown={(e) => {
            e.stopPropagation();
            setResizing({ direction: "bottom" });
            setResizeStart({
              x: e.clientX,
              y: e.clientY,
              width:
                parseInt(element.styles.width as any, 10) ||
                elementRef.current?.offsetWidth ||
                100,
              height:
                parseInt(element.styles.height as any, 10) ||
                elementRef.current?.offsetHeight ||
                50,
            });
          }}
          onTouchStart={(e) => {
            e.stopPropagation();
            setResizing({ direction: "bottom" });
            setResizeStart({
              x: e.touches[0].clientX,
              y: e.touches[0].clientY,
              width:
                parseInt(element.styles.width as any, 10) ||
                elementRef.current?.offsetWidth ||
                100,
              height:
                parseInt(element.styles.height as any, 10) ||
                elementRef.current?.offsetHeight ||
                50,
            });
          }}
        >
          <div className="h-4 w-10 max-sm:w-8 rounded bg-blue-400 opacity-70 hover:opacity-100 transition" />
        </div>
      </div>
    );
  };

  // Update wrapIfResizable for responsiveness & clamp size on mobile:
  const wrapIfResizable = (node: React.ReactNode) => {
    if (isResizableType) {
      return (
        <div
          className="relative max-w-full max-h-full w-full md:w-auto"
          style={{
            width: element.styles.width || "100%",
            height: element.styles.height || "auto",
            minWidth: "48px",
            minHeight: "32px",
            // clamp possible size in mobile
            maxWidth: "100vw",
            maxHeight: "80vh",
          }}
        >
          {node}
          {withResizeHandles(null)}
        </div>
      );
    }
    return node;
  };

  return (
    <div
      ref={elementRef}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
      className={`element ${isSelected ? 'selected' : ''}`}
    >
      {wrapIfResizable(renderElement())}

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
