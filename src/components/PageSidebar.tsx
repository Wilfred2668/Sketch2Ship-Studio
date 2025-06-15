
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
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <button
          title="Add Page"
          className="bg-gradient-to-br from-blue-400 to-purple-400 text-white rounded p-1.5 hover:from-blue-500 hover:to-purple-500 transition-colors"
          onClick={addPage}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {pages.map((page) => (
          <div
            key={page.id}
            className={`flex items-center group px-4 py-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer ${
              page.id === currentPageId ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-blue-500' : ''
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
                className="border rounded px-2 py-1 w-full text-sm bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600"
              />
            ) : (
              <>
                <span className="flex-1 text-sm truncate text-gray-700 dark:text-gray-300">{page.name}</span>
                <button
                  className="ml-2 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={e => {
                    e.stopPropagation();
                    setEditingId(page.id);
                    setInputValue(page.name);
                  }}
                  title="Rename Page"
                >
                  <Edit className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                </button>
                {pages.length > 1 && (
                  <button
                    className="ml-1 p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-opacity"
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
