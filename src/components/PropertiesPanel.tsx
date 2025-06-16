import React from 'react';
import { Element } from '../types/builder';
import { X, Plus, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { MediaUpload } from './MediaUpload';
import { PageSelector } from './PageSelector';
import type { Page } from './WebsiteBuilder';

interface PropertiesPanelProps {
  element: Element;
  onUpdate: (updates: Partial<Element>) => void;
  onClose: () => void;
  theme: 'light' | 'dark';
  pages: Page[];
  currentPageId: string;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  element,
  onUpdate,
  onClose,
  theme,
  pages,
  currentPageId
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
    if (element.type === 'image') {
      return (
        <MediaUpload
          type="image"
          value={element.content}
          onChange={(url) => onUpdate({ content: url })}
          placeholder="Enter image URL or upload"
        />
      );
    }

    if (element.type === 'video') {
      return (
        <MediaUpload
          type="video"
          value={element.content}
          onChange={(url) => onUpdate({ content: url })}
          placeholder="Enter video URL, YouTube link, or upload"
        />
      );
    }

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
              
              <MediaUpload
                type="image"
                value={image}
                onChange={(url) => updateImage(index, url)}
                placeholder="Image URL"
              />
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
                
                <PageSelector
                  pages={pages}
                  currentPageId={currentPageId}
                  selectedValue={url ? { type: url.startsWith('#') || url.startsWith('/') || url.includes('://') ? 'url' : 'page', value: url } : undefined}
                  onSelect={(linkTo) => updateNavItem(index, 'url', linkTo.value)}
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

  const renderStyleControls = () => {
    return (
      <div className="space-y-4">
        {/* Text Color */}
        <div>
          <label className="text-xs text-gray-700 dark:text-gray-200 block mb-1">Text Color</label>
          <div className="flex gap-2">
            <input
              type="color"
              className="w-12 h-8 border rounded cursor-pointer"
              value={element.styles.color || '#000000'}
              onChange={e => onUpdate({ styles: { ...element.styles, color: e.target.value } })}
            />
            <input
              className="border rounded flex-1 p-2 bg-background text-sm"
              value={element.styles.color || ''}
              onChange={e => onUpdate({ styles: { ...element.styles, color: e.target.value } })}
              placeholder="#333333 or rgb(51,51,51)"
            />
          </div>
        </div>

        {/* Background Color */}
        <div>
          <label className="text-xs text-gray-700 dark:text-gray-200 block mb-1">Background Color</label>
          <div className="flex gap-2">
            <input
              type="color"
              className="w-12 h-8 border rounded cursor-pointer"
              value={element.styles.backgroundColor || '#ffffff'}
              onChange={e => onUpdate({ styles: { ...element.styles, backgroundColor: e.target.value } })}
            />
            <input
              className="border rounded flex-1 p-2 bg-background text-sm"
              value={element.styles.backgroundColor || ''}
              onChange={e => onUpdate({ styles: { ...element.styles, backgroundColor: e.target.value } })}
              placeholder="#fafafa or transparent"
            />
          </div>
        </div>

        {/* Font Size */}
        <div>
          <label className="text-xs text-gray-700 dark:text-gray-200 block mb-1">Font Size</label>
          <div className="flex gap-2">
            <input
              type="range"
              min="8"
              max="72"
              className="flex-1"
              value={parseInt(element.styles.fontSize?.replace('px', '') || '16')}
              onChange={e => onUpdate({ styles: { ...element.styles, fontSize: e.target.value + 'px' } })}
            />
            <input
              className="border rounded w-20 p-2 bg-background text-sm"
              value={element.styles.fontSize || ''}
              onChange={e => onUpdate({ styles: { ...element.styles, fontSize: e.target.value } })}
              placeholder="16px"
            />
          </div>
        </div>

        {/* Font Family */}
        <div>
          <label className="text-xs text-gray-700 dark:text-gray-200 block mb-1">Font Family</label>
          <select
            className="border rounded w-full p-2 bg-background text-sm"
            value={element.styles.fontFamily || ''}
            onChange={e => onUpdate({ styles: { ...element.styles, fontFamily: e.target.value } })}
          >
            <option value="">Default</option>
            <option value="Arial, sans-serif">Arial</option>
            <option value="Georgia, serif">Georgia</option>
            <option value="Times New Roman, serif">Times New Roman</option>
            <option value="Courier New, monospace">Courier New</option>
            <option value="Helvetica, sans-serif">Helvetica</option>
            <option value="Verdana, sans-serif">Verdana</option>
            <option value="Inter, sans-serif">Inter</option>
            <option value="Roboto, sans-serif">Roboto</option>
          </select>
        </div>

        {/* Font Weight */}
        <div>
          <label className="text-xs text-gray-700 dark:text-gray-200 block mb-1">Font Weight</label>
          <select
            className="border rounded w-full p-2 bg-background text-sm"
            value={element.styles.fontWeight || ''}
            onChange={e => onUpdate({ styles: { ...element.styles, fontWeight: e.target.value } })}
          >
            <option value="">Normal</option>
            <option value="300">Light</option>
            <option value="400">Normal</option>
            <option value="500">Medium</option>
            <option value="600">Semi Bold</option>
            <option value="700">Bold</option>
            <option value="800">Extra Bold</option>
          </select>
        </div>

        {/* Text Alignment */}
        <div>
          <label className="text-xs text-gray-700 dark:text-gray-200 block mb-1">Text Alignment</label>
          <div className="flex gap-1">
            {['left', 'center', 'right', 'justify'].map(align => (
              <button
                key={align}
                className={`px-3 py-1 text-xs border rounded ${
                  element.styles.textAlign === align 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => onUpdate({ styles: { ...element.styles, textAlign: align as any } })}
              >
                {align}
              </button>
            ))}
          </div>
        </div>

        {/* Padding */}
        <div>
          <label className="text-xs text-gray-700 dark:text-gray-200 block mb-1">Padding</label>
          <input
            className="border rounded w-full p-2 bg-background text-sm"
            value={element.styles.padding || ''}
            onChange={e => onUpdate({ styles: { ...element.styles, padding: e.target.value } })}
            placeholder="12px or 10px 15px"
          />
        </div>

        {/* Margin */}
        <div>
          <label className="text-xs text-gray-700 dark:text-gray-200 block mb-1">Margin</label>
          <input
            className="border rounded w-full p-2 bg-background text-sm"
            value={element.styles.margin || ''}
            onChange={e => onUpdate({ styles: { ...element.styles, margin: e.target.value } })}
            placeholder="10px or 5px 10px"
          />
        </div>

        {/* Border */}
        <div>
          <label className="text-xs text-gray-700 dark:text-gray-200 block mb-1">Border</label>
          <input
            className="border rounded w-full p-2 bg-background text-sm"
            value={element.styles.border || ''}
            onChange={e => onUpdate({ styles: { ...element.styles, border: e.target.value } })}
            placeholder="1px solid #ccc"
          />
        </div>

        {/* Border Radius */}
        <div>
          <label className="text-xs text-gray-700 dark:text-gray-200 block mb-1">Border Radius</label>
          <div className="flex gap-2">
            <input
              type="range"
              min="0"
              max="50"
              className="flex-1"
              value={parseInt(element.styles.borderRadius?.replace('px', '') || '0')}
              onChange={e => onUpdate({ styles: { ...element.styles, borderRadius: e.target.value + 'px' } })}
            />
            <input
              className="border rounded w-20 p-2 bg-background text-sm"
              value={element.styles.borderRadius || ''}
              onChange={e => onUpdate({ styles: { ...element.styles, borderRadius: e.target.value } })}
              placeholder="4px"
            />
          </div>
        </div>

        {/* Width */}
        {['image', 'video', 'card', 'slideshow', 'divider', 'spacer', 'list', 'quote', 'navigation', 'accordion'].includes(element.type) && (
          <div>
            <label className="text-xs text-gray-700 dark:text-gray-200 block mb-1">Width</label>
            <input
              className="border rounded w-full p-2 bg-background text-sm"
              value={element.styles.width || ''}
              onChange={e => onUpdate({ styles: { ...element.styles, width: e.target.value } })}
              placeholder="300px or 100%"
            />
          </div>
        )}

        {/* Height */}
        {['image', 'video', 'card', 'slideshow', 'spacer', 'list', 'quote', 'accordion'].includes(element.type) && (
          <div>
            <label className="text-xs text-gray-700 dark:text-gray-200 block mb-1">Height</label>
            <input
              className="border rounded w-full p-2 bg-background text-sm"
              value={element.styles.height || ''}
              onChange={e => onUpdate({ styles: { ...element.styles, height: e.target.value } })}
              placeholder="200px or auto"
            />
          </div>
        )}

        {/* Text Decoration */}
        {['text', 'heading', 'link', 'button'].includes(element.type) && (
          <div>
            <label className="text-xs text-gray-700 dark:text-gray-200 block mb-1">Text Decoration</label>
            <select
              className="border rounded w-full p-2 bg-background text-sm"
              value={element.styles.textDecoration || ''}
              onChange={e => onUpdate({ styles: { ...element.styles, textDecoration: e.target.value } })}
            >
              <option value="">None</option>
              <option value="underline">Underline</option>
              <option value="line-through">Strikethrough</option>
              <option value="overline">Overline</option>
            </select>
          </div>
        )}

        {/* Cursor */}
        {['button', 'link'].includes(element.type) && (
          <div>
            <label className="text-xs text-gray-700 dark:text-gray-200 block mb-1">Cursor</label>
            <select
              className="border rounded w-full p-2 bg-background text-sm"
              value={element.styles.cursor || ''}
              onChange={e => onUpdate({ styles: { ...element.styles, cursor: e.target.value } })}
            >
              <option value="">Default</option>
              <option value="pointer">Pointer</option>
              <option value="not-allowed">Not Allowed</option>
              <option value="wait">Wait</option>
              <option value="text">Text</option>
            </select>
          </div>
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
      <div className="p-4 flex-1 space-y-6 overflow-auto">
        {/* Content Editor */}
        <div>
          <h4 className="font-medium text-sm text-gray-900 dark:text-white mb-3">Content</h4>
          {renderContentEditor()}
        </div>

        {/* Link Settings for buttons and links */}
        {(['button', 'link'].includes(element.type)) && (
          <div>
            <h4 className="font-medium text-sm text-gray-900 dark:text-white mb-3">Link Settings</h4>
            <PageSelector
              pages={pages}
              currentPageId={currentPageId}
              selectedValue={element.linkTo}
              onSelect={(linkTo) => onUpdate({ linkTo })}
            />
          </div>
        )}
        
        {/* Style Controls */}
        <div>
          <h4 className="font-medium text-sm text-gray-900 dark:text-white mb-3">Styling</h4>
          {renderStyleControls()}
        </div>
      </div>
    </aside>
  );
};
