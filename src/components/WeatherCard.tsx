import { useEffect, useRef, useState } from "react";
import styles from "./css/WeatherCard.module.css";
import { format } from "date-fns";
import type { SearchHistoryEntry } from "../interfaces/SearchHistoryEntry";
import {
  addSearchHistoryEntry,
  getSearchHistory,
  removeSearchHistoryEntry,
} from "../services/searchHistory";
import SearchHistory from "./SearchHistory";
import cloudIcon from "../assets/cloud.png";
import sunIcon from "../assets/sun.png";
import type { WeatherData } from "../services/weather";

type WeatherCardProps = {
  weatherData: WeatherData | null;
  error: string | null;
  onSearch: (city: string) => void;
};

function WeatherCard({ weatherData, error, onSearch }: WeatherCardProps) {
  const [history, setHistory] = useState<SearchHistoryEntry[]>(() =>
    getSearchHistory(),
  );
  // Holds the response already written to history, so a re-render (or
  // StrictMode's double-invoked effect) never records the same search twice.
  const recordedResponse = useRef<WeatherData | null>(null);

  useEffect(() => {
    if (!weatherData || recordedResponse.current === weatherData) return;

    recordedResponse.current = weatherData;
    setHistory(
      addSearchHistoryEntry({
        city: weatherData.name,
        country: weatherData.sys.country,
      }),
    );
  }, [weatherData]);

  const weatherIcon = weatherData?.weather[0]?.icon;
  const formattedDate = weatherData
    ? format(new Date(weatherData.dt * 1000), "dd-MM-yyyy hh:mmaaa")
    : "";

  // Spoken summary of a successful search. For Accessibility:
  // Screen readers will read this out when the weather data is updated, but it is hidden from visual users.
  const spokenSummary = weatherData
    ? [
        `Weather for ${weatherData.name}, ${weatherData.sys.country}:`,
        `${Math.round(weatherData.main.temp)} degrees,`,
        `${weatherData.weather[0].description}.`,
        weatherData.range !== null
          ? `High ${Math.round(weatherData.range.high)}, low ${Math.round(weatherData.range.low)} degrees.`
          : null,
        `Humidity ${weatherData.main.humidity} percent.`,
      ]
        .filter(Boolean)
        .join(" ")
    : "";

  return (
    <div className={styles["weather-card"]}>
      <p className="visually-hidden" role="status">
        {error ? "" : spokenSummary}
      </p>

      <div className={styles["weather-card-inner"]}>
        {error ? (
          <p className={styles["weather-error"]} role="alert">
            {error}
          </p>
        ) : weatherData ? (
          <>
            {weatherIcon && (
              <img
                className={styles["weather-icon"]}
                src={weatherIcon.endsWith("d") ? sunIcon : cloudIcon} // Use sun icon for day, cloud icon for night
                alt={weatherData.weather[0].description}
              />
            )}
            <span className={styles["weather-label"]}>Today's Weather</span>
            <div className={styles["weather-info"]}>
              <div className={styles["weather-main"]}>
                <span className={styles["temperature"]}>
                  {Math.round(weatherData.main.temp)}°
                </span>
                <span className={styles["temp-range"]}>
                  {weatherData.range !== null ? (
                    <>
                      H: {Math.round(weatherData.range.high)}° L:{" "}
                      {Math.round(weatherData.range.low)}°
                    </>
                  ) : (
                    <>H: -- L: --</>
                  )}
                </span>
                <span className={styles["location"]}>
                  {weatherData.name}, {weatherData.sys.country}
                </span>
              </div>
              <div className={styles["weather-meta"]}>
                <span>{formattedDate}</span>
                <span>Humidity: {weatherData.main.humidity}%</span>
                <span>{weatherData.weather[0].main}</span>
              </div>
            </div>
          </>
        ) : (
          <p className={styles["weather-placeholder"]}>
            No weather data available.
          </p>
        )}
      </div>

      <SearchHistory
        history={history}
        onSearch={(entry) => onSearch(entry.city)}
        onDelete={(id) => setHistory(removeSearchHistoryEntry(id))}
      />
    </div>
  );
}

export default WeatherCard;
