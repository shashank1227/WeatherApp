const CODES = {
  0: { label: 'Clear', icon: 'clear', tone: 'clear' },
  1: { label: 'Mainly clear', icon: 'clear', tone: 'clear' },
  2: { label: 'Partly cloudy', icon: 'partly', tone: 'cloud' },
  3: { label: 'Overcast', icon: 'cloud', tone: 'cloud' },
  45: { label: 'Fog', icon: 'fog', tone: 'fog' },
  48: { label: 'Rime fog', icon: 'fog', tone: 'fog' },
  51: { label: 'Light drizzle', icon: 'drizzle', tone: 'rain' },
  53: { label: 'Drizzle', icon: 'drizzle', tone: 'rain' },
  55: { label: 'Heavy drizzle', icon: 'drizzle', tone: 'rain' },
  56: { label: 'Freezing drizzle', icon: 'drizzle', tone: 'rain' },
  57: { label: 'Freezing drizzle', icon: 'drizzle', tone: 'rain' },
  61: { label: 'Light rain', icon: 'rain', tone: 'rain' },
  63: { label: 'Rain', icon: 'rain', tone: 'rain' },
  65: { label: 'Heavy rain', icon: 'rain', tone: 'rain' },
  66: { label: 'Freezing rain', icon: 'rain', tone: 'rain' },
  67: { label: 'Freezing rain', icon: 'rain', tone: 'rain' },
  71: { label: 'Light snow', icon: 'snow', tone: 'snow' },
  73: { label: 'Snow', icon: 'snow', tone: 'snow' },
  75: { label: 'Heavy snow', icon: 'snow', tone: 'snow' },
  77: { label: 'Snow grains', icon: 'snow', tone: 'snow' },
  80: { label: 'Rain showers', icon: 'rain', tone: 'rain' },
  81: { label: 'Rain showers', icon: 'rain', tone: 'rain' },
  82: { label: 'Heavy showers', icon: 'rain', tone: 'rain' },
  85: { label: 'Snow showers', icon: 'snow', tone: 'snow' },
  86: { label: 'Snow showers', icon: 'snow', tone: 'snow' },
  95: { label: 'Thunderstorm', icon: 'storm', tone: 'storm' },
  96: { label: 'Thunderstorm', icon: 'storm', tone: 'storm' },
  99: { label: 'Thunderstorm', icon: 'storm', tone: 'storm' },
};

const PERIOD_LABELS = {
  morning: 'Morning',
  noon: 'Noon',
  evening: 'Evening',
  night: 'Night',
};

export function getHourInTimezone(iso, timezone) {
  const parts = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    hourCycle: 'h23',
    timeZone: timezone,
  }).formatToParts(new Date(iso));
  return Number(parts.find((part) => part.type === 'hour')?.value ?? 0);
}

export function getDayPeriod(iso, timezone, sunriseIso, sunsetIso) {
  const now = new Date(iso).getTime();
  const sunrise = sunriseIso ? new Date(sunriseIso).getTime() : null;
  const sunset = sunsetIso ? new Date(sunsetIso).getTime() : null;

  if (sunrise && sunset && (now < sunrise || now >= sunset)) {
    return 'night';
  }

  const hour = getHourInTimezone(iso, timezone);

  if (hour >= 5 && hour < 11) return 'morning';
  if (hour >= 11 && hour < 16) return 'noon';
  if (hour >= 16 && hour < 21) return 'evening';
  return 'night';
}

function resolveIcon(baseIcon, period, isDay) {
  const night = period === 'night' || !isDay;

  if (baseIcon === 'clear') {
    if (night) return 'night';
    if (period === 'morning') return 'morning';
    if (period === 'evening') return 'evening';
    return 'sun';
  }

  if (baseIcon === 'partly') {
    if (night) return 'partly-night';
    if (period === 'morning') return 'partly-morning';
    if (period === 'evening') return 'partly-evening';
    return 'partly';
  }

  return baseIcon;
}

export function getWeatherMeta(code, isDay = true, period = 'noon') {
  const meta = CODES[code] || { label: 'Unknown', icon: 'cloud', tone: 'cloud' };
  const icon = resolveIcon(meta.icon, period, isDay);

  return {
    ...meta,
    icon,
    period,
    periodLabel: PERIOD_LABELS[period] || PERIOD_LABELS.noon,
  };
}

export function formatHour(iso, timezone) {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    hour12: true,
    timeZone: timezone,
  }).format(new Date(iso));
}

export function formatWeekday(iso, timezone) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    timeZone: timezone,
  }).format(new Date(iso));
}

export function formatLongDate(iso, timezone) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    timeZone: timezone,
  }).format(new Date(iso));
}

export function windDirection(degrees) {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return dirs[Math.round(degrees / 45) % 8];
}
