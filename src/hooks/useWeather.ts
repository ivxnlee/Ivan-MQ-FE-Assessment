import { useCallback, useRef, useState } from "react";
import { fetchWeatherData, type WeatherData } from "../services/weather";
import type { SearchHistoryEntry } from "../interfaces/SearchHistoryEntry";
import {
  addSearchHistoryEntry,
  getSearchHistory,
  removeSearchHistoryEntry,
} from "../services/searchHistory";

type SearchOptions = {
  // Restoring the last city on page load is not a user-initiated search,
  // so it should not add a new entry to the history.
  recordHistory?: boolean;
};

export const useWeather = (apiKey: string) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<SearchHistoryEntry[]>(() =>
    getSearchHistory(),
  );
  const requestId = useRef(0);

  // The `search` function is memoized with `useCallback` to prevent unnecessary re-creations on each render.
  const search = useCallback(
    async (
      city: string,
      { recordHistory = true }: SearchOptions = {},
    ): Promise<WeatherData | undefined> => {
      const id = ++requestId.current; // Increment the request ID for this search

      setLoading(true);
      setError(null);

      try {
        const data = await fetchWeatherData(city, apiKey);
        if (id !== requestId.current) return; // If a newer request has been made, ignore this result

        setWeatherData(data);
        if (recordHistory) {
          setHistory(
            addSearchHistoryEntry({
              city: data.name,
              country: data.sys.country,
            }),
          );
        }
        return data;
      } catch (caughtError) {
        if (id !== requestId.current) return; // If a newer request has been made, ignore this result

        setWeatherData(null);
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Unable to fetch weather data",
        );
      } finally {
        if (id === requestId.current) setLoading(false);
      }
    },
    [apiKey],
  );

  const removeHistoryEntry = useCallback((id: string) => {
    setHistory(removeSearchHistoryEntry(id));
  }, []);

  return {
    weatherData,
    loading,
    error,
    search,
    history,
    removeHistoryEntry,
  };
};
