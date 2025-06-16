
import React, { useState } from 'react';
import { Share2, Copy, ExternalLink, Code } from 'lucide-react';
import { Button } from './ui/button';
import { Element } from '../types/builder';

interface PublicLinkGeneratorProps {
  elements: Element[];
  siteName: string;
  onGenerateLink: (link: string) => void;
}

export const PublicLinkGenerator: React.FC<PublicLinkGeneratorProps> = ({
  elements,
  siteName,
  onGenerateLink
}) => {
  const [generatedLink, setGeneratedLink] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCode, setShowCode] = useState(false);

  const generateHTML = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${siteName || 'My Website'}</title>
    <style>
        body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
        .element { position: absolute; }
        .container { position: relative; min-height: 100vh; }
        .navigation { display: flex; background: white; border: 1px solid #e2e8f0; }
        .nav-link { padding: 12px 16px; text-decoration: none; color: #374151; border-right: 1px solid #e2e8f0; }
        .nav-link:hover { background: #f9fafb; }
        .accordion { background: white; border: 1px solid #e2e8f0; border-radius: 8px; }
        .accordion-item { border-bottom: 1px solid #e2e8f0; }
        .accordion-header { padding: 12px 16px; background: #f9fafb; cursor: pointer; }
        .accordion-content { padding: 12px 16px; display: none; }
        .accordion-content.open { display: block; }
    </style>
</head>
<body>
    <div class="container">
        ${elements.map(element => {
          const styles = Object.entries(element.styles)
            .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`)
            .join('; ');
          
          switch (element.type) {
            case 'navigation':
              const navItems = element.content.split('\n').filter(Boolean);
              return `<nav class="element navigation" style="left: ${element.position.x}px; top: ${element.position.y}px; ${styles}">
                ${navItems.map(item => {
                  const [label, url] = item.split('|');
                  return `<a href="${url || '#'}" class="nav-link">${label || 'Link'}</a>`;
                }).join('')}
              </nav>`;
            
            case 'accordion':
              const sections = element.content.split('\n').filter(Boolean);
              return `<div class="element accordion" style="left: ${element.position.x}px; top: ${element.position.y}px; ${styles}">
                ${sections.map((section, index) => {
                  const [title, content] = section.split('|');
                  return `<div class="accordion-item">
                    <div class="accordion-header" onclick="toggleAccordion(${index})">${title || 'Section'}</div>
                    <div class="accordion-content" id="content-${index}">${content || 'Content'}</div>
                  </div>`;
                }).join('')}
              </div>`;
            
            case 'image':
              return element.content ? 
                `<img class="element" src="${element.content}" style="left: ${element.position.x}px; top: ${element.position.y}px; ${styles}" alt="Image" />` : 
                `<div class="element" style="left: ${element.position.x}px; top: ${element.position.y}px; ${styles}; border: 2px dashed #ccc; padding: 20px;">Image Placeholder</div>`;
            
            case 'heading':
              return `<h1 class="element" style="left: ${element.position.x}px; top: ${element.position.y}px; ${styles}">${element.content}</h1>`;
            
            case 'text':
              return `<div class="element" style="left: ${element.position.x}px; top: ${element.position.y}px; ${styles}">${element.content}</div>`;
            
            case 'button':
              return `<button class="element" style="left: ${element.position.x}px; top: ${element.position.y}px; ${styles}">${element.content}</button>`;
            
            default:
              return `<div class="element" style="left: ${element.position.x}px; top: ${element.position.y}px; ${styles}">${element.content}</div>`;
          }
        }).join('\n        ')}
    </div>
    
    <script>
        function toggleAccordion(index) {
            const content = document.getElementById('content-' + index);
            content.classList.toggle('open');
        }
    </script>
</body>
</html>`;
    
    return htmlContent;
  };

  const generatePublicLink = async () => {
    setIsGenerating(true);
    
    try {
      // Simulate generating a public link (in a real app, you'd upload to a service)
      const htmlContent = generateHTML();
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      // In a real implementation, you'd upload this to a hosting service
      // For now, we'll create a downloadable link
      const timestamp = Date.now();
      const mockPublicLink = `https://your-site.com/sites/${timestamp}`;
      
      setGeneratedLink(mockPublicLink);
      onGenerateLink(mockPublicLink);
    } catch (error) {
      console.error('Error generating link:', error);
    }
    
    setIsGenerating(false);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(generatedLink);
  };

  const downloadHTML = () => {
    const htmlContent = generateHTML();
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${siteName || 'website'}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Share2 className="w-5 h-5" />
          Publish Website
        </h3>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 mb-3">
            Generate a public link to share your website or download the HTML code.
          </p>
          
          <div className="flex gap-2">
            <Button
              onClick={generatePublicLink}
              disabled={isGenerating}
              className="flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              {isGenerating ? 'Generating...' : 'Generate Public Link'}
            </Button>
            
            <Button
              variant="outline"
              onClick={downloadHTML}
              className="flex items-center gap-2"
            >
              <Code className="w-4 h-4" />
              Download HTML
            </Button>
          </div>
        </div>

        {generatedLink && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-green-800">Public Link Generated!</p>
                <p className="text-sm text-green-600 break-all">{generatedLink}</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={copyLink}
                className="ml-2"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        <div>
          <Button
            variant="outline"
            onClick={() => setShowCode(!showCode)}
            className="flex items-center gap-2"
          >
            <Code className="w-4 h-4" />
            {showCode ? 'Hide' : 'Show'} Generated Code
          </Button>
          
          {showCode && (
            <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <pre className="text-xs overflow-auto max-h-64">
                <code>{generateHTML()}</code>
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
