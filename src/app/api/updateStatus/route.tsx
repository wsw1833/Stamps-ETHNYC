import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Stamp } from '@/models/schema';

export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    if (
      !body.stampIds ||
      !Array.isArray(body.stampIds) ||
      body.stampIds.length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error: 'stampIds array is required and must not be empty',
        },
        { status: 400 }
      );
    }

    if (!body.status) {
      return NextResponse.json(
        { success: false, error: 'Status is required' },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = ['active', 'used', 'expired', 'inactive'];
    if (!validStatuses.includes(body.status)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
        },
        { status: 400 }
      );
    }

    // Update multiple stamps
    const updateResult = await Stamp.updateMany(
      { stampId: { $in: body.stampIds } },
      {
        status: body.status,
        updatedAt: new Date(),
      },
      { runValidators: true }
    );

    // Get the updated stamps to return
    const updatedStamps = await Stamp.find({
      stampId: { $in: body.stampIds },
    }).lean();

    if (updateResult.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'No stamps found with the provided IDs' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: updatedStamps,
        updatedCount: updateResult.modifiedCount,
        matchedCount: updateResult.matchedCount,
        message: `Successfully updated ${updateResult.modifiedCount} stamp(s)`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in PUT /api/stamps/status/batch:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
