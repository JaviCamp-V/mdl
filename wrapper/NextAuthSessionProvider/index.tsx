'use client';

import React from 'react';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';

interface SessionProviderProps {
  session: Session | null;
  children: React.ReactNode;
}
const NextAuthSessionProvider: React.FC<SessionProviderProps> = ({ session, children }) => {
  return <SessionProvider session={session}>{children}</SessionProvider>;
};

export default NextAuthSessionProvider;
