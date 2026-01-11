import { useState } from 'react';
import { UserInputs, Occasion, StylePreference, Mood } from '@/types/fashion';
import { MapPin, Briefcase, Palette, Heart, Search } from 'lucide-react';

interface UserInputFormProps {
  onSubmit: (inputs: UserInputs) => void;
  isLoading: boolean;
}

const OCCASIONS: { value: Occasion; label: string }[] = [
  { value: 'college', label: 'College' },
  { value: 'work', label: 'Work' },
  { value: 'casual', label: 'Casual Day' },
  { value: 'event', label: 'Special Event' },
];

const STYLES: { value: StylePreference; label: string }[] = [
  { value: 'casual', label: 'Casual' },
  { value: 'formal', label: 'Formal' },
  { value: 'comfortable', label: 'Comfortable' },
  { value: 'trendy', label: 'Trendy' },
];

const MOODS: { value: Mood; label: string }[] = [
  { value: '', label: 'No preference' },
  { value: 'confident', label: 'Confident' },
  { value: 'relaxed', label: 'Relaxed' },
  { value: 'energetic', label: 'Energetic' },
  { value: 'sophisticated', label: 'Sophisticated' },
];

const UserInputForm = ({ onSubmit, isLoading }: UserInputFormProps) => {
  const [inputs, setInputs] = useState<UserInputs>({
    location: '',
    occasion: 'casual',
    stylePreference: 'casual',
    mood: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const locationToUse = inputs.location.trim() || 'New York';
    onSubmit({ ...inputs, location: locationToUse });
  };

  const updateInput = <K extends keyof UserInputs>(key: K, value: UserInputs[K]) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Location Input */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-foreground">
          <MapPin className="h-4 w-4 text-primary" />
          Location
        </label>
        <input
          type="text"
          value={inputs.location}
          onChange={(e) => updateInput('location', e.target.value)}
          placeholder="Enter your city (e.g., London, Tokyo)"
          className="input-elegant"
        />
        <p className="text-xs text-muted-foreground">Leave empty to use default location</p>
      </div>

      {/* Occasion Select */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Briefcase className="h-4 w-4 text-primary" />
          Occasion
        </label>
        <div className="grid grid-cols-2 gap-2">
          {OCCASIONS.map((occasion) => (
            <button
              key={occasion.value}
              type="button"
              onClick={() => updateInput('occasion', occasion.value)}
              className={`py-3 px-4 rounded-lg border text-sm font-medium transition-all ${
                inputs.occasion === occasion.value
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card border-border text-foreground hover:border-primary/50'
              }`}
            >
              {occasion.label}
            </button>
          ))}
        </div>
      </div>

      {/* Style Preference */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Palette className="h-4 w-4 text-primary" />
          Style Preference
        </label>
        <div className="grid grid-cols-2 gap-2">
          {STYLES.map((style) => (
            <button
              key={style.value}
              type="button"
              onClick={() => updateInput('stylePreference', style.value)}
              className={`py-3 px-4 rounded-lg border text-sm font-medium transition-all ${
                inputs.stylePreference === style.value
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card border-border text-foreground hover:border-primary/50'
              }`}
            >
              {style.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mood (Optional) */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Heart className="h-4 w-4 text-primary" />
          Mood <span className="text-muted-foreground font-normal">(optional)</span>
        </label>
        <select
          value={inputs.mood}
          onChange={(e) => updateInput('mood', e.target.value as Mood)}
          className="input-elegant"
        >
          {MOODS.map((mood) => (
            <option key={mood.value} value={mood.value}>
              {mood.label}
            </option>
          ))}
        </select>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            <span>Finding your look...</span>
          </>
        ) : (
          <>
            <Search className="h-5 w-5" />
            <span>Get Recommendations</span>
          </>
        )}
      </button>
    </form>
  );
};

export default UserInputForm;
