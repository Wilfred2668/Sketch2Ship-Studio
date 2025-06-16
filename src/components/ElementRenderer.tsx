
import React, { useState, useEffect } from 'react';
import { Element } from '../types/builder';
import { DynamicNavigation } from './DynamicNavigation';
import { DynamicAccordion } from './DynamicAccordion';

interface ElementRendererProps {
  element: Element;
  isEditing: boolean;
  onContentChange: (newContent: string) => void;
  onElementClick: (e: React.MouseEvent) => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const ElementRenderer: React.FC<ElementRendererProps> = ({
  element,
  isEditing,
  onContentChange,
  onElementClick,
  inputRef
}) => {
  const getYouTubeEmbedUrl = (url: string) => {
    const videoIdMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
    if (videoIdMatch) {
      return `https://www.youtube.com/embed/${videoIdMatch[1]}`;
    }
    return url;
  };

  const commonProps = {
    style: {
      ...element.styles,
      left: element.position.x,
      top: element.position.y,
      position: 'absolute' as const,
      cursor: element.linkTo ? 'pointer' : 'grab',
      minWidth: '50px',
      minHeight: '30px',
      userSelect: 'none' as const
    },
    onClick: onElementClick
  };

  switch (element.type) {
    case 'text':
      return (
        <div {...commonProps}>
          {isEditing ? (
            <input
              ref={inputRef}
              value={element.content}
              onChange={(e) => onContentChange(e.target.value)}
              onBlur={() => onContentChange(element.content)}
              onKeyDown={(e) => e.key === 'Enter' && onContentChange(element.content)}
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
              onChange={(e) => onContentChange(e.target.value)}
              onBlur={() => onContentChange(element.content)}
              onKeyDown={(e) => e.key === 'Enter' && onContentChange(element.content)}
              className="border-none outline-none bg-transparent w-full text-inherit font-inherit"
            />
          ) : (
            element.content
          )}
        </h1>
      );

    case 'button':
      return (
        <button 
          {...commonProps} 
          style={{ 
            ...commonProps.style, 
            cursor: element.linkTo ? 'pointer' : 'grab'
          }}
        >
          {isEditing ? (
            <input
              ref={inputRef}
              value={element.content}
              onChange={(e) => onContentChange(e.target.value)}
              onBlur={() => onContentChange(element.content)}
              onKeyDown={(e) => e.key === 'Enter' && onContentChange(element.content)}
              className="border-none outline-none bg-transparent text-inherit font-inherit"
            />
          ) : (
            element.content
          )}
        </button>
      );

    case 'link':
      return (
        <a 
          {...commonProps} 
          href="#" 
          style={{ 
            ...commonProps.style, 
            cursor: element.linkTo ? 'pointer' : 'grab'
          }}
        >
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
            border: '1px dashed #ccc'
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
                onChange={(e) => onContentChange(e.target.value)}
                onBlur={() => onContentChange(element.content)}
                className="w-full h-20 border-none outline-none bg-transparent resize-none"
                autoFocus
              />
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
              onContentChange(newContent);
            }}
            styles={element.styles}
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
              onContentChange(newContent);
            }}
            styles={element.styles}
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
