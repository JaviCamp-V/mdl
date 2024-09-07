import nextAuthOptions from '@/features/auth/config/authOptions';
import { Session, getServerSession } from 'next-auth';
import { getSession } from 'next-auth/react';
import getRequest from './getRequest';

const getUserSession = async (): Promise<Session | null> => {
  const session = await getServerSession(nextAuthOptions);
  return session;
};

const getServerActionSession = async (): Promise<Session | null> => {
  const req = await getRequest();
  const session = await getSession({ req });
  return session as Session | null;
};

export { nextAuthOptions, getUserSession as getSession, getServerActionSession };
