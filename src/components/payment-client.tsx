'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  ArrowLeft,
  CreditCard,
  Wallet,
  Smartphone,
  Store,
  Ticket,
  Calculator,
  Plus,
} from 'lucide-react';
import { changeStampStatus, StampData } from '@/app/actions/stampActions';
import PaymentStamp from './paymentStamp';
import { useStoreStamps } from '@/hooks/useStoreStamps';
import { contractAddress } from '@/lib/constant';
import { useStampNFT } from '@/hooks/useStampNFT';

export default function PaymentClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedPayment, setSelectedPayment] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [appliedStamps, setAppliedStamps] = useState<StampData[]>([]);
  const [isAutoApplyComplete, setIsAutoApplyComplete] = useState(false);
  const storeName = searchParams.get('storeName') || 'ETHGlobal';
  const { stamps } = useStoreStamps(storeName);
  const { sponsoredBurn, isLoading: NFTMintLoading } = useStampNFT({
    contractAddress,
  });

  // Filter vouchers for this restaurant that are active and not expired
  const getFilteredStamps = () => {
    return stamps.filter((stamp) => {
      const expirationDate = new Date(stamp.validUntil);
      const currentDate = new Date();

      expirationDate.setHours(23, 59, 59, 999);
      currentDate.setHours(0, 0, 0, 0);

      const isNotExpired = expirationDate >= currentDate;
      const isForThisRestaurant =
        stamp.storeName.toLowerCase().trim() === storeName.toLowerCase().trim();
      const isActive = stamp.status === 'active';

      return isNotExpired && isForThisRestaurant && isActive;
    });
  };

  const filteredStamps = getFilteredStamps();

  // Get available stamps (filtered stamps that are not currently applied)
  const availableStamps = filteredStamps.filter(
    (stamp) => !appliedStamps.find((as) => as.stampId === stamp.stampId)
  );

  // Auto-apply all filtered stamps when component loads
  useEffect(() => {
    if (filteredStamps.length > 0 && !isAutoApplyComplete) {
      setAppliedStamps(filteredStamps);
      setIsAutoApplyComplete(true);
    }
  }, [filteredStamps, isAutoApplyComplete]);

  // Mock order details
  const orderItems = [
    { name: 'Margherita Pizza', price: 18.99, quantity: 1 },
    { name: 'Caesar Salad', price: 12.99, quantity: 1 },
    { name: 'Garlic Bread', price: 6.99, quantity: 2 },
    { name: 'Soft Drink', price: 3.99, quantity: 2 },
  ];

  const subtotal = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.08; // 8% tax
  const deliveryFee = 3.99;

  // Calculate total discount from all applied vouchers
  const totalDiscount = appliedStamps.reduce((total, stamp) => {
    if (stamp.discountType === 'percentage') {
      return total + subtotal * (stamp.discountAmount / 100);
    } else {
      return total + stamp.discountAmount;
    }
  }, 0);

  const finalTotal = Math.max(0, subtotal + tax + deliveryFee - totalDiscount);

  const handleApplyVoucher = (stamp: StampData) => {
    setAppliedStamps([...appliedStamps, stamp]);
    setShowVoucherModal(false);
  };

  const handleRemoveVoucher = (stampId: string) => {
    setAppliedStamps(appliedStamps.filter((v) => v.stampId !== stampId));
  };

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      // Simulate payment processing, if success then burn token.
      // Extract all stamp IDs from applied stamps
      const appliedStampIds = appliedStamps.map((stamp) =>
        BigInt(stamp.stampId)
      );

      if (appliedStampIds.length > 0) {
        const txResult = await sponsoredBurn(appliedStampIds);
        console.log('Burn transaction result:', txResult);
      }

      // change status of the stamps if token burn success and redirect to success page.
      const response = await changeStampStatus(
        appliedStampIds.toString(),
        'used'
      );

      if (response.success) {
        setTimeout(() => {
          setIsProcessing(false);
          router.push(
            `/success?total=${finalTotal.toFixed(
              2
            )}&discount=${totalDiscount.toFixed(2)}`
          );
        }, 3000);
      }
    } catch (error) {
      console.error('Payment or burn failed:', error);
      setIsProcessing(false);
    }
  };

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: CreditCard,
      description: 'Visa, Mastercard, Amex',
    },
    {
      id: 'wallet',
      name: 'Digital Wallet',
      icon: Wallet,
      description: 'Apple Pay, Google Pay',
    },
    {
      id: 'mobile',
      name: 'Mobile Payment',
      icon: Smartphone,
      description: 'PayPal, Venmo',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="top-0 sticky z-50 bg-[#FFFFFFB5] shadow-md border-b border-slate-200 backdrop-blur-sm">
        <div className="px-4 lg:px-8 py-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={() => router.push('./dashboard')}
              className="text-black hover:text-slate-100 hover:bg-slate-800"
            >
              <ArrowLeft className="h-20 w-20" />
            </Button>
            <h1 className="text-xl lg:text-[22px] font-bold text-black">
              Checkout
            </h1>
          </div>
        </div>
      </div>

      <div className="px-4 lg:px-8 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Order Details */}
            <div className="space-y-6">
              {/* Restaurant Info */}
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-900">
                    <Store className="h-5 w-5" />
                    Store Name
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-lg text-slate-900">
                        {storeName}
                      </p>
                      <p className="text-sm text-slate-600">
                        {availableStamps.length > 0
                          ? `${availableStamps.length} stamps${
                              availableStamps.length !== 1 ? 's' : ''
                            } available from your active stamps`
                          : 'No stamps available for this restaurant'}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-emerald-50 text-emerald-700 border-emerald-200"
                    >
                      Verified
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Voucher Section */}
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-slate-900">
                    <div className="flex items-center gap-2">
                      <Ticket className="h-5 w-5" />
                      Your Active stamps ({appliedStamps.length} applied)
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {stamps.length === 0 ? (
                    <div className="text-center py-2">
                      {appliedStamps.length > 0 ? (
                        <>
                          <p className="text-slate-600 mb-6">
                            No stamps applied
                          </p>
                          <Button
                            variant="outline"
                            onClick={() => setShowVoucherModal(true)}
                            className="flex items-center gap-2 h-auto mx-auto text-white bg-slate-800 hover:bg-slate-900 hover:text-white md:text-md text-xs"
                          >
                            <Ticket className="h-4 w-4 md:block hidden" />

                            <span className="hidden sm:inline">
                              Apply Your {storeName} stamps (
                              {appliedStamps.length} available)
                            </span>

                            {/* Short Text on Small Screens */}
                            <span className="inline sm:hidden">
                              {appliedStamps.length} stamps
                            </span>
                          </Button>
                        </>
                      ) : (
                        <div className="text-center">
                          <Ticket className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                          <p className="text-slate-600 text-lg mb-2">
                            No stamps available
                          </p>
                          <p className="text-sm text-slate-500 mb-4">
                            You don&apos;t have any active stamps for{' '}
                            {storeName}
                          </p>
                          <Button
                            variant="outline"
                            onClick={() => router.push('/dashboard')}
                            className="text-sm border-slate-300 text-slate-600 hover:bg-slate-50"
                          >
                            Go to Dashboard
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {appliedStamps.map((stamp, index) => (
                        <PaymentStamp
                          key={stamp.stampId}
                          stampType={stamp.storeName}
                          priceOffer={stamp.discount}
                          validUntil={stamp.validUntil}
                          ipfs={stamp.ipfs}
                          variant={stamp.variant}
                          applyStamp={() => handleRemoveVoucher(stamp.stampId)}
                        />
                      ))}
                      {availableStamps.length > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowVoucherModal(true)}
                          className="w-full flex items-center gap-2 border-slate-300 text-white bg-slate-800 hover:bg-slate-900 hover:text-white "
                        >
                          <Plus className="h-4 w-4 md:block hidden" />
                          <span className="hidden sm:inline">
                            Apply Another Stamp ({availableStamps.length}{' '}
                            remaining)
                          </span>
                          {/* Short Text on Small Screens */}
                          <span className="inline sm:hidden">
                            {availableStamps.length} Stamps
                          </span>
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-900">
                    <Calculator className="h-5 w-5" />
                    Order Items
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {orderItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-2"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">
                          {item.name}
                        </p>
                        <p className="text-sm text-slate-600">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold text-slate-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Payment */}
            <div className="space-y-6">
              {/* Order Summary */}
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle className="text-lg text-slate-900">
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-slate-900">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-900">
                    <span>Delivery Fee</span>
                    <span>${deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-900">
                    <span>Tax (8%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  {totalDiscount > 0 && (
                    <>
                      <Separator className="bg-slate-200" />
                      <div className="space-y-2">
                        {appliedStamps.map((stamp, index) => {
                          const voucherDiscount =
                            stamp.discountType === 'percentage'
                              ? subtotal * (stamp.discountAmount / 100)
                              : stamp.discountAmount;
                          return (
                            <div
                              key={stamp.stampId}
                              className="flex justify-between text-emerald-600 text-sm"
                            >
                              <span>{stamp.discountType} Discount</span>
                              <span>-${voucherDiscount.toFixed(2)}</span>
                            </div>
                          );
                        })}
                        <div className="flex justify-between text-emerald-600 font-medium border-t border-emerald-200 pt-2">
                          <span>Total Stamps Savings</span>
                          <span>-${totalDiscount.toFixed(2)}</span>
                        </div>
                      </div>
                    </>
                  )}
                  <Separator className="bg-slate-200" />
                  <div className="flex justify-between font-bold text-lg text-slate-900">
                    <span>Total</span>
                    <span>${finalTotal.toFixed(2)}</span>
                  </div>
                  {totalDiscount > 0 && (
                    <div className="text-center">
                      <Badge className="bg-emerald-100 text-emerald-800">
                        You saved ${totalDiscount.toFixed(2)}! (
                        {(
                          (totalDiscount / (subtotal + tax + deliveryFee)) *
                          100
                        ).toFixed(1)}
                        % off)
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Payment Methods */}
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle className="text-lg text-slate-900">
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {paymentMethods.map((method) => {
                    const Icon = method.icon;
                    return (
                      <div
                        key={method.id}
                        className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                          selectedPayment === method.id
                            ? 'border-slate-500 bg-slate-50 shadow-sm'
                            : 'border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                        }`}
                        onClick={() => setSelectedPayment(method.id)}
                      >
                        <Icon className="h-6 w-6 text-slate-600" />
                        <div className="flex-1">
                          <p className="font-medium text-slate-900">
                            {method.name}
                          </p>
                          <p className="text-sm text-slate-600">
                            {method.description}
                          </p>
                        </div>
                        {selectedPayment === method.id && (
                          <div className="w-5 h-5 bg-slate-800 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Pay Button */}
              <Button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black transition-all duration-200"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing Payment...
                  </div>
                ) : (
                  `Pay $${finalTotal.toFixed(2)}`
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Voucher Selection Modal */}
      <Dialog open={showVoucherModal} onOpenChange={setShowVoucherModal}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto border-slate-300">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-slate-900 sm:text-lg text-base">
              <Ticket className="h-5 w-5" />
              Your Active {storeName} Stamps ({availableStamps.length})
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {availableStamps.length === 0 ? (
              <div className="text-center py-8">
                <Ticket className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 text-lg mb-4">
                  No {storeName} stamps available
                </p>
                <p className="text-slate-500 text-sm mb-4">
                  You don&apos;t have any active stamps for this store.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowVoucherModal(false);
                    router.push('/dashboard');
                  }}
                  className="border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  Go to Dashboard
                </Button>
              </div>
            ) : (
              availableStamps.map((stamp) => {
                const potentialSavings =
                  stamp.discountType === 'percentage'
                    ? subtotal * (stamp.discountAmount / 100)
                    : stamp.discountAmount;

                return (
                  <PaymentStamp
                    key={stamp.stampId}
                    stampType={stamp.storeName}
                    priceOffer={stamp.discount}
                    validUntil={stamp.validUntil}
                    ipfs={stamp.ipfs}
                    variant={stamp.variant}
                    applyStamp={() => handleApplyVoucher(stamp)}
                  />
                );
              })
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
