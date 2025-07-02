'use client';
import { useAuth } from '@/hooks/use-auth';
import LoginScreen from '@/components/login-screen';
import Dashboard from '@/components/dashboard/dashboard';
import SuaveLogo from '@/components/suave-logo';

export function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="fixed inset-0 bg-background flex flex-col items-center justify-center z-[100]">
        <div className="w-24 h-24 border-4 border-primary transform rotate-45 flex items-center justify-center mb-6 animate-pulse">
            <div className="transform -rotate-45 text-center">
                <SuaveLogo />
            </div>
        </div>
        <p className="text-lg text-primary">Loading Application...</p>
    </div>
    );
  }

  return user ? <Dashboard /> : <LoginScreen />;
}
