import React from 'react';
import Link from 'next/link';
import { Credits } from '@/features/media/types/interfaces/People';
import { Grid } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MediaTitle from '@/components/MediaTitle';
import DramaPoster from '@/components/Poster';
import Divider from '@/components/common/Divider';
import MediaType from '@/types/enums/IMediaType';

const CastOverview: React.FC<Credits & { type: MediaType }> = ({ id, cast, crew, type }) => {
  return (
    <Box sx={{ paddingY: 2 }}>
      <Typography paddingX={2} fontSize={16} fontWeight={700} lineHeight={1}>
        Cast & Credits
      </Typography>

      <Divider />
      <Grid container spacing={2} paddingX={2} sx={{}}>
        {cast?.slice(0, 6).map((person) => (
          <Grid item key={person.id} xs={12} sm={6} md={4} sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
            <Box
              sx={{
                width: { xs: '30%', sm: '50%', md: '50%' },
                height: { xs: '15vh', sm: '20vh', md: '10vh', lg: '20vh' }
              }}
            >
              <DramaPoster src={person.profile_path} id={person.id} mediaType={MediaType.person} size="w185" />
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 0,
                width: { xs: '70%', sm: '50%', md: '50%' },
                height: '100%'
              }}
            >
              <MediaTitle title={person.name} id={person.id} mediaType={MediaType.person} fontSize={14} />
              <Typography fontSize={12}>{person.character}</Typography>
              <Typography fontSize={12} color="#818a91" sx={{ opacity: 0.6 }}>
                {person.order < 4 ? 'Main Role' : 'Supporting Role'}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
      <Divider />
      <Box paddingX={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Link href={`/${type}/${id}/credits`} passHref style={{ textDecoration: 'none' }}>
          <Typography
            color="primary"
            fontSize={14}
          >{`View all (${Number(cast?.length || 0) + Number(crew?.length || 0)})`}</Typography>
        </Link>
      </Box>
    </Box>
  );
};

export default CastOverview;
