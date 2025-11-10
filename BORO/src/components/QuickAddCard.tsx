import { useState } from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import ImageUploader from './ImageUploader';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import type { BorrowMode } from '../types';

export default function QuickAddCard({ className }: { className?: string }) {
  const { user } = useAuth();

  // Mirror Home.tsx quick add state/behavior exactly
  const [qTitle, setQTitle] = useState('');
  const [qCategory, setQCategory] = useState('');
  const [qLocation, setQLocation] = useState('');
  const [qNote, setQNote] = useState('');
  const [qMode, setQMode] = useState<BorrowMode>('free');
  const [qFiles, setQFiles] = useState<File[]>([]);
  const [qSaving, setQSaving] = useState(false);

  const canQuickSubmit =
    !!user &&
    qTitle.trim().length > 0 &&
    qCategory.trim().length > 0 &&
    qLocation.trim().length > 0 &&
    qFiles.length > 0 &&
    !qSaving;

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as
      | string
      | undefined;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as
      | string
      | undefined;
    const folder = import.meta.env.VITE_CLOUDINARY_FOLDER as string | undefined;

    if (!cloudName)
      throw new Error(
        'Cloudinary cloud name is missing. Set VITE_CLOUDINARY_CLOUD_NAME in .env.local.'
      );
    if (!uploadPreset)
      throw new Error(
        'Cloudinary upload preset is missing. Set VITE_CLOUDINARY_UPLOAD_PRESET in .env.local.'
      );

    const form = new FormData();
    form.append('file', file);
    form.append('upload_preset', uploadPreset);
    if (folder) form.append('folder', folder);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: form,
      }
    );
    if (!res.ok) {
      throw new Error('Upload failed');
    }
    const data = await res.json();
    return data.secure_url as string;
  };

  const handleQuickAdd = async () => {
    if (!canQuickSubmit || !user) return;
    setQSaving(true);
    try {
      const urls: string[] = [];
      for (const f of qFiles.slice(0, 3)) {
        const url = await uploadToCloudinary(f);
        urls.push(url);
      }
      const id = uuidv4();
      const ref = doc(collection(db, 'items'), id);
      const docData: any = {
        id,
        ownerId: user.uid,
        ownerName: user.displayName || user.email || 'Unknown',
        ownerPhotoURL: user.photoURL || '',
        holderId: user.uid,
        holderName: user.displayName || user.email || 'Unknown',
        title: qTitle.trim(),
        category: qCategory.trim(),
        imageUrls: urls,
        borrowMode: qMode,
        status: 'available',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      if (qLocation.trim()) docData.location = qLocation.trim();
      if (qNote.trim()) docData.note = qNote.trim();
      await setDoc(ref, docData);

      // Clear form
      setQTitle('');
      setQCategory('');
      setQLocation('');
      setQNote('');
      setQFiles([]);
    } catch (e) {
      console.error(e);
    } finally {
      setQSaving(false);
    }
  };

  return (
    <Paper
      className={className}
      sx={{
        width: '100%',
        '--r': '20px',
        position: 'relative',
        background:
          'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0)) , #14171f',
        border: '1px solid #23293a',
        borderRadius: 'var(--r)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
        transition: 'transform .18s ease, box-shadow .18s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 18px 50px rgba(0,0,0,0.45)'
        },
        breakInside: 'avoid',
        WebkitColumnBreakInside: 'avoid',
          overflow: 'hidden',
        p: 2,
      }}
    >
      <Typography
        variant='subtitle2'
        sx={{ fontWeight: 800, fontSize: 15, color: '#e9eef7', mb: 1 }}
      >
        Quick add item
      </Typography>
      <Box sx={{ display: 'grid', gap: 1.05 }}>
        <TextField
          size='small'
          label='Title'
          value={qTitle}
          onChange={(e) => setQTitle(e.target.value)}
          sx={{
            '& .MuiInputLabel-root.Mui-focused': { color: '#7f8cff' },
            '& label.Mui-focused': { color: '#7f8cff' },
            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#7f8cff',
            },
          }}
        />
        <TextField
          size='small'
          select
          label='Category'
          value={qCategory}
          onChange={(e) => setQCategory(e.target.value)}
          sx={{
            '& .MuiInputLabel-root.Mui-focused': { color: '#7f8cff' },
            '& label.Mui-focused': { color: '#7f8cff' },
            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#7f8cff',
            },
          }}
        >
          {[
            'Tools',
            'Outfit',
            'Stationary',
            'Appliances',
            'Equipment',
            'Sports',
            'Books',
            'Other',
          ].map((c) => (
            <MenuItem key={c} value={c}>
              {c}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          size='small'
          label='Location'
          value={qLocation}
          onChange={(e) => setQLocation(e.target.value)}
          sx={{
            '& .MuiInputLabel-root.Mui-focused': { color: '#7f8cff' },
            '& label.Mui-focused': { color: '#7f8cff' },
            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#7f8cff',
            },
          }}
        />
        <TextField
          size='small'
          label='Notes'
          value={qNote}
          onChange={(e) => setQNote(e.target.value)}
          multiline
          minRows={2}
          placeholder='Handling / care instructions…'
          sx={{
            '& .MuiInputLabel-root.Mui-focused': { color: '#7f8cff' },
            '& label.Mui-focused': { color: '#7f8cff' },
            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#7f8cff',
            },
          }}
        />
        {/* Borrow mode selection (Grab / Request) - mirror ItemForm */}
        <Box sx={{ minHeight: 54 }}>
          <FormLabel sx={{ color: '#a2b3c7', display: 'block', mb: 0.5 }}>Borrow mode</FormLabel>
          <RadioGroup
            row
            value={qMode}
            onChange={(_, v) => setQMode(v as BorrowMode)}
            sx={{ mb: 1, gap: 1 }}
          >
            <FormControlLabel
              value='free'
              control={<Radio size='small' sx={{ color: '#7f8cff', '&.Mui-checked': { color: '#7f8cff' } }} />}
              label='Grab'
            />
            <FormControlLabel
              value='request'
              control={<Radio size='small' sx={{ color: '#7f8cff', '&.Mui-checked': { color: '#7f8cff' } }} />}
              label='Request'
            />
          </RadioGroup>
          <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
            {qMode === 'free' ? (
              <><strong>Grab:</strong> Friends can borrow this item instantly without needing your approval.</>
            ) : (
              <><strong>Request:</strong> Friends must send a request and wait for your approval before borrowing.</>
            )}
          </Typography>
        </Box>
        <Box sx={{ mt: 0.25 }}>
          <Typography variant='caption' sx={{ color: '#8ca2ba', display: 'block', mb: 0.6 }}>
            Images (max 3)
          </Typography>
          <ImageUploader max={3} onChange={setQFiles} value={qFiles} variant='tiles' showHelper={false} />
        </Box>
        <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
          <Button
            variant='contained'
            size='small'
            disabled={!canQuickSubmit}
            onClick={handleQuickAdd}
            startIcon={qSaving ? <CircularProgress size={16} color='inherit' /> : undefined}
            sx={{
              flex: 1,
              fontWeight: 700,
              background: 'linear-gradient(90deg,#6bd6ff,#7f8cff)',
              color: '#0d1117',
              textTransform: 'none',
              '&:hover': { filter: 'brightness(1.08)' },
            }}
          >
            {qSaving ? 'Adding…' : 'Add item'}
          </Button>
          <Button
            variant='outlined'
            size='small'
            onClick={() => {
              setQTitle('');
              setQCategory('');
              setQLocation('');
                setQNote('');
                setQMode('free');
              setQFiles([]);
            }}
            sx={{
              flex: 1,
              borderColor: '#2a3144',
              color: '#a2b3c7',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': {
                borderColor: '#3b465f',
                color: '#d1dbe6',
              },
            }}
          >
            Reset
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}
