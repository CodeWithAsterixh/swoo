/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { connectDb } from '../../../../business-card-editor/lib/db';
import User from '../../../../business-card-editor/models/User';
import { signToken } from '../../../../business-card-editor/lib/jwt';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, name } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Connect to DB
    await connectDb();

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();
    console.log('[register] Normalized email:', normalizedEmail);

    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      );
    }

    // Create user
    console.log('[register] Creating user:', normalizedEmail);
    const user = new User({
      email: normalizedEmail,
      passwordHash: password,
      name: name || email.split('@')[0],
      role: 'user',
      projects: [],
    });

    console.log('[register] Saving user...');
    await user.save();
    console.log('[register] User saved successfully:', normalizedEmail);

    // Generate token
    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const response = NextResponse.json(
      {
        success: true,
        message: 'Account created successfully',
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      { status: 201 }
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
    console.error('[register] Error occurred:', error);
    console.error('[register] Error message:', error?.message);
    console.error('[register] Error stack:', error?.stack);
    return NextResponse.json(
      { error: error?.message || 'Registration failed' },
      { status: 500 }
    );
  }
}
