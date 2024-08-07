import React from 'react';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import MediaType from '@/types/tmdb/IMediaType';

interface NotFoundProps {
  type?: MediaType;
}

const NotFound: React.FC<NotFoundProps> = ({ type }) => {
  return (
    <Box
      sx={{
        padding: { xs: 0, md: 4 },
        height: '100vh',
        marginX: 2,
        marginTop: 4,
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      <Box
        sx={{
          marginTop: 4,
          backgroundColor: 'background.paper',
          borderRadius: 2,
          overflow: 'hidden',
          width: { xs: '100%', md: '60%' },
          height: 'max-content',
          padding: 2
        }}
      >
        <Typography fontSize={16} paddingBottom={2}>
          {`There were no result matching the ${type ?? 'query'}.`}
        </Typography>
        <Typography fontSize={16} fontWeight={700} color="primary.main">
          {`${!type ? 'Search' : ''} Suggestions: `}
        </Typography>
        <Box component={'ul'} sx={{ marginTop: 1 }}>
          <Typography component={'li'} fontSize={16}>
            {type ? 'Make sure yare using the correct URL ' : 'Make sure all words are spelled correctly'}
          </Typography>
          <Typography component={'li'} fontSize={16}>
            {type ? 'Return to home page or try searching for what you trying to access' : 'Try more general keywords'}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default NotFound;
