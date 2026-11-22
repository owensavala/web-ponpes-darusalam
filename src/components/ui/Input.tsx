'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, required, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-bold text-[#0F2A24] mb-1.5 uppercase tracking-wide">
            {label} {required && <span className="text-rose-500">*</span>}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            'w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white text-[#0F2A24] placeholder:text-slate-400 transition focus:outline-none focus:ring-2 focus:ring-[#173B32] focus:border-transparent',
            error
              ? 'border-rose-300 focus:ring-rose-400 bg-rose-50/30'
              : 'border-slate-300 hover:border-[#173B32]/40',
            className
          )}
          required={required}
          {...props}
        />
        {helperText && !error && <p className="mt-1 text-xs text-slate-500">{helperText}</p>}
        {error && <p className="mt-1 text-xs text-rose-600 font-medium">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, required, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={textareaId} className="block text-xs font-bold text-[#0F2A24] mb-1.5 uppercase tracking-wide">
            {label} {required && <span className="text-rose-500">*</span>}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          rows={props.rows || 4}
          className={cn(
            'w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white text-[#0F2A24] placeholder:text-slate-400 transition focus:outline-none focus:ring-2 focus:ring-[#173B32] focus:border-transparent',
            error
              ? 'border-rose-300 focus:ring-rose-400 bg-rose-50/30'
              : 'border-slate-300 hover:border-[#173B32]/40',
            className
          )}
          required={required}
          {...props}
        />
        {helperText && !error && <p className="mt-1 text-xs text-slate-500">{helperText}</p>}
        {error && <p className="mt-1 text-xs text-rose-600 font-medium">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options?: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, helperText, id, required, options, children, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className="block text-xs font-bold text-[#0F2A24] mb-1.5 uppercase tracking-wide">
            {label} {required && <span className="text-rose-500">*</span>}
          </label>
        )}
        <select
          id={selectId}
          ref={ref}
          className={cn(
            'w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white text-[#0F2A24] transition focus:outline-none focus:ring-2 focus:ring-[#173B32] focus:border-transparent',
            error
              ? 'border-rose-300 focus:ring-rose-400 bg-rose-50/30'
              : 'border-slate-300 hover:border-[#173B32]/40',
            className
          )}
          required={required}
          {...props}
        >
          {options
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))
            : children}
        </select>
        {helperText && !error && <p className="mt-1 text-xs text-slate-500">{helperText}</p>}
        {error && <p className="mt-1 text-xs text-rose-600 font-medium">{error}</p>}
      </div>
    );
  }
);
Select.displayName = 'Select';
