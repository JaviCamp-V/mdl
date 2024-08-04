import { Metadata } from 'next/types';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import theme from '@/theme/index';
import MainLayout from '@/layout';

export const metadata: Metadata = {
  title: { default: 'MyDramaList', template: `%s - MyDramaList` },
  description: 'Idle cloning of mdl site',
  icons: {
    icon: '/favicon.ico',
  }
};

type Props = { children: React.ReactNode };
const RootLayout: React.FC<Props> = ({ children }) => {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <MainLayout>{children}</MainLayout>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
};

export default RootLayout;
