'use client';

import LoadingSpinner from './LoadingSpinner';

interface SubmitButtonProps {
  loading: boolean;
  text: string;
  loadingText?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit';
  className?: string;
}

export default function SubmitButton({
  loading,
  text,
  loadingText = 'Processing...',
  disabled = false,
  onClick,
  type = 'submit',
  className = 'w-full rounded-full px-4 py-2.5 text-white font-semibold transition',
}: SubmitButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      className={`inline-flex items-center justify-center gap-2 ${
        loading || disabled
          ? 'bg-zinc-300 dark:bg-zinc-600 cursor-not-allowed opacity-60'
          : 'bg-[color:var(--primary)] hover:bg-[color:var(--primary-600)]'
      } ${className}`}
    >
      {loading && <LoadingSpinner />}
      <span>{loading ? loadingText : text}</span>
    </button>
  );
}
