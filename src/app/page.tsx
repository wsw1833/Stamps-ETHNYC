'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import zircuit from '@/images/zircuit.svg';
import dynamicLogo from '@/images/dynamic-primary.svg';
import globe from '@/images/globe.svg';
import flow from '@/images/flow.svg';
import Image from 'next/image';
import dynamic from '@/images/dynamic.svg';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { useAccount } from 'wagmi';
import { TypewriterEffectSmooth } from '@/components/ui/typewriter-effect';
import { heroWords } from '@/lib/constant';
import logo from '@/images/stamp-logo.svg';
import stamps from '@/images/stamps.png';

export default function LoginPage() {
  const router = useRouter();
  const { isConnected, isConnecting } = useAccount();
  const { setShowAuthFlow, showAuthFlow } = useDynamicContext();

  useEffect(() => {
    if (isConnected) {
      router.push('/dashboard');
    }
  }, [isConnected, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 space-y-8">
      <div className="flex flex-col gap-1 items-center justify-center">
        <Image src={logo} alt="sponsors" className="w-20 h-20" />
        <Image src={stamps} alt="stamps" className="w-44" />
      </div>
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
