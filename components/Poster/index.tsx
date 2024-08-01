import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import routes from '@/libs/routes';

interface PosterProps {
  src: string;
  id: number;
  width?: number;
  height?: number;
}
const DramaPoster: React.FC<PosterProps> = ({ src, id, width, height }) => {
  return (
    <Link href={routes.drama.replace(':id', id.toString())}>
      <Image src={`https://image.tmdb.org/t/p/w500/${src}`} alt="poster" width={width ?? 300} height={height ?? 200} />
    </Link>
  );
};

export default DramaPoster;
