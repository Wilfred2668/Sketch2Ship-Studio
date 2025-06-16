
import React, { useState, useRef } from 'react';
import { Upload, Trash2, Copy, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { Button } from './ui/button';

interface GalleryImage {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
}

interface ImageGalleryProps {
  images: GalleryImage[];
  onUpdate: (images: GalleryImage[]) => void;
  onSelectImage: (url: string) => void;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  onUpdate,
  onSelectImage
}) => {
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;

    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newImage: GalleryImage = {
            id: `img-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            name: file.name,
            url: e.target?.result as string,
            size: file.size,
            type: file.type
          };
          onUpdate([...images, newImage]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const deleteImage = (id: string) => {
    onUpdate(images.filter(img => img.id !== id));
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <ImageIcon className="w-5 h-5" />
          Image Gallery
        </h3>
        <Button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          Upload
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => handleFileUpload(e.target.files)}
        className="hidden"
      />

      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFileUpload(e.dataTransfer.files);
        }}
      >
        <ImageIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
        <p className="text-gray-500 mb-2">Drag and drop images here or click upload</p>
        <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
          Choose Files
        </Button>
      </div>

      {images.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium mb-2">Uploaded Images ({images.length})</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {images.map((image) => (
              <div key={image.id} className="group relative border border-gray-200 rounded-lg overflow-hidden">
                <img
                  src={image.url}
                  alt={image.name}
                  className="w-full h-24 object-cover cursor-pointer hover:opacity-75"
                  onClick={() => onSelectImage(image.url)}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onSelectImage(image.url)}
                      className="text-white hover:bg-white hover:text-black"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyUrl(image.url)}
                      className="text-white hover:bg-white hover:text-black"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteImage(image.id)}
                      className="text-red-400 hover:bg-red-600 hover:text-white"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <div className="p-2">
                  <p className="text-xs font-medium truncate">{image.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(image.size)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
