import React from 'react';
import ContentCategoryDetail from '@/features/media/components/ui/content/CategoryDetails';
import ExternalID from '@/features/media/types/interfaces/ExternalID';
import Genre from '@/features/media/types/interfaces/Genre';
import Network from '@/features/media/types/interfaces/Network';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import MediaDetailsProps from '@/types/common/MediaDetailsProps';
import WatchStatus from '@/types/enums/WatchStatus';
import MediaBackground from '../Background';
import ContentScore from '../ContentScore';
import Credits from '../Credits';
import MediaLinks from '../MediaLinks';
import MetaDetails from '../MetaDetails';
import ContentTitles from '../Title';

interface MainDetailsProps extends MediaDetailsProps {
  watchStatus: WatchStatus | null;
  recordId: number | null;
  poster_path: string | null;
  title: string;
  release_date: string | null;
  number_of_episodes: number;
  lastEpisodeType: string | null | undefined;
  genres: Genre[];
  external_ids: ExternalID;
  origin_country: string[];
  last_air_date: string | null | undefined;
  networks: Network[];
  runtime: number | number[];
  overview: string;
  vote_average: number;
  vote_count: number;
  number_of_watchers?: number;
  number_of_reviews?: number;
  recordRating: number | null;
  original_title: string | null;
}
const MainDetails: React.FC<MainDetailsProps> = ({
  mediaId,
  mediaType,
  watchStatus,
  recordId,
  poster_path,
  title,
  release_date,
  number_of_episodes,
  lastEpisodeType,
  genres,
  external_ids,
  origin_country,
  last_air_date,
  networks,
  runtime,
  overview,
  vote_average,
  vote_count,
  number_of_watchers,
  number_of_reviews,
  recordRating,
  original_title
}) => {
  return (
    <Grid container spacing={3} sx={{ width: '100%', paddingX: 2 }}>
      <Grid item xs={12} sm={5} md={4} sx={{}}>
        <MediaLinks
          poster_path={poster_path}
          external_ids={external_ids}
          watchStatus={watchStatus}
          recordId={recordId}
          runtime={runtime}
          title={title}
          release_date={release_date}
          number_of_episodes={number_of_episodes}
          lastEpisodeType={lastEpisodeType}
          mediaType={mediaType}
          mediaId={mediaId}
        />
      </Grid>
      <Grid item xs={12} sm={7} md={8} sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        <ContentScore
          vote_average={vote_average}
          vote_count={vote_count}
          number_of_reviews={number_of_reviews}
          number_of_watchers={number_of_watchers}
          recordRating={recordRating ?? 0}
        />
        <MediaBackground mediaId={mediaId} mediaType={mediaType} overview={overview} />
        <ContentTitles original_title={original_title} mediaType={mediaType} mediaId={mediaId} />
        <Credits mediaId={mediaId} mediaType={mediaType} view="creator" />
        <ContentCategoryDetail genres={genres} mediaType={mediaType} mediaId={mediaId} />
        <Box sx={{ width: '100%', display: { xs: 'flex', md: 'none' } }}>
          <MetaDetails
            tvdb_id={external_ids.tvdb_id}
            imdb_id={external_ids.imdb_id}
            number_of_episodes={number_of_episodes}
            title={title}
            origin_country={origin_country}
            release_date={release_date}
            last_air_date={last_air_date}
            networks={networks}
            runtime={runtime}
            mediaType={mediaType}
            mediaId={mediaId}
          />
        </Box>
      </Grid>
    </Grid>
  );
};

export default MainDetails;
