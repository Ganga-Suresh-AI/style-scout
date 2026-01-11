// Types for the fashion recommendation app

export type Occasion = 'college' | 'work' | 'casual' | 'event';
export type StylePreference = 'casual' | 'formal' | 'comfortable' | 'trendy';
export type Mood = 'confident' | 'relaxed' | 'energetic' | 'sophisticated' | '';

export interface UserInputs {
  location: string;
  occasion: Occasion;
  stylePreference: StylePreference;
  mood: Mood;
}

export interface WeatherData {
  temperature: number;
  condition: 'hot' | 'warm' | 'mild' | 'cold' | 'rainy';
  description: string;
  humidity: number;
  city: string;
  icon: string;
}

export interface OutfitRecommendation {
  title: string;
  description: string;
  items: string[];
  tips: string[];
  colorPalette: string[];
}

export interface TryOnImages {
  selfie: string | null;
  clothing: string | null;
}
