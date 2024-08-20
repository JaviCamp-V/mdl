import React from 'react';
import Box from '@mui/material/Box';
import { getDiscoverType } from '@/server/tmdbActions';
import Carousel from '@/components/Carousel/swiper/index';
import DramaCard from '@/components/DramaCard';
import MediaType from '@/types/tmdb/IMediaType';

interface DramaCarouselSectionProps {
  type: MediaType.tv | MediaType.movie;
  params: URLSearchParams;
}
const DiscoverCarousel: React.FC<DramaCarouselSectionProps> = async ({ type, params }) => {
  const response = await getDiscoverType(type, params, false, false);
  return (
    <Box marginX={2} sx={{ minHeight: '30vh' }}>
      <Carousel>
        {response.results
          .filter((drama: any) => drama.poster_path)
          .map((drama: any) => (
            <DramaCard
              key={drama.id}
              title={drama.name || 'N/A'}
              country={drama?.origin_country?.join(', ') || 'N/A'}
              src={drama.poster_path}
              id={drama.id}
            />
          ))}
      </Carousel>
    </Box>
  );
};

export default DiscoverCarousel;