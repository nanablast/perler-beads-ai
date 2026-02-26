type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

function isStorageLike(value: unknown): value is StorageLike {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<StorageLike>;
  return (
    typeof candidate.getItem === 'function' &&
    typeof candidate.setItem === 'function' &&
    typeof candidate.removeItem === 'function'
  );
}

export function getSafeLocalStorage(): StorageLike | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const storage = window.localStorage;
    return isStorageLike(storage) ? storage : null;
  } catch (error) {
    console.error('访问 localStorage 失败:', error);
    return null;
  }
}
