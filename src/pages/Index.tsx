import { useState, useCallback } from 'react';
import { UserInputs, WeatherData, OutfitRecommendation as OutfitRec, TryOnImages } from '@/types/fashion';
import { fetchWeather } from '@/lib/weatherService';
import { generateRecommendation, shuffleRecommendation } from '@/lib/recommendationEngine';
import Header from '@/components/Header';
import WeatherDisplay from '@/components/WeatherDisplay';
import UserInputForm from '@/components/UserInputForm';
import OutfitRecommendation from '@/components/OutfitRecommendation';
import VirtualTryOn from '@/components/VirtualTryOn';
import { RotateCcw } from 'lucide-react';

const Index = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [recommendation, setRecommendation] = useState<OutfitRec | null>(null);
  const [currentInputs, setCurrentInputs] = useState<UserInputs | null>(null);
  const [tryOnImages, setTryOnImages] = useState<TryOnImages>({ selfie: null, clothing: null });
  const [isLoading, setIsLoading] = useState(false);
  const [isWeatherLoading, setIsWeatherLoading] = useState(false);

  const handleSubmit = useCallback(async (inputs: UserInputs) => {
    setIsLoading(true);
    setIsWeatherLoading(true);
    setCurrentInputs(inputs);

    try {
      // Fetch weather data
      const weatherData = await fetchWeather(inputs.location);
      setWeather(weatherData);
      setIsWeatherLoading(false);

      // Generate recommendation based on inputs and weather
      const rec = generateRecommendation(inputs, weatherData);
      setRecommendation(rec);
    } catch (error) {
      console.error('Error generating recommendation:', error);
    } finally {
      setIsLoading(false);
      setIsWeatherLoading(false);
    }
  }, []);

  const handleRegenerate = useCallback(() => {
    if (!currentInputs || !weather || !recommendation) return;
    
    setIsLoading(true);
    // Simulate slight delay for better UX
    setTimeout(() => {
      const newRec = shuffleRecommendation(currentInputs, weather, recommendation);
      setRecommendation(newRec);
      setIsLoading(false);
    }, 500);
  }, [currentInputs, weather, recommendation]);

  const handleReset = useCallback(() => {
    setWeather(null);
    setRecommendation(null);
    setCurrentInputs(null);
    setTryOnImages({ selfie: null, clothing: null });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <Header />

        <main className="mt-8 grid lg:grid-cols-2 gap-8">
          {/* Left Column - Input Form */}
          <div className="space-y-6">
            <div className="card-elevated p-6">
              <h2 className="font-heading text-2xl font-semibold mb-6 text-foreground">
                Tell us about your day
              </h2>
              <UserInputForm onSubmit={handleSubmit} isLoading={isLoading} />
            </div>

            {/* Weather Display */}
            {(weather || isWeatherLoading) && (
              <WeatherDisplay weather={weather} isLoading={isWeatherLoading} />
            )}

            {/* Reset Button */}
            {recommendation && (
              <button
                onClick={handleReset}
                className="w-full py-3 px-4 border border-border rounded-lg text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Start Over
              </button>
            )}
          </div>

          {/* Right Column - Results */}
          <div className="space-y-6">
            {recommendation ? (
              <>
                <OutfitRecommendation
                  recommendation={recommendation}
                  inputs={currentInputs}
                  onRegenerate={handleRegenerate}
                  isLoading={isLoading}
                />
                <VirtualTryOn images={tryOnImages} onImagesChange={setTryOnImages} />
              </>
            ) : (
              <div className="card-elevated p-12 text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-accent flex items-center justify-center">
                  <span className="text-4xl">👗</span>
                </div>
                <h3 className="font-heading text-2xl font-semibold mb-3 text-foreground">
                  Ready to find your perfect look?
                </h3>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  Enter your location and preferences to get personalized outfit recommendations 
                  based on the current weather and your style.
                </p>
              </div>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-16 py-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            StyleMuse — AI-powered fashion recommendations for every occasion
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
