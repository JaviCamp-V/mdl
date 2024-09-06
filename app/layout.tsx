import dynamic from 'next/dynamic';
import { Metadata } from 'next/types';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { ThemeProvider as NextThemeProvider } from 'next-themes';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import MainLayout from '@/components/layout';
import HeartBeatWrapper from '@/components/wrapper/HeartBeatWrapper';
import NextAuthSessionProvider from '@/components/wrapper/NextAuthSessionProvider';
import NonStickSnackbarProvider from '@/components/wrapper/NonStickSnackbarProvider';
import { getServerActionSession, getSession } from '@/utils/authUtils';


// TODO: Find another theme solution/ there is a lag when looading the page
const MuiThemeProvider = dynamic(() => import('@/components/wrapper/MuiThemeProvider'), { ssr: false });

export const metadata: Metadata = {
  title: { default: 'MyDramaList', template: `%s - MyDramaList` },
  description: 'Idle cloning of mdl site',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png'
  }
};

type Props = { children: React.ReactNode };
const RootLayout: React.FC<Props> = async ({ children }) => {
  const session = await getServerActionSession();
  return (
    <html lang="en" suppressHydrationWarning>
      <body style={{ margin: 0, padding: 0 }}>
        <NextAuthSessionProvider session={session}>
          <NextThemeProvider attribute="class" defaultTheme="system" enableSystem={false}>
            <AppRouterCacheProvider options={{ enableCssLayer: true }}>
              <MuiThemeProvider>
                <NonStickSnackbarProvider>
                  <MainLayout>
                    <HeartBeatWrapper>{children}</HeartBeatWrapper>
                  </MainLayout>
                </NonStickSnackbarProvider>
              </MuiThemeProvider>
            </AppRouterCacheProvider>
          </NextThemeProvider>
        </NextAuthSessionProvider>
      </body>
    </html>
  );
};

export default RootLayout;