import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Textarea } from './ui/Textarea';
import type { CoreValue } from '../types/CoreValue';
import * as Icons from 'lucide-react';

const ICON_OPTIONS = Object.keys(Icons).filter(
  (key) =>
    key !== 'default' &&
    typeof (Icons as any)[key] === 'function' &&
    !key.startsWith('_')
);

interface CoreValueFormProps {
  initial?: CoreValue | null;
  onSave: (data: CoreValue) => void;
  onCancel: () => void;
}

export function CoreValueForm({ initial, onSave, onCancel }: CoreValueFormProps) {
  const [title, setTitle] = useState(initial?.title || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [icon, setIcon] = useState(initial?.icon || 'Heart');
  const [color, setColor] = useState(initial?.color || '#4F46E5');
  const [showIconDropdown, setShowIconDropdown] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    onSave({
      title,
      description,
      icon,
      color,
      order: initial?.order ?? 0
    });
  };

  const IconComponent = (Icons as any)[icon] || Icons.Heart;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-semibold text-gray-900">
          {initial ? 'Edit Core Value' : 'Add Core Value'}
        </h4>
        <button
          type="button"
          onClick={onCancel}
          className="p-1 text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Title</label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Integrity"
          required
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief description of this core value..."
          rows={2}
          required
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Icon</label>
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowIconDropdown(!showIconDropdown)}
            className="w-full flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <IconComponent className="w-5 h-5" />
            <span>{icon}</span>
          </button>
          {showIconDropdown && (
            <div className="absolute z-10 mt-1 w-full max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg">
              <div className="grid grid-cols-4 gap-1 p-2">
                {ICON_OPTIONS.map((iconName) => {
                  const IconComp = (Icons as any)[iconName];
                  return (
                    <button
                      key={iconName}
                      type="button"
                      onClick={() => {
                        setIcon(iconName);
                        setShowIconDropdown(false);
                      }}
                      className={`flex flex-col items-center justify-center p-2 rounded hover:bg-indigo-50 ${
                        icon === iconName ? 'bg-indigo-100' : ''
                      }`}
                      title={iconName}
                    >
                      <IconComp className="w-5 h-5 mb-1" />
                      <span className="text-[10px] text-gray-600 truncate w-full text-center">
                        {iconName}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Color</label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
          />
          <Input
            value={color}
            onChange={(e) => setColor(e.target.value)}
            placeholder="#4F46E5"
            className="flex-1"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel} size="sm">
          Cancel
        </Button>
        <Button type="submit" size="sm">
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>
      </div>
    </form>
  );
}
