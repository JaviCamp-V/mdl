import { color } from '@/libs/common';
import routes from '@/libs/routes';
import { getTags } from '@/server/tmdb2Actions';
import MediaType from '@/types/tmdb/IMediaType';
import { Box, Typography } from '@mui/material';
import { capitalCase } from 'change-case';
import Link from 'next/link';
import React from 'react'

interface TagsProps {
    id: number;
    mediaType: MediaType.movie | MediaType.tv;    
}
const Tags:React.FC<TagsProps> = async({id, mediaType}) => {
    const tags = await getTags(mediaType, id);
    return (
      <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
        <Typography color={color} fontWeight={500} paddingRight={1}>
          Tags:
        </Typography>
        {tags?.map((tag, index, arr) => (
          <React.Fragment key={tag.id}>
            <Link key={tag.id} href={`${routes.search}?keywords=${tag.name}`} style={{ textDecoration: 'none' }}>
              <Typography color="primary">{capitalCase(tag.name)}</Typography>
            </Link>
            {index < arr.length - 1 && (
              <Typography sx={{ marginRight: 1 }} color={color}>
                ,
              </Typography>
            )}
          </React.Fragment>
        ))}
      </Box>
    );
}

export default Tags