'use client';

import React from 'react';
import { Trash2 } from 'lucide-react';

interface DeleteConfirmButtonProps {
  confirmMessage: string;
  className?: string;
}

export default function DeleteConfirmButton({ confirmMessage, className }: DeleteConfirmButtonProps) {
  return (
    <button
      type="submit"
      className={className || 'text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition'}
      onClick={(e) => {
        if (!confirm(confirmMessage)) {
          e.preventDefault();
        }
      }}
      title="Hapus"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
