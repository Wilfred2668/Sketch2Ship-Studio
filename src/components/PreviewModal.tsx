import React from 'react';
import { Element } from '../types/builder';
import { X } from 'lucide-react';

// Helper function to convert YouTube URL to embed URL
const getYouTubeEmbedUrl = (url: string) => {
  const videoIdMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
  if (videoIdMatch) {
    return `https://www.youtube.com/embed/${videoIdMatch[1]}`;
  }
  return url;
};

// Preview renders the elements as they would appear in a real website
const renderElement = (el: Element) => {
  // Use relative positioning for better layout control in preview
  const style = { 
    ...el.styles, 
    position: "absolute" as const, 
    left: el.position.x, 
    top: el.position.y,
    zIndex: 1
  };

  switch (el.type) {
    case 'text':
      return <span key={el.id} style={style}>{el.content}</span>;
    case 'heading':
      return <h2 key={el.id} style={style}>{el.content}</h2>;
    case 'button':
      return <button key={el.id} style={style}>{el.content}</button>;
    case 'link':
      return <a key={el.id} style={style} href={el.content || "#"} target="_blank" rel="noopener noreferrer">{el.content}</a>;
    case 'image':
      return el.content ? (
        <img key={el.id} src={el.content} alt="Preview" style={{ ...style, width: el.styles.width, height: el.styles.height, objectFit: 'cover' }} />
      ) : (
        <div key={el.id} style={{ ...style, width: el.styles.width || '200px', height: el.styles.height || '150px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          Image Placeholder
        </div>
      );
    case 'video':
      if (!el.content) {
        return (
          <div key={el.id} style={{ ...style, width: el.styles.width || '300px', height: el.styles.height || '200px', backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            Video Placeholder
          </div>
        );
      }
      
      const isYouTube = el.content.includes('youtube.com') || el.content.includes('youtu.be');
      return (
        <div key={el.id} style={{ ...style, width: el.styles.width || '300px', height: el.styles.height || '200px' }}>
          {isYouTube ? (
            <iframe
              src={getYouTubeEmbedUrl(el.content)}
              style={{ width: '100%', height: '100%' }}
              frameBorder="0"
              allowFullScreen
              title="YouTube video"
            />
          ) : (
            <video src={el.content} controls style={{ width: '100%', height: '100%' }} />
          )}
        </div>
      );
    case 'icon':
      return <span key={el.id} style={style}>{el.content}</span>;
    case 'slideshow':
      const images = el.content.split('\n').filter(img => img.trim());
      return (
        <div key={el.id} style={{ ...style, width: el.styles.width || '300px', height: el.styles.height || '200px' }} className="slideshow-container">
          {images.length > 0 ? (
            <img src={images[0]} alt="Slideshow" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              Slideshow
            </div>
          )}
        </div>
      );
    case 'accordion':
      const sections = el.content.split('\n').filter(section => section.trim()).map(section => {
        const [title, content] = section.split('|');
        return { title: title?.trim() || 'Section', content: content?.trim() || 'Content' };
      });
      return (
        <div key={el.id} style={{ ...style, width: el.styles.width || '300px', minHeight: '100px' }} className="accordion-container">
          {sections.map((section, index) => (
            <div key={index} style={{ borderBottom: index < sections.length - 1 ? '1px solid #e2e8f0' : 'none' }}>
              <div style={{ padding: '12px 16px', backgroundColor: '#f8fafc', fontWeight: '500', cursor: 'pointer' }}>
                {section.title}
              </div>
              <div style={{ padding: '12px 16px', backgroundColor: '#ffffff' }}>
                {section.content}
              </div>
            </div>
          ))}
        </div>
      );
    case 'navigation':
      const navItems = el.content.split('\n').filter(item => item.trim()).map(item => {
        const [label, url] = item.split('|');
        return { label: label?.trim() || 'Link', url: url?.trim() || '#' };
      });
      return (
        <nav key={el.id} style={{ ...style, width: el.styles.width || '100%', zIndex: 10 }} className="navigation-container">
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            padding: '12px 24px', 
            backgroundColor: el.styles.backgroundColor || '#ffffff', 
            borderBottom: '1px solid #e2e8f0',
            minHeight: '60px',
            width: '100%'
          }}>
            {navItems.map((item, index) => (
              <a
                key={index}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ 
                  marginRight: '32px', 
                  color: el.styles.color || '#374151', 
                  fontWeight: '500', 
                  textDecoration: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => (e.target as HTMLElement).style.backgroundColor = '#f3f4f6'}
                onMouseOut={(e) => (e.target as HTMLElement).style.backgroundColor = 'transparent'}
              >
                {item.label}
              </a>
            ))}
          </div>
        </nav>
      );
    case 'divider':
      return (
        <div key={el.id} style={style}>
          {el.content && <span style={{ fontSize: "12px", color: "#888" }}>{el.content}</span>}
          <hr style={{ width: el.styles.width || '200px', marginTop: 4, backgroundColor: el.styles.backgroundColor || '#ddd', height: '2px', border: 'none' }} />
        </div>
      );
    case 'spacer':
      return <div key={el.id} style={{ ...style, width: el.styles.width || '100px', height: el.styles.height || '50px' }}></div>;
    case 'card':
      return (
        <div key={el.id} style={{
          ...style,
          background: el.styles.backgroundColor || '#f8fafc',
          border: el.styles.border || '1px solid #d1d5db',
          borderRadius: el.styles.borderRadius || '8px',
          padding: el.styles.padding || '20px',
          minWidth: el.styles.width || '200px', 
          minHeight: el.styles.height || '100px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          {el.content}
        </div>
      );
    case 'list':
      return (
        <ul key={el.id} style={{ ...style, listStyleType: 'disc', paddingLeft: 20 }}>
          {el.content.split('\n').filter(item => item.trim()).map((item, index) => (
            <li key={index}>{item.trim()}</li>
          ))}
        </ul>
      );
    case 'quote':
      return (
        <blockquote key={el.id} style={{
          ...style,
          borderLeft: '4px solid #3b82f6',
          background: '#f9fafb',
          padding: 20,
          fontStyle: 'italic',
          margin: 0
        }}>
          "{el.content}"
        </blockquote>
      );
    default:
      return <div key={el.id} style={style}>{el.content}</div>;
  }
};

interface PreviewModalProps {
  elements: Element[];
  theme: 'light' | 'dark';
  onClose: () => void;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({ elements, theme, onClose }) => {
  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 transition-colors">
      <div className={`w-[98vw] h-[98vh] max-w-[1600px] max-h-[1000px] bg-white dark:bg-gray-900 rounded-lg shadow-2xl relative overflow-hidden transition-colors ${theme === 'dark' ? 'dark' : ''}`}>
        <button 
          className="absolute right-4 top-4 z-20 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white bg-white/80 dark:bg-gray-800/80 rounded-full p-2" 
          onClick={onClose}
        >
          <X className="w-6 h-6" />
        </button>
        <div 
          className="w-full h-full relative overflow-auto" 
          style={{
            background: theme === "dark" ? "#16171a" : "#fafafa",
            minHeight: '100%'
          }}
        >
          {elements.map(el => renderElement(el))}
        </div>
      </div>
    </div>
  );
};
