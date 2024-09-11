'use server';

import React from 'react';
import RecommendationDetails from '@/features/recommendations/components/ui/RecDetails';
import ReviewDetails from '@/features/reviews/components/ui/ReviewDetails';
import ReviewType from '@/features/reviews/types/enums/ReviewType';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import NotFound from '@/components/common/NotFound';
import TabsList from '@/components/common/Tablist';
import MediaDetailsProps from '@/types/common/MediaDetailsProps';
import MediaType from '@/types/enums/IMediaType';
import { formatStringDate } from '@/utils/formatters';
import Credits from '../../components/ui/content/Credits';
import MainDetails from '../../components/ui/content/MainDetails';
import ContentCards from '../../components/ui/content/MainTabCards';
import Photos from '../../components/ui/content/Photos';
import SidePanel from '../../components/ui/content/SidePanel';
import EpisodeGuide from '../../components/ui/tv/EpisodeGuide';
import { getContentDetails } from '../../service/tmdbAdvancedService';
import { Season } from '../../types/interfaces/Season';

interface ContentContainerProps extends MediaDetailsProps {
  sections?: string[];
  searchParams?: { [key: string]: string };
}

const getSeasonAndEpisode = (episode_section: string | undefined, seasons: Season[]) => {
  try {
    const [season_part, episode_part] = episode_section ? episode_section.split('-') : [];
    const season = season_part ? Number(season_part.replace('s', '')) : 0;
    const episode_number =
      season && episode_part == 'ep_finale' ? seasons[season].episode_count : Number(episode_part.replace('ep', ''));
    return { season, episode_number };
  } catch (error) {
    return { season: 0, episode_number: 0 };
  }
};
const ContentContainer: React.FC<ContentContainerProps> = async ({ mediaType, mediaId, sections, searchParams }) => {
  const tab = sections ? sections[0] : '';
  const { comments } = searchParams ?? {};
  const tabs = [
    { label: 'Details', href: '' },
    { label: 'Episode Guide', href: 'episode-guide' },
    { label: 'Cast & Crew', href: 'credits' },
    { label: 'Reviews', href: 'reviews' },
    { label: 'Recommendations', href: 'recommendations' },
    { label: 'Photos', href: 'photos' }
  ].filter((link) => link.href !== 'episodes' || mediaType === MediaType.tv);

  if (tab !== '' && !tabs.find((link) => link.href === tab)) return <NotFound type={mediaType} />;

  const details = await getContentDetails(mediaType, mediaId, true);
  const anyDetails = details as any;
  if (!details) return <NotFound type={mediaType} />;

  const cardStyle = {
    backgroundColor: 'background.paper',
    borderRadius: 2,
    overflow: 'hidden'
  };
  const title = mediaType === MediaType.movie ? anyDetails.title : anyDetails.name;
  const year = mediaType === MediaType.movie ? anyDetails.release_date : anyDetails.first_air_date;
  const formattedYear = year ? formatStringDate(year).getFullYear() : 'TBA';

  const episode_section =
    MediaType.tv && tab === 'episode-guide' && sections?.length && sections.length > 1 ? sections[1] : undefined;
  const { season, episode_number } = episode_section
    ? getSeasonAndEpisode(episode_section, anyDetails?.seasons ?? [])
    : { season: 0, episode_number: 0 };
  const TabPanel = {
    'episode-guide': (
      <EpisodeGuide
        id={mediaId}
        name={anyDetails.name}
        number_of_season={anyDetails.number_of_seasons ?? 0}
        season_number={season}
        episode_number={episode_number}
      />
    ),
    credits: <Credits mediaId={mediaId} mediaType={mediaType} view="all" />,
    reviews: (
      <ReviewDetails
        mediaType={mediaType}
        mediaId={details.id}
        reviewType={ReviewType.OVERALL}
        section={
          sections?.length && sections.length > 1 && ['new', 'edit'].includes(sections[1])
            ? (sections[1] as 'edit' | 'new')
            : 'all'
        }
        totalEpisodes={mediaType === MediaType.tv ? anyDetails.number_of_episodes : 0}
      />
    ),
    recommendations: (
      <RecommendationDetails
        mediaId={mediaId}
        mediaType={mediaType}
        section={sections?.length && sections.length > 1 ? sections[1] : undefined}
      />
    ),
    photos: <Photos mediaId={mediaId} mediaType={mediaType} view="all" />
  }[tab] || (
    <MainDetails
      mediaId={mediaId}
      mediaType={mediaType}
      title={title}
      watchStatus={details.watchStatus}
      recordId={details.recordId}
      poster_path={details.poster_path}
      release_date={mediaType === MediaType.movie ? anyDetails.release_date : anyDetails.first_air_date}
      number_of_episodes={anyDetails?.number_of_episodes}
      lastEpisodeType={anyDetails?.last_episode_to_air?.episode_type}
      genres={details.genres}
      external_ids={details.external_ids}
      origin_country={details.origin_country}
      last_air_date={anyDetails?.last_air_date}
      networks={details?.production_companies ?? []}
      runtime={mediaType === MediaType.movie ? anyDetails.runtime : anyDetails.episode_run_time}
      overview={details.overview}
      vote_average={details.vote_average}
      vote_count={details.vote_count}
      recordRating={details.recordRating}
      original_title={mediaType === MediaType.movie ? anyDetails.original_title : anyDetails.original_name}
    />
  );

  return (
    <Grid container spacing={0} sx={{ padding: { xs: 0, md: 0 }, margin: 0 }}>
      <Grid
        item
        xs={12}
        md={8.5}
        sx={{
          paddingX: 0,
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          justifyContent: 'left',
          alignItems: 'flex-start'
        }}
      >
        <Box sx={{ width: '100%', padding: 0, margin: 0, paddingTop: 2, paddingBottom: 2, ...cardStyle }}>
          <Typography fontSize={24} fontWeight={700} color="primary" paddingLeft={2}>
            {`${title} (${formattedYear})`}
          </Typography>
          <TabsList tabs={tabs} activeTab={tab} baseUrl={`${mediaType}/${mediaId}`} />
          <Box
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: 0,
              paddingY: 2
            }}
          >
            {TabPanel}
          </Box>
        </Box>
        {!tab && (
          <ContentCards
            title={title}
            external_ids={details.external_ids}
            number_of_episodes={anyDetails?.number_of_episodes ?? 0}
            next_episode_to_air={anyDetails?.next_episode_to_air}
            mediaType={mediaType}
            mediaId={mediaId}
            cardStyle={cardStyle}
            commentPage={comments}
          />
        )}
        {tab === 'episode-guide' && season && episode_number && (
          <Box sx={{ width: '100%', padding: 0, margin: 0, paddingTop: 2, paddingBottom: 2, ...cardStyle }}>
            <ReviewDetails
              mediaType={mediaType}
              mediaId={mediaId}
              reviewType={ReviewType.EPISODE}
              seasonNumber={season}
              episodeNumber={episode_number}
              section={
                sections?.length && sections.length > 2 && ['new', 'edit']?.includes(sections[2])
                  ? (sections[2] as 'new' | 'edit')
                  : 'all'
              }
            />
          </Box>
        )}
      </Grid>
      <Grid item xs={0} md={3.5} sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center', paddingLeft: 4 }}>
        <SidePanel
          details={details}
          mediaId={mediaId}
          mediaType={mediaType}
          cardStyle={cardStyle}
          notDetails={Boolean(sections)}
        />
      </Grid>
    </Grid>
  );
};

export default ContentContainer;
