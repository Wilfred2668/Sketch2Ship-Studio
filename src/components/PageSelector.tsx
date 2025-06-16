
import React from 'react';
import { ChevronDown, ExternalLink, FileText } from 'lucide-react';
import type { Page } from './WebsiteBuilder';

interface PageSelectorProps {
  pages: Page[];
  currentPageId: string;
  selectedValue?: { type: 'page' | 'url'; value: string };
  onSelect: (linkTo: { type: 'page' | 'url'; value: string }) => void;
}

export const PageSelector: React.FC<PageSelectorProps> = ({
  pages,
  currentPageId,
  selectedValue,
  onSelect
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [urlInput, setUrlInput] = React.useState(selectedValue?.type === 'url' ? selectedValue.value : '');

  const getDisplayText = () => {
    if (!selectedValue) return 'Select link destination';
    if (selectedValue.type === 'page') {
      const page = pages.find(p => p.id === selectedValue.value);
      return page ? `Page: ${page.name}` : 'Unknown page';
    }
    return `URL: ${selectedValue.value}`;
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-3 py-2 text-left border border-gray-300 dark:border-gray-600 rounded-md bg-background flex items-center justify-between text-sm"
        >
          <span className={selectedValue ? 'text-foreground' : 'text-gray-500'}>
            {getDisplayText()}
          </span>
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg z-50 max-h-48 overflow-y-auto">
            {/* Page options */}
            <div className="p-2 border-b border-gray-200 dark:border-gray-600">
              <div className="text-xs font-medium text-gray-500 mb-2">Pages</div>
              {pages.map((page) => (
                <button
                  key={page.id}
                  type="button"
                  onClick={() => {
                    onSelect({ type: 'page', value: page.id });
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-2 py-1 rounded text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 ${
                    page.id === currentPageId ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={page.id === currentPageId}
                >
                  <FileText className="w-3 h-3" />
                  {page.name}
                  {page.id === currentPageId && <span className="text-xs text-gray-500">(current)</span>}
                </button>
              ))}
            </div>

            {/* URL option */}
            <div className="p-2">
              <div className="text-xs font-medium text-gray-500 mb-2">External URL</div>
              <div className="flex gap-1">
                <ExternalLink className="w-3 h-3 mt-2 text-gray-400 flex-shrink-0" />
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      if (urlInput.trim()) {
                        onSelect({ type: 'url', value: urlInput.trim() });
                        setIsOpen(false);
                      }
                    }
                  }}
                  placeholder="https://example.com"
                  className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-background"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (urlInput.trim()) {
                      onSelect({ type: 'url', value: urlInput.trim() });
                      setIsOpen(false);
                    }
                  }}
                  className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Set
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
