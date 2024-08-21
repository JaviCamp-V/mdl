import React from 'react';
import { Session } from 'next-auth';
import Paper from '@mui/material/Paper';
import Footer from './footer';
import Navbar from './navbar';

interface MainLayoutProps {
  children?: React.ReactNode;
}
const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <React.Fragment>
      <Navbar />
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
