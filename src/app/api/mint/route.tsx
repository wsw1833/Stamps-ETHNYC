import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Stamp } from '@/models/schema';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      'ownerAddress',
      'tokenId',
      'txHash',
      'ipfs',
      'storeName',
      'voucherType',
      'voucherAmount',
      'validUntil',
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Check if stamp with same ID already exists
    const existingStamp = await Stamp.findOne({ id: body.id });
    if (existingStamp) {
      return NextResponse.json(
        { success: false, error: 'Stamp with this ID already exists' },
        { status: 409 }
      );
    }

    // Check if transaction hash already exists
    const existingTx = await Stamp.findOne({ txHash: body.txHash });
    if (existingTx) {
      return NextResponse.json(
        { success: false, error: 'Transaction hash already exists' },
        { status: 409 }
      );
    }

    // Create new stamp
    const newStamp = new Stamp({
      id: body.id,
      ownerAddress: body.ownerAddress,
      tokenId: body.tokenId,
      txHash: body.txHash,
      ipfs: body.ipfs,
      storeName: body.storeName,
      voucherType: body.voucherType,
      voucherAmount: body.voucherAmount,
      validUntil: new Date(body.validUntil),
      status: body.status || 'active',
      createdAt: body.createdAt ? new Date(body.createdAt) : new Date(),
    });

    const savedStamp = await newStamp.save();

    return NextResponse.json(
      {
        success: true,
        data: savedStamp,
        message: 'Stamp minted successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in POST /api/stamps/mint:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
