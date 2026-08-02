function SunRays({
  cx = 24,
  cy = 24,
  inner = 11,
  outer = 17,
  count = 8,
  startDeg = -90,
  sweep = 360,
}) {
  const step = sweep >= 360 ? sweep / count : sweep / Math.max(count - 1, 1);

  return Array.from({ length: count }, (_, i) => {
    const deg = startDeg + step * i;
    const rad = (deg * Math.PI) / 180;
    return (
      <line
        key={`${deg}-${i}`}
        x1={cx + Math.cos(rad) * inner}
        y1={cy + Math.sin(rad) * inner}
        x2={cx + Math.cos(rad) * outer}
        y2={cy + Math.sin(rad) * outer}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    );
  });
}

export default function WeatherIcon({ type, size = 48 }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 48 48',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
    'aria-hidden': true,
    className: `weather-icon weather-icon--${type}`,
  };

  switch (type) {
    case 'sun':
      return (
        <svg {...common}>
          <SunRays cx={24} cy={24} inner={11} outer={17.5} count={12} />
          <circle cx="24" cy="24" r="7.5" fill="currentColor" />
        </svg>
      );
    case 'morning':
      return (
        <svg {...common}>
          <SunRays
            cx={24}
            cy={22}
            inner={10}
            outer={15}
            count={7}
            startDeg={-155}
            sweep={130}
          />
          <circle cx="24" cy="22" r="6.5" fill="currentColor" />
          <path
            d="M8 30h32"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );
    case 'evening':
      return (
        <svg {...common}>
          <SunRays
            cx={27}
            cy={22}
            inner={10}
            outer={15}
            count={6}
            startDeg={-145}
            sweep={110}
          />
          <circle cx="27" cy="22" r="6.5" fill="currentColor" />
          <path
            d="M8 31h32"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );
    case 'night':
      return (
        <svg {...common}>
          <path
            d="M28 12a11 11 0 1 0 7.5 19.5A9 9 0 0 1 28 12Z"
            fill="currentColor"
          />
          <circle cx="33" cy="15" r="1.1" fill="currentColor" opacity="0.7" />
          <circle cx="36.5" cy="20" r="0.85" fill="currentColor" opacity="0.55" />
          <circle cx="32" cy="23.5" r="0.75" fill="currentColor" opacity="0.45" />
        </svg>
      );
    case 'partly':
      return (
        <svg {...common}>
          <circle cx="17" cy="16" r="5" fill="currentColor" />
          <SunRays cx={17} cy={16} inner={7.5} outer={11} count={8} />
          <path
            d="M12 34h22a6.5 6.5 0 0 0 0-13 8.5 8.5 0 0 0-16.3-2.2A6 6 0 0 0 12 34Z"
            fill="currentColor"
            fillOpacity="0.16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'partly-morning':
      return (
        <svg {...common}>
          <circle cx="16" cy="17" r="4.5" fill="currentColor" />
          <SunRays
            cx={16}
            cy={17}
            inner={7}
            outer={10.5}
            count={6}
            startDeg={-150}
            sweep={120}
          />
          <path
            d="M8 29h32"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M14 35h18a5.5 5.5 0 0 0 0-11 7 7 0 0 0-13.4-1.8A5 5 0 0 0 14 35Z"
            fill="currentColor"
            fillOpacity="0.16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'partly-evening':
      return (
        <svg {...common}>
          <circle cx="31" cy="16" r="4.5" fill="currentColor" />
          <SunRays
            cx={31}
            cy={16}
            inner={7}
            outer={10.5}
            count={6}
            startDeg={-140}
            sweep={110}
          />
          <path
            d="M8 30h32"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M13 35h18a5.5 5.5 0 0 0 0-11 7 7 0 0 0-13.4-1.8A5 5 0 0 0 13 35Z"
            fill="currentColor"
            fillOpacity="0.16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'partly-night':
      return (
        <svg {...common}>
          <path
            d="M19 13a7 7 0 1 0 6.2 10.2A5.8 5.8 0 0 1 19 13Z"
            fill="currentColor"
          />
          <path
            d="M12 34h22a6.5 6.5 0 0 0 0-13 8.5 8.5 0 0 0-16.3-2.2A6 6 0 0 0 12 34Z"
            fill="currentColor"
            fillOpacity="0.16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'cloud':
      return (
        <svg {...common}>
          <path
            d="M12 33h23a7 7 0 0 0 0-14 9.5 9.5 0 0 0-18.4-2.4A6.5 6.5 0 0 0 12 33Z"
            fill="currentColor"
            fillOpacity="0.16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'fog':
      return (
        <svg {...common}>
          <path
            d="M12 18h24M10 24h28M14 30h20"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );
    case 'drizzle':
      return (
        <svg {...common}>
          <path
            d="M13 22h21a6.5 6.5 0 0 0 0-13 8.5 8.5 0 0 0-16.4-2A5.8 5.8 0 0 0 13 22Z"
            fill="currentColor"
            fillOpacity="0.16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M18 27v3.5M24 26.5v4M30 27v3.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );
    case 'rain':
      return (
        <svg {...common}>
          <path
            d="M13 21h21a6.5 6.5 0 0 0 0-13 8.5 8.5 0 0 0-16.4-2A5.8 5.8 0 0 0 13 21Z"
            fill="currentColor"
            fillOpacity="0.16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M18 26l-1.5 6M24 25.5l-1.5 7M30 26l-1.5 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );
    case 'snow':
      return (
        <svg {...common}>
          <path
            d="M13 21h21a6.5 6.5 0 0 0 0-13 8.5 8.5 0 0 0-16.4-2A5.8 5.8 0 0 0 13 21Z"
            fill="currentColor"
            fillOpacity="0.16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M18 28h0.01M24 31h0.01M30 28h0.01M21 33h0.01M27 33h0.01"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      );
    case 'storm':
      return (
        <svg {...common}>
          <path
            d="M13 18h20a6.5 6.5 0 0 0 0-13 8.5 8.5 0 0 0-16.5-1.8A5.8 5.8 0 0 0 13 18Z"
            fill="currentColor"
            fillOpacity="0.14"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M23 20.5l-4 6.5h3.8L19.5 36 28 26.5h-4L27.5 20.5H23Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="24" cy="24" r="9" stroke="currentColor" strokeWidth="2" />
        </svg>
      );
  }
}
