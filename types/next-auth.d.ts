import NextAuth, { User } from 'next-auth';
import NextAuth from 'next-auth/jwt';
import AccessLevel from '@/features/auth/types/enums/AccessLevel';
import Role from '@/features/auth/types/enums/Role'
import UserAccountResponse from '@/features/auth/types/interfaces/UserAccountResponse';
declare module 'next-auth' {
  interface Session {
    user: User;
  }
  
  interface User extends UserAccountResponse{
    authError?: string | null | undefined;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    user: User;
    accessToken: string | null | undefined;
    refreshToken: string | null | undefined;
    deviceID: string | null  | undefined;
    rememberMe: boolean | null | undefined;
    expiry: number | null | undefined;    
  }
}