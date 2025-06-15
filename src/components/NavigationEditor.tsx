
import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from './ui/button';

interface NavigationItem {
  label: string;
  url: string;
}

interface NavigationEditorProps {
  items: NavigationItem[];
  onUpdate: (items: NavigationItem[]) => void;
}

export const NavigationEditor: React.FC<NavigationEditorProps> = ({ items, onUpdate }) => {
  const addItem = () => {
    const newItems = [...items, { label: 'New Link', url: '#' }];
    onUpdate(newItems);
  };

  const deleteItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    onUpdate(newItems);
  };

  const updateItem = (index: number, field: 'label' | 'url', value: string) => {
    const newItems = items.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    );
    onUpdate(newItems);
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Navigation Items</h3>
        <Button size="sm" onClick={addItem} className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white">
          <Plus className="w-3 h-3" />
          Add Link
        </Button>
      </div>
      
      {items.map((item, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-3 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">Link {index + 1}</span>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => deleteItem(index)}
              className="flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
          
          <input
            type="text"
            value={item.label}
            onChange={(e) => updateItem(index, 'label', e.target.value)}
            placeholder="Link text"
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
          />
          
          <input
            type="text"
            value={item.url}
            onChange={(e) => updateItem(index, 'url', e.target.value)}
            placeholder="URL (e.g., #home, /about)"
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
          />
        </div>
      ))}
    </div>
  );
};
