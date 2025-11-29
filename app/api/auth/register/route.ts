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

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      );
    }

    // Create user
    const user = new User({
      email,
      passwordHash: password,
      name: name || email.split('@')[0],
      role: 'user',
      projects: [],
    });

    await user.save();

    // Generate token
    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    return NextResponse.json(
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
  } catch (error: any) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: error?.message || 'Registration failed' },
      { status: 500 }
    );
  }
}
