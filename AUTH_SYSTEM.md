# Swoo Authentication System

## Overview

Swoo now includes a secured user account system that restricts database saving to authenticated users only. The system uses JWT (JSON Web Tokens) for session management and bcryptjs for password hashing.

## Architecture

### Authentication Flow

1. **Registration** (`POST /api/auth/register`)
   - User provides email, password, and optional name
   - Password is hashed using bcryptjs (10 salt rounds)
   - User account is created in MongoDB
   - JWT token is generated and returned

2. **Login** (`POST /api/auth/login`)
   - User provides email and password
   - Credentials are verified against stored hash
   - JWT token is generated on success
   - Token is stored in `localStorage` with key `auth_token`

3. **Token Verification** (`GET /api/auth/verify`)
   - Verifies JWT token validity
   - Returns current user info if valid
   - Used by AuthProvider to restore session on page load

4. **Protected API Routes**
   - All project endpoints (`/api/projects`) now require JWT authentication
   - Token is sent via `Authorization: Bearer <token>` header
   - Projects are automatically filtered by userId
   - Users can only access their own projects

## Key Components

### Backend

**Files:**
- `app/api/auth/register/route.ts` - User registration endpoint
- `app/api/auth/login/route.ts` - Login endpoint
- `app/api/auth/verify/route.ts` - Token verification
- `business-card-editor/lib/jwt.ts` - JWT utilities (sign, verify, extract)
- `business-card-editor/models/User.ts` - User Mongoose model with password hashing
- `app/api/projects/route.ts` - Updated to require authentication

**Key Functions:**
```typescript
// JWT utilities
signToken(payload: JWTPayload): string
verifyToken(token: string): JWTPayload | null
authenticateToken(authHeader?: string): JWTPayload | null

// User model with password hashing
User.comparePassword(candidatePassword: string): Promise<boolean>
```

### Frontend

**Files:**
- `app/contexts/AuthContext.tsx` - React Context for auth state
- `app/contexts/useRequireAuth.ts` - Hook to protect pages
- `app/auth/login/page.tsx` - Login page
- `app/auth/register/page.tsx` - Registration page
- `app/components/Navigation.tsx` - Updated with user menu and auth buttons

**Key Hooks:**
```typescript
useAuth() - Access auth state and functions
  - user: User | null
  - token: string | null
  - isAuthenticated: boolean
  - isLoading: boolean
  - login(email, password)
  - register(email, password, name?)
  - logout()

useRequireAuth() - Protect pages that require authentication
  - Redirects to /auth/login if not authenticated
  - Returns { isLoading, isAuthenticated }
```

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file with:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-in-production-12345
```

**Important:** Change `JWT_SECRET` to a strong random string in production.

### 2. Database

Ensure MongoDB is running and accessible. The system will automatically create:
- `users` collection - Stores user accounts with hashed passwords
- `swoocards` collection - Stores projects (now linked to users)

### 3. Install Dependencies

```bash
pnpm install bcryptjs jsonwebtoken
```

## Usage

### User Registration

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword123",
    "name": "John Doe"
  }'
```

Response:
```json
{
  "success": true,
  "message": "Account created successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

### User Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword123"
  }'
```

### Creating/Updating Projects

All project API calls now require authentication:

```bash
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "name": "My Business Card",
    "canvas": { "width": 350, "height": 200 },
    "pages": [{ "id": "page_1", "elements": [] }],
    "saveMode": "remote"
  }'
```

### Frontend Usage

```tsx
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, login, logout, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <p>Please log in</p>;
  }

  return (
    <div>
      <p>Welcome, {user?.name}!</p>
      <button onClick={logout}>Sign Out</button>
    </div>
  );
}
```

### Protecting Pages

```tsx
import { useRequireAuth } from '@/contexts/useRequireAuth';

export default function ProtectedPage() {
  useRequireAuth(); // Redirects to /auth/login if not authenticated

  return <div>This page requires authentication</div>;
}
```

## Security Features

1. **Password Hashing** - Passwords are hashed with bcryptjs (10 rounds) before storage
2. **JWT Tokens** - Stateless authentication using signed tokens
3. **Token Expiration** - Tokens expire after 7 days by default
4. **Authorization Headers** - All API calls include Bearer token in Authorization header
5. **userId Validation** - Projects are filtered by userId, preventing cross-user access
6. **403 Forbidden** - Users cannot access or modify projects they don't own

## Protected Routes

The following pages now require authentication:
- `/templates` - View and manage templates
- `/editor/create` - Create new projects
- `/editor/[id]` - Edit projects

Unauthenticated users are redirected to `/auth/login`.

## API Error Responses

**401 Unauthorized** - Missing or invalid token
```json
{
  "error": "Unauthorized: Invalid or missing token"
}
```

**403 Forbidden** - User doesn't own the resource
```json
{
  "error": "Forbidden: You do not own this project"
}
```

**409 Conflict** - Email already registered
```json
{
  "error": "Email already registered"
}
```

## Troubleshooting

### "Invalid token" error
- Check that `JWT_SECRET` matches between sessions
- Verify token hasn't expired (7 days)
- Clear localStorage and re-login

### "Email already registered"
- Use a different email or reset the database
- Each email can only have one account

### "Unauthorized" on projects API
- Ensure `Authorization: Bearer <token>` header is included
- Verify token is valid using `/api/auth/verify`

## Future Enhancements

- [ ] Token refresh mechanism
- [ ] Email verification for registration
- [ ] Password reset functionality
- [ ] OAuth/Google Sign-In
- [ ] Rate limiting on auth endpoints
- [ ] Audit logging for account changes
- [ ] Two-factor authentication (2FA)
