import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import ImageUploader from '../components/ImageUploader';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import type { BorrowMode } from '../types';

const LOCATION_MAX = 80;
const schema = z.object({
  title: z.string().min(1),
  category: z.string().min(1),
  note: z.string().optional(),
  location: z
    .string()
    .min(1, 'Location is required')
    .max(LOCATION_MAX, `Location must be at most ${LOCATION_MAX} characters`),
  borrowMode: z.union([z.literal('free'), z.literal('request')]),
});

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function ItemForm() {
  const navigate = useNavigate();
  const query = useQuery();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(query.get('category') || '');
  const [note, setNote] = useState('');
  const [location, setLocation] = useState('');
  const [borrowMode, setBorrowMode] = useState<BorrowMode>('free');
  const [files, setFiles] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [attempted, setAttempted] = useState(false);

  const { user } = useAuth();

  const canSubmit = useMemo(
    () =>
      title.trim().length > 0 &&
      category.trim().length > 0 &&
      location.trim().length > 0 &&
      files.length > 0,
    [title, category, location, files]
  );

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
      let detail = '';
      try {
        const err = await res.json();
        detail = (err?.error?.message as string) || JSON.stringify(err);
      } catch {
        try {
          detail = await res.text();
        } catch {
          // ignore
        }
      }
      throw new Error(
        `Upload failed: ${res.status} ${res.statusText}${
          detail ? ` - ${detail}` : ''
        }`
      );
    }
    const data = await res.json();
    return data.secure_url as string;
  };

  const onSubmit = async () => {
    if (!user) return;
    setAttempted(true);
    if (location.trim().length === 0 || files.length === 0) {
      setErrorMsg(
        files.length === 0 && location.trim().length === 0
          ? 'Please add a location and upload at least one image.'
          : location.trim().length === 0
          ? 'Please add a location.'
          : 'Please upload at least one image.'
      );
      return;
    }
    const parse = schema.safeParse({
      title,
      category,
      note,
      location,
      borrowMode,
    });
    if (!parse.success) return;

    // upload images sequentially (small max of 3)
    setSaving(true);
    try {
      const urls: string[] = [];
      for (const f of files.slice(0, 3)) {
        const url = await uploadToCloudinary(f);
        urls.push(url);
      }

      const id = uuidv4();
      const ref = doc(collection(db, 'items'), id);

      // Build the doc data, excluding undefined fields for Firestore
      const docData: any = {
        id,
        ownerId: user.uid,
        ownerName: user.displayName || user.email || 'Unknown',
        ownerPhotoURL: user.photoURL || '',
        holderId: user.uid,
        holderName: user.displayName || user.email || 'Unknown',
        title: title.trim(),
        category: category.trim(),
        imageUrls: urls,
        borrowMode,
        status: 'available',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      // Only add optional fields if they have values
      if (note.trim()) {
        // Write new preferred field
        docData.note = note.trim();
        // For backward compatibility you may keep description mirror (optional)
        // docData.description = note.trim();
      }
      if (location.trim()) {
        docData.location = location.trim();
      }

      await setDoc(ref, docData);

      navigate('/storage');
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to save item');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Navbar />
      <Box
        sx={{
          width: '100vw',
          minHeight: '100vh',
          bgcolor: 'background.default',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Box sx={{ width: 1000, maxWidth: '100%', py: 3 }}>
          <Paper sx={{ p: 3 }}>
            <Stack spacing={2}>
              <Typography variant='h5'>Add new item</Typography>
              <TextField
                label='Title'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <TextField
                label='Category'
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                select
                required
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
                label='Notes (care, instructions, handling)'
                value={note}
                onChange={(e) => setNote(e.target.value)}
                multiline
                minRows={3}
                placeholder='e.g. Keep lens cap on, store in dry case, charge weekly…'
              />
              <TextField
                label='Location'
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                error={attempted && location.trim().length === 0}
                helperText={
                  attempted && location.trim().length === 0
                    ? 'Location is required'
                    : `${location.length}/${LOCATION_MAX}`
                }
                inputProps={{ maxLength: LOCATION_MAX }}
              />

              <Box>
                <FormLabel>Borrow mode</FormLabel>
                <RadioGroup
                  row
                  value={borrowMode}
                  onChange={(_, v) => setBorrowMode(v as BorrowMode)}
                  sx={{ mb: 1 }}
                >
                  <FormControlLabel
                    value='free'
                    control={<Radio />}
                    label='Grab'
                  />
                  <FormControlLabel
                    value='request'
                    control={<Radio />}
                    label='Request'
                  />
                </RadioGroup>
                <Typography
                  variant='body2'
                  color='text.secondary'
                  sx={{ mb: 1 }}
                >
                  {borrowMode === 'free' ? (
                    <>
                      <strong>Grab:</strong> Friends can borrow this item
                      instantly without needing your approval.
                    </>
                  ) : (
                    <>
                      <strong>Request:</strong> Friends must send a request and
                      wait for your approval before borrowing.
                    </>
                  )}
                </Typography>
              </Box>

              <ImageUploader max={3} onChange={setFiles} />
              {attempted && files.length === 0 && (
                <Typography variant='caption' color='error'>
                  Please upload at least one image.
                </Typography>
              )}

              <Stack direction='row' spacing={2} alignItems='center'>
                <Button
                  variant='contained'
                  disabled={!canSubmit || !user || saving}
                  onClick={onSubmit}
                  startIcon={
                    saving ? (
                      <CircularProgress size={18} color='inherit' />
                    ) : undefined
                  }
                >
                  {saving ? 'Saving…' : 'Save item'}
                </Button>
                {!user && (
                  <Typography color='text.secondary'>
                    Sign in to save
                  </Typography>
                )}
              </Stack>
              <Snackbar
                open={!!errorMsg}
                autoHideDuration={6000}
                onClose={() => setErrorMsg(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
              >
                <Alert
                  severity='error'
                  onClose={() => setErrorMsg(null)}
                  sx={{ width: '100%' }}
                >
                  {errorMsg}
                </Alert>
              </Snackbar>
            </Stack>
          </Paper>
        </Box>
      </Box>
    </>
  );
}
