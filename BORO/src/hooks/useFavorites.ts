import { doc, setDoc, deleteDoc, serverTimestamp, collection } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';

export function useFavorites() {
  const { user } = useAuth();

  const toggleFavorite = async (
    id: string, 
    favItemIds: Set<string>, 
    setFavItemIds: React.Dispatch<React.SetStateAction<Set<string>>>
  ) => {
    if (!user) return;
    const wasFav = favItemIds.has(id);
    // Optimistic update
    setFavItemIds((prev) => {
      const next = new Set(prev);
      if (wasFav) next.delete(id); else next.add(id);
      return next;
    });
    try {
      const favRef = doc(collection(db, 'favoriteItems'), `${user.uid}_${id}`);
      if (wasFav) {
        await deleteDoc(favRef);
      } else {
        await setDoc(favRef, {
          userId: user.uid,
          itemId: id,
          createdAt: serverTimestamp(),
        });
      }
    } catch (e) {
      console.error('Favorite toggle failed', e);
    }
  };

  return {
    toggleFavorite,
  };
}