
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Landmark, User, Lock, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import placeholder from '@/lib/placeholder-images.json';
import type { ImagePlaceholder } from '@/lib/placeholder-images';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const logo = placeholder.placeholderImages.find(p => p.id === 'eurobiz-logo') as ImagePlaceholder | undefined;

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (!auth) {
        throw new Error('Firebase Auth is not initialized');
      }
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Login Successful",
        description: "Welcome back! Redirecting you to the dashboard.",
      });
      router.push('/');
    } catch (error: any) {
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
          setError('Invalid username or password. Please try again.');
      } else {
        setError(error.message);
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4 bg-white font-sans relative overflow-hidden">
        <div className='absolute -bottom-32 -right-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl'></div>
        <div className='absolute -top-32 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl'></div>
      <div className="mx-auto w-[400px] space-y-8 z-10">
        <div className="flex flex-col items-center justify-center text-center">
            <div className="inline-flex items-center justify-center gap-3 mb-4">
                {logo && (
                <Image
                    src={logo.imageUrl}
                    alt="EuroBiz Logo"
                    width="40"
                    height="40"
                    data-ai-hint={logo.imageHint}
                    priority
                />
                )}
                <h1 className="text-3xl font-bold text-[#4A4A4A]">EuroBiz <span className='font-light'>ERP</span></h1>
            </div>
            <p className="text-balance text-gray-500">
              Welcome back! Login to continue.
            </p>
          </div>

        <div className='bg-white/70 backdrop-blur-sm rounded-xl shadow-2xl shadow-primary/10 p-8'>
            <div className="grid gap-6">
                <div className="grid gap-2">
                <Label htmlFor="email">Username</Label>
                <div className='relative'>
                    <User className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400' />
                    <Input
                        id="email"
                        type="email"
                        placeholder="Enter Username"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                        className="pl-10 h-12"
                    />
                </div>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <div className='relative'>
                        <Lock className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400' />
                        <Input 
                            id="password" 
                            type={showPassword ? 'text' : 'password'}
                            required 
                            placeholder='Enter Password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                            className="pl-10 h-12"
                        />
                        <button type='button' onClick={() => setShowPassword(!showPassword)} className='absolute right-3 top-1/2 -translate-y-1/2'>
                            {showPassword ? <EyeOff className='h-5 w-5 text-gray-400' /> : <Eye className='h-5 w-5 text-gray-400' />}
                        </button>
                    </div>
                     <div className="flex items-center justify-end">
                        <Link
                        href="#"
                        className="inline-block text-sm text-primary hover:underline"
                        >
                        Forgot Password?
                        </Link>
                    </div>
                </div>
                {error && (
                    <p className="text-sm text-destructive text-center">{error}</p>
                )}
                <Button type="submit" className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90" onClick={handleLogin} disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Login'}
                </Button>
            </div>
        </div>
        <div className="text-center text-sm text-gray-500">
            Need an account? Please contact the admin.
        </div>
      </div>
       <footer className='absolute bottom-4 w-full text-center text-xs text-gray-400'>
        © 2025 EuroBiz — All Rights Reserved
       </footer>
       <div className='absolute bottom-4 right-4 text-xs text-gray-400'>
        v1.0.0
       </div>
    </div>
  );
}
