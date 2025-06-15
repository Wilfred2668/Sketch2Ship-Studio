
import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from './ui/button';

interface AccordionSection {
  title: string;
  content: string;
}

interface AccordionEditorProps {
  sections: AccordionSection[];
  onUpdate: (sections: AccordionSection[]) => void;
}

export const AccordionEditor: React.FC<AccordionEditorProps> = ({ sections, onUpdate }) => {
  const addSection = () => {
    const newSections = [...sections, { title: 'New Section', content: 'New content' }];
    onUpdate(newSections);
  };

  const deleteSection = (index: number) => {
    const newSections = sections.filter((_, i) => i !== index);
    onUpdate(newSections);
  };

  const updateSection = (index: number, field: 'title' | 'content', value: string) => {
    const newSections = sections.map((section, i) => 
      i === index ? { ...section, [field]: value } : section
    );
    onUpdate(newSections);
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Accordion Sections</h3>
        <Button size="sm" onClick={addSection} className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white">
          <Plus className="w-3 h-3" />
          Add Section
        </Button>
      </div>
      
      {sections.map((section, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-3 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">Section {index + 1}</span>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => deleteSection(index)}
              className="flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
          
          <input
            type="text"
            value={section.title}
            onChange={(e) => updateSection(index, 'title', e.target.value)}
            placeholder="Section title"
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
          />
          
          <textarea
            value={section.content}
            onChange={(e) => updateSection(index, 'content', e.target.value)}
            placeholder="Section content"
            rows={2}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded resize-none"
          />
        </div>
      ))}
    </div>
  );
};
