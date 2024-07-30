import { Box } from '@mui/material';
import React from 'react';
import Navbar from './navbar';
import Footer from './footer';

interface MainLayoutProps {
    children?: React.ReactNode;
}
const MainLayout: React.FC<MainLayoutProps> = ({children}) => {
  return (
    <React.Fragment>
      <Navbar />
      {children}
      <Footer />
    </React.Fragment>
  );
};

export default MainLayout;
