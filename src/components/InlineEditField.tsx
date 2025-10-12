'use client';

import { useState, useRef, useEffect } from 'react';
import { Check, X, Edit2 } from 'lucide-react';

interface InlineEditFieldProps {
  value: string;
  onSave: (newValue: string) => Promise<void>;
  placeholder?: string;
  label?: string;
  type?: 'text' | 'tel' | 'date';
  icon?: React.ReactNode;
}

export function InlineEditField({
  value,
  onSave,
  placeholder = 'Not set',
  label,
  type = 'text',
  icon,
}: InlineEditFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value || '');
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = async () => {
    if (currentValue === value) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    try {
      await onSave(currentValue);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving:', error);
      setCurrentValue(value || '');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setCurrentValue(value || '');
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (!isEditing) {
    return (
      <div className="flex items-center gap-3">
        {icon && <div className="text-brand-subtle">{icon}</div>}
        <div className="flex-1">
          {label && <div className="text-sm text-brand-subtle mb-1">{label}</div>}
          <div className="flex items-center gap-2 group">
            <span className="text-brand-ink">
              {value || <span className="text-brand-subtle italic">{placeholder}</span>}
            </span>
            <button
              onClick={() => setIsEditing(true)}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-brand-primary hover:text-brand-primary/80"
              title="Edit"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {icon && <div className="text-brand-subtle">{icon}</div>}
      <div className="flex-1">
        {label && <div className="text-sm text-brand-subtle mb-1">{label}</div>}
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type={type}
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            disabled={isSaving}
            className="flex-1 px-3 py-2 rounded-lg border border-brand-ink/20 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder={placeholder}
          />
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="p-2 rounded-lg bg-brand-success text-white hover:bg-brand-success/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Save"
          >
            <Check className="w-4 h-4" />
          </button>
          <button
            onClick={handleCancel}
            disabled={isSaving}
            className="p-2 rounded-lg bg-brand-error/10 text-brand-error hover:bg-brand-error/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Cancel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

