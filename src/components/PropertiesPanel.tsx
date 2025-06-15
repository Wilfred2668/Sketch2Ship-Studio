
import React from 'react';
import { Element } from '../types/builder';
import { X, Plus, Trash2, Upload } from 'lucide-react';
import { Button } from './ui/button';

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
  // Helper functions for slideshow
  const addImage = () => {
    const images = element.content ? element.content.split('\n').filter(Boolean) : [];
    const newImages = [...images, 'https://via.placeholder.com/400x300'];
    onUpdate({ content: newImages.join('\n') });
  };

  const deleteImage = (index: number) => {
    const images = element.content ? element.content.split('\n').filter(Boolean) : [];
    const newImages = images.filter((_, i) => i !== index);
    onUpdate({ content: newImages.join('\n') });
  };

  const updateImage = (index: number, url: string) => {
    const images = element.content ? element.content.split('\n').filter(Boolean) : [];
    const newImages = images.map((img, i) => i === index ? url : img);
    onUpdate({ content: newImages.join('\n') });
  };

  // Helper functions for accordion
  const addSection = () => {
    const sections = element.content ? element.content.split('\n').filter(Boolean) : [];
    const newSections = [...sections, 'New Section|New content'];
    onUpdate({ content: newSections.join('\n') });
  };

  const deleteSection = (index: number) => {
    const sections = element.content ? element.content.split('\n').filter(Boolean) : [];
    const newSections = sections.filter((_, i) => i !== index);
    onUpdate({ content: newSections.join('\n') });
  };

  const updateSection = (index: number, field: 'title' | 'content', value: string) => {
    const sections = element.content ? element.content.split('\n').filter(Boolean) : [];
    const newSections = sections.map((section, i) => {
      if (i === index) {
        const [title, content] = section.split('|');
        return field === 'title' ? `${value}|${content || ''}` : `${title || ''}|${value}`;
      }
      return section;
    });
    onUpdate({ content: newSections.join('\n') });
  };

  // Helper functions for navigation
  const addNavItem = () => {
    const items = element.content ? element.content.split('\n').filter(Boolean) : [];
    const newItems = [...items, 'New Link|#'];
    onUpdate({ content: newItems.join('\n') });
  };

  const deleteNavItem = (index: number) => {
    const items = element.content ? element.content.split('\n').filter(Boolean) : [];
    const newItems = items.filter((_, i) => i !== index);
    onUpdate({ content: newItems.join('\n') });
  };

  const updateNavItem = (index: number, field: 'label' | 'url', value: string) => {
    const items = element.content ? element.content.split('\n').filter(Boolean) : [];
    const newItems = items.map((item, i) => {
      if (i === index) {
        const [label, url] = item.split('|');
        return field === 'label' ? `${value}|${url || ''}` : `${label || ''}|${value}`;
      }
      return item;
    });
    onUpdate({ content: newItems.join('\n') });
  };

  const renderContentEditor = () => {
    if (element.type === 'slideshow') {
      const images = element.content ? element.content.split('\n').filter(Boolean) : [];
      
      return (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-xs text-gray-700 dark:text-gray-200 block">Slideshow Images</label>
            <Button size="sm" onClick={addImage} className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white">
              <Plus className="w-3 h-3" />
              Add Image
            </Button>
          </div>
          
          {images.map((image, index) => (
            <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-3 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Image {index + 1}</span>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteImage(index)}
                  className="flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
              
              <div className="space-y-2">
                <input
                  type="text"
                  value={image}
                  onChange={(e) => updateImage(index, e.target.value)}
                  placeholder="Image URL"
                  className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-background"
                />
                <div className="w-full h-16 bg-gray-100 dark:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-600 rounded flex items-center justify-center overflow-hidden">
                  {image ? (
                    <img src={image} alt={`Slide ${index + 1}`} className="h-full object-cover" />
                  ) : (
                    <Upload className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (element.type === 'accordion') {
      const sections = element.content ? element.content.split('\n').filter(Boolean) : [];
      
      return (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-xs text-gray-700 dark:text-gray-200 block">Accordion Sections</label>
            <Button size="sm" onClick={addSection} className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white">
              <Plus className="w-3 h-3" />
              Add Section
            </Button>
          </div>
          
          {sections.map((section, index) => {
            const [title, content] = section.split('|');
            return (
              <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-3 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Section {index + 1}</span>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteSection(index)}
                    className="flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
                
                <input
                  type="text"
                  value={title || ''}
                  onChange={(e) => updateSection(index, 'title', e.target.value)}
                  placeholder="Section title"
                  className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-background"
                />
                
                <textarea
                  value={content || ''}
                  onChange={(e) => updateSection(index, 'content', e.target.value)}
                  placeholder="Section content"
                  rows={2}
                  className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded resize-none bg-background"
                />
              </div>
            );
          })}
        </div>
      );
    }

    if (element.type === 'navigation') {
      const items = element.content ? element.content.split('\n').filter(Boolean) : [];
      
      return (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-xs text-gray-700 dark:text-gray-200 block">Navigation Items</label>
            <Button size="sm" onClick={addNavItem} className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white">
              <Plus className="w-3 h-3" />
              Add Link
            </Button>
          </div>
          
          {items.map((item, index) => {
            const [label, url] = item.split('|');
            return (
              <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-3 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Link {index + 1}</span>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteNavItem(index)}
                    className="flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
                
                <input
                  type="text"
                  value={label || ''}
                  onChange={(e) => updateNavItem(index, 'label', e.target.value)}
                  placeholder="Link text"
                  className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-background"
                />
                
                <input
                  type="text"
                  value={url || ''}
                  onChange={(e) => updateNavItem(index, 'url', e.target.value)}
                  placeholder="URL (e.g., #home, /about)"
                  className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-background"
                />
              </div>
            );
          })}
        </div>
      );
    }

    // Default content editor for other elements
    return (
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
    );
  };

  return (
    <aside className={`w-80 fixed top-16 right-0 h-[calc(100vh-64px)] bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 z-50 shadow-lg flex flex-col transition-colors ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <h3 className="font-bold text-lg text-gray-900 dark:text-white capitalize">{element.type}</h3>
        <button onClick={onClose} className="bg-transparent hover:bg-gray-200 dark:hover:bg-gray-800 p-1 rounded">
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>
      <div className="p-4 flex-1 space-y-4 overflow-auto">
        {renderContentEditor()}
        
        {!['slideshow', 'accordion', 'navigation'].includes(element.type) && (
          <>
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
          </>
        )}
      </div>
    </aside>
  );
};
