/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { connectDb } from '../../../../business-card-editor/lib/db';
import User from '../../../../business-card-editor/models/User';
import { signToken } from '../../../../business-card-editor/lib/jwt';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Connect to DB
    await connectDb();

    // Find user and include password for comparison
    console.log('[login] Attempting to find user:', email);
    const normalizedEmail = email.toLowerCase().trim();
    console.log('[login] Normalized email:', normalizedEmail);
    const user = await User.findOne({ email: normalizedEmail }).select('+passwordHash');
    if (!user) {
      console.log('[login] User not found:', email);
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    console.log('[login] User found:', email, 'has passwordHash:', !!user.passwordHash);

    // Compare password
    const isPasswordValid = await user.comparePassword(password);
    console.log('[login] Password comparison result:', isPasswordValid);
    if (!isPasswordValid) {
      console.log('[login] Invalid password for user:', email);
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate token
    console.log('[login] Generating token for user:', email);
    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });
    console.log('[login] Token generated successfully');

    const response = NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      { status: 200 }
    );

    // Set auth token as HTTP-only cookie (secure in production)
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('[login] Error occurred:', error);
    console.error('[login] Error message:', error?.message);
    console.error('[login] Error stack:', error?.stack);
    return NextResponse.json(
      { error: error?.message || 'Login failed' },
      { status: 500 }
    );
  }
}
