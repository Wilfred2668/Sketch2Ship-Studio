
import React, { useState } from 'react';
import { X, Download, Copy, Check } from 'lucide-react';
import { Element } from '../types/builder';
import { Button } from './ui/button';

interface ExportModalProps {
  elements: Element[];
  onClose: () => void;
}

type ExportFormat = 'html' | 'react' | 'vue' | 'nextjs';

export const ExportModal: React.FC<ExportModalProps> = ({ elements, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('html');

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
        case 'link':
          return `    <a class="element" href="#" style="${fullStyle}">${element.content}</a>`;
        case 'image':
          return `    <img class="element" src="${element.content}" alt="Image" style="${fullStyle}" />`;
        case 'video':
          return `    <video class="element" src="${element.content}" controls style="${fullStyle}"></video>`;
        case 'icon':
          return `    <span class="element" style="${fullStyle}">${element.content}</span>`;
        case 'divider':
          return `    <div class="element" style="${fullStyle}">
      ${element.content ? `<span style="font-size: 12px; color: #888;">${element.content}</span>` : ''}
      <hr style="width: 128px; margin-top: 4px;" />
    </div>`;
        case 'spacer':
          return `    <div class="element" style="${fullStyle}"></div>`;
        case 'card':
          return `    <div class="element" style="${fullStyle}">${element.content}</div>`;
        case 'list':
          const listItems = element.content.split('\n').filter(item => item.trim()).map(item => `<li>${item.trim()}</li>`).join('');
          return `    <ul class="element" style="${fullStyle}">${listItems}</ul>`;
        case 'quote':
          return `    <blockquote class="element" style="${fullStyle}">"${element.content}"</blockquote>`;
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

  const generateReact = () => {
    const elementsJSX = elements.map(element => {
      const styleObj = Object.entries(element.styles)
        .map(([key, value]) => `    ${key}: '${value}'`)
        .join(',\n');
      
      const positionStyle = `    position: 'absolute',\n    left: '${element.position.x}px',\n    top: '${element.position.y}px'`;
      const fullStyle = `{\n${styleObj},\n${positionStyle}\n  }`;

      switch (element.type) {
        case 'text':
          return `    <span style={${fullStyle}}>${element.content}</span>`;
        case 'heading':
          return `    <h2 style={${fullStyle}}>${element.content}</h2>`;
        case 'button':
          return `    <button style={${fullStyle}}>${element.content}</button>`;
        case 'link':
          return `    <a href="#" style={${fullStyle}}>${element.content}</a>`;
        case 'image':
          return `    <img src="${element.content}" alt="Image" style={${fullStyle}} />`;
        case 'video':
          return `    <video src="${element.content}" controls style={${fullStyle}} />`;
        case 'icon':
          return `    <span style={${fullStyle}}>${element.content}</span>`;
        case 'divider':
          return `    <div style={${fullStyle}}>
      ${element.content ? `<span style={{fontSize: '12px', color: '#888'}}>${element.content}</span>` : ''}
      <hr style={{width: '128px', marginTop: '4px'}} />
    </div>`;
        case 'spacer':
          return `    <div style={${fullStyle}}></div>`;
        case 'card':
          return `    <div style={${fullStyle}}>${element.content}</div>`;
        case 'list':
          const listItems = element.content.split('\n').filter(item => item.trim()).map(item => `<li key="${Math.random()}">${item.trim()}</li>`).join('\n      ');
          return `    <ul style={${fullStyle}}>
      ${listItems}
    </ul>`;
        case 'quote':
          return `    <blockquote style={${fullStyle}}>"${element.content}"</blockquote>`;
        default:
          return `    <div style={${fullStyle}}>${element.content}</div>`;
      }
    }).join('\n');

    return `import React from 'react';

const MyComponent = () => {
  return (
    <div style={{ position: 'relative', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
${elementsJSX}
    </div>
  );
};

export default MyComponent;`;
  };

  const generateVue = () => {
    const elementsTemplate = elements.map(element => {
      const styleObj = Object.entries(element.styles)
        .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`)
        .join('; ');
      
      const positionStyle = `position: absolute; left: ${element.position.x}px; top: ${element.position.y}px`;
      const fullStyle = `${styleObj}; ${positionStyle}`;

      switch (element.type) {
        case 'text':
          return `    <span style="${fullStyle}">${element.content}</span>`;
        case 'heading':
          return `    <h2 style="${fullStyle}">${element.content}</h2>`;
        case 'button':
          return `    <button style="${fullStyle}">${element.content}</button>`;
        case 'link':
          return `    <a href="#" style="${fullStyle}">${element.content}</a>`;
        case 'image':
          return `    <img :src="'${element.content}'" alt="Image" style="${fullStyle}" />`;
        case 'video':
          return `    <video :src="'${element.content}'" controls style="${fullStyle}"></video>`;
        case 'icon':
          return `    <span style="${fullStyle}">${element.content}</span>`;
        case 'divider':
          return `    <div style="${fullStyle}">
      ${element.content ? `<span style="font-size: 12px; color: #888;">${element.content}</span>` : ''}
      <hr style="width: 128px; margin-top: 4px;" />
    </div>`;
        case 'spacer':
          return `    <div style="${fullStyle}"></div>`;
        case 'card':
          return `    <div style="${fullStyle}">${element.content}</div>`;
        case 'list':
          const listItems = element.content.split('\n').filter(item => item.trim()).map(item => `<li>${item.trim()}</li>`).join('\n      ');
          return `    <ul style="${fullStyle}">
      ${listItems}
    </ul>`;
        case 'quote':
          return `    <blockquote style="${fullStyle}">"${element.content}"</blockquote>`;
        default:
          return `    <div style="${fullStyle}">${element.content}</div>`;
      }
    }).join('\n');

    return `<template>
  <div style="position: relative; min-height: 100vh; font-family: Arial, sans-serif;">
${elementsTemplate}
  </div>
</template>

<script>
export default {
  name: 'MyComponent'
}
</script>`;
  };

  const generateNextJS = () => {
    const elementsJSX = elements.map(element => {
      const styleObj = Object.entries(element.styles)
        .map(([key, value]) => `    ${key}: '${value}'`)
        .join(',\n');
      
      const positionStyle = `    position: 'absolute',\n    left: '${element.position.x}px',\n    top: '${element.position.y}px'`;
      const fullStyle = `{\n${styleObj},\n${positionStyle}\n  }`;

      switch (element.type) {
        case 'text':
          return `    <span style={${fullStyle}}>${element.content}</span>`;
        case 'heading':
          return `    <h2 style={${fullStyle}}>${element.content}</h2>`;
        case 'button':
          return `    <button style={${fullStyle}}>${element.content}</button>`;
        case 'link':
          return `    <a href="#" style={${fullStyle}}>${element.content}</a>`;
        case 'image':
          return `    <img src="${element.content}" alt="Image" style={${fullStyle}} />`;
        case 'video':
          return `    <video src="${element.content}" controls style={${fullStyle}} />`;
        case 'icon':
          return `    <span style={${fullStyle}}>${element.content}</span>`;
        case 'divider':
          return `    <div style={${fullStyle}}>
      ${element.content ? `<span style={{fontSize: '12px', color: '#888'}}>${element.content}</span>` : ''}
      <hr style={{width: '128px', marginTop: '4px'}} />
    </div>`;
        case 'spacer':
          return `    <div style={${fullStyle}}></div>`;
        case 'card':
          return `    <div style={${fullStyle}}>${element.content}</div>`;
        case 'list':
          const listItems = element.content.split('\n').filter(item => item.trim()).map(item => `<li key="${Math.random()}">${item.trim()}</li>`).join('\n      ');
          return `    <ul style={${fullStyle}}>
      ${listItems}
    </ul>`;
        case 'quote':
          return `    <blockquote style={${fullStyle}}>"${element.content}"</blockquote>`;
        default:
          return `    <div style={${fullStyle}}>${element.content}</div>`;
      }
    }).join('\n');

    return `import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>My Website</title>
        <meta name="description" content="Generated with website builder" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div style={{ position: 'relative', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
${elementsJSX}
      </div>
    </>
  );
}`;
  };

  const getCode = () => {
    switch (selectedFormat) {
      case 'html':
        return generateHTML();
      case 'react':
        return generateReact();
      case 'vue':
        return generateVue();
      case 'nextjs':
        return generateNextJS();
      default:
        return generateHTML();
    }
  };

  const getFileExtension = () => {
    switch (selectedFormat) {
      case 'html':
        return '.html';
      case 'react':
        return '.jsx';
      case 'vue':
        return '.vue';
      case 'nextjs':
        return '.js';
      default:
        return '.html';
    }
  };

  const getFileName = () => {
    switch (selectedFormat) {
      case 'html':
        return 'website.html';
      case 'react':
        return 'MyComponent.jsx';
      case 'vue':
        return 'MyComponent.vue';
      case 'nextjs':
        return 'index.js';
      default:
        return 'website.html';
    }
  };

  const code = getCode();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = getFileName();
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formats = [
    { id: 'html', label: 'HTML', description: 'Plain HTML with inline styles' },
    { id: 'react', label: 'React', description: 'React JSX component' },
    { id: 'vue', label: 'Vue.js', description: 'Vue single file component' },
    { id: 'nextjs', label: 'Next.js', description: 'Next.js page component' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-4/5 h-4/5 flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Export Code</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex items-center gap-4 p-6 border-b bg-gray-50">
          <span className="text-sm font-medium text-gray-600">Export Format:</span>
          <div className="flex gap-2">
            {formats.map((format) => (
              <button
                key={format.id}
                onClick={() => setSelectedFormat(format.id as ExportFormat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedFormat === format.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {format.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex-1 p-6 overflow-hidden">
          <div className="h-full bg-gray-50 rounded-lg p-4 overflow-auto">
            <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono">
              {code}
            </pre>
          </div>
        </div>
        
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <div>
            <p className="text-sm text-gray-600">
              {formats.find(f => f.id === selectedFormat)?.description}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Copy the code above or download as {getFileName()}
            </p>
          </div>
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
              Download {selectedFormat.toUpperCase()}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
