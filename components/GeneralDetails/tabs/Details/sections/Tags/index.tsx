import routes from '@/libs/routes';
import { getTags } from '@/server/tmdb2Actions';
import MediaType from '@/types/tmdb/IMediaType';
import { Box, Typography } from '@mui/material';
import Link from 'next/link';
import React from 'react'

interface TagsProps {
    id: number;
    mediaType: MediaType.movie | MediaType.tv;    
}
const Tags:React.FC<TagsProps> = async({id, mediaType}) => {
    const tags = await getTags(mediaType, id);
    return (
      <Box sx={{ display: 'inline', whiteSpace: "pre-line" }}>
        {tags?.map((tag, index, arr) => (
          <React.Fragment key={tag.id}>
            <Link key={tag.id} href={`${routes.search}?keywords=${tag.name}`} style={{textDecoration: 'none'}}>
              <Typography
                sx={{ display: 'inline',}}
                color="primary"
                textTransform="capitalize"
              >
                {tag.name}
              </Typography>
            </Link>
            {index < arr.length - 1 && (
              <Typography sx={{ display: 'inline', marginRight: 1 }} color="#ffF">
                ,
              </Typography>
            )}
          </React.Fragment>
        ))}
      </Box>
    );
}

export default Tags