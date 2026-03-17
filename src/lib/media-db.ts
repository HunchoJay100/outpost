import { MediaItem, CompanySlug } from '@/types';

const DB_NAME = 'medium-media';
const DB_VERSION = 1;
const META_STORE = 'media-meta';
const BLOB_STORE = 'media-blobs';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(META_STORE)) {
        db.createObjectStore(META_STORE, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(BLOB_STORE)) {
        db.createObjectStore(BLOB_STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function getAllMedia(companySlug: CompanySlug): Promise<MediaItem[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(META_STORE, 'readonly');
    const store = tx.objectStore(META_STORE);
    const req = store.getAll();
    req.onsuccess = () => {
      const all = req.result as MediaItem[];
      resolve(all.filter((m) => m.companySlug === companySlug));
    };
    req.onerror = () => reject(req.error);
  });
}

export async function addMedia(
  file: File,
  companySlug: CompanySlug,
  projectName: string,
  tags: string[]
): Promise<MediaItem> {
  const db = await openDB();
  const id = crypto.randomUUID();
  const meta: MediaItem = {
    id,
    companySlug,
    fileName: file.name,
    fileType: file.type.startsWith('video/') ? 'video' : 'image',
    mimeType: file.type,
    projectName,
    tags,
    createdAt: new Date().toISOString(),
  };

  const blob = await file.arrayBuffer();

  return new Promise((resolve, reject) => {
    const tx = db.transaction([META_STORE, BLOB_STORE], 'readwrite');
    tx.objectStore(META_STORE).put(meta);
    tx.objectStore(BLOB_STORE).put(blob, id);
    tx.oncomplete = () => resolve(meta);
    tx.onerror = () => reject(tx.error);
  });
}

export async function getMediaBlob(id: string): Promise<ArrayBuffer | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(BLOB_STORE, 'readonly');
    const req = tx.objectStore(BLOB_STORE).get(id);
    req.onsuccess = () => resolve(req.result ?? null);
    req.onerror = () => reject(req.error);
  });
}

export async function getMediaBlobURL(id: string, mimeType: string): Promise<string | null> {
  const buffer = await getMediaBlob(id);
  if (!buffer) return null;
  const blob = new Blob([buffer], { type: mimeType });
  return URL.createObjectURL(blob);
}

export async function deleteMedia(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction([META_STORE, BLOB_STORE], 'readwrite');
    tx.objectStore(META_STORE).delete(id);
    tx.objectStore(BLOB_STORE).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function deleteMultipleMedia(ids: string[]): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction([META_STORE, BLOB_STORE], 'readwrite');
    for (const id of ids) {
      tx.objectStore(META_STORE).delete(id);
      tx.objectStore(BLOB_STORE).delete(id);
    }
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
