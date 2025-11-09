import { useEffect, useMemo, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import imageCompression from 'browser-image-compression';

export interface ImageUploaderProps {
  max?: number;
  onChange: (files: File[]) => void;
  // Controlled value. If provided, component mirrors these files.
  value?: File[];
  // Visual style: 'tiles' shows a dashed add-tile with square previews; 'button' shows an outlined button with helper text.
  variant?: 'tiles' | 'button';
  // Show helper hint line (only relevant for 'button' variant)
  showHelper?: boolean;
}

export default function ImageUploader({
  max = 3,
  onChange,
  value,
  variant = 'button',
  showHelper = true,
}: ImageUploaderProps) {
  const [internalFiles, setInternalFiles] = useState<File[]>([]);
  const files = value ?? internalFiles;

  const handleAdd = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    const remaining = Math.max(0, max - files.length);
    const toProcess = selected.slice(0, remaining);

    const compressed: File[] = [];
    for (const file of toProcess) {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1600,
        useWebWorker: true,
      };
      try {
        const out = await imageCompression(file, options);
        compressed.push(new File([out], file.name, { type: out.type }));
      } catch {
        compressed.push(file);
      }
    }

    const next = [...files, ...compressed];
    if (value === undefined) setInternalFiles(next);
    onChange(next);
  };

  const removeAt = (idx: number) => {
    const next = files.filter((_, i) => i !== idx);
    if (value === undefined) setInternalFiles(next);
    onChange(next);
  };

  // Generate preview URLs and clean them up to avoid memory leaks
  const previews = useMemo(() => files.map(f => ({ file: f, url: URL.createObjectURL(f) })), [files]);
  useEffect(() => {
    return () => {
      previews.forEach(p => URL.revokeObjectURL(p.url));
    };
  }, [previews]);

  if (variant === 'tiles') {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 8 }}>
        {files.length < max && (
          <label
            style={{
              width: '100%',
              aspectRatio: '1 / 1',
              borderRadius: 12,
              border: '2px dashed #3a4257',
              color: '#8fa1c1',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              background: '#141922',
            }}
          >
            <span style={{ fontSize: 28, lineHeight: 1 }}>+</span>
            <input
              type='file'
              accept='image/*'
              multiple
              hidden
              onChange={handleAdd}
            />
          </label>
        )}
        {previews.map((p, idx) => (
          <div
            key={idx}
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '1 / 1',
              borderRadius: 12,
              overflow: 'hidden',
            }}
          >
            <img
              src={p.url}
              alt='preview'
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <IconButton
              aria-label='remove'
              size='small'
              onClick={() => removeAt(idx)}
              sx={{
                position: 'absolute',
                top: 4,
                right: 4,
                bgcolor: 'rgba(0,0,0,.45)',
                color: '#fff',
                '&:hover': { bgcolor: 'rgba(0,0,0,.6)' },
              }}
            >
              <ClearIcon fontSize='small' />
            </IconButton>
          </div>
        ))}
      </div>
    );
  }

  // Fallback to original 'button' variant
  return (
    <div style={{ display: 'grid', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <label>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px 12px',
              border: '1px solid #3a4257',
              borderRadius: 8,
              color: '#cdd7e6',
              cursor: files.length >= max ? 'not-allowed' : 'pointer',
              opacity: files.length >= max ? 0.6 : 1,
              background: 'transparent',
              fontSize: 14,
            }}
          >
            Add image ({files.length}/{max})
            <input
              type='file'
              accept='image/*'
              hidden
              multiple
              onChange={handleAdd}
              disabled={files.length >= max}
            />
          </div>
        </label>
        {showHelper && (
          <span style={{ fontSize: 12, color: '#8f9bad' }}>
            Up to {max} images. Images may be compressed before upload.
          </span>
        )}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        {previews.map((p, idx) => (
          <div key={idx} style={{ position: 'relative', height: 120, borderRadius: 8, overflow: 'hidden' }}>
            <img src={p.url} loading='lazy' style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
            <IconButton
              aria-label='remove'
              size='small'
              onClick={() => removeAt(idx)}
              sx={{ position: 'absolute', top: 4, right: 4, bgcolor: 'background.paper' }}
            >
              <ClearIcon fontSize='small' />
            </IconButton>
          </div>
        ))}
      </div>
    </div>
  );
}
