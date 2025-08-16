// app/payment/page.tsx (Server Component)
import React, { Suspense } from 'react';
import PaymentClient from '@/components/payment-client';

export default function PaymentPage() {
  return (
    <div>
      <Suspense
        fallback={
          <div className="flex flex-col w-full h-screen items-center justify-center ">
            <p className="font-bold text-lg">Loading...</p>
          </div>
        }
      >
        <PaymentClient />
      </Suspense>
    </div>
  );
}
