import { Sparkles } from 'lucide-react';

const Header = () => {
  return (
    <header className="w-full py-8 px-6 text-center">
      <div className="flex items-center justify-center gap-3 mb-2">
        <Sparkles className="h-8 w-8 text-primary" />
        <h1 className="font-heading text-4xl md:text-5xl font-semibold tracking-tight text-foreground">
          Style<span className="gradient-text">Muse</span>
        </h1>
      </div>
      <p className="text-muted-foreground font-body text-lg max-w-md mx-auto">
        Your AI-powered personal stylist for weather-smart outfit recommendations
      </p>
    </header>
  );
};

export default Header;
