import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container/Container';
import Toolbar from '@mui/material/Toolbar';
import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
import Box from '@mui/material/Box';
import ExpandableMenuItem from '@/components/ExpandableMenuItem';
import { Typography } from '@mui/material';
import SearchField from '@/components/RHFElements/SearchField';
import SideBar from '../sidebar';

interface NavbarProps {}
const Navbar: React.FC<NavbarProps> = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: { xs: '#00568C', md: '#00568C' } }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              height: 80,
              marginX: 2
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', alignItems: 'center' }}>
              <Box sx={{ marginRight: 4, display: { xs: 'none', md: 'flex' } }}>
                <Link href="/" passHref>
                  <Image
                    src="/static/images/mdl-logo.webp"
                    width={200}
                    height={60}
                    alt="Desktop logo"
                    priority={true}
                  />
                </Link>
              </Box>
              <Box sx={{ marginRight: 4, display: { xs: 'flex', md: 'none' } }}>
                <Link href="/" passHref>
                  <Image src="/static/images/images.png" width={60} height={60} alt="Mobile logo" priority={true} />
                </Link>
              </Box>
              <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3 }}>
                <ExpandableMenuItem
                  label="Home"
                  items={[
                    { label: 'Feeds', href: '#' },
                    { label: 'Articles', href: '#' },
                    { label: 'Feeds', href: '#' }
                  ]}
                />
                <ExpandableMenuItem
                  label="Explore"
                  items={[
                    { label: 'Top 100', href: '#' },
                    { label: 'Recommendation', href: '#' },
                    { label: 'Latest', href: '#' }
                  ]}
                />
                <ExpandableMenuItem
                  label="Community"
                  items={[
                    { label: 'Forums', href: '#' },
                    { label: 'Discussions', href: '#' },
                    { label: 'Reviews', href: '#' }
                  ]}
                />
                <Link href="/#" passHref style={{ textDecoration: 'none', whiteSpace: 'nowrap' }}>
                  <Typography fontSize={16} fontWeight={400} textTransform="uppercase" sx={{ color: 'white' }}>
                    calendar
                  </Typography>
                </Link>
              </Box>
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignItems: 'center',
                gap: 2,
                paddingY: 1
              }}
            >
              <SearchField name="search" placeholder="Find Asian Dramas, Movies, Actors and more..." fullWidth />

              <Box
                sx={{
                  border: '1px solid #fff',
                  borderRadius: 1,
                  cursor: 'pointer',
                  pointerEvents: 'auto',
                  padding: 1,
                  width: 12,
                  height: 12,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Typography fontSize={16} fontWeight={400} textTransform="uppercase" sx={{ color: 'white' }}>
                  EN
                </Typography>
              </Box>
              <Link href="/login" passHref style={{ textDecoration: 'none', whiteSpace: 'nowrap' }}>
                <Typography fontSize={16} sx={{ color: 'white' }}>
                  Sign Up
                </Typography>
              </Link>
              <Link href="/login" passHref style={{ textDecoration: 'none', whiteSpace: 'nowrap' }}>
                <Typography fontSize={16} sx={{ color: 'white' }} whiteSpace="nowrap">
                  Login
                </Typography>
              </Link>

              <Box sx={{ display: { xs: 'flex', md: 'none' } }} whiteSpace="nowrap">
                <SideBar />
              </Box>
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
