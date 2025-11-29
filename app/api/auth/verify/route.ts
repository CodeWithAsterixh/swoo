import { NextRequest, NextResponse } from 'next/server';
import { connectDb } from '../../../../business-card-editor/lib/db';
import User from '../../../../business-card-editor/models/User';
import { authenticateToken } from '../../../../business-card-editor/lib/jwt';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const payload = authenticateToken(authHeader || '');

    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or missing token' },
        { status: 401 }
      );
    }

    await connectDb();
    const user = await User.findById(payload.userId);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error('Verify error:', error);
    return NextResponse.json(
      { error: error?.message || 'Verification failed' },
      { status: 500 }
    );
  }
}
