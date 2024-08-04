import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import MediaType from '@/types/tmdb/IMediaType';
import Box from '@mui/material/Box';

interface PosterProps {
  src: string | null;
  id: number | string;
  size?: 'w45' | 'w185' | 'w300' | 'w342' | 'w500' | 'original';
  mediaType: MediaType | 'photo' | 'episode';
  priority?: boolean;
}
const DramaPoster: React.FC<PosterProps> = ({ src, id, size = 'w500', mediaType, priority = true }) => {
   const path = src ? `https://image.tmdb.org/t/p/${size}${src}` : '/static/images/no_poster.jpg'
  return (
    <Link href={`/${mediaType}/${id}`} passHref>
      <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
        <Image
          src={path}
          alt={id.toString()}
          style={{
            width: '100%', // equivalent to size-full
            borderRadius: '0.175rem', // equivalent to rounded-md
            backgroundColor: 'var(--muted-color)', // equivalent to bg-muted
            objectFit: 'cover' // equivalent to object-cover
          }}
          fill
          priority={priority}
          unoptimized
        />
      </Box>
    </Link>
  );
};

export default DramaPoster;
