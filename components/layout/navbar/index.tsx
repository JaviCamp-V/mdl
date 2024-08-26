import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import SearchForm from '@/features/media/components/forms/Search';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container/Container';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import ExpandableMenuItem from '@/components/common/ExpandableMenuItem';
import model from '../model';
import SideBar from '../sidebar';
import AuthContent from './sections/auth_content';


interface NavbarProps {}
const Navbar: React.FC<NavbarProps> = () => {
  return (
    <AppBar sx={{ backgroundColor: '#00568C', zIndex: 100 }}>
      <Container maxWidth="xl" sx={{ paddingX: { xs: 0, md: 2 } }}>
        <Toolbar disableGutters>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              height: 60,
              marginX: { xs: 2, md: 4 }
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'left',
                alignItems: 'center'
              }}
            >
              <Box sx={{ marginRight: 4, display: { xs: 'none', md: 'flex' } }}>
                <Link href="/" passHref>
                  <Image src={model.logo} width={200} height={30} alt="Desktop logo" priority />
                </Link>
              </Box>
              <Box sx={{ marginRight: 4, display: { xs: 'flex', md: 'none' } }}>
                <Link href="/" style={{ textDecoration: 'none' }} passHref>
                  <Typography fontSize={22} fontWeight={700} sx={{ color: 'white', lineHeight: 0.8 }}>
                    {model.aberration}
                  </Typography>
                </Link>
              </Box>
              <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
                {Object.entries(model.navbarLinks).map(([label, links]) => (
                  <React.Fragment key={label}>
                    {(() => {
                      switch (true) {
                        case links.length > 1:
                          return <ExpandableMenuItem label={label} items={links} />;

                        case links.length === 1:
                          return (
                            <Link
                              href={links[0].href}
                              passHref
                              style={{ textDecoration: 'none', whiteSpace: 'nowrap' }}
                            >
                              <Typography
                                fontSize={13}
                                fontWeight={500}
                                textTransform="uppercase"
                                sx={{ color: 'white' }}
                              >
                                {label}
                              </Typography>
                            </Link>
                          );

                        default:
                          return <Box />;
                      }
                    })()}
                  </React.Fragment>
                ))}
              </Box>
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignItems: 'center',
                gap: 1.5,
                paddingY: 1
              }}
            >
              <SearchForm />

              <Box
                sx={{
                  border: '1px solid #fff',
                  borderRadius: 1,
                  cursor: 'pointer',
                  pointerEvents: 'auto',
                  padding: 1.2,
                  width: 12,
                  height: 12,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Typography fontSize={11} fontWeight={400} textTransform="lowercase" sx={{ color: 'white' }}>
                  EN
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'left',
                  alignItems: 'center',
                  gap: 1.5
                }}
              >
                <AuthContent />
              </Box>
              <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
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