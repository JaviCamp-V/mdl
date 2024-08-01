"use client";
import React from 'react';
import MultiCarousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 8
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 8
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 4
  },
};

type CarouselProps = {
  children: React.ReactNode[];
};
const Carousel: React.FC<CarouselProps> = ({ children }) => {
  return <MultiCarousel responsive={responsive}>{children}</MultiCarousel>;
};

export default Carousel;
