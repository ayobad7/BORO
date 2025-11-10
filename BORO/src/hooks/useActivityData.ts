import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { StorageItem } from '../types';
import type { ActivityEvent } from '../components/RecentActivityCard';
import { useAuth } from '../context/AuthContext';

interface ActivityItem extends StorageItem {
  activityType: 'storage' | 'borrowed' | 'lent';
  activityTimestamp: number;
}

export function useActivityData() {
  const { user } = useAuth();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [counts, setCounts] = useState({ storage: 0, borrowed: 0, lent: 0 });
  const [recentEvents, setRecentEvents] = useState<ActivityEvent[]>([]);
  const [favOwners, setFavOwners] = useState<{ id: string; name: string; createdAt: number }[]>([]);
  const [latestFavAt, setLatestFavAt] = useState<number | null>(null);
  const [favItemIds, setFavItemIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!user) {
      setActivities([]);
      setFavItemIds(new Set());
      return;
    }

    // Queries
    const storageQ = query(
      collection(db, 'items'),
      where('ownerId', '==', user.uid),
      orderBy('updatedAt', 'desc'),
      limit(50)
    );
    const borrowedQ = query(
      collection(db, 'items'),
      where('holderId', '==', user.uid),
      where('status', '==', 'borrowed'),
      orderBy('updatedAt', 'desc'),
      limit(50)
    );
    const lentQ = query(
      collection(db, 'items'),
      where('ownerId', '==', user.uid),
      where('status', '==', 'borrowed'),
      orderBy('updatedAt', 'desc'),
      limit(50)
    );

    // Helpers & state holders
    const toMs = (v: any): number => {
      if (!v) return Date.now();
      if (typeof v === 'number') return v;
      if (typeof v === 'string') {
        const n = Date.parse(v);
        return isNaN(n) ? Date.now() : n;
      }
      if (v && typeof v.toMillis === 'function') return v.toMillis();
      if (v instanceof Date) return v.getTime();
      return Date.now();
    };

    let storageItems: ActivityItem[] = [];
    let borrowedItems: ActivityItem[] = [];
    let lentItems: ActivityItem[] = [];
    let prevBorrowedMap: Record<string, ActivityItem> = {};
    let prevLentMap: Record<string, ActivityItem> = {};
    let prevFavIds = new Set<string>();

    const STORAGE_KEY = `boro:recentEvents:${user.uid}`;

    // Preload any locally cached recent events so refresh keeps prior actions visible
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached) as ActivityEvent[];
        const fresh = parsed.filter(
          (e) => Number.isFinite(e.ts) && e.ts > Date.now() - 14 * 86400000
        );
        if (fresh.length) setRecentEvents(fresh);
      }
    } catch {}

    const pushEvents = (newEv: ActivityEvent[]) => {
      if (!newEv.length) return;
      setRecentEvents((curr) => {
        const merged = [...newEv, ...curr];
        const seen = new Set<string>();
        const dedup: ActivityEvent[] = [];
        for (const e of merged.sort((a, b) => b.ts - a.ts)) {
          if (!seen.has(e.id)) {
            seen.add(e.id);
            dedup.push(e);
          }
        }
        const final = dedup.slice(0, 20);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(final));
        } catch {}
        return final;
      });
    };

    function recompute() {
      const merged = [...storageItems, ...borrowedItems, ...lentItems].sort(
        (a, b) => b.activityTimestamp - a.activityTimestamp
      );
      setActivities(merged);
      setCounts({
        storage: storageItems.length,
        borrowed: borrowedItems.length,
        lent: lentItems.length,
      });
      // Build baseline events but merge via pushEvents so we don't overwrite
      const baseline: ActivityEvent[] = [];
      for (const s of storageItems.slice(0, 20)) {
        const createdTs = toMs((s as any).createdAt);
        if (
          createdTs &&
          (createdTs === s.activityTimestamp ||
            createdTs > Date.now() - 7 * 86400000)
        ) {
          baseline.push({
            id: `add-${s.id}`,
            ts: createdTs,
            text: `You added “${s.title}” to Storage`,
          });
        }
      }
      for (const b of borrowedItems.slice(0, 20)) {
        baseline.push({
          id: `borrow-${b.id}`,
          ts: toMs(b.activityTimestamp),
          text: `You borrowed “${b.title}”`,
        });
      }
      for (const l of lentItems.slice(0, 20)) {
        baseline.push({
          id: `lent-${l.id}`,
          ts: toMs(l.activityTimestamp),
          text: `${l.holderName || 'Someone'} borrowed “${l.title}”`,
        });
      }
      for (const o of favOwners.slice(0, 10)) {
        baseline.push({
          id: `fav-${o.id}-${o.createdAt}`,
          ts: toMs(o.createdAt),
          text: `You favorited ${o.name}’s storage`,
        });
      }
      if (baseline.length) pushEvents(baseline);
    }

    const unsubStorage = onSnapshot(storageQ, (snap) => {
      storageItems = snap.docs
        .map((d) => {
          const data = d.data();
          return {
            id: d.id,
            ...data,
            activityType: 'storage' as const,
            activityTimestamp: toMs(
              data.updatedAt || data.createdAt || Date.now()
            ),
            createdAt: toMs((data as any).createdAt),
          };
        })
        .filter((it: any) => {
          // Debug: log items with status borrowed
          if (it.status === 'borrowed') {
            console.log('🔍 Storage item with borrowed status:', {
              id: it.id,
              title: it.title,
              ownerId: it.ownerId,
              holderId: it.holderId,
              holderName: it.holderName,
              currentUserId: user.uid,
              isSelfLent: it.holderId === user.uid,
            });
          }
          // Exclude ALL borrowed items from storage feed (they'll show in lent feed)
          return it.status !== 'borrowed';
        }) as ActivityItem[];
      recompute();
    });

    const unsubBorrowed = onSnapshot(borrowedQ, (snap) => {
      const currentMap: Record<string, ActivityItem> = {};
      const currentItems = snap.docs.map((d) => {
        const data = d.data();
        const item: ActivityItem = {
          id: d.id,
          ...data,
          activityType: 'borrowed',
          activityTimestamp: toMs(
            data.updatedAt || data.borrowedFrom || Date.now()
          ),
        } as any;
        currentMap[item.id] = item;
        return item;
      });
      const ev: ActivityEvent[] = [];
      for (const item of currentItems) {
        const prev = prevBorrowedMap[item.id];
        if (
          prev &&
          prev.borrowedUntil &&
          item.borrowedUntil &&
          prev.borrowedUntil !== item.borrowedUntil
        ) {
          const diffMs =
            new Date(item.borrowedUntil).getTime() -
            new Date(prev.borrowedUntil).getTime();
          if (diffMs > 0) {
            const diffDays = Math.round(diffMs / 86400000);
            ev.push({
              id: `extend-b-${item.id}-${item.borrowedUntil}`,
              ts: Date.now(),
              text: `You extended “${item.title}” by ${diffDays} day${
                diffDays !== 1 ? 's' : ''
              }`,
            });
          }
        }
      }
      for (const prevId of Object.keys(prevBorrowedMap)) {
        if (!currentMap[prevId]) {
          const prevItem = prevBorrowedMap[prevId];
          ev.push({
            id: `return-b-${prevId}-${Date.now()}`,
            ts: Date.now(),
            text: `You returned “${prevItem.title}”`,
          });
        }
      }
      pushEvents(ev);
      prevBorrowedMap = currentMap;
      borrowedItems = currentItems;
      recompute();
    });

    const unsubLent = onSnapshot(lentQ, (snap) => {
      const currentMap: Record<string, ActivityItem> = {};
      const currentItems = snap.docs
        .map((d) => {
          const data = d.data();
          const item: ActivityItem = {
            id: d.id,
            ...data,
            activityType: 'lent',
            activityTimestamp: toMs(
              data.updatedAt || data.borrowedFrom || Date.now()
            ),
          } as any;
          return item;
        })
        .filter((it: any) => {
          // Debug: log what's being filtered
          const isSelfLent = it.holderId === user.uid;
          if (isSelfLent) {
            console.log('❌ Filtering out self-lent item:', {
              id: it.id,
              title: it.title,
              ownerId: it.ownerId,
              holderId: it.holderId,
              holderName: it.holderName,
              reason: 'holderId === currentUserId (you cannot lend to yourself)',
            });
          }
          return !isSelfLent;
        }) as ActivityItem[];
      for (const it of currentItems) currentMap[it.id] = it;
      const ev: ActivityEvent[] = [];
      for (const item of currentItems) {
        const prev = prevLentMap[item.id];
        if (
          prev &&
          prev.borrowedUntil &&
          item.borrowedUntil &&
          prev.borrowedUntil !== item.borrowedUntil
        ) {
          const diffMs =
            new Date(item.borrowedUntil).getTime() -
            new Date(prev.borrowedUntil).getTime();
          if (diffMs > 0) {
            const diffDays = Math.round(diffMs / 86400000);
            ev.push({
              id: `extend-l-${item.id}-${item.borrowedUntil}`,
              ts: Date.now(),
              text: `${item.holderName || 'Borrower'} extended “${
                item.title
              }” by ${diffDays} day${diffDays !== 1 ? 's' : ''}`,
            });
          }
        }
      }
      for (const prevId of Object.keys(prevLentMap)) {
        if (!currentMap[prevId]) {
          const prevItem = prevLentMap[prevId];
          ev.push({
            id: `return-l-${prevId}-${Date.now()}`,
            ts: Date.now(),
            text: `${(prevItem as any).holderName || 'Borrower'} returned “${
              prevItem.title
            }”`,
          });
        }
      }
      pushEvents(ev);
      prevLentMap = currentMap;
      lentItems = currentItems;
      recompute();
    });

    const favStoragesQ = query(
      collection(db, 'favoriteStorages'),
      where('userId', '==', user.uid)
    );
    const unsubFavStorages = onSnapshot(favStoragesQ, (snap) => {
      const raw = snap.docs.map((d) => {
        const data: any = d.data();
        const ts = toMs(data.createdAt) || Date.now();
        return {
          id: data.storageOwnerId as string,
          name: data.storageOwnerName as string,
          createdAt: ts,
        };
      });
      const map = new Map<
        string,
        { id: string; name: string; createdAt: number }
      >();
      for (const o of raw.sort((a, b) => b.createdAt - a.createdAt)) {
        if (!map.has(o.id)) map.set(o.id, o);
      }
      const owners = Array.from(map.values());
      const ev: ActivityEvent[] = [];
      for (const o of owners) {
        if (!prevFavIds.has(o.id)) {
          ev.push({
            id: `fav-${o.id}-${o.createdAt}`,
            ts: o.createdAt,
            text: `You favorited ${o.name}’s storage`,
          });
        }
      }
      pushEvents(ev);
      prevFavIds = new Set(owners.map((o) => o.id));
      setFavOwners(owners);
      setLatestFavAt(owners.length ? owners[0].createdAt : null);
      recompute();
    });

    // Favorite items listener
    const favItemsQ = query(
      collection(db, 'favoriteItems'),
      where('userId', '==', user.uid)
    );
    const unsubFavItems = onSnapshot(favItemsQ, (snap) => {
      const ids = new Set<string>();
      for (const d of snap.docs) {
        const data = d.data() as any;
        if (data.itemId) ids.add(data.itemId as string);
      }
      setFavItemIds(ids);
    });

    return () => {
      unsubStorage();
      unsubBorrowed();
      unsubLent();
      unsubFavStorages();
      unsubFavItems();
    };
  }, [user]);

  return {
    activities,
    counts,
    recentEvents,
    favOwners,
    latestFavAt,
    favItemIds,
    setFavItemIds,
  };
}