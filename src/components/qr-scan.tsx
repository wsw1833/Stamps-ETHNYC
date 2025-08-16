'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Zap, Target } from 'lucide-react';

interface QRScannerProps {
  onResult: (result: string) => void;
  onClose: () => void;
  scanType: 'voucher' | 'payment';
}

export function QRScan({ onResult, onClose, scanType }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(true);
  const [scanProgress, setScanProgress] = useState(0);

  useEffect(() => {
    // Start scanning immediately
    const progressInterval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          // Simulate successful scan
          setTimeout(() => {
            const mockResults =
              scanType === 'payment'
                ? [
                    'Pizza Palace',
                    'Burger Barn',
                    'Sushi Spot',
                    'Taco Town',
                    'Coffee Corner',
                  ]
                : [
                    'VOUCHER20',
                    'SAVE15',
                    'WELCOME10',
                    'NEWUSER25',
                    'SPECIAL30',
                  ];
            const randomResult =
              mockResults[Math.floor(Math.random() * mockResults.length)];
            console.log('QR Scanner result:', randomResult);
            setIsScanning(false);
            onResult(randomResult);
          }, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(progressInterval);
  }, [onResult, scanType]);

  return (
    <div className="flex flex-col items-center space-y-6 p-6">
      {/* Scanner Frame */}
      <div className="relative w-80 h-80 bg-black rounded-2xl overflow-hidden">
        {/* Animated scanning overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/20 to-transparent">
          <div
            className="absolute w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-pulse"
            style={{
              top: `${scanProgress}%`,
              transition: 'top 0.1s ease-out',
            }}
          />
        </div>

        {/* Corner brackets */}
        <div className="absolute top-4 left-4 w-8 h-8 border-l-4 border-t-4 border-white rounded-tl-lg" />
        <div className="absolute top-4 right-4 w-8 h-8 border-r-4 border-t-4 border-white rounded-tr-lg" />
        <div className="absolute bottom-4 left-4 w-8 h-8 border-l-4 border-b-4 border-white rounded-bl-lg" />
        <div className="absolute bottom-4 right-4 w-8 h-8 border-r-4 border-b-4 border-white rounded-br-lg" />

        {/* Center target */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 border-2 border-white rounded-lg flex items-center justify-center">
            <Target className="h-8 w-8 text-white animate-pulse" />
          </div>
        </div>

        {/* Scanning effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/50" />
      </div>

      {/* Progress and Status */}
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-2">
          <Zap className="h-5 w-5 text-blue-500 animate-pulse" />
          <span className="text-lg font-semibold text-gray-900">
            {isScanning ? 'Scanning...' : 'Scan Complete!'}
          </span>
        </div>

        <div className="w-64 bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-100 ease-out"
            style={{ width: `${scanProgress}%` }}
          />
        </div>

        <p className="text-sm text-gray-600">
          {scanType === 'payment'
            ? 'Point camera at restaurant QR code'
            : 'Point camera at voucher QR code'}
        </p>
      </div>

      {/* Cancel Button */}
      <Button
        variant="outline"
        onClick={onClose}
        className="flex items-center gap-2 bg-transparent"
      >
        <X className="h-4 w-4" />
        Cancel Scan
      </Button>
    </div>
  );
}
