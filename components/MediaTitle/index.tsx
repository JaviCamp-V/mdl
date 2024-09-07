import React from 'react';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';


interface MediaTitleProps {
  title: string;
  id: number;
  mediaType: string;
  fontSize?: number | string;
  fontWeight?: number | string;
  whiteSpace?: 'nowrap' | 'normal' | 'pre' | 'pre-line' | 'pre-wrap';
}
const MediaTitle: React.FC<MediaTitleProps> = ({
  mediaType,
  id,
  title,
  fontSize,
  fontWeight = 700,
  whiteSpace = 'nowrap'
}) => {
  return (
    <Link href={`/${mediaType}/${id}`} passHref style={{ textDecoration: 'none', fontSize, whiteSpace }}>
      <Typography color="primary" fontSize={fontSize} fontWeight={fontWeight} sx={{ whiteSpace }}>
        {title}
      </Typography>
    </Link>
  );
};

export default MediaTitle;