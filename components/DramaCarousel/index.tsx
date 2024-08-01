"use client"
import { ArrowLeft, ArrowRight } from '@mui/icons-material';
import React from 'react';
import Carousel from 'react-material-ui-carousel';

interface DramaCarouselProps {
  children: React.ReactNode[];
}

const DramaCarousel: React.FC<DramaCarouselProps> = ({ children }) => {
  return (
    <Carousel
      autoPlay={false}
      navButtonsAlwaysVisible={true}
      fullHeightHover={true} // We want the nav buttons wrapper to only be as big as the button element is
      navButtonsProps={{
        // Change the colors and radius of the actual buttons. THIS classes BOTH BUTTONS
        style: {
          color: '#95989A',
          backgroundColor: 'white',
          border: '#95989A',
          opacity: 0.9,
          marginTop: 0
        }
      }}
      NextIcon={<ArrowRight />}
      PrevIcon={<ArrowLeft />}
    >
      {children}
    </Carousel>
  );
};

export default DramaCarousel;
