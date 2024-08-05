'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import 'react-multi-carousel/lib/styles.css';
import LoadingSkeleton from '../../common/LoadingSkeleton';

const MultiCarousel = dynamic(() => import('react-multi-carousel'), {
  loading: () => <LoadingSkeleton width="100%" height={'30vh'} />
});

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4,
    slidesToSlide: 4 // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 3,
    slidesToSlide: 3 // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 2,
    slidesToSlide: 2 // optional, default to 1.
  }
};

type CarouselProps = {
  children: React.ReactNode[];
};
const Carousel: React.FC<CarouselProps> = ({ children }) => {
  return (
    <MultiCarousel
      swipeable={false}
      draggable={false}
      ssr={true} // means to render carousel on server-side.
      responsive={responsive}
      infinite={true}
      customTransition="all .5"
      partialVisible={false}
      containerClass="carousel-container"
      itemClass="carousel-item-padding-20-px"
    >
      {children}
    </MultiCarousel>
  );
};

export default Carousel;
