import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Eye, EyeOff, Building2 } from 'lucide-react';
import Logo from '@/components/Logo';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: 'url(/login-bg.jpg)' }}
      />
      {/* Animated dots overlay */}
      <div className="absolute inset-0">
        {Array.from({ length: 30 }, (_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-primary/20 animate-dot-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${3 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Login card */}
      <div className="relative z-10 w-full max-w-[400px] mx-4">
        <div className="bg-card border border-border rounded-2xl p-10 shadow-xl">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <Logo size="lg" />
            <p className="text-sm text-muted-foreground mt-2">Lokale Energiehub Beheer</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">E-mailadres</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="naam@voorbeeld.nl"
                className="w-full h-11 px-4 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Wachtwoord</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 px-4 pr-10 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded border-border accent-primary"
                />
                <span className="text-muted-foreground">Onthoud mij</span>
              </label>
              <a href="#" className="text-primary hover:underline">Wachtwoord vergeten?</a>
            </div>

            <button
              type="submit"
              className="w-full h-11 bg-primary text-primary-foreground rounded-xl text-base font-semibold hover:bg-primary/90 transition-colors"
            >
              Inloggen
            </button>

            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-card text-muted-foreground">of</span>
              </div>
            </div>

            <button
              type="button"
              className="w-full h-10 border border-border rounded-xl text-sm font-medium hover:bg-muted transition-colors flex items-center justify-center gap-2"
            >
              <Building2 size={16} />
              Inloggen met organisatie
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Nog geen account?{' '}
            <a href="#" className="text-primary hover:underline">Neem contact op</a>
          </p>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          &copy; 2024 Voltwise &mdash; Lokale Energiehub Management
        </p>
      </div>
    </div>
  );
}
