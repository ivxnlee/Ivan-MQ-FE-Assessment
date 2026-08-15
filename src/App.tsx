import { useEffect, useState } from "react";
import "./App.css";
import WeatherCard from "./components/WeatherCard";
import SearchArea from "./components/SearchArea";
import { useWeather } from "./hooks/useWeather";
import { getSearchHistory } from "./services/searchHistory";

type ThemeMode = "light" | "dark";

const DEFAULT_CITY = "Singapore";

function App() {
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

  const [cityName, setCityName] = useState<string>(
    () => getSearchHistory()[0]?.city || DEFAULT_CITY,
  );

  const [theme, setTheme] = useState<ThemeMode>(() => {
    const savedTheme = localStorage.getItem("weather-theme");
    if (savedTheme === "light" || savedTheme === "dark") {
      return savedTheme;
    }

    // If no saved theme, use the system preference as the default.
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });
  const { weatherData, loading, error, search, history, removeHistoryEntry } =
    useWeather(apiKey);

  useEffect(() => {
    // Restore the most recent city when the component mounts. This is not a
    // user-initiated search, so it must not add an entry to the history.
    const mostRecentCity = getSearchHistory()[0]?.city || DEFAULT_CITY;
    search(mostRecentCity, { recordHistory: false });
  }, [search]);

  useEffect(() => {
    localStorage.setItem("weather-theme", theme);

    // Update the data-theme attribute on the root element for CSS theming
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const isDarkMode = theme === "dark";

  const handleSearch = async (city: string) => {
    setCityName(city);
    await search(city);
  };

  return (
    <div
      className={`app-shell ${isDarkMode ? "bg-dark text-light" : "bg-light text-dark"}`}
    >
      <button
        type="button"
        className="theme-toggle"
        onClick={() => setTheme(isDarkMode ? "light" : "dark")}
        aria-label={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
      >
        <span aria-hidden="true">{isDarkMode ? "☀️" : "🌙"}</span>
        <span className="theme-toggle-label">
          {isDarkMode ? " Light" : " Dark"}
        </span>
      </button>
      <div className="content">
        <SearchArea
          cityName={cityName}
          setCityName={setCityName}
          onSearch={handleSearch}
          loading={loading}
        />
        <WeatherCard
          weatherData={weatherData}
          error={error}
          history={history}
          onSearch={handleSearch}
          onDeleteHistoryEntry={removeHistoryEntry}
        />
      </div>
    </div>
  );
}

export default App;
