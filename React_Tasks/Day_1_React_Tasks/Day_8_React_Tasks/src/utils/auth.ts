import * as jose from 'jose';
import bcrypt from 'bcryptjs';
import { User, RolePermissions } from '../types';

// Environment variables (Use Vite's import.meta.env)
const SECRET_KEY = new TextEncoder().encode(import.meta.env.VITE_SECRET_KEY as string);

// Token expiration time (in seconds)
const TOKEN_EXPIRY = 60 * 60; // 1 hour

// Create JWT token
export const createToken = async (user: Omit<User, 'password'>) => {
  const jwt = await new jose.SignJWT({ userId: user.id, role: user.role })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${TOKEN_EXPIRY}s`)
    .sign(SECRET_KEY);
  
  return jwt;
};

// Verify JWT token
export const verifyToken = async (token: string) => {
  try {
    const { payload } = await jose.jwtVerify(token, SECRET_KEY);
    return payload;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
};

// Check if token is expired
export const isTokenExpired = async (token: string) => {
  try {
    const { payload } = await jose.jwtVerify(token, SECRET_KEY);
    const exp = payload.exp as number;
    const now = Math.floor(Date.now() / 1000);
    return exp < now;
  } catch (error) {
    return true; // If verification fails, consider token expired
  }
};

// Hash password
export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
};

// Compare password
export const comparePassword = async (password: string, hashedPassword: string) => {
  return await bcrypt.compare(password, hashedPassword);
};

// Check if user has permission for a specific action
export const hasPermission = (
  permissions: RolePermissions | null,
  module: keyof RolePermissions,
  action: keyof ModulePermissions | 'view' | 'edit'
): boolean => {
  if (!permissions) return false;
  
  const modulePermissions = permissions[module];
  if (!modulePermissions) return false;

  if (module === 'roles' && (action === 'view' || action === 'edit')) {
    return modulePermissions[action as 'view' | 'edit'];
  }

  if (modulePermissions && 'view' in modulePermissions && 'add' in modulePermissions && 'edit' in modulePermissions && 'delete' in modulePermissions) {
    return modulePermissions[action as keyof ModulePermissions];
  }

  return false;
};

interface ModulePermissions {
  view: boolean;
  add: boolean;
  edit: boolean;
  delete: boolean;
}
