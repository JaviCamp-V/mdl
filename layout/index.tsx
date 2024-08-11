import React from 'react';
import { Session } from 'next-auth';
import { Paper } from '@mui/material';
import Footer from './footer';
import Navbar from './navbar';

interface MainLayoutProps {
  children?: React.ReactNode;
  session?: Session | null;
}
const MainLayout: React.FC<MainLayoutProps> = ({ children, session }) => {
  return (
    <React.Fragment>
      <Navbar session={session} />
      <Paper
        sx={{
          backgroundColor: 'background.default',
          color: 'text.primary',
          paddingTop: 8,
          borderRadius: 0,
          paddingBottom: 4
        }}
      >
        {children}
      </Paper>
      <Footer />
    </React.Fragment>
  );
};

export default MainLayout;