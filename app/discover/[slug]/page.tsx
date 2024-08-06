import React from 'react';
import { Metadata, NextPage } from 'next';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { getDiscoverType } from '@/server/tmdbActions';
import SearchResults from '@/components/SearchResults';
import NotFound from '@/components/common/NotFound';
import MediaType from '@/types/tmdb/IMediaType';
import { getTopAiring, mostPopular, trending, upcomingTvShows } from '@/utils/tmdbQueries';
import countries from '@/libs/countries';

interface PageProps {
  params: { slug: string };
  searchParams: { [key: string]: string };
}

const mapping = {
  popular: { title: 'Most Popular Dramas', params: mostPopular },
  upcoming: { title: 'Top Upcoming Dramas', params: upcomingTvShows },
  airing: { title: 'Currently Airing Dramas', params: getTopAiring }
};

const default_map = { title: 'Discover Drama', params: trending };

const getData = (slug: string) => {
  return mapping[slug as keyof typeof mapping] || default_map;
};
export const generateMetadata = async ({ params: { slug }, searchParams }: PageProps): Promise<Metadata> => {
  const { title } = getData(slug);
  if (slug !== 'airing') return { title };
  const origin_country = searchParams?.country ?? 'KR';
  const name = countries.find((country) => country.code === origin_country)?.fullName ?? origin_country;
  return { title: `${title} in ${name}` };
};
const DiscoverMediaPage: NextPage<PageProps> = async ({ params: { slug }, searchParams }) => {
  const data = slug in mapping ? mapping[slug as keyof typeof mapping] : default_map;
  const country = searchParams?.country ?? 'KR';
  const params = slug === 'airing' ? (data as any).params(country) : data.params;
  const title =
    slug === 'airing'
      ? `${data.title} in ${countries.find((c) => c.code === country)?.fullName ?? country}`
      : data.title;
  const response = await getDiscoverType(MediaType.tv, params);
  if (response.total_results === 0) {
    return <NotFound />;
  }
  return (
    <Box
      sx={{
        padding: { xs: 0, md: 4 },
        marginX: 2,
        marginTop: 4,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'Center'
      }}
    >
      <Box sx={{ width: { xs: '100%', md: '60%' } }}>
        <Typography marginBottom={2}>
          {`${response.total_results} results found for `}
          <Typography component={'span'} fontWeight={500}>
            {title}
          </Typography>
        </Typography>
        <SearchResults {...response} />
      </Box>
    </Box>
  );
};

export default DiscoverMediaPage;