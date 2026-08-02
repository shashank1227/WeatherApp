'use client';

import { useCallback, useEffect, useState } from 'react';
import { fetchWeather, reverseGeocode } from '@/lib/weather';
import {
  formatHour,
  formatLongDate,
  formatWeekday,
  getDayPeriod,
  getWeatherMeta,
  windDirection,
} from '@/lib/weatherCodes';
import SearchBar from '@/components/SearchBar';
import ThemeToggle from '@/components/ThemeToggle';
import WeatherIcon from '@/components/WeatherIcon';

const DEFAULT_LOCATION = {
  id: 'default',
  name: 'London',
  country: 'United Kingdom',
  admin1: 'England',
  latitude: 51.5074,
  longitude: -0.1278,
  timezone: 'Europe/London',
};

export default function WeatherApp() {
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [weather, setWeather] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [locating, setLocating] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem('weather-theme');
    if (stored === 'dark' || stored === 'light') {
      setDark(stored === 'dark');
      return;
    }
    setDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    window.localStorage.setItem('weather-theme', dark ? 'dark' : 'light');
  }, [dark]);

  const loadWeather = useCallback(async (place) => {
    setStatus('loading');
    setError('');
    try {
      const data = await fetchWeather(place);
      setWeather(data);
      setLocation(place);
      setStatus('ready');
    } catch (err) {
      setError(err.message || 'Something went wrong');
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    loadWeather(DEFAULT_LOCATION);
  }, [loadWeather]);

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported in this browser');
      return;
    }

    setLocating(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const place = await reverseGeocode(latitude, longitude);
          await loadWeather(place);
        } catch (err) {
          setError(err.message || 'Could not load local weather');
          setStatus('error');
        } finally {
          setLocating(false);
        }
      },
      () => {
        setError('Location permission denied');
        setLocating(false);
      },
      { enableHighAccuracy: false, timeout: 10000 }
    );
  }

  const current = weather?.current;
  const daily = weather?.daily;
  const hourly = weather?.hourly;
  const timezone = weather?.timezone || location.timezone;
  const sunrise = daily?.sunrise?.[0];
  const sunset = daily?.sunset?.[0];
  const period = current
    ? getDayPeriod(current.time, timezone, sunrise, sunset)
    : 'noon';
  const meta = current
    ? getWeatherMeta(current.weather_code, current.is_day === 1, period)
    : getWeatherMeta(0, true, 'noon');

  const nowIndex = hourly
    ? hourly.time.findIndex((t) => new Date(t) >= new Date(current.time))
    : -1;

  const nextHours =
    hourly && nowIndex >= 0
      ? hourly.time.slice(nowIndex, nowIndex + 12).map((time, i) => {
          const idx = nowIndex + i;
          const hourPeriod = getDayPeriod(time, timezone, sunrise, sunset);
          return {
            time,
            temp: Math.round(hourly.temperature_2m[idx]),
            code: hourly.weather_code[idx],
            isDay: hourly.is_day[idx] === 1,
            precip: hourly.precipitation_probability[idx],
            period: hourPeriod,
          };
        })
      : [];

  const days =
    daily?.time.map((date, i) => ({
      date,
      code: daily.weather_code[i],
      max: Math.round(daily.temperature_2m_max[i]),
      min: Math.round(daily.temperature_2m_min[i]),
      precip: daily.precipitation_probability_max[i],
    })) || [];

  const placeLine = [location.admin1, location.country]
    .filter(Boolean)
    .join(', ');

  return (
    <div
      className={`app theme-${dark ? 'dark' : 'light'} period-${period} tone-${meta.tone}`}
    >
      <div className="shell">
        <header className="top">
          <div className="brand">
            <div className="brand__row">
              <p className="brand__mark">Weather</p>
              <ThemeToggle dark={dark} onToggle={() => setDark((value) => !value)} />
            </div>
            <p className="brand__tag">Local conditions, clearly</p>
          </div>
          <SearchBar
            onSelect={loadWeather}
            onUseLocation={useCurrentLocation}
            locating={locating}
          />
        </header>

        {status === 'loading' && !weather && (
          <div className="state">Loading weather…</div>
        )}

        {status === 'error' && !weather && (
          <div className="state state--error">
            <p>{error || 'Unable to load weather'}</p>
            <button type="button" onClick={() => loadWeather(location)}>
              Try again
            </button>
          </div>
        )}

        {weather && current && (
          <main className="main">
            <section className="hero" aria-live="polite">
              <div className="hero__place">
                <h1>{location.name}</h1>
                {placeLine && <p className="hero__region">{placeLine}</p>}
                <p className="hero__date">
                  {formatLongDate(current.time, timezone)}
                  <span className="hero__period"> · {meta.periodLabel}</span>
                </p>
              </div>

              <div className="hero__now">
                <WeatherIcon type={meta.icon} size={72} />
                <div className="hero__temp-wrap">
                  <p className="hero__temp">
                    {Math.round(current.temperature_2m)}
                    <span>°</span>
                  </p>
                  <p className="hero__condition">{meta.label}</p>
                </div>
              </div>

              <p className="hero__feels">
                Feels like {Math.round(current.apparent_temperature)}°
                {days[0] && (
                  <>
                    {' '}
                    · H:{days[0].max}° L:{days[0].min}°
                  </>
                )}
              </p>
            </section>

            <section className="stats" aria-label="Current details">
              <div>
                <span>Humidity</span>
                <strong>{current.relative_humidity_2m}%</strong>
              </div>
              <div>
                <span>Wind</span>
                <strong>
                  {Math.round(current.wind_speed_10m)} km/h{' '}
                  {windDirection(current.wind_direction_10m)}
                </strong>
              </div>
              <div>
                <span>Precip</span>
                <strong>{current.precipitation} mm</strong>
              </div>
            </section>

            {nextHours.length > 0 && (
              <section className="panel">
                <h2>Next hours</h2>
                <ul className="hours">
                  {nextHours.map((hour, i) => {
                    const hourMeta = getWeatherMeta(
                      hour.code,
                      hour.isDay,
                      hour.period
                    );
                    return (
                      <li key={hour.time}>
                        <span className="hours__time">
                          {i === 0 ? 'Now' : formatHour(hour.time, timezone)}
                        </span>
                        <WeatherIcon type={hourMeta.icon} size={28} />
                        <span className="hours__temp">{hour.temp}°</span>
                        <span className="hours__rain">{hour.precip ?? 0}%</span>
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}

            {days.length > 0 && (
              <section className="panel">
                <h2>7-day forecast</h2>
                <ul className="days">
                  {days.map((day, i) => {
                    const dayMeta = getWeatherMeta(day.code, true, 'noon');
                    return (
                      <li key={day.date}>
                        <span className="days__name">
                          {i === 0
                            ? 'Today'
                            : formatWeekday(day.date, timezone)}
                        </span>
                        <span className="days__icon">
                          <WeatherIcon type={dayMeta.icon} size={26} />
                          <span>{day.precip ?? 0}%</span>
                        </span>
                        <span className="days__range">
                          <span className="days__min">{day.min}°</span>
                          <span className="days__bar" aria-hidden="true" />
                          <span className="days__max">{day.max}°</span>
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}

            {error && status === 'error' && (
              <p className="inline-error">{error}</p>
            )}

            <footer className="footer">
              <p>Data from Open-Meteo</p>
            </footer>
          </main>
        )}
      </div>
    </div>
  );
}
