# WeatherApp

A minimal Next.js weather app for clear local conditions — by city search or your current location.

## Features

- City search with autocomplete
- Current location (browser geolocation)
- Current conditions: temperature, feels like, humidity, wind, precipitation
- Next 12 hours and 7-day forecast
- Time-of-day atmosphere: morning, noon, evening, night
- Weather-aware icons (sun, clouds, rain, storm, and more)
- Light / dark mode toggle (saved in local storage)
- Responsive layout across phones, tablets, and desktops
- Flat UI with solid colors — no gradients
- No API key required

## Stack

- [Next.js](https://nextjs.org/) (App Router)
- React
- [Open-Meteo](https://open-meteo.com/) — forecast and geocoding

## Getting started

**Requirements:** Node.js 18+

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm start` | Run the production server |
| `npm run lint` | Lint the project |

## Project structure

```text
src/
  app/           # Next.js App Router (layout, page, styles, favicon)
  components/    # UI: WeatherApp, SearchBar, ThemeToggle, WeatherIcon
  lib/           # Open-Meteo client and weather code helpers
```

## Notes

- Forecast data comes from Open-Meteo; reverse geocoding uses BigDataCloud’s client endpoint.
- Theme preference is stored under `weather-theme` in `localStorage`.
