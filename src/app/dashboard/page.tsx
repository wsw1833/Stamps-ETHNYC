'use client';

import { useState, useEffect } from 'react';
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
import { Search, Scan, History, Ticket, NfcIcon } from 'lucide-react';
import { NFCScan } from '@/components/nfc-scan';
import globe from '@/images/globe.svg';
import Image from 'next/image';
import VoucherStamp from '@/components/voucherStamp';
import { useStamps } from '@/hooks/useStamps';
import { mintStamp, StampData } from '../actions/stampActions';
import { useDynamicContext, DynamicWidget } from '@dynamic-labs/sdk-react-core';
import { toast } from 'sonner';
import { useAccount } from 'wagmi';
import { pinata } from '../config/pinata';
import { useStampNFT } from '@/hooks/useStampNFT';
import { contractAddress } from '@/lib/constant';

interface NfcData {
  [key: string]: string | undefined;
  ipfs?: string;
  storeName?: string;
  address?: string;
}

export default function DashboardPage() {
  const { address } = useAccount();
  const { stamps, isLoading, refetch } = useStamps();
  const { sponsoredMint, isLoading: NFTMintLoading } = useStampNFT({
    contractAddress,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [nfcSupported, setNfcSupported] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [activeTab, setActiveTab] = useState('active');
  const { user } = useDynamicContext();
  const router = useRouter();

  useEffect(() => {
    // Check NFC support on component mount
    if (typeof window !== 'undefined' && 'NDEFReader' in window) {
      setNfcSupported(true);
    }
  }, []);

  // Active tab: Only vouchers with status "active"
  const activeStamps = stamps.filter((s) => s.status === 'active');

  // History tab: All vouchers with status "expired" or "used"
  const historyStamps = stamps.filter(
    (s) => s.status === 'expired' || s.status === 'used'
  );

  const getFilteredStamps = (stampList: StampData[]) => {
    return stampList.filter(
      (stamp) =>
        stamp.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stamp.discount.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const handleScanMint = async () => {
    if (!nfcSupported || !address) {
      toast.error('Web NFC API is not supported in this browser.');
      return;
    }

    if (!address) return;

    try {
      setShowScanner(true);
      toast.info('Scanning NFC Tag...');

      const ndef = new (window as any).NDEFReader();
      await ndef.scan();

      ndef.addEventListener('reading', async ({ message }: any) => {
        // Parse NFC data
        const nfcData: NfcData = {};
        for (const record of message.records) {
          if (record.recordType === 'text') {
            const text = new TextDecoder(record.encoding).decode(record.data);
            const [key, ...valueParts] = text.split(':');
            if (key) {
              nfcData[key] = valueParts.join(':');
            }
          }
        }

        if (!nfcData.ipfs) {
          toast.error('Invalid NFC data');
          setShowScanner(false);
          return;
        }

        let metadata: any;

        const file = await pinata.gateways.public.get(nfcData.ipfs);
        if (file.data) {
          metadata = file.data;
          console.log(metadata);
          toast.success(`NFC Data Read Successfully`);
        }

        const txResult = await sponsoredMint(nfcData.ipfs.trim());

        console.log('minting result', txResult);

        const formData: StampData = {
          stampId: txResult.stampId,
          ownerAddress: address || '',
          txHash: txResult.transactionHash,
          storeName: metadata?.storeName || 'ETHGlobal',
          discount: metadata?.discount || '$15 OFF',
          discountType: metadata?.voucherType || 'fixed',
          discountAmount: metadata?.voucherAmount || 15,
          validUntil: metadata?.validUntil || new Date().toISOString(),
          ipfs: nfcData.ipfs || 'ipfs://',
          variant: metadata?.variant || 'manhattan',
        };

        console.log('Received stamp data:', formData);

        const result = await mintStamp(formData);
        if (result.success) {
          setShowScanner(false);
          toast.success('NFT Minted Successfully!');
          refetch();
        } else {
          toast.error(`Failed to mint: ${result.error || result.message}`);
          console.error('Mint failed:', result);
        }
      });
    } catch (err) {
      toast('NFT Minting Failed!');
    }
  };

  const handleNFCScan = async () => {
    if (!nfcSupported || !address) {
      toast.error('Web NFC API is not supported in this browser.');
      return;
    }

    if (!address) return;

    try {
      setShowScanner(true);
      toast.info('Scanning NFC Tag...');

      const ndef = new (window as any).NDEFReader();
      await ndef.scan();

      ndef.addEventListener('reading', async ({ message }: any) => {
        // Parse NFC data
        const nfcData: NfcData = {};
        for (const record of message.records) {
          if (record.recordType === 'text') {
            const text = new TextDecoder(record.encoding).decode(record.data);
            const [key, ...valueParts] = text.split(':');
            if (key) {
              nfcData[key] = valueParts.join(':');
            }
          }
        }

        if (!nfcData.storeName || !nfcData.address) {
          toast.error('Invalid NFC data');
          setShowScanner(false);
          return;
        }

        setShowScanner(false);
        router.push(
          `/payment?storeName=${nfcData.storeName}&storeAddress=${nfcData.address}`
        );
      });
    } catch (err) {
      toast('NFT Minting Failed!');
    }
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-white -z-20 my-auto">
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
                <NfcIcon className="h-6 w-6 mb-2" />
                <span className="text-sm font-medium">Mint Voucher</span>
              </Button>

              <Button
                variant="outline"
                className="flex flex-col items-center h-fit p-4 bg-black/90 hover:bg-black hover:text-white transition-all duration-200 text-white"
                onClick={() => handleNFCScan()}
              >
                <Scan className="h-8 w-8 mb-2" />
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
                Active ({activeStamps.length})
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="flex items-center gap-2 data-[state=active]:bg-black data-[state=active]:text-slate-100"
              >
                <History className="h-4 w-4" />
                History ({historyStamps.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-4">
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-7 items-center justify-center">
                {getFilteredStamps(activeStamps).length === 0 ? (
                  <Card className="col-span-full border-slate-200">
                    <CardContent className="text-center py-12">
                      <Ticket className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-600 text-lg">
                        No active Stamps found
                      </p>
                      <p className="text-slate-500 text-sm">
                        Try scanning an NFC to mint Stamp.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  getFilteredStamps(activeStamps).map((stamp) => (
                    <VoucherStamp
                      key={stamp.stampId}
                      stampType={stamp.storeName}
                      priceOffer={stamp.discount}
                      validUntil={stamp.validUntil}
                      ipfs={stamp.ipfs}
                      variant={stamp.variant}
                    />
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-7 items-center justify-center">
                {getFilteredStamps(historyStamps).length === 0 ? (
                  <Card className="col-span-full border-slate-200">
                    <CardContent className="text-center py-12">
                      <History className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-600 text-lg">
                        No Stamps history
                      </p>
                      <p className="text-slate-500 text-sm">
                        Used and expired stamps will appear here
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  getFilteredStamps(historyStamps).map((stamp) => (
                    <VoucherStamp
                      key={stamp.stampId}
                      stampType={stamp.storeName}
                      priceOffer={stamp.discount}
                      validUntil={stamp.validUntil}
                      ipfs={stamp.ipfs}
                      variant={stamp.variant}
                    />
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/*NFC Scanner Modal */}
      <Dialog open={showScanner} onOpenChange={setShowScanner}>
        <DialogContent className="sm:max-w-lg border-slate-300">
          <DialogHeader>
            <DialogTitle className="text-center text-slate-900">
              Scan NFC to mint Stamps
            </DialogTitle>
          </DialogHeader>
          <NFCScan
            onResult={handleNFCScan}
            onClose={() => setShowScanner(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
