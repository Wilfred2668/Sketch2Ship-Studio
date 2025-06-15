
import React from 'react';
import { Download, Palette, Eye, Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';

interface HeaderProps {
  onExport: () => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
  onPreview?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onExport, theme = 'light', onToggleTheme, onPreview }) => {
  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-3 flex items-center justify-between shadow-sm transition-colors">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Palette className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Website Builder
          </h1>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onToggleTheme}
          title="Toggle Dark/Light Mode"
          className="rounded-full"
        >
          {theme === 'dark' ? 
            <Sun className="w-5 h-5 text-yellow-400" /> : 
            <Moon className="w-5 h-5 text-gray-700" />
          }
        </Button>
        <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={onPreview}>
          <Eye className="w-4 h-4" />
          Preview
        </Button>
        <Button 
          onClick={onExport}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
        >
          <Download className="w-4 h-4" />
          Export HTML
        </Button>
      </div>
    </header>
  );
};
