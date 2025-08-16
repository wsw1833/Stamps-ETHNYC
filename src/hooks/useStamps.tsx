'use client';

import { StampData, getStampsByOwnerAddress } from '@/app/actions/stampActions';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

interface UseStampsReturn {
  stamps: StampData[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useStamps = (): UseStampsReturn => {
  const { address } = useAccount();
  const [stamps, setStamps] = useState<StampData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllStamps = async () => {
    if (!address) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await getStampsByOwnerAddress(address);

      if (result.success) {
        setStamps(result.data || []);
      } else {
        setError(result.error || 'Failed to load stamps');
      }
    } catch (err) {
      setError('Failed to load stamps');
      console.error('Error loading stamps:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllStamps();
  }, [address]);

  return {
    stamps,
    isLoading,
    error,
    refetch: fetchAllStamps,
  };
};
