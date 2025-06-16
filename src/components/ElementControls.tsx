
import React from 'react';

interface ElementControlsProps {
  onDuplicate: () => void;
  onDelete: () => void;
}

export const ElementControls: React.FC<ElementControlsProps> = ({
  onDuplicate,
  onDelete
}) => {
  return (
    <div 
      className="absolute -top-8 left-0 flex gap-1 bg-blue-500 text-white text-xs px-2 py-1 rounded z-10"
      style={{ fontSize: '10px' }}
    >
      <button onClick={onDuplicate} className="hover:bg-blue-600 px-1 rounded">Copy</button>
      <button onClick={onDelete} className="hover:bg-red-600 px-1 rounded">Delete</button>
    </div>
  );
};
