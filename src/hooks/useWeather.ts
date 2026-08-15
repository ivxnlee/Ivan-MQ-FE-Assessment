import { useCallback, useRef, useState } from "react";
import { fetchWeatherData, type WeatherData } from "../services/weather";

export const useWeather = (apiKey: string) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestId = useRef(0);

  // The `search` function is memoized with `useCallback` to prevent unnecessary re-creations on each render.
  const search = useCallback(
    async (
      city: string,
      setCityName: (city: string) => void,
    ): Promise<WeatherData | undefined> => {
      const id = ++requestId.current; // Increment the request ID for this search

      setLoading(true);
      setError(null);
      setCityName(city);

      try {
        const data = await fetchWeatherData(city, apiKey);
        if (id !== requestId.current) return; // If a newer request has been made, ignore this result

        setWeatherData(data);
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

  return { weatherData, loading, error, search };
};
