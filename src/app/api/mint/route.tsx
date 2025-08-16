import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Stamp } from '@/models/schema';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      'stampId',
      'ownerAddress',
      'txHash',
      'storeName',
      'discount',
      'discountType',
      'discountAmount',
      'validUntil',
      'ipfs',
      'variant',
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
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
      stampId: body.stampId,
      ownerAddress: body.ownerAddress,
      txHash: body.txHash,
      storeName: body.storeName,
      discount: body.discount,
      discountType: body.discountType,
      discountAmount: body.discountAmount,
      validUntil: new Date(body.validUntil),
      ipfs: body.ipfs,
      status: 'active',
      variant: body.variant,
      createdAt: new Date(),
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
    console.error('Error in POST /api/mint:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
