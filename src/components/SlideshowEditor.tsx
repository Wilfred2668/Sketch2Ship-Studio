
import React from 'react';
import { Plus, Trash2, Upload } from 'lucide-react';
import { Button } from './ui/button';

interface SlideshowEditorProps {
  images: string[];
  onUpdate: (images: string[]) => void;
}

export const SlideshowEditor: React.FC<SlideshowEditorProps> = ({ images, onUpdate }) => {
  const addImage = () => {
    const newImages = [...images, 'https://via.placeholder.com/400x300'];
    onUpdate(newImages);
  };

  const deleteImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onUpdate(newImages);
  };

  const updateImage = (index: number, url: string) => {
    const newImages = images.map((img, i) => i === index ? url : img);
    onUpdate(newImages);
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Slideshow Images</h3>
        <Button size="sm" onClick={addImage} className="flex items-center gap-1">
          <Plus className="w-3 h-3" />
          Add Image
        </Button>
      </div>
      
      {images.map((image, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-3 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">Image {index + 1}</span>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => deleteImage(index)}
              className="flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
          
          <div className="space-y-2">
            <input
              type="text"
              value={image}
              onChange={(e) => updateImage(index, e.target.value)}
              placeholder="Image URL"
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
            />
            <div className="w-full h-20 bg-gray-100 border border-dashed border-gray-300 rounded flex items-center justify-center overflow-hidden">
              {image ? (
                <img src={image} alt={`Slide ${index + 1}`} className="h-full object-cover" />
              ) : (
                <Upload className="w-6 h-6 text-gray-400" />
              )}
            </div>
          </div>
        </div>
      ))}
      
      {images.length === 0 && (
        <div className="text-center py-4 text-gray-500 text-sm">
          No images added yet. Click "Add Image" to get started.
        </div>
      )}
    </div>
  );
};
