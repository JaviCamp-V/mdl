import NextAuth, { User } from 'next-auth';
import NextAuth from 'next-auth/jwt';
import AccessLevel from '@/features/auth/types/enums/AccessLevel';
import Role from '@/features/auth/types/enums/Role'
declare module 'next-auth' {
  interface Session {
    user: User;
  }
  
  interface User {
    userId: number | null | undefined;
    username?: string | null | undefined;
    role: Role | null | undefined;
    accessLevels: AccessLevel[] | null | undefined;
    accessToken: string | null | undefined;
    refreshToken: string | null | undefined;
    expiresIn: number | null | undefined;
    authError?: string | null | undefined;
    rememberMe: boolean | null | undefined;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    user: User;
    accessToken: string | null | undefined;
    refreshToken: string | null | undefined;
    role: Role | null | undefined;
    accessLevels: AccessLevel[] | null | undefined;
    expiry: number | null | undefined;    
  }
}