
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
    <div className="flex-1 relative min-h-0 bg-gradient-to-br from-gray-50/50 to-gray-100/50 dark:from-gray-900/50 dark:to-gray-800/50">
      <div
        className="w-full h-full overflow-auto canvas-area"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20px 20px, rgba(99,102,241,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
        onClick={handleCanvasClick}
      >
        <div
          className="relative bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm mx-auto my-4 sm:my-8 shadow-2xl border border-gray-300/50 dark:border-gray-600/50 rounded-lg overflow-hidden transition-all"
          style={{
            width: Math.min(1200, window.innerWidth - 100),
            height: Math.min(800, window.innerHeight - 200),
            minWidth: "320px",
            minHeight: "480px"
          }}
        >
          {elements.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-4">
              <div className="text-center max-w-md">
                <div className="w-16 sm:w-24 h-16 sm:h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
                  <span className="text-2xl sm:text-4xl text-white">✨</span>
                </div>
                <h3 className="text-xl sm:text-3xl font-bold text-gray-700 dark:text-gray-300 mb-2 sm:mb-4">Start Building Your Website</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-lg">Drag components from the left panel to create your amazing website. Add text, images, buttons and more!</p>
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
          <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 flex gap-2 sm:gap-3 z-50">
            <button
              onClick={() => onDuplicateElement(selectedElement)}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-2 sm:p-3 rounded-full shadow-xl transition-all transform hover:scale-105"
              title="Duplicate Element"
            >
              <Copy className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() => onDeleteElement(selectedElement)}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white p-2 sm:p-3 rounded-full shadow-xl transition-all transform hover:scale-105"
              title="Delete Element"
            >
              <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        )}

        {/* Undo / Redo toolbar */}
        <div className="fixed bottom-4 sm:bottom-6 right-24 sm:right-32 flex gap-2 z-50">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className={`bg-white/90 dark:bg-gray-800/90 backdrop-blur-md hover:bg-gray-50/90 dark:hover:bg-gray-700/90 p-2 sm:p-3 rounded-full shadow-xl border border-gray-200/50 dark:border-gray-600/50 transition-all transform hover:scale-105 ${!canUndo ? 'opacity-30 cursor-not-allowed' : ''}`}
            title="Undo"
          >
            <Undo className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-gray-300" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className={`bg-white/90 dark:bg-gray-800/90 backdrop-blur-md hover:bg-gray-50/90 dark:hover:bg-gray-700/90 p-2 sm:p-3 rounded-full shadow-xl border border-gray-200/50 dark:border-gray-600/50 transition-all transform hover:scale-105 ${!canRedo ? 'opacity-30 cursor-not-allowed' : ''}`}
            title="Redo"
          >
            <Redo className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-gray-300" />
          </button>
        </div>
      </div>
    </div>
  );
};
