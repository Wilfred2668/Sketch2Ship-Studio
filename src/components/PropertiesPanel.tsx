
import React from 'react';
import { Element } from '../types/builder';
import { X } from 'lucide-react';

interface PropertiesPanelProps {
  element: Element;
  onUpdate: (updates: Partial<Element>) => void;
  onClose: () => void;
  theme: 'light' | 'dark';
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  element,
  onUpdate,
  onClose,
  theme
}) => {
  // Basic property controls
  return (
    <aside className={`w-80 fixed top-16 right-0 h-[calc(100vh-64px)] bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 z-50 shadow-lg flex flex-col transition-colors ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <h3 className="font-bold text-lg text-gray-900 dark:text-white capitalize">{element.type}</h3>
        <button onClick={onClose} className="bg-transparent hover:bg-gray-200 dark:hover:bg-gray-800 p-1 rounded">
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>
      <div className="p-4 flex-1 space-y-4 overflow-auto">
        <div>
          <label className="text-xs text-gray-700 dark:text-gray-200 block mb-1">Content</label>
          {element.type === 'card' ? (
            <textarea
              className="border rounded w-full p-2 bg-background"
              value={element.content}
              onChange={e => onUpdate({ content: e.target.value })}
              rows={4}
            />
          ) : element.type === 'image' ? (
            <input
              className="border rounded w-full p-2 bg-background"
              value={element.content}
              onChange={e => onUpdate({ content: e.target.value })}
              placeholder="Image URL or path"
            />
          ) : (
            <input
              className="border rounded w-full p-2 bg-background"
              value={element.content}
              onChange={e => onUpdate({ content: e.target.value })}
            />
          )}
        </div>
        <div>
          <label className="text-xs text-gray-700 dark:text-gray-200 block mb-1">Text Color</label>
          <input
            className="border rounded w-full p-2 bg-background"
            value={element.styles.color || ''}
            onChange={e => onUpdate({ styles: { ...element.styles, color: e.target.value } })}
            placeholder="#333333"
          />
        </div>
        <div>
          <label className="text-xs text-gray-700 dark:text-gray-200 block mb-1">Background</label>
          <input
            className="border rounded w-full p-2 bg-background"
            value={element.styles.backgroundColor || ''}
            onChange={e => onUpdate({ styles: { ...element.styles, backgroundColor: e.target.value } })}
            placeholder="#fafafa"
          />
        </div>
        <div>
          <label className="text-xs text-gray-700 dark:text-gray-200 block mb-1">Font Size</label>
          <input
            className="border rounded w-full p-2 bg-background"
            value={element.styles.fontSize || ''}
            onChange={e => onUpdate({ styles: { ...element.styles, fontSize: e.target.value } })}
            placeholder="16px"
          />
        </div>
        <div>
          <label className="text-xs text-gray-700 dark:text-gray-200 block mb-1">Padding</label>
          <input
            className="border rounded w-full p-2 bg-background"
            value={element.styles.padding || ''}
            onChange={e => onUpdate({ styles: { ...element.styles, padding: e.target.value } })}
            placeholder="12px"
          />
        </div>
        {/* Add any more property controls as needed */}
      </div>
    </aside>
  );
};
