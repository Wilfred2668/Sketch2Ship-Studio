import React, { useState, useCallback } from 'react';
import { ComponentLibrary } from './ComponentLibrary';
import { Canvas } from './Canvas';
import { Header } from './Header';
import { ExportModal } from './ExportModal';
import { Element } from '../types/builder';
import { PageSidebar } from './PageSidebar';
import { useUndoRedo } from '../hooks/useUndoRedo';
import { PropertiesPanel } from './PropertiesPanel';
import { PreviewModal } from './PreviewModal';

export interface Page {
  id: string;
  name: string;
  elements: Element[];
}

const DEFAULT_PAGE_NAME = "Home";

export const WebsiteBuilder = () => {
  // Pages state
  const [pages, setPages] = useState<Page[]>([
    { id: `page-${Date.now()}`, name: DEFAULT_PAGE_NAME, elements: [] }
  ]);
  const [currentPageId, setCurrentPageId] = useState(pages[0].id);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const { snapshots, saveSnapshot, undo, redo, canUndo, canRedo } = useUndoRedo(
    pages, setPages
  );

  // Get the currently active page and its elements
  const currentPageIndex = pages.findIndex(p => p.id === currentPageId);
  const elements = currentPageIndex !== -1 ? pages[currentPageIndex].elements : [];

  // Utilities to update elements on the current page only
  const setElementsForPage = useCallback((newElements: Element[]) => {
    setPages((prev) =>
      prev.map((p, idx) =>
        idx === currentPageIndex ? { ...p, elements: newElements } : p
      )
    );
  }, [currentPageIndex]);

  const addElement = (type: Element['type']) => {
    const newElement: Element = {
      id: `element-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      type,
      content: getDefaultContent(type),
      styles: getDefaultStyles(type),
      position: { x: 50, y: 50 }
    };
    saveSnapshot();
    setElementsForPage([...elements, newElement]);
    setSelectedElement(newElement.id);
  };

  const updateElement = (id: string, updates: Partial<Element>) => {
    saveSnapshot();
    setElementsForPage(elements.map(el =>
      el.id === id ? { ...el, ...updates } : el
    ));
  };

  const deleteElement = (id: string) => {
    saveSnapshot();
    setElementsForPage(elements.filter(el => el.id !== id));
    setSelectedElement(null);
  };

  const duplicateElement = (id: string) => {
    const el = elements.find(e => e.id === id);
    if (!el) return;
    const clone: Element = {
      ...el,
      id: `element-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      position: { ...el.position, x: el.position.x + 30, y: el.position.y + 30 }
    };
    saveSnapshot();
    setElementsForPage([...elements, clone]);
    setSelectedElement(clone.id);
  };

  // Page operations
  const addPage = () => {
    const pageName = `Page ${pages.length + 1}`;
    const newPage: Page = {
      id: `page-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: pageName,
      elements: []
    };
    setPages(prev => [...prev, newPage]);
    setCurrentPageId(newPage.id);
    setSelectedElement(null);
  };

  const deletePage = (deleteId: string) => {
    if (pages.length === 1) return;
    const filtered = pages.filter(p => p.id !== deleteId);
    setPages(filtered);
    // Set active to the first page or previous one
    setCurrentPageId(filtered[0].id);
    setSelectedElement(null);
  };

  const renamePage = (renameId: string, name: string) => {
    setPages(pages => pages.map(p => p.id === renameId ? { ...p, name } : p));
  };

  function getDefaultContent(type: Element['type']): string {
    switch (type) {
      case 'text': return 'Your text here';
      case 'heading': return 'Your Heading';
      case 'button': return 'Click Me';
      case 'image': return '';
      case 'divider': return '';
      case 'card': return 'Card content goes here...';
      default: return '';
    }
  }

  function getDefaultStyles(type: Element['type']) {
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
      case 'divider':
        return { ...base, backgroundColor: 'transparent', padding: '2px', border: 'none' };
      case 'card':
        return { ...base, backgroundColor: '#f8fafc', border: '1px solid #d1d5db', borderRadius: '10px', padding: '20px', minWidth: '160px', minHeight: '80px' };
      default:
        return base;
    }
  }

  // Apply theme to body and root container
  React.useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#16171a] dark:to-[#101215] flex flex-col transition-colors ${theme === 'dark' ? 'dark' : ''}`}>
      <Header 
        onExport={() => setShowExportModal(true)}
        theme={theme}
        onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        onPreview={() => setShowPreviewModal(true)}
      />
      <div className="flex flex-1 h-[calc(100vh-64px)]">
        <PageSidebar
          pages={pages}
          currentPageId={currentPageId}
          setCurrentPageId={setCurrentPageId}
          addPage={addPage}
          deletePage={deletePage}
          renamePage={renamePage}
        />
        <ComponentLibrary onAddElement={addElement} />

        <Canvas
          elements={elements}
          selectedElement={selectedElement}
          onSelectElement={setSelectedElement}
          onUpdateElement={updateElement}
          onDeleteElement={deleteElement}
          onDuplicateElement={duplicateElement}
          onUndo={undo}
          onRedo={redo}
          canUndo={canUndo}
          canRedo={canRedo}
        />

        {/* Properties Panel */}
        {selectedElement && (
          <PropertiesPanel
            element={elements.find(el => el.id === selectedElement)!}
            onUpdate={updates => updateElement(selectedElement, updates)}
            onClose={() => setSelectedElement(null)}
            theme={theme}
          />
        )}
      </div>
      {showExportModal && (
        <ExportModal
          elements={elements}
          onClose={() => setShowExportModal(false)}
        />
      )}
      {showPreviewModal && (
        <PreviewModal
          elements={elements}
          theme={theme}
          onClose={() => setShowPreviewModal(false)}
        />
      )}
    </div>
  );
};
