'use client';

import { useEffect, useState } from 'react';
import { getStampsFilteredByStoreName } from '@/app/actions/stampActions';
import { StampData } from '@/app/actions/stampActions';

interface UseStoreStampsResult {
  stamps: StampData[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useStoreStamps = (storeName: string): UseStoreStampsResult => {
  const [stamps, setStamps] = useState<StampData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVouchers = async () => {
    if (!storeName) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await getStampsFilteredByStoreName(storeName, {
        status: 'active', // optional: filter by active only
      });

      if (response.success) {
        setStamps(response.data || []);
      } else {
        setError(response.error || 'Unknown error');
      }
    } catch (err) {
      setError('Failed to fetch vouchers');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, [storeName]);

  return {
    stamps,
    isLoading,
    error,
    refetch: fetchVouchers,
  };
};
