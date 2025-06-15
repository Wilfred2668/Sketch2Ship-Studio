
import React from 'react';
import { Type, Heading, MousePointer, Image, Plus } from 'lucide-react';
import { Element } from '../types/builder';

interface ComponentLibraryProps {
  onAddElement: (type: Element['type']) => void;
}

export const ComponentLibrary: React.FC<ComponentLibraryProps> = ({ onAddElement }) => {
  const components = [
    { type: 'text' as const, icon: Type, label: 'Text', color: 'from-gray-500 to-gray-600' },
    { type: 'heading' as const, icon: Heading, label: 'Heading', color: 'from-blue-500 to-blue-600' },
    { type: 'button' as const, icon: MousePointer, label: 'Button', color: 'from-green-500 to-green-600' },
    { type: 'image' as const, icon: Image, label: 'Image', color: 'from-purple-500 to-purple-600' },
    // New fancy components
    { type: 'divider' as const, icon: Plus, label: 'Divider', color: 'from-gray-400 to-gray-600' },
    { type: 'card' as const, icon: Plus, label: 'Card', color: 'from-orange-400 to-yellow-500' }
  ];

  return (
    <div className="w-80 bg-white border-r border-gray-200 p-6 overflow-y-auto">
      <h2 className="text-lg font-semibold text-gray-800 mb-6">Components</h2>
      
      <div className="space-y-3">
        {components.map((component) => (
          <div
            key={component.type}
            onClick={() => onAddElement(component.type)}
            className="group relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md border border-gray-200 hover:border-gray-300"
          >
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 bg-gradient-to-br ${component.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                <component.icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-800">{component.label}</h3>
                <p className="text-sm text-gray-500">Click to add</p>
              </div>
              <Plus className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-100">
        <h3 className="font-semibold text-gray-800 mb-2">Getting Started</h3>
        <p className="text-sm text-gray-600">
          Drag components onto the canvas to start building your website. Click elements to edit them.
        </p>
      </div>
    </div>
  );
};
