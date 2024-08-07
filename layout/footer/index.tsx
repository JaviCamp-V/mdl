import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Iconify from '@/components/Icon/Iconify';
import ThemeButtons from '@/components/ThemeButtons';
import model from '../model';

interface FooterProps {}
const Footer: React.FC<FooterProps> = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 4,
        backgroundColor: 'secondary.main',
        color: '#fff!important',
        paddingTop: 4,
        paddingBottom: 4,
        paddingX: { xs: 2, sm: 4, md: 6, lg: 8 }
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
        <Box>
          <Link href="/" passHref>
            <Image src={model.logo} width={160} height={30} alt="Footer logo" priority={true} />
          </Link>
          <Typography sx={{ opacity: 0.6 }}>
            &copy; {`${new Date().getFullYear().toString()} ${model.name}, LLC`}
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: 0.5,
            justifyContent: 'flex-start',
            alignItems: 'center'
          }}
        >
          {Object.entries(model.socialMedia).map(([social, link]) => (
            <Link key={social} href={link} target="_blank">
              <Box
                sx={{
                  borderRadius: '50%',
                  backgroundColor: '#313347',
                  padding: 0.5,
                  color: '#fff',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Iconify icon={`mdi:${social}`} fontSize={20} />
              </Box>
            </Link>
          ))}
        </Box>
        {Object.entries(model.download).map(([store, link]) => (
          <Box
            key={store}
            sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: 1,
              justifyContent: 'center',
              alignItems: 'center',
              border: '1px solid #424242',
              borderRadius: '25px',
              height: 50,
              maxWidth: 200,
              padding: '0 18px',
              pointerEvents: 'auto',
              pointer: 'cursor',
              '&:hover': {
                border: '1px solid #fff'
              }
            }}
          >
            <Link href={link} target="_blank">
              <Image
                src={store === 'ios' ? '/static/images/appstore_logo.webp' : '/static/images/googleplay_logo.webp'}
                width={30}
                height={30}
                alt={store}
              />
            </Link>
            <Box>
              <Typography
                sx={{
                  opacity: 0.6,
                  fontSize: 14,
                  color: '#fff',
                  whiteSpace: 'nowrap',
                  textDecoration: 'none!important'
                }}
              >
                Download the App
              </Typography>
              <Typography
                sx={{
                  fontSize: 16,
                  color: '#fff',
                  lineHeight: '16px',
                  fontWeight: 500,
                  marginTop: 0.2,
                  textDecoration: 'none!important'
                }}
              >
                {store === 'ios' ? 'App Store' : 'Google Play'}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>

      {model.footerLinks.map((section, index) => (
        <Box key={`footer-column-${index + 2}`} sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
          {Object.entries(section).map(([section, links]) => (
            <Box key={section} sx={{ marginBottom: 2 }}>
              <Typography fontWeight={700} marginBottom={1} textTransform="uppercase" fontSize={14} whiteSpace="nowrap">
                {section}
              </Typography>
              {section === 'Dark Mode' ? (
                <ThemeButtons />
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {links.map((item: { label: string; href: string }) => (
                    <Link key={item.label} href={item.href} style={{ textDecoration: 'none' }}>
                      <Typography sx={{ color: '#fff', textDecoration: 'none' }} fontSize={14} fontWeight={400}>
                        {item.label}
                      </Typography>
                    </Link>
                  ))}
                </Box>
              )}
            </Box>
          ))}
        </Box>
      ))}

      {/* {about.map((item) => (
          <Link key={item.label} href={item.href} style={{ textDecoration: 'none' }}>
            <Typography sx={{ color: '#fff', textDecoration: 'none' }}>{item.label}</Typography>
          </Link>
        ))}
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
        <Typography fontWeight={700} marginBottom={1} textTransform="uppercase" fontSize={16} whiteSpace="nowrap">
          Dark Mode
        </Typography>

        <ThemeButtons />

        <Typography fontWeight={700} marginBottom={1} marginTop={2} textTransform="uppercase" fontSize={16}>
          Work With Us
        </Typography>
        {workWithUs.map((item) => (
          <Link key={item.label} href={item.href} style={{ textDecoration: 'none' }}>
            <Typography sx={{ color: '#fff' }}>{item.label}</Typography>
          </Link>
        ))}
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
        <Typography fontWeight={700} marginBottom={1} textTransform="uppercase" fontSize={16} whiteSpace="nowrap">
          Recommendations
        </Typography>
        {recommendations.map((item) => (
          <Link key={item.label} href={item.href} style={{ textDecoration: 'none' }}>
            <Typography sx={{ color: '#fff' }}>{item.label}</Typography>
          </Link>
        ))} */}
    </Box>
  );
};

export default Footer;
