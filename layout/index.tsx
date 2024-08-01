import { Box, Paper } from '@mui/material';
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
      <Paper sx={{ backgroundColor: '#18191A', color: "#fff!important", paddingTop: 8}}> {children}</Paper>

      <Footer />
    </React.Fragment>
  );
};

export default MainLayout;
