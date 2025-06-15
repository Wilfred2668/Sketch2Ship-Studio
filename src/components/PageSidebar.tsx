
import React, { useState } from 'react';
import { Plus, Trash2, Edit } from 'lucide-react';
import type { Page } from './WebsiteBuilder';

interface PageSidebarProps {
  pages: Page[];
  currentPageId: string;
  setCurrentPageId: (id: string) => void;
  addPage: () => void;
  deletePage: (id: string) => void;
  renamePage: (id: string, name: string) => void;
}

export const PageSidebar: React.FC<PageSidebarProps> = ({
  pages,
  currentPageId,
  setCurrentPageId,
  addPage,
  deletePage,
  renamePage,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string>('');

  return (
    <div className="w-56 bg-white border-r border-gray-200 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="font-bold text-gray-700">Pages</div>
        <button
          title="Add Page"
          className="bg-gradient-to-br from-blue-400 to-purple-400 text-white rounded p-1.5"
          onClick={addPage}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {pages.map((page) => (
          <div
            key={page.id}
            className={`flex items-center group px-4 py-2 border-b hover:bg-gray-100 transition cursor-pointer ${
              page.id === currentPageId ? 'bg-blue-50 border-l-4 border-blue-500' : ''
            }`}
            onClick={() => setCurrentPageId(page.id)}
          >
            {editingId === page.id ? (
              <input
                autoFocus
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onBlur={() => {
                  renamePage(page.id, inputValue || page.name);
                  setEditingId(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    renamePage(page.id, inputValue || page.name);
                    setEditingId(null);
                  }
                }}
                className="border rounded px-1 py-0.5 w-full text-sm"
              />
            ) : (
              <>
                <span className="flex-1 text-sm truncate">{page.name}</span>
                <button
                  className="ml-1 p-1 rounded hover:bg-gray-200"
                  onClick={e => {
                    e.stopPropagation();
                    setEditingId(page.id);
                    setInputValue(page.name);
                  }}
                  title="Rename Page"
                >
                  <Edit className="w-3 h-3" />
                </button>
                {pages.length > 1 && (
                  <button
                    className="ml-1 p-1 rounded hover:bg-red-100"
                    onClick={e => {
                      e.stopPropagation();
                      deletePage(page.id);
                    }}
                    title="Delete Page"
                  >
                    <Trash2 className="w-3 h-3 text-red-500" />
                  </button>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
