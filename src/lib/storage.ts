import { OutpostData } from '@/types';

const STORAGE_KEY = 'outpost-data';

export function getData(): OutpostData | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as OutpostData;
  } catch {
    return null;
  }
}

export function setData(data: OutpostData): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to write to localStorage:', e);
  }
}

export function isSeeded(): boolean {
  return getData() !== null;
}
