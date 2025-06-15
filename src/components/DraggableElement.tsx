import React, { useState } from 'react';
import { Element } from '../types/builder';
import { AccordionEditor } from './AccordionEditor';
import { NavigationEditor } from './NavigationEditor';
import { SlideshowEditor } from './SlideshowEditor';

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
  const [slideshowIndex, setSlideshowIndex] = useState(0);
  const [accordionOpenIndex, setAccordionOpenIndex] = useState<number | null>(null);

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
    // Enable editor modal for complex components
    if (['slideshow', 'accordion', 'navigation'].includes(element.type)) {
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

  // Render function for types
  const renderElement = () => {
    const commonProps = {
      style: {
        ...element.styles,
        display: 'inline-block',
        minWidth: element.type === 'text' ? '100px' : 'auto',
        minHeight: element.type === 'text' ? '30px' : 'auto',
        cursor: isDragging ? 'grabbing' : element.styles.cursor || 'pointer',
      } as React.CSSProperties
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
            style={element.styles as React.CSSProperties}
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
            style={element.styles as React.CSSProperties}
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
            style={element.styles as React.CSSProperties}
          />
        ) : (
          <button {...commonProps}>{element.content}</button>
        );
      case 'link':
        return isEditing ? (
          <input
            type="text"
            value={element.content}
            onChange={e => onUpdate({ content: e.target.value })}
            onBlur={() => setIsEditing(false)}
            onKeyDown={e => e.key === 'Enter' && setIsEditing(false)}
            autoFocus
            className="border rounded px-2 py-1 w-full bg-background"
            style={element.styles as React.CSSProperties}
          />
        ) : (
          <a {...commonProps} href="#" onClick={e => e.preventDefault()}>{element.content}</a>
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
        return isEditing ? (
          <input
            type="text"
            value={element.content}
            onChange={e => onUpdate({ content: e.target.value })}
            onBlur={() => setIsEditing(false)}
            onKeyDown={e => e.key === 'Enter' && setIsEditing(false)}
            autoFocus
            className="border rounded px-2 py-1 w-full bg-background text-center"
            style={element.styles as React.CSSProperties}
          />
        ) : (
          <span {...commonProps}>{element.content}</span>
        );
      case 'slideshow':
        const images = element.content.split('\n').filter(img => img.trim());
        
        if (isEditing) {
          return (
            <div className="p-4 bg-white border border-gray-300 rounded-lg min-w-[400px]">
              <SlideshowEditor
                images={images}
                onUpdate={(newImages) => {
                  const newContent = newImages.join('\n');
                  onUpdate({ content: newContent });
                }}
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
          );
        }
        
        return (
          <div {...commonProps} className="relative bg-gray-100 border border-gray-300 rounded overflow-hidden">
            {images.length > 0 ? (
              <>
                <img 
                  src={images[slideshowIndex] || images[0]} 
                  alt={`Slide ${slideshowIndex + 1}`} 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setSlideshowIndex(index)}
                      className={`w-2 h-2 rounded-full ${index === slideshowIndex ? 'bg-white' : 'bg-white/50'}`}
                    />
                  ))}
                </div>
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setSlideshowIndex((prev) => (prev - 1 + images.length) % images.length)}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center"
                    >
                      ‹
                    </button>
                    <button
                      onClick={() => setSlideshowIndex((prev) => (prev + 1) % images.length)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center"
                    >
                      ›
                    </button>
                  </>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Slideshow Placeholder
              </div>
            )}
          </div>
        );
      case 'accordion':
        const sections = element.content.split('\n').filter(section => section.trim()).map(section => {
          const [title, content] = section.split('|');
          return { title: title?.trim() || 'Section', content: content?.trim() || 'Content' };
        });
        
        if (isEditing) {
          return (
            <div className="p-4 bg-white border border-gray-300 rounded-lg min-w-[350px]">
              <AccordionEditor
                sections={sections}
                onUpdate={(newSections) => {
                  const newContent = newSections.map(s => `${s.title}|${s.content}`).join('\n');
                  onUpdate({ content: newContent });
                }}
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
          );
        }
        
        return (
          <div {...commonProps} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            {sections.map((section, index) => (
              <div key={index} className="border-b border-gray-200 last:border-b-0">
                <button
                  onClick={() => setAccordionOpenIndex(accordionOpenIndex === index ? null : index)}
                  className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 flex justify-between items-center"
                >
                  <span className="font-medium">{section.title}</span>
                  <span className={`transform transition-transform ${accordionOpenIndex === index ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>
                {accordionOpenIndex === index && (
                  <div className="px-4 py-3 bg-white">
                    {section.content}
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      case 'navigation':
        const navItems = element.content.split('\n').filter(item => item.trim()).map(item => {
          const [label, url] = item.split('|');
          return { label: label?.trim() || 'Link', url: url?.trim() || '#' };
        });
        
        if (isEditing) {
          return (
            <div className="p-4 bg-white border border-gray-300 rounded-lg min-w-[400px]">
              <NavigationEditor
                items={navItems}
                onUpdate={(newItems) => {
                  const newContent = newItems.map(item => `${item.label}|${item.url}`).join('\n');
                  onUpdate({ content: newContent });
                }}
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
          );
        }
        
        return (
          <nav {...commonProps} className="bg-white border-b border-gray-200 w-full">
            <div className="flex items-center justify-between px-6 py-3">
              <div className="flex items-center space-x-8">
                {navItems.map((item, index) => (
                  <a
                    key={index}
                    href={item.url}
                    onClick={e => e.preventDefault()}
                    className="text-gray-700 hover:text-gray-900 font-medium"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          </nav>
        );
      case 'divider':
        return (
          <div className="w-full flex flex-col items-center py-2" {...commonProps}>
            {element.content && <span className="text-xs text-muted-foreground mb-1">{element.content}</span>}
            <hr className="w-32 border-t border-gray-400" />
          </div>
        );
      case 'spacer':
        return (
          <div {...commonProps} className="bg-transparent border border-dashed border-gray-300 flex items-center justify-center text-gray-400 min-h-[40px]">
            {isSelected ? 'Spacer' : ''}
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
      case 'list':
        return isEditing ? (
          <textarea
            value={element.content}
            onChange={e => onUpdate({ content: e.target.value })}
            onBlur={() => setIsEditing(false)}
            rows={4}
            autoFocus
            className="border rounded p-2 w-full bg-background"
            placeholder="Enter each item on a new line"
          />
        ) : (
          <ul {...commonProps} className="list-disc list-inside space-y-1">
            {element.content.split('\n').filter(item => item.trim()).map((item, index) => (
              <li key={index}>{item.trim()}</li>
            ))}
          </ul>
        );
      case 'quote':
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
          <blockquote {...commonProps} className="border-l-4 border-blue-500 bg-gray-50 dark:bg-gray-800 p-4 italic">
            "{element.content}"
          </blockquote>
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
