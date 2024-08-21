import nextAuthOptions from '@/features/auth/config/authOptions';
import { Session, getServerSession } from 'next-auth';
import getRequest from './getRequest';

const getSession = async (): Promise<Session | null> => {
  const session = await getServerSession(nextAuthOptions);
  return session;
};

const getServerActionSession = async (): Promise<Session | null> => {
  const req = await getRequest();
  const session = await getServerSession({ req } as any);
  return session as Session | null;
};

export { nextAuthOptions, getSession, getServerActionSession };
