import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Stamp } from '@/models/schema';

export async function GET(request: NextRequest, { params }: any) {
  try {
    await connectDB();

    const { storeName } = params;
    const { searchParams } = new URL(request.url);

    // Build filters from query parameters
    const filters: any = { storeName };
    if (searchParams.get('status')) filters.status = searchParams.get('status');
    if (searchParams.get('discountType'))
      filters.discountType = searchParams.get('discountType');

    const stamps = await Stamp.find(filters).sort({ createdAt: -1 }).lean();

    return NextResponse.json(
      {
        success: true,
        data: stamps,
        count: stamps.length,
        storeName,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in GET /api/store/[storeName]:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
