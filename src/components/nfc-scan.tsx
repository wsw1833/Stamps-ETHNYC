'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import nfcScanAnimation from '@/images/mobileNfc.json';
import Lottie from 'lottie-react';

interface NFCScannerProps {
  onResult: (result: string) => void;
  onClose: () => void;
}

export function NFCScan({ onResult, onClose }: NFCScannerProps) {
  return (
    <div className="h-max gap-3 w-full flex flex-col items-center justify-center p-6">
      <div className="text-center mb-4">
        <h2 className="md:text-3xl text-xl font-semibold mb-2">
          Ready to Scan
        </h2>
      </div>

      <div className="w-full flex flex-col items-center justify-center mb-6">
        <div className="mb-4">
          <Lottie
            animationData={nfcScanAnimation}
            loop={true}
            autoplay={true}
            style={{ width: 300, height: 300 }}
          />
        </div>

        <span className="text-center md:text-base text-sm text-gray-600">
          Please place the NFC near to the device.
        </span>
      </div>

      <div className="flex justify-center">
        <Button
          variant="outline"
          onClick={onClose}
          className="w-[10rem] md:text-base"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
