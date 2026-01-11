import { UserInputs, WeatherData, OutfitRecommendation, Occasion, StylePreference, Mood } from '@/types/fashion';

/**
 * Weather-based clothing recommendations
 */
const WEATHER_RULES: Record<WeatherData['condition'], { base: string[]; accessories: string[] }> = {
  hot: {
    base: ['Light cotton shirt', 'Breathable linen pants', 'Shorts', 'Flowy dress', 'Tank top'],
    accessories: ['Sunglasses', 'Sun hat', 'Light scarf'],
  },
  warm: {
    base: ['Cotton t-shirt', 'Light blouse', 'Chinos', 'Midi skirt', 'Short-sleeve button-up'],
    accessories: ['Sunglasses', 'Light cardigan for evening'],
  },
  mild: {
    base: ['Long-sleeve shirt', 'Light sweater', 'Jeans', 'Blazer', 'Cardigan'],
    accessories: ['Light jacket', 'Scarf'],
  },
  cold: {
    base: ['Warm sweater', 'Wool coat', 'Layered top', 'Thermal base', 'Heavy jeans'],
    accessories: ['Warm scarf', 'Beanie', 'Gloves', 'Warm boots'],
  },
  rainy: {
    base: ['Water-resistant jacket', 'Quick-dry pants', 'Layered outfit'],
    accessories: ['Umbrella', 'Waterproof boots', 'Rain hat'],
  },
};

/**
 * Occasion-specific recommendations
 */
const OCCASION_RULES: Record<Occasion, { items: string[]; tips: string[] }> = {
  college: {
    items: ['Comfortable sneakers', 'Backpack-friendly layers', 'Casual denim'],
    tips: ['Prioritize comfort for long days', 'Choose versatile pieces', 'Easy to wash fabrics'],
  },
  work: {
    items: ['Tailored trousers', 'Collared shirt', 'Blazer', 'Loafers or dress shoes'],
    tips: ['Keep it professional yet comfortable', 'Neutral colors are safe choices', 'Iron your clothes'],
  },
  casual: {
    items: ['Relaxed jeans', 'Comfortable tee', 'Sneakers', 'Hoodie'],
    tips: ['Express your personal style', 'Mix patterns if you feel bold', 'Comfort is key'],
  },
  event: {
    items: ['Elegant dress or suit', 'Statement piece', 'Dress shoes', 'Minimal jewelry'],
    tips: ['Check the dress code', 'Choose quality over quantity', 'Add one statement accessory'],
  },
};

/**
 * Style preference modifiers
 */
const STYLE_MODIFIERS: Record<StylePreference, { adjectives: string[]; colors: string[] }> = {
  casual: {
    adjectives: ['relaxed', 'effortless', 'easy-going'],
    colors: ['Denim blue', 'White', 'Earth tones', 'Soft grey'],
  },
  formal: {
    adjectives: ['polished', 'sophisticated', 'refined'],
    colors: ['Navy', 'Charcoal', 'Burgundy', 'Classic black'],
  },
  comfortable: {
    adjectives: ['cozy', 'soft', 'stretchy'],
    colors: ['Cream', 'Soft pastels', 'Warm neutrals', 'Olive'],
  },
  trendy: {
    adjectives: ['bold', 'statement-making', 'contemporary'],
    colors: ['Trending colors', 'Bold patterns', 'Mixed textures', 'Metallics'],
  },
};

/**
 * Mood enhancers
 */
const MOOD_TIPS: Record<Mood, string[]> = {
  confident: ['Power colors like red or black', 'Well-fitted silhouettes', 'Statement accessories'],
  relaxed: ['Flowing fabrics', 'Neutral tones', 'Comfortable fits'],
  energetic: ['Bright colors', 'Bold patterns', 'Athletic-inspired pieces'],
  sophisticated: ['Monochromatic looks', 'Quality fabrics', 'Minimal jewelry'],
  '': [],
};

/**
 * Main recommendation engine
 * Combines weather, occasion, style, and mood to generate outfit suggestions
 */
export function generateRecommendation(
  inputs: UserInputs,
  weather: WeatherData
): OutfitRecommendation {
  const weatherClothing = WEATHER_RULES[weather.condition];
  const occasionRules = OCCASION_RULES[inputs.occasion];
  const styleModifiers = STYLE_MODIFIERS[inputs.stylePreference];
  const moodTips = MOOD_TIPS[inputs.mood];

  // Combine items from different sources
  const allItems = [
    ...weatherClothing.base.slice(0, 2),
    ...occasionRules.items.slice(0, 2),
    ...weatherClothing.accessories.slice(0, 1),
  ];

  // Generate tips
  const tips = [
    ...occasionRules.tips.slice(0, 2),
    ...moodTips.slice(0, 1),
    `Consider ${styleModifiers.adjectives[0]} pieces for your ${inputs.stylePreference} style`,
  ].filter(Boolean);

  // Create title based on inputs
  const title = generateTitle(inputs, weather);

  // Create description
  const description = generateDescription(inputs, weather, styleModifiers);

  return {
    title,
    description,
    items: allItems,
    tips,
    colorPalette: styleModifiers.colors,
  };
}

/**
 * Generates a catchy title for the recommendation
 */
function generateTitle(inputs: UserInputs, weather: WeatherData): string {
  const styleWord = STYLE_MODIFIERS[inputs.stylePreference].adjectives[0];
  const occasionWord = inputs.occasion.charAt(0).toUpperCase() + inputs.occasion.slice(1);
  
  return `${styleWord.charAt(0).toUpperCase() + styleWord.slice(1)} ${occasionWord} Look`;
}

/**
 * Generates the main description for the outfit
 */
function generateDescription(
  inputs: UserInputs,
  weather: WeatherData,
  styleModifiers: { adjectives: string[]; colors: string[] }
): string {
  const weatherPhrase = weather.condition === 'rainy' 
    ? 'rain-ready' 
    : weather.condition === 'cold' 
    ? 'cozy and warm' 
    : 'weather-appropriate';

  return `A ${styleModifiers.adjectives[0]} outfit perfect for ${inputs.occasion}. This ${weatherPhrase} ensemble combines comfort with style, featuring versatile pieces that work beautifully together.`;
}

/**
 * Quick recommendation for regenerate functionality
 */
export function shuffleRecommendation(
  inputs: UserInputs,
  weather: WeatherData,
  previousRec: OutfitRecommendation
): OutfitRecommendation {
  const newRec = generateRecommendation(inputs, weather);
  
  // Shuffle items for variety
  const shuffledItems = [...newRec.items].sort(() => Math.random() - 0.5);
  const shuffledTips = [...newRec.tips].sort(() => Math.random() - 0.5);
  
  return {
    ...newRec,
    items: shuffledItems,
    tips: shuffledTips,
  };
}
