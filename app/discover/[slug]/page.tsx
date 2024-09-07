import React from 'react';
import { Metadata, NextPage } from 'next';
import AdvancedSearchForm from '@/features/media/components/forms/AdvancedSearch';
import SearchResults from '@/features/media/components/lists/SearchResults';
import { getDiscoverType } from '@/features/media/service/tmdbService';
import { getTopAiring, mostPopular, trending, upcomingTvShows } from '@/features/media/utils/tmdbQueries';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import NotFound from '@/components/common/NotFound';
import MediaType from '@/types/enums/IMediaType';
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
  const response = await getDiscoverType(MediaType.tv, params, true);

  return (
    <Box
      sx={{
        padding: { xs: 2, md: 4 },
        marginX: 2,
        marginTop: 4,
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: 'flex-start',
        justifyContent: 'center',
        gap: 4
      }}
    >
      <Box id="search-results" sx={{ width: { xs: '100%', md: '70%' }, order: { xs: 2, md: 1 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
          <Typography fontWeight={700}>{title}</Typography>
          <Typography>{`${response.total_results} results`}</Typography>
        </Box>

        <SearchResults {...response} />
      </Box>
      <Box sx={{ width: { xs: '100%', md: '25%' }, order: { xs: 1, md: 2 } }}>
        <AdvancedSearchForm />
      </Box>
    </Box>
  );
};

export default DiscoverMediaPage;
