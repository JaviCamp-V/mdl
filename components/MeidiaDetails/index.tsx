import React from 'react';
import { Tab } from '@mui/material';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import MediaType from '@/types/tmdb/IMediaType';
import MovieDetails from '@/types/tmdb/IMovieDetails';
import TVDetails from '@/types/tmdb/ITVDetails';
import { getTitle, getYear } from '@/utils/tmdbUtils';
import LinkTab from '../common/NavTab';
import Credits from './Credits';
import DetailsTabPanel from './Details';
import NextEpisode from './Details/NextEpisode';
import WhereToWatch from './Details/WhereToWatch';
import EpisodeGuide from './EpisodeGuide';
import Photos from './Photos';

type GeneralMovieDetailsProps = {
  details: MovieDetails;
  containerStyle?: any;
  type: MediaType.movie;
  tab: string;
};
type GeneralTVDetailsProps = {
  details: TVDetails;
  containerStyle?: any;
  type: MediaType.tv;
  tab?: string;
};

type GeneralDetailsProps = GeneralMovieDetailsProps | GeneralTVDetailsProps;
const GeneralDetails: React.FC<GeneralDetailsProps> = ({ containerStyle, details, type, tab = '' }) => {
  const links = [
    { label: 'Details', href: '' },
    { label: 'Episode Guide', href: 'episodes' },
    { label: 'Cast & Crew', href: 'credits' },
    { label: 'Reviews', href: 'reviews' },
    { label: 'Recommendations', href: 'recommendations' },
    { label: 'Photos', href: 'photos' }
  ].filter((link) => link.href !== 'episodes' || type === MediaType.tv);

  const TabPanel = {
    episodes: <EpisodeGuide id={details.id} season_number={1} name={(details as TVDetails).name} />,
    credits: <Credits id={details.id} mediaType={type} view="all" />,
    reviews: <Box />,
    recommendations: <Box />,
    photos: <Photos id={details.id} mediaType={type} view="all" />
  }[tab] || (
    <DetailsTabPanel
      id={details.id}
      mediaType={type}
      details={details}
    />
  );
  const title = getTitle({ ...details, media_type: type } as any);
  const year = getYear({ ...details, media_type: type } as any);
  const getLink = (link: string) => {
    const baseUri = `/${type}/${details.id}`;
    return link ? `${baseUri}?tab=${link}` : baseUri;
  };
  return (
    <React.Fragment>
      <Box sx={{ ...containerStyle }}>
        <Box sx={{ width: '100%', paddingY: 2 }}>
          <Typography fontSize={24} fontWeight={700} color="primary" paddingLeft={2}>
            {`${title} (${year})`}
          </Typography>
          <Tabs
            value={links.findIndex((link) => link.href === tab)}
            sx={{ width: '100%', display: 'flex' }}
            TabIndicatorProps={{
              sx: {
                display: 'none'
              }
            }}
          >
            {links.map((link) => (
              <LinkTab
                key={link.label}
                label={link.label}
                href={getLink(link.href)}
                selected={link.href === tab}
                sx={{
                  textDecoration: 'none',
                  color: 'text.primary',
                  textTransform: 'capitalize',
                  fontSize: 15,
                  fontWeight: link.href === tab ? 700 : 400,
                  borderBottom: link.href === tab ? '1px solid #1675b6' : '1px solid #3e4042'
                }}
              />
            ))}
            <Tab disabled sx={{ flexGrow: 1, borderBottom: '1px solid #3e4042' }} />
            <Tab disabled sx={{ flexGrow: 1, borderBottom: '1px solid #3e4042' }} />
          </Tabs>
        </Box>
        <Box
          sx={{
            width: '100%',
            height: '100%',
            paddingLeft: 2,
            paddingBottom: 2
          }}
        >
          {TabPanel}
        </Box>
      </Box>
      {!tab && (
        <React.Fragment>
          {type === MediaType.tv && (
            <NextEpisode
              tvdb_id={details?.external_ids?.tvdb_id}
              imdb_id={details?.external_ids?.imdb_id}
              number_of_episodes={details.number_of_episodes}
              containerStyle={{ ...containerStyle, minHeight: 0 }}
              next_episode_to_air={details.next_episode_to_air}
            />
          )}
          <WhereToWatch
            id={details.id}
            mediaType={type}
            containerStyle={containerStyle}
            title={type === MediaType.movie ? details.title : details.name}
          />
          <Box sx={{ ...containerStyle, paddingX: 0, minHeight: 0 }}>
            <Credits id={details.id} mediaType={type} view="overview" />
          </Box>
          <Box sx={{ ...containerStyle, minHeight: 0 }}>
            <Photos id={details.id} mediaType={type} view="overview" />
          </Box>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default GeneralDetails;
