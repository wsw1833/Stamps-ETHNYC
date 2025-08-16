import { useAccount, useSignMessage } from 'wagmi';
import { useState } from 'react';
import { Address } from 'viem';
import { ethers } from 'ethers';

interface SponsoredTxParams {
  targetContract: Address;
  functionData: string;
  value?: string;
}

interface SponsoredTxResponse {
  success: boolean;
  stampId: string;
  transactionHash: string;
  blockNumber?: number;
  gasUsed?: string;
  effectiveGasPrice?: string;
}

const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : 'http://localhost:3000';

export function useSponsoredGas() {
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeSponsoredTransaction = async (
    params: SponsoredTxParams
  ): Promise<SponsoredTxResponse> => {
    if (!address) {
      throw new Error('Wallet not connected');
    }

    setIsLoading(true);
    setError(null);

    try {
      // Create transaction data for signing
      const txData = {
        to: params.targetContract,
        data: params.functionData,
        value: params.value || '0',
      };

      // Create message hash for user to sign
      const messageHash = ethers.keccak256(
        ethers.AbiCoder.defaultAbiCoder().encode(
          ['address', 'bytes', 'uint256'],
          [txData.to, txData.data, BigInt(txData.value)]
        )
      );

      console.log('Signing message hash:', messageHash);

      // Request user signature
      const userSignature = await signMessageAsync({
        message: { raw: messageHash as `0x${string}` },
      });

      console.log('User signature:', userSignature);

      // Send to backend for sponsoring
      const response = await fetch(`/api/sponsor-gas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userAddress: address,
          targetContract: params.targetContract,
          functionData: params.functionData,
          userSignature,
          originalTxData: txData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Transaction failed');
      }

      const result: SponsoredTxResponse = await response.json();
      return result;
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    executeSponsoredTransaction,
    isLoading,
    error,
  };
}
