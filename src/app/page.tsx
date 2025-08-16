'use client';

import type React from 'react';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import globe from '@/images/globe.svg';
import Image from 'next/image';

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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 space-y-10">
      <h1 className="font-inter md:text-4xl text-3xl font-bold">Stamps</h1>
      <span className="md:text-3xl text-2xl font-semibold line-clamp-2 text-center">
        Smart Loyalty Vouchers — Instant, Secure, On-Chain
      </span>
      <div className="md:text-2xl text-xl font-medium line-clamp-2 text-center flex flex-row gap-3">
        Power By
        <Image src={globe} alt="sponsors" className="md:w-8 md:h-8 w-7 h-7" />
        <Image src={globe} alt="sponsors" className="md:w-8 md:h-8 w-7 h-7" />
        <Image src={globe} alt="sponsors" className="md:w-8 md:h-8 w-7 h-7" />
      </div>
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
