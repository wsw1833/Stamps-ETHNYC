import { NextRequest, NextResponse } from 'next/server';
import { Address } from 'viem';
import { ethers } from 'ethers';

const FLOW_EVM_TESTNET_RPC = 'https://testnet.evm.nodes.onflow.org';
const SEPOLIA_RPC = `https://sepolia.infura.io/v3/30b7c6dd689b4100923e3d562ae7b084`;
const SPONSOR_PRIVATE_KEY = process.env.AGENT_PRIVATE_KEY;

if (!SPONSOR_PRIVATE_KEY) {
  throw new Error('AGENT_PRIVATE_KEY environment variable is required');
}

//change sepolia <-> flow rpc;
const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC);
const sponsorWallet = new ethers.Wallet(SPONSOR_PRIVATE_KEY, provider);

interface SponsorTransactionRequest {
  userAddress: Address;
  targetContract: Address;
  functionData: string;
  userSignature: string;
  originalTxData: {
    to: Address;
    data: string;
    value?: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body: SponsorTransactionRequest = await request.json();
    const {
      userAddress,
      targetContract,
      functionData,
      userSignature,
      originalTxData,
    } = body;

    // Validate required fields
    if (
      !userAddress ||
      !targetContract ||
      !functionData ||
      !userSignature ||
      !originalTxData
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate the user's signature
    const isValidSignature = await validateUserSignature(
      userAddress,
      userSignature,
      originalTxData
    );

    if (!isValidSignature) {
      return NextResponse.json(
        { error: 'Invalid user signature' },
        { status: 400 }
      );
    }

    // Estimate gas for the transaction
    const gasLimit = await estimateGas(targetContract, functionData);
    const gasPrice = await getGasPrice();

    //retrieve tokenID from transfer event.
    const nftInterface = new ethers.Interface([
      'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)',
    ]);

    // Create the sponsored transaction
    const sponsoredTx = {
      to: targetContract,
      data: functionData,
      value: originalTxData.value || '0',
      gasLimit: gasLimit.toString(),
      gasPrice: gasPrice.toString(),
    };

    console.log('Sending sponsored transaction:', {
      to: sponsoredTx.to,
      gasLimit: sponsoredTx.gasLimit,
      gasPrice: sponsoredTx.gasPrice,
    });

    // Sign and send the transaction with sponsor's wallet
    const txResponse = await sponsorWallet.sendTransaction(sponsoredTx);

    // Wait for transaction confirmation
    const receipt = await txResponse.wait();
    let transferEvent: any;
    if (receipt) {
      transferEvent = receipt.logs
        .map((log) => {
          try {
            return nftInterface.parseLog(log);
          } catch {
            return null;
          }
        })
        .find((parsed) => parsed && parsed.name === 'Transfer');
    }

    if (transferEvent) {
      const tokenId = transferEvent.args.tokenId.toString();
      console.log('stampID', tokenId);
    }

    console.log('receipt', receipt);

    return NextResponse.json({
      success: true,
      stampId: transferEvent.args.tokenId.toString(),
      transactionHash: txResponse.hash,
      blockNumber: receipt?.blockNumber,
      gasUsed: receipt?.gasUsed?.toString(),
      effectiveGasPrice: receipt?.gasPrice?.toString(),
    });
  } catch (error: any) {
    console.error('Sponsored transaction error:', error);

    return NextResponse.json(
      {
        error: 'Failed to process sponsored transaction',
        details: error.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}

async function getGasPrice() {
  try {
    const feeData = await provider.getFeeData();
    if (feeData.gasPrice) {
      return feeData.gasPrice;
    }
  } catch (error) {
    console.log('getFeeData failed, trying alternative methods');
  }
  return BigInt('1000000000');
}

async function validateUserSignature(
  userAddress: Address,
  signature: string,
  txData: { to: Address; data: string; value?: string }
): Promise<boolean> {
  try {
    // Create message hash from transaction data
    const messageHash = ethers.keccak256(
      ethers.AbiCoder.defaultAbiCoder().encode(
        ['address', 'bytes', 'uint256'],
        [txData.to, txData.data, BigInt(txData.value || 0)]
      )
    );

    // Create the message that was actually signed (with Ethereum prefix)
    const ethMessage = ethers.hashMessage(ethers.getBytes(messageHash));

    // Recover signer address from signature
    const signerAddress = ethers.recoverAddress(ethMessage, signature);

    return signerAddress.toLowerCase() === userAddress.toLowerCase();
  } catch (error) {
    console.error('Signature validation error:', error);
    return false;
  }
}

// Helper function to estimate gas
async function estimateGas(to: Address, data: string): Promise<bigint> {
  try {
    const gasEstimate = await provider.estimateGas({ to, data });
    // Add 20% buffer for safety
    return (gasEstimate * BigInt(120)) / BigInt(100);
  } catch (error) {
    console.error('Gas estimation error:', error);
    return BigInt(200000); // Fallback gas limit
  }
}
