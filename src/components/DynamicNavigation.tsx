
import React, { useState } from 'react';
import { Plus, Trash2, Edit2, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';

interface NavItem {
  id: string;
  label: string;
  url: string;
  isActive?: boolean;
}

interface DynamicNavigationProps {
  items: NavItem[];
  onUpdate: (items: NavItem[]) => void;
  styles?: React.CSSProperties;
  className?: string;
}

export const DynamicNavigation: React.FC<DynamicNavigationProps> = ({
  items,
  onUpdate,
  styles = {},
  className = ""
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState('');
  const [editUrl, setEditUrl] = useState('');

  const addTab = () => {
    const newItem: NavItem = {
      id: `nav-${Date.now()}`,
      label: 'New Tab',
      url: '#'
    };
    onUpdate([...items, newItem]);
    startEditing(newItem.id, newItem.label, newItem.url);
  };

  const deleteTab = (id: string) => {
    onUpdate(items.filter(item => item.id !== id));
  };

  const startEditing = (id: string, label: string, url: string) => {
    setEditingId(id);
    setEditLabel(label);
    setEditUrl(url);
  };

  const saveEdit = () => {
    if (!editingId) return;
    onUpdate(
      items.map(item =>
        item.id === editingId
          ? { ...item, label: editLabel, url: editUrl }
          : item
      )
    );
    setEditingId(null);
  };

  const setActiveTab = (id: string) => {
    onUpdate(
      items.map(item => ({ ...item, isActive: item.id === id }))
    );
  };

  // Apply user styles with proper defaults
  const containerStyle: React.CSSProperties = {
    backgroundColor: styles.backgroundColor || '#ffffff',
    border: styles.border || '1px solid #e5e7eb',
    borderRadius: styles.borderRadius || '0px',
    fontFamily: styles.fontFamily || 'inherit',
    fontSize: styles.fontSize || '14px',
    fontWeight: styles.fontWeight || '500',
    color: styles.color || '#374151',
    padding: styles.padding || '0px',
    margin: styles.margin || '0px',
    width: styles.width || 'auto',
    height: styles.height || 'auto',
    textAlign: styles.textAlign || 'left',
    position: 'relative',
    ...styles
  };

  return (
    <div style={containerStyle} className={className}>
      <div className="flex items-center">
        {items.map((item) => (
          <div key={item.id} className="relative group">
            {editingId === item.id ? (
              <div className="flex items-center p-2 bg-blue-50 border-r border-gray-200">
                <input
                  value={editLabel}
                  onChange={(e) => setEditLabel(e.target.value)}
                  className="px-2 py-1 text-sm border rounded mr-1 w-20"
                  placeholder="Label"
                />
                <input
                  value={editUrl}
                  onChange={(e) => setEditUrl(e.target.value)}
                  className="px-2 py-1 text-sm border rounded mr-1 w-16"
                  placeholder="URL"
                />
                <Button size="sm" onClick={saveEdit} className="mr-1">
                  Save
                </Button>
                <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                  Cancel
                </Button>
              </div>
            ) : (
              <div
                style={{
                  textAlign: styles.textAlign || 'left',
                  textDecoration: styles.textDecoration || 'none',
                  cursor: styles.cursor || 'pointer',
                  fontFamily: styles.fontFamily || 'inherit',
                  fontSize: styles.fontSize || '14px',
                  fontWeight: styles.fontWeight || '500',
                  color: styles.color || '#374151'
                }}
                className={`flex items-center px-4 py-3 cursor-pointer border-r border-gray-200 last:border-r-0 transition-colors ${
                  item.isActive ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab(item.id)}
              >
                <span>{item.label}</span>
                {item.url !== '#' && (
                  <ExternalLink className="w-3 h-3 ml-1 opacity-50" />
                )}
                <div className="hidden group-hover:flex ml-2 gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      startEditing(item.id, item.label, item.url);
                    }}
                    className="p-1 h-auto"
                  >
                    <Edit2 className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteTab(item.id);
                    }}
                    className="p-1 h-auto text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
        <Button
          size="sm"
          variant="ghost"
          onClick={addTab}
          className="flex items-center gap-1 p-2 text-gray-500 hover:text-gray-700"
        >
          <Plus className="w-4 h-4" />
          Add Tab
        </Button>
      </div>
    </div>
  );
};
