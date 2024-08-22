import { Account, NextAuthOptions, Session, User } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
import { Provider } from 'next-auth/providers/index';
import logger from '@/utils/logger';
import routes from '@/libs/routes';
import { login, refreshAuthToken, signUp } from '../services/authService';

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
        token.accessToken = account?.access_token;
        token.refreshToken = account?.refresh_token;
        token.user = user;
        token.expiry = Date.now() + Number(user?.expiresIn);
      }

      if (token.expiry && Date.now() < token.expiry - 300000) {
        return token;
      }

      try {
        const response = await refreshAuthToken();
        const { accessToken, refreshToken, ...rest } = response;
        token.accessToken = accessToken;
        token.refreshToken = refreshToken;
        token.expiry = Date.now() + Number(rest?.expiresIn);
        token.user = rest as any;
      } catch (error: any) {
        const message = error?.response?.data?.message ?? error?.message;
        logger.error(`Error refreshing token: ${message}`);
        token.user.authError = "Can't refresh token";
      }

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
      delete user?.accessToken;
      delete user?.refreshToken;

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

export default nextAuthOptions;
