
import React, { useState } from 'react';
import { ComponentLibrary } from './ComponentLibrary';
import { Canvas } from './Canvas';
import { ExportModal } from './ExportModal';
import { Header } from './Header';
import { Element } from '../types/builder';

export const WebsiteBuilder = () => {
  const [elements, setElements] = useState<Element[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);

  const addElement = (type: Element['type']) => {
    const newElement: Element = {
      id: `element-${Date.now()}`,
      type,
      content: getDefaultContent(type),
      styles: getDefaultStyles(type),
      position: { x: 50, y: 50 }
    };
    setElements([...elements, newElement]);
  };

  const updateElement = (id: string, updates: Partial<Element>) => {
    setElements(elements.map(el => 
      el.id === id ? { ...el, ...updates } : el
    ));
  };

  const deleteElement = (id: string) => {
    setElements(elements.filter(el => el.id !== id));
    setSelectedElement(null);
  };

  const getDefaultContent = (type: Element['type']): string => {
    switch (type) {
      case 'text': return 'Your text here';
      case 'heading': return 'Your Heading';
      case 'button': return 'Click Me';
      case 'image': return '';
      default: return '';
    }
  };

  const getDefaultStyles = (type: Element['type']) => {
    const base = {
      color: '#333333',
      backgroundColor: 'transparent',
      padding: '10px',
      borderRadius: '4px',
      border: 'none',
      fontSize: '16px',
      fontFamily: 'Arial, sans-serif'
    };

    switch (type) {
      case 'heading':
        return { ...base, fontSize: '32px', fontWeight: 'bold' };
      case 'button':
        return { 
          ...base, 
          backgroundColor: '#007bff', 
          color: 'white', 
          padding: '12px 24px',
          borderRadius: '6px',
          cursor: 'pointer'
        };
      case 'image':
        return { ...base, width: '200px', height: '150px' };
      default:
        return base;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header onExport={() => setShowExportModal(true)} />
      
      <div className="flex h-[calc(100vh-64px)]">
        <ComponentLibrary onAddElement={addElement} />
        
        <Canvas
          elements={elements}
          selectedElement={selectedElement}
          onSelectElement={setSelectedElement}
          onUpdateElement={updateElement}
          onDeleteElement={deleteElement}
        />
      </div>

      {showExportModal && (
        <ExportModal
          elements={elements}
          onClose={() => setShowExportModal(false)}
        />
      )}
    </div>
  );
};
