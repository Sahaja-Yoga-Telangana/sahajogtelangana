'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { FiImage, FiLoader, FiUploadCloud, FiX } from 'react-icons/fi';

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export default function ImageUpload({
  value,
  onChange,
  label = 'Event image',
  onUploadStateChange,
}: {
  value?: string;
  onChange: (value: string) => void;
  label?: string;
  onUploadStateChange?: (uploading: boolean) => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  const previewUrl = localPreview || value || '';

  useEffect(() => {
    onUploadStateChange?.(uploading);
  }, [uploading, onUploadStateChange]);

  useEffect(() => {
    return () => {
      if (localPreview?.startsWith('blob:')) {
        URL.revokeObjectURL(localPreview);
      }
    };
  }, [localPreview]);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setLocalPreview((prev) => {
      if (prev?.startsWith('blob:')) {
        URL.revokeObjectURL(prev);
      }
      return URL.createObjectURL(file);
    });

    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      setError('Image upload is not configured yet. Add Cloudinary env vars to enable it.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', 'sahaja-yoga-events');

    setUploading(true);
    setProgress(0);

    try {
      const response = await uploadWithProgress(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData,
        setProgress
      );

      onChange(response.secure_url || response.url || '');
      setLocalPreview(null);
    } catch (uploadError) {
      console.error(uploadError);
      setError('Image upload failed. Please try again.');
    } finally {
      setUploading(false);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  const handleRemove = () => {
    setError(null);
    setProgress(0);
    setLocalPreview((prev) => {
      if (prev?.startsWith('blob:')) {
        URL.revokeObjectURL(prev);
      }
      return null;
    });
    onChange('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <label className="block text-sm font-medium text-[color:var(--ink)]">{label}</label>
        {previewUrl ? (
          <button type="button" onClick={handleRemove} className="inline-flex items-center gap-2 text-sm text-[color:var(--muted)] hover:text-[color:var(--ink)]">
            <FiX className="h-4 w-4" aria-hidden="true" />
            Remove
          </button>
        ) : null}
      </div>

      <div className="rounded-[24px] border border-dashed border-[color:var(--border)] bg-[color:var(--surface-2)]/70 p-4">
        {previewUrl ? (
          <div className="relative overflow-hidden rounded-[20px] border border-[color:var(--border)] bg-[color:var(--surface)]">
            <Image
              src={previewUrl}
              alt="Event preview"
              width={1200}
              height={800}
              className="h-56 w-full object-cover"
              unoptimized={/^blob:|^https?:\/\//.test(previewUrl)}
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex w-full flex-col items-center justify-center gap-3 rounded-[20px] bg-[color:var(--surface)]/80 px-6 py-12 text-center transition-colors duration-300 hover:bg-[color:var(--surface)]"
          >
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[color:var(--surface)] text-[color:var(--primary)]">
              <FiImage className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <p className="text-base font-semibold text-[color:var(--ink)]">Upload event image</p>
              <p className="mt-1 text-sm text-[color:var(--muted)]">JPG, PNG, or WebP. Best around 1600 x 900.</p>
            </div>
          </button>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-5 py-2.5 text-sm font-semibold text-[color:var(--ink)] transition-all duration-300 hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {uploading ? <FiLoader className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" /> : <FiUploadCloud className="mr-2 h-4 w-4" aria-hidden="true" />}
            {previewUrl ? 'Replace image' : 'Choose file'}
          </button>
          {uploading ? <span className="text-sm text-[color:var(--muted)]">Uploading... {progress}%</span> : null}
        </div>

        {uploading ? (
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-[color:var(--surface)]/70">
            <div className="h-full rounded-full bg-[color:var(--primary)] transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        ) : null}

        {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
        {!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET ? (
          <p className="mt-3 text-sm text-[color:var(--muted)]">
            Upload requires `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` and `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`.
          </p>
        ) : null}
      </div>

      <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handleFileChange} />
    </div>
  );
}

function uploadWithProgress(
  url: string,
  body: FormData,
  onProgress: (value: number) => void
): Promise<Record<string, string>> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable) return;
      onProgress(Math.round((event.loaded / event.total) * 100));
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText));
        return;
      }

      reject(new Error(xhr.responseText || 'Upload failed'));
    };

    xhr.onerror = () => reject(new Error('Upload failed'));
    xhr.send(body);
  });
}
