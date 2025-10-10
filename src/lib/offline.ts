/**
 * Offline support utilities for PWA
 * Handles caching and offline data access
 */

const DB_NAME = 'dankpass-offline';
const DB_VERSION = 1;
const RECEIPTS_STORE = 'receipts';
const POINTS_STORE = 'points';

let db: IDBDatabase | null = null;

/**
 * Initialize IndexedDB for offline storage
 */
export async function initOfflineDB(): Promise<IDBDatabase> {
  if (db) return db;

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;

      // Create receipts store
      if (!database.objectStoreNames.contains(RECEIPTS_STORE)) {
        const receiptsStore = database.createObjectStore(RECEIPTS_STORE, {
          keyPath: 'id',
        });
        receiptsStore.createIndex('userId', 'userId', { unique: false });
        receiptsStore.createIndex('createdAt', 'createdAt', { unique: false });
      }

      // Create points store
      if (!database.objectStoreNames.contains(POINTS_STORE)) {
        const pointsStore = database.createObjectStore(POINTS_STORE, {
          keyPath: 'userId',
        });
        pointsStore.createIndex('updatedAt', 'updatedAt', { unique: false });
      }
    };
  });
}

/**
 * Cache user receipts for offline viewing
 */
export async function cacheReceipts(receipts: any[], userId: string): Promise<void> {
  const database = await initOfflineDB();
  const transaction = database.transaction([RECEIPTS_STORE], 'readwrite');
  const store = transaction.objectStore(RECEIPTS_STORE);

  receipts.forEach((receipt) => {
    store.put({ ...receipt, userId, cachedAt: Date.now() });
  });

  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

/**
 * Get cached receipts for offline viewing
 */
export async function getCachedReceipts(userId: string): Promise<any[]> {
  const database = await initOfflineDB();
  const transaction = database.transaction([RECEIPTS_STORE], 'readonly');
  const store = transaction.objectStore(RECEIPTS_STORE);
  const index = store.index('userId');

  return new Promise((resolve, reject) => {
    const request = index.getAll(userId);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Cache user points data
 */
export async function cachePoints(userId: string, points: number): Promise<void> {
  const database = await initOfflineDB();
  const transaction = database.transaction([POINTS_STORE], 'readwrite');
  const store = transaction.objectStore(POINTS_STORE);

  store.put({
    userId,
    points,
    updatedAt: Date.now(),
  });

  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

/**
 * Get cached points
 */
export async function getCachedPoints(userId: string): Promise<number | null> {
  const database = await initOfflineDB();
  const transaction = database.transaction([POINTS_STORE], 'readonly');
  const store = transaction.objectStore(POINTS_STORE);

  return new Promise((resolve, reject) => {
    const request = store.get(userId);
    request.onsuccess = () => {
      const result = request.result;
      resolve(result ? result.points : null);
    };
    request.onerror = () => reject(request.error);
  });
}

/**
 * Check if user is online
 */
export function isOnline(): boolean {
  return navigator.onLine;
}

/**
 * Listen for online/offline events
 */
export function onConnectionChange(callback: (online: boolean) => void): () => void {
  const handleOnline = () => callback(true);
  const handleOffline = () => callback(false);

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}

/**
 * Fetch with fallback to cache
 */
export async function fetchWithOfflineFallback<T>(
  url: string,
  cacheKey: string,
  fetchFn: () => Promise<T>,
  cacheFn: (data: T) => Promise<void>,
  getCacheFn: () => Promise<T | null>
): Promise<{ data: T; fromCache: boolean }> {
  try {
    if (!isOnline()) {
      throw new Error('Offline');
    }

    const data = await fetchFn();
    await cacheFn(data);
    return { data, fromCache: false };
  } catch (error) {
    const cachedData = await getCacheFn();
    if (cachedData) {
      return { data: cachedData, fromCache: true };
    }
    throw error;
  }
}

