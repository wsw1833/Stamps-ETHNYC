import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Stamp } from '@/models/schema';

export async function GET(
  request: NextRequest,
  { params }: { params: { address: string } }
) {
  try {
    await connectDB();

    const { address } = await params;
    const { searchParams } = new URL(request.url);

    // Build filters from query parameters
    const filters: any = { ownerAddress: address };
    if (searchParams.get('status')) filters.status = searchParams.get('status');
    if (searchParams.get('storeName'))
      filters.storeName = searchParams.get('storeName');
    if (searchParams.get('voucherType'))
      filters.voucherType = searchParams.get('voucherType');

    const stamps = await Stamp.find(filters).sort({ createdAt: -1 }).lean();

    return NextResponse.json(
      {
        success: true,
        data: stamps,
        count: stamps.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in GET /api/owner/[address]:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
