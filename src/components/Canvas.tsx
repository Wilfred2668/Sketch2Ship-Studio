
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
}) => {
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onSelectElement(null);
    }
  };

  return (
    <div className="flex-1 relative min-h-0">
      <div
        className="w-full h-full overflow-auto canvas-area bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800"
        style={{
          backgroundImage: `
            radial-gradient(circle at 25px 25px, rgba(99,102,241,0.1) 2px, transparent 2px),
            radial-gradient(circle at 75px 75px, rgba(99,102,241,0.1) 2px, transparent 2px)
          `,
          backgroundSize: '100px 100px'
        }}
        onClick={handleCanvasClick}
      >
        <div
          className="relative shadow-xl bg-white dark:bg-gray-900 mx-auto my-8 rounded-lg border border-gray-200 dark:border-gray-700"
          style={{
            width: 1200,
            height: 800,
            minWidth: "1200px",
            minHeight: "800px"
          }}
        >
          {elements.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <span className="text-3xl text-white">✨</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-3">Start Building Your Website</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">Drag components from the left panel to create your amazing website. Add text, images, buttons and more!</p>
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
            />
          ))}
        </div>

        {/* Selected element toolbar */}
        {selectedElement && (
          <div className="fixed bottom-6 right-6 flex gap-3 z-50">
            <button
              onClick={() => onDuplicateElement(selectedElement)}
              className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-xl transition-all transform hover:scale-105"
              title="Duplicate Element"
            >
              <Copy className="w-5 h-5" />
            </button>
            <button
              onClick={() => onDeleteElement(selectedElement)}
              className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-xl transition-all transform hover:scale-105"
              title="Delete Element"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Undo / Redo toolbar */}
        <div className="fixed bottom-6 right-32 flex gap-2 z-50">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className={`bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 p-3 rounded-full shadow-xl border border-gray-200 dark:border-gray-600 transition-all transform hover:scale-105 ${!canUndo ? 'opacity-30 cursor-not-allowed' : ''}`}
            title="Undo"
          >
            <Undo className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className={`bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 p-3 rounded-full shadow-xl border border-gray-200 dark:border-gray-600 transition-all transform hover:scale-105 ${!canRedo ? 'opacity-30 cursor-not-allowed' : ''}`}
            title="Redo"
          >
            <Redo className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
        </div>
      </div>
    </div>
  );
};
