import { Account, NextAuthOptions, Session, User } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
import { Provider } from 'next-auth/providers/index';
import { isErrorResponse } from '@/utils/handleError';
import logger from '@/utils/logger';
import routes from '@/libs/routes';
import { getAccount, login, refreshAuthToken, signUp } from '../services/authService';

const providers: Provider[] = [
  CredentialsProvider({
    id: 'credentials',
    name: 'Credentials',
    credentials: {
      username: { label: 'Username', type: 'text' },
      email: { label: 'Email', type: 'text' },
      password: { label: 'Password', type: 'password' },
      isNewUser: { label: 'New User', type: 'checkbox' },
      rememberMe: { label: 'Remember Me', type: 'checkbox' }
    },
    async authorize(credentials: any) {
      const { email, password, username, isNewUser, rememberMe } = credentials;

      const response =
        isNewUser === 'true' ? await signUp({ email, password, username }) : await login({ username, password });
      if ('errors' in response) throw new Error(JSON.stringify(response));

      const account = await getAccount(response.accessToken);
      if ('errors' in account) throw new Error(JSON.stringify(account));

      return { ...response, ...account, rememberMe: rememberMe === 'true' } as any as User;
    }
  })
];

const nextAuthOptions: NextAuthOptions = {
  providers: providers,
  callbacks: {
    async jwt({ token, user, account, trigger }) {
      if (user) {
        token.accessToken = account?.access_token;
        token.refreshToken = account?.rememberMe ? account?.refresh_token : null;
        token.deviceID = account?.deviceID as any;
        token.rememberMe = account?.rememberMe as any;
        token.user = user;
        token.expiry = Date.now() + Number(account?.expiresIn);
      }

      // update user account if session update is triggered
      if (trigger === 'update' && token.accessToken) {
        const accountResponse = await getAccount(token.accessToken);
        token.user = isErrorResponse(accountResponse)
          ? { ...token.user, authError: accountResponse.message }
          : (accountResponse as User);
      }

      // offset expiry time by 3 minutes
      if (token.expiry && Date.now() < token.expiry - 180000) {
        return token;
      }

      // refresh token
      if (!token.refreshToken) {
        token.user.authError = 'Token expired';
        return token;
      }

      const response = await refreshAuthToken(token.refreshToken);
      if (isErrorResponse(response)) {
        token.user.authError = "Can't refresh token";
        return token;
      }

      const { accessToken, expiresIn } = response;
      token.accessToken = accessToken;
      token.expiry = Date.now() + Number(expiresIn);
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
      account!.expiresIn = user.expiresIn;
      account!.deviceID = user.deviceID;
      account!.rememberMe = user.rememberMe;
      delete user?.accessToken;
      delete user?.refreshToken;
      delete user?.deviceID;
      delete user?.rememberMe;
      delete user?.tokenType;
      delete user?.expiresIn;

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