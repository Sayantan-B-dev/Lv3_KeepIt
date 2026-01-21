const CACHE_PREFIX = "prefetch_note_";

export const noteCache = {
  get(noteId) {
    const raw = sessionStorage.getItem(CACHE_PREFIX + noteId);
    return raw ? JSON.parse(raw) : null;
  },

  set(noteId, data) {
    try {
      sessionStorage.setItem(
        CACHE_PREFIX + noteId,
        JSON.stringify(data)
      );
    } catch {
      // storage full or blocked – silently ignore
    }
  },

  has(noteId) {
    return sessionStorage.getItem(CACHE_PREFIX + noteId) !== null;
  },
};
