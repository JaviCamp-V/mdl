import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Box from '@mui/material/Box';
import MediaType from '@/types/tmdb/IMediaType';

interface PosterProps {
  src: string | null;
  id: number | string;
  size?: 'w45' | 'w185' | 'w300' | 'w342' | 'w500' | 'original';
  mediaType: MediaType | 'photo' | 'episode' | 'profile';
  priority?: boolean;
  overlay?: React.ReactNode;
  noRadius?: boolean;
}
const DramaPoster: React.FC<PosterProps> = ({
  src,
  id,
  size = 'w500',
  mediaType,
  priority = true,
  overlay,
  noRadius
}) => {
  const path = src ? `https://image.tmdb.org/t/p/${size}${src}` : '/static/images/no_poster.jpg';
  return (
    <Link href={`/${mediaType}/${id}`} passHref>
      <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
        <Image
          src={path}
          alt={id?.toString()}
          style={{
            width: '100%', // equivalent to size-full
            borderRadius: noRadius ? '0' : '0.175rem', // equivalent to rounded-md
            backgroundColor: 'var(--muted-color)', // equivalent to bg-muted
            objectFit: 'fill' // equivalent to object-cover
          }}
          fill
          priority={priority}
          unoptimized
        />
        {overlay && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.6)'
            }}
          >
            {overlay}
          </Box>
        )}
      </Box>
    </Link>
  );
};

export default DramaPoster;
