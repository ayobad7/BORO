import { useState } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ClearIcon from '@mui/icons-material/Clear';
import IconButton from '@mui/material/IconButton';
import imageCompression from 'browser-image-compression';

export interface ImageUploaderProps {
  max?: number;
  onChange: (files: File[]) => void;
}

export default function ImageUploader({
  max = 3,
  onChange,
}: ImageUploaderProps) {
  const [files, setFiles] = useState<File[]>([]);

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
    setFiles(next);
    onChange(next);
  };

  const removeAt = (idx: number) => {
    const next = files.filter((_, i) => i !== idx);
    setFiles(next);
    onChange(next);
  };

  return (
    <Stack spacing={1}>
      <Stack direction='row' alignItems='center' spacing={2}>
        <Button
          variant='outlined'
          component='label'
          disabled={files.length >= max}
        >
          Add image ({files.length}/{max})
          <input
            type='file'
            accept='image/*'
            hidden
            multiple
            onChange={handleAdd}
          />
        </Button>
        <Typography variant='body2' color='text.secondary'>
          Up to {max} images. Images may be compressed before upload.
        </Typography>
      </Stack>
      <ImageList cols={3} gap={8}>
        {files.map((file, idx) => (
          <ImageListItem
            key={idx}
            sx={{ height: 120, overflow: 'hidden', borderRadius: 1 }}
          >
            <img
              src={URL.createObjectURL(file)}
              loading='lazy'
              style={{ objectFit: 'cover', width: '100%', height: '100%' }}
            />
            <IconButton
              aria-label='remove'
              size='small'
              onClick={() => removeAt(idx)}
              sx={{
                position: 'absolute',
                top: 4,
                right: 4,
                bgcolor: 'background.paper',
              }}
            >
              <ClearIcon fontSize='small' />
            </IconButton>
          </ImageListItem>
        ))}
      </ImageList>
    </Stack>
  );
}
