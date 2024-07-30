"use client"
import Box from '@mui/material/Box'
import Link from 'next/link';
import React from 'react'
import Image from 'next/image';
import { Button, IconButton, Typography } from '@mui/material';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import RssFeedIcon from '@mui/icons-material/RssFeed';
import YouTubeIcon from '@mui/icons-material/YouTube';
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

//ToDo: Server component friendly icons
interface FooterProps {}
const Footer:React.FC<FooterProps> = () => {
  const socials = [
    { icon: <TwitterIcon />, href: 'https://twitter.com/My_Drama_List' },
    { icon: <InstagramIcon />, href: 'https://www.instagram.com/mydramalist_official/' },
    { icon: <RssFeedIcon />, href: 'https://mydramalist.com/rss' },
    { icon: <YouTubeIcon />, href: 'https://www.youtube.com/user/MyDramaList' },
    { icon: <FacebookOutlinedIcon />, href: 'https://www.facebook.com/MyDramaListOfficial' }
  ];
  const about = [
    { label: 'FAQ', href: '#' },
    { label: 'About Us', href: '#' },
    { label: 'Contact', href: '#' },
    { label: 'Terms', href: '#' },
    { label: 'Privacy', href: '#' },
    { label: 'Support Us', href: '#' }
  ];

  const workWithUs = [
    { label: 'Advertise', href: '#' },
    { label: 'Jobs', href: '#' },
    {label: 'API', href: '#'}
  ];

  const recommendations = [
    { label: 'Recommendations', href: '#' },
    { label: 'Get Personalized Recommendations', href: '#' },
    { label: 'Top 100 Korean Dramas', href: '#' },
    { label: 'Top 100 Japanese Dramas', href: '#' },
    { label: 'Top 100 Chinese Dramas', href: '#' }
  ]
  const iconContainerStyle = {
    borderRadius: '50%',
    backgroundColor: '#313347',
    padding: 0.5,
    color: '#fff'
  };
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 4,
        backgroundColor: '#131313',
        color: '#fff!important',
        paddingTop: 4,
        paddingBottom: 6,
        paddingX: { xs: 2, sm: 4, md: 6, lg: 8 }
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
        <Link href="/" passHref>
          <Image src="/static/images/mdl-light-logo.webp" width={160} height={30} alt="Footer logo" priority={true} />
        </Link>
        <Typography>&copy; {`${new Date().getFullYear().toString()} MyDramaList, LLC`}</Typography>
        <Box
          sx={{ display: 'flex', flexDirection: 'row', gap: 0.5, justifyContent: 'flex-start', alignItems: 'center' }}
        >
          {socials.map((social, index) => (
            <Link key={index} href={social.href} target="_blank">
              <Box sx={{ borderRadius: '50%', backgroundColor: '#313347', padding: 0.5, color: '#fff' }}>
                {social.icon}
              </Box>
            </Link>
          ))}
        </Box>
        <Box
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
          <Image src="/static/images/appstore_logo.webp" width={30} height={30} alt="app store" />
          <Box>
            <Typography
              sx={{ opacity: 0.6, fontSize: 14, color: '#fff', whiteSpace: 'nowrap', textDecoration: 'none!important' }}
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
              App Store
            </Typography>
          </Box>
        </Box>
        <Box
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
          <Image src="/static/images/googleplay_logo.webp" width={30} height={30} alt="app store" />
          <Box>
            <Typography
              sx={{ opacity: 0.6, fontSize: 14, color: '#fff', whiteSpace: 'nowrap', textDecoration: 'none!important' }}
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
              Google Play
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
        <Typography fontWeight={500} marginBottom={1} textTransform="uppercase" fontSize={16} whiteSpace="nowrap">
          About
        </Typography>

        {about.map((item) => (
          <Link key={item.label} href={item.href} style={{ textDecoration: 'none' }}>
            <Typography sx={{ color: '#fff', textDecoration: 'none' }}>{item.label}</Typography>
          </Link>
        ))}
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
        <Typography fontWeight={500} marginBottom={1} textTransform="uppercase" fontSize={16} whiteSpace="nowrap">
          Dark Mode
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
          <IconButton sx={iconContainerStyle}>
            <DarkModeIcon sx={{ color: '#fff' }} />
          </IconButton>
          <IconButton sx={iconContainerStyle}>
            <LightModeIcon sx={{ color: '#fff' }} />
          </IconButton>
        </Box>

        <Typography fontWeight={500} marginBottom={1} marginTop={2} textTransform="uppercase" fontSize={16}>
          Work With Us
        </Typography>
        {workWithUs.map((item) => (
          <Link key={item.label} href={item.href} style={{ textDecoration: 'none' }}>
            <Typography sx={{ color: '#fff' }}>{item.label}</Typography>
          </Link>
        ))}
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
        <Typography fontWeight={500} marginBottom={1} textTransform="uppercase" fontSize={16} whiteSpace="nowrap">
          Recommendations
        </Typography>
        {recommendations.map((item) => (
          <Link key={item.label} href={item.href} style={{ textDecoration: 'none' }}>
            <Typography sx={{ color: '#fff' }}>{item.label}</Typography>
          </Link>
        ))}
      </Box>
    </Box>
  );
}

export default Footer