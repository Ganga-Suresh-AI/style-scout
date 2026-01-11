import { OutfitRecommendation as OutfitRec, UserInputs } from '@/types/fashion';
import { Shirt, Lightbulb, Palette, RefreshCw } from 'lucide-react';

interface OutfitRecommendationProps {
  recommendation: OutfitRec | null;
  inputs: UserInputs | null;
  onRegenerate: () => void;
  isLoading: boolean;
}

const OutfitRecommendation = ({
  recommendation,
  inputs,
  onRegenerate,
  isLoading,
}: OutfitRecommendationProps) => {
  if (!recommendation || !inputs) return null;

  return (
    <div className="recommendation-card slide-up">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="font-heading text-3xl font-semibold text-foreground mb-2">
            {recommendation.title}
          </h2>
          <p className="text-muted-foreground max-w-lg">
            {recommendation.description}
          </p>
        </div>
        <button
          onClick={onRegenerate}
          disabled={isLoading}
          className="p-3 rounded-full bg-accent hover:bg-primary/10 transition-colors disabled:opacity-50"
          aria-label="Regenerate recommendation"
        >
          <RefreshCw className={`h-5 w-5 text-primary ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* User Selections Summary */}
      <div className="flex flex-wrap gap-2 mb-6">
        <span className="px-3 py-1 bg-accent rounded-full text-sm text-accent-foreground">
          {inputs.occasion}
        </span>
        <span className="px-3 py-1 bg-secondary rounded-full text-sm text-secondary-foreground">
          {inputs.stylePreference}
        </span>
        {inputs.mood && (
          <span className="px-3 py-1 bg-muted rounded-full text-sm text-muted-foreground">
            {inputs.mood}
          </span>
        )}
      </div>

      <div className="section-divider mb-6" />

      {/* Outfit Items */}
      <div className="mb-6">
        <h3 className="flex items-center gap-2 font-heading text-xl font-medium mb-4 text-foreground">
          <Shirt className="h-5 w-5 text-primary" />
          Recommended Items
        </h3>
        <ul className="grid gap-2">
          {recommendation.items.map((item, index) => (
            <li
              key={index}
              className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border"
            >
              <span className="w-8 h-8 flex items-center justify-center bg-primary/10 rounded-full text-primary text-sm font-medium">
                {index + 1}
              </span>
              <span className="text-foreground">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Color Palette */}
      <div className="mb-6">
        <h3 className="flex items-center gap-2 font-heading text-xl font-medium mb-4 text-foreground">
          <Palette className="h-5 w-5 text-primary" />
          Suggested Colors
        </h3>
        <div className="flex flex-wrap gap-2">
          {recommendation.colorPalette.map((color, index) => (
            <span
              key={index}
              className="px-4 py-2 bg-card border border-border rounded-lg text-sm text-foreground"
            >
              {color}
            </span>
          ))}
        </div>
      </div>

      {/* Styling Tips */}
      <div>
        <h3 className="flex items-center gap-2 font-heading text-xl font-medium mb-4 text-foreground">
          <Lightbulb className="h-5 w-5 text-primary" />
          Styling Tips
        </h3>
        <ul className="space-y-2">
          {recommendation.tips.map((tip, index) => (
            <li key={index} className="flex items-start gap-3 text-muted-foreground">
              <span className="text-primary mt-0.5">•</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default OutfitRecommendation;
