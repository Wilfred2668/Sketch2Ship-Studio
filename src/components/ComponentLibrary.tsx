
import React from 'react';
import { Type, Heading, MousePointer, Image, Plus, List, Link, Video, Star, Space, Quote, PlayCircle, ChevronDown, Menu } from 'lucide-react';
import { Element } from '../types/builder';

interface ComponentLibraryProps {
  onAddElement: (type: Element['type']) => void;
}

export const ComponentLibrary: React.FC<ComponentLibraryProps> = ({ onAddElement }) => {
  const components = [
    // Basic Components
    { type: 'text' as const, icon: Type, label: 'Text', color: 'from-gray-500 to-gray-600' },
    { type: 'heading' as const, icon: Heading, label: 'Heading', color: 'from-blue-500 to-blue-600' },
    { type: 'button' as const, icon: MousePointer, label: 'Button', color: 'from-green-500 to-green-600' },
    { type: 'link' as const, icon: Link, label: 'Link', color: 'from-blue-400 to-blue-500' },
    { type: 'navigation' as const, icon: Menu, label: 'Navigation', color: 'from-slate-500 to-slate-600' },
    
    // Media Components
    { type: 'image' as const, icon: Image, label: 'Image', color: 'from-purple-500 to-purple-600' },
    { type: 'video' as const, icon: Video, label: 'Video', color: 'from-red-500 to-red-600' },
    { type: 'icon' as const, icon: Star, label: 'Icon', color: 'from-yellow-500 to-yellow-600' },
    { type: 'slideshow' as const, icon: PlayCircle, label: 'Slideshow', color: 'from-pink-500 to-pink-600' },
    
    // Layout Components
    { type: 'card' as const, icon: Plus, label: 'Card', color: 'from-orange-400 to-yellow-500' },
    { type: 'divider' as const, icon: Plus, label: 'Divider', color: 'from-gray-400 to-gray-600' },
    { type: 'spacer' as const, icon: Space, label: 'Spacer', color: 'from-gray-300 to-gray-500' },
    { type: 'accordion' as const, icon: ChevronDown, label: 'Accordion', color: 'from-cyan-500 to-cyan-600' },
    
    // Content Components
    { type: 'list' as const, icon: List, label: 'List', color: 'from-indigo-500 to-indigo-600' },
    { type: 'quote' as const, icon: Quote, label: 'Quote', color: 'from-teal-500 to-teal-600' },
  ];

  return (
    <div className="flex-1 p-4 overflow-y-auto max-h-[calc(100vh-120px)]">
      <div className="space-y-3">
        {components.map((component) => (
          <div
            key={component.type}
            onClick={() => onAddElement(component.type)}
            className="group relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-700 dark:hover:to-gray-800 rounded-lg p-3 cursor-pointer transition-all duration-200 hover:shadow-md border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
          >
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 bg-gradient-to-br ${component.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200 flex-shrink-0`}>
                <component.icon className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-800 dark:text-gray-200 text-sm truncate">{component.label}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Click to add</p>
              </div>
              <Plus className="w-3 h-3 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors flex-shrink-0" />
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
          </div>
        ))}
      </div>

      <div className="mt-6 p-3 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
        <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1 text-sm">Getting Started</h3>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          Click components to add them to your canvas.
        </p>
      </div>
    </div>
  );
};
