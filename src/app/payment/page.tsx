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
  X,
} from 'lucide-react';

interface Voucher {
  id: string;
  restaurantName: string;
  discount: string;
  expirationDate: string;
  status: 'active' | 'expired' | 'used';
  ipfsLink: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
}

// Mock vouchers data - MUST match dashboard data exactly with proper discount types
const mockVouchers: Voucher[] = [
  {
    id: '1',
    restaurantName: 'Pizza Palace',
    discount: '20% OFF',
    expirationDate: '2025-12-31',
    status: 'active',
    ipfsLink: 'https://ipfs.io/ipfs/QmExample1',
    description: 'Valid for all menu items',
    discountType: 'percentage',
    discountValue: 20,
  },
  {
    id: '2',
    restaurantName: 'Burger Barn',
    discount: '$5 OFF',
    expirationDate: '2025-12-31',
    status: 'active',
    ipfsLink: 'https://ipfs.io/ipfs/QmExample2',
    description: 'Minimum order $25',
    discountType: 'fixed',
    discountValue: 5,
  },
  {
    id: '3',
    restaurantName: 'Pizza Palace',
    discount: '$10 OFF',
    expirationDate: '2025-12-31',
    status: 'active',
    ipfsLink: 'https://ipfs.io/ipfs/QmExample3',
    description: 'Minimum order $30',
    discountType: 'fixed',
    discountValue: 10,
  },
  {
    id: '6',
    restaurantName: 'Coffee Corner',
    discount: '$3 OFF',
    expirationDate: '2025-12-31',
    status: 'active',
    ipfsLink: 'https://ipfs.io/ipfs/QmExample6',
    description: 'Valid for beverages only',
    discountType: 'fixed',
    discountValue: 3,
  },
  {
    id: '11',
    restaurantName: 'Pizza Palace',
    discount: '15% OFF',
    expirationDate: '2025-12-31',
    status: 'active',
    ipfsLink: 'https://ipfs.io/ipfs/QmExample11',
    description: 'Valid for pizzas only',
    discountType: 'percentage',
    discountValue: 15,
  },
  {
    id: '12',
    restaurantName: 'Pizza Palace',
    discount: '$7 OFF',
    expirationDate: '2025-12-31',
    status: 'active',
    ipfsLink: 'https://ipfs.io/ipfs/QmExample12',
    description: 'Weekend special',
    discountType: 'fixed',
    discountValue: 7,
  },
  {
    id: '8',
    restaurantName: 'Burger Barn',
    discount: '$8 OFF',
    expirationDate: '2025-12-31',
    status: 'active',
    ipfsLink: 'https://ipfs.io/ipfs/QmExample8',
    description: 'Black Friday deal',
    discountType: 'fixed',
    discountValue: 8,
  },
];

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedPayment, setSelectedPayment] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [appliedVouchers, setAppliedVouchers] = useState<Voucher[]>([]);

  const restaurant = searchParams.get('restaurant') || 'Pizza Palace';
  const preSelectedVoucherId = searchParams.get('voucher');

  // Filter vouchers for this restaurant that are active and not expired
  const availableVouchers = mockVouchers.filter((voucher) => {
    // Create date objects for comparison
    const expirationDate = new Date(voucher.expirationDate);
    const currentDate = new Date();

    // Set time to start of day for fair comparison
    expirationDate.setHours(23, 59, 59, 999);
    currentDate.setHours(0, 0, 0, 0);

    const isNotExpired = expirationDate >= currentDate;
    const isForThisRestaurant =
      voucher.restaurantName.toLowerCase().trim() ===
      restaurant.toLowerCase().trim();
    const isActive = voucher.status === 'active';
    const isNotAlreadyApplied = !appliedVouchers.find(
      (av) => av.id === voucher.id
    );

    return (
      isNotExpired && isForThisRestaurant && isActive && isNotAlreadyApplied
    );
  });

  // Apply pre-selected voucher on load
  useEffect(() => {
    if (preSelectedVoucherId) {
      const preSelectedVoucher = mockVouchers.find(
        (v) => v.id === preSelectedVoucherId
      );
      if (
        preSelectedVoucher &&
        preSelectedVoucher.restaurantName.toLowerCase().trim() ===
          restaurant.toLowerCase().trim()
      ) {
        setAppliedVouchers([preSelectedVoucher]);
      }
    }
  }, [preSelectedVoucherId, restaurant]);

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
  const totalDiscount = appliedVouchers.reduce((total, voucher) => {
    if (voucher.discountType === 'percentage') {
      return total + subtotal * (voucher.discountValue / 100);
    } else {
      return total + voucher.discountValue;
    }
  }, 0);

  const finalTotal = Math.max(0, subtotal + tax + deliveryFee - totalDiscount);

  const handleApplyVoucher = (voucher: Voucher) => {
    setAppliedVouchers([...appliedVouchers, voucher]);
    setShowVoucherModal(false);
  };

  const handleRemoveVoucher = (voucherId: string) => {
    setAppliedVouchers(appliedVouchers.filter((v) => v.id !== voucherId));
  };

  const handlePayment = () => {
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      router.push(
        `/success?total=${finalTotal.toFixed(
          2
        )}&discount=${totalDiscount.toFixed(2)}`
      );
    }, 3000);
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
      <div className="bg-slate-900 shadow-lg border-b border-slate-800">
        <div className="px-4 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="text-slate-300 hover:text-slate-100 hover:bg-slate-800"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl lg:text-2xl font-bold text-slate-100">
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
                    Restaurant
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-lg text-slate-900">
                        {restaurant}
                      </p>
                      <p className="text-sm text-slate-600">
                        {availableVouchers.length > 0
                          ? `${availableVouchers.length} voucher${
                              availableVouchers.length !== 1 ? 's' : ''
                            } available from your active vouchers`
                          : 'No vouchers available for this restaurant'}
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
                      Your Active Vouchers ({appliedVouchers.length} applied)
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {appliedVouchers.length === 0 ? (
                    <div className="text-center py-2">
                      {availableVouchers.length > 0 ? (
                        <>
                          <p className="text-slate-600 mb-6">
                            No vouchers applied
                          </p>
                          <Button
                            variant="outline"
                            onClick={() => setShowVoucherModal(true)}
                            className="flex items-center gap-2 mx-auto border-slate-300 text-slate-700 hover:bg-slate-50"
                          >
                            <Ticket className="h-4 w-4" />
                            Apply Your {restaurant} Vouchers (
                            {availableVouchers.length} available)
                          </Button>
                        </>
                      ) : (
                        <div className="text-center">
                          <Ticket className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                          <p className="text-slate-600 text-lg mb-2">
                            No vouchers available
                          </p>
                          <p className="text-sm text-slate-500 mb-4">
                            You don't have any active vouchers for {restaurant}
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
                      {appliedVouchers.map((voucher, index) => (
                        <div
                          key={voucher.id}
                          className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-lg"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge className="bg-emerald-600 text-white text-xs">
                                {voucher.discount}
                              </Badge>
                              <span className="font-medium text-emerald-900">
                                {voucher.restaurantName}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                From Active List
                              </Badge>
                            </div>
                            <p className="text-sm text-emerald-700">
                              {voucher.description}
                            </p>
                            <p className="text-xs text-emerald-600 mt-1">
                              Saves: $
                              {voucher.discountType === 'percentage'
                                ? (
                                    subtotal *
                                    (voucher.discountValue / 100)
                                  ).toFixed(2)
                                : voucher.discountValue.toFixed(2)}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveVoucher(voucher.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      {availableVouchers.length > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowVoucherModal(true)}
                          className="w-full flex items-center gap-2 border-slate-300 text-slate-700 hover:bg-slate-50"
                        >
                          <Plus className="h-4 w-4" />
                          Apply Another Voucher ({availableVouchers.length}{' '}
                          remaining)
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
                        {appliedVouchers.map((voucher, index) => {
                          const voucherDiscount =
                            voucher.discountType === 'percentage'
                              ? subtotal * (voucher.discountValue / 100)
                              : voucher.discountValue;
                          return (
                            <div
                              key={voucher.id}
                              className="flex justify-between text-emerald-600 text-sm"
                            >
                              <span>{voucher.discount} Discount</span>
                              <span>-${voucherDiscount.toFixed(2)}</span>
                            </div>
                          );
                        })}
                        <div className="flex justify-between text-emerald-600 font-medium border-t border-emerald-200 pt-2">
                          <span>Total Voucher Savings</span>
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
            <DialogTitle className="flex items-center gap-2 text-slate-900">
              <Ticket className="h-5 w-5" />
              Your Active {restaurant} Vouchers ({availableVouchers.length})
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {availableVouchers.length === 0 ? (
              <div className="text-center py-8">
                <Ticket className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 text-lg mb-4">
                  No {restaurant} vouchers available
                </p>
                <p className="text-slate-500 text-sm mb-4">
                  You don't have any active vouchers for this restaurant
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
              availableVouchers.map((voucher) => {
                const potentialSavings =
                  voucher.discountType === 'percentage'
                    ? subtotal * (voucher.discountValue / 100)
                    : voucher.discountValue;

                return (
                  <Card
                    key={voucher.id}
                    className="cursor-pointer hover:shadow-md transition-shadow border-slate-200"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-slate-800 text-white">
                              {voucher.discount}
                            </Badge>
                            <span className="font-semibold text-slate-900">
                              {voucher.restaurantName}
                            </span>
                            <Badge
                              variant="outline"
                              className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200"
                            >
                              Active
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-600 mb-2">
                            {voucher.description}
                          </p>
                          <div className="flex items-center justify-between text-xs text-slate-500">
                            <span>
                              Expires:{' '}
                              {new Date(
                                voucher.expirationDate
                              ).toLocaleDateString()}
                            </span>
                            <span className="font-semibold text-emerald-600">
                              Will save: ${potentialSavings.toFixed(2)}
                            </span>
                          </div>
                        </div>
                        <Button
                          onClick={() => handleApplyVoucher(voucher)}
                          size="sm"
                          className="ml-4 bg-slate-800 hover:bg-slate-900"
                        >
                          Apply
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
