import { type SearchHistoryEntry } from "../interfaces/SearchHistoryEntry";

const HISTORY_KEY = "search-history";
const MAX_ENTRIES = 30; // cap so it doesn't grow unbounded

export function getSearchHistory(): SearchHistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];

    // Parse the stored entries, converting the timestamp string back to a Date object
    const parsed = JSON.parse(raw) as (Omit<SearchHistoryEntry, "timestamp"> & {
      timestamp: string;
    })[];

    return parsed.map((e) => ({ ...e, timestamp: new Date(e.timestamp) }));
  } catch (error) {
    console.error("Failed to read search history:", error);
    return [];
  }
}

export function addSearchHistoryEntry(
  entry: Omit<SearchHistoryEntry, "id" | "timestamp">,
): SearchHistoryEntry[] {
  const newEntry: SearchHistoryEntry = {
    ...entry,
    id: crypto.randomUUID(),
    timestamp: new Date(),
  };

  const existing = getSearchHistory();
  const updated = [newEntry, ...existing].slice(0, MAX_ENTRIES); // newest first, capped

  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch (error) {
    // likely QuotaExceededError if storage is full
    console.error("Failed to save search history:", error);
  }

  return updated;
}

export function removeSearchHistoryEntry(id: string): SearchHistoryEntry[] {
  const updated = getSearchHistory().filter((e) => e.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  return updated;
}
