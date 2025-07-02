'use client';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

const Header = () => {
  const { user, userRole } = useAuth();

  return (
    <header className="col-span-12 row-span-1 bg-card rounded-lg flex items-center justify-between p-4 shadow-lg">
      <h1 className="text-2xl font-bold">Client & Order Management</h1>
      <div className="flex items-center space-x-4">
        <div className="text-right">
          <p className="font-semibold text-white">{user?.email || 'Anonymous'}</p>
          <p className="text-xs text-primary uppercase">{userRole}</p>
        </div>
        <Button variant="destructive" onClick={() => { /* Logout is disabled while auth is bypassed */ }}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </header>
  );
};

export default Header;
