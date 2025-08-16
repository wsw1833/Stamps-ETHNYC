import { encodeFunctionData } from 'viem';
import StampNFTABI from '../app/ABI/StampNFT.json';

export function encodeMintFunction(
  tokenURI: string,
  ownerAddress: `0x${string}`
): `0x${string}` {
  return encodeFunctionData({
    abi: StampNFTABI,
    functionName: 'mint',
    args: [tokenURI, ownerAddress],
  });
}

export function encodeBurnFunction(tokenIds: bigint[]): `0x${string}` {
  return encodeFunctionData({
    abi: StampNFTABI,
    functionName: 'burn',
    args: [tokenIds],
  });
}
