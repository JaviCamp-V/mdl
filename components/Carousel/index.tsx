'use client';

import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import Box from '@mui/material/Box';

interface CarouselProps {
  children: React.ReactNode[];
}

const config = {
  dots: false,
  infinite: true,
  className: 'center',
  centerMode: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 3,
  centerPadding: '60px',
  initialSlide: 0,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3
      }
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        initialSlide: 2
      }
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }
  ]
};
const Carousel: React.FC<CarouselProps> = ({ children }) => {
  return (
    <Box className="slider-container" sx={{ marginX: 2.5, paddingX: 0 }}>
      <Slider {...config}>{children}</Slider>
    </Box>
  );
};

export default Carousel;
