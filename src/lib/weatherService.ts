import { WeatherData } from '@/types/fashion';

// Default weather fallback when API is unavailable
const DEFAULT_WEATHER: WeatherData = {
  temperature: 22,
  condition: 'mild',
  description: 'Pleasant weather',
  humidity: 50,
  city: 'Your Location',
  icon: '☀️',
};

/**
 * Determines weather condition category based on temperature and weather code
 */
function getWeatherCondition(temp: number, weatherCode: number): WeatherData['condition'] {
  // Check for rain first (weather codes 200-599 are thunderstorm/rain)
  if (weatherCode >= 200 && weatherCode < 600) {
    return 'rainy';
  }
  
  // Temperature-based conditions
  if (temp >= 30) return 'hot';
  if (temp >= 22) return 'warm';
  if (temp >= 12) return 'mild';
  return 'cold';
}

/**
 * Gets weather icon based on condition
 */
function getWeatherIcon(condition: WeatherData['condition']): string {
  const icons: Record<WeatherData['condition'], string> = {
    hot: '🌡️',
    warm: '☀️',
    mild: '🌤️',
    cold: '❄️',
    rainy: '🌧️',
  };
  return icons[condition];
}

/**
 * Fetches weather data from Open-Meteo API (free, no API key required)
 * Falls back to default weather if API fails
 */
export async function fetchWeather(city: string): Promise<WeatherData> {
  try {
    // First, geocode the city name to get coordinates
    const geoResponse = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
    );
    
    if (!geoResponse.ok) {
      throw new Error('Geocoding failed');
    }
    
    const geoData = await geoResponse.json();
    
    if (!geoData.results || geoData.results.length === 0) {
      console.warn(`City "${city}" not found, using defaults`);
      return { ...DEFAULT_WEATHER, city };
    }
    
    const { latitude, longitude, name } = geoData.results[0];
    
    // Fetch weather data using coordinates
    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code&timezone=auto`
    );
    
    if (!weatherResponse.ok) {
      throw new Error('Weather fetch failed');
    }
    
    const weatherData = await weatherResponse.json();
    const current = weatherData.current;
    
    const temperature = Math.round(current.temperature_2m);
    const condition = getWeatherCondition(temperature, current.weather_code);
    
    return {
      temperature,
      condition,
      description: getWeatherDescription(condition, temperature),
      humidity: current.relative_humidity_2m,
      city: name,
      icon: getWeatherIcon(condition),
    };
  } catch (error) {
    console.error('Weather fetch error:', error);
    return { ...DEFAULT_WEATHER, city };
  }
}

/**
 * Generates a human-readable weather description
 */
function getWeatherDescription(condition: WeatherData['condition'], temp: number): string {
  const descriptions: Record<WeatherData['condition'], string> = {
    hot: `Hot day at ${temp}°C - stay cool!`,
    warm: `Warm and pleasant at ${temp}°C`,
    mild: `Comfortable ${temp}°C - perfect for layers`,
    cold: `Chilly ${temp}°C - bundle up!`,
    rainy: `Rainy conditions at ${temp}°C - bring an umbrella`,
  };
  return descriptions[condition];
}
