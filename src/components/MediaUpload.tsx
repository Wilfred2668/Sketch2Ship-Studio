
import React, { useRef } from 'react';
import { Upload, Link, Image, Video } from 'lucide-react';
import { Button } from './ui/button';

interface MediaUploadProps {
  type: 'image' | 'video';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const MediaUpload: React.FC<MediaUploadProps> = ({
  type,
  value,
  onChange,
  placeholder
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onChange(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlInput = (url: string) => {
    onChange(url);
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          Upload {type}
        </Button>
        
        <input
          ref={fileInputRef}
          type="file"
          accept={type === 'image' ? 'image/*' : 'video/*'}
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      <div className="flex items-center gap-2">
        <Link className="w-4 h-4 text-gray-500" />
        <input
          type="url"
          value={value}
          onChange={(e) => handleUrlInput(e.target.value)}
          placeholder={placeholder || `Enter ${type} URL`}
          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-background text-sm"
        />
      </div>

      {value && (
        <div className="w-full h-24 bg-gray-100 dark:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center overflow-hidden">
          {type === 'image' ? (
            value.startsWith('data:') || value.includes('http') ? (
              <img src={value} alt="Preview" className="h-full object-cover" />
            ) : (
              <div className="flex items-center gap-2 text-gray-500">
                <Image className="w-4 h-4" />
                <span className="text-xs">Image selected</span>
              </div>
            )
          ) : (
            value.startsWith('data:') || value.includes('http') ? (
              <video src={value} className="h-full object-cover" controls />
            ) : (
              <div className="flex items-center gap-2 text-gray-500">
                <Video className="w-4 h-4" />
                <span className="text-xs">Video selected</span>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};
