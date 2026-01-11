import { WeatherData } from '@/types/fashion';
import { Cloud, Droplets, Thermometer } from 'lucide-react';

interface WeatherDisplayProps {
  weather: WeatherData | null;
  isLoading: boolean;
}

const WeatherDisplay = ({ weather, isLoading }: WeatherDisplayProps) => {
  if (isLoading) {
    return (
      <div className="weather-card animate-pulse-soft">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-secondary/50 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="h-6 bg-secondary/50 rounded w-32" />
            <div className="h-4 bg-secondary/50 rounded w-48" />
          </div>
        </div>
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div className="weather-card fade-in">
      <div className="flex items-center gap-4">
        <div className="text-5xl">{weather.icon}</div>
        <div className="flex-1">
          <h3 className="font-heading text-2xl font-semibold text-secondary-foreground">
            {weather.city}
          </h3>
          <p className="text-secondary-foreground/80">{weather.description}</p>
        </div>
      </div>
      
      <div className="mt-4 flex gap-6 text-sm text-secondary-foreground/70">
        <div className="flex items-center gap-2">
          <Thermometer className="h-4 w-4" />
          <span>{weather.temperature}°C</span>
        </div>
        <div className="flex items-center gap-2">
          <Droplets className="h-4 w-4" />
          <span>{weather.humidity}% humidity</span>
        </div>
        <div className="flex items-center gap-2">
          <Cloud className="h-4 w-4" />
          <span className="capitalize">{weather.condition}</span>
        </div>
      </div>
    </div>
  );
};

export default WeatherDisplay;
