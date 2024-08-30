import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface NoSearchResultsProps {}

const NoSearchResults: React.FC<NoSearchResultsProps> = () => {
  return (
    <Box
      sx={{
        backgroundColor: 'background.paper',
        boxShadow: '0 1px 1px rgba(0,0,0,.1)',
        border: '1px solid rgba(0,0,0,.14)',
        borderRadius: 2,
        overflow: 'hidden',
        padding: 2,
        paddingX: { xs: 2, md: 4 },
        display: 'flex',
        flexDirection: 'column',
        gap: 1
      }}
    >
      <Typography fontSize={16} paddingBottom={2}>
        {`No results matched your search or filters`}
      </Typography>
      <Typography fontSize={16} fontWeight={700} color="primary.main">
        {'Here are some tips: '}
      </Typography>
      <Box component={'ul'} sx={{ marginTop: -1 }}>
        <Typography component={'li'} fontSize={16}>
          Double-check your spelling and filters
        </Typography>
        <Typography component={'li'} fontSize={16}>
         Try broader keywords or adjust your filters
        </Typography>
      </Box>
    </Box>
  );
};

export default NoSearchResults;
