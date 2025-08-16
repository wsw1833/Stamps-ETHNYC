'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Search,
  QrCode,
  Gift,
  Camera,
  LogOut,
  History,
  Ticket,
} from 'lucide-react';
import { VoucherCard } from '@/components/voucher-card';
import { QRScan } from '@/components/qr-scan';

interface Voucher {
  id: string;
  restaurantName: string;
  discount: string;
  expirationDate: string;
  status: 'active' | 'expired' | 'used';
  ipfsLink: string;
  description: string;
  originalPrice?: number;
  discountAmount?: number;
}

const mockVouchers: Voucher[] = [
  {
    id: '1',
    restaurantName: 'Pizza Palace',
    discount: '20% OFF',
    expirationDate: '2024-12-31',
    status: 'active',
    ipfsLink: 'https://ipfs.io/ipfs/QmExample1',
    description: 'Valid for all menu items',
    originalPrice: 25.99,
    discountAmount: 5.2,
  },
  {
    id: '2',
    restaurantName: 'Burger Barn',
    discount: '$5 OFF',
    expirationDate: '2024-11-15',
    status: 'active',
    ipfsLink: 'https://ipfs.io/ipfs/QmExample2',
    description: 'Minimum order $25',
    originalPrice: 30.0,
    discountAmount: 5.0,
  },
  {
    id: '3',
    restaurantName: 'Pizza Palace',
    discount: '$10 OFF',
    expirationDate: '2024-12-20',
    status: 'active',
    ipfsLink: 'https://ipfs.io/ipfs/QmExample3',
    description: 'Minimum order $30',
    originalPrice: 30.0,
    discountAmount: 10.0,
  },
  {
    id: '4',
    restaurantName: 'Sushi Spot',
    discount: 'Buy 1 Get 1',
    expirationDate: '2024-10-30',
    status: 'expired',
    ipfsLink: 'https://ipfs.io/ipfs/QmExample4',
    description: 'Valid for sushi rolls only',
    originalPrice: 18.99,
    discountAmount: 18.99,
  },
  {
    id: '5',
    restaurantName: 'Taco Town',
    discount: '15% OFF',
    expirationDate: '2024-12-25',
    status: 'used',
    ipfsLink: 'https://ipfs.io/ipfs/QmExample5',
    description: 'Valid Tuesday-Thursday',
    originalPrice: 22.5,
    discountAmount: 3.38,
  },
  {
    id: '6',
    restaurantName: 'Coffee Corner',
    discount: '$3 OFF',
    expirationDate: '2024-12-20',
    status: 'active',
    ipfsLink: 'https://ipfs.io/ipfs/QmExample6',
    description: 'Valid for beverages only',
    originalPrice: 12.99,
    discountAmount: 3.0,
  },
  {
    id: '7',
    restaurantName: 'Pizza Palace',
    discount: '25% OFF',
    expirationDate: '2024-10-15',
    status: 'expired',
    ipfsLink: 'https://ipfs.io/ipfs/QmExample7',
    description: 'Halloween special - expired',
    originalPrice: 40.0,
    discountAmount: 10.0,
  },
  {
    id: '8',
    restaurantName: 'Burger Barn',
    discount: '$8 OFF',
    expirationDate: '2024-11-30',
    status: 'used',
    ipfsLink: 'https://ipfs.io/ipfs/QmExample8',
    description: 'Black Friday deal - already used',
    originalPrice: 35.0,
    discountAmount: 8.0,
  },
  {
    id: '9',
    restaurantName: 'Steakhouse NYC',
    discount: '30% OFF',
    expirationDate: '2024-09-15',
    status: 'expired',
    ipfsLink: 'https://ipfs.io/ipfs/QmExample9',
    description: 'Summer special - expired',
    originalPrice: 60.0,
    discountAmount: 18.0,
  },
  {
    id: '10',
    restaurantName: 'Brooklyn Deli',
    discount: '$12 OFF',
    expirationDate: '2024-11-20',
    status: 'used',
    ipfsLink: 'https://ipfs.io/ipfs/QmExample10',
    description: 'Thanksgiving special - used',
    originalPrice: 45.0,
    discountAmount: 12.0,
  },
  {
    id: '11',
    restaurantName: 'Pizza Palace',
    discount: '15% OFF',
    expirationDate: '2024-12-25',
    status: 'active',
    ipfsLink: 'https://ipfs.io/ipfs/QmExample11',
    description: 'Valid for pizzas only',
    originalPrice: 22.0,
    discountAmount: 3.3,
  },
  {
    id: '12',
    restaurantName: 'Pizza Palace',
    discount: '$7 OFF',
    expirationDate: '2024-12-18',
    status: 'active',
    ipfsLink: 'https://ipfs.io/ipfs/QmExample12',
    description: 'Weekend special',
    originalPrice: 25.0,
    discountAmount: 7.0,
  },
];

export default function DashboardPage() {
  const [vouchers, setVouchers] = useState<Voucher[]>(mockVouchers);
  const [searchQuery, setSearchQuery] = useState('');
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [scanType, setScanType] = useState<'voucher' | 'payment'>('voucher');
  const [activeTab, setActiveTab] = useState('active');
  const router = useRouter();

  // Active tab: Only vouchers with status "active"
  const activeVouchers = vouchers.filter((v) => v.status === 'active');

  // History tab: All vouchers with status "expired" or "used"
  const historyVouchers = vouchers.filter(
    (v) => v.status === 'expired' || v.status === 'used'
  );

  const getFilteredVouchers = (voucherList: Voucher[]) => {
    return voucherList.filter(
      (voucher) =>
        voucher.restaurantName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        voucher.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const handleQRScan = (type: 'voucher' | 'payment') => {
    setScanType(type);
    setShowQRScanner(true);
  };

  const handleQRResult = (result: string) => {
    setShowQRScanner(false);
    if (scanType === 'payment') {
      router.push(`/payment?restaurant=${encodeURIComponent(result)}`);
    } else {
      console.log('Voucher QR scanned:', result);
    }
  };

  const handleLogout = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-slate-900 shadow-lg border-b border-slate-800">
        <div className="px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl lg:text-2xl font-bold text-slate-100">
              My Vouchers
            </h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-slate-300 hover:text-slate-100 hover:bg-slate-800"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="px-4 lg:px-8 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search restaurants or vouchers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 border-slate-300 focus:border-slate-500 focus:ring-slate-500"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mb-8">
            <div className="grid grid-cols-2 lg:grid-cols-2 gap-4 max-w-lg mx-auto">
              <Button
                variant="outline"
                className="flex flex-col items-center py-6 h-auto bg-gradient-to-br from-slate-50 to-slate-100 border-slate-300 hover:from-slate-100 hover:to-slate-200 transition-all duration-200"
                onClick={() => handleQRScan('voucher')}
              >
                <QrCode className="h-6 w-6 mb-2 text-slate-700" />
                <span className="text-sm font-medium text-slate-800">
                  Scan Voucher
                </span>
              </Button>

              <Button
                variant="outline"
                className="flex flex-col items-center py-6 h-auto bg-gradient-to-br from-slate-700 to-slate-800 border-slate-600 hover:from-slate-800 hover:to-slate-900 transition-all duration-200 text-white"
                onClick={() => handleQRScan('payment')}
              >
                <Camera className="h-6 w-6 mb-2 text-slate-200" />
                <span className="text-sm font-medium text-slate-200">
                  Scan to Pay
                </span>
              </Button>
            </div>
          </div>

          {/* Voucher Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-slate-100 border border-slate-300">
              <TabsTrigger
                value="active"
                className="flex items-center gap-2 data-[state=active]:bg-slate-800 data-[state=active]:text-slate-100"
              >
                <Ticket className="h-4 w-4" />
                Active ({activeVouchers.length})
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="flex items-center gap-2 data-[state=active]:bg-slate-800 data-[state=active]:text-slate-100"
              >
                <History className="h-4 w-4" />
                History ({historyVouchers.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {getFilteredVouchers(activeVouchers).length === 0 ? (
                  <Card className="col-span-full border-slate-200">
                    <CardContent className="text-center py-12">
                      <Ticket className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-600 text-lg">
                        No active vouchers found
                      </p>
                      <p className="text-slate-500 text-sm">
                        Try scanning a QR code or entering a promo code
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  getFilteredVouchers(activeVouchers).map((voucher) => (
                    <VoucherCard
                      key={voucher.id}
                      voucher={voucher}
                      onApply={(voucherId) => {
                        router.push(`/payment?voucher=${voucherId}`);
                      }}
                    />
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {getFilteredVouchers(historyVouchers).length === 0 ? (
                  <Card className="col-span-full border-slate-200">
                    <CardContent className="text-center py-12">
                      <History className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-600 text-lg">
                        No voucher history
                      </p>
                      <p className="text-slate-500 text-sm">
                        Used and expired vouchers will appear here
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  getFilteredVouchers(historyVouchers).map((voucher) => (
                    <VoucherCard
                      key={voucher.id}
                      voucher={voucher}
                      onApply={() => {}}
                      isHistory={true}
                    />
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* QR Scanner Modal */}
      <Dialog open={showQRScanner} onOpenChange={setShowQRScanner}>
        <DialogContent className="sm:max-w-lg border-slate-300">
          <DialogHeader>
            <DialogTitle className="text-center text-slate-900">
              {scanType === 'payment'
                ? 'Scan Restaurant QR Code'
                : 'Scan Voucher QR Code'}
            </DialogTitle>
          </DialogHeader>
          <QRScan
            onResult={handleQRResult}
            onClose={() => setShowQRScanner(false)}
            scanType={scanType}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
