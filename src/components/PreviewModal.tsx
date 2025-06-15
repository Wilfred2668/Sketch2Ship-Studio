
import React from 'react';
import { Element } from '../types/builder';
import { X } from 'lucide-react';

// Preview just renders the elements as static for now:
const renderElement = (el: Element) => {
  const style = { ...el.styles, position: 'absolute', left: el.position.x, top: el.position.y };
  switch (el.type) {
    case 'text':
      return <span key={el.id} style={style}>{el.content}</span>;
    case 'heading':
      return <h2 key={el.id} style={style}>{el.content}</h2>;
    case 'button':
      return <button key={el.id} style={style}>{el.content}</button>;
    case 'image':
      return (
        <img key={el.id} src={el.content} alt="Preview" style={{ ...style, width: el.styles.width, height: el.styles.height, objectFit: 'cover' }} />
      );
    case 'divider':
      return (
        <div key={el.id} style={style}>
          {el.content && <span style={{ fontSize: "12px", color: "#888" }}>{el.content}</span>}
          <hr style={{ width: 128, marginTop: 4 }} />
        </div>
      );
    case 'card':
      return (
        <div key={el.id} style={{
          ...style,
          background: el.styles.backgroundColor || '#f8fafc',
          border: el.styles.border || '1px solid #d1d5db',
          borderRadius: el.styles.borderRadius || 10,
          padding: el.styles.padding || 20,
          minWidth: 160, minHeight: 80,
        }}>
          {el.content}
        </div>
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
      <div className={`w-[1200px] h-[900px] bg-white dark:bg-gray-900 rounded-lg shadow-2xl relative overflow-hidden transition-colors ${theme === 'dark' ? 'dark' : ''}`}>
        <button className="absolute right-4 top-4 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white" onClick={onClose}>
          <X className="w-7 h-7" />
        </button>
        <div className="w-full h-full relative overflow-auto" style={{
            background: theme === "dark" ? "#16171a" : "#fafafa"
        }}>
          {elements.map(el => renderElement(el))}
        </div>
      </div>
    </div>
  );
};
