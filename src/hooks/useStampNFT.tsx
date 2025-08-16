import { useState } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { useSponsoredGas } from './useSponsoredGas';
import { encodeMintFunction, encodeBurnFunction } from '../lib/stampNFTUtil';
import { Address } from 'viem';

interface UseStampNFTProps {
  contractAddress: string;
}

export function useStampNFT({ contractAddress }: UseStampNFTProps) {
  const { address } = useAccount();
  const {
    executeSponsoredTransaction,
    isLoading: isSponsoredLoading,
    error: sponsoredError,
  } = useSponsoredGas();

  // Sponsored mint function
  const sponsoredMint = async (tokenURI: string) => {
    if (!address) {
      throw new Error('Wallet not connected');
    }

    try {
      const functionData = encodeMintFunction(tokenURI, address);

      const result = await executeSponsoredTransaction({
        targetContract: contractAddress as Address,
        functionData,
        value: '0',
      });
      return result;
    } catch (error) {
      console.error('Sponsored mint failed:', error);
      throw error;
    }
  };

  // Sponsored burn function
  const sponsoredBurn = async (tokenIds: bigint[]) => {
    if (!address) {
      throw new Error('Wallet not connected');
    }

    try {
      const functionData = encodeBurnFunction(tokenIds);

      const result = await executeSponsoredTransaction({
        targetContract: contractAddress as Address,
        functionData,
        value: '0',
      });
      return result;
    } catch (error) {
      console.error('Sponsored burn failed:', error);
      throw error;
    }
  };

  return {
    // Sponsored transaction functions
    sponsoredMint,
    sponsoredBurn,

    // Loading and error states
    isLoading: isSponsoredLoading,
    error: sponsoredError,
  };
}
