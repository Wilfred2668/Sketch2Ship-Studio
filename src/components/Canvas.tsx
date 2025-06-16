
import React from 'react';
import { Element } from '../types/builder';
import { DraggableElement } from './DraggableElement';
import { Trash2, Copy, Undo, Redo } from 'lucide-react';

interface CanvasProps {
  elements: Element[];
  selectedElement: string | null;
  onSelectElement: (id: string | null) => void;
  onUpdateElement: (id: string, updates: Partial<Element>) => void;
  onDeleteElement: (id: string) => void;
  onDuplicateElement: (id: string) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onElementNavigation?: (linkTo?: { type: 'page' | 'url'; value: string }) => void;
}

export const Canvas: React.FC<CanvasProps> = ({
  elements,
  selectedElement,
  onSelectElement,
  onUpdateElement,
  onDeleteElement,
  onDuplicateElement,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onElementNavigation,
}) => {
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onSelectElement(null);
    }
  };

  return (
    <div className="flex-1 relative min-h-0 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div
        className="w-full h-full overflow-auto canvas-area"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20px 20px, rgba(99,102,241,0.08) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
        onClick={handleCanvasClick}
      >
        <div
          className="relative bg-white dark:bg-slate-800 mx-auto my-4 lg:my-8 shadow-xl border border-slate-200 dark:border-slate-600 rounded-xl overflow-hidden transition-all duration-300"
          style={{
            width: 'min(1200px, calc(100vw - 2rem))',
            height: 'min(800px, calc(100vh - 200px))',
            minWidth: "300px",
            minHeight: "400px"
          }}
        >
          {elements.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-4">
              <div className="text-center max-w-md">
                <div className="w-16 h-16 lg:w-24 lg:h-24 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 lg:mb-6 shadow-lg">
                  <span className="text-2xl lg:text-4xl text-white">✨</span>
                </div>
                <h3 className="text-xl lg:text-3xl font-bold text-slate-700 dark:text-slate-300 mb-2 lg:mb-4">Start Building Your Website</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm lg:text-lg leading-relaxed">Drag components from the left panel to create your amazing website. Add text, images, buttons and more!</p>
              </div>
            </div>
          )}

          {elements.map((element) => (
            <DraggableElement
              key={element.id}
              element={element}
              isSelected={selectedElement === element.id}
              onSelect={() => onSelectElement(element.id)}
              onUpdate={(updates) => onUpdateElement(element.id, updates)}
              onDelete={() => onDeleteElement(element.id)}
              onDuplicate={() => onDuplicateElement(element.id)}
              onNavigation={onElementNavigation}
            />
          ))}
        </div>

        {/* Selected element toolbar */}
        {selectedElement && (
          <div className="fixed bottom-6 right-6 flex gap-2 z-50">
            <button
              onClick={() => onDuplicateElement(selectedElement)}
              className="bg-blue-500 hover:bg-blue-600 text-white p-2 lg:p-3 rounded-full shadow-xl transition-all transform hover:scale-105 border border-blue-400"
              title="Duplicate Element"
            >
              <Copy className="w-4 h-4 lg:w-5 lg:h-5" />
            </button>
            <button
              onClick={() => onDeleteElement(selectedElement)}
              className="bg-red-500 hover:bg-red-600 text-white p-2 lg:p-3 rounded-full shadow-xl transition-all transform hover:scale-105 border border-red-400"
              title="Delete Element"
            >
              <Trash2 className="w-4 h-4 lg:w-5 lg:h-5" />
            </button>
          </div>
        )}

        {/* Undo / Redo toolbar */}
        <div className="fixed bottom-6 right-32 lg:right-36 flex gap-2 z-50">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className={`bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-800 p-2 lg:p-3 rounded-full shadow-xl border border-slate-200 dark:border-slate-600 transition-all transform hover:scale-105 ${!canUndo ? 'opacity-30 cursor-not-allowed' : ''}`}
            title="Undo"
          >
            <Undo className="w-4 h-4 lg:w-5 lg:h-5 text-slate-700 dark:text-slate-300" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className={`bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-800 p-2 lg:p-3 rounded-full shadow-xl border border-slate-200 dark:border-slate-600 transition-all transform hover:scale-105 ${!canRedo ? 'opacity-30 cursor-not-allowed' : ''}`}
            title="Redo"
          >
            <Redo className="w-4 h-4 lg:w-5 lg:h-5 text-slate-700 dark:text-slate-300" />
          </button>
        </div>
      </div>
    </div>
  );
};
