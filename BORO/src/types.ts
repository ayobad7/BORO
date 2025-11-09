export type BorrowMode = 'free' | 'request';
export type ItemStatus = 'available' | 'requested' | 'borrowed';

export interface StorageItem {
  id: string;
  ownerId: string;
  ownerName?: string;
  ownerPhotoURL?: string;
  holderId: string; // the user currently holding the item (owner or borrower)
  holderName?: string;
  title: string;
  category: string;
  /**
   * Free-form note about handling or special instructions.
   * Prefer note over description; kept optional for backward compatibility.
   */
  note?: string;
  /**
   * Legacy field kept for compatibility. If present and note is empty,
   * UI may fall back to showing description.
   */
  description?: string;
  location?: string;
  imageUrls: string[]; // up to 3
  borrowMode: BorrowMode;
  status: ItemStatus;
  // Present when item was created with request mode; used for due-date UX
  requestWindow?: {
    fromDate: string | null;
    toDate: string | null;
  } | null;
  // Active borrow dates when status is 'borrowed'
  borrowedFrom?: string; // ISO
  borrowedUntil?: string; // ISO
  createdAt: number;
  updatedAt: number;
}

export interface BorrowRequest {
  id: string;
  itemId: string;
  ownerId: string;
  requesterId: string;
  requesterName?: string;
  fromDate?: string; // ISO
  toDate?: string; // ISO
  message?: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  createdAt: number;
  updatedAt: number;
}

export interface ExtendDateRequest {
  id: string;
  itemId: string;
  ownerId: string;
  requesterId: string;
  requesterName?: string;
  currentToDate: string; // ISO
  requestedToDate: string; // ISO
  message?: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  createdAt: number;
  updatedAt: number;
}

export interface StorageHistory {
  userId: string;
  userName: string;
  visitedAt: number;
}

export interface FavoriteStorage {
  id: string;
  userId: string; // the user who favorited
  storageOwnerId: string; // the storage owner
  storageOwnerName: string;
  createdAt: number;
}
