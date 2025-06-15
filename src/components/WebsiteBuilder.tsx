
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
      case 'link': return 'Link Text';
      case 'image': return '';
      case 'video': return '';
      case 'icon': return '⭐';
      case 'divider': return '';
      case 'spacer': return '';
      case 'card': return 'Card content goes here...';
      case 'list': return 'Item 1\nItem 2\nItem 3';
      case 'quote': return 'This is an inspiring quote that will motivate your visitors.';
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
      case 'link':
        return { ...base, color: '#007bff', textDecoration: 'underline', cursor: 'pointer' };
      case 'image':
        return { ...base, width: '200px', height: '150px' };
      case 'video':
        return { ...base, width: '320px', height: '180px', backgroundColor: '#000' };
      case 'icon':
        return { ...base, fontSize: '24px', textAlign: 'center' };
      case 'divider':
        return { ...base, backgroundColor: 'transparent', padding: '2px', border: 'none' };
      case 'spacer':
        return { ...base, backgroundColor: 'transparent', padding: '20px', border: 'none' };
      case 'card':
        return { ...base, backgroundColor: '#f8fafc', border: '1px solid #d1d5db', borderRadius: '10px', padding: '20px', minWidth: '160px', minHeight: '80px' };
      case 'list':
        return { ...base, padding: '16px' };
      case 'quote':
        return { ...base, fontStyle: 'italic', fontSize: '18px', padding: '20px', backgroundColor: '#f9fafb', borderLeft: '4px solid #3b82f6' };
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
      
      <div className="flex flex-1 h-[calc(100vh-64px)] w-full">
        {/* PAGES SIDEBAR */}
        <div className="w-64 bg-white dark:bg-[#181928] border-r border-gray-200 dark:border-gray-700 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Pages</span>
          </div>
          <PageSidebar
            pages={pages}
            currentPageId={currentPageId}
            setCurrentPageId={setCurrentPageId}
            addPage={addPage}
            deletePage={deletePage}
            renamePage={renamePage}
          />
        </div>

        {/* COMPONENT LIBRARY SIDEBAR */}
        <div className="w-64 bg-white dark:bg-[#191b23] border-r border-gray-200 dark:border-gray-700 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Components</span>
          </div>
          <ComponentLibrary onAddElement={addElement} />
        </div>

        {/* CANVAS AREA */}
        <main className="flex-1 min-w-0 bg-transparent">
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
        </main>

        {/* PROPERTIES PANEL */}
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
