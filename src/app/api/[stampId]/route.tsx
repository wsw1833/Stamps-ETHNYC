import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Stamp } from '@/models/schema';
export async function GET(
  request: NextRequest,
  { params }: { params: { stampId: string } }
) {
  try {
    await connectDB();

    const { stampId } = params;

    const stamp = await Stamp.findOne({ stampId }).lean();

    if (!stamp) {
      return NextResponse.json(
        { success: false, error: 'Stamp not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: stamp,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in GET /api/stamps/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { stampId: string } }
) {
  try {
    await connectDB();

    const { stampId } = params;

    const deletedStamp = await Stamp.findOneAndDelete({ stampId });

    if (!deletedStamp) {
      return NextResponse.json(
        { success: false, error: 'Stamp not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: deletedStamp,
        message: 'Stamp deleted successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in DELETE /api/[stampId]:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
