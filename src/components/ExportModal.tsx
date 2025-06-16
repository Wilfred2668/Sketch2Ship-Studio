import React, { useState } from 'react';
import { X, Download, Copy, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Page } from './WebsiteBuilder';

interface ExportModalProps {
  pages: Page[];
  onClose: () => void;
}

type ExportFormat = 'html' | 'react' | 'vue' | 'nextjs';

export const ExportModal: React.FC<ExportModalProps> = ({ pages, onClose }) => {
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

      .page {
        display: none;
        position: relative;
        min-height: 100vh;
        width: 100%;
      }

      .page.active {
        display: block;
      }

      .navigation {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: white;
        border-bottom: 1px solid #e2e8f0;
        padding: 1rem;
        z-index: 1000;
      }

      .nav-button {
        background: #ea580c;
        color: white;
        border: none;
        padding: 8px 16px;
        margin-right: 8px;
        border-radius: 4px;
        cursor: pointer;
      }

      .nav-button:hover {
        background: #dc2626;
      }

      .nav-button.active {
        background: #b91c1c;
      }

      /* Responsive Slideshow */
      .slideshow-container {
        position: relative;
        overflow: hidden;
      }
      
      .slideshow-container img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      /* Responsive Accordion */
      .accordion-container {
        width: 100%;
      }
      
      .accordion-section {
        border-bottom: 1px solid #e2e8f0;
      }
      
      .accordion-header {
        width: 100%;
        padding: 12px 16px;
        background: #f8fafc;
        border: none;
        text-align: left;
        cursor: pointer;
        font-weight: 500;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .accordion-header:hover {
        background: #f1f5f9;
      }
      
      .accordion-content {
        padding: 12px 16px;
        background: white;
        display: none;
      }
      
      .accordion-content.active {
        display: block;
      }

      /* Responsive Design */
      @media (max-width: 768px) {
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
        .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`)
        .join('; ');

      const positionStyle = `left: ${element.position.x}px; top: ${element.position.y}px;`;
      const fullStyle = `${styleString}; ${positionStyle}`;

      switch (element.type) {
        case 'slideshow':
          const images = element.content.split('\n').filter((img: string) => img.trim());
          return `    <div class="element slideshow-container" style="${fullStyle}">
      ${images.length > 0 ? `<img src="${images[0]}" alt="Slideshow" />` : '<div style="width: 100%; height: 100%; background: #f1f5f9; display: flex; align-items: center; justify-content: center;">Slideshow</div>'}
    </div>`;
        case 'accordion':
          const sections = element.content.split('\n').filter((section: string) => section.trim()).map((section: string) => {
            const [title, content] = section.split('|');
            return { title: title?.trim() || 'Section', content: content?.trim() || 'Content' };
          });
          const accordionHTML = sections.map((section: any, index: number) => `
        <div class="accordion-section">
          <button class="accordion-header" onclick="toggleAccordion(${index})">
            ${section.title}
            <span>▼</span>
          </button>
          <div class="accordion-content" id="accordion-${index}">
            ${section.content}
          </div>
        </div>`).join('');
          return `    <div class="element accordion-container" style="${fullStyle}">${accordionHTML}
    </div>`;
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
          const listItems = element.content.split('\n').filter((item: string) => item.trim()).map((item: string) => `<li>${item.trim()}</li>`).join('');
          return `    <ul class="element" style="${fullStyle}">${listItems}</ul>`;
        case 'quote':
          return `    <blockquote class="element" style="${fullStyle}">"${element.content}"</blockquote>`;
        default:
          return `    <div class="element" style="${fullStyle}">${element.content}</div>`;
      }
    };

    // Generate HTML for all pages
    const pagesHTML = pages.map((page, index) => {
      const elementsHTML = page.elements.map(generateElementHTML).join('\n');
      return `  <div class="page ${index === 0 ? 'active' : ''}" id="${page.id}">
${elementsHTML}
  </div>`;
    }).join('\n');

    const navigationHTML = pages.length > 1 ? `
  <div class="navigation">
    ${pages.map((page, index) => 
      `<button class="nav-button ${index === 0 ? 'active' : ''}" onclick="showPage('${page.id}')">${page.name}</button>`
    ).join('')}
  </div>` : '';

    const script = `
    <script>
      function toggleAccordion(index) {
        const content = document.getElementById('accordion-' + index);
        content.classList.toggle('active');
      }

      function showPage(pageId) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
          page.classList.remove('active');
        });
        
        // Show selected page
        document.getElementById(pageId).classList.add('active');
        
        // Update navigation buttons
        document.querySelectorAll('.nav-button').forEach(btn => {
          btn.classList.remove('active');
        });
        event.target.classList.add('active');
      }
    </script>`;

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Website</title>
    ${styles}
</head>
<body>
${navigationHTML}
  <div style="padding-top: ${pages.length > 1 ? '80px' : '0'};">
${pagesHTML}
  </div>
${script}
</body>
</html>`;
  };

  const generateReact = () => {
    // Generate components for all pages
    const pagesJSX = pages.map((page, index) => {
      const elementsJSX = page.elements.map(element => {
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
          default:
            return `    <div style={${fullStyle}}>${element.content}</div>`;
        }
      }).join('\n');

      return `  const ${page.name.replace(/\s+/g, '')}Page = () => (
    <div style={{ position: 'relative', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
${elementsJSX}
    </div>
  );`;
    }).join('\n\n');

    return `import React, { useState } from 'react';

${pagesJSX}

const MyWebsite = () => {
  const [currentPage, setCurrentPage] = useState('${pages[0].name.replace(/\s+/g, '')}');

  const renderPage = () => {
    switch(currentPage) {
      ${pages.map(page => `case '${page.name.replace(/\s+/g, '')}': return <${page.name.replace(/\s+/g, '')}Page />;`).join('\n      ')}
      default: return <${pages[0].name.replace(/\s+/g, '')}Page />;
    }
  };

  return (
    <div>
      ${pages.length > 1 ? `<nav style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>
        ${pages.map(page => `<button 
          onClick={() => setCurrentPage('${page.name.replace(/\s+/g, '')}')}
          style={{
            padding: '8px 16px',
            marginRight: '8px',
            background: currentPage === '${page.name.replace(/\s+/g, '')}' ? '#b91c1c' : '#ea580c',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          ${page.name}
        </button>`).join('\n        ')}
      </nav>` : ''}
      {renderPage()}
    </div>
  );
};

export default MyWebsite;`;
  };

  const generateVue = () => {
    return `<template>
  <div>
    ${pages.length > 1 ? `<nav style="padding: 1rem; border-bottom: 1px solid #e2e8f0;">
      ${pages.map(page => `<button @click="currentPage = '${page.name.replace(/\s+/g, '')}'" 
              :style="{ padding: '8px 16px', marginRight: '8px', background: currentPage === '${page.name.replace(/\s+/g, '')}' ? '#b91c1c' : '#ea580c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }">
        ${page.name}
      </button>`).join('\n      ')}
    </nav>` : ''}
    
    ${pages.map(page => `<div v-if="currentPage === '${page.name.replace(/\s+/g, '')}'" style="position: relative; min-height: 100vh; font-family: Arial, sans-serif;">
      <!-- ${page.name} page with ${page.elements.length} elements -->
      <div>Page: ${page.name}</div>
    </div>`).join('\n    ')}
  </div>
</template>

<script>
export default {
  name: 'MyWebsite',
  data() {
    return {
      currentPage: '${pages[0].name.replace(/\s+/g, '')}'
    }
  }
}
</script>`;
  };

  const generateNextJS = () => {
    return `import Head from 'next/head';
import { useState } from 'react';

export default function Home() {
  const [currentPage, setCurrentPage] = useState('${pages[0].name.replace(/\s+/g, '')}');

  return (
    <>
      <Head>
        <title>My Website</title>
        <meta name="description" content="Generated with Sketch2Ship Studio" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
        ${pages.length > 1 ? `<nav style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>
          ${pages.map(page => `<button 
            onClick={() => setCurrentPage('${page.name.replace(/\s+/g, '')}')}
            style={{
              padding: '8px 16px',
              marginRight: '8px',
              background: currentPage === '${page.name.replace(/\s+/g, '')}' ? '#b91c1c' : '#ea580c',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            ${page.name}
          </button>`).join('\n          ')}
        </nav>` : ''}
        
        <div style={{ position: 'relative', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
          {/* Website with ${pages.length} pages exported from Sketch2Ship Studio */}
          <h1>Website with {${pages.length}} pages</h1>
        </div>
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
        return 'MyWebsite.jsx';
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
    { id: 'html', label: 'HTML', description: 'Complete multi-page HTML website' },
    { id: 'react', label: 'React', description: 'React multi-page component' },
    { id: 'vue', label: 'Vue.js', description: 'Vue multi-page component' },
    { id: 'nextjs', label: 'Next.js', description: 'Next.js multi-page application' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Export Complete Website</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Exporting {pages.length} page{pages.length !== 1 ? 's' : ''}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex items-center gap-4 p-6 border-b bg-slate-50 dark:bg-slate-800/50">
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
              {formats.find(f => f.id === selectedFormat)?.description}
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
