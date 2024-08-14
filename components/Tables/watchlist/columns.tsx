'use client';

import React from 'react';
import { capitalCase } from 'change-case';
import { Box, Typography } from '@mui/material';
import EditWatchlistButton from '@/components/Buttons/EditWatchlistButton';
import MediaCardToolTip from '@/components/MediaCardToolTip';
import MediaTitle from '@/components/MediaTitle';
import Ratings from '@/components/common/Ratings';
import { DataColumn } from '@/components/common/Table';
import countries from '@/libs/countries';

const columns: DataColumn[] = [
  {
    field: 'title',
    headerName: 'Title',
    justifyContent: 'left',
    sx: { textAlign: 'left' },
    render: (values) => (
      <Box>
        <Box sx={{ display: 'flex', gap: 0.5, flexDirection: 'row', alignItems: 'center' }}>
          <MediaCardToolTip
            title={values.title}
            year={values.year}
            originalTitle={values.originalTitle}
            country={values.country}
            mediaType={values.mediaType}
            posterPath={values.posterPath}
            id={values.mediaId}
            voteAverage={values.rating}
            overview={values.overview}
            genres={values.genres}
          >
            <span>
              <MediaTitle
                title={values.title}
                id={values.mediaId}
                mediaType={values.mediaType.toLowerCase()}
                fontSize={14}
                fontWeight={600}
              />
            </span>
          </MediaCardToolTip>
          {values.isAiring && (
            <Box sx={{ backgroundColor: '#6cc788', color: '#fff', paddingX: 0.2, borderRadius: '4px' }}>
              <Typography fontSize={10}>airing</Typography>
            </Box>
          )}
        </Box>
        <Typography fontSize={14} sx={{ opacity: 0.6, display: { xs: 'block', md: 'none' } }}>
          {`${countries.find((country) => country.code === values.country)?.nationality ?? values.country} ${values.mediaType === 'TV' ? 'Drama' : 'Movie'}`}
        </Typography>
      </Box>
    )
  },
  {
    field: 'edit',
    headerName: '',
    sx: { textAlign: 'left', display: { xs: 'none', md: 'table-cell' } },
    render: (values) => (
      <EditWatchlistButton
        type={values.mediaType.toLowerCase()}
        id={values.mediaId}
        recordId={values.id}
        icon={<Typography fontSize={12}>edit</Typography>}
      />
    )
  },
  {
    field: 'country',
    headerName: 'Country',
    format: (value) => countries.find((country) => country.code === value)?.fullName ?? value,
    sx: { textAlign: 'center', justifyContent: 'center', display: { xs: 'none', md: 'table-cell' } }
  },
  { field: 'year', headerName: 'Year', sx: { textAlign: 'center', display: { xs: 'none', md: 'table-cell' } } },
  {
    field: 'mediaType',
    headerName: 'Type',
    sx: { display: { xs: 'none', md: 'table-cell' } },
    format: (value) => capitalCase(value === 'TV' ? 'drama' : value)
  },
  { field: 'rating', headerName: 'Score', render: (values) => <Ratings rating={values.rating} showText /> },
  {
    field: 'episodeWatched',
    headerName: 'Progress',
    format: (_, values) => `${values.episodeWatched}/${values.totalEpisodes}`
  }
];

export default columns;
