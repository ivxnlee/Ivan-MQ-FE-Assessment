# Weather App — Merquri Frontend Assessment

A weather search app built with React, TypeScript and Vite. Search any city or
country, see the current conditions, and revisit past searches from a persisted
history panel. Supports light and dark themes.

Data comes from the [OpenWeatherMap API](https://openweathermap.org/api).

## Getting started

**Prerequisites:** Node.js `^20.19.0 || >=22.12.0` (required by Vite 8).

```bash
npm install
```

Create a `.env` in the project root with an OpenWeatherMap API key
(see `.env.example`):

```bash
VITE_OPENWEATHER_API_KEY=your_key_here
```

A free key is available at [openweathermap.org/api](https://openweathermap.org/api).
New keys can take up to 2 hours to activate — until then the API returns `401`
and the app shows "Invalid API key".

Then start the dev server:

```bash
npm run dev
```

## Scripts

| Command           | Description                                    |
| ----------------- | ---------------------------------------------- |
| `npm run dev`     | Start the Vite dev server with HMR             |
| `npm run build`   | Type-check (`tsc -b`) and build for production |
| `npm run preview` | Serve the production build locally             |
| `npm run lint`    | Run ESLint across the project                  |

## Features

- **Search by city or country** — submit with the search button or the Enter key.
- **Current conditions** — temperature, 24-hour high/low, location, date and
  time of the reading, humidity, and the weather description.
- **Search history** — every successful search is saved to `localStorage`,
  newest first and capped at 30 entries. Each row can be re-searched or removed.
- **Light / dark theme** — toggled in the bottom-left corner. The choice is
  persisted; on a first visit the app follows the OS `prefers-color-scheme`.
- **Responsive layout** — a single breakpoint at 600px adapts the card, the
  history rows and the search controls for mobile.

## Project structure

```
src/
├── App.tsx                 # Layout, theme state, wires search to the card
├── components/
│   ├── SearchArea.tsx      # Search input and button
│   ├── WeatherCard.tsx     # Current conditions + owns the history state
│   ├── SearchHistory.tsx   # History list (presentational)
│   └── css/                # CSS Modules for the two card components
├── hooks/
│   └── useWeather.ts       # Fetch state: data, loading, error, search()
├── services/
│   ├── weather.ts          # OpenWeatherMap calls and error mapping
│   └── searchHistory.ts    # localStorage read/write for history
├── interfaces/             # API and domain types
├── App.css                 # App shell, theme tokens, search controls
└── index.css               # Global reset and base typography
```

## Tech stack

React 19 · TypeScript · Vite 8 · CSS Modules · date-fns · ESLint
