
import React from 'react';
import { Element } from '../types/builder';
import { DraggableElement } from './DraggableElement';
import { Trash2 } from 'lucide-react';

interface CanvasProps {
  elements: Element[];
  selectedElement: string | null;
  onSelectElement: (id: string | null) => void;
  onUpdateElement: (id: string, updates: Partial<Element>) => void;
  onDeleteElement: (id: string) => void;
}

export const Canvas: React.FC<CanvasProps> = ({
  elements,
  selectedElement,
  onSelectElement,
  onUpdateElement,
  onDeleteElement,
}) => {
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onSelectElement(null);
    }
  };

  return (
    <div className="flex-1 relative overflow-hidden">
      <div 
        className="w-full h-full bg-white relative cursor-default"
        onClick={handleCanvasClick}
        style={{ 
          backgroundImage: `
            radial-gradient(circle at 25px 25px, rgba(0,0,0,0.05) 2px, transparent 2px),
            radial-gradient(circle at 75px 75px, rgba(0,0,0,0.05) 2px, transparent 2px)
          `,
          backgroundSize: '100px 100px'
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
          />
        ))}

        {selectedElement && (
          <button
            onClick={() => onDeleteElement(selectedElement)}
            className="fixed bottom-6 right-6 bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-lg transition-colors z-50"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};
