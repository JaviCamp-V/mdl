import DramaPoster from '@/components/Poster';
import { MediaRequest } from '@/types/tmdb/IGenericRequest'
import MediaType from '@/types/tmdb/IMediaType';
import { Credits as CreditsProps } from '@/types/tmdb/IPeople'
import { Grid } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import React from 'react'

const CastOverview: React.FC<CreditsProps & {type: MediaType}> =  ({ id, cast, crew,  type}) => {
  return (
    <Box sx={{ paddingY: 2 }}>
      <Typography paddingX={2} fontSize={18} fontWeight={500} lineHeight={1}>
        Cast & Credits
      </Typography>
      <Box sx={{ borderTop: '1px solid hsla(210, 8%, 51%, .13)', marginY: 2 }} />
      <Grid container spacing={2} paddingX={2} sx={{ minHeight: '35vh' }}>
        {cast?.slice(0, 6).map((person) => (
          <Grid
            item
            key={person.id}
            xs={12}
            sm={6}
            md={4}
            sx={{ display: 'flex', flexDirection: 'row', gap: 2, paddingY: 2 }}
          >
            <Box sx={{ width: '35%', height: { xs: '25vh', sm: '20vh' } }}>
              <DramaPoster src={person.profile_path} id={person.id} mediaType={MediaType.person} size="w185" />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0, width: '60%', height: '100%' }}>
              <Link href={`/person/${person.id}`} passHref style={{ textDecoration: 'none' }}>
                <Typography color="primary" fontWeight={500}>
                  {person.name}
                </Typography>
              </Link>
              <Typography fontSize={12}>{person.character}</Typography>
              <Typography fontSize={12} color="#818a91" sx={{ opacity: 0.6 }}>
                {person.order < 4 ? 'Main Role' : 'Supporting Role'}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ borderBottom: '1px solid hsla(210, 8%, 51%, .13)', marginY: 1 }} />
      <Box paddingX={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Link href={`/${type}/${id}?tab=credits`} passHref style={{ textDecoration: 'none' }}>
          <Typography color="primary">{`View all (${cast?.length + crew?.length || 0})`}</Typography>
        </Link>
      </Box>
    </Box>
  );
};

export default CastOverview