'use client';
import { useAuth } from '@/hooks/use-auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

const Header = () => {
  const { user } = useAuth();

  const handleLogout = () => {
    auth.signOut();
  };

  return (
    <header className="col-span-12 row-span-1 bg-card rounded-lg flex items-center justify-between p-4 shadow-lg">
      <h1 className="text-2xl font-bold">Client & Order Management</h1>
      {user && (
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">{user.email}</span>
          <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Log out">
            <LogOut />
          </Button>
        </div>
      )}
    </header>
  );
};

export default Header;
