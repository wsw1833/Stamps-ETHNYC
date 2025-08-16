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
import { Search, QrCode, Camera, LogOut, History, Ticket } from 'lucide-react';
import { QRScan } from '@/components/qr-scan';
import globe from '@/images/globe.svg';
import Image from 'next/image';
import VoucherStamp from '@/components/voucherStamp';
import { mockVouchers } from '@/lib/constant';
import { useStamps } from '@/hooks/useStamps';
import { mintStamp } from '../actions/stampActions';
import { useDynamicContext, DynamicWidget } from '@dynamic-labs/sdk-react-core';
export interface Stamp {
  tokenid: string;
  ownerAddress?: string;
  restaurantName: string;
  discount: string;
  discountType: string;
  discountAmount: number;
  validUntil: string;
  status: 'active' | 'expired' | 'used';
  ipfs: string;
  description: string;
  variant?:
    | 'taxi'
    | 'subway'
    | 'manhattan'
    | 'coffee'
    | 'restaurant'
    | 'bar'
    | 'hotel'
    | 'luxury';
}

export default function DashboardPage() {
  //fetch acc address;
  const { stamps, isLoading, refetch } = useStamps(''); //adress here.
  const [vouchers, setVouchers] = useState<Stamp[]>(mockVouchers);
  const [searchQuery, setSearchQuery] = useState('');
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [scanType, setScanType] = useState<'voucher' | 'payment'>('voucher');
  const [activeTab, setActiveTab] = useState('active');
  const { user } = useDynamicContext();
  const router = useRouter();

  // Active tab: Only vouchers with status "active"
  const activeVouchers = vouchers.filter((v) => v.status === 'active');

  // History tab: All vouchers with status "expired" or "used"
  const historyVouchers = vouchers.filter(
    (v) => v.status === 'expired' || v.status === 'used'
  );

  const getFilteredVouchers = (voucherList: Stamp[]) => {
    return voucherList.filter(
      (voucher) =>
        voucher.restaurantName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        voucher.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const handleScanMint = async () => {
    setShowQRScanner(true);
    //nfc-scan and mint here.
    const data = stamps[0];
    const result = await mintStamp(data);
    // refetch stamps here.
  };

  const handleScanPay = (result: string) => {
    setShowQRScanner(false);
    router.push(`/payment?restaurant=${result}`);
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-white -z-20">
      {/* Header */}
      <div className="top-0 sticky z-50 bg-[#FFFFFFB5] shadow-md border-b border-slate-200 backdrop-blur-sm">
        <div className="px-4 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image
                src={globe}
                alt="sponsors"
                className="md:w-7 md:h-7 w-7 h-7"
              />
              <h1 className="text-xl lg:text-2xl font-bold text-black md:block hidden">
                Stamps
              </h1>
            </div>
            {user && <DynamicWidget variant="modal" buttonClassName="w-20" />}
          </div>
        </div>
      </div>

      <div className="px-4 lg:px-8 py-6 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search restaurants or vouchers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 border-slate-300"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mb-8">
            <div className="grid grid-cols-2 lg:grid-cols-2 gap-4 max-w-lg mx-auto">
              <Button
                variant="outline"
                className="flex flex-col items-center h-fit p-4 border-slate-300 text-slate-700 hover:bg-slate-50 transition-all duration-200 "
                onClick={() => handleScanMint()}
              >
                <QrCode className="h-6 w-6 mb-2" />
                <span className="text-sm font-medium">Mint Voucher</span>
              </Button>

              <Button
                variant="outline"
                className="flex flex-col items-center h-fit p-4 bg-black/90 hover:bg-black hover:text-white transition-all duration-200 text-white"
                onClick={() => handleScanPay('payment')}
              >
                <Camera className="h-8 w-8 mb-2" />
                <span className="text-sm font-medium">Scan to Pay</span>
              </Button>
            </div>
          </div>

          {/* Voucher Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full flex items-center "
          >
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-slate-100 border border-slate-300">
              <TabsTrigger
                value="active"
                className="flex items-center gap-2 data-[state=active]:bg-black data-[state=active]:text-slate-100"
              >
                <Ticket className="h-4 w-4" />
                Active ({activeVouchers.length})
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="flex items-center gap-2 data-[state=active]:bg-black data-[state=active]:text-slate-100"
              >
                <History className="h-4 w-4" />
                History ({historyVouchers.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-4">
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-7 items-center justify-center">
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
                    <VoucherStamp
                      key={voucher.tokenid}
                      voucherType={voucher.restaurantName}
                      priceOffer={voucher.discount}
                      validUntil={voucher.validUntil}
                      ipfs={voucher.ipfs}
                      status={voucher.status}
                      variant={voucher.variant}
                    />
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-7 items-center justify-center">
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
                    <VoucherStamp
                      key={voucher.tokenid}
                      voucherType={voucher.restaurantName}
                      priceOffer={voucher.discount}
                      validUntil={voucher.validUntil}
                      ipfs={voucher.ipfs}
                      status={voucher.status}
                      variant={voucher.variant}
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
            onResult={handleScanPay}
            onClose={() => setShowQRScanner(false)}
            scanType={scanType}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
