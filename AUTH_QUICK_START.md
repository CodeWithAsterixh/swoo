# Swoo User Account System - Quick Start

## What's New

Your Swoo application now has a **complete secured user account system**. This means:

✅ Users must create an account to save projects to the database
✅ All projects are securely linked to user accounts
✅ Passwords are hashed with bcryptjs (never stored in plain text)
✅ Sessions use JWT tokens (no server-side session storage needed)
✅ All API endpoints require authentication

## Getting Started

### 1. Setup Environment Variables

Copy `.env.local.example` to `.env.local` and update it:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=generate-a-strong-random-key-here
```

To generate a strong JWT_SECRET, you can use:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. User Flow

**Registration:**
1. User clicks "Sign Up" in the top navigation
2. Fills out name, email, and password
3. Account is created and user is logged in
4. Redirected to templates page

**Login:**
1. User clicks "Sign In" in the top navigation
2. Enters email and password
3. JWT token is stored in browser localStorage
4. User gains access to their projects

**Creating Projects:**
1. User clicks "Create" button
2. Chooses save destination (Cloud, Local, or Both)
3. Project is saved with userId link
4. User can edit and update the project

### 3. Key Features

#### Protected Pages
These pages now require authentication:
- `/templates` - Browse and manage your projects
- `/editor/create` - Create new designs
- `/editor/[id]` - Edit your designs

#### User Menu
In the navigation bar:
- Shows logged-in user's name
- Dropdown menu with "Sign Out" option
- Sign In/Sign Up buttons for guests

#### Secure API
All project operations require:
- Valid JWT token in `Authorization` header
- User can only access their own projects
- Server validates ownership before operations

### 4. Development Testing

#### Test Registration:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpass123",
    "name": "Test User"
  }'
```

#### Test Login:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpass123"
  }'
```

The response will include a `token` - use this in API calls.

#### Test Protected API:
```bash
curl -X GET http://localhost:3000/api/projects \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 5. Code Examples

**Using auth in your components:**

```tsx
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, login, logout, isAuthenticated } = useAuth();

  const handleLogin = async () => {
    const result = await login('user@example.com', 'password');
    if (result.success) {
      console.log('Logged in!');
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <>
          <p>Welcome, {user?.name}!</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
}
```

**Protecting pages:**

```tsx
import { useRequireAuth } from '@/contexts/useRequireAuth';

export default function ProtectedPage() {
  useRequireAuth(); // Redirects to /auth/login if needed

  return <div>Only authenticated users see this</div>;
}
```

### 6. Database Schema

**users collection:**
```javascript
{
  _id: ObjectId,
  email: "user@example.com",
  passwordHash: "bcrypted_hash",
  name: "User Name",
  role: "user",
  projects: [ObjectId],
  createdAt: Date,
  updatedAt: Date
}
```

**swoocards collection:**
```javascript
{
  _id: ObjectId,
  userId: ObjectId,  // Link to user
  name: "My Card",
  canvas: { width: 350, height: 200, backgroundColor: "#fff" },
  pages: [...],
  createdAt: Date,
  updatedAt: Date
}
```

### 7. Important Security Notes

⚠️ **PRODUCTION CHECKLIST:**

- [ ] Change `JWT_SECRET` to a strong random string
- [ ] Use HTTPS only (never http in production)
- [ ] Set `NODE_ENV=production`
- [ ] Enable CORS properly (whitelist domains)
- [ ] Add rate limiting to auth endpoints
- [ ] Set secure cookie flags if using cookies
- [ ] Regularly update dependencies
- [ ] Monitor login attempts for abuse
- [ ] Consider adding email verification

### 8. Troubleshooting

**"Unauthorized" error on project save:**
- Check browser console for errors
- Verify token is saved in localStorage
- Try logging out and back in
- Clear browser cache and cookies

**"Email already registered":**
- Use a different email address
- Or reset database and start fresh

**Token expired:**
- Tokens expire after 7 days
- User needs to log in again
- Consider implementing token refresh

### 9. Next Steps

After setting up:
1. Create a test account
2. Create a design and save it to the database
3. Refresh the page and verify the design loads
4. Try logging out and logging back in
5. Create another account and verify isolation

## API Reference

See `AUTH_SYSTEM.md` for complete API documentation including:
- All endpoint details
- Request/response formats
- Error responses
- Code examples

## Files Modified

### New Files:
- `app/auth/login/page.tsx` - Login page
- `app/auth/register/page.tsx` - Registration page
- `app/contexts/AuthContext.tsx` - Auth state management
- `app/contexts/useRequireAuth.ts` - Auth protection hook
- `app/api/auth/register/route.ts` - Registration API
- `app/api/auth/login/route.ts` - Login API
- `app/api/auth/verify/route.ts` - Token verification API
- `business-card-editor/lib/jwt.ts` - JWT utilities
- `.env.local.example` - Environment template

### Updated Files:
- `business-card-editor/models/User.ts` - Added password hashing
- `app/api/projects/route.ts` - Added auth requirement
- `app/components/Navigation.tsx` - Added user menu
- `app/layout.tsx` - Added AuthProvider
- `business-card-editor/store/editorStore.ts` - Added auth token to API calls
- `business-card-editor/services/projectService.ts` - Added userId filtering

### Documentation:
- `AUTH_SYSTEM.md` - Complete system documentation

---

**Questions?** Check AUTH_SYSTEM.md for detailed documentation or review the code in the files listed above.
