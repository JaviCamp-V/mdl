import React from 'react';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface MediaTitleProps {
  title: string;
  id: number;
  mediaType: string;
  fontSize?: number;
}
const MediaTitle: React.FC<MediaTitleProps> = ({ mediaType, id, title, fontSize = '1rem' }) => {
  return (
    <Box>
      <Link href={`/${mediaType}/${id}`} passHref style={{ textDecoration: 'none' }}>
        <Typography
          color="primary"
          fontWeight={500}
          sx={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {title}
        </Typography>
      </Link>
    </Box>
  );
};

export default MediaTitle;
