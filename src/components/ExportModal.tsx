import React, { useState } from 'react';
import { X, Download, Copy, Check } from 'lucide-react';
import { Element } from '../types/builder';
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
      
      .page {
        display: none;
        position: relative;
        min-height: 100vh;
        padding: 20px;
      }
      
      .page.active {
        display: block;
      }
      
      .element {
        position: absolute;
      }

      .page-navigation {
        position: fixed;
        top: 20px;
        left: 20px;
        z-index: 1000;
        background: white;
        padding: 10px;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      }

      .page-nav-button {
        margin: 0 5px;
        padding: 8px 12px;
        border: 1px solid #ddd;
        background: white;
        cursor: pointer;
        border-radius: 4px;
      }

      .page-nav-button.active {
        background: #007bff;
        color: white;
      }

      /* Keep existing component styles */
      .slideshow-container {
        position: relative;
        overflow: hidden;
      }
      
      .slideshow-container img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

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

    const generateElementHTML = (element: Element) => {
      const styleString = Object.entries(element.styles)
        .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`)
        .join('; ');

      const positionStyle = `left: ${element.position.x}px; top: ${element.position.y}px;`;
      const fullStyle = `${styleString}; ${positionStyle}`;

      switch (element.type) {
        case 'slideshow':
          const images = element.content.split('\n').filter(img => img.trim());
          return `    <div class="element slideshow-container" style="${fullStyle}">
      ${images.length > 0 ? `<img src="${images[0]}" alt="Slideshow" />` : '<div style="width: 100%; height: 100%; background: #f1f5f9; display: flex; align-items: center; justify-content: center;">Slideshow</div>'}
    </div>`;
        case 'accordion':
          const sections = element.content.split('\n').filter(section => section.trim()).map(section => {
            const [title, content] = section.split('|');
            return { title: title?.trim() || 'Section', content: content?.trim() || 'Content' };
          });
          const accordionHTML = sections.map((section, index) => `
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
        case 'button':
          const buttonLink = element.linkTo ? 
            (element.linkTo.type === 'page' ? `onclick="showPage('${element.linkTo.value}')"` : `onclick="window.open('${element.linkTo.value}', '_blank')"`) : '';
          return `    <button class="element" style="${fullStyle}" ${buttonLink}>${element.content}</button>`;
        case 'link':
          const linkHref = element.linkTo ? 
            (element.linkTo.type === 'page' ? `href="#" onclick="showPage('${element.linkTo.value}'); return false;"` : `href="${element.linkTo.value}" target="_blank"`) : 'href="#"';
          return `    <a class="element" ${linkHref} style="${fullStyle}">${element.content}</a>`;
        case 'text':
          return `    <span class="element" style="${fullStyle}">${element.content}</span>`;
        case 'heading':
          return `    <h2 class="element" style="${fullStyle}">${element.content}</h2>`;
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
    };

    const pagesHTML = pages.map((page, index) => `
  <div class="page ${index === 0 ? 'active' : ''}" id="page-${page.id}">
${page.elements.map(generateElementHTML).join('\n')}
  </div>`).join('\n');

    const navigationHTML = pages.length > 1 ? `
    <div class="page-navigation">
      ${pages.map((page, index) => `
        <button class="page-nav-button ${index === 0 ? 'active' : ''}" onclick="showPage('${page.id}')">${page.name}</button>
      `).join('')}
    </div>` : '';

    const script = `
    <script>
      function showPage(pageId) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
          page.classList.remove('active');
        });
        
        // Show selected page
        document.getElementById('page-' + pageId).classList.add('active');
        
        // Update navigation buttons
        document.querySelectorAll('.page-nav-button').forEach(btn => {
          btn.classList.remove('active');
        });
        event.target.classList.add('active');
      }

      function toggleAccordion(index) {
        const content = document.getElementById('accordion-' + index);
        content.classList.toggle('active');
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
${pagesHTML}
${script}
</body>
</html>`;
  };

  const generateReact = () => {
    const pagesJSX = pages.map(page => {
      const elementsJSX = page.elements.map(element => {
        const styleObj = Object.entries(element.styles)
          .map(([key, value]) => `    ${key}: '${value}'`)
          .join(',\n');
        
        const positionStyle = `    position: 'absolute',\n    left: '${element.position.x}px',\n    top: '${element.position.y}px'`;
        const fullStyle = `{\n${styleObj},\n${positionStyle}\n  }`;

        switch (element.type) {
          case 'button':
            return `    <button style={${fullStyle}} onClick={() => ${element.linkTo ? (element.linkTo.type === 'page' ? `setCurrentPage('${element.linkTo.value}')` : `window.open('${element.linkTo.value}', '_blank')`) : 'console.log("Button clicked")'}}>${element.content}</button>`;
          case 'text':
            return `    <span style={${fullStyle}}>${element.content}</span>`;
          case 'heading':
            return `    <h2 style={${fullStyle}}>${element.content}</h2>`;
          default:
            return `    <div style={${fullStyle}}>${element.content}</div>`;
        }
      }).join('\n');

      return `  const ${page.name.replace(/\s+/g, '')}Page = () => (
    <div style={{ position: 'relative', minHeight: '100vh', padding: '20px' }}>
${elementsJSX}
    </div>
  );`;
    }).join('\n\n');

    return `import React, { useState } from 'react';

const MyWebsite = () => {
  const [currentPage, setCurrentPage] = useState('${pages[0].id}');

${pagesJSX}

  const renderPage = () => {
    switch(currentPage) {
${pages.map(page => `      case '${page.id}': return <${page.name.replace(/\s+/g, '')}Page />;`).join('\n')}
      default: return <${pages[0].name.replace(/\s+/g, '')}Page />;
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      ${pages.length > 1 ? `<div style={{ position: 'fixed', top: '20px', left: '20px', zIndex: 1000, background: 'white', padding: '10px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        ${pages.map(page => `<button onClick={() => setCurrentPage('${page.id}')} style={{ margin: '0 5px', padding: '8px 12px', border: '1px solid #ddd', background: currentPage === '${page.id}' ? '#007bff' : 'white', color: currentPage === '${page.id}' ? 'white' : 'black', cursor: 'pointer', borderRadius: '4px' }}>${page.name}</button>`).join('\n        ')}
      </div>` : ''}
      {renderPage()}
    </div>
  );
};

export default MyWebsite;`;
  };

  const generateVue = () => {
    const pagesTemplate = pages.map(page => {
      const elementsTemplate = page.elements.map(element => {
        const styleObj = Object.entries(element.styles)
          .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`)
          .join('; ');
        
        const positionStyle = `position: absolute; left: ${element.position.x}px; top: ${element.position.y}px`;
        const fullStyle = `${styleObj}; ${positionStyle}`;

        switch (element.type) {
          case 'slideshow':
            const images = element.content.split('\n').filter(img => img.trim());
            return `    <div class="element slideshow-container" style="${fullStyle}">
              ${images.length > 0 ? `<img src="${images[0]}" alt="Slideshow" />` : '<div style="width: 100%; height: 100%; background: #f1f5f9; display: flex; align-items: center; justify-content: center;">Slideshow</div>'}
            </div>`;
          case 'accordion':
            const sections = element.content.split('\n').filter(section => section.trim()).map(section => {
              const [title, content] = section.split('|');
              return { title: title?.trim() || 'Section', content: content?.trim() || 'Content' };
            });
            const accordionHTML = sections.map((section, index) => `
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
              ${element.content ? `<span style={{fontSize: '12px', color: '#888'}}>${element.content}</span>` : ''}
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

      return `  <div class="page ${page.id}" style="position: relative; min-height: 100vh; padding: 20px;">
        ${elementsTemplate}
      </div>`;
    }).join('\n');

    return `<template>
  <div style="font-family: Arial, sans-serif;">
    <div v-if="pages.length > 1" class="page-navigation">
      <button v-for="page in pages" :key="page.id" 
              @click="currentPage = page.id"
              :class="{ active: currentPage === page.id }"
              class="page-nav-button">
        {{ page.name }}
      </button>
    </div>
    <div v-for="page in pages" :key="page.id" 
         v-show="currentPage === page.id"
         class="page">
      ${pagesTemplate}
    </div>
  </div>
</template>

<script>
export default {
  name: 'MyWebsite',
  data() {
    return {
      currentPage: '${pages[0].id}',
      pages: ${JSON.stringify(pages, null, 2)}
    }
  }
}
</script>`;
  };

  const generateNextJS = () => {
    const pagesJSX = pages.map(page => {
      const elementsJSX = page.elements.map(element => {
        const styleObj = Object.entries(element.styles)
          .map(([key, value]) => `    ${key}: '${value}'`)
          .join(',\n');
        
        const positionStyle = `    position: 'absolute',\n    left: '${element.position.x}px',\n    top: '${element.position.y}px'`;
        const fullStyle = `{\n${styleObj},\n${positionStyle}\n  }`;

        switch (element.type) {
          case 'button':
            return `    <button style={${fullStyle}} onClick={() => ${element.linkTo ? (element.linkTo.type === 'page' ? `setCurrentPage('${element.linkTo.value}')` : `window.open('${element.linkTo.value}', '_blank')`) : 'console.log("Button clicked")'}}>${element.content}</button>`;
          case 'text':
            return `    <span style={${fullStyle}}>${element.content}</span>`;
          case 'heading':
            return `    <h2 style={${fullStyle}}>${element.content}</h2>`;
          default:
            return `    <div style={${fullStyle}}>${element.content}</div>`;
        }
      }).join('\n');

      return `  const ${page.name.replace(/\s+/g, '')}Page = () => (
    <div style={{ position: 'relative', minHeight: '100vh', padding: '20px' }}>
${elementsJSX}
    </div>
  );`;
    }).join('\n\n');

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
${pagesJSX}
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
        return 'MyWebsite.vue';
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
    { id: 'html', label: 'HTML', description: 'Multi-page HTML with navigation' },
    { id: 'react', label: 'React', description: 'React component with page routing' },
    { id: 'vue', label: 'Vue.js', description: 'Vue component with page navigation' },
    { id: 'nextjs', label: 'Next.js', description: 'Next.js page with routing' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col border border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200/50 dark:border-gray-700/50">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Export Multi-Page Website</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 p-4 sm:p-6 border-b border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-900/50">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Export Format:</span>
          <div className="flex flex-wrap gap-2">
            {formats.map((format) => (
              <button
                key={format.id}
                onClick={() => setSelectedFormat(format.id as ExportFormat)}
                className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                  selectedFormat === format.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'bg-white/80 dark:bg-gray-700/80 text-gray-600 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-600/80 border border-gray-200/50 dark:border-gray-600/50'
                }`}
              >
                {format.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex-1 p-4 sm:p-6 overflow-hidden">
          <div className="h-full bg-gray-50/50 dark:bg-gray-900/50 rounded-lg p-4 overflow-auto border border-gray-200/50 dark:border-gray-700/50">
            <pre className="text-xs sm:text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap font-mono">
              {code}
            </pre>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 border-t border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-900/50 gap-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {formats.find(f => f.id === selectedFormat)?.description}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              Includes all {pages.length} page{pages.length > 1 ? 's' : ''} with navigation • Download as {getFileName()}
            </p>
          </div>
          <div className="flex space-x-3 w-full sm:w-auto">
            <Button
              onClick={handleCopy}
              variant="outline"
              className="flex items-center gap-2 flex-1 sm:flex-none"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy Code'}
            </Button>
            <Button
              onClick={handleDownload}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 flex-1 sm:flex-none"
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
