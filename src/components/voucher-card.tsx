'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Calendar, Store, Clock } from 'lucide-react';

interface Voucher {
  id: string;
  restaurantName: string;
  discount: string;
  expirationDate: string;
  status: 'active' | 'expired' | 'used';
  ipfsLink: string;
  description: string;
}

interface VoucherCardProps {
  voucher: Voucher;
  onApply: (voucherId: string) => void;
  isHistory?: boolean;
}

export function VoucherCard({
  voucher,
  onApply,
  isHistory = false,
}: VoucherCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'expired':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'used':
        return 'bg-slate-100 text-slate-800 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'used':
        return '✓';
      case 'expired':
        return '⏰';
      default:
        return '';
    }
  };

  const isExpired = new Date(voucher.expirationDate) < new Date();
  const canApply = voucher.status === 'active' && !isExpired && !isHistory;

  return (
    <Card
      className={`w-full transition-all duration-200 hover:shadow-lg border-slate-200 ${
        isHistory ? 'opacity-75' : ''
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Store className="h-4 w-4 text-slate-500" />
              <h3 className="font-semibold text-slate-900 text-lg">
                {voucher.restaurantName}
              </h3>
            </div>
            <p className="text-2xl font-bold text-slate-800">
              {voucher.discount}
            </p>
          </div>
          <Badge className={`${getStatusColor(voucher.status)} font-medium`}>
            {getStatusIcon(voucher.status)} {voucher.status.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        <p className="text-sm text-slate-600">{voucher.description}</p>

        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-slate-400" />
          <span className="text-slate-500">
            {isHistory && voucher.status === 'used' ? 'Used' : 'Expires'}:{' '}
            {new Date(voucher.expirationDate).toLocaleDateString()}
          </span>
        </div>

        <div className="flex items-center justify-between pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(voucher.ipfsLink, '_blank')}
            className="border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            Details
          </Button>

          {canApply && (
            <Button
              size="sm"
              onClick={() => onApply(voucher.id)}
              className="bg-slate-800 hover:bg-slate-900 text-white"
            >
              Apply Voucher
            </Button>
          )}

          {isHistory && (
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <Clock className="h-3 w-3" />
              {voucher.status === 'used' ? 'Applied' : 'Expired'}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
