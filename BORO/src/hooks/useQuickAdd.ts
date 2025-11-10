import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { BorrowMode } from '../types';
import { useAuth } from '../context/AuthContext';

export function useQuickAdd() {
  const { user } = useAuth();
  
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
      setQMode('free');
      setQFiles([]);
    } catch (e) {
      console.error(e);
    } finally {
      setQSaving(false);
    }
  };

  const resetForm = () => {
    setQTitle('');
    setQCategory('');
    setQLocation('');
    setQNote('');
    setQMode('free');
    setQFiles([]);
  };

  return {
    // State
    qTitle,
    qCategory,
    qLocation,
    qNote,
    qMode,
    qFiles,
    qSaving,
    
    // Computed
    canQuickSubmit,
    
    // Actions
    setQTitle,
    setQCategory,
    setQLocation,
    setQNote,
    setQMode,
    setQFiles,
    handleQuickAdd,
    resetForm,
  };
}