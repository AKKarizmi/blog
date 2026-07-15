import { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';
interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}
export function ImageUpload({ value, onChange, label }: ImageUploadProps) {
  const [isEditing, setIsEditing] = useState(!value);
  const [tempUrl, setTempUrl] = useState(value);
  const handleApply = () => {
    onChange(tempUrl);
    if (tempUrl) setIsEditing(false);
  };
  return (
    <div className="w-full">
      {label &&
      <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      }

      {!isEditing && value ?
      <div className="relative rounded-lg border border-gray-200 overflow-hidden group bg-gray-50 flex items-center justify-center h-48">
          <img
          src={value}
          alt="Preview"
          className="max-h-full max-w-full object-contain" />
        
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="bg-white text-gray-900 px-3 py-1.5 rounded-md text-sm font-medium shadow-sm hover:bg-gray-50">
            
              Change Image
            </button>
          </div>
        </div> :

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors">
          <div className="p-3 bg-white rounded-full shadow-sm mb-3">
            <ImageIcon className="w-6 h-6 text-indigo-500" />
          </div>
          <p className="text-sm font-medium text-gray-900 mb-1">
            Upload an image
          </p>
          <p className="text-xs text-gray-500 mb-4 text-center max-w-xs">
            For this demo, paste a valid image URL below.
          </p>
          <div className="flex w-full max-w-sm gap-2">
            <input
            type="url"
            placeholder="https://example.com/image.jpg"
            value={tempUrl}
            onChange={(e) => setTempUrl(e.target.value)}
            className="flex-1 rounded-md border-gray-300 border bg-white py-1.5 px-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
          
            <button
            type="button"
            onClick={handleApply}
            className="bg-indigo-600 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-indigo-700">
            
              Apply
            </button>
          </div>
          {value &&
        <button
          type="button"
          onClick={() => {
            setTempUrl(value);
            setIsEditing(false);
          }}
          className="mt-3 text-sm text-gray-500 hover:text-gray-700">
          
              Cancel
            </button>
        }
        </div>
      }
    </div>);

}