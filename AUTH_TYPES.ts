/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Authentication System Type Definitions
 * 
 * This file documents all TypeScript interfaces and types used in the auth system.
 */

// ============================================================================
// User Types
// ============================================================================

/**
 * User role enum for access control
 */
export type UserRole = 'guest' | 'user' | 'admin';

/**
 * User data as returned from API
 */
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

/**
 * MongoDB User Document
 */
export interface IUserDocument {
  _id?: string;
  email: string;
  passwordHash: string;
  name: string;
  role: UserRole;
  projects?: string[];
  createdAt?: Date;
  updatedAt?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// ============================================================================
// JWT Token Types
// ============================================================================

/**
 * Decoded JWT payload
 */
export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;  // issued at
  exp?: number;  // expiration
}

/**
 * Registration request
 */
export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

/**
 * Registration response
 */
export interface RegisterResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

/**
 * Login request
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Login response
 */
export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

/**
 * Verify token response
 */
export interface VerifyResponse {
  success: boolean;
  user: User;
}

/**
 * Generic API error response
 */
export interface ErrorResponse {
  error: string;
  message?: string;
  status?: number;
}

// ============================================================================
// Auth Context Types
// ============================================================================

/**
 * Auth context value type
 */
export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  setToken: (token: string | null) => void;
}

/**
 * useRequireAuth hook result
 */
export interface UseRequireAuthResult {
  isLoading: boolean;
  isAuthenticated: boolean;
}

// ============================================================================
// Project Authorization Types
// ============================================================================

/**
 * Project with user ownership info
 */
export interface AuthorizedProject {
  _id: string;
  userId: string;  // ObjectId of owner
  name: string;
  canvas: {
    width: number;
    height: number;
    backgroundColor?: string;
  };
  pages: Array<{
    id: string;
    elements: any[];
  }>;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Authorization check result
 */
export interface AuthorizationResult {
  authorized: boolean;
  reason?: string;
  userId?: string;
}

// ============================================================================
// API Request/Response Types
// ============================================================================

/**
 * Authenticated API request headers
 */
export interface AuthHeaders {
  'Content-Type': 'application/json';
  'Authorization': string;  // 'Bearer <token>'
}

/**
 * Project creation request (requires auth)
 */
export interface CreateProjectRequest {
  name: string;
  canvas: {
    width: number;
    height: number;
    backgroundColor?: string;
  };
  pages: Array<{
    id: string;
    elements: any[];
  }>;
  saveMode?: 'remote' | 'local' | 'both';
}

/**
 * Project update request (requires auth)
 */
export interface UpdateProjectRequest {
  id: string;
  data: Partial<AuthorizedProject>;
}

// ============================================================================
// Error Types
// ============================================================================

/**
 * Authentication error types
 */
export enum AuthErrorType {
  InvalidCredentials = 'INVALID_CREDENTIALS',
  EmailAlreadyExists = 'EMAIL_ALREADY_EXISTS',
  InvalidToken = 'INVALID_TOKEN',
  TokenExpired = 'TOKEN_EXPIRED',
  MissingToken = 'MISSING_TOKEN',
  InvalidEmail = 'INVALID_EMAIL',
  WeakPassword = 'WEAK_PASSWORD',
  DatabaseError = 'DATABASE_ERROR',
  ServerError = 'SERVER_ERROR',
}

/**
 * Authorization error types
 */
export enum AuthzErrorType {
  Unauthorized = 'UNAUTHORIZED',
  Forbidden = 'FORBIDDEN',
  ResourceNotFound = 'RESOURCE_NOT_FOUND',
  NotOwner = 'NOT_OWNER',
}

/**
 * Custom auth error
 */
export class AuthError extends Error {
  constructor(
    public type: AuthErrorType,
    message: string,
    public statusCode: number = 401
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

/**
 * Custom authorization error
 */
export class AuthzError extends Error {
  constructor(
    public type: AuthzErrorType,
    message: string,
    public statusCode: number = 403
  ) {
    super(message);
    this.name = 'AuthzError';
  }
}

// ============================================================================
// Storage Types
// ============================================================================

/**
 * Auth state stored in localStorage
 */
export interface StoredAuthState {
  token: string;
  user: User;
  timestamp: number;
}

/**
 * Local project data (encrypted)
 */
export interface LocalProjectData {
  [projectId: string]: AuthorizedProject;
}

// ============================================================================
// Configuration Types
// ============================================================================

/**
 * JWT configuration
 */
export interface JWTConfig {
  secret: string;
  expiresIn: string;
  algorithm: 'HS256' | 'HS512';
}

/**
 * Auth configuration
 */
export interface AuthConfig {
  jwt: JWTConfig;
  passwordMinLength: number;
  saltRounds: number;
  tokenStorageKey: string;
  userStorageKey: string;
}
