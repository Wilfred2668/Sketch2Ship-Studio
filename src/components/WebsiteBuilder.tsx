import React, { useState, useCallback, useEffect } from 'react';
import { ComponentLibrary } from './ComponentLibrary';
import { Canvas } from './Canvas';
import { Header } from './Header';
import { ExportModal } from './ExportModal';
import { Element } from '../types/builder';
import { PageSidebar } from './PageSidebar';
import { useUndoRedo } from '../hooks/useUndoRedo';
import { PropertiesPanel } from './PropertiesPanel';
import { PreviewModal } from './PreviewModal';
import { ImageGallery } from './ImageGallery';
import { PublicLinkGenerator } from './PublicLinkGenerator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { ArrowLeft, ChevronLeft, ChevronRight, Menu, X, Save } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useToast } from '../hooks/use-toast';

export interface Page {
  id: string;
  name: string;
  elements: Element[];
}

interface SavedProject {
  id: string;
  name: string;
  pages: Page[];
  currentPageId: string;
  createdAt: string;
  lastModified: string;
}

const DEFAULT_PAGE_NAME = "Home";

export const WebsiteBuilder = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  
  // Sidebar collapse states
  const [isPageSidebarCollapsed, setIsPageSidebarCollapsed] = useState(false);
  const [isComponentSidebarCollapsed, setIsComponentSidebarCollapsed] = useState(false);

  // Project state
  const [projectId, setProjectId] = useState<string>('');
  const [projectName, setProjectName] = useState('My Website Project');
  const [isSaving, setIsSaving] = useState(false);

  // Pages state
  const [pages, setPages] = useState<Page[]>([
    { id: `page-${Date.now()}`, name: DEFAULT_PAGE_NAME, elements: [] }
  ]);
  const [currentPageId, setCurrentPageId] = useState(pages[0].id);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Load project on component mount
  useEffect(() => {
    const projectIdFromUrl = searchParams.get('projectId');
    const projectNameFromUrl = searchParams.get('projectName');
    
    if (projectIdFromUrl) {
      // Load existing project
      loadProject(projectIdFromUrl);
    } else if (projectNameFromUrl) {
      // Create new project with given name
      const newProjectId = `project-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      setProjectId(newProjectId);
      setProjectName(projectNameFromUrl);
      const initialPageId = `page-${Date.now()}`;
      const initialPages = [{ id: initialPageId, name: DEFAULT_PAGE_NAME, elements: [] }];
      setPages(initialPages);
      setCurrentPageId(initialPageId);
    } else {
      // Create completely new project
      const newProjectId = `project-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      setProjectId(newProjectId);
    }
  }, [searchParams]);

  const loadProject = (projectIdToLoad: string) => {
    try {
      const savedProjects = JSON.parse(localStorage.getItem('websiteBuilderProjects') || '[]');
      const project = savedProjects.find((p: SavedProject) => p.id === projectIdToLoad);
      
      if (project) {
        setProjectId(project.id);
        setProjectName(project.name);
        setPages(project.pages);
        setCurrentPageId(project.currentPageId);
        console.log('Project loaded successfully:', project.name);
        toast({
          title: "Project Loaded",
          description: `"${project.name}" has been loaded successfully.`,
        });
      } else {
        console.log('Project not found, creating new one');
        const newProjectId = `project-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        setProjectId(newProjectId);
      }
    } catch (error) {
      console.error('Failed to load project:', error);
      toast({
        title: "Load Failed",
        description: "Failed to load the project. Starting with a new project.",
        variant: "destructive",
      });
    }
  };

  const { snapshots, saveSnapshot, undo, redo, canUndo, canRedo } = useUndoRedo(
    pages, setPages
  );

  // Get the currently active page and its elements
  const currentPageIndex = pages.findIndex(p => p.id === currentPageId);
  const elements = currentPageIndex !== -1 ? pages[currentPageIndex].elements : [];

  // Save project functionality
  const saveProject = async () => {
    if (!projectId) return;
    
    setIsSaving(true);
    try {
      const projectData: SavedProject = {
        id: projectId,
        name: projectName,
        pages,
        currentPageId,
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString()
      };

      // Save to localStorage
      const savedProjects = JSON.parse(localStorage.getItem('websiteBuilderProjects') || '[]');
      const existingProjectIndex = savedProjects.findIndex((p: SavedProject) => p.id === projectId);
      
      if (existingProjectIndex !== -1) {
        // Update existing project, keep original creation date
        savedProjects[existingProjectIndex] = { 
          ...projectData, 
          createdAt: savedProjects[existingProjectIndex].createdAt 
        };
      } else {
        // Add new project
        savedProjects.push(projectData);
      }
      
      localStorage.setItem('websiteBuilderProjects', JSON.stringify(savedProjects));
      
      console.log('Project saved successfully:', projectData);
      toast({
        title: "Project Saved",
        description: `"${projectName}" has been saved successfully.`,
      });
    } catch (error) {
      console.error('Save failed:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save the project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Auto-save every 30 seconds
  useEffect(() => {
    if (!projectId) return;
    
    const autoSaveInterval = setInterval(() => {
      saveProject();
    }, 30000); // 30 seconds

    return () => clearInterval(autoSaveInterval);
  }, [projectId, pages, currentPageId, projectName]);

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

  // Handle navigation for buttons and links
  const handleElementNavigation = (linkTo?: { type: 'page' | 'url'; value: string }) => {
    if (!linkTo) return;
    
    if (linkTo.type === 'page') {
      const targetPage = pages.find(p => p.id === linkTo.value);
      if (targetPage) {
        setCurrentPageId(linkTo.value);
        setSelectedElement(null);
      }
    } else if (linkTo.type === 'url') {
      window.open(linkTo.value, '_blank');
    }
  };

  // New state for image gallery and public links
  const [galleryImages, setGalleryImages] = useState<Array<{
    id: string;
    name: string;
    url: string;
    size: number;
    type: string;
  }>>([]);

  const [publicLinks, setPublicLinks] = useState<string[]>([]);

  // Handle image selection from gallery
  const handleImageSelect = (url: string) => {
    console.log('Image selected:', url);
    // You could implement logic here to automatically create an image element
    // or update the currently selected element if it's an image
  };

  // Handle public link generation
  const handlePublicLinkGenerate = (link: string) => {
    setPublicLinks(prev => [...prev, link]);
    console.log('Public link generated:', link);
  };

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
      case 'slideshow': return 'image1.jpg\nimage2.jpg\nimage3.jpg';
      case 'accordion': return 'Section 1|Content for section 1\nSection 2|Content for section 2\nSection 3|Content for section 3';
      case 'navigation': return 'Home|#\nAbout|#\nServices|#\nContact|#';
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
        return { ...base, fontSize: '24px', textAlign: 'center' as const };
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
      case 'slideshow':
        return { ...base, width: '400px', height: '300px', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1' };
      case 'accordion':
        return { ...base, width: '350px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px' };
      case 'navigation':
        return { ...base, width: '100%', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', padding: '0', borderRadius: '0' };
      default:
        return base;
    }
  }

  // Get selected element safely
  const selectedElementData = selectedElement ? elements.find(el => el.id === selectedElement) : null;

  return (
    <div className={`min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-100 dark:from-slate-900 dark:via-emerald-900/10 dark:to-cyan-900/10 flex flex-col transition-all duration-300 ${theme === 'dark' ? 'dark' : ''}`}>
      <Header 
        onExport={() => setShowExportModal(true)}
        theme={theme}
        onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        onPreview={() => setShowPreviewModal(true)}
      />
      
      <div className="flex items-center justify-between px-4 py-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-emerald-200/60 dark:border-emerald-700/60">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={saveProject}
            disabled={isSaving || !projectId}
            className="flex items-center gap-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-600 dark:text-emerald-400 dark:hover:bg-emerald-900/20"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save Project'}
          </Button>
        </div>
        
        <div className="text-sm font-medium text-slate-700 dark:text-slate-300 bg-emerald-100 dark:bg-emerald-800/30 px-3 py-1 rounded-full">
          <span className="hidden sm:inline">Project: </span>
          {projectName} - {pages.find(p => p.id === currentPageId)?.name || 'Unknown'}
        </div>
      </div>
      
      <div className="flex flex-1 h-[calc(100vh-140px)] w-full overflow-hidden">
        {/* PAGES SIDEBAR */}
        <div className={`${isPageSidebarCollapsed ? 'w-12' : 'w-64 lg:w-72'} bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-r border-emerald-200/60 dark:border-emerald-700/60 flex flex-col transition-all duration-300 shadow-lg`}>
          <div className="flex items-center justify-between p-3 border-b border-emerald-200/60 dark:border-emerald-700/60">
            {!isPageSidebarCollapsed && <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Pages</span>}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsPageSidebarCollapsed(!isPageSidebarCollapsed)}
              className="h-8 w-8 p-0"
            >
              {isPageSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </Button>
          </div>
          {!isPageSidebarCollapsed && (
            <PageSidebar
              pages={pages}
              currentPageId={currentPageId}
              setCurrentPageId={setCurrentPageId}
              addPage={addPage}
              deletePage={deletePage}
              renamePage={renamePage}
            />
          )}
        </div>

        {/* COMPONENT LIBRARY SIDEBAR WITH TABS */}
        <div className={`${isComponentSidebarCollapsed ? 'w-12' : 'w-80 lg:w-96'} bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-r border-emerald-200/60 dark:border-emerald-700/60 flex flex-col transition-all duration-300 shadow-lg`}>
          <div className="flex items-center justify-between p-3 border-b border-emerald-200/60 dark:border-emerald-700/60">
            {!isComponentSidebarCollapsed && (
              <Tabs defaultValue="components" className="flex flex-col h-full w-full">
                <TabsList className="grid w-full grid-cols-3 bg-emerald-100 dark:bg-emerald-800/30">
                  <TabsTrigger value="components" className="text-xs">Components</TabsTrigger>
                  <TabsTrigger value="gallery" className="text-xs">Gallery</TabsTrigger>
                  <TabsTrigger value="publish" className="text-xs">Publish</TabsTrigger>
                </TabsList>
              </Tabs>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsComponentSidebarCollapsed(!isComponentSidebarCollapsed)}
              className="h-8 w-8 p-0 shrink-0"
            >
              {isComponentSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </Button>
          </div>
          
          {!isComponentSidebarCollapsed && (
            <Tabs defaultValue="components" className="flex flex-col h-full">
              <TabsContent value="components" className="flex-1 overflow-auto">
                <ComponentLibrary onAddElement={addElement} />
              </TabsContent>
              
              <TabsContent value="gallery" className="flex-1 overflow-auto p-4">
                <ImageGallery
                  images={galleryImages}
                  onUpdate={setGalleryImages}
                  onSelectImage={handleImageSelect}
                />
              </TabsContent>
              
              <TabsContent value="publish" className="flex-1 overflow-auto p-4">
                <PublicLinkGenerator
                  elements={elements}
                  siteName={pages.find(p => p.id === currentPageId)?.name || 'My Website'}
                  onGenerateLink={handlePublicLinkGenerate}
                />
              </TabsContent>
            </Tabs>
          )}
        </div>

        {/* CANVAS AREA */}
        <main className="flex-1 min-w-0 bg-transparent overflow-hidden">
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
            onElementNavigation={handleElementNavigation}
          />
        </main>

        {/* PROPERTIES PANEL */}
        {selectedElement && selectedElementData && (
          <div className="w-80 lg:w-96 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-l border-emerald-200/60 dark:border-emerald-700/60 shadow-lg">
            <PropertiesPanel
              element={selectedElementData}
              onUpdate={updates => updateElement(selectedElement, updates)}
              onClose={() => setSelectedElement(null)}
              theme={theme}
              pages={pages}
              currentPageId={currentPageId}
            />
          </div>
        )}
      </div>

      {showExportModal && (
        <ExportModal
          pages={pages}
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
