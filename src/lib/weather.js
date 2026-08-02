const GEO_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';

export async function searchLocations(query) {
  if (!query || query.trim().length < 2) return [];

  const params = new URLSearchParams({
    name: query.trim(),
    count: '6',
    language: 'en',
    format: 'json',
  });

  const response = await fetch(`${GEO_URL}?${params}`);
  if (!response.ok) throw new Error('Unable to search locations');

  const data = await response.json();
  return (data.results || []).map((place) => ({
    id: `${place.id}`,
    name: place.name,
    country: place.country || '',
    admin1: place.admin1 || '',
    latitude: place.latitude,
    longitude: place.longitude,
    timezone: place.timezone,
  }));
}

export async function fetchWeather({ latitude, longitude, timezone }) {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    timezone: timezone || 'auto',
    current:
      'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,wind_direction_10m',
    hourly: 'temperature_2m,weather_code,precipitation_probability,is_day',
    daily:
      'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset',
    forecast_days: '7',
  });

  const response = await fetch(`${WEATHER_URL}?${params}`);
  if (!response.ok) throw new Error('Unable to fetch weather');

  return response.json();
}

export async function reverseGeocode(latitude, longitude) {
  const response = await fetch(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
  );
  if (!response.ok) throw new Error('Unable to resolve location');

  const data = await response.json();
  return {
    id: 'geo',
    name: data.city || data.locality || data.principalSubdivision || 'Current location',
    country: data.countryName || '',
    admin1: data.principalSubdivision || '',
    latitude,
    longitude,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
}
