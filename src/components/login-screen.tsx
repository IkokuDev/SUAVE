'use client';
import { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import SuaveLogo from './suave-logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { createUserDocument } from '@/app/actions';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    if (password.length < 6) {
      setError("Password should be at least 6 characters.");
      setLoading(false);
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const result = await createUserDocument(userCredential.user.uid);

      if (result.success) {
        toast({
          title: 'Account Created!',
          description: `You have been registered as a ${result.role}.`,
        });
      } else {
        setError(result.error || 'Failed to set up your account details.');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md bg-card shadow-2xl shadow-black/30">
        <CardHeader className="text-center">
            <div className="w-24 h-24 border-2 border-primary transform rotate-45 flex items-center justify-center mx-auto mb-6">
                <div className="transform -rotate-45 text-center">
                    <SuaveLogo />
                </div>
            </div>
          <CardTitle className="text-3xl font-bold">{isSigningUp ? 'Create an Account' : 'Welcome Back'}</CardTitle>
          <CardDescription className="italic">"Confidence comes with pedigree"</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={isSigningUp ? handleSignUp : handleLogin}>
            <div className="mb-4">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                autoComplete="email"
              />
            </div>
            <div className="mb-6">
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                autoComplete={isSigningUp ? 'new-password' : 'current-password'}
              />
            </div>
            <Button type="submit" className="w-full font-semibold transition hover:-translate-y-0.5" disabled={loading}>
              {loading ? 'Processing...' : (isSigningUp ? 'Sign Up' : 'Login')}
            </Button>
            {error && <p className="text-red-400 text-sm mt-4 text-center">{error}</p>}
          </form>
           <div className="mt-4 text-center">
            <Button variant="link" onClick={() => { setIsSigningUp(!isSigningUp); setError(''); }}>
              {isSigningUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginScreen;
