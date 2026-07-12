import React, { useEffect, useState, useRef } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { API_BASE } from '../../config';

interface FileImageUploadProps {
  value?: string;
  onChange: (file: File | null) => void;
  maxSizeMB?: number;
  label?: string;
}
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

function resolvePreviewUrl(value?: string | null): string | null {
  if (!value) return null;
  if (/^https?:\/\//i.test(value) || value.startsWith('data:') || value.startsWith('blob:')) {
    return value;
  }

  if (value.startsWith('/')) {
    return `${API_BASE}${value}`;
  }

  return value;
}

export function FileImageUpload({
  value,
  onChange,
  maxSizeMB = 5,
  label
}: FileImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(() => resolvePreviewUrl(value) ?? null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    setPreview(resolvePreviewUrl(value) ?? null);
  }, [value]);
  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return 'File must be JPEG, PNG, or WebP';
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      return `File must be smaller than ${maxSizeMB}MB`;
    }
    return null;
  };
  const handleFile = (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setUploading(true);
    setProgress(0);
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    // Simulate upload progress
    const start = Date.now();
    const duration = 1500;
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(elapsed / duration * 100, 100);
      setProgress(pct);
      if (elapsed >= duration) {
        clearInterval(interval);
        setUploading(false);
        onChange(file);
      }
    }, 50);
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    setError(null);
    onChange(null);
    if (inputRef.current) inputRef.current.value = '';
  };
  return (
    <div className="w-full">
      {label &&
      <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      }

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleInputChange}
        className="sr-only"
        aria-label={label || 'Upload image'} />
      

      {preview ?
      <div className="relative rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
          <img
          src={preview}
          alt="Preview"
          className="w-full max-h-40 object-cover" />
        
          {uploading &&
        <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
              <div className="w-2/3">
                <div className="flex items-center gap-2 mb-2 text-indigo-600 text-sm font-medium justify-center">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading…
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                className="bg-indigo-600 h-1.5 rounded-full transition-all"
                style={{
                  width: `${progress}%`
                }} />
              
                </div>
              </div>
            </div>
        }
          {!uploading &&
        <button
          type="button"
          onClick={handleRemove}
          className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 transition-colors"
          aria-label="Remove image">
          
              <X className="w-4 h-4 text-gray-700" />
            </button>
        }
        </div> :

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`w-full border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center transition-colors cursor-pointer ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}>
        
          <div className="p-3 bg-white rounded-full shadow-sm mb-3">
            <Upload className="w-5 h-5 text-indigo-500" />
          </div>
          <p className="text-sm font-medium text-gray-900 mb-1">
            Drop an image, or click to browse
          </p>
          <p className="text-xs text-gray-500">
            JPEG, PNG, or WebP up to {maxSizeMB}MB
          </p>
        </button>
      }

      {error && <p className="mt-2 text-sm text-rose-600">{error}</p>}
    </div>);

}