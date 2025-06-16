
import React, { useState } from 'react';
import { Plus, Trash2, Edit2, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';

interface AccordionSection {
  id: string;
  title: string;
  content: string;
  isOpen?: boolean;
}

interface DynamicAccordionProps {
  sections: AccordionSection[];
  onUpdate: (sections: AccordionSection[]) => void;
  style?: React.CSSProperties;
  className?: string;
}

export const DynamicAccordion: React.FC<DynamicAccordionProps> = ({
  sections,
  onUpdate,
  style,
  className = ""
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  const addSection = () => {
    const newSection: AccordionSection = {
      id: `section-${Date.now()}`,
      title: 'New Section',
      content: 'Add your content here...',
      isOpen: false
    };
    onUpdate([...sections, newSection]);
    startEditing(newSection.id, newSection.title, newSection.content);
  };

  const deleteSection = (id: string) => {
    onUpdate(sections.filter(section => section.id !== id));
  };

  const startEditing = (id: string, title: string, content: string) => {
    setEditingId(id);
    setEditTitle(title);
    setEditContent(content);
  };

  const saveEdit = () => {
    if (!editingId) return;
    onUpdate(
      sections.map(section =>
        section.id === editingId
          ? { ...section, title: editTitle, content: editContent }
          : section
      )
    );
    setEditingId(null);
  };

  const toggleSection = (id: string) => {
    onUpdate(
      sections.map(section =>
        section.id === id
          ? { ...section, isOpen: !section.isOpen }
          : section
      )
    );
  };

  // Apply user styles to the accordion container
  const containerStyle = {
    backgroundColor: style?.backgroundColor || '#ffffff',
    border: style?.border || '1px solid #e5e7eb',
    borderRadius: style?.borderRadius || '8px',
    fontFamily: style?.fontFamily || 'inherit',
    fontSize: style?.fontSize || '14px',
    fontWeight: style?.fontWeight || '400',
    color: style?.color || '#374151',
    padding: style?.padding || '0px',
    margin: style?.margin || '0px',
    width: style?.width || 'auto',
    height: style?.height || 'auto',
    textAlign: style?.textAlign || 'left',
    ...style
  };

  return (
    <div style={containerStyle} className={`overflow-hidden ${className}`}>
      {sections.map((section, index) => (
        <div key={section.id} className="border-b border-gray-200 last:border-b-0">
          {editingId === section.id ? (
            <div className="p-4 bg-gray-50">
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded mb-2"
                placeholder="Section title"
              />
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded mb-2 h-24 resize-none"
                placeholder="Section content"
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={saveEdit}>Save</Button>
                <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>Cancel</Button>
              </div>
            </div>
          ) : (
            <>
              <div className="group relative">
                <button
                  style={{
                    textDecoration: style?.textDecoration || 'none',
                    cursor: style?.cursor || 'pointer'
                  }}
                  className="w-full px-4 py-3 text-left bg-gray-50 hover:bg-gray-100 flex justify-between items-center"
                  onClick={() => toggleSection(section.id)}
                >
                  <span>{section.title}</span>
                  <div className="flex items-center gap-2">
                    <div className="hidden group-hover:flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditing(section.id, section.title, section.content);
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
                          deleteSection(section.id);
                        }}
                        className="p-1 h-auto text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                    <ChevronDown className={`w-4 h-4 transform transition-transform ${section.isOpen ? 'rotate-180' : ''}`} />
                  </div>
                </button>
              </div>
              {section.isOpen && (
                <div className="px-4 py-3 text-sm text-gray-700 bg-white">
                  {section.content}
                </div>
              )}
            </>
          )}
        </div>
      ))}
      <div className="p-2 bg-gray-50">
        <Button
          size="sm"
          variant="ghost"
          onClick={addSection}
          className="flex items-center gap-1 w-full justify-center text-gray-500 hover:text-gray-700"
        >
          <Plus className="w-4 h-4" />
          Add Section
        </Button>
      </div>
    </div>
  );
};
