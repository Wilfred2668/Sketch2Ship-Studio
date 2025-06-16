import React, { useState } from 'react';
import { X, Download, Copy, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Page } from './WebsiteBuilder';

interface ExportModalProps {
  pages: Page[];
  onClose: () => void;
}

type ExportFormat = 'html' | 'react' | 'vue' | 'nextjs';
type ExportMode = 'current' | 'all' | 'separate';

export const ExportModal: React.FC<ExportModalProps> = ({ pages, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('html');
  const [exportMode, setExportMode] = useState<ExportMode>('current');
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  const generateSinglePageHTML = (page: Page) => {
    const styles = `
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font-family: Arial, sans-serif;
        background: white;
        overflow-x: auto;
      }
      
      .canvas {
        position: relative;
        width: 800px;
        height: 600px;
        margin: 0 auto;
        background: white;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        overflow: hidden;
      }
      
      .element {
        position: absolute;
        user-select: none;
      }

      /* Navigation Element Styles */
      .element-navigation {
        display: flex;
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        overflow: hidden;
      }

      .element-navigation .nav-link {
        padding: 12px 16px;
        text-decoration: none;
        color: #374151;
        border-right: 1px solid #e2e8f0;
        transition: background-color 0.2s ease;
        font-weight: 500;
      }

      .element-navigation .nav-link:last-child {
        border-right: none;
      }

      .element-navigation .nav-link:hover {
        background: #f9fafb;
      }

      /* Accordion Element Styles */
      .element-accordion {
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        overflow: hidden;
      }

      .accordion-item {
        border-bottom: 1px solid #e2e8f0;
      }

      .accordion-item:last-child {
        border-bottom: none;
      }

      .accordion-header {
        width: 100%;
        padding: 12px 16px;
        background: #f9fafb;
        border: none;
        text-align: left;
        cursor: pointer;
        font-weight: 500;
        display: flex;
        justify-content: space-between;
        align-items: center;
        transition: background-color 0.2s ease;
      }

      .accordion-header:hover {
        background: #f1f5f9;
      }

      .accordion-content {
        padding: 12px 16px;
        background: white;
        display: none;
      }

      .accordion-content.open {
        display: block;
      }

      /* Slideshow Styles */
      .slideshow-container {
        position: relative;
        overflow: hidden;
        background: #f1f5f9;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
      }
      
      .slideshow-container img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .slideshow-dots {
        position: absolute;
        bottom: 8px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 4px;
      }

      .slideshow-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        transition: background-color 0.2s ease;
      }

      .slideshow-dot.active {
        background: white;
      }

      /* Button Styles */
      .element button {
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .element button:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      /* Image Styles */
      .element img {
        border-radius: 8px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      }

      /* Card Styles */
      .element-card {
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        transition: box-shadow 0.2s ease;
      }

      .element-card:hover {
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      }

      /* List Styles */
      .element ul {
        list-style-type: disc;
        list-style-position: inside;
      }

      .element ul li {
        margin-bottom: 4px;
        line-height: 1.5;
      }

      /* Quote Styles */
      .element blockquote {
        font-style: italic;
        border-left: 4px solid #3b82f6;
        padding-left: 16px;
        color: #374151;
        line-height: 1.6;
      }

      /* Responsive Design */
      @media (max-width: 768px) {
        .canvas {
          width: 95%;
          height: auto;
          min-height: 600px;
        }
        
        .element {
          position: relative !important;
          left: auto !important;
          top: auto !important;
          margin: 10px;
          max-width: calc(100% - 20px);
        }
      }
    </style>`;

    const generateElementHTML = (element: any) => {
      const styleString = Object.entries(element.styles)
        .map(([key, value]) => {
          const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
          return `${cssKey}: ${value}`;
        })
        .join('; ');

      const positionStyle = `left: ${element.position.x}px; top: ${element.position.y}px;`;
      const fullStyle = `${styleString}; ${positionStyle}`;

      switch (element.type) {
        case 'navigation':
          const navItems = element.content.split('\n').filter(Boolean);
          return `    <nav class="element element-navigation" style="${fullStyle}">
      ${navItems.map(item => {
        const [label, url] = item.split('|');
        return `<a href="${url || '#'}" class="nav-link">${label || 'Link'}</a>`;
      }).join('\n      ')}
    </nav>`;

        case 'accordion':
          const sections = element.content.split('\n').filter(Boolean);
          return `    <div class="element element-accordion" style="${fullStyle}">
      ${sections.map((section, index) => {
        const [title, content] = section.split('|');
        return `<div class="accordion-item">
        <button class="accordion-header" onclick="toggleAccordion(${index})">
          ${title || 'Section'}
          <span>▼</span>
        </button>
        <div class="accordion-content" id="content-${index}">
          ${content || 'Content'}
        </div>
      </div>`;
      }).join('\n      ')}
    </div>`;

        case 'slideshow':
          const images = element.content.split('\n').filter((img: string) => img.trim());
          return `    <div class="element slideshow-container" style="${fullStyle}">
      ${images.length > 0 ? `<img src="${images[0]}" alt="Slideshow" />` : '<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: #6b7280;">Slideshow</div>'}
      ${images.length > 1 ? `<div class="slideshow-dots">
        ${images.map((_, index) => `<div class="slideshow-dot ${index === 0 ? 'active' : ''}"></div>`).join('')}
      </div>` : ''}
    </div>`;

        case 'text':
          return `    <span class="element" style="${fullStyle}">${element.content}</span>`;

        case 'heading':
          return `    <h1 class="element" style="${fullStyle}">${element.content}</h1>`;

        case 'button':
          return `    <button class="element" style="${fullStyle}">${element.content}</button>`;

        case 'link':
          return `    <a class="element" href="${element.linkTo?.value || '#'}" style="${fullStyle}">${element.content}</a>`;

        case 'image':
          return element.content ? 
            `    <img class="element" src="${element.content}" alt="Image" style="${fullStyle}" />` : 
            `    <div class="element" style="${fullStyle}; border: 2px dashed #d1d5db; display: flex; align-items: center; justify-content: center; color: #6b7280;">Image Placeholder</div>`;

        case 'video':
          const isYouTube = element.content && (element.content.includes('youtube.com') || element.content.includes('youtu.be'));
          if (element.content && isYouTube) {
            const videoIdMatch = element.content.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
            const embedUrl = videoIdMatch ? `https://www.youtube.com/embed/${videoIdMatch[1]}` : element.content;
            return `    <iframe class="element" src="${embedUrl}" style="${fullStyle}" frameborder="0" allowfullscreen></iframe>`;
          }
          return element.content ? 
            `    <video class="element" src="${element.content}" controls style="${fullStyle}"></video>` :
            `    <div class="element" style="${fullStyle}; background: #000; color: white; display: flex; align-items: center; justify-content: center;">Video Placeholder</div>`;

        case 'icon':
          return `    <span class="element" style="${fullStyle}">${element.content || '⭐'}</span>`;

        case 'divider':
          return `    <hr class="element" style="${fullStyle}; border: none; height: 2px; background-color: ${element.styles.backgroundColor || '#e5e7eb'};" />`;

        case 'spacer':
          return `    <div class="element" style="${fullStyle}; background: transparent; border: 1px dashed #d1d5db; display: flex; align-items: center; justify-content: center; color: #9ca3af; font-size: 12px;">Spacer</div>`;

        case 'card':
          return `    <div class="element element-card" style="${fullStyle}">
      <div style="padding: 16px;">${element.content}</div>
    </div>`;

        case 'list':
          const listItems = element.content.split('\n').filter((item: string) => item.trim()).map((item: string) => `<li>${item.trim()}</li>`).join('');
          return `    <ul class="element" style="${fullStyle}">${listItems}</ul>`;

        case 'quote':
          return `    <blockquote class="element" style="${fullStyle}">"${element.content}"</blockquote>`;

        default:
          return `    <div class="element" style="${fullStyle}">${element.content}</div>`;
      }
    };

    const elementsHTML = page.elements.map(generateElementHTML).join('\n');

    const script = `
    <script>
      function toggleAccordion(index) {
        const content = document.getElementById('content-' + index);
        content.classList.toggle('open');
      }
    </script>`;

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${page.name}</title>
    ${styles}
</head>
<body>
  <div class="canvas">
${elementsHTML}
  </div>
${script}
</body>
</html>`;
  };

  const generateMultiPageHTML = () => {
    // Only generate if user specifically wants all pages combined
    const styles = `
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font-family: Arial, sans-serif;
        background: white;
      }
      
      .page-container {
        position: relative;
        width: 800px;
        height: 600px;
        margin: 20px auto;
        background: white;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        overflow: hidden;
      }
      
      .element {
        position: absolute;
        user-select: none;
      }

      .page-title {
        position: absolute;
        top: -40px;
        left: 0;
        font-size: 18px;
        font-weight: bold;
        color: #374151;
      }

      /* Navigation Element Styles */
      .element-navigation {
        display: flex;
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        overflow: hidden;
      }

      .element-navigation .nav-link {
        padding: 12px 16px;
        text-decoration: none;
        color: #374151;
        border-right: 1px solid #e2e8f0;
        transition: background-color 0.2s ease;
        font-weight: 500;
      }

      .element-navigation .nav-link:last-child {
        border-right: none;
      }

      .element-navigation .nav-link:hover {
        background: #f9fafb;
      }

      /* Accordion Element Styles */
      .element-accordion {
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        overflow: hidden;
      }

      .accordion-item {
        border-bottom: 1px solid #e2e8f0;
      }

      .accordion-item:last-child {
        border-bottom: none;
      }

      .accordion-header {
        width: 100%;
        padding: 12px 16px;
        background: #f9fafb;
        border: none;
        text-align: left;
        cursor: pointer;
        font-weight: 500;
        display: flex;
        justify-content: space-between;
        align-items: center;
        transition: background-color 0.2s ease;
      }

      .accordion-header:hover {
        background: #f1f5f9;
      }

      .accordion-content {
        padding: 12px 16px;
        background: white;
        display: none;
      }

      .accordion-content.open {
        display: block;
      }

      /* Slideshow Styles */
      .slideshow-container {
        position: relative;
        overflow: hidden;
        background: #f1f5f9;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
      }
      
      .slideshow-container img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .slideshow-dots {
        position: absolute;
        bottom: 8px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 4px;
      }

      .slideshow-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        transition: background-color 0.2s ease;
      }

      .slideshow-dot.active {
        background: white;
      }

      /* Button Styles */
      .element button {
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .element button:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      /* Image Styles */
      .element img {
        border-radius: 8px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      }

      /* Card Styles */
      .element-card {
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        transition: box-shadow 0.2s ease;
      }

      .element-card:hover {
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      }

      /* List Styles */
      .element ul {
        list-style-type: disc;
        list-style-position: inside;
      }

      .element ul li {
        margin-bottom: 4px;
        line-height: 1.5;
      }

      /* Quote Styles */
      .element blockquote {
        font-style: italic;
        border-left: 4px solid #3b82f6;
        padding-left: 16px;
        color: #374151;
        line-height: 1.6;
      }

      /* Responsive Design */
      @media (max-width: 768px) {
        .page-container {
          width: 95%;
          height: auto;
          min-height: 600px;
        }
        
        .element {
          position: relative !important;
          left: auto !important;
          top: auto !important;
          margin: 10px;
          max-width: calc(100% - 20px);
        }
      }
    </style>`;

    const pagesHTML = pages.map((page, index) => {
      const elementsHTML = page.elements.map(element => {
        const styleString = Object.entries(element.styles)
          .map(([key, value]) => {
            const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
            return `${cssKey}: ${value}`;
          })
          .join('; ');

        const positionStyle = `left: ${element.position.x}px; top: ${element.position.y}px;`;
        const fullStyle = `${styleString}; ${positionStyle}`;

        return `    <div class="element" style="${fullStyle}">${element.content}</div>`;
      }).join('\n');

      return `  <div class="page-container">
    <div class="page-title">${page.name}</div>
${elementsHTML}
  </div>`;
    }).join('\n');

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>All Pages</title>
    ${styles}
</head>
<body>
${pagesHTML}
</body>
</html>`;
  };

  const getCode = () => {
    const currentPage = pages[currentPageIndex];
    
    switch (selectedFormat) {
      case 'html':
        if (exportMode === 'current') {
          return generateSinglePageHTML(currentPage);
        } else if (exportMode === 'all') {
          return generateMultiPageHTML();
        } else {
          return generateSinglePageHTML(currentPage);
        }
      case 'react':
        return `// React component for ${currentPage.name}\nimport React from 'react';\n\nconst ${currentPage.name.replace(/\s+/g, '')}Page = () => {\n  return (\n    <div style={{ position: 'relative', width: '800px', height: '600px', margin: '0 auto' }}>\n      {/* Page content for ${currentPage.name} */}\n    </div>\n  );\n};\n\nexport default ${currentPage.name.replace(/\s+/g, '')}Page;`;
      case 'vue':
        return `<!-- Vue component for ${currentPage.name} -->\n<template>\n  <div style="position: relative; width: 800px; height: 600px; margin: 0 auto;">\n    <!-- Page content for ${currentPage.name} -->\n  </div>\n</template>\n\n<script>\nexport default {\n  name: '${currentPage.name.replace(/\s+/g, '')}Page'\n}\n</script>`;
      case 'nextjs':
        return `// Next.js page for ${currentPage.name}\nexport default function ${currentPage.name.replace(/\s+/g, '')}Page() {\n  return (\n    <div style={{ position: 'relative', width: '800px', height: '600px', margin: '0 auto' }}>\n      {/* Page content for ${currentPage.name} */}\n    </div>\n  );\n}`;
      default:
        return generateSinglePageHTML(currentPage);
    }
  };

  const getFileName = () => {
    const currentPage = pages[currentPageIndex];
    const pageName = currentPage.name.toLowerCase().replace(/\s+/g, '-');
    
    switch (selectedFormat) {
      case 'html':
        return exportMode === 'all' ? 'all-pages.html' : `${pageName}.html`;
      case 'react':
        return `${currentPage.name.replace(/\s+/g, '')}Page.jsx`;
      case 'vue':
        return `${currentPage.name.replace(/\s+/g, '')}Page.vue`;
      case 'nextjs':
        return `${pageName}.js`;
      default:
        return `${pageName}.html`;
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
    { id: 'html', label: 'HTML', description: 'Complete HTML page' },
    { id: 'react', label: 'React', description: 'React component' },
    { id: 'vue', label: 'Vue.js', description: 'Vue component' },
    { id: 'nextjs', label: 'Next.js', description: 'Next.js page' },
  ];

  const exportModes = [
    { id: 'current', label: 'Current Page', description: 'Export only the selected page' },
    { id: 'all', label: 'All Pages Combined', description: 'Export all pages in one file' },
    { id: 'separate', label: 'Separate Files', description: 'Export each page separately' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Export Pages</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {exportMode === 'current' ? `Exporting: ${pages[currentPageIndex].name}` : `Exporting ${pages.length} page${pages.length !== 1 ? 's' : ''}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex flex-col gap-4 p-6 border-b bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Export Format:</span>
            <div className="flex gap-2 flex-wrap">
              {formats.map((format) => (
                <button
                  key={format.id}
                  onClick={() => setSelectedFormat(format.id as ExportFormat)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedFormat === format.id
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600'
                  }`}
                >
                  {format.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Export Mode:</span>
            <div className="flex gap-2 flex-wrap">
              {exportModes.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setExportMode(mode.id as ExportMode)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    exportMode === mode.id
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600'
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>

          {exportMode === 'current' && pages.length > 1 && (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Select Page:</span>
              <select
                value={currentPageIndex}
                onChange={(e) => setCurrentPageIndex(parseInt(e.target.value))}
                className="px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
              >
                {pages.map((page, index) => (
                  <option key={page.id} value={index}>
                    {page.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        
        <div className="flex-1 p-6 overflow-hidden">
          <div className="h-full bg-slate-50 dark:bg-slate-900 rounded-lg p-4 overflow-auto border border-slate-200 dark:border-slate-700">
            <pre className="text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap font-mono">
              {code}
            </pre>
          </div>
        </div>
        
        <div className="flex items-center justify-between p-6 border-t bg-slate-50 dark:bg-slate-800/50">
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {formats.find(f => f.id === selectedFormat)?.description} - {exportModes.find(m => m.id === exportMode)?.description}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
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
              className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
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
