import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Iconify from '@/components/Icon/Iconify';
import ThemeButtons from '@/components/buttons/ThemeButtons';
import model from '../model';

interface FooterProps {}
const Footer: React.FC<FooterProps> = () => {
  return (
    <Box component="footer">
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 4,
          color: '#fff!important',
          paddingTop: 4,
          paddingBottom: 4,
          backgroundColor: 'secondary.main',
          paddingX: { xs: 2, md: 4, lg: 8 }
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{}}>
            <Link href="/" passHref>
              <Image src={model.logo} width={160} height={30} alt="Footer logo" priority />
            </Link>
            <Typography sx={{ opacity: 0.6 }} fontSize={13}>
              &copy; {`${new Date().getFullYear().toString()} ${model.name}, LLC.`}
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: 0.5,
              justifyContent: 'flex-start',
              alignItems: 'center',
              maxWidth: 200
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
                  <Iconify icon={`mdi:${social}`} width={16} height={16} />
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
                maxWidth: 200,
                justifyContent: 'center',
                alignItems: 'center',
                border: '1px solid #424242',
                borderRadius: 25,
                paddingY: 1,
                paddingX: 1.5,
                pointerEvents: 'auto',
                pointer: 'cursor',
                '&:hover': {
                  border: '1.5px solid hsl(0deg 0% 100% / 87%)'
                }
              }}
            >
              <Link href={link} target="_blank">
                <Image
                  src={store === 'ios' ? '/static/images/appstore_logo.webp' : '/static/images/googleplay_logo.webp'}
                  width={25}
                  height={25}
                  alt={store}
                />
              </Link>
              <Box>
                <Typography
                  sx={{
                    opacity: 0.6,
                    fontSize: 12,
                    color: '#fff',
                    whiteSpace: 'nowrap',
                    textDecoration: 'none!important'
                  }}
                >
                  Download on the
                </Typography>
                <Typography
                  sx={{
                    fontSize: 14,
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
          <Box key={`footer-column-${index + 2}`} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {Object.entries(section).map(([section, links]) => (
              <Box key={section} sx={{ marginBottom: 2 }}>
                <Typography
                  fontWeight={700}
                  marginBottom={1}
                  textTransform="uppercase"
                  fontSize={14}
                  whiteSpace="nowrap"
                >
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
      </Box>
    </Box>
  );
};

export default Footer;
