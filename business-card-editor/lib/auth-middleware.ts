import { NextRequest, NextResponse } from 'next/server';
import { authenticateToken, JWTPayload } from './jwt';

export interface AuthenticatedRequest extends NextRequest {
  user?: JWTPayload;
}

/**
 * Middleware to verify JWT token and attach user to request
 */
export async function verifyAuth(req: NextRequest): Promise<{ user: JWTPayload | null; response: NextResponse | null }> {
  const authHeader = req.headers.get('authorization');
  const user = authenticateToken(authHeader || '');

  if (!user) {
    const response = NextResponse.json(
      { error: 'Unauthorized: Invalid or missing token' },
      { status: 401 }
    );
    return { user: null, response };
  }

  return { user, response: null };
}

/**
 * Middleware to ensure user is authenticated before allowing API access
 */
export async function requireAuth(
  req: NextRequest,
  handler: (req: NextRequest, user: JWTPayload) => Promise<NextResponse>
): Promise<NextResponse> {
  const { user, response } = await verifyAuth(req);

  if (response) {
    return response; // Return 401 error
  }

  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // Call the handler with the authenticated user
  return handler(req, user);
}
