import { revalidatePath } from 'next/cache';
import { error } from 'console';
import { Account, NextAuthOptions, Session, User, getServerSession } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
import { Provider } from 'next-auth/providers/index';
import { login, refreshAuthToken, signUp } from '@/server/authActions';
import routes from '@/libs/routes';
import getRequest from './getRequest';

const providers: Provider[] = [
  CredentialsProvider({
    id: 'credentials',
    name: 'Credentials',
    credentials: {
      username: { label: 'Username', type: 'text' },
      email: { label: 'Email', type: 'text' },
      password: { label: 'Password', type: 'password' },
      isNewUser: { label: 'New User', type: 'checkbox' }
    },
    async authorize(credentials: any) {
      const { email, password, username, isNewUser } = credentials;

      const response =
        isNewUser === 'true' ? await signUp({ email, password, username }) : await login({ username, password });
      if ('errors' in response) throw new Error(JSON.stringify(response));

      return response as any as User;
    }
  })
];

const nextAuthOptions: NextAuthOptions = {
  providers: providers,
  callbacks: {
    async jwt({ token, user, account }: { token: JWT; user: User; account: Account | null }) {
      if (user) {
        token.accessToken = account?.access_token!;
        token.refreshToken = account?.refresh_token!;
        token.user = user;
        token.expiry = Date.now() + Number(user?.expiresIn);
      }

      if (token.expiry && Date.now() < token.expiry - 300000) {
        return token;
      }

      const response = await refreshAuthToken();
      if ('errors' in response) {
        token.error = 'Failed to refresh token';
        return token;
      }

      const { accessToken, refreshToken, ...rest } = response;
      token.accessToken = accessToken;
      token.refreshToken = refreshToken;
      token.expiry = Date.now() + Number(rest?.expiresIn);
      token.user = rest as any;

      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      session.user = token.user;

      return session;
    },
    async signIn({ user, account }: { user: any; account: Account | null }) {
      if (!user) {
        return false;
      }
      account!.access_token = user.accessToken;
      account!.refresh_token = user.refreshToken;
      account!.expiry = user.expiry;
      delete (user as any)?.accessToken;
      delete (user as any)?.refreshToken;

      return true;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: routes.login,
    error: routes.login
  },
  session: {
    // default to 30 days
    maxAge: Number(process.env.NEXTAUTH_SESSION_MAX_AGE ?? 30 * 24 * 60 * 60)
  }
};

const getSession = async (): Promise<Session | null> => {
  // const req = await getRequest();
  const session = await getServerSession(nextAuthOptions);
  return session;
};

const getServerActionSession = async (): Promise<Session | null> => {
  const req = await getRequest();
  const session = await getServerSession({ req } as any);
  return session as Session | null;
};

export { nextAuthOptions, getSession, getServerActionSession };