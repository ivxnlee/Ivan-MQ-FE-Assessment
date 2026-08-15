import type { WeatherResponse } from "../interfaces/WeatherResponse";
import type { ForecastResponse } from "../interfaces/ForecastResponse";

const API_BASE_URL = "https://api.openweathermap.org/data/2.5";

/** 8 slots x 3 hours = the next 24 hours. */
const ROLLING_WINDOW_SLOTS = 8;

export interface TemperatureRange {
  high: number;
  low: number;
}

export interface WeatherData extends WeatherResponse {
  /** High/low across the next 24 hours. `null` if the forecast call failed. */
  range: TemperatureRange | null;
}

const request = async <T>(
  path: string,
  query: string,
  city: string,
): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}/${path}?${query}`);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 404 || data.cod === "404") {
      throw new Error(`City "${city}" not found`);
    }
    if (response.status === 429) {
      throw new Error(
        "Rate limit exceeded — please wait a moment and try again",
      );
    }
    if (response.status === 401) {
      throw new Error("Invalid API key");
    }
    throw new Error(`Unexpected error (status ${response.status})`);
  }

  return data as T;
};

const getRollingRange = (
  forecast: ForecastResponse,
): TemperatureRange | null => {
  const slots = forecast.list.slice(0, ROLLING_WINDOW_SLOTS);
  if (slots.length === 0) return null;

  return {
    high: Math.max(...slots.map((slot) => slot.main.temp_max)),
    low: Math.min(...slots.map((slot) => slot.main.temp_min)),
  };
};

export const fetchWeatherData = async (
  city: string,
  apiKey: string,
): Promise<WeatherData> => {
  const query = `q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`;

  // Fetch the current weather and forecast in parallel.
  const [current, forecast] = await Promise.all([
    request<WeatherResponse>("weather", query, city),
    request<ForecastResponse>("forecast", query, city).catch(() => null),
  ]);

  return {
    ...current,
    range: forecast ? getRollingRange(forecast) : null,
  };
};
