
import React, { useState } from 'react';
import { X, Download, Copy, Check } from 'lucide-react';
import { Element } from '../types/builder';
import { Button } from './ui/button';

interface ExportModalProps {
  elements: Element[];
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ elements, onClose }) => {
  const [copied, setCopied] = useState(false);

  const generateHTML = () => {
    const styles = `
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font-family: Arial, sans-serif;
        position: relative;
        min-height: 100vh;
      }
      
      .element {
        position: absolute;
      }
    </style>`;

    const elementsHTML = elements.map(element => {
      const styleString = Object.entries(element.styles)
        .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`)
        .join('; ');

      const positionStyle = `left: ${element.position.x}px; top: ${element.position.y}px;`;
      const fullStyle = `${styleString}; ${positionStyle}`;

      switch (element.type) {
        case 'text':
          return `    <span class="element" style="${fullStyle}">${element.content}</span>`;
        case 'heading':
          return `    <h2 class="element" style="${fullStyle}">${element.content}</h2>`;
        case 'button':
          return `    <button class="element" style="${fullStyle}">${element.content}</button>`;
        case 'image':
          return `    <div class="element" style="${fullStyle}">
      ${element.content ? `<img src="${element.content}" alt="Image" style="width: 100%; height: 100%; object-fit: cover;">` : 'Image Placeholder'}
    </div>`;
        default:
          return `    <div class="element" style="${fullStyle}">${element.content}</div>`;
      }
    }).join('\n');

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Website</title>
    ${styles}
</head>
<body>
${elementsHTML}
</body>
</html>`;
  };

  const htmlCode = generateHTML();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(htmlCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([htmlCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'website.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-4/5 h-4/5 flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Export HTML</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 p-6 overflow-hidden">
          <div className="h-full bg-gray-50 rounded-lg p-4 overflow-auto">
            <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono">
              {htmlCode}
            </pre>
          </div>
        </div>
        
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <p className="text-sm text-gray-600">
            Copy the code above or download as an HTML file
          </p>
          <div className="flex space-x-3">
            <Button
              onClick={handleCopy}
              variant="outline"
              className="flex items-center gap-2"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy Code'}
            </Button>
            <Button
              onClick={handleDownload}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              <Download className="w-4 h-4" />
              Download HTML
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
