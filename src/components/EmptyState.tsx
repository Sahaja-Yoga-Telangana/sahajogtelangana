'use client';

import { ReactNode } from 'react';
import { FiInbox } from 'react-icons/fi';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  message?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyState({ icon, title, message, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-16 h-16 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] flex items-center justify-center mb-4">
        {icon || <FiInbox className="w-7 h-7 text-[color:var(--muted)]" />}
      </div>
      <h3 className="text-lg font-semibold text-[color:var(--ink)] mb-1">{title}</h3>
      {message && (
        <p className="text-sm text-[color:var(--muted)] max-w-sm leading-relaxed">{message}</p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="mt-4 px-5 py-2.5 rounded-full bg-[color:var(--primary)] text-white font-medium text-sm hover:bg-[color:var(--primary-600)] transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
