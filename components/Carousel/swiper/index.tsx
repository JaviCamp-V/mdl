'use client';

import React from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { A11y, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useMediaQuery, useTheme } from '@mui/material';
import Box from '@mui/material/Box';

interface CarouselProps {
  children: React.ReactNode[];
}
const Carousel: React.FC<CarouselProps> = ({ children }) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('xs'));
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const isLaptop = useMediaQuery(theme.breakpoints.up('lg'));
  const getSlidesPerView = () => {
    if (isSmall) return 2;
    if (isMobile) return 2;
    if (isTablet) return 3;
    return 4;
  };

  return (
    <Box
      sx={{
        position: 'relative',
        '& .swiper-button-next, & .swiper-button-prev': {
          display: 'none!important'
        },
        '&:hover .swiper-button-next, &:hover .swiper-button-prev': {
          display: 'block!important'
        }
      }}
    >
      <Swiper spaceBetween={15} slidesPerView={getSlidesPerView()} navigation modules={[Navigation, A11y]}>
        {children.map((child, index) => (
          <SwiperSlide key={`swiper-${index + 1}`}>{child}</SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};

export default Carousel;