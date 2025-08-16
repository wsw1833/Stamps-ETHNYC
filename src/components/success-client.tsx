'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Home, Download } from 'lucide-react';
import { formatAddress } from '@/lib/utils';
export default function SuccessClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const total = searchParams.get('total') || '36.79';
  const discount = searchParams.get('discount') || '0.00';
  const txHash = searchParams.get('txHash') || '0x123445566778899';
  const currentChain = searchParams.get('chain') || 'FLOW EVM Testnet';
  const storeName = searchParams.get('storeName');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="shadow-xl border-slate-200">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto mb-6">
              <div className="relative">
                <CheckCircle className="h-20 w-20 text-emerald-500 mx-auto" />
                <div className="absolute inset-0 animate-ping">
                  <CheckCircle className="h-20 w-20 text-emerald-400 mx-auto opacity-75" />
                </div>
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-slate-900 mb-2">
              Payment Successful!
            </CardTitle>
            <p className="text-slate-600 text-lg">
              Your order has been confirmed and is being processed.
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Transaction Details */}
            <div className="bg-slate-50 rounded-xl p-6 space-y-4">
              <h3 className="font-semibold text-slate-900 mb-3">
                Transaction Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex justify-between">
                  <span className="text-slate-600">Transaction Hash</span>
                  <span className="font-mono text-sm text-slate-900">
                    {`${formatAddress(txHash)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Date & Time</span>
                  <span className="text-sm text-slate-900">
                    {new Date().toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Payment Method</span>
                  <span className="text-sm text-slate-900">{currentChain}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Status</span>
                  <Badge className="bg-emerald-100 text-emerald-800">
                    Completed
                  </Badge>
                </div>
              </div>

              <Separator className="bg-slate-200" />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-600">Amount Paid</span>
                  <span className="font-bold text-xl text-slate-900">
                    ${total}
                  </span>
                </div>
                {Number.parseFloat(discount) > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Total Savings</span>
                    <span className="font-semibold">${discount}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Order Status */}
            <div className="bg-amber-50 rounded-xl p-6">
              <h3 className="font-semibold text-amber-900 mb-3">
                What&apos;s Next?
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <span className="text-amber-800">
                    Order confirmed and sent to {storeName}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
                  <span className="text-slate-600">
                    Estimated preparation time: 10-20 minutes
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <Button
                onClick={() => router.push('/dashboard')}
                className="flex items-center justify-center gap-2 py-3 bg-slate-800 hover:bg-slate-900"
              >
                <Home className="h-4 w-4" />
                Back to Dashboard
              </Button>
              <Button
                variant="outline"
                onClick={() => window.print()}
                className="flex items-center justify-center gap-2 py-3 bg-transparent border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                <Download className="h-4 w-4" />
                Download Receipt
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
