'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import zircuit from '@/images/zircuit.svg';
import dynamicLogo from '@/images/dynamic-primary.svg';
import flow from '@/images/flow.svg';
import Image from 'next/image';
import dynamic from '@/images/dynamic.svg';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { useAccount } from 'wagmi';
import { TypewriterEffectSmooth } from '@/components/ui/typewriter-effect';
import { heroWords } from '@/lib/constant';

export default function LoginPage() {
  const router = useRouter();
  const { isConnected, isConnecting } = useAccount();
  const { setShowAuthFlow, showAuthFlow } = useDynamicContext();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isConnected) {
      router.push('/dashboard');
    }
  }, [isConnected, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 space-y-8">
      <h1 className="font-inter md:text-5xl text-4xl font-bold">Stamps</h1>
      <div>
        <TypewriterEffectSmooth
          words={heroWords}
          className="mb-4 md:text-4xl text-2xl"
        />
      </div>
      <div className="md:text-2xl text-xl font-medium line-clamp-2 text-center flex flex-row gap-3">
        Power By
        <Image src={flow} alt="sponsors" className="md:w-8 md:h-8 w-7 h-7" />
        <Image
          src={dynamicLogo}
          alt="sponsors"
          className="md:w-8 md:h-8 w-7 h-7"
        />
        <Image src={zircuit} alt="sponsors" className="md:w-8 md:h-8 w-7 h-7" />
      </div>
      <Button
        type="submit"
        className="w-fit p-4"
        disabled={showAuthFlow}
        onClick={() => setShowAuthFlow(true)}
      >
        {showAuthFlow && isConnecting
          ? 'Connecting Wallet...'
          : 'Connect with Dynamic'}
        <Image
          src={dynamic}
          alt="dynamic wallet"
          className="md:w-5 md:h-5 w-4 h-4"
        />
      </Button>
    </div>
  );
}
