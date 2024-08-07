import React from 'react';
import { Grid, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import MediaType from '@/types/tmdb/IMediaType';
import PersonDetailsType from '@/types/tmdb/IPeople';
import DramaPoster from '../Poster';
import Socials from '../Socials';
import BioData from './BioData';
import Roles from './Roles';

const PersonDetails: React.FC<PersonDetailsType> = (props) => {
  const { biography, id } = props;
  const color = 'hsl(0deg 0% 100% / 87%)';
  return (
    <Box
      sx={{
        marginTop: 4,
        backgroundColor: '#242526',
        borderRadius: 2,
        overflow: 'hidden',
        minHeight: '50vh'
      }}
    >
      <Box sx={{ width: '100%', paddingY: 2 }}>
        <Box sx={{}}>
          <Typography fontSize={18} fontWeight={700} paddingLeft={2}>
            Details
          </Typography>
          <Box
            sx={{
              borderBottom: '1px solid hsla(210, 8%, 51%, .13)',
              marginY: 1
            }}
          />

          <Grid container spacing={2} sx={{ padding: 2 }}>
            <Grid
              item
              xs={12}
              sm={4}
              md={0}
              sx={{
                display: { xs: 'flex', md: 'none' },
                flexDirection: 'column'
              }}
            >
              <Box
                sx={{
                  width: { xs: '90%', sm: '100%' },
                  height: { xs: '60vh', sm: '40vh' }
                }}
              >
                <DramaPoster src={props.profile_path} id={id} mediaType={MediaType.person} size="w185" />
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingX: 2
                }}
              >
                <Socials {...props.external_ids} />
              </Box>
            </Grid>
            <Grid item xs={12} sm={8} md={12}>
              <Box
                sx={{
                  display: { xs: 'flex', md: 'none' },
                  flexDirection: 'column',
                  gap: 1
                }}
              >
                <Typography fontSize={'1.25rem'} fontWeight={700} lineHeight={1} color="primary">
                  {props.name}
                </Typography>
                <BioData {...props} />
              </Box>
              <Typography color={'hsl(0deg 0% 100% / 87%)'}>{biography || 'No biography added'}</Typography>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ paddingLeft: 2 }}>
          <Roles id={id} />
        </Box>
      </Box>
    </Box>
  );
};

export default PersonDetails;
