import { cookies } from 'next/headers';
import { Metadata } from 'next/types';
import MuiThemeProvider from '@/wrapper/MuiThemeProvider';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { ThemeProvider as NextThemeProvider } from 'next-themes';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import CssBaseline from '@mui/material/CssBaseline';
import GlobalStyles from '@mui/material/GlobalStyles';
import MainLayout from '@/layout';
import theme from '@/theme';
import globalStyles from '@/theme/globalStyles';

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
