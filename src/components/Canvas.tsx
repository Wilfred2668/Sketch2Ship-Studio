
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
        className="w-full h-full overflow-auto canvas-area"
        style={{
          backgroundImage: `
            radial-gradient(circle at 25px 25px, rgba(0,0,0,0.05) 2px, transparent 2px),
            radial-gradient(circle at 75px 75px, rgba(0,0,0,0.05) 2px, transparent 2px)
          `,
          backgroundSize: '100px 100px'
        }}
        onClick={handleCanvasClick}
      >
        <div
          className="relative"
          style={{
            width: 3000, // Effectively infinite canvas 
            height: 2000,
            minWidth: "100vw",
            minHeight: "100vh"
          }}
        >
          {elements.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-gray-500">✨</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Start Building</h3>
                <p className="text-gray-500">Drag components from the left panel to get started</p>
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
        {/* Selected element toolbar: Delete + Duplicate */}
        {selectedElement && (
          <div className="fixed bottom-6 right-6 flex gap-3 z-50">
            <button
              onClick={() => onDuplicateElement(selectedElement)}
              className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-colors"
              title="Duplicate"
            >
              <Copy className="w-5 h-5" />
            </button>
            <button
              onClick={() => onDeleteElement(selectedElement)}
              className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-lg transition-colors"
              title="Delete"
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
            className={`bg-gray-200 hover:bg-gray-300 p-2 rounded-full shadow transition-all ${!canUndo ? 'opacity-30 cursor-not-allowed' : ''}`}
            title="Undo"
          >
            <Undo className="w-5 h-5" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className={`bg-gray-200 hover:bg-gray-300 p-2 rounded-full shadow transition-all ${!canRedo ? 'opacity-30 cursor-not-allowed' : ''}`}
            title="Redo"
          >
            <Redo className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
