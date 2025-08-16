'use client';

import type React from 'react';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
      router.push('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 space-y-20">
      <h1 className="text-3xl font-bold">Stamps</h1>
      <span className="text-2xl font-semibold">
        Project Build for ETHGlobal New York 2025
      </span>
      <Card className="w-full max-w-md">
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Connecting Wallet...' : 'Connect Wallet'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
