const STORAGE_KEY = 'nutriplate_favorites';

export function getFavorites() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function isFavorite(foodId) {
  return getFavorites().includes(Number(foodId));
}

export function toggleFavorite(foodId) {
  const id = Number(foodId);
  const list = getFavorites();
  const next = list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}
