// app/payment/page.tsx (Server Component)
import React, { Suspense } from 'react';
import PaymentClient from '@/components/payment-client';

export default function PaymentPage() {
  return (
    <div>
      <Suspense fallback={<div>Loading checkout details...</div>}>
        <PaymentClient />
      </Suspense>
    </div>
  );
}
