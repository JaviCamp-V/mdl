import dynamic from 'next/dynamic';
import { Metadata } from 'next/types';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { ThemeProvider as NextThemeProvider } from 'next-themes';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import CssBaseline from '@mui/material/CssBaseline';
import MainLayout from '@/layout';

// TODO: Find another theme solution/ there is a lag when looading the page
const MuiThemeProvider = dynamic(() => import('@/wrapper/MuiThemeProvider'), { ssr: false });

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
const RootLayout: React.FC<Props> = ({ children }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body style={{ margin: 0, padding: 0 }}>
        <NextThemeProvider attribute="class" defaultTheme="system" enableSystem={false}>
          <AppRouterCacheProvider options={{ enableCssLayer: true }}>
            <MuiThemeProvider>
              <CssBaseline />
              <MainLayout>{children}</MainLayout>
            </MuiThemeProvider>
          </AppRouterCacheProvider>
        </NextThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
