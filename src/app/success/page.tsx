// app/payment/page.tsx (Server Component)
import React, { Suspense } from 'react';
import SuccessClient from '@/components/success-client';
export default function PaymentPage() {
  return (
    <div>
      <Suspense fallback={<div>Loading success payment details...</div>}>
        <SuccessClient />
      </Suspense>
    </div>
  );
}
